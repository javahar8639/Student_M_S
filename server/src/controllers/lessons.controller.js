import { query, pool } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';

async function recalculateCourseProgress(client, studentId, courseId) {
  const totalsResult = await client.query(
    `SELECT
       (SELECT COUNT(*) FROM lessons WHERE course_id = $1) AS total,
       (SELECT COUNT(*) FROM lesson_progress lp
          JOIN lessons l ON l.id = lp.lesson_id
          WHERE l.course_id = $1 AND lp.student_id = $2 AND lp.completed = true) AS completed`,
    [courseId, studentId]
  );
  const { total, completed } = totalsResult.rows[0];
  const totalNum = Number(total);
  const completedNum = Number(completed);
  const progress = totalNum > 0 ? Math.round((completedNum / totalNum) * 100) : 0;
  const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';

  const upsertResult = await client.query(
    `INSERT INTO enrollments (student_id, course_id, progress, status, completed_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (student_id, course_id) DO UPDATE
       SET progress = EXCLUDED.progress,
           status = EXCLUDED.status,
           completed_at = EXCLUDED.completed_at
     RETURNING *`,
    [studentId, courseId, progress, status, status === 'completed' ? new Date() : null]
  );

  return upsertResult.rows[0];
}

export const setLessonProgress = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.params;
  const { completed } = req.body;
  const studentId = req.user.id;

  const lessonResult = await query('SELECT id, course_id, title FROM lessons WHERE id = $1 AND course_id = $2', [
    lessonId,
    courseId,
  ]);
  const lesson = lessonResult.rows[0];
  if (!lesson) throw new ApiError(404, 'Lesson not found.');

  const isCompleted = completed !== false;

  await query(
    `INSERT INTO lesson_progress (student_id, lesson_id, completed, completed_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (student_id, lesson_id) DO UPDATE
       SET completed = EXCLUDED.completed, completed_at = EXCLUDED.completed_at`,
    [studentId, lessonId, isCompleted, isCompleted ? new Date() : null]
  );

  const client = await pool.connect();
  let enrollment;
  try {
    enrollment = await recalculateCourseProgress(client, studentId, courseId);

    if (enrollment.status === 'completed') {
      const courseResult = await client.query('SELECT title FROM courses WHERE id = $1', [courseId]);
      const existingNotif = await client.query(
        `SELECT id FROM notifications WHERE student_id = $1 AND type = 'course' AND message = $2`,
        [studentId, `Congratulations! You completed ${courseResult.rows[0].title}.`]
      );
      if (existingNotif.rows.length === 0) {
        await client.query(
          `INSERT INTO notifications (student_id, title, message, type)
           VALUES ($1, $2, $3, 'course')`,
          [studentId, 'Course completed', `Congratulations! You completed ${courseResult.rows[0].title}.`]
        );
      }
    }
  } finally {
    client.release();
  }

  res.json({
    lesson: { id: lesson.id, completed: isCompleted },
    enrollment: {
      progress: enrollment.progress,
      status: enrollment.status,
    },
  });
});
