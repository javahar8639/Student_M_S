import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';

const MAX_SUBMISSION_LENGTH = 5000;
const MIN_SUBMISSION_LENGTH = 10;

export const submitAssignment = asyncHandler(async (req, res) => {
  const { id: assignmentId } = req.params;
  const submissionText = (req.body.submissionText || '').trim();
  const studentId = req.user.id;

  if (!submissionText && !req.file) {
    throw new ApiError(400, 'Add a submission text or attach a file.');
  }
  if (submissionText && submissionText.length < MIN_SUBMISSION_LENGTH) {
    throw new ApiError(400, `Submission text must be at least ${MIN_SUBMISSION_LENGTH} characters long.`);
  }
  if (submissionText.length > MAX_SUBMISSION_LENGTH) {
    throw new ApiError(400, `Submission text cannot exceed ${MAX_SUBMISSION_LENGTH} characters.`);
  }

  const assignmentResult = await query('SELECT id FROM assignments WHERE id = $1', [assignmentId]);
  if (assignmentResult.rows.length === 0) {
    throw new ApiError(404, 'Assignment not found.');
  }

  const attachmentName = req.file ? req.file.originalname : null;
  const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const result = await query(
    `INSERT INTO submissions (assignment_id, student_id, submission_text, attachment_name, attachment_url, status, submitted_at)
     VALUES ($1, $2, $3, $4, $5, 'submitted', now())
     ON CONFLICT (assignment_id, student_id) DO UPDATE
       SET submission_text = EXCLUDED.submission_text,
           attachment_name = COALESCE(EXCLUDED.attachment_name, submissions.attachment_name),
           attachment_url = COALESCE(EXCLUDED.attachment_url, submissions.attachment_url),
           status = 'submitted',
           submitted_at = now(),
           marks = NULL,
           feedback = NULL
     RETURNING *`,
    [assignmentId, studentId, submissionText || null, attachmentName, attachmentUrl]
  );

  res.status(201).json({ submission: result.rows[0] });
});
