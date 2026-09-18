import logging
from datetime import date, datetime, timedelta
from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from gtts import gTTS
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.learning import (
    Assessment, AssessmentAnswer, AssessmentAttempt, Language, LearnerProfile,
    LearnerProgress, LearnerStats, Lesson, LessonCompletion, Level, Module, Question,
)
from app.models.user import User
from app.schemas.learning import (
    AssessmentResponse, AssessmentResult, AssessmentSubmission, LanguageResponse,
    LevelResponse, LessonResponse, ModuleResponse, ProfileResponse, ProfileUpdate,
    ProgressResponse,
    LearningStateResponse, LessonProgressRequest, DashboardBootstrapResponse, LanguageUpdate,
)
from app.utils.assessment_generator import ensure_generated_questions

router = APIRouter()
logger = logging.getLogger(__name__)
BENCHMARKS = ((0, "Beginner"), (40, "Elementary"), (60, "Intermediate"), (75, "Upper Intermediate"), (90, "Advanced"))


@router.get("/speech")
def generate_speech(
    text: str = Query(min_length=1, max_length=160),
    language: str = Query(pattern="^(en|hi|kn|ta|te)$"),
    current_user: User = Depends(get_current_user),
):
    try:
        audio = BytesIO()
        gTTS(text=text, lang=language, slow=False).write_to_fp(audio)
        audio.seek(0)
        return StreamingResponse(audio, media_type="audio/mpeg", headers={"Cache-Control": "public, max-age=86400"})
    except Exception as error:
        raise HTTPException(status_code=502, detail="Speech service is temporarily unavailable") from error


def benchmark(score: float) -> str:
    return next(name for minimum, name in reversed(BENCHMARKS) if score >= minimum)


def full_module_query(db: Session):
    return db.query(Module).options(
        selectinload(Module.lessons).selectinload(Lesson.activities),
        selectinload(Module.lessons).selectinload(Lesson.contents),
    )


@router.get("/languages", response_model=list[LanguageResponse])
def list_languages(db: Session = Depends(get_db)):
    return db.query(Language).filter(Language.is_active.is_(True)).order_by(Language.name).all()


@router.get("/levels", response_model=list[LevelResponse])
def list_levels(db: Session = Depends(get_db)):
    return db.query(Level).order_by(Level.minimum_score).all()


@router.get("/dashboard/bootstrap", response_model=DashboardBootstrapResponse)
def dashboard_bootstrap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.profile
    course_language = db.query(Language).filter(Language.code == (profile.learning_language if profile else "en")).first()
    return {
        "languages": list_languages(db=db),
        "levels": list_levels(db=db),
        "profile": get_profile(current_user, db),
        "progress": get_progress(current_user, db),
        "assessments": list_assessments(db=db, language_id=course_language.id if course_language else None),
        "learning_state": get_learning_state(current_user, db),
    }


@router.get("/curriculum", response_model=list[ModuleResponse])
def list_curriculum(language_id: int | None = None, level_id: int | None = None, db: Session = Depends(get_db)):
    query = full_module_query(db)
    if language_id:
        query = query.filter(Module.language_id == language_id)
    if level_id:
        query = query.filter(Module.level_id == level_id)
    return query.order_by(Module.order_number).all()


@router.get("/curriculum/{language_id}/{level_id}", response_model=list[ModuleResponse])
def curriculum_by_level(language_id: int, level_id: int, db: Session = Depends(get_db)):
    return full_module_query(db).filter(Module.language_id == language_id, Module.level_id == level_id).order_by(Module.order_number).all()


@router.get("/modules/{module_id}", response_model=ModuleResponse)
def get_module(module_id: int, db: Session = Depends(get_db)):
    module = full_module_query(db).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(404, "Module not found")
    return module


@router.get("/lessons/{lesson_id}", response_model=LessonResponse)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).options(selectinload(Lesson.activities), selectinload(Lesson.contents)).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    return lesson


@router.get("/content", response_model=list)
def list_content(lesson_id: int | None = None, language_id: int | None = None, db: Session = Depends(get_db)):
    from app.models.learning import Content
    query = db.query(Content).options(selectinload(Content.translations))
    if lesson_id:
        query = query.filter(Content.lesson_id == lesson_id)
    if language_id:
        query = query.filter(Content.language_id == language_id)
    return query.order_by(Content.id).all()


@router.get("/assessments", response_model=list[AssessmentResponse])
def list_assessments(assessment_type: str | None = None, language_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Assessment).options(selectinload(Assessment.questions).selectinload(Question.options))
    if assessment_type:
        query = query.filter(Assessment.assessment_type == assessment_type)
    if language_id:
        query = query.filter(Assessment.language_id == language_id)
    assessments = query.order_by(Assessment.id).all()
    if any(ensure_generated_questions(assessment) for assessment in assessments):
        db.commit()
    return assessments


@router.get("/assessments/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).options(selectinload(Assessment.questions).selectinload(Question.options)).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(404, "Assessment not found")
    if ensure_generated_questions(assessment):
        db.commit()
    return assessment


@router.post("/assessments/{assessment_id}/submit", response_model=AssessmentResult, status_code=status.HTTP_201_CREATED)
def submit_assessment(assessment_id: int, payload: AssessmentSubmission, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assessment = get_assessment(assessment_id, db)
    score = 0
    attempt = AssessmentAttempt(user_id=current_user.id, assessment_id=assessment.id, started_at=payload.started_at or datetime.utcnow())
    db.add(attempt)
    db.flush()
    normalized_answers = {
        str(question_id): value if isinstance(value, str) else str(value)
        for question_id, value in (payload.answers or {}).items()
    }
    for question in assessment.questions:
        answer_value = normalized_answers.get(str(question.id), "")
        answer = str(answer_value).strip()
        correct = str(question.correct_answer or "").strip()
        marks = question.marks if answer.casefold() == correct.casefold() else 0
        score += marks
        attempt.answers.append(AssessmentAnswer(question_id=question.id, answer_text=answer, marks_obtained=marks))
    percentage = round(score / assessment.total_marks * 100, 2) if assessment.total_marks else 0
    attempt.score, attempt.percentage, attempt.completed_at = score, percentage, datetime.utcnow()
    db.add(LearnerProgress(user_id=current_user.id, skill=assessment.assessment_type, score=percentage, proficiency_level=benchmark(percentage), assessment_id=assessment.id))
    stats = get_or_create_stats(current_user, db)
    today = date.today()
    reset_daily_stats(stats, today)
    xp_earned = max(0, min(20, round(percentage / 10)))
    stats.xp += xp_earned
    stats.daily_xp += xp_earned
    stats.gems += 1 if stats.xp // 50 > (stats.xp - xp_earned) // 50 else 0
    if xp_earned:
        record_activity(stats, today)
    db.commit()
    db.refresh(attempt)
    return {"attempt_id": attempt.id, "score": score, "total_marks": assessment.total_marks, "percentage": percentage, "proficiency_level": benchmark(percentage), "xp_earned": xp_earned}


@router.get("/users/me", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.profile
    if profile is None:
        profile = LearnerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "age": profile.age,
        "native_language": profile.native_language,
        "learning_language": profile.learning_language,
        "gender": profile.gender,
        "current_level_id": profile.current_level_id,
        "updated_at": profile.updated_at,
    }


@router.put("/users/me", response_model=ProfileResponse)
def update_profile(payload: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.profile or LearnerProfile(user_id=current_user.id)
    current_user.first_name, current_user.last_name = payload.first_name.strip(), payload.last_name.strip()
    for field, value in payload.model_dump().items():
        if field not in {"first_name", "last_name"}:
            setattr(profile, field, value)
    db.add(profile)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        logger.exception("Profile update constraint failed for user %s", current_user.id)
        raise HTTPException(status_code=400, detail="The selected profile values are not valid.") from error
    except SQLAlchemyError as error:
        db.rollback()
        logger.exception("Profile update database error for user %s", current_user.id)
        raise HTTPException(status_code=503, detail="Profile service is temporarily unavailable. Please try again.") from error
    db.refresh(profile)
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "age": profile.age,
        "native_language": profile.native_language,
        "learning_language": profile.learning_language,
        "gender": profile.gender,
        "current_level_id": profile.current_level_id,
        "updated_at": profile.updated_at,
    }


@router.patch("/users/me/language", response_model=ProfileResponse)
def update_learning_language(payload: LanguageUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.profile or LearnerProfile(user_id=current_user.id)
    profile.learning_language = payload.learning_language
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "age": profile.age,
        "native_language": profile.native_language,
        "learning_language": profile.learning_language,
        "gender": profile.gender,
        "current_level_id": profile.current_level_id,
        "updated_at": profile.updated_at,
    }


@router.get("/progress/me", response_model=ProgressResponse)
def get_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    values = {}
    latest_by_skill = {}
    skills = ("reading", "writing", "comprehension")
    progress_rows = db.query(LearnerProgress).filter(
        LearnerProgress.user_id == current_user.id,
        LearnerProgress.skill.in_(skills),
    ).order_by(LearnerProgress.updated_at.desc()).all()
    for progress in progress_rows:
        latest_by_skill.setdefault(progress.skill, progress)

    for skill in skills:
        latest = latest_by_skill.get(skill)
        values[skill] = {"score": latest.score if latest else 0, "level": latest.proficiency_level if latest else "Beginner"}
    overall_score = round(sum(item["score"] for item in values.values()) / 3, 2)
    values["overall"] = {"score": overall_score, "level": benchmark(overall_score)}
    return values


def get_or_create_stats(current_user: User, db: Session) -> LearnerStats:
    stats = db.query(LearnerStats).filter(LearnerStats.user_id == current_user.id).first()
    if stats:
        return stats
    stats = LearnerStats(user_id=current_user.id)
    db.add(stats)
    db.flush()
    return stats


def reset_daily_stats(stats: LearnerStats, today: date) -> bool:
    if stats.daily_date != today:
        stats.daily_date = today
        stats.daily_xp = 0
        stats.daily_lessons = 0
        return True
    return False


def record_activity(stats: LearnerStats, today: date) -> None:
    if stats.last_activity_date == today:
        return
    if stats.last_activity_date == today - timedelta(days=1):
        stats.streak_days += 1
    else:
        stats.streak_days = 1
    stats.last_activity_date = today


@router.get("/learning-state/me", response_model=LearningStateResponse)
def get_learning_state(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    stats = db.query(LearnerStats).filter(LearnerStats.user_id == current_user.id).first()
    stats_created = stats is None
    if stats_created:
        stats = LearnerStats(user_id=current_user.id)
        db.add(stats)
        db.flush()
    stats_changed = reset_daily_stats(stats, today)
    if stats.last_activity_date and stats.last_activity_date < today - timedelta(days=1) and stats.streak_days:
        stats.streak_days = 0
        stats_changed = True
    if stats_created or stats_changed:
        db.commit()
    completions = db.query(LessonCompletion).filter(LessonCompletion.user_id == current_user.id).order_by(LessonCompletion.completed_at).all()
    return {
        "xp": stats.xp,
        "gems": stats.gems,
        "hearts": stats.hearts,
        "streak_days": stats.streak_days,
        "daily_xp": stats.daily_xp,
        "daily_lessons": stats.daily_lessons,
        "completions": completions,
    }


@router.get("/leaderboard")
def get_leaderboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    learning_language = current_user.profile.learning_language if current_user.profile else "en"
    rows = db.query(User, LearnerProfile, LearnerStats).outerjoin(
        LearnerProfile, LearnerProfile.user_id == User.id,
    ).outerjoin(
        LearnerStats, LearnerStats.user_id == User.id,
    ).filter(
        LearnerProfile.learning_language == learning_language,
    ).order_by(
        func.coalesce(LearnerStats.xp, 0).desc(),
        func.coalesce(LearnerStats.streak_days, 0).desc(),
        User.first_name.asc(),
    ).limit(20).all()

    return [
        {
            "id": user.id,
            "name": f"{user.first_name} {user.last_name}".strip(),
            "xp": stats.xp if stats else 0,
            "streak": stats.streak_days if stats else 0,
            "current": user.id == current_user.id,
        }
        for user, _, stats in rows
    ]


@router.post("/lesson-progress", response_model=LearningStateResponse, status_code=status.HTTP_201_CREATED)
def complete_lesson(payload: LessonProgressRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    language_code = payload.language_code.strip().lower()
    if current_user.profile and current_user.profile.learning_language != language_code:
        raise HTTPException(status_code=400, detail="Lesson language does not match your active course")
    if payload.score == 0:
        raise HTTPException(status_code=400, detail="Answer at least one question correctly to complete this lesson")

    previous_step = payload.lesson_step - 1
    if previous_step >= 0:
        previous = db.query(LessonCompletion).filter_by(
            user_id=current_user.id, language_code=language_code,
            unit_number=payload.unit_number, lesson_step=previous_step,
        ).first()
        if not previous:
            raise HTTPException(status_code=409, detail="Complete the previous lesson first")
    elif payload.unit_number > 1:
        previous_unit = db.query(LessonCompletion).filter_by(
            user_id=current_user.id, language_code=language_code,
            unit_number=payload.unit_number - 1,
        ).count()
        if previous_unit < 3:
            raise HTTPException(status_code=409, detail="Complete the previous unit first")

    completion = db.query(LessonCompletion).filter_by(
        user_id=current_user.id, language_code=language_code,
        unit_number=payload.unit_number, lesson_step=payload.lesson_step,
    ).first()
    stats = get_or_create_stats(current_user, db)
    today = date.today()
    reset_daily_stats(stats, today)
    if completion is None:
        xp_earned = payload.score * 10
        completion = LessonCompletion(
            user_id=current_user.id, language_code=language_code,
            unit_number=payload.unit_number, lesson_step=payload.lesson_step,
            score=payload.score, xp_earned=xp_earned,
        )
        db.add(completion)
        stats.xp += xp_earned
        stats.gems += 1 if stats.xp // 50 > (stats.xp - xp_earned) // 50 else 0
        stats.daily_xp += xp_earned
        stats.daily_lessons += 1
        record_activity(stats, today)
    else:
        completion.score = max(completion.score, payload.score)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        existing_completion = db.query(LessonCompletion).filter_by(
            user_id=current_user.id, language_code=language_code,
            unit_number=payload.unit_number, lesson_step=payload.lesson_step,
        ).first()
        if existing_completion is None:
            raise
    return get_learning_state(current_user, db)
