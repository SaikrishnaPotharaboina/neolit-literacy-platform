from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_games_api_returns_language_game_bank():
    response = client.get('/api/games/hi')
    assert response.status_code == 200, response.text
    payload = response.json()
    assert isinstance(payload, list)
    assert any(game['id'] == 'word-builder' for game in payload)
    assert any(game['id'] == 'word-hunt' for game in payload)
    assert any(game['id'] == 'flip-card' for game in payload)
    assert any(game['id'] == 'archer' for game in payload)

    first_game = next(game for game in payload if game['id'] == 'word-builder')
    assert len(first_game['questions']) > 0
    assert first_game['questions'][0]['prompt']


def test_games_api_returns_fresh_round_without_repeats():
    response = client.get('/api/games/round/word-hunt', params={'language_code': 'hi', 'size': 5})
    assert response.status_code == 200, response.text
    payload = response.json()
    assert len(payload['questions']) == 5
    ids = [question['id'] for question in payload['questions']]
    assert len(set(ids)) == len(ids)
    assert all(question['prompt'] for question in payload['questions'])
