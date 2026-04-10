# Research: Registration API Integration

## 1. Toast Notification Library

**Decision**: Use `sonner`  
**Rationale**: Sonner is the de-facto toast library for Next.js App Router. It renders via a `<Toaster>` component in the root layout (RSC-compatible), has zero configuration, supports promise-based toasts, and is visually polished without requiring a custom theme. `react-hot-toast` is a valid alternative but requires a client boundary wrapper higher in the tree; `@radix-ui/toast` is lower-level and requires more setup.  
**Alternatives considered**:
- `react-hot-toast`: Slightly more verbose for promise-based flows; RSC wrapper is similar
- `@radix-ui/toast`: Headless; too much boilerplate for this use case
- Inline state banners (existing approach): Not dismissible, not accessible from outside the form component

---

## 2. HTTP Client: Axios vs Fetch

**Decision**: Axios instance with interceptors in `src/services/api/axios-client.ts`  
**Rationale**: The task explicitly requires axios + interceptors. Axios provides:
- Request interceptors: cleanly attach `X-Request-ID`, `Content-Type`, future auth headers
- Response interceptors: centrally normalize the `{ success, data, error, meta }` envelope and convert axios errors to typed `ApiError` objects
- `AxiosError` type is narrower than fetch's raw error, enabling reliable error code extraction
- Retry logic can be moved to an interceptor (or kept in the service with `axios-retry`)  
**Alternatives considered**:
- Native `fetch` (existing): No interceptor support; envelope normalization must be duplicated per service
- `ky`: Interceptor support + hooks, but adds a dependency with less community adoption

---

## 3. Backend Proxy vs Direct Call

**Decision**: Next.js API route proxy at `/api/auth/register` → `http://localhost:8080/api/v1/auth/register`  
**Rationale**: Browser-side XHR to `localhost:8080` from the Next.js dev server (`localhost:3000`) would trigger CORS preflight. The backend is not expected to have CORS configured for the frontend origin. A thin Next.js proxy route:
- Avoids CORS entirely
- Keeps the backend URL server-side (not exposed to the client bundle)
- Allows future injection of server-side credentials (API keys, service tokens)
- Matches the existing `/api/auth/login` and `/api/auth/logout` pattern  
**Alternatives considered**:
- `next.config.js` rewrites: simpler, but no opportunity to transform the request/response
- Direct axios call from client to port 8080: Requires CORS header from backend

---

## 4. Form Schema Changes: fullName + confirmPassword

**Decision**: Add `confirmPassword` to the Zod schema and the form UI; combine `firstName + lastName` → `fullName` in the service layer  
**Rationale**:
- The backend expects `confirmPassword` — omitting it would cause a 400 `INVALID_INPUT`
- Combining at the service layer (not the form) preserves the existing UX of two separate name fields
- `confirmPassword` is a security requirement; the schema validates `confirmPassword === password` via Zod `.refine()`  
**Alternatives considered**:
- Single `fullName` input in the form: Reduces user experience quality; Stitch design shows two fields
- No `confirmPassword` in form: Backend rejects request; requires workaround of echoing password

---

## 5. Response Type Alignment

**Decision**: Add a new `ApiEnvelope<T>` generic type; update `RegistrationSuccess` and `RegistrationError` to match the actual backend shape  
**Rationale**: The current `RegistrationSuccess` type (`{ userId, email, message }`) matches the nested `data` field in the envelope, not the top-level response. The response interceptor unwraps the envelope and throws on `success: false`, so the service layer still works with flat types — but the raw response type must be declared for correct interceptor typing.  
**Alternatives considered**:
- Inline types in the service: Harder to reuse for future endpoints that share the same envelope
- Overloading existing `RegistrationSuccess`: Breaks the existing type guards

---

## 6. Environment Variable Strategy

**Decision**: `NEXT_PUBLIC_API_BASE_URL` in `.env.local` for the backend origin; accessed in the proxy route  
**Rationale**: The proxy route (`/api/auth/register`) is a server-side Route Handler and can read `process.env` directly. Using a `NEXT_PUBLIC_` prefix also allows future client-side direct calls if CORS is enabled later, without code changes.  
**Value**: `http://localhost:8080`
