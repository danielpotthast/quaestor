import pytest
from fastapi.testclient import TestClient

from source.backend.api.core import version as version_api
from source.backend.services.core import version_service


@pytest.mark.parametrize(
    argnames="current, latest_release, expected_body",
    argvalues=[
        (
            "0.1.0",
            ("0.1.9", "https://github.com/felixschndr/quaestor/releases/tag/0.1.9"),
            {
                "current": "0.1.0",
                "latest": "0.1.9",
                "update_available": True,
                "release_url": "https://github.com/felixschndr/quaestor/releases/tag/0.1.9",
            },
        ),
        (
            "0.1.11",
            ("0.1.9", "https://x/0.1.9"),
            {
                "current": "0.1.11",
                "latest": "0.1.9",
                "update_available": False,
                "release_url": "https://x/0.1.9",
            },
        ),
        (
            "0.1.11",
            None,
            {
                "current": "0.1.11",
                "latest": None,
                "update_available": False,
                "release_url": None,
            },
        ),
    ],
)
def test_version_endpoint(
    current: str,
    latest_release: tuple[str, str] | None,
    expected_body: dict,
    http_client: TestClient,
    monkeypatch: pytest.MonkeyPatch,
):
    monkeypatch.setattr(target=version_api, name="get_project_version", value=lambda: current)
    monkeypatch.setattr(target=version_service, name="get_latest_release", value=lambda: latest_release)

    response = http_client.get("/api/version")

    assert response.status_code == 200
    assert response.json() == expected_body
