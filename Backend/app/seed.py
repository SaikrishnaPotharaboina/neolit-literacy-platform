from sqlalchemy.orm import Session

from app.models.learning import Assessment, AssessmentQuestion, ContentItem, Curriculum


def seed_learning_content(db: Session) -> None:
    if db.query(Curriculum).first() or db.query(Assessment).first():
        return

    english = Curriculum(
        title="Foundations of Reading",
        description="Build vocabulary, sentence fluency, and reading confidence.",
        language="en",
        level="beginner",
        content_items=[
            ContentItem(title="Everyday words", body="Read: book, home, friend, learn.", language="en", skill="reading", sequence=1),
            ContentItem(title="Clear sentences", body="A complete sentence shares one clear idea.", language="en", skill="writing", sequence=2),
        ],
    )
    spanish = Curriculum(
        title="Fundamentos de lectura",
        description="Practica vocabulario y comprensión con textos breves.",
        language="es",
        level="beginner",
        content_items=[
            ContentItem(title="Palabras cotidianas", body="Lee: libro, casa, amigo, aprender.", language="es", skill="reading", sequence=1),
            ContentItem(title="Frases claras", body="Una frase completa comunica una idea clara.", language="es", skill="writing", sequence=2),
        ],
    )
    db.add_all([english, spanish])
    db.add_all([
        Assessment(
            title="Reading Foundations",
            description="Identify the meaning of a short sentence.",
            language="en",
            skill="reading",
            benchmark_level="beginner",
            questions=[
                AssessmentQuestion(prompt="What does 'book' describe?", question_type="short_text", options=["A text to read", "A house"], answer="A text to read"),
                AssessmentQuestion(prompt="Choose the word related to learning.", question_type="choice", options=["learn", "home"], answer="learn"),
            ],
        ),
        Assessment(
            title="Writing Foundations",
            description="Recognize a complete and clear sentence.",
            language="en",
            skill="writing",
            benchmark_level="beginner",
            questions=[
                AssessmentQuestion(prompt="Complete: I ___ every day.", question_type="short_text", options=["learn", "book"], answer="learn"),
                AssessmentQuestion(prompt="What should a sentence communicate?", question_type="short_text", options=[], answer="one clear idea"),
            ],
        ),
        Assessment(
            title="Comprensión inicial",
            description="Comprueba la comprensión de palabras básicas.",
            language="es",
            skill="comprehension",
            benchmark_level="beginner",
            questions=[
                AssessmentQuestion(prompt="¿Qué significa 'libro'?", question_type="choice", options=["Texto para leer", "Una casa"], answer="Texto para leer"),
                AssessmentQuestion(prompt="Elige la palabra relacionada con aprender.", question_type="choice", options=["aprender", "casa"], answer="aprender"),
            ],
        ),
    ])
    db.commit()
