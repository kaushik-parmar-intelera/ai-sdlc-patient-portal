"""
Driver factory — single entry point for all driver creation.

Usage in conftest.py:
    driver = DriverFactory.create()
    ...
    DriverFactory.quit(driver)
"""
from __future__ import annotations

from typing import Union

from appium import webdriver as appium_webdriver

from config.config_loader import get_config
from drivers.appium_driver import create_appium_driver, quit_appium_driver
from drivers.lambdatest_driver import create_lambdatest_driver
from drivers.playwright_driver import (
    PlaywrightSession,
    close_playwright_session,
    create_playwright_session,
)
from utils.logger import get_logger

logger = get_logger(__name__)

AnyDriver = Union[PlaywrightSession, appium_webdriver.Remote]


class DriverFactory:
    """Static factory for creating and destroying test drivers."""

    @staticmethod
    def create() -> AnyDriver:
        """
        Instantiate the correct driver based on PLATFORM and CLOUD env vars.

        Returns:
            PlaywrightSession for platform=web
            appium webdriver.Remote for platform=android/ios
        """
        config = get_config()
        platform = config.platform
        cloud = config.cloud

        logger.info("DriverFactory.create | platform=%s | cloud=%s", platform, cloud)

        if platform == "web":
            return create_playwright_session()

        if cloud == "lambdatest":
            return create_lambdatest_driver()

        return create_appium_driver()

    @staticmethod
    def quit(driver: AnyDriver) -> None:
        """Cleanly shut down any driver type."""
        if isinstance(driver, PlaywrightSession):
            close_playwright_session(driver)
        else:
            quit_appium_driver(driver)
