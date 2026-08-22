from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_register_and_login_flow():
    response = client.post(
        "/auth/register",
        json={
            "name": "Alice",
            "email": "alice@example.com",
            "password": "StrongPass123!",
        },
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["user"]["email"] == "alice@example.com"
    assert "password" not in data["user"]

    login_response = client.post(
        "/auth/login",
        json={
            "email": "alice@example.com",
            "password": "StrongPass123!",
        },
    )
    assert login_response.status_code == 200, login_response.text
    token = login_response.json()["access_token"]
    assert token

    me_response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_response.status_code == 200, me_response.text
    assert me_response.json()["email"] == "alice@example.com"
