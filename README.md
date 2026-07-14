# JobMarkr

JobMarkr is a full-stack job application tracker for saving roles, managing a pipeline, tracking follow-ups, and reviewing job search activity from one authenticated workspace.

The app is built as a React/Vite client with an Express API, Firebase Authentication, and a Neon-hosted PostgreSQL database accessed through `pg`.

## What It Does

- Public marketing pages for the home page, help, and contact views.
- Firebase Authentication with Google sign-in and email/password sign-up.
- Password reset, email verification, email change, password change, account deletion, and session revocation flows.
- Protected dashboard, applications table, application details, edit form, Kanban board, and account settings pages.
- Upcoming events page for follow-ups, deadlines, interviews, and offer decisions.
- User-scoped applications stored in PostgreSQL.
- User settings stored in the backend on the `users.settings` JSONB column, with local storage used for fast startup and fallback.
- Offline-friendly application reads and creates through a local cache and pending-create sync.
- Search, filtering, sorting, pagination, and URL-based filters for applications.
- Status updates from the applications table, details page, and Kanban board.
- Draft application extraction from pasted job URLs where the job page exposes usable metadata.
- Per-application follow-up, deadline, interview, offer-deadline, visited, and reminder tracking.
- Browser and server-side push reminders using service workers, VAPID keys, and user push subscriptions.
- Excel import from the new-application header, CSV export for spreadsheet workflows, and JSON export/import for fuller backups.
- Theme, accent colour, font size, motion, contrast, focus, table, notification, and default application preferences.
- PWA-friendly public assets, web manifest, and production service worker registration.

## Tech Stack

### Client

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- Firebase Auth
- Lucide React icons
- SheetJS `xlsx`
- Oxlint

### Server

- Node.js
- Express 5
- Firebase Admin SDK
- PostgreSQL via `pg`
- Web Push
- Dotenv
- Nodemon for local development

### Database

- Neon PostgreSQL in production
- Local PostgreSQL can also be used for development
- SQL migrations in `server/src/db/migrations`
- SSL is enabled automatically when `NODE_ENV=production`

## Project Structure

```text
job-tracking-app/
  client/
    public/
      favicon/
      service-worker.js
      site.webmanifest
    src/
      auth/
      components/
      constants/
      context/
      hooks/
      layout/
      lib/
      pages/
      services/
      types/
  server/
    scripts/
      migrate.js
    src/
      config/
      constants/
      controllers/
      db/
        migrations/
        pool.js
      middleware/
      routes/
      services/
      utils/
  package.json
  README.md
```

## Prerequisites

- Node.js and npm
- A Firebase project with Authentication enabled
- Google sign-in enabled in Firebase if you want Google auth locally
- Email/password enabled in Firebase if you want email auth locally
- Firebase Admin service account credentials for the API
- A Neon PostgreSQL database, or another PostgreSQL database for local development

## Environment Variables

Create `client/.env` from `client/.env.example`. For local development, set the API URL to the local server:

```env
VITE_API_URL=http://localhost:5000/api
VITE_VAPID_PUBLIC_KEY=optional_public_vapid_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_FIREBASE_MEASUREMENT_ID=optional_measurement_id
VITE_FIREBASE_STORAGE_BUCKET=optional_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=optional_sender_id
```

Create `server/.env` from `server/.env.example`. For local development, set the client URL to the local Vite app:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

VAPID_SUBJECT=mailto:admin@example.com
VAPID_PUBLIC_KEY=your_public_vapid_key
VAPID_PRIVATE_KEY=your_private_vapid_key
NOTIFICATION_POLL_INTERVAL_MS=60000
DISABLE_NOTIFICATION_SCHEDULER=false
```

For Neon, copy the pooled or direct connection string into `DATABASE_URL`. In production, set `NODE_ENV=production` so the server connects with SSL.

Generate VAPID keys from the server package when configuring push notifications:

```powershell
cd server
npm run push:generate-vapid
```

`VITE_VAPID_PUBLIC_KEY` is optional because the client can read the public key from `GET /api/user/push-subscriptions`, but setting it keeps browser subscription setup independent of that first API response.

Do not commit real `.env` files.

## Install Dependencies

From the repository root:

```powershell
npm install
npm install --prefix client
npm install --prefix server
```

## Database Setup

Run migrations from the server package:

```powershell
cd server
npm run migrate
```

The migrations currently create and maintain:

- `schema_migrations`, used to track applied SQL files.
- `users`, linked to Firebase users.
- `applications`, linked to users and storing job details, statuses, notes, dates, and metadata.
- Status transition history.
- `users.settings` JSONB storage for account preferences.
- Job description sections, application event dates, reminder lead times, notification toggles, and visited timestamps.
- `push_subscriptions`, used to store browser push subscriptions per user.
- `notification_deliveries`, used to avoid sending the same scheduled reminder twice.
- Constraints for statuses, priorities, work modes, employment types, URLs, and contact emails.

## Run Locally

Run the client and API together from the root:

```powershell
npm run dev
```

Or run them separately:

```powershell
cd server
npm run dev
```

```powershell
cd client
npm run dev
```

Default local URLs:

- Client: `http://localhost:5173`
- API: `http://localhost:5000/api`
- API health check: `http://localhost:5000/api/health`
- Database smoke test: `http://localhost:5000/api/db-test`

## Available Scripts

Root:

```powershell
npm run dev
npm run client
npm run server
```

Client:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

Server:

```powershell
npm run dev
npm start
npm run migrate
npm run push:generate-vapid
```

## Frontend Routes

Public routes:

```text
/
/help
/contact
/terms
/privacy
/cookies
/login
/signup
/forgot-password
/reset-password
```

Protected routes:

```text
/dashboard
/applications
/upcoming
/applications/new
/applications/:id
/applications/:id/edit
/kanban
/account
/account/:accountTab
```

Account tabs:

```text
settings
details
notifications
defaults
data
```

## API Routes

Public routes:

```http
GET /api/health
GET /api/db-test
```

Authenticated routes require a Firebase ID token:

```http
Authorization: Bearer <firebase_id_token>
```

Applications:

```http
GET    /api/applications
GET    /api/applications/:id
GET    /api/applications/status/:status
POST   /api/applications
POST   /api/applications/extract
PATCH  /api/applications/:id
PATCH  /api/applications/:id/status
PATCH  /api/applications/:id/visited
DELETE /api/applications/:id
DELETE /api/applications
```

Dashboard:

```http
GET /api/dashboard/stats
```

User and account:

```http
GET    /api/user/settings
PUT    /api/user/settings
GET    /api/user/push-subscriptions
POST   /api/user/push-subscriptions
DELETE /api/user/push-subscriptions
DELETE /api/user/sessions
DELETE /api/user/account
```

There is also a legacy authenticated root route:

```http
GET /
```

It returns the authenticated user's applications from the database.

## Authentication Flow

1. The user signs in with Google or email/password through Firebase Auth.
2. The React app receives a Firebase ID token.
3. `client/src/lib/api.ts` attaches the token as a bearer token for authenticated API requests.
4. The Express `requireAuth` middleware verifies the token with Firebase Admin.
5. The server creates or updates the local `users` row for that Firebase account.
6. Application data, settings, session revocation, and account deletion all operate against the authenticated user.

The auth UI also includes password-manager-friendly form markup: grouped forms, `autocomplete` attributes, stable field names, and hidden username fields where the account email is implicit.

## Data and Offline Behavior

- Applications are stored in PostgreSQL and scoped by user.
- Account preferences are stored in `users.settings` as JSONB and mirrored in local storage.
- Follow-up dates, deadlines, interviews, offer deadlines, reminder lead times, and visited timestamps are stored with each application.
- Browser push subscriptions and delivery history are stored in PostgreSQL for server-side reminders.
- Application reads fall back to cached data when the API is unavailable.
- New applications can be cached locally and synced when a later applications load succeeds.
- Cached local application IDs are handled separately so detail, edit, delete, and status updates remain usable before sync.
- Dashboard stats use the API when available and can fall back to cached application data.
- The upcoming page and app badge are derived from locally available application event data.

## Application Model

Allowed statuses:

```text
wishlist
saved
applied
assessment
interviewing
offer
rejected
withdrawn
```

Allowed priorities:

```text
low
medium
high
```

Allowed employment types:

```text
full_time
part_time
internship
placement
contract
temporary
freelance
```

Allowed work modes:

```text
remote
hybrid
onsite
```

## Key Files

- `client/src/App.tsx` defines public, auth, and protected routes.
- `client/src/auth/AuthProvider.tsx` exposes auth state and account actions.
- `client/src/lib/api.ts` handles authenticated API requests and token refresh retry.
- `client/src/services/authenticationApi.ts` wraps Firebase Auth operations.
- `client/src/services/applicationsApi.ts` wraps application API calls and offline cache behavior.
- `client/src/services/applicationOfflineStore.ts` stores cached and pending application data.
- `client/src/services/applicationEvents.ts` derives follow-up, deadline, interview, and offer-deadline events.
- `client/src/services/applicationNotifications.ts` schedules in-browser reminders and app badge updates.
- `client/src/services/pushSubscriptionsApi.ts` registers browser push subscriptions with the API.
- `client/src/context/AccountSettingsContext.tsx` loads, saves, and applies user settings.
- `client/src/pages/AccountSettings.tsx` contains account, notification, default, export, import, and data-management UI.
- `server/src/index.js` registers middleware and API routes.
- `server/src/db/pool.js` configures PostgreSQL/Neon access.
- `server/src/middleware/requireAuth.js` verifies Firebase ID tokens and resolves local users.
- `server/src/routes/*.js` defines the API route groups.
- `server/src/controllers/*.js` handles request and response logic.
- `server/src/services/*.js` contains database and account operations.
- `server/src/services/jobUrlExtractor.service.js` extracts draft application details from job posting pages.
- `server/src/services/notificationScheduler.service.js` polls for due reminders and sends push notifications.
- `server/src/services/pushSubscriptions.service.js` stores push subscriptions and sends Web Push payloads.
- `server/scripts/migrate.js` applies SQL migrations.

## Manual Test Flow

Use this checklist after changes:

1. Visit `/` and check the public marketing page.
2. Visit `/help`, `/contact`, `/terms`, `/privacy`, and `/cookies`.
3. Visit `/dashboard` while signed out and confirm it redirects to `/login`.
4. Sign up with email/password and confirm Firebase sends verification.
5. Sign out and sign in with email/password.
6. Test forgot password and reset password with a Firebase reset link.
7. Sign in with Google.
8. Add a new application.
9. Paste a supported job URL on the new-application page and review the extracted draft.
10. Add follow-up, deadline, interview, offer-deadline, and reminder settings to an application.
11. View, edit, and delete an application.
12. Change status from the applications table.
13. Move an application from the Kanban board.
14. Open `/upcoming` and confirm future application events are listed.
15. Search, filter, sort, and paginate applications.
16. Check dashboard stats after data changes.
17. Update account settings and confirm they persist after refresh.
18. Enable notification preferences and browser notifications when VAPID keys are configured.
19. Import applications from an Excel workbook on the new-application page.
20. Export CSV and JSON from account data settings.
21. Import a JSON backup.
22. Change email, change password, refresh verification status, and send verification email from account details.
23. Revoke sessions and confirm the user is signed out.
24. Delete a test account only when using disposable data.
25. Run `npm run build --prefix client`.

## Screenshots

#### Home

![Home](screenshots/home.png)

#### Dashboard

![Dashboard](screenshots/dashboard.png)

#### Applications

![Applications](screenshots/applications.png)

#### Kanban

![Kanban](screenshots/kanban.png)

#### Application Form

![Application Form](screenshots/application-form.png)

## Deployment Notes

- Deploy the client with the production `VITE_API_URL` pointing at the API base URL ending in `/api`.
- Deploy the server with `CLIENT_URL` set to the client origin.
- Use the Neon connection string as `DATABASE_URL`.
- Set `NODE_ENV=production` for SSL database connections.
- Configure `VAPID_SUBJECT`, `VAPID_PUBLIC_KEY`, and `VAPID_PRIVATE_KEY` on the server to enable push notifications.
- Optionally expose the same public VAPID key as `VITE_VAPID_PUBLIC_KEY` on the client.
- Configure Firebase authorized domains for the deployed client URL.
- Run `npm run migrate --prefix server` against the production database before using new schema-dependent features.

## Project Status

Active development.
