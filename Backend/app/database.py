from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_schema():
    columns = {column["name"] for column in inspect(engine).get_columns("learner_profiles")}
    if "gender" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE learner_profiles ADD COLUMN gender VARCHAR(40) NOT NULL DEFAULT ''"))
