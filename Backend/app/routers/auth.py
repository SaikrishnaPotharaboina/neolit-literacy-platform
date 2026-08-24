from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.learning import LearnerProfile
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse
from app.utils.security import create_access_token, get_password_hash, verify_password

router = APIRouter()


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

    first_name, last_name = payload.names()
    user = User(
        first_name=first_name,
        last_name=last_name,
        email=payload.email.lower(),
        password_hash=get_password_hash(payload.password),
    )
    profile = LearnerProfile(
        age=payload.age,
        native_language=payload.native_language.strip(),
        learning_language=payload.learning_language,
        education_level=payload.education_level.strip(),
        current_level_id=payload.current_level_id,
    )

    db.add(user)
    try:
        db.commit()
        db.refresh(user)
        profile.user_id = user.id
        db.add(profile)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Could not create user")

    return {
        "message": "User registered successfully",
        "user": UserResponse.model_validate(user),
    }


@router.post("/login", response_model=dict)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id)
    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user),
    }


@router.post("/logout")
def logout_user():
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
