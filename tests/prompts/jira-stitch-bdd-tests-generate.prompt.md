Act as a Senior QA Engineer working on a Playwright + Python automation framework with strong emphasis on scalability, reusability, and maintainability.

## Objective

Analyze the following Jira user stories:
- SCRUM-2

Leverage:

- **Jira MCP** (`.mcp.json`) — for user story details and acceptance criteria
- **Google Stitch MCP** (`.mcp.json`) — for UI/UX design references
  - Note: Relevant designs are available under the ticket (Web + Mobile)
  - Additionally, extract Stitch design URLs directly from Jira tickets where available

---

## 1. Test Case Design

For each user story:

- Create minimum **3 positive** and **2 negative** test cases
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
- Create **separate sheets per user story**
- Ensure:
  - Clean formatting
  - Readability
  - Logical grouping of test cases

---

## 3. UI Automation (Playwright + Python)

Follow strict framework and architectural guidelines:

### File Naming Convention

```
test_scrum<N>_<feature>_ui.py
```

### Framework Architecture

- Use **Page Object Model (POM)**
- Reuse existing page objects from `src/pages/` (extend where required)
- **Do NOT** write selectors directly in test files

### 3.1 Component Abstraction

- Identify UI component types from Stitch designs (e.g., input fields, dropdowns, buttons, modals, tables)
- Create reusable component classes for each type

### 3.2 Locator Strategy (strict order)

Since element IDs may not be available:

1. `getByRole()` — primary and preferred
2. Accessible labels / visible text
3. Placeholder / aria attributes
4. CSS selectors (only if necessary)
5. XPath (last resort)

### 3.3 Component Helpers

Create reusable helpers for:

**Interaction Methods**
- `click`
- `fill` / `input`
- `select` dropdown values
- `toggle` / checkbox actions

**Assertion Methods**
- Verify text
- Verify value
- Verify selected option
- Verify visibility
- Verify enabled/disabled state
- Validate component-specific states

### 3.4 Test Implementation

- Use the above component helpers to build test flows
- Avoid direct low-level Playwright calls in test files

### Fixtures

| Fixture | Use case |
|---|---|
| `logged_in_page` | Authenticated scenarios |
| `page` | Unauthenticated scenarios |

### Markers

```python
@pytest.mark.ui
@pytest.mark.smoke       # critical paths
@pytest.mark.regression  # broader coverage
```

### Assertions

Validate:
- UI text
- URLs
- Component states
- Visibility

### Waiting Strategy

- Use Playwright auto-waiting
- Use `wait_for_selector` only when necessary
- **Do NOT** use `time.sleep()`

### BasePage Usage

- Use `BasePage` methods: `click`, `fill`, `is_visible`, etc.
- **Do NOT** use `self.page.*` directly in tests

### Test Design Principles

- Tests must be **independent** and **idempotent**
- Avoid inter-test dependencies

---

## 4. Automation Deliverables

For each user story:

- Test file (`test_scrum<N>_<feature>_ui.py`)
- Page Object updates (if required)
- Component classes
- Reusable helpers/utilities

---

## 5. Additional Constraints

- Prefer stable selectors: `data-testid` > `role` > semantic > CSS > XPath
- **Do NOT** assume missing requirements
- Explicitly document assumptions if any

---

## 6. Final Deliverables

1. Excel file with all test cases
2. Playwright automation code (framework-compliant)
3. Component library (reusable UI abstractions)
4. Summary including:
   - Test coverage per user story
   - Identified edge cases
   - Assumptions made
