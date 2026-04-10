"""
Structured, colored logger with file rotation.

Usage:
    from utils.logger import get_logger
    logger = get_logger(__name__)
    logger.info("message")
"""
from __future__ import annotations

import logging
import logging.handlers
import os
from pathlib import Path

import colorlog

_LOG_DIR = Path("reports/logs")
_LOG_DIR.mkdir(parents=True, exist_ok=True)

_LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

_CONSOLE_FMT = "%(log_color)s%(asctime)s [%(levelname)-8s] %(name)s: %(message)s%(reset)s"
_FILE_FMT = "%(asctime)s [%(levelname)-8s] %(name)s: %(message)s"
_DATE_FMT = "%Y-%m-%d %H:%M:%S"

_COLOR_MAP = {
    "DEBUG": "cyan",
    "INFO": "green",
    "WARNING": "yellow",
    "ERROR": "red",
    "CRITICAL": "bold_red",
}


def get_logger(name: str) -> logging.Logger:
    """Return a configured logger for the given module name."""
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger   # already configured

    logger.setLevel(getattr(logging, _LOG_LEVEL, logging.INFO))

    # Console handler
    console = colorlog.StreamHandler()
    console.setFormatter(
        colorlog.ColoredFormatter(_CONSOLE_FMT, datefmt=_DATE_FMT, log_colors=_COLOR_MAP)
    )
    logger.addHandler(console)

    # Rotating file handler
    file_handler = logging.handlers.RotatingFileHandler(
        _LOG_DIR / "framework.log",
        maxBytes=5 * 1024 * 1024,   # 5 MB
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setFormatter(logging.Formatter(_FILE_FMT, datefmt=_DATE_FMT))
    logger.addHandler(file_handler)

    logger.propagate = False
    return logger
