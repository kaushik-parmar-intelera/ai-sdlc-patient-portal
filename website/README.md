# Patient Portal - Frontend (Next.js 14)

A modern, secure patient registration and authentication system built with Next.js 14, React 18, TypeScript 5, and Tailwind CSS.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Registration Feature](#registration-feature)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Building](#building)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm (recommended) or npm/yarn

### Installation & Running

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000 in your browser
```

## ✨ Features

- ✅ **User Registration**: Full signup flow with validation
- ✅ **Type Safety**: TypeScript 5 with strict mode
- ✅ **Accessibility**: WCAG 2.1 AA compliant
- ✅ **Responsive Design**: Mobile-first from the ground up
- ✅ **Form Validation**: Client-side (Zod) + server-side error handling
- ✅ **Error Resilience**: Exponential backoff retry for network errors
- ✅ **Comprehensive Tests**: Unit, integration, E2E, accessibility
- ✅ **Component Documentation**: Storybook with interactive stories

## 📝 Registration Feature (SCRUM-1)

### Quick Access

The registration page is publicly accessible at `/register`:

```bash
http://localhost:3000/register
```

### Form Fields

| Field | Validation | Example |
|-------|-----------|---------|
| **Full Name** | 2-256 chars, letters/spaces/hyphens/apostrophes | Jane Doe |
| **Email** | Valid RFC 5322 email, must be unique | jane@example.com |
| **Password** | 8-128 chars, uppercase+lowercase+digit+symbol | SecurePass123! |

### Form Behavior

1. **Client-side validation**: Real-time feedback on blur
2. **Server validation**: Email uniqueness check
3. **Auto-retry**: Network errors retry 3x (0ms, 2s, 5s delays)
4. **Success redirect**: Redirects to `/login` after registration
5. **Error persistence**: Form data preserved for correction

### Testing Registration Locally

```bash
# Fill out form with:
Name:     Jane Doe
Email:    jane@example.com
Password: SecurePass123!

# Then click "Sign Up"
# You should see success message and redirect to /login
```

### API Endpoint

**POST** `/api/auth/register`

```bash
# Example request
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePass123!"
  }'
```

**Success (201)**:
```json
{
  "userId": "usr_e7f4c2d9b1a5",
  "email": "jane@example.com",
  "message": "Registration successful"
}
```

**Errors**:
- `400` - Validation failed
- `409` - Email already registered
- `500` - Server error

Full documentation: [contracts/registration-api.md](../specs/002-user-registration-screen/contracts/registration-api.md)

### Accessibility

The registration form is fully accessible:

- ⌨️ **Keyboard Navigation**: Tab, Shift+Tab, Enter
- 👁️ **Screen Reader**: Proper ARIA labels and error announcements
- 🎯 **Focus Management**: Clear focus indicators, logical tab order
- 📱 **Mobile**: Touch-friendly (48x44px minimum targets)
- 🎨 **Color Contrast**: ≥4.5:1 for all text

## 🏗️ Project Structure

```
website/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (public)/           # Public route group
│   │   │   ├── register/       # Registration page
│   │   │   └── layout.tsx      # Shared auth layout
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── atoms/              # Basic UI elements
│   │   │   └── form-input.tsx  # Reusable form input
│   │   └── molecules/          # Compound components
│   │       └── registration-form.tsx
│   ├── schemas/                # Zod validation schemas
│   ├── services/               # Business logic & API
│   │   └── auth/
│   │       └── register.service.ts
│   ├── types/                  # TypeScript type definitions
│   └── mocks/                  # Mock data for tests
│
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   ├── e2e/                    # End-to-end (Playwright)
│   ├── type-verification/      # Type compatibility checks
│   └── verification/           # Schema & type verification
│
├── docs/                       # Documentation
│   ├── registration-*          # Feature-specific docs
│   └── quality-gates.md        # CI/CD requirements
│
└── package.json
```

## 🛠️ Development

### Code Quality

```bash
# Lint code (ESLint + Prettier)
pnpm lint

# Type check
pnpm typecheck

# Format code
pnpm format

# All validation
pnpm validate
```

### Storybook Component Documentation

```bash
# Start Storybook
pnpm storybook

# Open http://localhost:6006
# Browse to Forms > RegistrationForm or Forms > Atoms > FormInput
```

### Project Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run accessibility tests
pnpm test:a11y

# Generate test coverage
pnpm test:coverage
```

## 🧪 Testing

### Test Coverage

Current coverage for registration feature:

- **Unit Tests**: 20+ test cases (validation, API service, components)
- **Integration Tests**: Complete flow testing with mock API
- **E2E Tests**: Browser-based workflows (happy path, errors, accessibility)
- **Accessibility Tests**: jest-axe compliance checks

### Running Tests

```bash
# All tests
pnpm test

# Only registration tests
pnpm test --testPathPattern=registration

# Coverage report
pnpm test:coverage

# E2E tests (requires server running)
pnpm test:e2e

# Watch mode
pnpm test --watch

# Specific file
pnpm test form-input.test.tsx
```

### Test Organization

```
tests/
├── unit/
│   ├── schemas/
│   │   └── registration.schema.test.ts    # Zod validation
│   ├── services/
│   │   └── auth/register.service.test.ts  # API retry logic
│   └── components/                        # React component tests
│
├── integration/
│   └── registration-flow.test.tsx         # Full workflows
│
├── e2e/
│   ├── registration-happy-path.spec.ts    # Success scenarios
│   ├── registration-errors.spec.ts        # Error handling
│   └── registration-accessibility.spec.ts # A11y validation
│
└── type-verification/
    └── auth-types.test.ts                 # TypeScript compatibility
```

## 📦 Building

### Production Build

```bash
# Build (optimizes code, generates .next/)
pnpm build

# Start production server (requires build first)
pnpm start

# Analyze bundle size
pnpm build --analyze
```

### Build Output

The build creates:

- Static pages in `.next/static/`
- Server functions in `.next/server/`
- CSS auto-split and optimized
- JavaScript minified and code-split

## 🔧 Workspace Layout

This is the primary frontend workspace:

- `website/`: Active Next.js implementation (current directory)
- `mobile/`: Mobile app placeholder
- `backend/`: Backend API placeholder

## 🐛 Troubleshooting

### Form shows "Network error"

**Issue**: Form submission fails with network error

**Solutions**:
1. Check internet connection
2. Verify backend API is running and `/api/auth/register` is available
3. Check browser DevTools Network tab for response status
4. Try again (automatic retry happens 3 times)

### "Email already registered" on new email

**Issue**: Getting 409 error for new email address

**Solutions**:
1. Check for leading/trailing spaces in email
2. Verify email isn't actually in the system (ask backend team)
3. Try with different test email

### Form redirects too quickly to see success message

**Solutions**:
1. This is normal - redirects to `/login` after 2 seconds
2. Look for success message briefly
3. Email is pre-filled on `/login` page

### Validation errors not appearing

**Issue**: Submitting form doesn't show error messages

**Solutions**:
1. Errors appear on field blur (click in field then out)
2. Or tab through fields (Tab key)
3. Then submit to see any remaining validation issues
4. Check browser console for JavaScript errors

### SEO or metadata issues

**Issue**: Wrong title/description on registration page

**Solutions**:
1. Metadata is in `app/(public)/register/layout.tsx`
2. Update title/description there
3. Clear browser cache and reload

## 📚 Further Reading

- [Registration Feature Specification](../specs/002-user-registration-screen/spec.md)
- [API Contract Documentation](../specs/002-user-registration-screen/contracts/registration-api.md)
- [Implementation Plan](../specs/002-user-registration-screen/plan.md)
- [JIRA SCRUM-1: User Registration Screen](https://jira.example.com/browse/SCRUM-1)
- [Feature Checklist](./REGISTRATION_FEATURE_CHECKLIST.md)

## 🤝 Contributing

When working on registration feature:

1. **TDD First**: Write tests before implementing
2. **Type Safety**: Use strict TypeScript, no `any` types
3. **Accessibility**: Update a11y tests when changing form behavior
4. **Documentation**: Keep README and inline docs updated
5. **Mobile Testing**: Test on mobile viewport before committing

## 📞 Support

- Check this README for common issues
- Review test files for usage examples
- Storybook stories show component usage
- Check `/specs/002-user-registration-screen/` for design docs
- Contact backend team for API issues
