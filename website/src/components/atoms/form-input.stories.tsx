import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FormInput } from './form-input';

/**
 * FormInput Storybook Stories
 *
 * Visual documentation for the FormInput atom component
 * Demonstrates:
 * - Default input state
 * - With error message
 * - Disabled state
 * - Focus state
 * - Password input type
 * - Mobile/touch-friendly sizing
 * - Accessibility features
 */

const meta = {
  title: 'Forms/Atoms/FormInput',
  component: FormInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
  },
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default input: Text field with label
 * 
 * Features:
 * - Label properly associated with input
 * - Clear placeholder text
 * - Focus styling
 * - Accessible state
 */
export const Default: Story = {
  args: {
    label: "Full Name",
    type: "text",
    placeholder: "John Doe",
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FormInput
        {...args}
        label="Full Name"
        type="text"
        placeholder="John Doe"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

/**
 * Email input type
 * 
 * Features:
 * - Email-specific input type
 * - Native browser validation (partial)
 * - Mobile keyboard shows @ symbol
 * - Autocomplete hint for email
 */
export const EmailInput: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FormInput
        {...args}
        label="Email Address"
        type="email"
        placeholder="user@example.com"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="email"
        required
      />
    );
  },
};

/**
 * Password input type
 * 
 * Features:
 * - Text masked with dots/asterisks
 * - Password-specific autocomplete
 * - Secure input handling
 * - Hint text explaining requirements
 */
export const PasswordInput: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FormInput
        {...args}
        label="Password"
        type="password"
        placeholder="••••••••••••"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        hint="At least 8 characters with uppercase, lowercase, number, and symbol"
        autoComplete="new-password"
        required
      />
    );
  },
};

/**
 * With error message
 * 
 * Demonstrates:
 * - Error styling (red border)
 * - Error text display
 * - aria-invalid and aria-describedby
 * - Clear error messaging
 */
export const WithError: Story = {
  args: {
    label: 'Username',
    value: '',
    error: 'Username is required',
  },
  render: (args) => {
    const [value, setValue] = useState('invalid');
    return (
      <FormInput
        {...args}
        label="Email Address"
        type="email"
        placeholder="user@example.com"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error="Please enter a valid email address"
        required
      />
    );
  },
};

/**
 * Disabled state
 * 
 * Demonstrates:
 * - Disabled input styling
 * - Grayed out appearance
 * - User cannot interact
 * - Common for form submission pending state
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    disabled: true,
    value: 'This field is disabled',
  },
  render: (args) => {
    const [value, setValue] = useState('John Doe');
    return (
      <FormInput
        {...args}
        label="Full Name"
        type="text"
        placeholder="John Doe"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled
      />
    );
  },
};

/**
 * With hint/help text
 * 
 * Features:
 * - Helpful text under label
 * - Explains field purpose or requirements
 * - Smaller, secondary font styling
 * - Accessible to screen readers
 */
export const WithHint: Story = {
  args: {
    label: 'First Name',
    hint: 'Your full first name as it appears on your ID',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FormInput
        {...args}
        label="Username"
        type="text"
        placeholder="john_doe"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        hint="3-20 characters, letters and numbers only"
        required
      />
    );
  },
};

/**
 * With error and hint
 * 
 * Demonstrates:
 * - How hint and error appear together
 * - Hint above input, error below
 * - Clear visual hierarchy
 */
export const WithErrorAndHint: Story = {
  args: {
    label: 'Phone Number',
    error: 'Invalid phone format',
    hint: 'Format: (555) 123-4567',
  },
  render: (args) => {
    const [value, setValue] = useState('ab');
    return (
      <FormInput
        {...args}
        label="Username"
        type="text"
        placeholder="john_doe"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        hint="3-20 characters, letters and numbers only"
        error="Username must be at least 3 characters"
        required
      />
    );
  },
};

/**
 * Required field indicator
 * 
 * Demonstrates:
 * - Asterisk showing required field
 * - HTML required attribute
 * - Clear indication to user
 */
export const Required: Story = {
  args: {
    label: 'Email Address',
    required: true,
    placeholder: 'your@email.com',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FormInput
        {...args}
        label="Full Name"
        type="text"
        placeholder="John Doe"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
    );
  },
};

/**
 * Optional field (no asterisk)
 * 
 * Demonstrates:
 * - Field without required indicator
 * - Optional form fields
 */
export const Optional: Story = {
  args: {
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(555) 000-0000',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FormInput
        {...args}
        label="Phone Number"
        type="text"
        placeholder="555-0123"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={false}
      />
    );
  },
};

/**
 * Mobile/Touch-friendly sizing
 * 
 * Demonstrates:
 * - Readable input size on mobile
 * - Touch-friendly target area (44+ pixels)
 * - Responsive font sizing
 */
export const Mobile: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search patients...',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FormInput
        {...args}
        label="Full Name"
        type="text"
        placeholder="John Doe"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Focus state
 * 
 * Demonstrates:
 * - Focus ring visible
 * - Border color change
 * - Keyboard navigation visible
 * - Accessible focus indicator
 */
export const Focused: Story = {
  args: {
    label: 'Focus input',
    autoFocus: true,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div onClick={(e) => {
        const input = e.currentTarget.querySelector('input');
        input?.focus();
      }}>
        <FormInput
          {...args}
          autoFocus
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/**
 * Dark mode
 * 
 * Demonstrates:
 * - Input styling in dark theme
 * - Text contrast in dark background
 * - Error colors adjusted for dark theme
 */
export const DarkMode: Story = {
  args: {
    label: 'Dark Mode Input',
    placeholder: 'Enter text',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div className="bg-gray-900 p-8 rounded-lg">
        <FormInput
          {...args}
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/**
 * Accessibility with all attributes
 * 
 * Demonstrates:
 * - Proper ARIA labels
 * - aria-invalid for error state
 * - aria-describedby linking to error
 * - Screen reader friendly
 */
export const Accessible: Story = {
  args: {
    label: 'Date of Birth',
    type: 'date',
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState('invalid');
    return (
      <FormInput
        {...args}
        id="email-field"
        label="Email Address"
        type="email"
        placeholder="user@example.com"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error="Invalid email format"
        aria-label="Enter your email address"
        required
      />
    );
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
        ],
      },
    },
  },
};

/**
 * Different input types
 * 
 * Showcases multiple input types available
 */
export const InputTypes: Story = {
  args: {
    label: 'Text Input',
  },
  render: () => {
    const [values, setValues] = useState({
      text: '',
      email: '',
      password: '',
      number: '',
    });

    return (
      <div className="space-y-6">
        <FormInput
          label="Text Input"
          type="text"
          value={values.text}
          onChange={(e) => setValues({ ...values, text: e.target.value })}
        />
        <FormInput
          label="Email Input"
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <FormInput
          label="Password Input"
          type="password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <FormInput
          label="Number Input"
          type="number"
          value={values.number}
          onChange={(e) => setValues({ ...values, number: e.target.value })}
        />
      </div>
    );
  },
};
