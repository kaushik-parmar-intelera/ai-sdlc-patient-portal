# Research: Login API Integration

## 1. Axios Client Generalization

**Decision**: Extend `axiosClient` to handle login errors without changing its existing `RegistrationError` references; introduce `LoginError` as a parallel type alias in `auth.types.ts` with the same shape `{ errorCode, error, field? }`.  
**Rationale**: The `axiosClient` response interceptor normalizes all non-envelope errors into `{ errorCode, error, field? }`. Since `LoginError` and `RegistrationError` share identical shapes, duplicating the error interceptor is unnecessary. Adding `LoginError` as a type alias preserves the existing typed surface while giving the login service its own distinct return type.  
**Alternatives considered**:
- Rename `RegistrationError` → `ApiError` globally: Would break all existing typed tests; too wide a refactor for one ticket
- Single shared `ApiError`: Clean long-term, but premature generalization before a third endpoint exists
- Use `RegistrationError` in login service: Semantically confusing naming

---

## 2. Login Proxy Route — Real Backend vs Mock

**Decision**: Replace mock `TEST_USERS` in `/api/auth/login/route.ts` with a thin proxy to `http://localhost:8080/api/v1/auth/login`. Preserve the `auth_session` httpOnly cookie on success.  
**Rationale**:
- The existing route already handles the response-to-cookie mapping pattern established for registration
- Keeping the httpOnly cookie set server-side means the Next.js middleware route guard (`src/middleware.ts`) continues to work without changes
- The backend's `accessToken` JWT is stored in the cookie payload so future API calls from server components can include it
- Using `NEXT_PUBLIC_API_BASE_URL` (already in `.env.local`) keeps the backend URL server-side only  
**Alternatives considered**:
- Direct client-side axios call to `localhost:8080`: Requires CORS on backend; exposes backend URL
- `next.config.js` rewrites: No opportunity to extract user data and set the cookie
- Keep mocks + add backend call in parallel: Unnecessary complexity

---

## 3. Token Storage Strategy

**Decision**: Store `accessToken` inside the `auth_session` httpOnly cookie (base64-encoded session payload). Store non-sensitive user info (`id`, `firstName`, `lastName`, `email`, `role`) in Zustand persist store (localStorage).  
**Rationale**:
- `accessToken` (JWT) must not be accessible via JavaScript (XSS vector). An httpOnly cookie is the correct storage.
- The existing cookie approach already uses base64-encoded JSON; extend it to include `accessToken` and `expiresIn`.
- Zustand persist (localStorage) is appropriate for non-sensitive session metadata — user display name, role, auth flag.
- `refreshToken` is omitted from client storage for now (no refresh flow in scope).  
**Alternatives considered**:
- `accessToken` in localStorage: Insecure; vulnerable to XSS
- `accessToken` in Zustand memory (no persist): Lost on page refresh; requires re-login
- Secure HttpOnly cookie with no Zustand: Server-side rendering works but client components can't read user info

---

## 4. No Retry for Login

**Decision**: No exponential backoff retry in `login.service.ts`.  
**Rationale**: Authentication failures (401/400 `INVALID_CREDENTIALS`) are deterministic — retrying the same credentials will produce the same error. Retrying a login attempt could also be misinterpreted as a brute-force pattern by the backend's rate limiter. Only transient `SERVER_ERROR` or `NETWORK_ERROR` could theoretically benefit from retry, but the risk outweighs the benefit for login. The service wraps the call in a single try/catch.  
**Alternatives considered**:
- Mirror `register.service.ts` retry (3 attempts): Risk of triggering rate limiting; not appropriate for auth

---

## 5. Zustand Store — User Identity Mapping

**Decision**: Update `login-form.tsx` to call `setAuthenticated({ userId: user.id, name: \`\${user.firstName} \${user.lastName}\`.trim(), email: user.email })`.  
**Rationale**: The existing `setAuthenticated` signature matches `{ userId, name, email }`. The backend response `data.user` provides `id`, `firstName`, `lastName`, `email`. No store schema change needed — just correct field mapping.  
**Current bug in login-form.tsx**: `userId: body.user?.email ?? data.email` incorrectly stores the email as the userId. This is fixed in the new service-based implementation.  
**Alternatives considered**:
- Add `role` to AuthUser: Reasonable for future, but not required by any current component
- Store `accessToken` in Zustand: Security concern; httpOnly cookie is the right vehicle

---

## 6. Toast Pattern — Consistency with Registration

**Decision**: Use `sonner` `toast.success()` / `toast.error()` — same as registration form. Remove `formError` state and inline error banner from `login-form.tsx`.  
**Rationale**: SCRUM-41 already established the toast pattern. The `<Toaster>` is already mounted in `(public)/layout.tsx`. Removing the banner state simplifies the component. Error message mapping follows the same `switch(errorCode)` pattern as the registration form.  
**Error codes to handle**:
- `INVALID_CREDENTIALS` → "Incorrect email or password. Please try again."
- `NETWORK_ERROR` → "Network error: Please check your internet connection and try again."
- `SERVER_ERROR` → "Unable to sign in. Please try again later."
- Any other → `response.error || 'Sign in failed. Please try again.'`  
**Alternatives considered**:
- Keep inline error banner: Inconsistent UX with registration; `formError` state adds complexity

---

## 7. No New Axios Instance Needed

**Decision**: Reuse the existing `axiosClient` from `src/services/api/axios-client.ts` in `login.service.ts`.  
**Rationale**: The interceptors (X-Request-ID, envelope unwrapping, error normalization) are endpoint-agnostic. The only coupling to registration is the `RegistrationError` type import, which is resolved by the parallel `LoginError` alias decision above.  
**Alternatives considered**:
- Separate `loginAxiosClient`: Duplicates interceptors; violates DRY principle
