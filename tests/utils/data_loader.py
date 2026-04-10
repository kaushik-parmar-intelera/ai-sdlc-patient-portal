"""
Test data loader.

Reads JSON and CSV test-data files from the test_data/ directory.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any

_DATA_DIR = Path(__file__).parent.parent / "test_data"


def load_json(filename: str) -> Any:
    """
    Load a JSON file from the test_data/ directory.

    Args:
        filename: File name relative to test_data/ (e.g. "users.json").

    Returns:
        Parsed JSON (dict or list).
    """
    path = _DATA_DIR / filename
    with open(path) as fh:
        return json.load(fh)


def load_csv(filename: str) -> list[dict]:
    """
    Load a CSV file from the test_data/ directory.

    Returns:
        List of dicts, one per row, using the header row as keys.
    """
    path = _DATA_DIR / filename
    with open(path, newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        return list(reader)


def load_locators(platform: str) -> dict:
    """
    Load locator definitions for a given platform.

    Args:
        platform: "android" or "ios"

    Returns:
        Dict of locator name -> locator value.
    """
    return load_json(f"locators/{platform}_locators.json")
