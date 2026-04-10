# Quickstart: Login API Integration (SCRUM-42)

## Prerequisites

- Backend running: `http://localhost:8080/api/v1/auth/login`
- Frontend running: `cd website && pnpm dev` (port 3000)
- `.env.local` contains `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`

## Test Scenarios

### Scenario 1 — Successful Login

```
Email:    kaushik@healthcare.com
Password: Test@123
```

Expected:
1. Green toast: "Signed in successfully!"
2. Redirect to `/dashboard`
3. Header shows user name: "Kaushik"
4. `localStorage.cc_auth_session` contains `{ isAuthenticated: true, user: { userId, name, email } }`

---

### Scenario 2 — Invalid Credentials

```
Email:    kaushik@healthcare.com
Password: WrongPassword
```

Expected:
1. Red toast: "Incorrect email or password. Please try again."
2. Form fields remain filled (not cleared)
3. User stays on `/login`

---

### Scenario 3 — Network Error (Backend Down)

Stop the backend server, then attempt login.

Expected:
1. Red toast: "Network error: Please check your internet connection and try again."
2. Form fields remain filled

---

### Scenario 4 — Empty Fields (Client Validation)

Submit form with empty email or password.

Expected:
1. Zod validation errors shown inline: "Email is required" / "Password is required"
2. No API call made

---

### Scenario 5 — Session Persistence

1. Log in successfully
2. Refresh the page
3. Should still be on `/dashboard` (Zustand persist + httpOnly cookie both valid)

---

## Dev Testing (Unit/Integration)

```bash
cd website
pnpm test -- --testPathPattern="login"
```

Key test files:
- `tests/unit/services/auth/login.service.test.ts`
- `tests/unit/components/login-form.test.tsx` (updated)

---

## Verifying Cookie

After successful login, check in browser DevTools → Application → Cookies:
- `auth_session`: httpOnly ✓, SameSite: Lax ✓, expires in ~1 hour

---

## Zustand Store State

After login, `localStorage.cc_auth_session`:
```json
{
  "state": {
    "isAuthenticated": true,
    "accessTokenState": "valid",
    "refreshTokenState": "valid",
    "user": {
      "userId": "15021486-50ff-449f-8c11-94d47adf46ef",
      "name": "Kaushik",
      "email": "kaushik@healthcare.com"
    }
  }
}
```
