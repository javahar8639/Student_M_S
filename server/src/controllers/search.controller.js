import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.json({ courses: [], lessons: [], assignments: [] });
  }

  const term = `%${q.trim()}%`;

  const [coursesResult, lessonsResult, assignmentsResult] = await Promise.all([
    query(
      `SELECT id, title, instructor FROM courses
       WHERE title ILIKE $1 OR instructor ILIKE $1 OR category ILIKE $1
       LIMIT 5`,
      [term]
    ),
    query(
      `SELECT l.id, l.title, l.course_id, c.title AS course_title FROM lessons l
       JOIN courses c ON c.id = l.course_id
       WHERE l.title ILIKE $1
       LIMIT 5`,
      [term]
    ),
    query(
      `SELECT a.id, a.title, a.course_id, c.title AS course_title FROM assignments a
       JOIN courses c ON c.id = a.course_id
       WHERE a.title ILIKE $1
       LIMIT 5`,
      [term]
    ),
  ]);

  res.json({
    courses: coursesResult.rows.map((r) => ({ id: r.id, title: r.title, instructor: r.instructor })),
    lessons: lessonsResult.rows.map((r) => ({ id: r.id, title: r.title, courseId: r.course_id, courseTitle: r.course_title })),
    assignments: assignmentsResult.rows.map((r) => ({ id: r.id, title: r.title, courseId: r.course_id, courseTitle: r.course_title })),
  });
});
