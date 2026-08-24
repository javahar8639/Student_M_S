import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';

function computeStatus(row) {
  if (row.marks !== null && row.marks !== undefined) return 'graded';
  if (row.submission_status === 'submitted') return 'submitted';
  if (new Date(row.due_date) < new Date()) return 'overdue';
  return 'upcoming';
}

function toDto(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    maxMarks: row.max_marks,
    courseId: row.course_id,
    courseTitle: row.course_title,
    status: computeStatus(row),
    submission: row.submission_id
      ? {
          id: row.submission_id,
          text: row.submission_text,
          submittedAt: row.submitted_at,
          marks: row.marks,
          feedback: row.feedback,
        }
      : null,
  };
}

export const listAssignments = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { status } = req.query;

  const result = await query(
    `SELECT a.*, c.title AS course_title,
       s.id AS submission_id, s.submission_text, s.status AS submission_status,
       s.submitted_at, s.marks, s.feedback
     FROM assignments a
     JOIN courses c ON c.id = a.course_id
     LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $1
     ORDER BY a.due_date ASC`,
    [studentId]
  );

  let assignments = result.rows.map(toDto);

  if (status && status !== 'All') {
    const normalized = status.toLowerCase();
    assignments = assignments.filter((a) => a.status === normalized);
  }

  res.json({ assignments });
});

export const getAssignmentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  const result = await query(
    `SELECT a.*, c.title AS course_title,
       s.id AS submission_id, s.submission_text, s.status AS submission_status,
       s.submitted_at, s.marks, s.feedback
     FROM assignments a
     JOIN courses c ON c.id = a.course_id
     LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $2
     WHERE a.id = $1`,
    [id, studentId]
  );

  const row = result.rows[0];
  if (!row) throw new ApiError(404, 'Assignment not found.');

  res.json({ assignment: toDto(row) });
});
