# Data Model - Website Project Setup (Frontend Only)

## Overview

This setup feature models configuration and runtime contracts required to bootstrap the Patient Portal frontend. The entities below represent frontend domain artifacts and operational records rather than backend persistence tables.

## Entities

### 1. EnvironmentProfile

- Purpose: Capture runtime environment configuration for API connectivity and feature behavior.
- Fields:
  - `name` (enum: `local`, `staging`, `production`)
  - `apiBaseUrl` (string, required, valid HTTPS URL except local dev)
  - `appBaseUrl` (string, required)
  - `enableMockMode` (boolean, default `false`)
  - `enableTelemetry` (boolean, default `true`)
  - `featureFlags` (map<string, boolean>)
- Validation rules:
  - `apiBaseUrl` must be present for all environments.
  - `production` forbids `enableMockMode=true`.

### 2. RouteDefinition

- Purpose: Define navigable application routes and access behavior.
- Fields:
  - `id` (string, unique)
  - `path` (string, unique)
  - `group` (enum: `public`, `private`)
  - `layout` (string)
  - `preloadPolicy` (enum: `eager`, `lazy`)
  - `requiredPermissions` (array<string>)
- Validation rules:
  - `private` routes must include at least one auth guard.
  - Paths must not conflict across route groups.

### 3. AuthSessionState

- Purpose: Represent user authentication/session state used by route guards and API interceptors.
- Fields:
  - `isAuthenticated` (boolean)
  - `accessTokenState` (enum: `missing`, `valid`, `expired`)
  - `refreshTokenState` (enum: `missing`, `valid`, `expired`)
  - `userId` (string | null)
  - `lastAuthCheckAt` (datetime)
- Validation rules:
  - `isAuthenticated=true` requires `accessTokenState=valid` and `userId` non-null.

### 4. ApiEndpointContract

- Purpose: Describe frontend-consumed API contract metadata for shared service layer behavior.
- Fields:
  - `service` (string)
  - `operation` (string)
  - `method` (enum: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
  - `path` (string)
  - `authRequired` (boolean)
  - `requestSchemaRef` (string)
  - `responseSchemaRef` (string)
  - `timeoutMs` (integer)
  - `retryPolicy` (object)
- Validation rules:
  - `authRequired=true` endpoints must pass through auth interceptor policy.
  - `timeoutMs` must be >0 and <=10000 for baseline setup.

### 5. MockScreenDataset

- Purpose: Define mock JSON payloads per screen for deterministic UI development.
- Fields:
  - `screenId` (string, unique per file)
  - `version` (string semantic version)
  - `source` (enum: `manual`, `generated`, `copied-from-api`)
  - `payload` (json object/array)
  - `lastSyncedContract` (string | null)
- Validation rules:
  - `screenId` must map to an existing `RouteDefinition` entry.
  - Payload shape must match declared screen contract schema.

### 6. UiStatePattern

- Purpose: Standardize rendering contracts for `loading`, `empty`, `error`, and `success` states.
- Fields:
  - `screenId` (string)
  - `state` (enum: `loading`, `empty`, `error`, `success`)
  - `componentRef` (string)
  - `a11yAnnouncement` (string)
  - `recoveryAction` (string | null)
- Validation rules:
  - Every screen must define all four baseline states.
  - `error` state requires non-null `recoveryAction`.

## Relationships

- `RouteDefinition` 1..1 -> `UiStatePattern` (per state variant).
- `RouteDefinition` 1..* -> `MockScreenDataset` (versioned mock payloads).
- `EnvironmentProfile` 1..* -> `ApiEndpointContract` (environment-dependent base URL and flags).
- `AuthSessionState` governs access to all `RouteDefinition[group=private]` and `ApiEndpointContract[authRequired=true]`.

## State Transitions

### AuthSessionState

- `missing -> valid`: successful login/bootstrap token hydration.
- `valid -> expired`: token TTL reached or rejected by API.
- `expired -> valid`: refresh flow succeeds.
- `expired -> missing`: refresh fails and user is logged out.

### UiStatePattern usage flow

- `loading -> success`: data resolves and passes schema validation.
- `loading -> empty`: resolved response has no display records.
- `loading -> error`: transport/domain error occurs.
- `error -> loading`: user retries.
