from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.learning import (
    Assessment,
    AssessmentAttempt,
    ContentItem,
    Curriculum,
    LearnerProfile,
)
from app.models.user import User
from app.schemas.learning import (
    AssessmentResponse,
    AssessmentResult,
    AssessmentSubmission,
    CurriculumResponse,
    LearnerDashboardResponse,
    LearnerProfileResponse,
    LearnerProfileUpdate,
)

router = APIRouter()


def get_or_create_profile(user: User, db: Session) -> LearnerProfile:
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()
    if profile is None:
        profile = LearnerProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.get("/curricula", response_model=list[CurriculumResponse])
def list_curricula(
    language: str | None = None,
    level: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Curriculum).options(joinedload(Curriculum.content_items)).filter(Curriculum.is_published.is_(True))
    if language:
        query = query.filter(Curriculum.language == language)
    if level:
        query = query.filter(Curriculum.level == level)
    return query.order_by(Curriculum.id).all()


@router.get("/assessments", response_model=list[AssessmentResponse])
def list_assessments(
    language: str | None = None,
    skill: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Assessment).options(joinedload(Assessment.questions))
    if language:
        query = query.filter(Assessment.language == language)
    if skill:
        query = query.filter(Assessment.skill == skill)
    return query.order_by(Assessment.id).all()


@router.get("/profile", response_model=LearnerProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_or_create_profile(current_user, db)


@router.put("/profile", response_model=LearnerProfileResponse)
def update_profile(
    payload: LearnerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = get_or_create_profile(current_user, db)
    profile.preferred_language = payload.preferred_language.lower()
    profile.proficiency_level = payload.proficiency_level.lower()
    profile.goals = payload.goals.strip()
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/dashboard", response_model=LearnerDashboardResponse)
def get_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(current_user, db)
    attempts = db.query(AssessmentAttempt).filter(AssessmentAttempt.user_id == current_user.id).order_by(AssessmentAttempt.submitted_at.desc()).all()
    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "level": current_user.level,
        "xp": current_user.xp,
        "streak": current_user.streak,
        "profile": profile,
        "attempts": [
            {
                "attempt_id": attempt.id,
                "score": attempt.score,
                "max_score": attempt.max_score,
                "percentage": round(attempt.score / attempt.max_score * 100, 2),
                "benchmark_level": attempt.benchmark_level,
                "passed": attempt.score / attempt.max_score >= 0.7,
                "xp_awarded": 0,
            }
            for attempt in attempts
        ],
    }


@router.post("/assessments/{assessment_id}/attempts", response_model=AssessmentResult, status_code=status.HTTP_201_CREATED)
def submit_assessment(
    assessment_id: int,
    payload: AssessmentSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    assessment = db.query(Assessment).options(joinedload(Assessment.questions)).filter(Assessment.id == assessment_id).first()
    if assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")

    max_score = sum(question.points for question in assessment.questions)
    score = sum(
        question.points
        for question in assessment.questions
        if str(payload.answers.get(question.id, "")).strip().casefold() == question.answer.strip().casefold()
    )
    percentage = round(score / max_score * 100, 2) if max_score else 0
    passed = percentage >= 70
    xp_awarded = score * 10
    attempt = AssessmentAttempt(
        user_id=current_user.id,
        assessment_id=assessment.id,
        score=score,
        max_score=max_score,
        benchmark_level=assessment.benchmark_level if passed else "developing",
    )
    current_user.xp += xp_awarded
    current_user.level = max(current_user.level, 1 + current_user.xp // 100)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return {
        "attempt_id": attempt.id,
        "score": score,
        "max_score": max_score,
        "percentage": percentage,
        "benchmark_level": attempt.benchmark_level,
        "passed": passed,
        "xp_awarded": xp_awarded,
    }
