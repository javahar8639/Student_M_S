-- Student Management System schema

CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  profile_image   TEXT,
  bio             TEXT,
  program         VARCHAR(160),
  year            VARCHAR(40),
  location        VARCHAR(160),
  interests       TEXT[] DEFAULT '{}',
  learning_goals  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  category        VARCHAR(60) NOT NULL,
  instructor      VARCHAR(160) NOT NULL,
  thumbnail       TEXT,
  difficulty      VARCHAR(20) NOT NULL DEFAULT 'Beginner',
  duration        VARCHAR(60),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id              SERIAL PRIMARY KEY,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id       INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress        INTEGER NOT NULL DEFAULT 0,
  status          VARCHAR(20) NOT NULL DEFAULT 'not_started',
  enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  UNIQUE (student_id, course_id)
);

CREATE TABLE IF NOT EXISTS lessons (
  id              SERIAL PRIMARY KEY,
  course_id       INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  order_number    INTEGER NOT NULL,
  duration        VARCHAR(40),
  module_title    VARCHAR(160)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id              SERIAL PRIMARY KEY,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id       INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed       BOOLEAN NOT NULL DEFAULT false,
  completed_at    TIMESTAMPTZ,
  UNIQUE (student_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS assignments (
  id              SERIAL PRIMARY KEY,
  course_id       INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  due_date        TIMESTAMPTZ NOT NULL,
  max_marks       INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS submissions (
  id                SERIAL PRIMARY KEY,
  assignment_id     INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_text   TEXT,
  status            VARCHAR(20) NOT NULL DEFAULT 'pending',
  submitted_at      TIMESTAMPTZ,
  marks             INTEGER,
  feedback          TEXT,
  UNIQUE (assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id              SERIAL PRIMARY KEY,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(200) NOT NULL,
  message         TEXT NOT NULL,
  type            VARCHAR(40) NOT NULL DEFAULT 'general',
  is_read         BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash      TEXT NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL,
  used            BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_student ON notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user ON password_reset_tokens(user_id);
