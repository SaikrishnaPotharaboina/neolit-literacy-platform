from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings


DATABASE_URL = settings.DATABASE_URL.split("?")[0]

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={
        "ssl": {}
    },
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def ensure_schema():
    inspector = inspect(engine)

    if "learner_profiles" not in inspector.get_table_names():
        return

    columns = {
        column["name"]
        for column in inspector.get_columns("learner_profiles")
    }

    if "gender" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text("""
                    ALTER TABLE learner_profiles
                    ADD COLUMN gender VARCHAR(40) NOT NULL DEFAULT ''
                """)
            )
