import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { RegistrationForm } from '@/components/molecules/registration-form';
import { validRegistrationInput, mockResponses } from '@/mocks/auth/register.mock';

/**
 * Integration tests for the complete registration flow
 */
describe('Registration Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  /** Helper to fill out the full valid form */
  async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(/First Name/i), validRegistrationInput.firstName);
    await user.type(screen.getByLabelText(/Last Name/i), validRegistrationInput.lastName);
    await user.type(screen.getByLabelText(/Email Address/i), validRegistrationInput.email);
    await user.type(screen.getByLabelText(/Medical ID/i), validRegistrationInput.medicalId);
    await user.type(screen.getByLabelText(/Choose Password/i), validRegistrationInput.password);
    await user.click(screen.getByRole('checkbox', { name: /terms/i }));
  }

  describe('Happy Path - Successful Registration', () => {
    it('should complete full registration flow from form to success', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.success.response), { status: 201 })
      );

      render(<RegistrationForm />);
      await fillValidForm(user);

      const firstNameInput = screen.getByLabelText(/First Name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement;

      expect(firstNameInput.value).toBe(validRegistrationInput.firstName);
      expect(emailInput.value).toBe(validRegistrationInput.email);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/register',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(validRegistrationInput),
          })
        );
      });

      await waitFor(() => {
        expect(screen.getByText(/success|welcome/i)).toBeInTheDocument();
      });
    });

    it('should clear form after successful registration', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.success.response), { status: 201 })
      );

      const { container } = render(<RegistrationForm />);
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        const textInputs = container.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        textInputs.forEach((input) => {
          expect((input as HTMLInputElement).value).toBe('');
        });
      });
    });
  });

  describe('Client-Side Validation - Error Prevention', () => {
    it('should prevent submission if first name is empty', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm />);

      // Skip first name, fill rest
      await user.type(screen.getByLabelText(/Last Name/i), validRegistrationInput.lastName);
      await user.type(screen.getByLabelText(/Email Address/i), validRegistrationInput.email);
      await user.type(screen.getByLabelText(/Medical ID/i), validRegistrationInput.medicalId);
      await user.type(screen.getByLabelText(/Choose Password/i), validRegistrationInput.password);
      await user.click(screen.getByRole('checkbox', { name: /terms/i }));

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    });

    it('should prevent submission if email is invalid', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm />);

      await user.type(screen.getByLabelText(/First Name/i), validRegistrationInput.firstName);
      await user.type(screen.getByLabelText(/Last Name/i), validRegistrationInput.lastName);
      await user.type(screen.getByLabelText(/Email Address/i), 'not-an-email');
      await user.type(screen.getByLabelText(/Medical ID/i), validRegistrationInput.medicalId);
      await user.type(screen.getByLabelText(/Choose Password/i), validRegistrationInput.password);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText(/invalid|format|valid email/i)).toBeInTheDocument();
      });
    });

    it('should prevent submission if password is weak', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm />);

      await user.type(screen.getByLabelText(/First Name/i), validRegistrationInput.firstName);
      await user.type(screen.getByLabelText(/Last Name/i), validRegistrationInput.lastName);
      await user.type(screen.getByLabelText(/Email Address/i), validRegistrationInput.email);
      await user.type(screen.getByLabelText(/Medical ID/i), validRegistrationInput.medicalId);
      await user.type(screen.getByLabelText(/Choose Password/i), 'Nospecial123');

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText(/password|special|uppercase/i)).toBeInTheDocument();
      });
    });
  });

  describe('Server-Side Error Handling', () => {
    it('should handle EMAIL_EXISTS error gracefully', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.emailExists.response), { status: 409 })
      );

      render(<RegistrationForm />);
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement;
      expect(emailInput.value).toBe(validRegistrationInput.email);

      await waitFor(() => {
        expect(screen.getByText(/email already registered|already exists/i)).toBeInTheDocument();
      });
    });

    it('should handle SERVER_ERROR with user-friendly message', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.serverError.response), { status: 500 })
      );

      render(<RegistrationForm />);
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Unable to create account|try again later/i)).toBeInTheDocument();
      });
    });

    it('should handle VALIDATION_ERROR from server', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.validationError.response), { status: 400 })
      );

      render(<RegistrationForm />);
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/validation|invalid/i)).toBeInTheDocument();
      });
    });
  });

  describe('Network Error Handling with Retry', () => {
    it('should retry on network failure and succeed on retry', async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();

      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(
          new Response(JSON.stringify(mockResponses.success.response), { status: 201 })
        );

      jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<RegistrationForm />);
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      await waitFor(() => {
        expect(screen.getByText(/success|welcome/i)).toBeInTheDocument();
      });

      (console.error as jest.Mock).mockRestore();
      jest.useRealTimers();
    });

    it('should show error if all retries fail', async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<RegistrationForm />);
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      jest.runAllTimers();

      await waitFor(() => {
        expect(screen.getByText(/internet connection|network/i)).toBeInTheDocument();
      });

      (console.error as jest.Mock).mockRestore();
      jest.useRealTimers();
    });
  });

  describe('Form State During Submission', () => {
    it('should disable submit button while request is pending', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve(
          new Response(JSON.stringify(mockResponses.success.response), { status: 201 })
        ), 100))
      );

      render(<RegistrationForm />);
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Multiple Submission Attempts', () => {
    it('should handle resubmission after error', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.emailExists.response), { status: 409 })
      );

      render(<RegistrationForm />);
      await fillValidForm(user);

      let submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement;
      await user.clear(emailInput);

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.success.response), { status: 201 })
      );

      await user.type(emailInput, 'different@example.com');

      submitButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/success|welcome/i)).toBeInTheDocument();
      });
    });
  });
});
