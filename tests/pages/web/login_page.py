"""
Login Page Object — Mobile Web (Playwright).

Covers SCRUM-2:
    AC-1  UI rendering
    AC-2  Input validation (frontend)
    AC-4  Successful login
    AC-5  Failed login — generic error

Locator priority: data-testid > role > semantic > CSS > XPath
"""
from __future__ import annotations

from playwright.sync_api import Page, expect

from pages.base_page import BaseWebPage
from utils import waits
from utils.logger import get_logger

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# Locator map (CSS / semantic — no XPath used)
# data-testid takes priority; fallback to semantic / placeholder attributes.
# ---------------------------------------------------------------------------
_SEL: dict[str, str] = {
    # Header
    "app_title":          "header span.font-public-sans",
    # Email / Username
    "email_label":        "label:has-text('Email or Username')",
    "email_input":        "input[placeholder='e.g. j.doe@hospital.com']",
    # Password
    "password_label":     "label:has-text('Password')",
    "password_input":     "input[placeholder='••••••••']",
    # Show/hide toggle — inside the relative div that wraps the password field
    "show_hide_toggle":   "div.relative:has(input[placeholder='••••••••']) button[type='button']",
    # Forgot password
    "forgot_password":    "a:has-text('Forgot password?')",
    # Submit
    "sign_in_button":     "button[type='submit']:has-text('Sign In')",
    # Biometric (AC-1 bonus element)
    "biometric_button":   "button:has-text('Biometric Sign-in')",
    # Register link
    "register_link":      "a:has-text('Register your clinical ID')",
    # Inline validation / error messages
    "validation_error":   (
        "[data-testid='validation-error'], "
        "[role='alert'], "
        ".validation-error, "
        "p.text-error, "
        "span.text-error"
    ),
    # Toast / banner error (failed login)
    "error_banner":       (
        "[data-testid='error-banner'], "
        "[role='alert'], "
        ".error-banner"
    ),
    # Dashboard (post-login indicator)
    "dashboard_heading":  (
        "[data-testid='dashboard-heading'], "
        "h1:has-text('Dashboard'), "
        "h2:has-text('Dashboard')"
    ),
}


class LoginPage(BaseWebPage):
    """Mobile-web login page for the Medical Patient Portal (SCRUM-2)."""

    URL_PATH = "/login"

    def __init__(self, page: Page) -> None:
        super().__init__(page)

    # ------------------------------------------------------------------ #
    # Navigation
    # ------------------------------------------------------------------ #

    def open(self, base_url: str) -> None:
        """Navigate to the login page."""
        self.navigate(base_url.rstrip("/") + self.URL_PATH)

    def is_loaded(self) -> bool:
        return self._page.locator(_SEL["sign_in_button"]).is_visible()

    # ------------------------------------------------------------------ #
    # State queries
    # ------------------------------------------------------------------ #

    def is_email_field_visible(self) -> bool:
        return self._page.locator(_SEL["email_input"]).is_visible()

    def is_password_field_visible(self) -> bool:
        return self._page.locator(_SEL["password_input"]).is_visible()

    def is_show_hide_toggle_visible(self) -> bool:
        return self._page.locator(_SEL["show_hide_toggle"]).is_visible()

    def is_sign_in_button_visible(self) -> bool:
        return self._page.locator(_SEL["sign_in_button"]).is_visible()

    def is_forgot_password_visible(self) -> bool:
        return self._page.locator(_SEL["forgot_password"]).is_visible()

    def is_sign_in_button_enabled(self) -> bool:
        return self._page.locator(_SEL["sign_in_button"]).is_enabled()

    def get_password_input_type(self) -> str:
        """Return current `type` attribute of the password input (password|text)."""
        return (
            self._page.locator(_SEL["password_input"]).get_attribute("type") or "password"
        )

    def get_validation_error_text(self) -> str:
        """Return visible validation error text, or empty string."""
        loc = self._page.locator(_SEL["validation_error"])
        if loc.is_visible():
            return loc.inner_text().strip()
        return ""

    def get_error_banner_text(self) -> str:
        """Return visible error-banner text (e.g. 'Invalid email or password')."""
        loc = self._page.locator(_SEL["error_banner"])
        if loc.is_visible():
            return loc.inner_text().strip()
        return ""

    def is_on_dashboard(self) -> bool:
        """Return True when the current URL contains /dashboard."""
        return "/dashboard" in self._page.url

    # ------------------------------------------------------------------ #
    # Actions
    # ------------------------------------------------------------------ #

    def enter_email(self, email: str) -> None:
        logger.debug("enter_email | %s", email)
        self._page.locator(_SEL["email_input"]).fill(email)

    def clear_email(self) -> None:
        self._page.locator(_SEL["email_input"]).fill("")

    def enter_password(self, password: str) -> None:
        logger.debug("enter_password | [redacted]")
        self._page.locator(_SEL["password_input"]).fill(password)

    def clear_password(self) -> None:
        self._page.locator(_SEL["password_input"]).fill("")

    def click_show_hide_toggle(self) -> None:
        logger.debug("click_show_hide_toggle")
        self._page.locator(_SEL["show_hide_toggle"]).click()

    def click_sign_in(self) -> None:
        logger.debug("click_sign_in")
        self._page.locator(_SEL["sign_in_button"]).click()

    def click_forgot_password(self) -> None:
        logger.debug("click_forgot_password")
        self._page.locator(_SEL["forgot_password"]).click()

    def blur_email_field(self) -> None:
        """Click elsewhere to trigger blur-based validation."""
        self._page.locator(_SEL["password_input"]).click()

    # ------------------------------------------------------------------ #
    # Compound flows
    # ------------------------------------------------------------------ #

    def login(self, email: str, password: str) -> None:
        """Fill credentials and submit the form."""
        self.enter_email(email)
        self.enter_password(password)
        self.click_sign_in()

    def wait_for_dashboard(self, timeout: int = 15_000) -> None:
        """Wait until the browser navigates to the dashboard URL."""
        self._page.wait_for_url("**/dashboard**", timeout=timeout)
