"""
Playwright driver for mobile web testing.

Returns a (playwright, browser, context, page) tuple so callers
can manage lifecycle at the appropriate scope.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from playwright.sync_api import Browser, BrowserContext, Page, Playwright, sync_playwright

from config.config_loader import get_config
from utils.logger import get_logger

logger = get_logger(__name__)


@dataclass
class PlaywrightSession:
    playwright: Playwright
    browser: Browser
    context: BrowserContext
    page: Page


def create_playwright_session(video_dir: str = "reports/videos") -> PlaywrightSession:
    """
    Launch a Chromium browser in mobile emulation mode.

    Args:
        video_dir: Directory to store videos (recorded on failure).

    Returns:
        PlaywrightSession with all handle objects.
    """
    config = get_config()
    logger.info(
        "Starting Playwright session | device=%s | url=%s",
        config.device_name,
        config.base_url,
    )

    pw = sync_playwright().start()
    browser = pw.chromium.launch(headless=True)

    # Mobile emulation context
    context_options: dict[str, Any] = {
        "viewport": config.viewport,
        "user_agent": _mobile_user_agent(config.device_name),
        "has_touch": True,
        "is_mobile": True,
        "record_video_dir": video_dir,
    }

    context = browser.new_context(**context_options)
    context.set_default_timeout(config.default_timeout)
    page = context.new_page()

    return PlaywrightSession(playwright=pw, browser=browser, context=context, page=page)


def close_playwright_session(session: PlaywrightSession) -> None:
    """Tear down the session and flush video recordings."""
    logger.info("Closing Playwright session")
    try:
        session.context.close()   # flushes video
        session.browser.close()
    finally:
        session.playwright.stop()


# --------------------------------------------------------------------------- #
# Internal helpers
# --------------------------------------------------------------------------- #

_USER_AGENTS = {
    "iPhone 14": (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
    ),
    "Pixel 7": (
        "Mozilla/5.0 (Linux; Android 13; Pixel 7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36"
    ),
}

_DEFAULT_UA = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
)


def _mobile_user_agent(device_name: str) -> str:
    return _USER_AGENTS.get(device_name, _DEFAULT_UA)
