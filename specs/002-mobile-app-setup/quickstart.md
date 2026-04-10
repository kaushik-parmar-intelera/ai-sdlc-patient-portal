# Quickstart: Mobile Login and Dashboard MVP

## Launch the mobile app

1. Change into `mobile/`
2. Run `npm run start`
3. Open the Expo app in a simulator or device

## Validate the MVP flow

1. Confirm the app opens on `Login`
2. Enter the shared demo credentials:
   - Username: `patientdemo`
   - Password: `Care@123`
3. Confirm successful sign-in routes to `Home`
4. Confirm `Home` shows the fixed dashboard metrics and quick actions
5. Tap each quick action and confirm a placeholder alert appears
6. Confirm `Sign out` returns the app to `Login`
7. Relaunch the app fully and confirm it starts at `Login` again

## Automated checks

- Run `npm run test`
- Run `npm run typecheck`

## Environment note

The mobile package includes a repo-local Node `20.19.4` runtime and the npm scripts use it automatically, so the app can be started locally from this repo even if your global Node version is older.
