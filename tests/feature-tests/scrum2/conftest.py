"""
SCRUM-2 conftest — Login screen fixtures.

Provides:
    mobile_web_page        — Playwright LoginFormComponent (web)
    mobile_driver          — Appium driver for native tests
    logged_in_mobile_user  — Pre-authenticated Playwright page

Assumptions:
    - BASE_URL env var (or config.base_url) points to the running app.
    - Valid credentials are stored in test_data/users.json under "valid_user".
    - The parent conftest.py (feature-tests/conftest.py) is loaded first
      and provides: config, playwright_session, appium_driver fixtures.
"""
from __future__ import annotations

import os
from typing import Generator

import pytest

from pages.web.components.login_form_component import LoginFormComponent
from utils.data_loader import load_json


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _base_url() -> str:
    """Resolve the application base URL from env or fallback."""
    return os.getenv("BASE_URL", "http://localhost:3000")


# ---------------------------------------------------------------------------
# Mobile Web fixtures (Playwright)
# ---------------------------------------------------------------------------

@pytest.fixture(scope="function")
def mobile_web_page(playwright_session) -> LoginFormComponent:
    """
    Yield a LoginFormComponent backed by a fresh Playwright session.

    The login page is navigated to but NOT yet logged in — each test
    controls its own auth state.
    """
    component = LoginFormComponent(playwright_session.page, _base_url())
    component.open()
    return component


# ---------------------------------------------------------------------------
# Native mobile fixture (Appium)
# ---------------------------------------------------------------------------

@pytest.fixture(scope="function")
def mobile_driver(appium_driver):
    """
    Alias fixture — yields the Appium driver for native tests.

    Exists so native test files declare `mobile_driver` instead of
    the implementation detail `appium_driver`.
    """
    yield appium_driver


# ---------------------------------------------------------------------------
# Authenticated web fixture
# ---------------------------------------------------------------------------

@pytest.fixture(scope="function")
def logged_in_mobile_user(playwright_session) -> LoginFormComponent:
    """
    Yield a LoginFormComponent where the user is already logged in.

    Use this for tests that need an authenticated session as a precondition
    (e.g. AC-4 redirect, post-login navigation tests).
    """
    users = load_json("users.json")
    valid = users["valid_user"]

    component = LoginFormComponent(playwright_session.page, _base_url())
    component.open()
    component.login(valid["email"], valid["password"])
    component.wait_for_dashboard()
    return component
