import { useState } from 'react';
import Modal from './ui/Modal.jsx';
import Badge from './ui/Badge.jsx';
import Button from './ui/Button.jsx';
import { CheckCircleIcon } from './icons.jsx';
import { formatDate, formatDateTime, statusLabel } from '../lib/format.js';
import { assignmentsApi } from '../api/assignments.js';

const MIN_LENGTH = 10;
const MAX_LENGTH = 5000;

export default function AssignmentDetailModal({ assignment, onClose, onSubmitted }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  if (!assignment) return null;

  const canSubmit = assignment.status === 'upcoming' || assignment.status === 'overdue';

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length < MIN_LENGTH) return setError(`Submission must be at least ${MIN_LENGTH} characters.`);
    if (trimmed.length > MAX_LENGTH) return setError(`Submission cannot exceed ${MAX_LENGTH} characters.`);

    setError('');
    setIsSubmitting(true);
    try {
      await assignmentsApi.submit(assignment.id, trimmed);
      setJustSubmitted(true);
      setTimeout(() => {
        onSubmitted();
      }, 900);
    } catch (err) {
      setError(err.message || 'Unable to submit right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={!!assignment} onClose={onClose} title={assignment.title}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge status={assignment.status}>{statusLabel(assignment.status)}</Badge>
          <span className="text-xs text-ink-faint">{assignment.courseTitle}</span>
        </div>

        <p className="text-sm leading-relaxed text-ink-soft">{assignment.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-ink-faint">Due Date</p>
            <p className="font-medium text-ink">{formatDate(assignment.dueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Max Marks</p>
            <p className="font-medium text-ink">{assignment.maxMarks}</p>
          </div>
        </div>

        {assignment.submission && (
          <div className="rounded-lg border border-border-soft bg-paper/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Your Submission</p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink-soft">{assignment.submission.text}</p>
            <p className="mt-2 text-xs text-ink-faint">Submitted {formatDateTime(assignment.submission.submittedAt)}</p>

            {assignment.submission.marks !== null && assignment.submission.marks !== undefined && (
              <div className="mt-3 rounded-DEFAULT bg-success-light px-3.5 py-2.5">
                <p className="text-sm font-semibold text-success">
                  Grade: {assignment.submission.marks}/{assignment.maxMarks}
                </p>
                {assignment.submission.feedback && (
                  <p className="mt-1 text-sm text-ink-soft">{assignment.submission.feedback}</p>
                )}
              </div>
            )}
          </div>
        )}

        {canSubmit && !justSubmitted && (
          <form onSubmit={handleSubmit} className="space-y-2">
            <label htmlFor="submissionText" className="label">
              Submission Text
            </label>
            <textarea
              id="submissionText"
              rows={6}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError('');
              }}
              placeholder="Write or paste your submission here…"
              className="input resize-none"
              aria-invalid={!!error}
              aria-describedby={error ? 'submission-error' : undefined}
            />
            <div className="flex items-center justify-between text-xs text-ink-faint">
              <span id={error ? 'submission-error' : undefined} className={error ? 'text-danger' : ''} role={error ? 'alert' : undefined}>
                {error || `${text.trim().length}/${MAX_LENGTH} characters`}
              </span>
            </div>

            <div className="rounded-DEFAULT border border-dashed border-border px-3.5 py-2.5 text-xs text-ink-faint">
              Attachments aren&apos;t required — a text submission is enough for this assignment.
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Submit Assignment
            </Button>
          </form>
        )}

        {justSubmitted && (
          <div className="flex flex-col items-center rounded-lg bg-success-light py-6 text-center animate-scaleIn">
            <CheckCircleIcon width={32} height={32} className="mb-2 text-success" />
            <p className="text-sm font-medium text-success">Submission received</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
