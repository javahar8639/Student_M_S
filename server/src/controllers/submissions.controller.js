import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';
import { requireFields } from '../utils/validate.js';

const MAX_SUBMISSION_LENGTH = 5000;
const MIN_SUBMISSION_LENGTH = 10;

export const submitAssignment = asyncHandler(async (req, res) => {
  const { id: assignmentId } = req.params;
  const { submissionText } = req.body;
  const studentId = req.user.id;

  requireFields(req.body, ['submissionText']);

  const trimmed = submissionText.trim();
  if (trimmed.length < MIN_SUBMISSION_LENGTH) {
    throw new ApiError(400, `Submission must be at least ${MIN_SUBMISSION_LENGTH} characters long.`);
  }
  if (trimmed.length > MAX_SUBMISSION_LENGTH) {
    throw new ApiError(400, `Submission cannot exceed ${MAX_SUBMISSION_LENGTH} characters.`);
  }

  const assignmentResult = await query('SELECT id FROM assignments WHERE id = $1', [assignmentId]);
  if (assignmentResult.rows.length === 0) {
    throw new ApiError(404, 'Assignment not found.');
  }

  const result = await query(
    `INSERT INTO submissions (assignment_id, student_id, submission_text, status, submitted_at)
     VALUES ($1, $2, $3, 'submitted', now())
     ON CONFLICT (assignment_id, student_id) DO UPDATE
       SET submission_text = EXCLUDED.submission_text,
           status = 'submitted',
           submitted_at = now(),
           marks = NULL,
           feedback = NULL
     RETURNING *`,
    [assignmentId, studentId, trimmed]
  );

  res.status(201).json({ submission: result.rows[0] });
});
