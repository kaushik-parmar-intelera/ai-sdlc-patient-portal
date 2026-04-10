"""
config_loader.py
================
Singleton configuration loader.

Reads from:
    1. .env file (auto-discovered from the tests/ root)
    2. Environment variables (override .env)
    3. pytest CLI options: --env, --platform, --cloud

Public API
----------
    init_config(env, platform, cloud) -> Config   call once in conftest session fixture
    get_config()                       -> Config   retrieve anywhere after init
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

# Load .env before anything else  (python-dotenv, required in requirements.txt)
try:
    from dotenv import load_dotenv

    _env_file = Path(__file__).parent.parent / ".env"
    load_dotenv(dotenv_path=_env_file, override=False)
except ImportError:
    pass  # dotenv optional; env vars already set in CI


# ---------------------------------------------------------------------------
# Config dataclass
# ---------------------------------------------------------------------------

@dataclass
class Config:
    # General
    env: str = "qa"
    platform: str = "web"          # web | android | ios
    cloud: str = "local"           # local | lambdatest

    # Web / Playwright
    base_url: str = "http://localhost:3000"
    device_name: str = "iPhone 14"
    viewport: dict = field(default_factory=lambda: {"width": 390, "height": 844})
    default_timeout: int = 30_000  # ms

    # Appium
    appium_host: str = "127.0.0.1"
    appium_port: int = 4723
    capabilities: dict = field(default_factory=dict)

    appium_base_path: str = "/wd/hub"  # "/wd/hub" for Appium 1.x; "" for Appium 2.x

    @property
    def appium_url(self) -> str:
        return f"http://{self.appium_host}:{self.appium_port}{self.appium_base_path}"


# ---------------------------------------------------------------------------
# Singleton
# ---------------------------------------------------------------------------

_config: Config | None = None


def init_config(
    env: str | None = None,
    platform: str | None = None,
    cloud: str | None = None,
) -> Config:
    """
    Initialise the global Config singleton.

    Priority (highest → lowest):
        pytest CLI option  >  environment variable  >  .env file  >  default
    """
    global _config

    resolved_env      = env      or os.getenv("ENV",      "qa")
    resolved_platform = platform or os.getenv("PLATFORM", "web")
    resolved_cloud    = cloud    or os.getenv("CLOUD",    "local")

    appium_host      = os.getenv("APPIUM_HOST",      "127.0.0.1")
    appium_port      = int(os.getenv("APPIUM_PORT", "4723"))
    appium_base_path = os.getenv("APPIUM_BASE_PATH", "/wd/hub")
    base_url         = os.getenv("BASE_URL", "http://localhost:3000")

    # Viewport / device presets
    _VIEWPORTS: dict[str, dict[str, int]] = {
        "iPhone 14": {"width": 390, "height": 844},
        "Pixel 7":   {"width": 412, "height": 915},
    }
    device_name = os.getenv("DEVICE_NAME", "iPhone 14")
    viewport    = _VIEWPORTS.get(device_name, {"width": 390, "height": 844})

    caps = _build_capabilities(resolved_platform, resolved_env)

    _config = Config(
        env=resolved_env,
        platform=resolved_platform,
        cloud=resolved_cloud,
        base_url=base_url,
        device_name=device_name,
        viewport=viewport,
        default_timeout=int(os.getenv("DEFAULT_TIMEOUT_MS", "30000")),
        appium_host=appium_host,
        appium_port=appium_port,
        appium_base_path=appium_base_path,
        capabilities=caps,
    )
    return _config


def get_config() -> Config:
    """
    Return the global Config singleton.

    Calls init_config() with defaults on first access if never explicitly
    initialised (e.g. when modules are imported outside a pytest session).
    """
    global _config
    if _config is None:
        _config = init_config()
    return _config


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _build_capabilities(platform: str, env: str) -> dict[str, Any]:
    """
    Construct Appium desired capabilities from environment variables.

    These can be overridden at any point by setting them directly on
    Config.capabilities after calling init_config().
    """
    if platform == "android":
        caps: dict[str, Any] = {
            "platformName":    "Android",
            "automationName":  "UiAutomator2",
            "deviceName":      os.getenv("ANDROID_DEVICE_NAME", "Android Emulator"),
            "platformVersion": os.getenv("ANDROID_VERSION", "13"),
            "noReset":         os.getenv("ANDROID_NO_RESET", "false").lower() == "true",
            "fullReset":       False,
            "newCommandTimeout": 300,
        }
        app_path = os.getenv("ANDROID_APP_PATH", "")
        app_package = os.getenv("ANDROID_APP_PACKAGE", "")
        app_activity = os.getenv("ANDROID_APP_ACTIVITY", "")
        if app_path:
            caps["app"] = app_path
        elif app_package:
            caps["appPackage"] = app_package
            if app_activity:
                caps["appActivity"] = app_activity
        return caps

    if platform == "ios":
        return {
            "platformName":    "iOS",
            "automationName":  "XCUITest",
            "deviceName":      os.getenv("IOS_DEVICE_NAME", "iPhone 14"),
            "platformVersion": os.getenv("IOS_VERSION", "16.0"),
            "app":             os.getenv("IOS_APP_PATH", ""),
            "noReset":         False,
            "fullReset":       False,
            "newCommandTimeout": 300,
        }

    # web — no Appium caps needed
    return {}
