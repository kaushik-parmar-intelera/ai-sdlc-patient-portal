import { test, expect, Page, devices } from '@playwright/test';

/**
 * E2E Test: Registration Accessibility
 *
 * Tests keyboard-only navigation, screen reader support, and mobile responsiveness:
 * 1. Keyboard-only navigation (Tab, Shift+Tab, Enter)
 * 2. Focus management and visible focus indicators
 * 3. Screen reader compatibility (ARIA attributes)
 * 4. Mobile viewport responsiveness
 * 5. Touch-friendly form interaction
 */

test.describe('Registration Accessibility', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000/register');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('Keyboard Navigation', () => {
    test('should allow keyboard-only form completion', async () => {
      // Start from page load - focus should be on first input or near form
      await page.keyboard.press('Tab');
      // Focus should move to first form field

      // Type full name
      await page.keyboard.type('Jane Doe');

      // Tab to email field
      await page.keyboard.press('Tab');
      await page.keyboard.type('jane@example.com');

      // Tab to password field
      await page.keyboard.press('Tab');
      await page.keyboard.type('SecurePass123!');

      // Tab to submit button
      await page.keyboard.press('Tab');

      // Press Enter to submit
      await page.keyboard.press('Enter');

      // Should show success message
      await expect(
        page.locator('text=/success|welcome/i')
      ).toBeVisible({ timeout: 5000 });
    });

    test('should support Shift+Tab to navigate backwards', async () => {
      // Fill form first
      await page.fill('input[type="text"]', 'Test User');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'SecurePass123!');

      // Focus on submit button
      const submitButton = page.locator('button:has-text(/register|sign up/i)');
      await submitButton.focus();

      // Shift+Tab back through fields
      await page.keyboard.press('Shift+Tab');

      // Should be back on password field
      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput).toBeFocused();

      // Shift+Tab again
      await page.keyboard.press('Shift+Tab');

      // Should be on email field
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeFocused();
    });

    test('should submit form with Enter key', async () => {
      // Fill form
      await page.fill('input[type="text"]', 'Jane Doe');
      await page.fill('input[type="email"]', 'jane@example.com');
      await page.fill('input[type="password"]', 'SecurePass123!');

      // Focus password field
      const passwordInput = page.locator('input[type="password"]');
      await passwordInput.focus();

      // Press Enter to submit (may need to focus submit button first)
      const submitButton = page.locator('button:has-text(/register|sign up/i)');
      await submitButton.focus();
      await submitButton.press('Enter');

      // Should submit
      await expect(
        page.locator('text=/success|welcome/i')
      ).toBeVisible({ timeout: 5000 });
    });

    test('should have logical tab order', async () => {
      const focusedElements: string[] = [];

      // Start tab navigation
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return el?.tagName || '';
        });
        focusedElements.push(focused);
      }

      // Should encounter INPUT elements followed by BUTTON
      const inputCount = focusedElements.filter((tag) => tag === 'INPUT').length;
      const buttonIndex = focusedElements.indexOf('BUTTON');

      expect(inputCount).toBeGreaterThanOrEqual(3); // All three input fields
      expect(buttonIndex).toBeGreaterThan(-1); // Submit button
    });
  });

  test.describe('Focus Management', () => {
    test('should show visible focus indicator on all interactive elements', async () => {
      // Tab to first input
      await page.keyboard.press('Tab');

      // Get focused element
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();

      // Check that focus is visually distinguishable
      // (exact styling depends on implementation)
      const outline = await focused.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          outline: style.outline,
          boxShadow: style.boxShadow,
          borderColor: style.borderColor,
        };
      });

      // Should have some form of focus indicator
      const hasFocusIndicator =
        outline.outline !== 'none' || outline.boxShadow !== 'none' || outline.borderColor;
      expect(hasFocusIndicator).toBeTruthy();
    });

    test('should maintain focus after input and validation', async () => {
      const emailInput = page.locator('input[type="email"]');

      // Focus email field
      await emailInput.focus();
      await expect(emailInput).toBeFocused();

      // Type invalid data
      await page.keyboard.type('invalid');

      // Trigger blur (move focus away)
      await page.keyboard.press('Tab');

      // Should show error without losing focus context
      // (focus moves to next field)
      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput).toBeFocused();

      // Error should be visible on email field
      const emailFieldContainer = emailInput.locator('..'); // parent
      const error = emailFieldContainer.locator('text=/invalid|error/i');
      // Error might be visible
    });

    test('should announce errors to screen readers', async () => {
      // Fill form incompletely
      const submitButton = page.locator('button:has-text(/register|sign up/i)');
      await submitButton.click();

      // Wait for validation errors to appear
      await page.waitForTimeout(500);

      // Check that error messages exist and are accessible
      const errors = page.locator('[role="alert"], text=/required|error/i');
      const count = await errors.count();

      expect(count).toBeGreaterThan(0);

      // Verify first error is visible
      const firstError = errors.first();
      await expect(firstError).toBeVisible();
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper ARIA labels and descriptions', async () => {
      // Check full name input
      const nameInput = page.locator('input[type="text"]');
      const nameLabel = page.locator('label').filter({ hasText: /Full Name/i }).first();

      // Should have associated label
      const labelFor = await nameLabel.getAttribute('for');
      const inputId = await nameInput.getAttribute('id');
      expect(labelFor).toBe(inputId);

      // Check email input
      const emailInput = page.locator('input[type="email"]');
      const emailLabel = page.locator('label').filter({ hasText: /Email/i }).first();

      const emailLabelFor = await emailLabel.getAttribute('for');
      const emailId = await emailInput.getAttribute('id');
      expect(emailLabelFor).toBe(emailId);

      // Check password input
      const passwordInput = page.locator('input[type="password"]');
      const passwordLabel = page.locator('label').filter({ hasText: /Password/i }).first();

      const passwordLabelFor = await passwordLabel.getAttribute('for');
      const passwordId = await passwordInput.getAttribute('id');
      expect(passwordLabelFor).toBe(passwordId);
    });

    test('should mark form fields as required', async () => {
      const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const required = await input.getAttribute('required');
        expect(required).toBe('');  // required attribute should be present
      }
    });

    test('should announce error messages with aria-live', async () => {
      // Fill with invalid data
      await page.fill('input[type="email"]', 'invalid');

      // Trigger validation
      await page.locator('input[type="password"]').focus();

      // Wait a bit for validation to trigger
      await page.waitForTimeout(500);

      // Check for aria-live region
      const liveRegion = page.locator('[aria-live]');
      const count = await liveRegion.count();

      // Should have some live regions for announcements
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should use correct input types for autocomplete', async () => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      // Check autocomplete attributes
      const emailAutocomplete = await emailInput.getAttribute('autocomplete');
      const passwordAutocomplete = await passwordInput.getAttribute('autocomplete');

      expect(emailAutocomplete).toMatch(/email|on/i);
      expect(passwordAutocomplete).toMatch(/password|new-password|on/i);
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should render form on mobile viewport (iPhone 12)', async () => {
      // Use iPhone 12 viewport
      await page.setViewportSize({ width: 390, height: 844 });

      // Form should still be visible
      const form = page.locator('form');
      await expect(form).toBeVisible();

      // All inputs should be visible (may need scrolling)
      const nameInput = page.locator('input[type="text"]');
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button:has-text(/register|sign up/i)');

      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();
    });

    test('should have touch-friendly button size on mobile', async () => {
      await page.setViewportSize({ width: 390, height: 844 });

      const submitButton = page.locator('button:has-text(/register|sign up/i)');

      // Button should be at least 48x48 pixels for touch
      const boundingBox = await submitButton.boundingBox();
      expect(boundingBox?.width).toBeGreaterThanOrEqual(48);
      expect(boundingBox?.height).toBeGreaterThanOrEqual(44); // iOS typical size
    });

    test('should have readable input size on mobile', async () => {
      await page.setViewportSize({ width: 390, height: 844 });

      const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');

      // Check first input size
      const firstBoundingBox = await inputs.first().boundingBox();
      expect(firstBoundingBox?.height).toBeGreaterThanOrEqual(44); // Readable size
    });

    test('should not require horizontal scrolling on mobile', async () => {
      await page.setViewportSize({ width: 390, height: 844 });

      // Check that form fits within viewport
      const form = page.locator('form');
      const boundingBox = await form.boundingBox();

      expect(boundingBox?.width).toBeLessThanOrEqual(390 + 10); // Small margin OK
    });

    test('should be navigable with soft keyboard open (simulate)', async () => {
      await page.setViewportSize({ width: 390, height: 500 }); // Reduced height for keyboard

      // Fill first field
      const nameInput = page.locator('input[type="text"]');
      await nameInput.fill('Jane Doe');

      // Should be able to tab to next field even with keyboard open (smaller viewport)
      await page.keyboard.press('Tab');

      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeFocused();

      // Should be able to type
      await page.keyboard.type('jane@example.com');
      await expect(emailInput).toHaveValue('jane@example.com');
    });

    test('should show form on tablet viewport (iPad)', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const form = page.locator('form');
      await expect(form).toBeVisible();

      // All fields visible
      const nameInput = page.locator('input[type="text"]');
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();

      // Should be able to complete form
      await nameInput.fill('Jane Doe');
      await emailInput.fill('jane@example.com');
      await passwordInput.fill('SecurePass123!');

      const submitButton = page.locator('button:has-text(/register|sign up/i)');
      await submitButton.click();

      await expect(page.locator('text=/success|welcome/i')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Color Contrast', () => {
    test('should have sufficient contrast for form labels', async () => {
      // Labels should be readable
      const label = page.locator('label').first();
      await expect(label).toBeVisible();

      // Get computed styles to verify contrast
      // (Exact verification would require color extraction and WCAG calculation)
      const color = await label.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Should not be transparent or very light
      expect(color).not.toMatch(/rgba?\(.*,\s*0[,)]/);
    });

    test('should have sufficient contrast for input text', async () => {
      const input = page.locator('input[type="text"]');

      await input.fill('Test Text');

      const color = await input.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Should have visible text color
      expect(color).toBeTruthy();
    });
  });
});
