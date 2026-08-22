from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class LearnerProfileUpdate(BaseModel):
    preferred_language: str = Field(min_length=2, max_length=10)
    proficiency_level: str = Field(min_length=1, max_length=20)
    goals: str = Field(default="", max_length=1000)


class LearnerProfileResponse(LearnerProfileUpdate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    updated_at: datetime | None = None


class ContentItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    body: str
    language: str
    skill: str
    sequence: int


class CurriculumResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    language: str
    level: str
    is_published: bool
    content_items: list[ContentItemResponse] = []


class AssessmentQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    prompt: str
    question_type: str
    options: list[Any] = []
    points: int


class AssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    language: str
    skill: str
    benchmark_level: str
    questions: list[AssessmentQuestionResponse] = []


class AssessmentSubmission(BaseModel):
    answers: dict[int, str]


class AssessmentResult(BaseModel):
    attempt_id: int
    score: int
    max_score: int
    percentage: float
    benchmark_level: str
    passed: bool
    xp_awarded: int


class LearnerDashboardResponse(BaseModel):
    user_id: int
    name: str
    email: str
    level: int
    xp: int
    streak: int
    profile: LearnerProfileResponse
    attempts: list[AssessmentResult]
