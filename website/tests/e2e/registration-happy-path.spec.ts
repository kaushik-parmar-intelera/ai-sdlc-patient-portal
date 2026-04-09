import { test, expect, Page } from '@playwright/test';

/**
 * E2E Test: Registration Happy Path
 *
 * Tests the complete registration workflow from browser perspective:
 * 1. Navigate to /register
 * 2. Fill form with valid data
 * 3. Submit successfully
 * 4. Verify success message
 * 5. Verify redirect to login
 */

test.describe('Registration Happy Path', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000/register');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should render registration form on /register page', async () => {
    // Check page title
    await expect(page).toHaveTitle(/register|sign up|patient portal/i);

    // Check form fields exist
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Check form labels
    await expect(page.locator('label:has-text("Full Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();

    // Check submit button
    const submitButton = page.locator('button:has-text(/register|sign up/i)');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('should successfully register with valid data', async () => {
    // Fill form with valid data
    await page.fill('input[type="text"]', 'Jane Doe');
    await page.fill('input[type="email"]', 'jane@example.com');
    await page.fill('input[type="password"]', 'SecurePass123!');

    // Submit form
    const submitButton = page.locator('button:has-text(/register|sign up/i)');
    await submitButton.click();

    // Wait for success message
    await expect(page.locator('text=/success|welcome|account created/i')).toBeVisible({
      timeout: 5000,
    });

    // Verify success message contains user info
    const successText = await page.locator('text=/success|welcome|account created/i').innerText();
    expect(successText).toMatch(/Jane|success|welcome/i);
  });

  test('should redirect to /login after successful registration', async () => {
    // Fill and submit form
    await page.fill('input[type="text"]', 'John Doe');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('input[type="password"]', 'SecurePass123!');

    const submitButton = page.locator('button:has-text(/register|sign up/i)');
    await submitButton.click();

    // Wait for navigation to login page (max 5 seconds including potential delay)
    await page.waitForNavigation({ timeout: 7000 });

    // Verify redirected to login
    expect(page.url()).toContain('/login');
  });

  test('should pre-fill email on login page after registration', async () => {
    const testEmail = 'test@example.com';

    // Fill and submit registration form
    await page.fill('input[type="text"]', 'Test User');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'SecurePass123!');

    const submitButton = page.locator('button:has-text(/register|sign up/i)');
    await submitButton.click();

    // Wait for redirect to login
    await page.waitForNavigation({ timeout: 7000 });

    // Verify email field is pre-filled (if implemented)
    const emailInput = page.locator('input[type="email"]');
    const emailValue = await emailInput.inputValue();
    expect(emailValue).toBe(testEmail);
  });

  test('should show loading state during submission', async () => {
    // Fill form
    await page.fill('input[type="text"]', 'Jane Doe');
    await page.fill('input[type="email"]', 'jane@example.com');
    await page.fill('input[type="password"]', 'SecurePass123!');

    // Click submit
    const submitButton = page.locator('button:has-text(/register|sign up/i)');
    await submitButton.click();

    // Check button is disabled during submission
    await expect(submitButton).toBeDisabled();

    // Wait for success and button re-enable
    await expect(page.locator('text=/success|welcome/i')).toBeVisible({ timeout: 5000 });
    await expect(submitButton).toBeEnabled();
  });

  test('should clear form after successful registration', async () => {
    // Fill form
    await page.fill('input[type="text"]', 'Jane Doe');
    await page.fill('input[type="email"]', 'jane@example.com');
    await page.fill('input[type="password"]', 'SecurePass123!');

    // Verify form has values
    const nameInput = page.locator('input[type="text"]');
    let value = await nameInput.inputValue();
    expect(value).toBe('Jane Doe');

    // Submit
    const submitButton = page.locator('button:has-text(/register|sign up/i)');
    await submitButton.click();

    // Wait for success
    await expect(page.locator('text=/success|welcome/i')).toBeVisible({ timeout: 5000 });

    // Verify form is cleared (if implemented - may redirect before visible)
    // This test may not apply if redirect happens immediately
    const nameValue = await nameInput.inputValue();
    // Either cleared or page has redirected
    expect(nameValue).toBe('');
  });

  test('should have proper form semantics', async () => {
    // Check form element exists
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check labels are properly associated
    const fullNameLabel = page.locator('label:has-text("Full Name")');
    const fullNameInput = page.locator('input[type="text"]');

    const labelFor = await fullNameLabel.getAttribute('for');
    const inputId = await fullNameInput.getAttribute('id');

    expect(labelFor).toBe(inputId);
  });

  test('should not allow submission with incomplete form', async () => {
    // Fill only name field
    await page.fill('input[type="text"]', 'Jane Doe');

    // Try to submit
    const submitButton = page.locator('button:has-text(/register|sign up/i)');
    await submitButton.click();

    // Should show validation error instead of success
    const errorText = page.locator('text=/required|invalid|error/i').first();
    await expect(errorText).toBeVisible();

    // Should not navigate
    expect(page.url()).toContain('/register');
  });

  test('should show error for invalid email format', async () => {
    // Fill with invalid email
    await page.fill('input[type="text"]', 'Jane Doe');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'SecurePass123!');

    // Submit
    const submitButton = page.locator('button:has-text(/register|sign up/i)');
    await submitButton.click();

    // Should show error message (not navigate)
    const errorText = page.locator('text=/invalid|error|email/i').first();
    await expect(errorText).toBeVisible();

    expect(page.url()).toContain('/register');
  });

  test('should show error for weak password', async () => {
    // Fill with weak password (no special chars)
    await page.fill('input[type="text"]', 'Jane Doe');
    await page.fill('input[type="email"]', 'jane@example.com');
    await page.fill('input[type="password"]', 'Weakpass123');

    // Submit
    const submitButton = page.locator('button:has-text(/register|sign up/i)');
    await submitButton.click();

    // Should show error
    const errorText = page.locator('text=/password|special|error/i').first();
    await expect(errorText).toBeVisible();

    expect(page.url()).toContain('/register');
  });
});
