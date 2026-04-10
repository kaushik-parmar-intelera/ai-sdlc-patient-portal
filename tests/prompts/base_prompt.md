Design and generate a production-grade unified test automation framework that supports:

1. Mobile Web Testing using Playwright
2. Native Android and iOS App Testing using Appium

The framework should be scalable, maintainable, and CI/CD-ready.

---

## Key Requirements

### 1. Architecture

* Hybrid framework combining Playwright (mobile web) and Appium (native apps)
* Clear separation of layers:

  * Web (Playwright)
  * Mobile Native (Appium)
  * Shared utilities
* Follow modular and extensible design principles

---

### 2. Tech Stack

* Playwright (TypeScript or Python) for mobile web
* Appium 2.x (Python or Java) for native apps
* Test runner:

  * PyTest (preferred) OR TestNG
* Use Page Object Model (POM)

---

### 3. Framework Structure

Provide a clean folder structure including:

* tests/
* pages/
* utils/
* config/
* test-data/
* reports/
* CI/CD configs

---

### 4. Core Features

* Driver factory (Playwright + Appium)
* Environment-based configuration (QA, staging, prod)
* Test tagging (smoke, regression, critical)
* Parallel execution support
* Logging and reporting (Allure or HTML)
* Screenshot and video capture on failure

---

### 5. Mobile Capabilities

* Android: UiAutomator2
* iOS: XCUITest
* Support real devices and emulators/simulators
* Handle gestures (tap, swipe, scroll)

---

### 6. CI/CD Integration

* Provide sample pipeline using GitHub Actions
* Steps should include:

  * Install dependencies
  * Run Playwright tests
  * Run Appium tests
  * Generate reports
  * Send notifications (Slack/Email optional)

---

### 7. Cloud Integration

* Integrate with platforms like LambdaTest for:

  * Real device execution
  * Parallel testing

---

### 8. Best Practices

* Avoid hard waits; use smart waits
* Use stable locators (accessibility IDs for mobile)
* Maintain reusable test data strategy
* Ensure framework is easy to extend

---

### 9. Deliverables

* Working sample code for:

  * Playwright mobile web test
  * Appium native app test (Android/iOS)
* Config files
* CI/CD pipeline YAML
* README with setup instructions

---

### 10. Output Expectation

* Provide code snippets
* Explain architecture briefly
* Keep it production-ready and aligned with QA Architect standards
