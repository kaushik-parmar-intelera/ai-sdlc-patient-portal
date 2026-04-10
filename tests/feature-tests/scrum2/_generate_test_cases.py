"""
_generate_test_cases.py
=======================
Standalone script — generates the SCRUM-2 test-case Excel workbook.

Run from the tests/ directory:
    python feature-tests/scrum2/_generate_test_cases.py

Output:
    tests/feature-tests/scrum2/test_cases_SCRUM2.xlsx
"""
from __future__ import annotations

import sys
from pathlib import Path

# Allow imports from the tests/ root
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from utils.excel_generator import generate_test_case_report  # noqa: E402

# ---------------------------------------------------------------------------
# SCRUM-2 test cases (AC-1, AC-2, AC-4, AC-5)
# ---------------------------------------------------------------------------

SCRUM2_CASES = [
    # ------------------------------------------------------------------
    # POSITIVE
    # ------------------------------------------------------------------
    {
        "id":            "TC-SCRUM2-P01",
        "title":         "All login UI elements visible on page/screen load",
        "ac_ref":        "AC-1",
        "preconditions": (
            "• App/browser is open\n"
            "• User is NOT logged in\n"
            "• Login screen is displayed"
        ),
        "steps": (
            "1. Navigate to the login page (web) / Launch the app (native)\n"
            "2. Observe all elements on the screen"
        ),
        "test_data": "None",
        "expected": (
            "• Email / Username field is visible\n"
            "• Password field is visible\n"
            "• Show/Hide password toggle is visible\n"
            "• Sign In button is visible\n"
            "• 'Forgot password?' link is visible"
        ),
        "priority": "P0",
        "type":     "Positive",
    },
    {
        "id":            "TC-SCRUM2-P02",
        "title":         "Show/Hide password toggle reveals and re-masks password",
        "ac_ref":        "AC-1",
        "preconditions": (
            "• Login screen is displayed\n"
            "• Password field is visible"
        ),
        "steps": (
            "1. Enter a password in the password field\n"
            "2. Tap the Show/Hide toggle\n"
            "3. Verify password text is now visible (input type = text)\n"
            "4. Tap the toggle again\n"
            "5. Verify password is re-masked (input type = password)"
        ),
        "test_data": "password = \"TestPass@123\"",
        "expected": (
            "• After first tap: password text revealed (type=text)\n"
            "• After second tap: password re-masked (type=password)"
        ),
        "priority": "P1",
        "type":     "Positive",
    },
    {
        "id":            "TC-SCRUM2-P03",
        "title":         "Valid credentials → successful login → redirect to Dashboard",
        "ac_ref":        "AC-4",
        "preconditions": (
            "• Login screen displayed\n"
            "• Valid user account exists in the backend"
        ),
        "steps": (
            "1. Enter valid email address\n"
            "2. Enter valid password\n"
            "3. Tap Sign In\n"
            "4. Wait for navigation"
        ),
        "test_data": (
            "email    = admin@example.com\n"
            "password = password123"
        ),
        "expected": (
            "• User is redirected to the Dashboard screen/page\n"
            "• JWT token is received by the app (API level)\n"
            "• Token is stored securely (not in plain localStorage)"
        ),
        "priority": "P0",
        "type":     "Positive",
    },
    {
        "id":            "TC-SCRUM2-P04",
        "title":         "'Forgot password?' link is visible and tappable [edge case]",
        "ac_ref":        "AC-1",
        "preconditions": "• Login screen displayed",
        "steps": (
            "1. Verify 'Forgot password?' link is visible\n"
            "2. Tap / click the link"
        ),
        "test_data": "None",
        "expected": (
            "• Link is present on screen\n"
            "• Tapping navigates to the password-recovery / reset screen"
        ),
        "priority": "P2",
        "type":     "Positive",
    },
    {
        "id":            "TC-SCRUM2-P05",
        "title":         "Email with valid special characters ('+' sub-addressing) accepted [edge case]",
        "ac_ref":        "AC-2 / AC-4",
        "preconditions": (
            "• Login screen displayed\n"
            "• Account exists with email containing '+' and sub-domain"
        ),
        "steps": (
            "1. Enter RFC-5321 valid email with '+' and compound TLD\n"
            "2. Enter a valid password\n"
            "3. Blur email field / observe validation state"
        ),
        "test_data": (
            "email    = user.name+tag@hospital.co.uk\n"
            "password = SecurePass@1"
        ),
        "expected": (
            "• No inline validation error shown for the email field\n"
            "• Sign In / Login button is enabled"
        ),
        "priority": "P1",
        "type":     "Positive",
    },
    # ------------------------------------------------------------------
    # NEGATIVE
    # ------------------------------------------------------------------
    {
        "id":            "TC-SCRUM2-N01",
        "title":         "Invalid email format triggers inline validation error instantly",
        "ac_ref":        "AC-2",
        "preconditions": "• Login screen displayed",
        "steps": (
            "1. Enter an invalid email format (no '@' symbol)\n"
            "2. Click / blur out of the email field\n"
            "3. Observe validation feedback"
        ),
        "test_data": (
            "email    = notanemail\n"
            "password = (empty)"
        ),
        "expected": (
            "• Inline validation error appears immediately\n"
            "• Message indicates invalid email format\n"
            "• Sign In button remains disabled"
        ),
        "priority": "P1",
        "type":     "Negative",
    },
    {
        "id":            "TC-SCRUM2-N02",
        "title":         "Empty password field disables the Sign In / Login button",
        "ac_ref":        "AC-2",
        "preconditions": "• Login screen displayed",
        "steps": (
            "1. Enter a valid email address\n"
            "2. Leave the password field completely empty\n"
            "3. Observe Sign In button state"
        ),
        "test_data": (
            "email    = admin@example.com\n"
            "password = (empty)"
        ),
        "expected": (
            "• Sign In / Login button is disabled (greyed out)\n"
            "• Form cannot be submitted"
        ),
        "priority": "P0",
        "type":     "Negative",
    },
    {
        "id":            "TC-SCRUM2-N03",
        "title":         "Wrong credentials show generic error without revealing specific field",
        "ac_ref":        "AC-5",
        "preconditions": (
            "• Login screen displayed\n"
            "• Credentials do NOT match any existing account"
        ),
        "steps": (
            "1. Enter a wrong email address\n"
            "2. Enter a wrong password\n"
            "3. Tap Sign In\n"
            "4. Observe the error message and page/screen state"
        ),
        "test_data": (
            "email    = wrong@example.com\n"
            "password = wrongpass123"
        ),
        "expected": (
            "• Generic error shown: \"Invalid email or password\"\n"
            "• Message does NOT specify whether email or password is wrong\n"
            "• User remains on login page / screen (no redirect)"
        ),
        "priority": "P0",
        "type":     "Negative",
    },
    {
        "id":            "TC-SCRUM2-N04",
        "title":         "Whitespace-only email is rejected as invalid [edge case]",
        "ac_ref":        "AC-2",
        "preconditions": "• Login screen displayed",
        "steps": (
            "1. Enter whitespace-only string in the email field\n"
            "2. Enter a valid password\n"
            "3. Blur the email field or attempt to submit"
        ),
        "test_data": (
            "email    = \"   \" (spaces only)\n"
            "password = TestPass@123"
        ),
        "expected": (
            "• Email validation error is shown, OR\n"
            "• Sign In / Login button remains disabled\n"
            "• Login does NOT proceed"
        ),
        "priority": "P1",
        "type":     "Negative",
    },
]

STORIES = {
    "SCRUM-2": {
        "title": (
            "SCRUM-2 — Login Screen Implementation\n"
            "AC Coverage: AC-1 (UI Rendering), AC-2 (Input Validation), "
            "AC-4 (Successful Login), AC-5 (Failed Login)"
        ),
        "test_cases": SCRUM2_CASES,
    }
}

if __name__ == "__main__":
    output = Path(__file__).parent / "test_cases_SCRUM2.xlsx"
    result = generate_test_case_report(STORIES, output)
    print(f"[OK] Test case report generated: {result}")
