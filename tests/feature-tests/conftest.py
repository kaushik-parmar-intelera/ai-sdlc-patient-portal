"""
Root conftest — session fixtures, driver lifecycle, failure hooks.

Fixtures:
    config          (session)  — initialised Config singleton
    playwright_session (function) — Playwright session for web tests
    appium_driver      (function) — Appium driver for native tests
    driver             (function) — generic alias resolved by platform
"""
from __future__ import annotations

import os
from typing import Generator

import allure
import pytest

from config.config_loader import Config, init_config, get_config
from drivers.driver_factory import DriverFactory
from drivers.playwright_driver import PlaywrightSession
from utils.reporter import (
    attach_screenshot_appium,
    attach_screenshot_playwright,
    attach_video_playwright,
    attach_video_appium,
)


# --------------------------------------------------------------------------- #
# CLI options
# --------------------------------------------------------------------------- #

def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption("--env", default=None, help="Environment: qa | staging | prod")
    parser.addoption("--platform", default=None, help="Platform: web | android | ios")
    parser.addoption("--cloud", default=None, help="Cloud: local | lambdatest")


# --------------------------------------------------------------------------- #
# Session-scoped config
# --------------------------------------------------------------------------- #

@pytest.fixture(scope="session")
def config(request: pytest.FixtureRequest) -> Config:
    env = request.config.getoption("--env")
    platform = request.config.getoption("--platform")
    cloud = request.config.getoption("--cloud")
    return init_config(env=env, platform=platform, cloud=cloud)


# --------------------------------------------------------------------------- #
# Playwright (web) fixtures
# --------------------------------------------------------------------------- #

@pytest.fixture(scope="function")
def playwright_session(config) -> Generator[PlaywrightSession, None, None]:
    """Yield a fresh Playwright session for each test."""
    session = DriverFactory.create()
    yield session
    DriverFactory.quit(session)


@pytest.fixture(scope="function")
def page(playwright_session: PlaywrightSession):
    """Convenience fixture — returns just the Playwright Page."""
    return playwright_session.page


# --------------------------------------------------------------------------- #
# Appium (native) fixtures
# --------------------------------------------------------------------------- #

@pytest.fixture(scope="function")
def appium_driver(config):
    """Yield a fresh Appium driver for each test."""
    driver = DriverFactory.create()
    # Start screen recording if supported
    try:
        driver.start_recording_screen()
    except Exception:  # noqa: BLE001
        pass
    yield driver
    DriverFactory.quit(driver)


# --------------------------------------------------------------------------- #
# Failure hooks — screenshots & videos on test failure
# --------------------------------------------------------------------------- #

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item: pytest.Item, call: pytest.CallInfo):
    outcome = yield
    report = outcome.get_result()

    if report.when == "call" and report.failed:
        cfg = get_config()

        if cfg.platform == "web":
            # Grab Playwright page from fixture
            pw_session: PlaywrightSession | None = item.funcargs.get("playwright_session")
            if pw_session:
                attach_screenshot_playwright(pw_session.page, "failure_screenshot")

        else:
            # Grab Appium driver from fixture
            driver = item.funcargs.get("appium_driver")
            if driver:
                attach_screenshot_appium(driver, "failure_screenshot")
                try:
                    attach_video_appium(driver, "failure_video")
                except Exception:  # noqa: BLE001
                    pass
