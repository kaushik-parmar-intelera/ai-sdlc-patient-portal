"""
LoginFormComponent — Mobile Web (Playwright).

A compound helper that wraps LoginPage with intent-level methods
so test files contain zero raw locators or direct page calls.

Covers SCRUM-2 AC-1, AC-2, AC-4, AC-5.
"""
from __future__ import annotations

from playwright.sync_api import Page

from pages.web.login_page import LoginPage
from utils.logger import get_logger

logger = get_logger(__name__)


class LoginFormComponent:
    """
    Compound component for the login form.

    All assertions raise ``AssertionError`` with a descriptive message
    so failures are immediately readable in the test report.
    """

    def __init__(self, page: Page, base_url: str) -> None:
        self._page = LoginPage(page)
        self._base_url = base_url

    # ------------------------------------------------------------------ #
    # Setup
    # ------------------------------------------------------------------ #

    def open(self) -> None:
        """Navigate to the login page."""
        self._page.open(self._base_url)

    # ------------------------------------------------------------------ #
    # Interaction helpers
    # ------------------------------------------------------------------ #

    def fill_credentials(self, email: str, password: str) -> None:
        self._page.enter_email(email)
        self._page.enter_password(password)

    def submit(self) -> None:
        self._page.click_sign_in()

    def login(self, email: str, password: str) -> None:
        """Fill credentials and submit."""
        self.fill_credentials(email, password)
        self.submit()

    def toggle_password_visibility(self) -> None:
        self._page.click_show_hide_toggle()

    def tap_forgot_password(self) -> None:
        self._page.click_forgot_password()

    def blur_email(self) -> None:
        """Trigger blur-based validation on the email field."""
        self._page.blur_email_field()

    def wait_for_dashboard(self, timeout: int = 15_000) -> None:
        self._page.wait_for_dashboard(timeout=timeout)

    # ------------------------------------------------------------------ #
    # Assertion helpers — AC-1 UI Rendering
    # ------------------------------------------------------------------ #

    def assert_all_ui_elements_visible(self) -> None:
        """AC-1: All required login UI elements must be visible."""
        assert self._page.is_email_field_visible(), \
            "AC-1 FAIL: Email/Username field is not visible"
        assert self._page.is_password_field_visible(), \
            "AC-1 FAIL: Password field is not visible"
        assert self._page.is_show_hide_toggle_visible(), \
            "AC-1 FAIL: Show/Hide password toggle is not visible"
        assert self._page.is_sign_in_button_visible(), \
            "AC-1 FAIL: Sign In button is not visible"
        assert self._page.is_forgot_password_visible(), \
            "AC-1 FAIL: 'Forgot password?' link is not visible"

    # ------------------------------------------------------------------ #
    # Assertion helpers — AC-2 Input Validation
    # ------------------------------------------------------------------ #

    def assert_sign_in_disabled(self) -> None:
        """AC-2: Sign In button must be disabled when password is empty."""
        assert not self._page.is_sign_in_button_enabled(), \
            "AC-2 FAIL: Sign In button should be disabled with empty password"

    def assert_sign_in_enabled(self) -> None:
        assert self._page.is_sign_in_button_enabled(), \
            "Sign In button should be enabled"

    def assert_validation_error_contains(self, text: str) -> None:
        """AC-2: Inline validation error must contain the expected text."""
        error = self._page.get_validation_error_text()
        assert error, "AC-2 FAIL: No validation error is visible"
        assert text.lower() in error.lower(), (
            f"AC-2 FAIL: Expected '{text}' in validation error, got: '{error}'"
        )

    # ------------------------------------------------------------------ #
    # Assertion helpers — AC-1 Show/Hide toggle
    # ------------------------------------------------------------------ #

    def assert_password_is_masked(self) -> None:
        """Password input type must be 'password' (masked)."""
        actual = self._page.get_password_input_type()
        assert actual == "password", (
            f"AC-1 FAIL: Expected password to be masked (type=password), got type={actual}"
        )

    def assert_password_is_visible(self) -> None:
        """Password input type must be 'text' (revealed)."""
        actual = self._page.get_password_input_type()
        assert actual == "text", (
            f"AC-1 FAIL: Expected password to be visible (type=text), got type={actual}"
        )

    # ------------------------------------------------------------------ #
    # Assertion helpers — AC-4 Successful Login
    # ------------------------------------------------------------------ #

    def assert_on_dashboard(self) -> None:
        """AC-4: After successful login the URL must contain /dashboard."""
        assert self._page.is_on_dashboard(), \
            "AC-4 FAIL: Expected redirect to /dashboard after successful login"

    # ------------------------------------------------------------------ #
    # Assertion helpers — AC-5 Failed Login
    # ------------------------------------------------------------------ #

    def assert_generic_error_shown(self) -> None:
        """
        AC-5: A generic 'Invalid email or password' banner must appear.
        The message must NOT single out a specific field.
        """
        error = self._page.get_error_banner_text() or self._page.get_validation_error_text()
        assert error, "AC-5 FAIL: No error message displayed after failed login"
        assert "invalid email or password" in error.lower(), (
            f"AC-5 FAIL: Expected generic 'Invalid email or password', got: '{error}'"
        )

    def assert_still_on_login_page(self) -> None:
        """AC-5: User must remain on the login page after a failed attempt."""
        assert not self._page.is_on_dashboard(), \
            "AC-5 FAIL: Should NOT redirect to dashboard on failed login"
