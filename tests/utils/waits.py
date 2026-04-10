"""
Smart wait utilities.

Provides a unified wait API on top of Playwright's built-in expect()
and Appium's WebDriverWait, so page objects never call time.sleep().
"""
from __future__ import annotations

from typing import Callable, TypeVar

from playwright.sync_api import Locator, Page, expect
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

from utils.logger import get_logger

logger = get_logger(__name__)

T = TypeVar("T")

DEFAULT_TIMEOUT_MS = 30_000    # 30 seconds (Playwright uses ms)
DEFAULT_TIMEOUT_S = 30         # 30 seconds (Selenium/Appium uses s)


# ------------------------------------------------------------------ #
# Playwright waits
# ------------------------------------------------------------------ #

def wait_for_visible(locator: Locator, timeout: int = DEFAULT_TIMEOUT_MS) -> None:
    """Wait until the Playwright locator is visible."""
    expect(locator).to_be_visible(timeout=timeout)


def wait_for_hidden(locator: Locator, timeout: int = DEFAULT_TIMEOUT_MS) -> None:
    """Wait until the Playwright locator is hidden."""
    expect(locator).to_be_hidden(timeout=timeout)


def wait_for_text(locator: Locator, text: str, timeout: int = DEFAULT_TIMEOUT_MS) -> None:
    """Wait until the locator contains the expected text."""
    expect(locator).to_contain_text(text, timeout=timeout)


def wait_for_url(page: Page, pattern: str, timeout: int = DEFAULT_TIMEOUT_MS) -> None:
    """Wait until the page URL matches the given pattern/regex."""
    expect(page).to_have_url(pattern, timeout=timeout)


def wait_for_page_load(page: Page, timeout: int = DEFAULT_TIMEOUT_MS) -> None:
    """Wait for the network to reach an idle state."""
    page.wait_for_load_state("networkidle", timeout=timeout)


# ------------------------------------------------------------------ #
# Appium / Selenium waits
# ------------------------------------------------------------------ #

def wait_for_element_present(
    driver: WebDriver,
    locator: tuple,
    timeout: int = DEFAULT_TIMEOUT_S,
) -> WebElement:
    """Wait until an element is present in the DOM."""
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located(locator),
        message=f"Element not present after {timeout}s: {locator}",
    )


def wait_for_element_visible(
    driver: WebDriver,
    locator: tuple,
    timeout: int = DEFAULT_TIMEOUT_S,
) -> WebElement:
    """Wait until an element is visible."""
    return WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located(locator),
        message=f"Element not visible after {timeout}s: {locator}",
    )


def wait_for_element_clickable(
    driver: WebDriver,
    locator: tuple,
    timeout: int = DEFAULT_TIMEOUT_S,
) -> WebElement:
    """Wait until an element is clickable."""
    return WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable(locator),
        message=f"Element not clickable after {timeout}s: {locator}",
    )


def wait_for_element_invisible(
    driver: WebDriver,
    locator: tuple,
    timeout: int = DEFAULT_TIMEOUT_S,
) -> bool:
    """Wait until an element is no longer visible."""
    return WebDriverWait(driver, timeout).until(
        EC.invisibility_of_element_located(locator),
        message=f"Element still visible after {timeout}s: {locator}",
    )


def wait_until(
    condition: Callable[[], T],
    timeout: int = DEFAULT_TIMEOUT_S,
    poll_frequency: float = 0.5,
    error_message: str = "Condition not met",
) -> T:
    """
    Generic polling wait for any callable that returns a truthy value.

    Args:
        condition: Callable returning a truthy value when condition is met.
        timeout:   Maximum wait time in seconds.
        poll_frequency: How often to poll, in seconds.
        error_message:  Message for TimeoutError.

    Raises:
        TimeoutError if condition is not met within timeout.
    """
    import time

    deadline = time.monotonic() + timeout
    last_exc: Exception | None = None

    while time.monotonic() < deadline:
        try:
            result = condition()
            if result:
                return result
        except Exception as exc:  # noqa: BLE001
            last_exc = exc
        time.sleep(poll_frequency)

    raise TimeoutError(
        f"{error_message} (timeout={timeout}s)"
        + (f" — last exception: {last_exc}" if last_exc else "")
    )
