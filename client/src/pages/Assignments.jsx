import { useState } from 'react';
import { assignmentsApi } from '../api/assignments.js';
import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { SkeletonRow } from '../components/ui/Skeleton.jsx';
import { AssignmentsIcon } from '../components/icons.jsx';
import { formatDate, statusLabel } from '../lib/format.js';
import AssignmentDetailModal from '../components/AssignmentDetailModal.jsx';

const FILTERS = [
  { value: 'All', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'graded', label: 'Graded' },
];

export default function Assignments() {
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const { data, isLoading, error, refetch } = useFetch(() => assignmentsApi.list({ status: filter }), [filter]);

  const selected = data?.assignments.find((a) => a.id === selectedId) || null;

  function handleSubmitted() {
    setSelectedId(null);
    refetch();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Assignments</h1>
        <p className="mt-1 text-sm text-ink-soft">Track what&apos;s due, submitted, and graded.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
              filter === f.value ? 'border-accent bg-accent text-white' : 'border-border bg-surface text-ink-soft hover:border-ink-faint'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <ErrorState message={error} onRetry={refetch} />}

      {!error && isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      {!error && !isLoading && data.assignments.length === 0 && (
        <EmptyState icon={<AssignmentsIcon width={28} height={28} />} title="No assignments yet." description="Check back once your instructors post new work." />
      )}

      {!error && !isLoading && data.assignments.length > 0 && (
        <div className="space-y-3">
          {data.assignments.map((a) => (
            <button key={a.id} onClick={() => setSelectedId(a.id)} className="block w-full text-left">
              <Card hover className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                  <p className="truncate text-xs text-ink-faint">{a.courseTitle}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-ink-faint">Due {formatDate(a.dueDate)}</p>
                    {a.submission?.marks !== null && a.submission?.marks !== undefined && (
                      <p className="text-xs font-medium text-ink">
                        {a.submission.marks}/{a.maxMarks}
                      </p>
                    )}
                  </div>
                  <Badge status={a.status}>{statusLabel(a.status)}</Badge>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      <AssignmentDetailModal assignment={selected} onClose={() => setSelectedId(null)} onSubmitted={handleSubmitted} />
    </div>
  );
}
