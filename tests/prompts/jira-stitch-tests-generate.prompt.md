Act as a Senior QA Engineer working on a Playwright + Python automation framework with strong emphasis on scalability, reusability, and maintainability.

## Objective

Analyze the following Jira user stories:
- SCRUM-2
  - Acceptance Criterias to cover in UI tests:
    - 1
    - 2
    - 4
    - 5

Leverage:

- Jira MCP (`.mcp.json`) — for user story details and acceptance criteria
- Design:
  - tests\feature-tests\mobile\mockups\login-screen.html
<!-- - Google Stitch MCP (`.mcp.json`) — for UI/UX design references
  - Note: Relevant designs are available under the ticket (Web + Mobile)
  - Additionally, extract Stitch design URLs directly from Jira tickets where available -->

---

## 1. Test Case Design

For user story:

- Create minimum 3 positive and 2 negative test cases
- Include edge cases wherever applicable
- Each test case must include:

| Field | Description |
|---|---|
| Test Case ID | `TC-SCRUM<N>-P/N<NN>` |
| Title | Short description |
| Preconditions | State before test runs |
| Test Steps | Numbered steps |
| Test Data | Input values |
| Expected Result | Observable outcome |
| Priority | `P0` / `P1` / `P2` |
| Type | `Positive` / `Negative` |

---

## 2. Excel Output

- Generate a single `.xlsx` file
- Create separate sheets per user story
- Ensure:
  - Clean formatting
  - Readability
  - Logical grouping of test cases

---

# 📱 Mobile Automation Framework (Playwright + Appium)

## 📱 3. Mobile Automation Framework

Follow strict framework and architectural guidelines for both:

- Mobile Web → Playwright + Python  
- Mobile Native → Appium + Python  

---

## 🌐 3A. Mobile Web Automation (Playwright + Python)

### 📁 File Naming Convention

```
test_scrum<N>_<feature>_mobile_web.py
```

---

### 🧱 Framework Architecture

- Use Page Object Model (POM)
- Reuse existing page objects from `src/pages/` (extend for mobile responsiveness)
- Maintain separate mobile-specific page classes if UI differs significantly
- Do NOT write selectors directly in test files

---

### 📲 Device Emulation

- Use Playwright device emulation:
  - iPhone 13  
  - Pixel 7  

- Validate:
  - Responsive layouts  
  - Touch interactions  
  - Viewport-specific behavior  

---

### 🧩 Component Abstraction

- Identify mobile-specific UI components:
  - Hamburger menus  
  - Bottom sheets  
  - Mobile dropdowns  
  - Swipeable carousels  

- Create reusable component classes

---

### 🎯 Locator Strategy (Strict Order)

1. getByRole() → primary  
2. Visible text / labels  
3. Placeholder / aria attributes  
4. CSS selectors  
5. XPath (last resort)  

---

### 🧪 Component Helpers

#### Interaction Methods

- tap (mapped to click)  
- fill / input  
- swipe (custom helper)  
- scroll into view  
- long press (if needed)  

#### Assertion Methods

- verify text  
- verify visibility in viewport  
- verify responsive layout changes  
- verify enabled/disabled state  

---

### ⚙️ Test Implementation

- Use reusable component helpers  
- Avoid raw Playwright calls in tests  
- Validate mobile-specific behaviors:
  - Scroll loading  
  - Sticky headers  
  - Hidden menus  

---

### ⏳ Waiting Strategy

- Playwright auto-waiting  
- Avoid hard waits (time.sleep())  

---

## 📱 3B. Mobile Native Automation (Appium + Python)

---

### 📁 File Naming Convention

```
test_scrum<N>_<feature>_mobile_native.py
```

---

### 🧱 Framework Architecture

- Use Page Object Model (POM)
- Maintain page objects under:
  tests/pages/
- Use platform-specific classes if needed:
  - AndroidPage  
  - IOSPage  
- Do NOT write locators in test files  

---

### 📲 Driver Setup

- Use Appium Python Client
- Support:
  - Android (UIAutomator2)  
  - iOS (XCUITest)  

---

### 🧩 Component Abstraction

Create reusable components for:

- Text fields  
- Buttons  
- Dropdowns / pickers  
- Switches / toggles  
- Alerts / dialogs  

---

### 🎯 Locator Strategy (Strict Order)

1. accessibility_id → primary  
2. resource-id  
3. class name  
4. XPath (last resort)  

---

### 🧪 Component Helpers

#### Interaction Methods

- tap  
- send_keys  
- select (picker/dropdown)  
- swipe / scroll  
- hide keyboard  

#### Assertion Methods

- verify text  
- verify element displayed  
- verify selected value  
- verify enabled/disabled  
- validate native component states  

---

### ⚙️ Test Implementation

- Use reusable component helpers  
- Avoid direct driver calls in test files  
- Handle:
  - App lifecycle (launch, background, resume)  
  - Permissions (location, camera, etc.)  

---

### ⏳ Waiting Strategy

- Use explicit waits (WebDriverWait)  
- Avoid time.sleep()  

---

## 🧪 Fixtures

| Fixture | Use case |
|--------|----------|
| mobile_web_page | Playwright mobile web |
| mobile_driver | Appium driver instance |
| logged_in_mobile_user | Authenticated mobile scenarios |

---

## 🏷️ Markers

```python
@pytest.mark.mobile
@pytest.mark.mobile_web
@pytest.mark.mobile_native
@pytest.mark.smoke
@pytest.mark.regression
```

---

## ✅ Assertions

Validate:

- UI text  
- Navigation / screen transitions  
- Component states  
- Visibility  
- Mobile responsiveness (web)  
- Native behaviors (app)  

---

## ⏳ Waiting Strategy (Unified)

- Prefer:
  - Playwright auto-wait (web)  
  - Explicit waits (Appium)  

- Do NOT use:
  - time.sleep()  

---

## 🧱 Base Layer Usage

- Use:
  - BasePage (web)  
  - BaseMobilePage (native)  

- Encapsulate:
  - Click / tap  
  - Input  
  - Visibility checks  

- Do NOT use raw page.* or driver.* in tests  

---

## 🔁 Test Design Principles

- Tests must be:
  - Independent  
  - Idempotent  
  - Environment-agnostic  

- Avoid:
  - Test chaining  
  - Shared state  

---

## 📦 4. Automation Deliverables

For each user story:

- Mobile Web test file  
- Mobile Native test file  
- Page Object updates  
- Component classes  
- Shared helpers/utilities  

---

## ⚠️ 5. Additional Constraints

### Web
data-testid > role > semantic > CSS > XPath

### Native
accessibility_id > id > class > XPath

- Do NOT assume missing requirements  
- Clearly document assumptions  

---

## 📤 6. Final Deliverables

1. Excel file with all test cases  
2. Mobile Web automation (Playwright + Python)  
3. Mobile Native automation (Appium + Python)  
4. Component libraries (web + native)  
5. Summary including:
   - Test coverage  
   - Edge cases  
   - Assumptions  

---

## 🚀 Key Highlights

- Unified QA strategy across web and native  
- Component-driven automation design  
- Platform-specific locator optimization  
- Strong separation of:
  - Test logic  
  - Components  
  - Page objects  

- Built for scalable mobile automation frameworks
