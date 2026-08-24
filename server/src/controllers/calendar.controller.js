import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCalendarEvents = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const result = await query(
    `SELECT a.id, a.title, a.due_date, c.title AS course_title,
       s.status AS submission_status, s.marks
     FROM assignments a
     JOIN courses c ON c.id = a.course_id
     JOIN enrollments e ON e.course_id = c.id AND e.student_id = $1
     LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $1
     ORDER BY a.due_date ASC`,
    [studentId]
  );

  const events = result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    date: row.due_date,
    courseTitle: row.course_title,
    type: 'assignment',
    status: row.marks !== null ? 'graded' : row.submission_status === 'submitted' ? 'submitted' : 'pending',
  }));

  res.json({ events });
});
