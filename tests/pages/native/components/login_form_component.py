"""
LoginFormComponent — Mobile Native (Appium).

Platform-aware component that wraps AndroidLoginPage or IOSLoginPage
with intent-level interaction and assertion helpers.

Covers SCRUM-2 AC-1, AC-2, AC-4, AC-5.
"""
from __future__ import annotations

from selenium.webdriver.remote.webdriver import WebDriver

from pages.android.login_page import AndroidLoginPage
from pages.ios.login_page import IOSLoginPage
from utils.logger import get_logger

logger = get_logger(__name__)


def _make_page(driver: WebDriver, platform: str):
    """Return the correct platform-specific page object."""
    if platform.lower() == "ios":
        return IOSLoginPage(driver)
    return AndroidLoginPage(driver)


class NativeLoginFormComponent:
    """
    Compound component for the native login screen.

    Instantiate with the Appium driver and platform string:
        component = NativeLoginFormComponent(driver, platform="android")
    """

    def __init__(self, driver: WebDriver, platform: str = "android") -> None:
        self._login = _make_page(driver, platform)
        self._platform = platform.lower()

    # ------------------------------------------------------------------ #
    # Interaction helpers
    # ------------------------------------------------------------------ #

    def fill_credentials(self, email: str, password: str) -> None:
        self._login.enter_email(email)
        self._login.enter_password(password)
        self._login.hide_keyboard()

    def submit(self) -> None:
        self._login.tap_login_button()

    def login(self, email: str, password: str) -> None:
        """Fill credentials and tap the login button."""
        self.fill_credentials(email, password)
        self.submit()

    def toggle_password_visibility(self) -> None:
        self._login.tap_show_hide_toggle()

    def tap_forgot_password(self) -> None:
        self._login.tap_forgot_password()

    def wait_for_dashboard(self, timeout: int = 15) -> None:
        self._login.wait_for_dashboard(timeout=timeout)

    # ------------------------------------------------------------------ #
    # Assertion helpers — AC-1 UI Rendering
    # ------------------------------------------------------------------ #

    def assert_all_ui_elements_visible(self) -> None:
        """AC-1: All required login screen elements must be visible."""
        assert self._login.is_email_field_visible(), \
            "AC-1 FAIL: Email/Username field not visible"
        assert self._login.is_password_field_visible(), \
            "AC-1 FAIL: Password field not visible"
        assert self._login.is_show_hide_toggle_visible(), \
            "AC-1 FAIL: Show/Hide toggle not visible"
        assert self._login.is_login_button_visible(), \
            "AC-1 FAIL: Login button not visible"
        assert self._login.is_forgot_password_visible(), \
            "AC-1 FAIL: 'Forgot password?' link not visible"

    # ------------------------------------------------------------------ #
    # Assertion helpers — AC-2 Input Validation
    # ------------------------------------------------------------------ #

    def assert_login_button_disabled(self) -> None:
        """AC-2: Login button must be disabled when inputs are invalid."""
        assert not self._login.is_login_button_enabled(), \
            "AC-2 FAIL: Login button should be disabled"

    def assert_login_button_enabled(self) -> None:
        assert self._login.is_login_button_enabled(), \
            "Login button should be enabled with valid input"

    def assert_validation_error_contains(self, text: str) -> None:
        """AC-2: Validation error must contain the expected text."""
        error = self._login.get_error_text()
        assert error, "AC-2 FAIL: No validation error is visible"
        assert text.lower() in error.lower(), (
            f"AC-2 FAIL: Expected '{text}' in validation error, got: '{error}'"
        )

    # ------------------------------------------------------------------ #
    # Assertion helpers — AC-4 Successful Login
    # ------------------------------------------------------------------ #

    def assert_on_dashboard(self) -> None:
        """AC-4: Dashboard screen must be visible after successful login."""
        assert self._login.is_on_dashboard(), \
            "AC-4 FAIL: Expected to reach Dashboard screen after successful login"

    # ------------------------------------------------------------------ #
    # Assertion helpers — AC-5 Failed Login
    # ------------------------------------------------------------------ #

    def assert_generic_error_shown(self) -> None:
        """
        AC-5: Generic 'Invalid email or password' message must appear.
        Must NOT single out a specific field.
        """
        error = self._login.get_error_text()
        assert error, "AC-5 FAIL: No error message displayed after failed login"
        assert "invalid email or password" in error.lower(), (
            f"AC-5 FAIL: Expected generic 'Invalid email or password', got: '{error}'"
        )

    def assert_still_on_login_screen(self) -> None:
        """AC-5: User must remain on login screen after a failed attempt."""
        assert not self._login.is_on_dashboard(), \
            "AC-5 FAIL: Should NOT navigate to Dashboard on failed login"
