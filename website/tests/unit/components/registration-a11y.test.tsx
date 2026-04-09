import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { RegistrationForm } from '@/components/molecules/registration-form';

describe('Registration Form - Accessibility (a11y)', () => {
  describe('Label Association', () => {
    it('should properly associate labels with inputs', () => {
      render(<RegistrationForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const medicalIdInput = screen.getByLabelText(/Medical ID/i);
      const passwordInput = screen.getByLabelText(/Choose Password/i);

      expect(firstNameInput).toHaveAttribute('id');
      expect(lastNameInput).toHaveAttribute('id');
      expect(emailInput).toHaveAttribute('id');
      expect(medicalIdInput).toHaveAttribute('id');
      expect(passwordInput).toHaveAttribute('id');
    });

    it('should mark required fields', () => {
      render(<RegistrationForm />);

      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach((input) => {
        expect(input).toHaveAttribute('required');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should allow tabbing through form fields', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);

      await user.tab();
      expect(firstNameInput).toHaveFocus();

      await user.tab();
      expect(lastNameInput).toHaveFocus();

      await user.tab();
      expect(emailInput).toHaveFocus();
    });

    it('should allow reverting focus with Shift+Tab', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);

      await user.tab();
      await user.tab();
      expect(lastNameInput).toHaveFocus();

      await user.tab({ shift: true });
      expect(firstNameInput).toHaveFocus();
    });

    it('should have skip to main content link when provided', () => {
      const { container } = render(
        <div>
          <a href="#main-content" className="sr-only">Skip to main content</a>
          <RegistrationForm />
        </div>
      );

      const skipLink = container.querySelector('a[href="#main-content"]');
      expect(skipLink).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should focus first input on mount', () => {
      render(<RegistrationForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      expect(firstNameInput).toHaveFocus();
    });

    it('should show error alerts when validation fails', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm />);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should announce success message when form submits successfully', async () => {
      const user = userEvent.setup();
      global.fetch = jest.fn().mockResolvedValueOnce(
        new Response(JSON.stringify({ userId: 'usr_123' }), { status: 201 })
      );

      render(<RegistrationForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Medical ID/i), 'XX-001-002-003');
      await user.type(screen.getByLabelText(/Choose Password/i), 'SecurePass123!');
      await user.click(screen.getByRole('checkbox', { name: /terms/i }));

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper aria-label for input fields', () => {
      render(<RegistrationForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Choose Password/i);

      expect(firstNameInput).toHaveAccessibleName(/First Name/i);
      expect(emailInput).toHaveAccessibleName(/Email Address/i);
      expect(passwordInput).toHaveAccessibleName(/Choose Password/i);
    });

    it('should announce error messages with aria-describedby', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm />);

      await user.type(screen.getByLabelText(/Email Address/i), 'invalid-email');
      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      const emailInput = screen.getByLabelText(/Email Address/i);
      expect(emailInput).toHaveAttribute('aria-describedby');
    });

    it('should use aria-live for dynamic messages', () => {
      const { container } = render(<RegistrationForm />);

      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('should mark loading state with aria-busy', async () => {
      const user = userEvent.setup();
      global.fetch = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve(
          new Response(JSON.stringify({ userId: 'usr_123' }), { status: 201 })
        ), 100))
      );

      render(<RegistrationForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Medical ID/i), 'XX-001-002-003');
      await user.type(screen.getByLabelText(/Choose Password/i), 'SecurePass123!');
      await user.click(screen.getByRole('checkbox', { name: /terms/i }));

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      const form = submitButton.closest('form');
      expect(form).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Form Structure', () => {
    it('should use form element', () => {
      const { container } = render(<RegistrationForm />);

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should have section elements for grouped inputs', () => {
      const { container } = render(<RegistrationForm />);

      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Input Type Attributes', () => {
    it('should use correct input types for accessibility', () => {
      const { container } = render(<RegistrationForm />);

      const emailInput = container.querySelector('input[type="email"]');
      const passwordInput = container.querySelector('input[type="password"]');

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('should use autocomplete attributes', () => {
      const { container } = render(<RegistrationForm />);

      const emailInput = container.querySelector('input[type="email"]');
      const passwordInput = container.querySelector('input[type="password"]');

      expect(emailInput).toHaveAttribute('autocomplete', 'email');
      expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
    });
  });

  describe('Error Announcement', () => {
    it('should announce errors as alert role', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm />);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should announce server errors', async () => {
      const user = userEvent.setup();
      global.fetch = jest.fn().mockResolvedValueOnce(
        new Response(JSON.stringify({ errorCode: 'EMAIL_EXISTS', error: 'Email already exists' }), {
          status: 409,
        })
      );

      render(<RegistrationForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Medical ID/i), 'XX-001-002-003');
      await user.type(screen.getByLabelText(/Choose Password/i), 'SecurePass123!');
      await user.click(screen.getByRole('checkbox', { name: /terms/i }));

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/Email already exists/i);
    });
  });
});
