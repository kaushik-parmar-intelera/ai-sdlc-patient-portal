"""
LambdaTest cloud driver.

Wraps appium_driver.create_appium_driver() but overrides the Appium
server URL with the LambdaTest hub endpoint, injecting credentials
from environment variables.
"""
from __future__ import annotations

import os

from appium import webdriver
from drivers.appium_driver import _build_options

from config.config_loader import get_config
from utils.logger import get_logger

logger = get_logger(__name__)


def create_lambdatest_driver() -> webdriver.Remote:
    """
    Create a WebDriver session on LambdaTest's real-device cloud.

    Required env vars:
        LT_USERNAME   — LambdaTest username
        LT_ACCESS_KEY — LambdaTest access key
    """
    username = os.environ.get("LT_USERNAME")
    access_key = os.environ.get("LT_ACCESS_KEY")

    if not username or not access_key:
        raise EnvironmentError(
            "LT_USERNAME and LT_ACCESS_KEY must be set for LambdaTest execution."
        )

    config = get_config()
    caps = dict(config.capabilities)   # shallow copy; already merged by config_loader

    hub_url = f"https://{username}:{access_key}@mobile-hub.lambdatest.com/wd/hub"

    logger.info(
        "Starting LambdaTest session | platform=%s | build=%s",
        config.platform,
        caps.get("lt:options", {}).get("build", "unknown"),
    )

    options = _build_options(config.platform, caps)
    driver = webdriver.Remote(hub_url, options=options)
    driver.implicitly_wait(0)
    return driver
