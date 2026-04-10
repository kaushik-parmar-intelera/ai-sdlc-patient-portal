# AI Mobile Automation Framework

Production-grade unified test automation framework supporting:
- **Mobile Web** testing via Playwright (Python)
- **Native Android** testing via Appium 2.x + UiAutomator2
- **Native iOS** testing via Appium 2.x + XCUITest

**Target App:** MyApp — Expo/React Native app at `/Users/sanjay.singh/Downloads/Test2/MyApp`

---

## Current Test Status

| Platform | Tests | Status | Emulator/Device |
|----------|-------|--------|-----------------|
| Android | 9 | PASSING | emulator-5554 (API 16) |
| iOS | 9 | 7 PASSING, 2 intermittent (keyboard timing) | iPhone 16 Pro Simulator (iOS 18.5) |
| Web | 4 | Not yet run — needs `base_url` config | — |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                 Test Layer                  │
│  tests/web/   tests/android/   tests/ios/  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              Page Objects (POM)             │
│  pages/web/  pages/android/  pages/ios/    │
│         pages/base_page.py                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│             Driver Factory                  │
│  drivers/driver_factory.py                 │
│  ├── playwright_driver.py  (web)           │
│  ├── appium_driver.py      (native local)  │
│  └── lambdatest_driver.py  (cloud)         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Config Layer                       │
│  config/config_loader.py                   │
│  config/environments/  qa | staging | prod │
│  config/capabilities/  android | ios | lt  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Shared Utilities                   │
│  utils/waits.py    utils/gestures.py       │
│  utils/reporter.py utils/logger.py         │
└─────────────────────────────────────────────┘
```

---

## Prerequisites

| Tool | Required Version | Notes |
|------|-----------------|-------|
| Python | 3.11+ | |
| Node.js | 18+ (tested on v22.x) | Required by Appium CLI |
| Appium | 2.x (tested on 2.19.0) | `npm install -g appium` |
| appium-uiautomator2-driver | 4.x (tested 4.2.7) | `appium driver install uiautomator2` |
| appium-xcuitest-driver | 9.x (tested 9.10.0) | `appium driver install xcuitest` |
| Allure CLI | 2.x | `brew install allure` |
| Android Studio | latest | SDK Platform-Tools, Emulator, ADB |
| Xcode | latest | iOS simulator (macOS only) |
| JDK | 17+ | Required by Gradle for app build |

---

## Quick Start

### 1. Install Python dependencies

```bash
cd AI_Mobile_Automation_framework
pip3 install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — add app paths, LambdaTest credentials if needed
```

### 3. Start Appium server

```bash
appium --log reports/logs/appium.log
# Verify: curl http://127.0.0.1:4723/status
```

### 4. Run Android tests

```bash
# Make sure emulator is running: adb devices
PLATFORM=android ENV=qa pytest tests/android/ -v
```

### 5. Generate Allure report

```bash
make report
```

---

## App Under Test — MyApp (Expo / React Native)

The app has two screens:

### LoginScreen
- Email input (placeholder: `Email`)
- Password input (placeholder: `Password`, secure)
- Login button — Android: `content-desc='Login'` / iOS: `XCUIElementTypeOther[@name='Login']`
- Valid credentials: `admin@example.com` / `password123`
- Invalid credentials show an Alert dialog with an OK button

### DashboardScreen
- Counter display with `+`, `-`, `Reset` buttons — iOS: `XCUIElementTypeOther[@name='+']` etc.
- `Logout` button returns to LoginScreen

### Building the Android APK

```bash
cd /Users/sanjay.singh/Downloads/Test2/MyApp
npx expo run:android      # generates android/ dir and builds APK
```

Built APK:
```
/Users/sanjay.singh/Downloads/Test2/MyApp/android/app/build/outputs/apk/debug/app-debug.apk
```

Android package: `com.anonymous.MyApp`

Install on emulator manually if needed:
```bash
adb -s emulator-5554 install -r <path-to-apk>
```

> **Note:** The first build downloads Gradle 8.14.3, NDK 27.1.12297006, and CMake 3.22.1 (~1 GB total). Subsequent builds are fast.

### Building the iOS App

```bash
cd /Users/sanjay.singh/Downloads/Test2/MyApp
npx expo run:ios --device "iPhone 16 Pro"   # generates ios/ dir, installs CocoaPods, builds + installs on simulator
```

iOS bundle identifier: `com.anonymous.MyApp`

Built app installed at:
```
~/Library/Developer/Xcode/DerivedData/MyApp-*/Build/Products/Debug-iphonesimulator/MyApp.app
```

> **Note:** First build installs CocoaPods via Homebrew and compiles all pods (~5 min). Subsequent builds are fast.

---

## Configuration

### Environment files — `config/environments/`

| File | Purpose |
|------|---------|
| `qa.yaml` | Local/emulator testing (currently active) |
| `staging.yaml` | Staging environment |
| `prod.yaml` | Production environment |

Key settings in `qa.yaml` (as of last update):

```yaml
android:
  app_package: "com.anonymous.MyApp"
  app_activity: "com.anonymous.MyApp.MainActivity"

appium:
  host: "127.0.0.1"
  port: 4723
  base_path: ""          # Appium 2.x — do NOT use /wd/hub
```

### Capability files — `config/capabilities/`

| File | Key settings |
|------|-------------|
| `android_caps.yaml` | `deviceName: emulator-5554`, `platformVersion: "16"`, `forceAppLaunch: true` |
| `ios_caps.yaml` | `deviceName: iPhone 16 Pro`, `platformVersion: "18.5"`, `autoAcceptAlerts: false`, `forceAppLaunch: true` |
| `lambdatest_caps.yaml` | Real device pools, `lt:options` build/project/video flags |

### Important capability notes

- **Appium 2.x base path** is `/` not `/wd/hub` — always set `base_path: ""`
- **Appium Python client 5.x** uses `UiAutomator2Options` / `XCUITestOptions` with `set_capability()` — the old `AppiumOptions` is removed
- **`forceAppLaunch: true`** ensures each test function starts from a clean app state (important for React Native state persistence)
- **`implicitly_wait(0)`** is set on all drivers — use explicit waits only, never `time.sleep()`

---

## Running Tests

### Android (fully working)

```bash
# All Android tests
PLATFORM=android ENV=qa pytest tests/android/ -v

# Smoke only
PLATFORM=android ENV=qa pytest tests/android/ -m smoke -v

# Single file
PLATFORM=android ENV=qa pytest tests/android/test_android_login.py -v
```

### iOS (working — iPhone 16 Pro, iOS 18.5)

```bash
# Ensure simulator is booted (iPhone 16 Pro is used)
xcrun simctl list devices booted

# Run all iOS tests
PLATFORM=ios ENV=qa pytest tests/ios/ -v

# Login tests only
PLATFORM=ios ENV=qa pytest tests/ios/test_ios_login.py -v

# Dashboard/gesture tests
PLATFORM=ios ENV=qa pytest tests/ios/test_ios_gestures.py -v
```

### Web / Playwright (needs base_url — see TODO)

```bash
playwright install chromium          # one-time
PLATFORM=web ENV=qa pytest tests/web/ -v
```

### LambdaTest Cloud

```bash
export LT_USERNAME=your_username
export LT_ACCESS_KEY=your_access_key
PLATFORM=android CLOUD=lambdatest pytest tests/android/ -m smoke -v
```

### Parallel execution

```bash
pytest tests/android/ -n auto        # auto-detect CPU cores
pytest tests/android/ -n 3           # fixed 3 workers
```

### Makefile shortcuts

```bash
make test-android          # PLATFORM=android pytest tests/android/
make test-ios              # PLATFORM=ios pytest tests/ios/
make test-web              # PLATFORM=web pytest tests/web/
make test-smoke            # pytest -m smoke (all platforms)
make test-parallel         # pytest -n auto
make report                # generate + open Allure HTML report
make clean                 # remove reports/, .pyc files
```

---

## Test Markers

```bash
pytest -m smoke        # Critical happy-path
pytest -m regression   # Full regression suite
pytest -m critical     # Business-critical only
pytest -m android      # All Android tests
pytest -m ios          # All iOS tests
pytest -m web          # All web tests
```

---

## Locators Strategy

### Android — React Native New Architecture (Fabric)

React Native's Fabric renderer uses `android.view.ViewGroup` instead of standard Android widgets. Locator rules:

| Element | Strategy | Example |
|---------|----------|---------|
| Text labels | `TextView[@text='...']` | `//android.widget.TextView[@text='Welcome Back!']` |
| Text inputs | `EditText` positional | `//android.widget.EditText[1]` |
| Buttons (TouchableOpacity) | `ViewGroup[@content-desc='...']` | `//android.view.ViewGroup[@content-desc='Login']` |
| Alert OK button | `Button[@text='OK']` | `//android.widget.Button[@text='OK']` |

Locator file: [test_data/locators/android_locators.json](test_data/locators/android_locators.json)

### iOS — XCUITest (React Native / Expo)

Locators confirmed against live iPhone 16 Pro simulator (iOS 18.5):

| Element | Strategy | Example |
|---------|----------|---------|
| Text labels | `XCUIElementTypeStaticText[@name='...']` | `//XCUIElementTypeStaticText[@name='Welcome Back!']` |
| Text inputs | `XCUIElementTypeTextField[@placeholderValue='...']` | `//XCUIElementTypeTextField[@placeholderValue='Email']` |
| Secure inputs | `XCUIElementTypeSecureTextField[@placeholderValue='...']` | `//XCUIElementTypeSecureTextField[@placeholderValue='Password']` |
| Buttons (TouchableOpacity) | `XCUIElementTypeOther[@name='...']` | `//XCUIElementTypeOther[@name='Login']` |
| Alert OK button | `XCUIElementTypeButton[@name='OK']` | `//XCUIElementTypeButton[@name='OK']` |

> **Note:** Buttons on iOS render as `XCUIElementTypeOther` (not `XCUIElementTypeButton` or `XCUIElementTypeStaticText`) due to React Native's rendering layer.

**iOS keyboard handling:** `driver.hide_keyboard()` is not supported for React Native apps on iOS. The workaround is tapping a non-input static text element (e.g. the subtitle) to dismiss the keyboard before tapping the Login button.

Locator file: [test_data/locators/ios_locators.json](test_data/locators/ios_locators.json)

---

## Project Structure

```
AI_Mobile_Automation_framework/
├── config/
│   ├── config_loader.py          # Singleton config, YAML + env var merge, key remapping
│   ├── environments/
│   │   ├── qa.yaml               # Active: com.anonymous.MyApp, emulator-5554, API 16
│   │   ├── staging.yaml
│   │   └── prod.yaml
│   └── capabilities/
│       ├── android_caps.yaml     # UiAutomator2, forceAppLaunch: true
│       ├── ios_caps.yaml         # XCUITest, iPhone 16 Pro, iOS 18.5, autoAcceptAlerts: false
│       └── lambdatest_caps.yaml  # LambdaTest cloud overrides
│
├── drivers/
│   ├── driver_factory.py         # DriverFactory.create() / .quit() — single entry point
│   ├── appium_driver.py          # UiAutomator2Options/XCUITestOptions (Appium client 5.x)
│   ├── playwright_driver.py      # Playwright mobile emulation session
│   └── lambdatest_driver.py      # LambdaTest hub with injected credentials
│
├── pages/
│   ├── base_page.py              # BaseWebPage (Playwright) + BaseNativePage (Appium)
│   ├── web/
│   │   ├── login_page.py         # CSS selector based, data-testid preferred
│   │   └── home_page.py
│   ├── android/
│   │   ├── login_page.py         # content-desc + EditText positional locators
│   │   └── home_page.py          # counter value via TextView text scan
│   └── ios/
│       ├── login_page.py         # XCUIElementType XPath locators
│       └── home_page.py
│
├── tests/
│   ├── conftest.py               # CLI options, session config fixture, appium_driver /
│   │                             # playwright_session fixtures, failure screenshot hook
│   ├── android/
│   │   ├── test_android_login.py     # 4 tests: valid login, invalid, logout, empty creds
│   │   └── test_android_gestures.py  # 5 tests: increment, decrement, reset, scroll, swipe
│   ├── ios/
│   │   ├── test_ios_login.py         # 4 tests (mirrors Android)
│   │   └── test_ios_gestures.py      # 5 tests (mirrors Android)
│   └── web/
│       ├── test_web_login.py
│       └── test_web_navigation.py
│
├── utils/
│   ├── waits.py        # Playwright expect() wrappers + Appium WebDriverWait wrappers
│   ├── gestures.py     # W3C Actions API — tap, swipe, scroll, long-press (no TouchAction)
│   ├── reporter.py     # Allure screenshot + video attach on failure
│   ├── logger.py       # Colored console + rotating file handler (reports/logs/framework.log)
│   └── data_loader.py  # load_json(), load_csv(), load_locators()
│
├── test_data/
│   ├── users.json                    # { valid_user, invalid_user }
│   └── locators/
│       ├── android_locators.json     # login + dashboard screen locators
│       └── ios_locators.json         # login + dashboard screen locators
│
├── reports/                          # Git-ignored
│   ├── allure-results/               # Raw JSON per test run
│   ├── allure-report/                # Generated HTML (make report)
│   ├── logs/
│   │   ├── framework.log             # Rotating Python logs
│   │   └── appium.log                # Appium server output
│   └── videos/                       # Playwright video recordings
│
├── .github/workflows/
│   ├── android_tests.yml
│   ├── ios_tests.yml
│   ├── web_tests.yml
│   └── full_suite.yml
│
├── .env.example        # Template — copy to .env and fill in credentials
├── pytest.ini          # Markers, --alluredir, log_cli settings
├── requirements.txt    # Pinned Python dependencies
├── Makefile            # make test-android / test-ios / report / clean
└── README.md
```

---

## Known Issues & Fixes Applied

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| `ImportError: cannot import name 'AppiumOptions'` | Appium Python client 5.x removed `AppiumOptions` | Use `UiAutomator2Options` / `XCUITestOptions` from `appium.options.*` |
| Session URL returns 404 | Appium 2.x uses `/` as base path, not `/wd/hub` | Set `base_path: ""` in all environment YAML files |
| Wrong app launched after capabilities fix | `set_capability()` via `setattr()` silently set a Python attribute, not an Appium cap | Always call `opts.set_capability(key, value)` directly in `_build_options()` |
| App package was `com.example.myapplication` | Default Android Studio template, not the Expo app | Ran `npx expo run:android` → package became `com.anonymous.MyApp` |
| Gradle build failed: NDK missing `source.properties` | NDK 27.1.12297006 directory existed but was incomplete | Reinstalled via `sdkmanager --install "ndk;27.1.12297006"` |
| App stuck on Dashboard between tests | React Native in-memory state persists across Appium sessions | Added `forceAppLaunch: true` capability |
| `ModuleNotFoundError: allure.attachment_type` | Allure Python module structure change | Changed to `at = allure.attachment_type` (module-level attribute) |
| iOS: `driver.hide_keyboard()` raises `InvalidElementStateException` | React Native on iOS does not support WDA keyboard dismissal | Tap a static text element (`subtitle`) to dismiss keyboard instead |
| iOS: buttons located as `XCUIElementTypeStaticText` — element not found | TouchableOpacity renders as `XCUIElementTypeOther` on iOS, not `StaticText` | Updated `ios_locators.json` to use `XCUIElementTypeOther[@name='...']` for all buttons |
| iOS: `autoAcceptAlerts: true` suppressed error alert before test could assert on it | Appium auto-dismissed the Alert before `has_error_alert()` returned | Set `autoAcceptAlerts: false` in `ios_caps.yaml` |
| iOS: 2 intermittent failures — login doesn't complete | `forceAppLaunch` restarts the app but login fixture starts before the UI is ready | Added explicit `wait_for_element_visible` on email input (20s) before interacting |

---

## CI/CD

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `android_tests.yml` | Push to main, PR, manual dispatch | Appium Android on emulator |
| `ios_tests.yml` | Push to main, PR, manual dispatch | Appium iOS on simulator |
| `web_tests.yml` | Push to main, PR | Playwright mobile web |
| `full_suite.yml` | Nightly 02:00 UTC, manual dispatch | All platforms + Allure report publish |

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `LT_USERNAME` | LambdaTest username |
| `LT_ACCESS_KEY` | LambdaTest access key |
| `SLACK_WEBHOOK_URL` | (Optional) Slack notifications |

---

## Adding a New Page Object

1. Create `pages/<platform>/your_page.py` extending `BaseWebPage` or `BaseNativePage`
2. Add locators to `test_data/locators/<platform>_locators.json`
3. Load locators via `load_locators()` in `__init__`
4. Implement `is_loaded()`
5. Decorate actions with `@allure.step()`

```python
from pages.base_page import BaseNativePage
from utils.data_loader import load_locators
from appium.webdriver.common.appiumby import AppiumBy
import allure

class AndroidYourPage(BaseNativePage):
    def __init__(self, driver):
        super().__init__(driver)
        self._loc = load_locators("android")["your_page"]

    def is_loaded(self) -> bool:
        return self.is_element_present(
            (AppiumBy.XPATH, self._loc["title"]), timeout=15
        )

    @allure.step("Tap your button")
    def tap_your_button(self) -> None:
        el = self.find_by_xpath(self._loc["your_button"])
        self.tap_element(el)
```

---

## TODO

### High Priority

- [x] **iOS: Run tests on simulator** — Built app with `npx expo run:ios --device "iPhone 16 Pro"`, confirmed locators from live page source, 7/9 tests passing on iPhone 16 Pro (iOS 18.5)
- [ ] **iOS: Fix 2 intermittent failures** — `test_increment` and `test_custom_swipe` occasionally fail when `forceAppLaunch` restarts the app mid-session and the login fixture times out. Root cause: app launch time varies. Fix: increase `wait_for_element_visible` timeout or add a retry fixture
- [ ] **Web: Set real `base_url`** — Update `config/environments/qa.yaml` → `web.base_url` with the actual deployed app URL, then run `PLATFORM=web ENV=qa pytest tests/web/ -v`
- [ ] **Web: Install Playwright browser** — Run `playwright install chromium` once before executing web tests
- [ ] **Add `testID` props to MyApp** — Add `testID="email_input"`, `testID="password_input"`, `testID="login_button"` etc. to React Native components for stable `AccessibilityId` locators instead of XPath/content-desc

### Medium Priority

- [ ] **CI/CD: Configure self-hosted runner** — The Android and iOS workflows require a self-hosted GitHub Actions runner with an emulator/simulator. Update `runs-on` in `android_tests.yml` and `ios_tests.yml` from `ubuntu-latest` to your runner label
- [ ] **CI/CD: Add GitHub Secrets** — Add `LT_USERNAME` and `LT_ACCESS_KEY` to repository secrets before the LambdaTest cloud steps will work
- [ ] **LambdaTest smoke validation** — Set `LT_USERNAME` + `LT_ACCESS_KEY` in `.env`, then run `PLATFORM=android CLOUD=lambdatest pytest tests/android/ -m smoke` to validate cloud execution
- [ ] **Parallel test execution** — Test `pytest -n auto` with multiple emulator instances; currently validated only with sequential execution
- [ ] **Staging/prod config** — Fill in real `base_url`, `app_package`, and credentials for `staging.yaml` and `prod.yaml`

### Low Priority

- [ ] **Add `.gitignore`** — Include `reports/`, `*.pyc`, `.env`, `__pycache__/`, and `android/`+`ios/` build directories from the MyApp project
- [ ] **Expand test scenarios** — Add tests for: app backgrounding/foregrounding, network error handling, orientation change, deep links
- [ ] **Visual regression** — Add Playwright screenshot baseline tests using `expect(page).toHaveScreenshot()`
- [ ] **Parameterised login tests** — Extend `users.json` with edge cases (special chars, max length, SQL injection strings) and use `@pytest.mark.parametrize`
- [x] **iOS locator validation** — Confirmed all locators against live iPhone 16 Pro simulator page source; updated `ios_locators.json` with correct `XCUIElementTypeOther` for buttons
- [ ] **Rebuild APK/IPA for CI** — Add Gradle build step to `android_tests.yml` and xcodebuild step to `ios_tests.yml` so CI always builds fresh binaries before running tests
