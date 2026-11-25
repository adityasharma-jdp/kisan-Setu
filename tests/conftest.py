"""
Global Pytest Configuration and Fixtures
Ensures test database tables and initial synthetic seed data are initialized
prior to running any test suites, both locally and in CI/CD environments.
"""

import pytest
from fastapi.testclient import TestClient
from backend.database import Base, engine
from backend.seed import seed_database
from backend.main import app

@pytest.fixture(scope="session", autouse=True)
def initialize_test_database():
    """Ensure database tables and initial fleet seed data are created for tests."""
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

@pytest.fixture(scope="module")
def client():
    """Provides an active TestClient with lifecycle context handling."""
    with TestClient(app) as test_client:
        yield test_client
