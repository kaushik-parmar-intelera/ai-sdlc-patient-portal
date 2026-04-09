import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { FormInput } from '@/components/atoms/form-input';

describe('FormInput Component', () => {
  describe('Rendering', () => {
    it('should render input element with correct type', () => {
      render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render label correctly linked to input', () => {
      render(
        <FormInput
          label="Full Name"
          type="text"
          value=""
          onChange={() => {}}
          id="fullName"
        />
      );

      const label = screen.getByText('Full Name');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'fullName');
      expect(input).toHaveAttribute('id', 'fullName');
    });

    it('should display placeholder when provided', () => {
      render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
          placeholder="user@example.com"
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('user@example.com');
    });
  });

  describe('Value Binding', () => {
    it('should display provided value', () => {
      render(
        <FormInput
          label="Email"
          type="email"
          value="test@example.com"
          onChange={() => {}}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('test@example.com');
    });

    it('should call onChange when user types', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'test@example.com');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Error Display', () => {
    it('should display error message when error prop is provided', () => {
      render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
          error="Invalid email format"
        />
      );

      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('should apply error styling to input when error exists', () => {
      const { container } = render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
          error="Invalid email format"
        />
      );

      const input = container.querySelector('input');
      expect(input).toHaveClass('border-red-500');
    });

    it('should not display error message when error is undefined', () => {
      render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
        />
      );

      const errorElement = screen.queryByText(/Invalid|Error/);
      expect(errorElement).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled prop is true', () => {
      render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
          disabled={true}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('should not call onChange when disabled', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={onChange}
          disabled={true}
        />
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'test@example.com');

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Attributes', () => {
    it('should have proper type attribute for screen readers', () => {
      render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should have aria-label when provided', () => {
      render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
          aria-label="Enter your email address"
        />
      );

      const input = screen.getByLabelText('Enter your email address');
      expect(input).toBeInTheDocument();
    });

    it('should have aria-describedby when error is present', () => {
      const { container } = render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
          error="Invalid email"
          id="email"
        />
      );

      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('should announce required state', () => {
      const { container } = render(
        <FormInput
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
          required={true}
        />
      );

      const input = container.querySelector('input');
      expect(input).toHaveAttribute('required');
    });
  });

  describe('Password Input Type', () => {
    it('should render password input with correct type', () => {
      const { container } = render(
        <FormInput
          label="Password"
          type="password"
          value=""
          onChange={() => {}}
        />
      );

      const input = container.querySelector('input');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('Input Masking (Password)', () => {
    it('should mask password characters', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <FormInput
          label="Password"
          type="password"
          value=""
          onChange={() => {}}
        />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      await user.type(input, 'MySecurePass123!');

      // Input value should not be readable as plain text
      expect(input.type).toBe('password');
    });
  });
});
