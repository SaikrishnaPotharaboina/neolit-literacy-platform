from pydantic import BaseModel, ConfigDict


class GameQuestion(BaseModel):
    model_config = ConfigDict(extra='allow')

    id: str
    prompt: str
    answers: list[str]
    correct: str | list[str]
    clues: list[str] | None = None


class GameBankItem(BaseModel):
    model_config = ConfigDict(extra='allow')

    id: str
    icon: str
    title: str
    description: str
    type: str
    questions: list[GameQuestion] = []


class GameRoundResponse(BaseModel):
    model_config = ConfigDict(extra='allow')

    game_id: str
    language_code: str
    size: int
    questions: list[GameQuestion]
