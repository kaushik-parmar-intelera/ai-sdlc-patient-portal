# Quickstart: User Registration Screen Development

**Phase**: Phase 1 (Design & Contracts)  
**Date**: 2026-04-08  
**For**: Frontend developers implementing SCRUM-1 registration screen  
**Duration**: Expected 2-3 days from feature kickoff to Phase 2 (task generation)

---

## Overview

This guide walks you through implementing the User Registration Screen for the patient portal. By the end, you'll have:

- ✅ RegistrationForm component with Zod + React Hook Form validation
- ✅ API integration service pointing to `/api/auth/register`
- ✅ Success/error handling flows
- ✅ WCAG 2.1 AA accessible form
- ✅ Unit + integration tests (TDD approach)
- ✅ Storybook stories for QA/design review

---

## Prerequisites

### System Setup

```bash
# Verify Node.js 20+
node --version   # should be v20.0.0 or higher

# Verify pnpm package manager
pnpm --version   # should be 8.0.0 or higher
```

### Repository Setup

```bash
cd /Volumes/Workspace/IntelERA/Spec-kit/ai-sdlc-patient-portal

# Install dependencies (already done in 001-website-project-setup)
cd website && pnpm install

# Start dev server for live reloading
pnpm dev
# Opens http://localhost:3000
```

### Required Reading

Before starting, read these documents in order:

1. **spec.md** (5 min) — Feature requirements from SCRUM-1
2. **data-model.md** (10 min) — Data types, validation schema, state machine
3. **contracts/registration-api.md** (10 min) — API request/response format
4. **research.md** (5 min) — Technology decisions (React Hook Form, Zod, route naming)

---

## Step 1: Install Dependencies

### Add Required Packages

The following packages enable the form implementation:

```bash
cd website

# Form handling (lightweight, hook-based)
pnpm add react-hook-form

# Schema validation (TypeScript-first)
pnpm add zod

# Bridge: React Hook Form + Zod integration
pnpm add @hookform/resolvers

# (Optional) Form feedback in tests
pnpm add -D @testing-library/user-event
```

### Verify Installation

```bash
pnpm list react-hook-form zod @hookform/resolvers

# Should show:
# react-hook-form@7.x.x (or latest 7+)
# zod@3.x.x (or latest 3+)
# @hookform/resolvers@3.x.x (or latest 3+)
```

### Update package.json

Add to `website/package.json` devDependencies (for form testing):

```json
{
  "devDependencies": {
    "@testing-library/user-event": "^14.5.2"
  }
}
```

---

## Step 2: Create the Validation Schema

File: `website/src/schemas/registration.schema.ts`

```typescript
import { z } from 'zod';

/**
 * Zod schema for user registration form validation.
 * Shared between client-side (real-time feedback) and backend (authoritative validation).
 */
export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(256, 'Name must not exceed 256 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email must not exceed 254 characters'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character'),
});

/**
 * Inferred TypeScript type from schema (full type safety).
 * Use: const form = useForm<RegistrationInput>({ ... })
 */
export type RegistrationInput = z.infer<typeof registrationSchema>;

/**
 * Validator utility function (optional: for exporting to backend).
 */
export const validateRegistration = (data: unknown) => {
  return registrationSchema.safeParse(data);
};
```

### Test the Schema

```bash
cd website && pnpm test -- src/schemas/registration.schema.test.ts
```

Create `website/src/schemas/registration.schema.test.ts`:

```typescript
import { registrationSchema } from './registration.schema';

describe('Registration Schema', () => {
  test('accepts valid input', () => {
    const data = {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'SecurePass123!',
    };
    expect(registrationSchema.parse(data)).toEqual(data);
  });

  test('rejects short name', () => {
    const result = registrationSchema.safeParse({
      fullName: 'J',
      email: 'jane@example.com',
      password: 'SecurePass123!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        'Name must be at least 2 characters'
      );
    }
  });

  test('rejects weak password', () => {
    const result = registrationSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password', // lowercase only
    });
    expect(result.success).toBe(false);
  });
});
```

---

## Step 3: Create Type Definitions

File: `website/src/types/auth.types.ts`

```typescript
/**
 * Registration form input (validated by Zod schema).
 */
export interface RegistrationInput {
  fullName: string;
  email: string;
  password: string;
}

/**
 * Successful registration response from server (201 Created).
 */
export interface RegistrationSuccess {
  userId: string;
  email: string;
  message: string;
}

/**
 * Registration error response from server (400, 409, 500, etc.).
 */
export interface RegistrationError {
  error: string;
  errorCode: string;
  field?: string;
}

/**
 * Form submission state.
 */
export type FormState = 'idle' | 'submitting' | 'success' | 'error';
```

---

## Step 4: Create the API Service

File: `website/src/services/auth/register.service.ts`

```typescript
import { RegistrationInput, RegistrationSuccess, RegistrationError } from '@/types/auth.types';

/**
 * Service for calling the registration API endpoint.
 * Encapsulates HTTP client logic; returns typed responses or errors.
 */
export async function registerUser(
  input: RegistrationInput
): Promise<RegistrationSuccess | RegistrationError> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (response.ok) {
      // 201 Created: registration successful
      return data as RegistrationSuccess;
    }

    // 4xx or 5xx: error response
    return data as RegistrationError;
  } catch (error) {
    // Network error or JSON parse error
    return {
      error: 'Unable to create account. Please check your internet connection and try again.',
      errorCode: 'NETWORK_ERROR',
    };
  }
}
```

### Test the Service (with mocks)

```typescript
// website/src/services/auth/register.service.test.ts
import { registerUser } from './register.service';

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('returns success on 201', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          userId: 'usr_123',
          email: 'test@example.com',
          message: 'Account created successfully',
        }),
        { status: 201 }
      )
    );

    const result = await registerUser({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Pass123!',
    });

    expect(result).toHaveProperty('userId');
    expect(result.userId).toBe('usr_123');
  });

  test('returns error on 409 (email exists)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Email already registered.',
          errorCode: 'EMAIL_EXISTS',
          field: 'email',
        }),
        { status: 409 }
      )
    );

    const result = await registerUser({
      fullName: 'Another User',
      email: 'existing@example.com',
      password: 'Pass123!',
    });

    expect(result).toHaveProperty('errorCode');
    expect(result.errorCode).toBe('EMAIL_EXISTS');
  });

  test('handles network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    const result = await registerUser({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Pass123!',
    });

    expect(result.errorCode).toBe('NETWORK_ERROR');
  });
});
```

---

## Step 5: Create Form Components

### FormInput Component (Reusable Atom)

File: `website/src/components/atoms/form-input.tsx`

```typescript
'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  [key: string]: any; // Allows React Hook Form to spread props
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      type = 'text',
      placeholder,
      error,
      disabled = false,
      required = false,
      autoComplete,
      ...rest
    },
    ref
  ) => {
    const errorId = `${id}-error`;

    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>

        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full px-3 py-2 border rounded-md text-sm
            focus:outline-none focus:ring-2 focus-visible:ring-blue-500
            ${
              error
                ? 'border-red-500 text-red-900'
                : 'border-gray-300 text-gray-900'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          {...rest}
        />

        {error && (
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="mt-1 text-sm text-red-600"
          >
            {error.message}
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
```

### RegistrationForm Component

File: `website/src/components/forms/registration-form.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { registrationSchema, type RegistrationInput } from '@/schemas/registration.schema';
import { registerUser } from '@/services/auth/register.service';
import { RegistrationSuccess, RegistrationError, FormState } from '@/types/auth.types';
import { FormInput } from '@/components/atoms/form-input';

export function RegistrationForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>('idle');
  const [serverError, setServerError] = useState<RegistrationError | null>(null);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange', // Validate on every change (real-time feedback)
  });

  const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = form;

  async function onSubmit(data: RegistrationInput) {
    setServerError(null);
    setFormState('submitting');

    const response = await registerUser(data);

    // Check if response is success or error
    if ('userId' in response) {
      // Success (201)
      setFormState('success');
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 2000);
    } else {
      // Error
      setFormState('error');
      setServerError(response);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Create Account</h1>

      {/* Server error banner */}
      {serverError && (
        <div
          role="alert"
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800"
        >
          {serverError.error}
        </div>
      )}

      {/* Success banner */}
      {formState === 'success' && (
        <div
          role="alert"
          className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800"
        >
          Account created successfully! Redirecting to login...
        </div>
      )}

      {/* Form inputs */}
      <FormInput
        id="fullName"
        label="Full Name"
        placeholder="Jane Doe"
        error={errors.fullName}
        disabled={isSubmitting}
        required
        {...register('fullName')}
      />

      <FormInput
        id="email"
        label="Email"
        type="email"
        placeholder="jane@example.com"
        error={errors.email}
        disabled={isSubmitting}
        required
        autoComplete="email"
        {...register('email')}
      />

      <FormInput
        id="password"
        label="Password"
        type="password"
        placeholder="Enter a strong password"
        error={errors.password}
        disabled={isSubmitting}
        required
        autoComplete="new-password"
        {...register('password')}
      />

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`
          w-full py-2 px-4 font-medium rounded-md text-white
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${
            isValid && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      {/* Helper text */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
```

---

## Step 6: Create the Page Component

File: `website/src/app/(public)/register/page.tsx`

```typescript
import { RegistrationForm } from '@/components/forms/registration-form';

export const metadata = {
  title: 'Create Account | Patient Portal',
  description: 'Register for a new patient account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <RegistrationForm />
    </div>
  );
}
```

---

## Step 7: Add to Route Definitions

Update `website/src/routes/route-definitions.ts`:

```typescript
export const routeDefinitions: RouteDefinition[] = [
  // ... existing routes
  {
    id: 'register',
    path: '/register',
    group: 'public',
    layout: 'public',
    preloadPolicy: 'lazy',
    requiredPermissions: [],
  },
];
```

---

## Step 8: Write Tests (TDD Approach)

### Unit Test: RegistrationForm Component

File: `website/tests/unit/registration-form.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from '@/components/forms/registration-form';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/services/auth/register.service');

describe('RegistrationForm', () => {
  test('renders form fields', () => {
    render(<RegistrationForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('disables submit button until all fields valid', async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole('button', { name: /create account/i });
    expect(submitButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass123!');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  test('shows error for invalid email', async () => {
    render(<RegistrationForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    fireEvent.blur(screen.getByLabelText(/email/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });
});
```

### Integration Test: Registration Flow

File: `website/tests/integration/registration-flow.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from '@/components/forms/registration-form';
import * as registerService from '@/services/auth/register.service';

jest.mock('@/services/auth/register.service');

const mockRegisterUser = registerService.registerUser as jest.MockedFunction<
  typeof registerService.registerUser
>;

describe('Registration Flow', () => {
  test('successful registration redirects to login', async () => {
    const mockPush = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
    }));

    mockRegisterUser.mockResolvedValueOnce({
      userId: 'usr_123',
      email: 'test@example.com',
      message: 'Account created successfully',
    });

    render(<RegistrationForm />);

    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass123!');

    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    });

    // Note: router.push would be called after 2s delay
  });

  test('email exists error shows message', async () => {
    mockRegisterUser.mockResolvedValueOnce({
      error: 'Email already registered.',
      errorCode: 'EMAIL_EXISTS',
      field: 'email',
    });

    render(<RegistrationForm />);

    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass123!');

    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
    });
  });
});
```

---

## Step 9: Verify Accessibility

Run accessibility checks:

```bash
cd website

# Install jest-axe if not already
pnpm add -D jest-axe

# Run tests with accessibility checks
pnpm test -- --testNamePattern="accessibility"
```

Create `website/tests/unit/registration-a11y.test.tsx`:

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RegistrationForm } from '@/components/forms/registration-form';

expect.extend(toHaveNoViolations);

describe('Registration Form - Accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(<RegistrationForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Step 10: Run the Application

```bash
cd website

# Start dev server
pnpm dev

# Navigate to http://localhost:3000/register
# Test the form with valid and invalid inputs
# Verify real-time validation feedback
# Verify error and success states
```

---

## Step 11: Create Storybook Stories

File: `website/src/components/forms/registration-form.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { RegistrationForm } from './registration-form';

const meta: Meta<typeof RegistrationForm> = {
  title: 'Forms/RegistrationForm',
  component: RegistrationForm,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  decorators: [
    (Story) => (
      <>
        <Story />
        <p className="mt-4 text-sm text-gray-600">
          Simulated with mocked error state (see code)
        </p>
      </>
    ),
  ],
};
```

```bash
# Build and view Storybook
cd website && pnpm storybook
# Opens http://localhost:6006
```

---

## Step 12: Validate Against Constitution

Ensure implementation adheres to project principles:

- [ ] **Code Quality (Principle I)**
  - ✅ ESLint passes: `pnpm lint`
  - ✅ No duplication: max 3 LOC
  - ✅ Complexity ≤5 per function

- [ ] **TDD (Principle II)**
  - ✅ Tests written first, run failing before code
  - ✅ Unit tests: `coverage/unit/`
  - ✅ Integration tests: `coverage/integration/`
  - ✅ Coverage ≥80%: `pnpm test:coverage`

- [ ] **UX Consistency (Principle III)**
  - ✅ Tailwind CSS + design tokens used
  - ✅ WCAG 2.1 AA accessibility verified
  - ✅ Keyboard navigation tested

- [ ] **Performance (Principle IV)**
  - ✅ Bundle <50KB impact
  - ✅ Lighthouse score ≥85
  - ✅ Form interaction ≤100ms

---

## Checklist

- [ ] Dependencies installed (react-hook-form, zod, @hookform/resolvers)
- [ ] Validation schema created (`registration.schema.ts`)
- [ ] Type definitions created (`auth.types.ts`)
- [ ] API service created (`register.service.ts`)
- [ ] Form components created (FormInput, RegistrationForm)
- [ ] Page component created (`/register/page.tsx`)
- [ ] Routes updated with `/register` path
- [ ] Tests written and passing (unit + integration + a11y)
- [ ] Accessibility verified (jest-axe passing)
- [ ] Storybook stories created
- [ ] Lint passing: `pnpm lint`
- [ ] Build passing: `pnpm build`
- [ ] Tests passing: `pnpm test:coverage`

---

## Troubleshooting

### React Hook Form not recognizing Zod schema

**Problem**: TypeScript error: `zodResolver is not a function`

**Solution**:
```bash
pnpm add @hookform/resolvers
```

### Form inputs not updating

**Problem**: User types but no value appears in input

**Solution**: Ensure `mode: 'onChange'` in useForm config
```typescript
const form = useForm<RegistrationInput>({
  resolver: zodResolver(registrationSchema),
  mode: 'onChange', // ← Add this
});
```

### Tests failing with "Cannot find module '@/components/...'"

**Problem**: Jest can't resolve path aliases

**Solution**: Verify `jest.config.mjs` has:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### API endpoint returns 404 on submit

**Problem**: `/api/auth/register` not found

**Solution**:
1. Check frontend URL is correct in `register.service.ts`
2. Verify backend endpoint is deployed
3. Use mock service for local development (see data-model.md mockups)

---

## Next Steps

Once this feature is complete:

1. **Phase 2**: Generate tasks.md via `/speckit.tasks` command
2. **Phase 3**: Implementation execution (likely T022-T031 in 001-website-project-setup)
3. **Phase 4**: E2E testing + design QA review
4. **Phase 5**: Backend API alignment + staging deployment

---

## References

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [WCAG 2.1 AA Form Patterns](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html)
- [Tailwind CSS Accessibility](https://tailwindcss.com/docs/accessibility)
- [Jest Testing Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)

---

## Support

For questions or blockers:

1. Check the **Research Findings** (research.md) for technology decisions
2. Review **API Contract** (contracts/registration-api.md) for backend alignment
3. Post in project Slack #frontend-support channel
4. Reference SCRUM-1 for business requirements
