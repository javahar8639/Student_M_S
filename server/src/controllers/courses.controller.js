import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';

function courseRowToDto(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    instructor: row.instructor,
    thumbnail: row.thumbnail,
    difficulty: row.difficulty,
    duration: row.duration,
    progress: row.progress ?? 0,
    status: row.status ?? 'not_started',
    lessonCount: Number(row.lesson_count ?? 0),
  };
}

export const listCourses = asyncHandler(async (req, res) => {
  const { search, status, category } = req.query;
  const studentId = req.user.id;

  const conditions = [];
  const params = [studentId];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(c.title ILIKE $${params.length} OR c.instructor ILIKE $${params.length} OR c.category ILIKE $${params.length})`);
  }
  if (category && category !== 'All') {
    params.push(category);
    conditions.push(`c.category = $${params.length}`);
  }
  if (status && status !== 'All') {
    params.push(status);
    conditions.push(`COALESCE(e.status, 'not_started') = $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(
    `SELECT c.*, e.progress, e.status,
       (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS lesson_count
     FROM courses c
     LEFT JOIN enrollments e ON e.course_id = c.id AND e.student_id = $1
     ${whereClause}
     ORDER BY c.id ASC`,
    params
  );

  res.json({ courses: result.rows.map(courseRowToDto) });
});

export const getCourseDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  const courseResult = await query(
    `SELECT c.*, e.progress, e.status,
       (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS lesson_count
     FROM courses c
     LEFT JOIN enrollments e ON e.course_id = c.id AND e.student_id = $2
     WHERE c.id = $1`,
    [id, studentId]
  );
  const course = courseResult.rows[0];
  if (!course) throw new ApiError(404, 'Course not found.');

  const lessonsResult = await query(
    `SELECT l.id, l.title, l.description, l.order_number, l.duration, l.module_title,
       COALESCE(lp.completed, false) AS completed
     FROM lessons l
     LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = $2
     WHERE l.course_id = $1
     ORDER BY l.order_number ASC`,
    [id, studentId]
  );

  const lessons = lessonsResult.rows.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    orderNumber: l.order_number,
    duration: l.duration,
    moduleTitle: l.module_title,
    completed: l.completed,
  }));

  const nextLesson = lessons.find((l) => !l.completed);

  res.json({
    course: { ...courseRowToDto(course), nextLesson: nextLesson?.title ?? null },
    lessons,
  });
});
