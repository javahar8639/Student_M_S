# Student MS — Student Management System

A full-stack student management web application: authentication, course enrollment and
lesson progress, assignments and submissions, grades, a calendar, notifications, and a
student profile — all backed by a real PostgreSQL database.

## Overview

Student MS is a calm, premium-feeling learning dashboard for a single student persona.
Every interaction (completing a lesson, submitting an assignment, marking a notification
as read, editing your profile) is persisted to PostgreSQL through a REST API and survives
a page refresh.

## Features

- Email/password authentication with JWT sessions, bcrypt password hashing, and protected routes
- Realistic forgot-password / reset-password flow using single-use, hashed, expiring tokens and Resend for email delivery
- Dashboard with live summary stats, "Continue Learning" cards, upcoming tasks, recent activity, and recent grades
- My Courses with working search, status filter, and category filter
- Course details with a full curriculum, clickable lessons, and progress that recalculates and persists on every completion
- Assignments with filters (upcoming / submitted / overdue / graded) and a validated submission form
- Grades page with an overall average, course-wise breakdown, and recent grades
- A simple month-view calendar built from assignment due dates
- Notifications with read/unread state, mark-as-read and mark-all-as-read, persisted in the database
- Editable profile (bio, program, year, location, interests, learning goals)
- Global search across courses, lessons, and assignments
- A seeded demo account with realistic courses, assignments, grades, and notifications

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router
**Backend:** Node.js, Express
**Database:** PostgreSQL (`pg`)
**Auth:** JWT, bcryptjs
**Email:** Resend

## Architecture

```
/client   React + Vite + Tailwind SPA. Talks to the API via a small fetch client
          (client/src/api). Auth state lives in a React context and the JWT is
          stored in localStorage/sessionStorage depending on "Remember me".

/server   Express REST API. Routes -> Controllers -> PostgreSQL (via the `pg` pool).
          JWT auth middleware protects everything except signup/login/forgot/reset.
```

Frontend and backend are fully decoupled and communicate only over REST, so they can
be deployed independently.

## Database Schema

| Table | Purpose |
|---|---|
| `users` | Student accounts, profile fields, hashed passwords |
| `courses` | Course catalog |
| `enrollments` | A student's progress/status per course |
| `lessons` | Lessons belonging to a course, grouped by module |
| `lesson_progress` | Per-student lesson completion |
| `assignments` | Assignments belonging to a course |
| `submissions` | A student's submission, grade, and feedback per assignment |
| `notifications` | Per-student notifications with read state |
| `password_reset_tokens` | Hashed, expiring, single-use password reset tokens |

Foreign keys cascade from `users`/`courses` down to their dependent rows, and indexes
are added on the columns used for lookups (`student_id`, `course_id`, etc). See
`server/src/db/schema.sql` for the full definition.

## Local Setup

### Prerequisites
- Node.js 18+
- A running PostgreSQL server

### 1. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables
```bash
cd server && cp .env.example .env
cd ../client && cp .env.example .env
```
Fill in `server/.env` with your database credentials, a JWT secret, and (optionally) a
Resend API key. See [Environment Variables](#environment-variables) below.

### 3. Create the PostgreSQL database
```bash
createdb student_ms
# or: psql -U postgres -c "CREATE DATABASE student_ms;"
```

### 4. Run the schema migration
```bash
cd server && npm run db:migrate
```

### 5. Seed the demo student
```bash
npm run db:seed
```
(`npm run db:setup` runs both steps at once.)

### 6. Start the backend
```bash
cd server && npm run dev
```
Runs on `http://localhost:5000` by default.

### 7. Start the frontend
```bash
cd client && npm run dev
```
Runs on `http://localhost:5173` by default (Vite will pick a different port and print
it if 5173 is already in use on your machine — make sure `FRONTEND_URL` in
`server/.env` matches whichever port it actually starts on, so CORS allows it).

## Environment Variables

**server/.env**
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port the API listens on (Render sets this automatically) |
| `JWT_SECRET` | Secret used to sign JWTs — use a long random string |
| `JWT_EXPIRES_IN` | JWT lifetime, e.g. `7d` |
| `RESEND_API_KEY` | API key from resend.com, used to send password reset emails |
| `RESEND_FROM_EMAIL` | The "from" address for password reset emails |
| `FRONTEND_URL` | The deployed/local frontend origin — used for CORS and for building reset links |

**client/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

No secrets are committed — `.env` is gitignored in both `client/` and `server/`, and
`.env.example` files document the required shape without real values.

## Demo Credentials

```
Email:    javaharreddy20@gmail.com
Password: edutrack123
```
The login page also has a "Demo Account" panel with a **Copy Credentials** button.
The demo student comes pre-seeded with 3 courses (varying progress), 8 assignments in
different states (graded / submitted / pending / overdue), grades, and notifications.

## API Overview

All routes are prefixed with `/api` and (except auth) require `Authorization: Bearer <token>`.

| Route | Description |
|---|---|
| `POST /auth/signup` | Create an account |
| `POST /auth/login` | Log in |
| `GET /auth/me` | Current user |
| `POST /auth/forgot-password` | Request a password reset email |
| `POST /auth/reset-password` | Reset password with a valid token |
| `GET /dashboard` | Dashboard summary, continue learning, tasks, activity, grades |
| `GET /courses` | List courses (supports `search`, `status`, `category`) |
| `GET /courses/:id` | Course details + curriculum |
| `PUT /courses/:courseId/lessons/:lessonId/progress` | Mark a lesson complete/incomplete |
| `GET /assignments` | List assignments (supports `status`) |
| `GET /assignments/:id` | Assignment details |
| `POST /assignments/:id/submissions` | Submit an assignment |
| `GET /grades` | Overall average, course-wise grades, recent grades |
| `GET /calendar` | Calendar events (assignment deadlines) |
| `GET /notifications` | List notifications |
| `PUT /notifications/:id/read` | Mark one notification as read |
| `PUT /notifications/read-all` | Mark all notifications as read |
| `GET /profile` | Current student's profile |
| `PUT /profile` | Update profile |
| `GET /search?q=` | Global search across courses, lessons, assignments |

## Render Deployment

1. **Database:** create a Render PostgreSQL instance. Copy its connection string.
2. **Backend (Web Service):**
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Env vars: `DATABASE_URL` (from step 1), `JWT_SECRET`, `JWT_EXPIRES_IN`,
     `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `FRONTEND_URL` (your deployed frontend URL),
     `NODE_ENV=production`
   - After the first deploy, run the migration and seed once, e.g. via the Render shell:
     `npm run db:setup`
3. **Frontend (Static Site):**
   - Root directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Env vars: `VITE_API_URL` = your deployed backend URL + `/api`

CORS on the backend only allows the origin in `FRONTEND_URL` (plus `localhost:5173` for
local dev) — no wildcard origins in production.

## Future Improvements

- File attachments for assignment submissions (currently a UI-ready placeholder; text
  submissions are fully persisted)
- Multi-student support (course enrollment/browsing for more than one seeded account)
- Exams/quizzes as distinct calendar event types beyond assignment deadlines
- Email verification on signup
