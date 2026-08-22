from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    preferred_language = Column(String(10), default="en", nullable=False)
    proficiency_level = Column(String(20), default="beginner", nullable=False)
    goals = Column(Text, default="", nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Curriculum(Base):
    __tablename__ = "curricula"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, default="", nullable=False)
    language = Column(String(10), nullable=False, index=True)
    level = Column(String(20), nullable=False, index=True)
    is_published = Column(Boolean, default=True, nullable=False)

    content_items = relationship("ContentItem", back_populates="curriculum", cascade="all, delete-orphan")


class ContentItem(Base):
    __tablename__ = "content_items"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curricula.id"), nullable=False)
    title = Column(String(150), nullable=False)
    body = Column(Text, nullable=False)
    language = Column(String(10), nullable=False, index=True)
    skill = Column(String(30), nullable=False, index=True)
    sequence = Column(Integer, default=1, nullable=False)

    curriculum = relationship("Curriculum", back_populates="content_items")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, default="", nullable=False)
    language = Column(String(10), nullable=False, index=True)
    skill = Column(String(30), nullable=False, index=True)
    benchmark_level = Column(String(20), nullable=False)

    questions = relationship("AssessmentQuestion", back_populates="assessment", cascade="all, delete-orphan")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    prompt = Column(Text, nullable=False)
    question_type = Column(String(30), nullable=False)
    options = Column(JSON, default=list, nullable=False)
    answer = Column(Text, nullable=False)
    points = Column(Integer, default=1, nullable=False)

    assessment = relationship("Assessment", back_populates="questions")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    score = Column(Integer, nullable=False)
    max_score = Column(Integer, nullable=False)
    benchmark_level = Column(String(20), nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
