"""
test_scrum2_login_mobile_web.py
===============================
Mobile Web login tests — Playwright + Python
User Story : SCRUM-2  "Login Screen Implementation"
AC Coverage: AC-1, AC-2, AC-4, AC-5

Devices emulated (configured via pytest --device or config.device_name):
    • iPhone 13
    • Pixel 7

Test matrix
-----------
TC-SCRUM2-P01  (P0)  All UI elements visible on page load           [AC-1]
TC-SCRUM2-P02  (P1)  Show/Hide password toggle                      [AC-1]
TC-SCRUM2-P03  (P0)  Valid credentials → redirect to dashboard      [AC-4]
TC-SCRUM2-P04  (P2)  "Forgot password?" link is visible & tappable  [AC-1] edge
TC-SCRUM2-P05  (P1)  Email with valid special characters accepted    [AC-2/AC-4] edge
TC-SCRUM2-N01  (P1)  Invalid email format → inline validation error  [AC-2]
TC-SCRUM2-N02  (P0)  Empty password → Sign In button disabled        [AC-2]
TC-SCRUM2-N03  (P0)  Wrong credentials → generic error, no field ID  [AC-5]
TC-SCRUM2-N04  (P1)  Whitespace-only email → validation error        [AC-2] edge

Assumptions
-----------
- BASE_URL env var points to the running application (default: http://localhost:3000).
- Valid test credentials are in test_data/users.json under "valid_user".
- The login page lives at BASE_URL + /login.
- The app performs frontend validation before the API call.
- After a failed login the page remains at /login.
"""
from __future__ import annotations

import allure
import pytest

from utils.data_loader import load_json

_users = load_json("users.json")
_VALID_EMAIL    = _users["valid_user"]["email"]
_VALID_PASSWORD = _users["valid_user"]["password"]
_WRONG_EMAIL    = _users["invalid_user"]["email"]
_WRONG_PASSWORD = _users["invalid_user"]["password"]

# ---------------------------------------------------------------------------
# TC-SCRUM2-P01  All UI elements visible on page load  [AC-1]
# ---------------------------------------------------------------------------

@allure.feature("SCRUM-2 Login Screen")
@allure.story("AC-1 UI Rendering")
@allure.severity(allure.severity_level.BLOCKER)
@allure.title("TC-SCRUM2-P01 — All login UI elements visible on page load")
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.smoke
def test_p01_all_ui_elements_visible(mobile_web_page):
    """
    Preconditions : App is open; user is not logged in; login screen displayed.
    Steps         : 1. Navigate to login page.
                    2. Observe all required elements.
    Expected      : Email field, Password field, Show/Hide toggle,
                    Sign In button, and "Forgot password?" link are all visible.
    """
    with allure.step("Verify all required login UI elements are visible"):
        mobile_web_page.assert_all_ui_elements_visible()


# ---------------------------------------------------------------------------
# TC-SCRUM2-P02  Show/Hide password toggle  [AC-1]
# ---------------------------------------------------------------------------

@allure.feature("SCRUM-2 Login Screen")
@allure.story("AC-1 UI Rendering")
@allure.severity(allure.severity_level.NORMAL)
@allure.title("TC-SCRUM2-P02 — Show/Hide password toggle reveals and re-masks password")
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.regression
def test_p02_show_hide_password_toggle(mobile_web_page):
    """
    Preconditions : Login screen displayed.
    Steps         : 1. Enter a password.
                    2. Tap the show/hide toggle → verify type=text.
                    3. Tap the toggle again → verify type=password.
    Test Data     : password = "TestPass@123"
    Expected      : Toggle correctly reveals and re-masks the password.
    """
    with allure.step("Enter a password"):
        mobile_web_page.fill_credentials("any@example.com", "TestPass@123")

    with allure.step("Password is masked by default"):
        mobile_web_page.assert_password_is_masked()

    with allure.step("Tap Show/Hide toggle — password should become visible"):
        mobile_web_page.toggle_password_visibility()
        mobile_web_page.assert_password_is_visible()

    with allure.step("Tap Show/Hide toggle again — password should be re-masked"):
        mobile_web_page.toggle_password_visibility()
        mobile_web_page.assert_password_is_masked()


# ---------------------------------------------------------------------------
# TC-SCRUM2-P03  Valid credentials → redirect to dashboard  [AC-4]
# ---------------------------------------------------------------------------

@allure.feature("SCRUM-2 Login Screen")
@allure.story("AC-4 Successful Login")
@allure.severity(allure.severity_level.BLOCKER)
@allure.title("TC-SCRUM2-P03 — Valid credentials result in successful login and dashboard redirect")
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.smoke
def test_p03_valid_credentials_redirect_to_dashboard(mobile_web_page):
    """
    Preconditions : Login screen displayed; valid user account exists.
    Steps         : 1. Enter valid email.
                    2. Enter valid password.
                    3. Tap Sign In.
                    4. Wait for navigation.
    Test Data     : email = admin@example.com, password = password123
    Expected      : User is redirected to /dashboard.
                    (JWT token receipt & secure storage verified at API/unit level.)
    """
    with allure.step(f"Enter valid credentials: {_VALID_EMAIL}"):
        mobile_web_page.fill_credentials(_VALID_EMAIL, _VALID_PASSWORD)

    with allure.step("Submit the login form"):
        mobile_web_page.submit()

    with allure.step("Wait for and verify dashboard redirect"):
        mobile_web_page.wait_for_dashboard()
        mobile_web_page.assert_on_dashboard()


# ---------------------------------------------------------------------------
# TC-SCRUM2-P04  "Forgot password?" link visible & tappable  [AC-1] edge
# ---------------------------------------------------------------------------

@allure.feature("SCRUM-2 Login Screen")
@allure.story("AC-1 UI Rendering")
@allure.severity(allure.severity_level.MINOR)
@allure.title("TC-SCRUM2-P04 — 'Forgot password?' link is visible and tappable (edge case)")
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.regression
def test_p04_forgot_password_link_visible_and_tappable(mobile_web_page, playwright_session):
    """
    Preconditions : Login screen displayed.
    Steps         : 1. Verify 'Forgot password?' link is visible.
                    2. Tap/click the link.
                    3. Verify navigation away from /login.
    Expected      : Link is present; tapping it navigates to password-recovery flow.
    """
    with allure.step("Tap 'Forgot password?' link"):
        mobile_web_page.tap_forgot_password()

    with allure.step("Verify navigation away from login page (password recovery flow)"):
        page = playwright_session.page
        # The app should navigate to a password-reset or recovery URL
        assert "/login" not in page.url or "/forgot" in page.url or "/reset" in page.url, (
            "Expected navigation away from /login after tapping 'Forgot password?'"
        )


# ---------------------------------------------------------------------------
# TC-SCRUM2-P05  Email with valid special chars accepted  [AC-2/AC-4] edge
# ---------------------------------------------------------------------------

@allure.feature("SCRUM-2 Login Screen")
@allure.story("AC-2 Input Validation")
@allure.severity(allure.severity_level.NORMAL)
@allure.title("TC-SCRUM2-P05 — Email with valid special characters is accepted (edge case)")
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.regression
def test_p05_email_with_special_characters_accepted(mobile_web_page):
    """
    Preconditions : Login screen displayed.
    Steps         : 1. Enter email with '+' and sub-domain (RFC-5321 valid).
                    2. Enter any password.
                    3. Observe: no inline validation error shown for email.
    Test Data     : email = "user.name+tag@hospital.co.uk", password = "AnyPass@1"
    Expected      : Email field accepted as valid format (no red-border / error).
    """
    special_email = "user.name+tag@hospital.co.uk"

    with allure.step(f"Enter special-character email: {special_email}"):
        mobile_web_page.fill_credentials(special_email, "AnyPass@1")

    with allure.step("Blur email field to trigger validation"):
        mobile_web_page.blur_email()

    with allure.step("Verify no validation error for a valid email with special chars"):
        # Sign In should be enabled (email accepted, password filled)
        mobile_web_page.assert_sign_in_enabled()


# ---------------------------------------------------------------------------
# TC-SCRUM2-N01  Invalid email format → inline validation error  [AC-2]
# ---------------------------------------------------------------------------

@allure.feature("SCRUM-2 Login Screen")
@allure.story("AC-2 Input Validation")
@allure.severity(allure.severity_level.NORMAL)
@allure.title("TC-SCRUM2-N01 — Invalid email format triggers inline validation error")
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.regression
def test_n01_invalid_email_shows_validation_error(mobile_web_page):
    """
    Preconditions : Login screen displayed.
    Steps         : 1. Enter an invalid email format (no '@').
                    2. Blur / move focus out of the field.
                    3. Observe validation error.
    Test Data     : email = "notanemail"
    Expected      : Inline validation error appears instantly;
                    message indicates invalid email format.
    """
    with allure.step("Enter invalid email 'notanemail'"):
        mobile_web_page.fill_credentials("notanemail", "")

    with allure.step("Blur to trigger frontend validation"):
        mobile_web_page.blur_email()

    with allure.step("Verify inline validation error is shown"):
        mobile_web_page.assert_validation_error_contains("invalid")


# ---------------------------------------------------------------------------
# TC-SCRUM2-N02  Empty password → Sign In button disabled  [AC-2]
# ---------------------------------------------------------------------------

@allure.feature("SCRUM-2 Login Screen")
@allure.story("AC-2 Input Validation")
@allure.severity(allure.severity_level.BLOCKER)
@allure.title("TC-SCRUM2-N02 — Empty password field disables the Sign In button")
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.smoke
def test_n02_empty_password_disables_sign_in(mobile_web_page):
    """
    Preconditions : Login screen displayed.
    Steps         : 1. Enter a valid email.
                    2. Leave the password field empty.
                    3. Observe Sign In button state.
    Test Data     : email = "admin@example.com", password = "" (empty)
    Expected      : Sign In button is disabled; form cannot be submitted.
    """
    with allure.step("Enter valid email, leave password empty"):
        mobile_web_page.fill_credentials(_VALID_EMAIL, "")

    with allure.step("Verify Sign In button is disabled"):
        mobile_web_page.assert_sign_in_disabled()


# ---------------------------------------------------------------------------
# TC-SCRUM2-N03  Wrong credentials → generic error, no field disclosure  [AC-5]
# ---------------------------------------------------------------------------

@allure.feature("SCRUM-2 Login Screen")
@allure.story("AC-5 Failed Login")
@allure.severity(allure.severity_level.BLOCKER)
@allure.title("TC-SCRUM2-N03 — Wrong credentials show generic error without field disclosure")
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.smoke
def test_n03_wrong_credentials_generic_error(mobile_web_page):
    """
    Preconditions : Login screen displayed; credentials do NOT match any account.
    Steps         : 1. Enter wrong email and wrong password.
                    2. Tap Sign In.
                    3. Observe error message and page URL.
    Test Data     : email = "wrong@example.com", password = "wrongpass123"
    Expected      : Generic error "Invalid email or password" appears.
                    Specific field NOT disclosed.
                    User remains on login page (/login).
    """
    with allure.step("Enter wrong credentials"):
        mobile_web_page.fill_credentials(_WRONG_EMAIL, _WRONG_PASSWORD)

    with allure.step("Submit the form"):
        mobile_web_page.submit()

    with allure.step("Verify generic error message is shown"):
        mobile_web_page.assert_generic_error_shown()

    with allure.step("Verify user remains on login page"):
        mobile_web_page.assert_still_on_login_page()


# ---------------------------------------------------------------------------
# TC-SCRUM2-N04  Whitespace-only email → validation error  [AC-2] edge
# ---------------------------------------------------------------------------

@allure.feature("SCRUM-2 Login Screen")
@allure.story("AC-2 Input Validation")
@allure.severity(allure.severity_level.NORMAL)
@allure.title("TC-SCRUM2-N04 — Whitespace-only email is rejected as invalid (edge case)")
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.regression
def test_n04_whitespace_email_shows_validation_error(mobile_web_page):
    """
    Preconditions : Login screen displayed.
    Steps         : 1. Enter whitespace-only string in email field.
                    2. Enter a valid password.
                    3. Blur the email field or attempt to submit.
    Test Data     : email = "   " (spaces only), password = "TestPass@123"
    Expected      : Email validation error shown OR Sign In remains disabled.
                    Login does NOT proceed.
    """
    with allure.step("Enter whitespace-only in email field"):
        mobile_web_page.fill_credentials("   ", "TestPass@123")

    with allure.step("Blur email field to trigger validation"):
        mobile_web_page.blur_email()

    with allure.step("Verify Sign In is disabled or validation error is shown"):
        # Either the button is disabled OR an explicit error message appears
        from pages.web.login_page import LoginPage
        # We check via the component's own page reference
        lp = mobile_web_page._page  # LoginPage instance
        button_disabled = not lp.is_sign_in_button_enabled()
        has_error = bool(lp.get_validation_error_text())
        assert button_disabled or has_error, (
            "AC-2 FAIL: Whitespace-only email should disable Sign In or show a validation error"
        )
