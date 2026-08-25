# 🎓 EduTrack

**EduTrack** is a full-stack student management web app built with **React, Express, and PostgreSQL**. It gives a student a single dashboard to track courses, lessons, assignments, grades, and notifications — with every action persisted to a real database instead of mock data.

🔗 **GitHub:** [github.com/javahar8639/Student_M_S](https://github.com/javahar8639/Student_M_S)
🚀 **Live Demo:** [student-pdh1.onrender.com](https://student-pdh1.onrender.com)

> Built as a full-stack experience with a focus on **real data persistence, secure authentication, and a calm, premium UI**.

---

## ✨ Features

### 🔐 Authentication & Password Recovery

Full email/password authentication backed by JWT sessions, with a real forgot-password flow instead of a placeholder.

* **Signup & login** with bcrypt-hashed passwords and JWT-based sessions
* **Protected routes** on both the client (route guard) and server (auth middleware)
* **Forgot / reset password flow**

  * A single-use, cryptographically random reset token is generated and only its hash is stored, with a 30-minute expiry
  * The reset email is sent through **Resend** with a link containing the raw token
  * The confirmation message is intentionally generic ("If an account exists for that email…") so the flow never reveals whether an email is registered
  * The token is invalidated immediately after use, so a reset link can't be replayed

### 📊 Dashboard

A live summary of what the student needs to focus on, built from real API data rather than static cards.

* **Live stats** (courses, assignments, grades) pulled from the database
* **"Continue Learning"** cards for in-progress courses
* **Upcoming tasks** and **recent activity** feed
* **Recent grades** snapshot

### 📚 Courses & Lessons

Each course expands into a full curriculum with progress that's tracked per lesson and recalculated on every change.

* **My Courses** page with working **search**, **status filter**, and **category filter**
* Course details page with:

  * Full curriculum grouped by module
  * Clickable lessons that mark completion
  * Progress percentage that recalculates and persists after every lesson toggle

### 🧑‍💻 Assignments & Submissions

Includes:

* Filterable list (**upcoming / submitted / overdue / graded**)
* Assignment detail modal with due date, description, and max marks
* A validated submission form that persists text submissions to the database
* Marks and instructor feedback shown once an assignment is graded

### 📈 Grades

* Overall average across all courses
* Course-wise grade breakdown
* Recent grades list

### 🗓️ Calendar

* A month-view calendar built directly from assignment due dates
* Correctly highlights "today" using local time (fixed a prior UTC/local timezone mismatch)

### 🔔 Notifications

* Per-student notifications with **read/unread** state
* **Mark as read** and **mark all as read**, both persisted to the database

### 🙍 Profile & 🔍 Global Search

* Editable profile — bio, program, year, location, interests, learning goals
* Global search across **courses, lessons, and assignments** from one search bar in the topbar

### 📱 Responsive Design

Includes:

* Responsive grid layouts across dashboard, courses, and grades
* A dedicated **bottom mobile navigation** bar (`MobileNav`) below the desktop sidebar breakpoint
* Adaptive card and modal layouts for smaller screens

### 🎨 Animations & Accessibility

* Subtle fade/slide-up transitions on page and dropdown mounts (`animate-fadeSlideUp`)
* **`prefers-reduced-motion`** is respected — animation and transition durations are collapsed for users who request reduced motion
* Skeleton loading states instead of layout-shifting spinners
* Accessible labels on icon-only buttons and the global search input (`aria-label`)

---

## 🔄 User Flow

```text
Login / Signup (or Forgot Password)
        ↓
Dashboard (live stats, tasks, recent activity)
        ↓
My Courses → Course Details → Lessons (progress tracked live)
        ↓
Assignments → Submit → Graded → reflected in Grades
        ↓
Notifications / Calendar stay in sync with the above
```

Global search and the profile page are reachable from any authenticated screen via the topbar and sidebar, rather than being part of this linear flow.

---

## 🧩 Project Structure

```text
client/src/
├── api/                     # Thin fetch client per resource (auth, courses, grades, …)
├── components/
│   ├── layout/               # AppShell, Sidebar, Topbar, MobileNav, navItems
│   ├── ui/                   # Reusable primitives: Button, Card, Modal, Input, Skeleton, …
│   ├── GlobalSearch.jsx
│   ├── ProtectedRoute.jsx
│   └── icons.jsx
├── context/
│   ├── AuthContext.jsx        # Session state, login/signup/logout
│   └── NotificationsContext.jsx
├── hooks/
│   └── useFetch.js
├── lib/
│   ├── format.js               # Dates, greetings, status labels
│   └── validation.js
├── pages/
│   ├── auth/                   # Login, Signup, ForgotPassword, ResetPassword, AuthLayout
│   └── Dashboard.jsx, Courses.jsx, CourseDetails.jsx, Assignments.jsx,
│       Grades.jsx, Calendar.jsx, Notifications.jsx, Profile.jsx
├── App.jsx
├── main.jsx
└── index.css

server/src/
├── config/
│   └── db.js                  # PostgreSQL pool
├── controllers/                # One per resource (auth, courses, assignments, grades, …)
├── db/
│   ├── schema.sql
│   ├── migrate.js
│   ├── seed.js
│   └── seedData.js
├── middleware/
│   ├── auth.js                 # JWT verification
│   ├── errorHandler.js
│   └── upload.js
├── routes/                     # Express routers, one per resource
├── utils/
│   ├── email.js                 # Resend integration
│   ├── tokens.js                 # Reset token generation/hashing
│   ├── jwt.js
│   └── validate.js
├── app.js
└── index.js
```

---

## 🛠️ Tech Stack

| Technology         | Usage                                              |
| ------------------- | --------------------------------------------------- |
| **React + Vite**    | Frontend SPA and dev/build tooling                   |
| **React Router**    | Client-side routing and protected routes             |
| **Tailwind CSS**    | Styling                                              |
| **Node.js + Express** | REST API server                                     |
| **PostgreSQL** (`pg`) | Persistent storage for all app data                |
| **JWT** (`jsonwebtoken`) | Session authentication                          |
| **bcryptjs**        | Password hashing                                      |
| **Resend**          | Transactional email delivery for password resets      |

> No global state management library or UI component library was used — auth/notifications state is handled with React context, and UI primitives (`Button`, `Card`, `Modal`, etc.) were built directly with Tailwind.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Student_M_S
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment variables

```bash
cd server && cp .env.example .env
cd ../client && cp .env.example .env
```

Fill in `server/.env` with your PostgreSQL connection string, a JWT secret, and a Resend API key.

### 4. Set up the database

```bash
cd server
npm run db:migrate
npm run db:seed
```

(`npm run db:setup` runs both in one step.)

### 5. Start the backend

```bash
npm run dev
```

```text
http://localhost:5000
```

### 6. Start the frontend

```bash
cd ../client
npm run dev
```

```text
http://localhost:5173
```

---

## 📦 Production Build

```bash
cd client
npm run build
```

```text
dist/
```

The backend has no build step — deploy `server/` as-is and run:

```bash
npm start
```

---

## 📌 Current Scope

### Implemented

* ✅ Authentication (signup, login, JWT sessions, protected routes)
* ✅ Forgot-password / reset-password flow with expiring, single-use, hashed tokens
* ✅ Real password reset emails via Resend
* ✅ Dashboard with live stats, continue learning, tasks, activity, and grades
* ✅ Course catalog with search, status, and category filters
* ✅ Lesson-level progress tracking that recalculates course progress
* ✅ Assignment submissions with grading and instructor feedback
* ✅ Grades overview (overall + course-wise)
* ✅ Calendar built from assignment due dates
* ✅ Notifications with read/unread state
* ✅ Editable profile
* ✅ Global search across courses, lessons, and assignments
* ✅ Seeded demo account

### Not Yet Implemented

* ⏳ File attachments for assignment submissions (UI is ready; only text submissions are persisted)
* ⏳ Multi-student support (currently a single seeded student persona)
* ⏳ Exams/quizzes as their own calendar event type, separate from assignment deadlines
* ⏳ Email verification on signup

---

## 🔮 Future Improvements

* **File upload support** for assignment submissions, building on the existing upload middleware
* **Multi-student accounts** with per-student course enrollment/browsing
* **Exam/quiz scheduling** as a distinct calendar event type
* **Signup email verification**, reusing the existing token/email infrastructure from password reset
* **Custom Resend sending domain**, once verified, in place of the current sandbox sender

---

## 👩‍💻 What I Worked On

* Designed and built the **full-stack architecture** — a decoupled React SPA talking to an Express REST API over `/api`
* Implemented **JWT authentication** end-to-end, including the **forgot/reset-password flow** with hashed, expiring, single-use tokens and real email delivery via Resend
* Designed the **PostgreSQL schema** (users, courses, enrollments, lessons, lesson progress, assignments, submissions, notifications, reset tokens) with cascading foreign keys and indexed lookup columns
* Built the **REST API** — routes, controllers, and query logic for every resource (dashboard, courses, assignments, grades, calendar, notifications, profile, search)
* Built **state management** on the client with React context for auth and notifications, plus a small `useFetch` hook for data loading
* Built a set of **reusable UI primitives** (Button, Card, Modal, Input, Skeleton, Badge, ProgressBar) used consistently across every page
* Implemented **global search** across courses, lessons, and assignments with debounced querying
* Handled **responsive layout**, including a dedicated mobile bottom navigation bar
* Added **accessibility and motion considerations**, including `prefers-reduced-motion` support and ARIA labels on icon-only controls
* Debugged and fixed a **calendar timezone bug** where "today" was highlighted incorrectly due to a UTC/local mismatch
