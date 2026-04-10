"""
Appium driver for native Android and iOS testing.

Builds an AppiumOptions object from the merged capabilities in config
and returns a connected webdriver.Remote session.
"""
from __future__ import annotations

import os

from appium import webdriver
from appium.options.android.uiautomator2.base import UiAutomator2Options
from appium.options.ios.xcuitest.base import XCUITestOptions

from config.config_loader import get_config
from utils.logger import get_logger

logger = get_logger(__name__)


def _build_options(platform: str, caps: dict):
    """Return a platform-specific AppiumOptions object populated with caps."""
    if platform == "android":
        opts = UiAutomator2Options()
    else:
        opts = XCUITestOptions()

    for key, value in caps.items():
        # platformName and automationName are already set by the options class
        if key in ("platformName", "automationName"):
            continue
        opts.set_capability(key, value)
    return opts


def create_appium_driver() -> webdriver.Remote:
    """
    Create and return an Appium RemoteWebDriver.

    The capabilities are fully resolved by config_loader before this
    function is called, so this function only handles driver creation.
    """
    config = get_config()
    caps = dict(config.capabilities)

    # Inject app path if not already set
    if not caps.get("app"):
        env_key = f"{config.platform.upper()}_APP_PATH"
        app_path = os.getenv(env_key)
        if app_path:
            caps["app"] = app_path
        elif not caps.get("appPackage"):
            logger.warning(
                "No app path set. Set %s env var or update config yaml.", env_key
            )

    logger.info(
        "Starting Appium session | platform=%s | device=%s | server=%s",
        config.platform,
        caps.get("deviceName"),
        config.appium_url,
    )

    options = _build_options(config.platform, caps)
    driver = webdriver.Remote(config.appium_url, options=options)
    driver.implicitly_wait(0)   # use explicit waits only
    return driver


def quit_appium_driver(driver: webdriver.Remote) -> None:
    """Safely quit the Appium driver."""
    try:
        if driver:
            logger.info("Quitting Appium driver")
            driver.quit()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Error quitting Appium driver: %s", exc)
