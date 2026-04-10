"""
Cross-platform gesture utilities.

- Playwright: uses page.mouse API (touch events via hasTouch context)
- Appium:     uses W3C Actions API (no deprecated TouchAction)
"""
from __future__ import annotations

from typing import Union

from appium.webdriver.common.appiumby import AppiumBy
from playwright.sync_api import Page
from selenium.webdriver import ActionChains
from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver.common.actions.pointer_input import PointerInput
from selenium.webdriver.common.actions import interaction
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement

from utils.logger import get_logger

logger = get_logger(__name__)


# ------------------------------------------------------------------ #
# Playwright gestures
# ------------------------------------------------------------------ #

def playwright_tap(page: Page, x: float, y: float) -> None:
    """Simulate a tap at absolute coordinates."""
    page.mouse.click(x, y)


def playwright_swipe(
    page: Page,
    start_x: float,
    start_y: float,
    end_x: float,
    end_y: float,
    steps: int = 20,
) -> None:
    """Simulate a swipe from start to end coordinates."""
    page.mouse.move(start_x, start_y)
    page.mouse.down()
    step_x = (end_x - start_x) / steps
    step_y = (end_y - start_y) / steps
    for i in range(1, steps + 1):
        page.mouse.move(start_x + step_x * i, start_y + step_y * i)
    page.mouse.up()


def playwright_scroll(page: Page, x: float, y: float, delta_y: float = 500) -> None:
    """Scroll the page at a given position."""
    page.mouse.wheel(x, y, 0, delta_y)


# ------------------------------------------------------------------ #
# Appium gestures (W3C Actions API)
# ------------------------------------------------------------------ #

def appium_tap(driver: WebDriver, x: int, y: int) -> None:
    """Tap at absolute screen coordinates using W3C Actions."""
    touch_input = PointerInput(interaction.POINTER_TOUCH, "touch")
    actions = ActionBuilder(driver, mouse=touch_input)
    actions.pointer_action.move_to_location(x, y)
    actions.pointer_action.pointer_down()
    actions.pointer_action.pause(0.1)
    actions.pointer_action.pointer_up()
    actions.perform()
    logger.debug("appium_tap | x=%d y=%d", x, y)


def appium_tap_element(driver: WebDriver, element: WebElement) -> None:
    """Tap the centre of a WebElement."""
    rect = element.rect
    x = rect["x"] + rect["width"] // 2
    y = rect["y"] + rect["height"] // 2
    appium_tap(driver, x, y)


def appium_swipe(
    driver: WebDriver,
    start_x: int,
    start_y: int,
    end_x: int,
    end_y: int,
    duration_ms: int = 800,
) -> None:
    """
    Swipe from (start_x, start_y) to (end_x, end_y).

    Args:
        duration_ms: Gesture duration — controls swipe speed.
    """
    touch_input = PointerInput(interaction.POINTER_TOUCH, "touch")
    actions = ActionBuilder(driver, mouse=touch_input)
    actions.pointer_action.move_to_location(start_x, start_y)
    actions.pointer_action.pointer_down()
    actions.pointer_action.pause(duration_ms / 1000)
    actions.pointer_action.move_to_location(end_x, end_y)
    actions.pointer_action.pointer_up()
    actions.perform()
    logger.debug(
        "appium_swipe | (%d,%d) -> (%d,%d) | %dms",
        start_x, start_y, end_x, end_y, duration_ms,
    )


def appium_scroll_down(driver: WebDriver, times: int = 1) -> None:
    """Scroll down by swiping from 70% to 30% of screen height."""
    size = driver.get_window_size()
    width = size["width"]
    height = size["height"]
    start_x = width // 2
    start_y = int(height * 0.70)
    end_y = int(height * 0.30)
    for _ in range(times):
        appium_swipe(driver, start_x, start_y, start_x, end_y)


def appium_scroll_up(driver: WebDriver, times: int = 1) -> None:
    """Scroll up by swiping from 30% to 70% of screen height."""
    size = driver.get_window_size()
    width = size["width"]
    height = size["height"]
    start_x = width // 2
    start_y = int(height * 0.30)
    end_y = int(height * 0.70)
    for _ in range(times):
        appium_swipe(driver, start_x, start_y, start_x, end_y)


def appium_long_press(driver: WebDriver, element: WebElement, duration_ms: int = 2000) -> None:
    """Long press on an element."""
    rect = element.rect
    x = rect["x"] + rect["width"] // 2
    y = rect["y"] + rect["height"] // 2
    touch_input = PointerInput(interaction.POINTER_TOUCH, "touch")
    actions = ActionBuilder(driver, mouse=touch_input)
    actions.pointer_action.move_to_location(x, y)
    actions.pointer_action.pointer_down()
    actions.pointer_action.pause(duration_ms / 1000)
    actions.pointer_action.pointer_up()
    actions.perform()
