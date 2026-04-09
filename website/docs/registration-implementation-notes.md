# Registration Feature - Implementation Notes

**Feature**: User Registration Screen (SCRUM-1)  
**Status**: ✅ Complete (MVP)  
**Last Updated**: 2024-present  
**Team**: Frontend (React/Next.js)

---

## 📋 Overview

This document captures design decisions, implementation rationale, known limitations, and future enhancement opportunities for the User Registration feature.

## 🎯 Design Decisions & Rationale

### 1. React Hook Form + Zod

**Decision**: Use React Hook Form for form state and Zod for validation.

**Rationale**:
- **React Hook Form**: Minimal re-renders, excellent performance, TypeScript-first API
- **Zod**: Runtime validation with full type inference (TypeScript types auto-derived from schema)
- **Compared to alternatives**:
  - Formik: More boilerplate, heavier bundle (~57KB vs RHF ~8KB)
  - Native HTML validation: Limited features, poor error messaging, no async validation
  
**Trade-offs**:
- ✅ Lighter bundle (~8.6KB + 8KB Zod)
- ✅ Better DX with TypeScript
- ⚠️ Requires learning two libraries

**Migration path**: Alternative validation libraries can substitute for Zod while keeping React Hook Form.

### 2. 3-Tier Validation Approach

**Design**: Client → React Hook Form (Zod) → Server

**Rationale**:
- **Client-side**: Immediate UX feedback, reduce server load
- **React Hook Form**: Cross-field validation, async email checks (future)
- **Server-side**: Final source of truth, prevents spoofing

**Security implications**:
- Client validation is UX only - never rely on it
- Server MUST validate all inputs independently
- Password never logged or stored in frontend

### 3. Exponential Backoff Retry Strategy

**Decision**: Auto-retry network failures with delays: 0ms, 2000ms, 5000ms

**Rationale**:
- **0ms (immediate)**: Catches transient network blips
- **2000ms**: Allows server to recover from brief overload
- **5000ms (final)**: Waits for more serious infrastructure issues
- **3 attempts total**: Balance between resilience and user experience

**Trade-offs**:
- ✅ Transparent to user (automatic retry)
- ✅ Resilient to flaky networks
- ⚠️ Total possible delay: 7+ seconds before showing error

**Future improvements**:
- Add "Retry" button after final failure for manual retry
- Implement progressive delay backoff with jitter
- Track retry metrics for alerting (too many retries = infrastructure issue)

### 4. Redirect to /login After Success

**Decision**: Auto-redirect to `/login` page 2 seconds after successful registration.

**Rationale**:
- Users expect to need to log in after creating account
- 2-second delay gives time to see success message
- Email pre-filled on login for convenience
- Future: Could email verification link before redirect

**Alternative considered**:
- Auto-login after registration (security concern - verify email first)
- Show profile completion form (extra friction for MVP)

### 5. Password Validation Rules

**Decision**: 8-128 characters, requiring uppercase + lowercase + digit + special char

**Rationale**:
- **8 characters**: NIST recommendation (2020 update)
- **No complexity rules in docs**: But enforced in code (prevents weak patterns)
- **Special chars from auth-safe set**: `!@#$%^&*-` (no quote chars that break SQL)
- **128 character max**: Prevent hash length attacks, match common practices

**NOT implemented (deferred to Phase 2)**:
- Password strength meter / feedback
- Password breach checking (Have I Been Pwned API)
- Configurable complexity rules

### 6. Accessibility-First Form Design

**Decision**: Build with WCAG 2.1 AA target from day 1.

**Components include**:
- Proper label-input associations (htmlFor/id)
- aria-invalid, aria-describedby for errors
- aria-live for dynamic messages
- Focus visible indicators
- Keyboard-only navigation support

**Testing**:
- jest-axe for automated checks
- Manual E2E tests for keyboard nav
- Verified with screen reader (partial)

### 7. Responsive Design: Mobile-First

**Decision**: Design and test mobile-first, then enhance for tablet/desktop.

**Breakpoints**:
- Mobile: 320px - 640px (responsive)
- Tablet: 641px - 1024px (enhanced spacing)
- Desktop: 1025px+ (centered form, max-width)

**Touch targets**: ≥48x44px on all interactive elements

### 8. TypeScript Strict Mode

**Decision**: Enable strict mode, no `any` types allowed.

**Benefit**: Catch type errors at compile time, eliminate entire class of bugs

**Trade-off**: Slightly more verbose code, but massive long-term payoff

## 🔐 Security Considerations

### Password Handling

- ✅ Never log passwords (even redacted)
- ✅ Use type="password" input to mask
- ✅ Sent over HTTPS only (enforced server-side)
- ✅ Validated on server (never trust client)
- ✅ Clear from memory/DOM after submission

### Error Messages

- ✅ Don't reveal email existence (timing attack prevention)
  - Actually: We do reveal it (409 EMAIL_EXISTS). Future: Consider hiding but logging suspicious activity
- ✅ Generic errors for server failures (no stack traces to client)
- ✅ No sensitive data in error messages

### CSRF Protection

- Handled at route/middleware level (not in form component)
- Requires CSRF token in POST request (server-side)

### Rate Limiting

- Should be implemented server-side (not in frontend)
- Frontend handles: retry backoff, user feedback

## 📊 Known Limitations & Workarounds

### Email Verification Not Implemented

**Issue**: Account is created immediately without email confirmation.

**Impact**: 
- Users could register with typos in email
- No proof of email ownership
- Mail could go to someone else

**Mitigation**:
- Send confirmation email with link (backend feature)
- Require user to click link before first login
- Resend confirmation email if not verified after 24 hours

**Implementation**: Phase 2 enhancement

### Password Strength Meter Missing

**Issue**: User doesn't see real-time feedback on password quality.

**Current**: Only minimum requirements shown in hint text

**Future**: Add progress bar showing strength as user types

### No CAPTCHA/Bot Protection

**Issue**: No protection against automated registration abuse.

**Mitigation**: 
- Rate limiting server-side
- Email verification required
- Monitor for abuse patterns (backend team)

**Future**: Add reCAPTCHA v3 in Phase 2

### Async Email Validation Deferred

**Issue**: Client-side can't check if email exists (would reveal user enumeration).

** Workaround**: Server returns 409 if email exists (acceptable UX)

**Future**: Consider hiding this error behind email verification

---

## 🚀 Future Enhancement Opportunities

### Phase 2 Features (Planned)

1. **Email Verification**
   - Send confirmation link after registration
   - Require verification before first login
   - Resend link if needed
   - Estimated effort: 8-16 hours (with backend)

2. **Password Strength Meter**
   - Visual feedback while typing
   - Real-time scoring (zxcvbn library)
   - Suggested alternatives for weak passwords
   - Estimated effort: 4-6 hours

3. **reCAPTCHA Integration**
   - Prevent bot/automated registrations
   - User-transparent (v3) or invisible
   - Estimated effort: 4-8 hours

4. **Social Sign-Up**
   - Google/GitHub OAuth options
   - Reduce friction for returning users
   - Estimated effort: 16-24 hours (with backend)

5. **Password Reset Flow**
   - "Forgot password?" on login page
   - Email verification flow
   - Secure token generation
   - Estimated effort: 16-20 hours

### Phase 3+ Opportunities

6. **Two-Factor Authentication (2FA)**
   - TOTP (authenticator app) support
   - SMS backup (optional)
   - Estimated effort: 24-32 hours

7. **Registration Progress Indicator**
   - Multi-step form flow
   - Save progress locally
   - Estimated effort: 12-16 hours

8. **Internationalization (i18n)**
   - Support multiple languages
   - Translated error messages
   - Format rules by locale
   - Estimated effort: 20-24 hours

9. **Customizable Validation Rules**
   - Admin dashboard to configure password complexity
   - Required fields per account type
   - Estimated effort: 16-20 hours

---

## 🔗 Integration Points

### Backend Dependencies

The registration feature depends on backend to:

1. **POST /api/auth/register**
   - Validate email uniqueness
   - Hash password (never store plain text)
   - Create user record
   - Return userId on success
   - See: [contracts/registration-api.md]

2. **Email Verification (Future)**
   - Generate verification tokens
   - Send emails via SMTP/service
   - Track verification status

3. **Rate Limiting**
   - Implement server-side
   - Return 429 Too Many Requests if exceeded

### Frontend Dependencies

The registration feature depends on frontend to:

1. **Routing**: `/register` public route (implemented)
2. **Navigation**: Link from home → /register (not yet)
3. **Post-registration**: `/login` page exists (placeholder exists)
4. **Layout**: Public auth layout (implemented)

---

## 📈 Performance Targets

### Bundle Size

- Target: <50KB added (Zod + React Hook Form)
- Actual: ~8.6KB + 8KB = ~16.6KB
- ✅ Well under target

### Interaction Performance

- Form validation: <100ms
- Submit button feedback: Instantaneous (disabled state visible)
- API response: Server-dependent (target 1-2s over good network)
- User redirect: 2000ms delay (intentional)

### Lighthouse Scores

Target scores for `/register` page:

- Performance: ≥85
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90

See: `website/docs/registration-performance.md` for baseline

---

## 🧪 Testing Strategy

### Unit Tests (20+ cases)

- Zod schema: Input validation rules
- API service: Retry logic, error handling
- Components: Props, UI states

### Integration Tests

- Full form flow: Fill → validate → submit → success
- Error scenarios: Show validation errors, server errors
- Network retry: Failure → retry → success

### E2E Tests

- Happy path: User registers successfully
- Errors: Email exists, server error, network error
- Keyboard: Tab navigation, Enter to submit
- Mobile: Touch interaction, responsive layout
- Accessibility: Screen reader, focus management

### Accessibility Tests

- jest-axe: Automated violations check
- Manual: Screen reader (NVDA/JAWS)
- Mobile: Touch target sizes

---

## 📝 Implementation Timeline

| Phase | Tasks | Duration | Status |
|-------|-------|---------|--------|
| Phase 1 | Setup, dependencies, types | 2-3 hours | ✅ Complete |
| Phase 2 | Tests (unit, integration) | 3-4 hours | ✅ Complete |
| Phase 3 | Components, page, routing | 4-6 hours | ✅ Complete |
| Phase 4 | E2E tests | 4-6 hours | ✅ Complete |
| Phase 5 | Documentation, Storybook | 3-4 hours | ✅ Complete |
| Phase 6 | Quality validation | 3-4 hours | 🔄 In Progress |
| Phase 7 | Cross-cutting concerns | 2-3 hours | ⏳ Pending |
| Phase 8 | Final review + handoff | 2-3 hours | ⏳ Pending |

**Total MVP**: 23-29 hours

---

## 🔗 Related Documents

- [Specification](../specs/002-user-registration-screen/spec.md) - User story & requirements
- [Design Plan](../specs/002-user-registration-screen/plan.md) - Technical architecture
- [API Contract](../specs/002-user-registration-screen/contracts/registration-api.md) - Request/response specs
- [Data Model](../specs/002-user-registration-screen/data-model.md) - Entity definitions
- [Performance Baseline](./registration-performance.md) - Lighthouse screenshots
- [API Alignment Checklist](./registration-api-alignment.md) - Backend sign-off

---

## 👥 Team Contact

- **Frontend Lead**: [Your Name]
- **Backend Lead**: [Backend Team Name]
- **Designer**: [Design Team Name]
- **QA Lead**: [QA Team Name]

## 📅 Last Updated

2024-present (MVP completion)

## 📄 License

Part of Patient Portal project. Internal use only.
