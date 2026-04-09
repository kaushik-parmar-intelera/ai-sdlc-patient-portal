# Mobile MVP

This mobile package currently implements the MVP patient flow:

- `Login` with one shared hardcoded demo account
- `Home` dashboard with one fixed hardcoded dataset
- dashboard actions that show placeholder alerts

## Demo credentials

- Username: `patientdemo`
- Password: `Care@123`

## Commands

- `npm run start`
- `npm run ios`
- `npm run android`
- `npm run web`
- `npm run test`
- `npm run typecheck`

## Local runtime note

This package now includes a repo-local Node `20.19.4` runtime via the `node` devDependency and all npm scripts are wired to use it automatically. You do not need to change your global Node version just to run this mobile app from this repo.
