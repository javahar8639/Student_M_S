import { useRef, useState } from 'react';
import Modal from './ui/Modal.jsx';
import Badge from './ui/Badge.jsx';
import Button from './ui/Button.jsx';
import { CheckCircleIcon, PaperclipIcon, FileIcon, CloseIcon } from './icons.jsx';
import { formatDate, formatDateTime, statusLabel } from '../lib/format.js';
import { assignmentsApi } from '../api/assignments.js';
import { API_ORIGIN } from '../api/client.js';

const MIN_LENGTH = 10;
const MAX_LENGTH = 5000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.zip'];

export default function AssignmentDetailModal({ assignment, onClose, onSubmitted }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  if (!assignment) return null;

  const canSubmit = assignment.status === 'upcoming' || assignment.status === 'overdue';

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = `.${selected.name.split('.').pop().toLowerCase()}`;
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      e.target.value = '';
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 10MB.');
      e.target.value = '';
      return;
    }
    setError('');
    setFile(selected);
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed && !file) return setError('Add a submission text or attach a file.');
    if (trimmed && trimmed.length < MIN_LENGTH) return setError(`Submission text must be at least ${MIN_LENGTH} characters.`);
    if (trimmed.length > MAX_LENGTH) return setError(`Submission text cannot exceed ${MAX_LENGTH} characters.`);

    setError('');
    setIsSubmitting(true);
    try {
      await assignmentsApi.submit(assignment.id, { submissionText: trimmed, file });
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
            {assignment.submission.text && (
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink-soft">{assignment.submission.text}</p>
            )}
            {assignment.submission.attachmentUrl && (
              <a
                href={`${API_ORIGIN}${assignment.submission.attachmentUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-DEFAULT bg-black/[0.04] px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-black/[0.07]"
              >
                <FileIcon width={14} height={14} /> {assignment.submission.attachmentName || 'Attachment'}
              </a>
            )}
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

            <label htmlFor="attachment" className="label">
              Attachment (optional)
            </label>
            {!file ? (
              <label
                htmlFor="attachment"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-DEFAULT border border-dashed border-border px-3.5 py-3 text-sm text-ink-soft transition-colors hover:border-accent hover:bg-accent-light/30"
              >
                <PaperclipIcon width={16} height={16} />
                Attach a file (PDF, DOC, image, ZIP — up to 10MB)
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-DEFAULT border border-border-soft bg-paper/60 px-3.5 py-2.5">
                <span className="flex items-center gap-2 truncate text-sm text-ink">
                  <FileIcon width={16} height={16} className="shrink-0 text-ink-faint" />
                  <span className="truncate">{file.name}</span>
                  <span className="shrink-0 text-xs text-ink-faint">({Math.round(file.size / 1024)} KB)</span>
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove attachment"
                  className="shrink-0 rounded-DEFAULT p-1 text-ink-faint hover:bg-black/[0.06] hover:text-ink"
                >
                  <CloseIcon width={14} height={14} />
                </button>
              </div>
            )}
            <input
              id="attachment"
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept={ALLOWED_EXTENSIONS.join(',')}
              className="sr-only"
            />

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
