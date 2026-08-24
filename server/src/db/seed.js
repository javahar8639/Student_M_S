import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { demoStudent, courses, assignments, notifications } from './seedData.js';

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Clearing existing data...');
    await client.query(
      'TRUNCATE TABLE password_reset_tokens, notifications, submissions, assignments, lesson_progress, lessons, enrollments, courses, users RESTART IDENTITY CASCADE'
    );

    console.log('Creating demo student...');
    const passwordHash = await bcrypt.hash(demoStudent.password, 10);
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, bio, program, year, location, interests, learning_goals, profile_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        demoStudent.name,
        demoStudent.email,
        passwordHash,
        demoStudent.bio,
        demoStudent.program,
        demoStudent.year,
        demoStudent.location,
        demoStudent.interests,
        demoStudent.learning_goals,
        demoStudent.profile_image,
      ]
    );
    const studentId = userResult.rows[0].id;

    console.log('Creating courses, lessons, and enrollments...');
    const courseIdByKey = {};
    const lessonIdsByKey = {};

    for (const course of courses) {
      const courseResult = await client.query(
        `INSERT INTO courses (title, description, category, instructor, thumbnail, difficulty, duration)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [course.title, course.description, course.category, course.instructor, course.thumbnail, course.difficulty, course.duration]
      );
      const courseId = courseResult.rows[0].id;
      courseIdByKey[course.key] = courseId;

      let order = 1;
      const lessonIds = [];
      for (const mod of course.modules) {
        for (const lessonTitle of mod.lessons) {
          const lessonResult = await client.query(
            `INSERT INTO lessons (course_id, title, description, order_number, duration, module_title)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [courseId, lessonTitle, `Lesson covering ${lessonTitle.toLowerCase()}.`, order, '15 min', mod.title]
          );
          lessonIds.push(lessonResult.rows[0].id);
          order += 1;
        }
      }
      lessonIdsByKey[course.key] = lessonIds;

      const totalLessons = lessonIds.length;
      const completedCount = Math.min(course.completedCount, totalLessons);
      const progress = Math.round((completedCount / totalLessons) * 100);
      const status = completedCount === totalLessons ? 'completed' : completedCount > 0 ? 'in_progress' : 'not_started';

      await client.query(
        `INSERT INTO enrollments (student_id, course_id, progress, status, completed_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [studentId, courseId, progress, status, status === 'completed' ? new Date() : null]
      );

      for (let i = 0; i < completedCount; i += 1) {
        await client.query(
          `INSERT INTO lesson_progress (student_id, lesson_id, completed, completed_at)
           VALUES ($1, $2, true, now())`,
          [studentId, lessonIds[i]]
        );
      }
    }

    console.log('Creating assignments and submissions...');
    for (const a of assignments) {
      const courseId = courseIdByKey[a.courseKey];
      const assignmentResult = await client.query(
        `INSERT INTO assignments (course_id, title, description, due_date, max_marks)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [courseId, a.title, a.description, daysFromNow(a.dueInDays), a.maxMarks]
      );
      const assignmentId = assignmentResult.rows[0].id;

      if (a.submission) {
        await client.query(
          `INSERT INTO submissions (assignment_id, student_id, submission_text, status, submitted_at, marks, feedback)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            assignmentId,
            studentId,
            a.submission.text,
            a.submission.status,
            daysFromNow(-a.submission.submittedDaysAgo),
            a.submission.marks,
            a.submission.feedback,
          ]
        );
      }
    }

    console.log('Creating notifications...');
    for (const n of notifications) {
      await client.query(
        `INSERT INTO notifications (student_id, title, message, type, is_read, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [studentId, n.title, n.message, n.type, n.isRead, daysFromNow(-n.daysAgo)]
      );
    }

    await client.query('COMMIT');
    console.log('Seed complete.');
    console.log(`Demo login -> email: ${demoStudent.email}  password: ${demoStudent.password}`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
