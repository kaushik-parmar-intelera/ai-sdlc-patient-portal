# JWT Authorization in Swagger UI

## Overview
The Patient Portal API now includes JWT Bearer token authorization support in Swagger UI. This allows you to authenticate and test protected endpoints directly from the Swagger interface.

## Getting an Authorization Token

### 1. Register a New User
If you don't have credentials, first register a new user:

**Endpoint:** `POST /api/v1/auth/register`

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword@123",
  "confirmPassword": "SecurePassword@123"
}
```

### 2. Login to Get Token
**Endpoint:** `POST /api/v1/auth/login`

```json
{
  "email": "john@example.com",
  "password": "SecurePassword@123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "base64-encoded-refresh-token",
    "user": {
      "id": "11111111-1111-1111-1111-111111111111",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Patient",
      "isActive": true
    }
  }
}
```

### Pre-seeded Test Accounts

The application includes the following pre-seeded test accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@patient-portal.com | Admin@123 | Admin |
| doctor.smith@patient-portal.com | Doctor@123 | Doctor |
| jane.patient@patient-portal.com | Patient@123 | Patient |
| john.patient@patient-portal.com | Patient@456 | Patient |
| nurse.johnson@patient-portal.com | Nurse@123 | Nurse |

## Using Authorization in Swagger UI

### Step 1: Get Your Access Token
1. Navigate to the **Auth Controller** section in Swagger
2. Click on the `POST /api/v1/auth/login` endpoint
3. Enter credentials (use any of the pre-seeded accounts above)
4. Execute the request
5. Copy the `accessToken` value from the response

### Step 2: Add Token to Swagger Authorization
1. Click the green **"Authorize"** button at the top-right of Swagger UI
2. In the dialog box, enter: `Bearer YOUR_ACCESS_TOKEN`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Click **"Authorize"** button in the dialog
4. Click **"Close"** to dismiss the dialog

### Step 3: Call Protected Endpoints
All subsequent API calls will now include the JWT token in the `Authorization` header. You can now:
- Call the `GET /api/v1/users/me` endpoint to get your user profile
- Call any other protected endpoints

## Important Notes

- **Token Format**: Always include the word "Bearer" followed by a space before your token
- **Token Expiration**: Access tokens expire in 60 minutes (configurable in `AuthSettings`)
- **Refresh Token**: Use the refresh token to get a new access token when it expires
- **Security**: Never share your access token publicly or commit it to version control

## Logout
To logout and clear the authorization token from Swagger:
1. Click the **"Authorize"** button again
2. Click **"Logout"** in the dialog
3. Click **"Close"**

## Configuration

The JWT settings are configured in `appsettings.json` and `appsettings.Development.json`:

```json
{
  "AuthSettings": {
    "Issuer": "PatientPortal",
    "Audience": "PatientPortalUsers",
    "SigningKey": "SuperSecretSigningKeyChangeMe123",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 30
  }
}
```

**Note**: Change the `SigningKey` in production environments and ensure it's at least 32 bytes (256 bits) for HS256 algorithm.
