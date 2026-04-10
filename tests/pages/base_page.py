"""
Platform-aware base page.

All page objects (web / android / ios) inherit from BasePage.
The driver attribute is set by subclasses via __init__.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Union

from appium.webdriver.common.appiumby import AppiumBy
from playwright.sync_api import Locator, Page
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement

from utils import gestures, waits
from utils.logger import get_logger
from utils.reporter import attach_screenshot_appium, attach_screenshot_playwright

logger = get_logger(__name__)


class BasePage(ABC):
    """
    Abstract base for all page objects.

    Subclasses must implement:
        - _driver property returning either a Playwright Page or Appium WebDriver
        - is_loaded() returning True when the page is fully loaded
    """

    @property
    @abstractmethod
    def _driver(self) -> Union[Page, WebDriver]:
        """Return the underlying driver instance."""

    @abstractmethod
    def is_loaded(self) -> bool:
        """Return True if the page is in the expected loaded state."""


class BaseWebPage(BasePage):
    """Base class for Playwright mobile-web page objects."""

    def __init__(self, page: Page) -> None:
        self._page = page

    @property
    def _driver(self) -> Page:
        return self._page

    def is_loaded(self) -> bool:
        return True  # override per page

    # ------------------------------------------------------------------ #
    # Element helpers
    # ------------------------------------------------------------------ #

    def find(self, selector: str) -> Locator:
        return self._page.locator(selector)

    def click(self, selector: str) -> None:
        logger.debug("click | %s", selector)
        self.find(selector).click()

    def fill(self, selector: str, text: str) -> None:
        logger.debug("fill | %s | %s", selector, text)
        self.find(selector).fill(text)

    def get_text(self, selector: str) -> str:
        return self.find(selector).inner_text()

    def is_visible(self, selector: str) -> bool:
        return self.find(selector).is_visible()

    def wait_visible(self, selector: str, timeout: int | None = None) -> None:
        kwargs = {"timeout": timeout} if timeout else {}
        waits.wait_for_visible(self.find(selector), **kwargs)

    def scroll_to(self, selector: str) -> None:
        self.find(selector).scroll_into_view_if_needed()

    def screenshot(self, name: str = "screenshot") -> None:
        attach_screenshot_playwright(self._page, name)

    def tap(self, x: float, y: float) -> None:
        gestures.playwright_tap(self._page, x, y)

    def swipe(self, start_x: float, start_y: float, end_x: float, end_y: float) -> None:
        gestures.playwright_swipe(self._page, start_x, start_y, end_x, end_y)

    def scroll(self, x: float, y: float, delta: float = 500) -> None:
        gestures.playwright_scroll(self._page, x, y, delta)

    def navigate(self, url: str) -> None:
        logger.info("navigate | %s", url)
        self._page.goto(url)
        waits.wait_for_page_load(self._page)


class BaseNativePage(BasePage):
    """Base class for Appium native page objects (Android + iOS)."""

    def __init__(self, driver: WebDriver) -> None:
        self._appium_driver = driver

    @property
    def _driver(self) -> WebDriver:
        return self._appium_driver

    def is_loaded(self) -> bool:
        return True  # override per page

    # ------------------------------------------------------------------ #
    # Element helpers
    # ------------------------------------------------------------------ #

    def find_by_accessibility_id(self, aid: str, timeout: int = 30) -> WebElement:
        return waits.wait_for_element_visible(
            self._appium_driver,
            (AppiumBy.ACCESSIBILITY_ID, aid),
            timeout=timeout,
        )

    def find_by_xpath(self, xpath: str, timeout: int = 30) -> WebElement:
        return waits.wait_for_element_visible(
            self._appium_driver,
            (AppiumBy.XPATH, xpath),
            timeout=timeout,
        )

    def find_by_id(self, resource_id: str, timeout: int = 30) -> WebElement:
        return waits.wait_for_element_visible(
            self._appium_driver,
            (AppiumBy.ID, resource_id),
            timeout=timeout,
        )

    def tap_element(self, element: WebElement) -> None:
        gestures.appium_tap_element(self._appium_driver, element)

    def tap_coords(self, x: int, y: int) -> None:
        gestures.appium_tap(self._appium_driver, x, y)

    def swipe_down(self, times: int = 1) -> None:
        gestures.appium_scroll_down(self._appium_driver, times)

    def swipe_up(self, times: int = 1) -> None:
        gestures.appium_scroll_up(self._appium_driver, times)

    def long_press(self, element: WebElement, duration_ms: int = 2000) -> None:
        gestures.appium_long_press(self._appium_driver, element, duration_ms)

    def screenshot(self, name: str = "screenshot") -> None:
        attach_screenshot_appium(self._appium_driver, name)

    def is_element_present(self, locator: tuple, timeout: int = 5) -> bool:
        try:
            waits.wait_for_element_present(self._appium_driver, locator, timeout)
            return True
        except Exception:  # noqa: BLE001
            return False
