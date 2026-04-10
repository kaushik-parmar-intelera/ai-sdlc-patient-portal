"""
Login Page Object — iOS Native (Appium + XCUITest).

Covers SCRUM-2:
    AC-1  UI rendering
    AC-2  Input validation
    AC-4  Successful login
    AC-5  Failed login — generic error

Locator priority: accessibility_id > resource-id > class > XPath
"""
from __future__ import annotations

from appium.webdriver.common.appiumby import AppiumBy

from pages.base_page import BaseNativePage
from utils import waits
from utils.data_loader import load_locators
from utils.logger import get_logger

logger = get_logger(__name__)

_LOC = load_locators("ios")["login"]
_DASH = load_locators("ios")["dashboard"]


class IOSLoginPage(BaseNativePage):
    """Page object for the iOS native login screen (SCRUM-2)."""

    def is_loaded(self) -> bool:
        return self.is_element_present(
            (AppiumBy.XPATH, _LOC["email_input"]), timeout=15
        )

    # ------------------------------------------------------------------ #
    # State queries
    # ------------------------------------------------------------------ #

    def is_email_field_visible(self) -> bool:
        return self.is_element_present((AppiumBy.XPATH, _LOC["email_input"]), timeout=5)

    def is_password_field_visible(self) -> bool:
        return self.is_element_present((AppiumBy.XPATH, _LOC["password_input"]), timeout=5)

    def is_show_hide_toggle_visible(self) -> bool:
        return self.is_element_present((AppiumBy.XPATH, _LOC["show_hide_toggle"]), timeout=5)

    def is_login_button_visible(self) -> bool:
        return self.is_element_present((AppiumBy.XPATH, _LOC["login_button"]), timeout=5)

    def is_forgot_password_visible(self) -> bool:
        return self.is_element_present((AppiumBy.XPATH, _LOC["forgot_password"]), timeout=5)

    def is_login_button_enabled(self) -> bool:
        el = self.find_by_xpath(_LOC["login_button"])
        return el.is_enabled()

    def get_error_text(self) -> str:
        """Return visible error / validation message text, or empty string."""
        for locator_key in ("error_message", "validation_error"):
            if self.is_element_present((AppiumBy.XPATH, _LOC[locator_key]), timeout=5):
                el = self.find_by_xpath(_LOC[locator_key])
                return el.get_attribute("value") or el.text or ""
        return ""

    def is_password_field_secure(self) -> bool:
        """
        Return True when the password field is a SecureTextField (masked).
        After toggling show/hide the field type changes to TextField.
        """
        return self.is_element_present(
            (AppiumBy.XPATH, _LOC["password_input"]), timeout=3
        )

    def is_on_dashboard(self) -> bool:
        return self.is_element_present(
            (AppiumBy.XPATH, _DASH["title"]), timeout=15
        )

    # ------------------------------------------------------------------ #
    # Actions
    # ------------------------------------------------------------------ #

    def enter_email(self, email: str) -> None:
        logger.debug("enter_email | %s", email)
        el = self.find_by_xpath(_LOC["email_input"])
        el.clear()
        el.send_keys(email)

    def enter_password(self, password: str) -> None:
        logger.debug("enter_password | [redacted]")
        el = self.find_by_xpath(_LOC["password_input"])
        el.clear()
        el.send_keys(password)

    def tap_show_hide_toggle(self) -> None:
        logger.debug("tap_show_hide_toggle")
        el = self.find_by_xpath(_LOC["show_hide_toggle"])
        self.tap_element(el)

    def tap_login_button(self) -> None:
        logger.debug("tap_login_button")
        waits.wait_for_element_clickable(
            self._appium_driver,
            (AppiumBy.XPATH, _LOC["login_button"]),
        )
        el = self.find_by_xpath(_LOC["login_button"])
        self.tap_element(el)

    def tap_forgot_password(self) -> None:
        logger.debug("tap_forgot_password")
        el = self.find_by_xpath(_LOC["forgot_password"])
        self.tap_element(el)

    def hide_keyboard(self) -> None:
        try:
            self._appium_driver.hide_keyboard()
        except Exception:  # noqa: BLE001
            pass

    # ------------------------------------------------------------------ #
    # Compound flows
    # ------------------------------------------------------------------ #

    def login(self, email: str, password: str) -> None:
        """Enter credentials and submit."""
        self.enter_email(email)
        self.enter_password(password)
        self.hide_keyboard()
        self.tap_login_button()

    def wait_for_dashboard(self, timeout: int = 15) -> None:
        waits.wait_for_element_visible(
            self._appium_driver,
            (AppiumBy.XPATH, _DASH["title"]),
            timeout=timeout,
        )
