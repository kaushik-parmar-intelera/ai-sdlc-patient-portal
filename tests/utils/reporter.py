"""
Allure reporting helpers.

Provides screenshot and video attachment utilities called from
conftest.py hooks on test failure.
"""
from __future__ import annotations

from pathlib import Path

import allure
at = allure.attachment_type

from utils.logger import get_logger

logger = get_logger(__name__)


def attach_screenshot_playwright(page, name: str = "screenshot_on_failure") -> None:
    """Take a Playwright screenshot and attach it to the Allure report."""
    try:
        screenshot_bytes = page.screenshot(full_page=True)
        allure.attach(screenshot_bytes, name=name, attachment_type=at.PNG)
        logger.info("Playwright screenshot attached: %s", name)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not capture Playwright screenshot: %s", exc)


def attach_screenshot_appium(driver, name: str = "screenshot_on_failure") -> None:
    """Take an Appium screenshot and attach it to the Allure report."""
    try:
        screenshot_bytes = driver.get_screenshot_as_png()
        allure.attach(screenshot_bytes, name=name, attachment_type=at.PNG)
        logger.info("Appium screenshot attached: %s", name)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not capture Appium screenshot: %s", exc)


def attach_video_playwright(context, name: str = "video_on_failure") -> None:
    """
    Attach the Playwright video recording to the Allure report.

    Must be called AFTER context.close() which flushes the video.
    """
    try:
        # Each page stores its video path
        for page in context.pages:
            video = page.video
            if video:
                video_path = video.path()
                _attach_file(video_path, name, at.WEBM)
                return
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not attach Playwright video: %s", exc)


def attach_video_appium(driver, name: str = "video_on_failure") -> None:
    """
    Stop Appium screen recording and attach the video.

    Requires the recording to have been started earlier with
    driver.start_recording_screen().
    """
    try:
        video_b64 = driver.stop_recording_screen()
        import base64
        video_bytes = base64.b64decode(video_b64)
        allure.attach(video_bytes, name=name, attachment_type=at.MP4)
        logger.info("Appium screen recording attached: %s", name)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not attach Appium video: %s", exc)


def attach_text(content: str, name: str) -> None:
    """Attach arbitrary text to the Allure report."""
    allure.attach(content, name=name, attachment_type=at.TEXT)


def _attach_file(path: str | Path, name: str, attachment_type) -> None:
    path = Path(path)
    if path.exists():
        allure.attach(path.read_bytes(), name=name, attachment_type=attachment_type)
    else:
        logger.warning("Attachment file not found: %s", path)
