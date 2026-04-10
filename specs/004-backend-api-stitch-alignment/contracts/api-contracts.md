# API Contracts: Backend API Stitch Alignment

**Feature**: Backend API Stitch Alignment (004-backend-api-stitch-alignment)  
**Created**: 2026-04-10  
**Purpose**: Define the API contract required to support the Stitch website registration and auth flows

---

## Registration Endpoint

### 1. Register New Patient

**Endpoint**: `POST /api/v1/auth/register`

**Description**: Create a new patient account from the Stitch-designed web registration form.

**Authentication**: None (public endpoint)

**Request**:
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Request Validation**:
- `fullName`: Required; 2-256 characters; may include letters, spaces, hyphens, and apostrophes
- `email`: Required; valid email format; max 254 characters; must be unique
- `password`: Required; 8-128 characters; must include uppercase, lowercase, number, and special character
- `confirmPassword`: Required; must exactly match `password`

**Behavior**:
- The backend MUST map `fullName` into `firstName` and `lastName` for storage.
- If `fullName` contains a single word, `firstName` stores the value and `lastName` is empty.
- The backend MUST default the registered account role to `Patient` for UI registration flows.

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "message": "Account created successfully"
  },
  "meta": {
    "timestamp": "2026-04-10T12:00:00Z",
    "version": "1.0"
  }
}
```

**Validation Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "reason": "Invalid email address"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-04-10T12:00:00Z",
    "version": "1.0"
  }
}
```

**Duplicate Email Response** (409 Conflict):
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email already registered. Try login or use another email.",
    "details": [
      {
        "field": "email",
        "reason": "Email address already registered"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-04-10T12:00:00Z",
    "version": "1.0"
  }
}
```

---

## Authentication Endpoints

### 2. Login

**Endpoint**: `POST /api/v1/auth/login`

**Description**: Authenticate a patient and return JWT access and refresh tokens.

**Authentication**: None (public endpoint)

**Request**:
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_string...",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "jane.doe@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "Patient",
      "isActive": true
    }
  },
  "meta": {
    "timestamp": "2026-04-10T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "details": []
  },
  "meta": {
    "timestamp": "2026-04-10T12:00:00Z",
    "version": "1.0"
  }
}
```

---

### 3. Refresh Token

**Endpoint**: `POST /api/v1/auth/refresh`

**Description**: Renew the access token using a valid refresh token.

**Authentication**: None (public endpoint)

**Request**:
```json
{
  "refreshToken": "refresh_token_string..."
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "new_refresh_token_string...",
    "expiresIn": 3600
  },
  "meta": {
    "timestamp": "2026-04-10T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Refresh token has expired. Please login again.",
    "details": []
  },
  "meta": {
    "timestamp": "2026-04-10T12:00:00Z",
    "version": "1.0"
  }
}
```
