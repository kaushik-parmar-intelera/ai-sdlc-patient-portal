# API Contracts: Backend Setup

**Feature**: Backend Setup (003-backend-setup)  
**Created**: 2026-04-09  
**Purpose**: Define all REST API endpoints, request/response schemas, and error handling

---

## API Response Format (Standard Envelope)

All API responses follow this standard JSON envelope structure:

**Successful Response**:
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "email",
        "reason": "Email format invalid"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**HTTP Status Codes**:
- `200 OK`: Successful GET/PUT/PATCH request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request (no response body)
- `400 Bad Request`: Invalid request data (validation errors)
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions/role
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (duplicate, state violation)
- `500 Internal Server Error`: Server error (never use for validation errors)

---

## Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| INVALID_CREDENTIALS | 401 | Email or password incorrect |
| UNAUTHORIZED | 401 | Missing JWT token |
| TOKEN_EXPIRED | 401 | JWT token expired |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| DUPLICATE_EMAIL | 409 | Email already registered |
| DUPLICATE_LICENSE | 409 | Provider license already exists |
| INVALID_STATE_TRANSITION | 409 | Invalid appointment status change |
| INTERNAL_ERROR | 500 | Unexpected server error |

---

## Authentication Endpoints

### 1. Login

**Endpoint**: `POST /api/v1/auth/login`

**Description**: Generate JWT token for authenticated user. Required before accessing protected endpoints.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Request Validation**:
- email: Required; valid email format; max 255 characters
- password: Required; 8-128 characters

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_string_128_chars_min...",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Patient",
      "isActive": true
    }
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
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
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**JWT Token Format**:
- Header: `{ "alg": "HS256", "typ": "JWT" }`
- Payload:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "Patient",
  "iat": 1712670000,
  "exp": 1712673600
}
```
- Expires: 3600 seconds (1 hour)
- Signing Algorithm: HMAC-SHA256 or RS256 (configurable)

---

### 2. Refresh Token

**Endpoint**: `POST /api/v1/auth/refresh`

**Description**: Generate new access token using refresh token (valid for 7 days).

**Request**:
```json
{
  "refreshToken": "refresh_token_string..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "new_refresh_token_string...",
    "expiresIn": 3600
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
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
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

## User Endpoints

### 1. Register New Patient

**Endpoint**: `POST /api/v1/auth/register`

**Description**: Create a new patient account from the Stitch website registration form.

**Access**: Public (no authentication required)

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
- fullName: Required; 2-256 characters; may include letters, spaces, hyphens, apostrophes
- email: Required; valid email format; must be unique; max 254 characters
- password: Required; 8-128 characters; must include uppercase, lowercase, number, special char
- confirmPassword: Required; must match password

**Behavior**:
- The backend MUST default the registered account role to `Patient` for public registration flows.
- The backend MUST split `fullName` into `firstName` and `lastName` for storage.
- If `fullName` contains only one token, `firstName` stores the value and `lastName` is empty.

**Response** (201 Created):
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
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response** (400 Bad Request - Validation):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "reason": "Email format invalid"
      },
      {
        "field": "password",
        "reason": "Password must contain uppercase letter"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response** (409 Conflict - Duplicate Email):
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
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

### 2. Get All Users

**Endpoint**: `GET /api/v1/users`

**Description**: Retrieve paginated list of users (admin only).

**Access**: Requires JWT token with Admin role

**Query Parameters**:
- `limit` (integer, default 20, max 100): Number of results per page
- `offset` (integer, default 0): Number of results to skip
- `role` (string, optional): Filter by role (Admin, Patient, Provider)
- `isActive` (boolean, optional): Filter by active status
- `search` (string, optional): Search by email or name

**Example**: `GET /api/v1/users?limit=20&offset=0&role=Patient&isActive=true`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "Patient",
        "isActive": true,
        "createdOn": "2026-04-09T12:00:00Z"
      }
    ],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 150
    }
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**Headers Required**:
- `Authorization: Bearer {accessToken}`

---

### 3. Get User by ID

**Endpoint**: `GET /api/v1/users/{id}`

**Description**: Retrieve specific user details.

**Access**: Requires JWT token; user can only access own profile or admin can access any

**URL Parameters**:
- `id` (GUID): User ID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Patient",
    "isActive": true,
    "createdOn": "2026-04-09T12:00:00Z",
    "modifiedOn": "2026-04-09T13:00:00Z",
    "modifiedBy": "550e8400-e29b-41d4-a716-446655440001"
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "details": []
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

### 4. Update User

**Endpoint**: `PUT /api/v1/users/{id}`

**Description**: Update user profile information.

**Access**: Requires JWT token; user can only update own profile or admin can update any

**URL Parameters**:
- `id` (GUID): User ID

**Request**:
```json
{
  "firstName": "John",
  "lastName": "Smith"
}
```

**Request Validation**:
- firstName: Optional; if provided, must be 1-100 characters
- lastName: Optional; if provided, must be 1-100 characters
- (email, password, role cannot be updated via this endpoint)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "role": "Patient",
    "isActive": true,
    "modifiedOn": "2026-04-09T13:00:00Z"
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

### 5. Deactivate User

**Endpoint**: `PUT /api/v1/users/{id}/deactivate`

**Description**: Deactivate user account (soft delete; user cannot login but data preserved).

**Access**: Requires JWT token with Admin role or user deactivating own account

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "isActive": false,
    "deactivatedOn": "2026-04-09T13:00:00Z"
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

## Appointment Endpoints

### 1. Create Appointment

**Endpoint**: `POST /api/v1/appointments`

**Description**: Create new appointment between patient and provider.

**Access**: Requires JWT token (Patient or Provider can create their own; Admin can create for others)

**Request**:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "providerId": "550e8400-e29b-41d4-a716-446655440001",
  "appointmentDate": "2026-05-09T14:30:00Z",
  "durationMinutes": 30,
  "notes": "Initial consultation"
}
```

**Request Validation**:
- userId: Required; must be valid User ID
- providerId: Required; must be valid Provider ID
- appointmentDate: Required; must be future date; max 365 days ahead
- durationMinutes: Required; must be > 0; typically 15, 30, 45, 60
- notes: Optional; max 1000 characters

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "providerId": "550e8400-e29b-41d4-a716-446655440001",
    "appointmentDate": "2026-05-09T14:30:00Z",
    "durationMinutes": 30,
    "status": "Scheduled",
    "notes": "Initial consultation",
    "createdOn": "2026-04-09T12:00:00Z"
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

### 2. Get Appointments

**Endpoint**: `GET /api/v1/appointments`

**Description**: List appointments (filtered by user role).

**Access**: Requires JWT token

**Query Parameters**:
- `limit` (integer, default 20)
- `offset` (integer, default 0)
- `status` (string, optional): Scheduled, Completed, Cancelled, NoShow
- `startDate` (ISO-8601, optional): Filter from date
- `endDate` (ISO-8601, optional): Filter to date

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "providerId": "550e8400-e29b-41d4-a716-446655440001",
        "appointmentDate": "2026-05-09T14:30:00Z",
        "durationMinutes": 30,
        "status": "Scheduled",
        "createdOn": "2026-04-09T12:00:00Z"
      }
    ],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 50
    }
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

### 3. Cancel Appointment

**Endpoint**: `PUT /api/v1/appointments/{id}/cancel`

**Description**: Cancel scheduled appointment.

**Access**: Requires JWT token; patient or provider can cancel their own; admin can cancel any

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "status": "Cancelled",
    "modifiedOn": "2026-04-09T13:00:00Z"
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

## Provider Endpoints

### 1. Create Provider

**Endpoint**: `POST /api/v1/providers`

**Description**: Register new healthcare provider.

**Access**: Requires JWT token with Admin role

**Request**:
```json
{
  "name": "Dr. Sarah Johnson",
  "specialization": "Cardiology",
  "licenseNumber": "CA-123456",
  "availableHours": {
    "monday": ["09:00-17:00"],
    "tuesday": ["09:00-17:00"],
    "wednesday": ["09:00-17:00"],
    "thursday": ["09:00-17:00"],
    "friday": ["09:00-17:00"],
    "saturday": [],
    "sunday": []
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Dr. Sarah Johnson",
    "specialization": "Cardiology",
    "licenseNumber": "CA-123456",
    "rating": 0.0,
    "reviewCount": 0,
    "isActive": true,
    "createdOn": "2026-04-09T12:00:00Z"
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

### 2. Get All Providers

**Endpoint**: `GET /api/v1/providers`

**Description**: List all active providers.

**Access**: Public (no authentication required)

**Query Parameters**:
- `limit` (integer, default 20)
- `offset` (integer, default 0)
- `specialization` (string, optional): Filter by specialization
- `minRating` (decimal, optional): Filter by minimum rating

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Dr. Sarah Johnson",
        "specialization": "Cardiology",
        "rating": 4.8,
        "reviewCount": 25
      }
    ],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 50
    }
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

## Medical Records Endpoints

### 1. Create Medical Record

**Endpoint**: `POST /api/v1/medical-records`

**Description**: Add medical record for patient.

**Access**: Requires JWT token with Provider or Admin role

**Request**:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "recordDate": "2026-04-09T12:00:00Z",
  "diagnosis": "Hypertension",
  "treatment": "Prescribed lisinopril 10mg daily",
  "notes": "Follow-up in 3 months"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "recordDate": "2026-04-09T12:00:00Z",
    "diagnosis": "Hypertension",
    "treatment": "Prescribed lisinopril 10mg daily",
    "notes": "Follow-up in 3 months",
    "createdOn": "2026-04-09T12:00:00Z",
    "createdBy": "550e8400-e29b-41d4-a716-446655440001"
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

## Payment Endpoints

### 1. Get Payment

**Endpoint**: `GET /api/v1/payments/{appointmentId}`

**Description**: Get payment status for specific appointment.

**Access**: Requires JWT token

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440006",
    "appointmentId": "550e8400-e29b-41d4-a716-446655440002",
    "amount": 150.00,
    "status": "Completed",
    "transactionId": "stripe_ch_1234567890",
    "paymentDate": "2026-04-09T12:15:00Z",
    "createdOn": "2026-04-09T12:00:00Z"
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

---

## Health Check

**Endpoint**: `GET /health`

**Description**: Health check endpoint for monitoring and load balancer health checks.

**Access**: Public (no authentication required)

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-04-09T12:00:00Z",
  "version": "1.0.0",
  "database": "connected",
  "dependencies": {
    "sqlServer": "healthy"
  }
}
```

---

## Permission Model

### Role-Based Access Control (RBAC)

| Endpoint | Admin | Patient | Provider | Public |
|----------|-------|---------|----------|--------|
| POST /auth/login | ✓ | ✓ | ✓ | ✓ |
| POST /users | ✓ | ✓ (self) | ✓ (self) | ✓ |
| GET /users | ✓ | ✗ | ✗ | ✗ |
| GET /users/{id} | ✓ | ✓ (self) | ✓ (self) | ✗ |
| PUT /users/{id} | ✓ | ✓ (self) | ✓ (self) | ✗ |
| POST /appointments | ✓ | ✓ | ✓ | ✗ |
| GET /appointments | ✓ | ✓ (own) | ✓ (own) | ✗ |
| POST /providers | ✓ | ✗ | ✗ | ✗ |
| GET /providers | ✓ | ✓ | ✓ | ✓ |
| POST /medical-records | ✓ | ✗ | ✓ | ✗ |

---

**Status**: ✅ API contracts complete and validated.

**Next**: Create quickstart.md for development setup
