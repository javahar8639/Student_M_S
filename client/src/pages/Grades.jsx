import { gradesApi } from '../api/grades.js';
import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { GradesIcon } from '../components/icons.jsx';
import { formatDate } from '../lib/format.js';

export default function Grades() {
  const { data, isLoading, error, refetch } = useFetch(gradesApi.get, []);

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Grades</h1>
        <p className="mt-1 text-sm text-ink-soft">Your performance across every course.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-28" />
      ) : data.courseGrades.length === 0 ? (
        <EmptyState icon={<GradesIcon width={28} height={28} />} title="No grades yet" description="Grades will appear once your assignments are graded." />
      ) : (
        <>
          <Card className="flex items-center gap-6 p-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-accent-light text-lg font-semibold text-accent">
              {data.overallAverage}%
            </div>
            <div>
              <p className="text-sm text-ink-soft">Overall Average</p>
              <p className="text-xl font-semibold text-ink">{data.overallLetter}</p>
            </div>
          </Card>

          <section>
            <h2 className="mb-3 text-base font-semibold text-ink">Course-wise Grades</h2>
            <Card className="divide-y divide-border-soft p-2">
              {data.courseGrades.map((c) => (
                <div key={c.courseId} className="flex items-center gap-4 px-3 py-3.5">
                  <div className="w-36 shrink-0 truncate text-sm font-medium text-ink sm:w-48">{c.courseTitle}</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                    <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${c.percentage}%` }} />
                  </div>
                  <div className="w-16 shrink-0 text-right text-sm font-semibold text-ink">{c.percentage}%</div>
                  <div className="w-8 shrink-0 text-right text-sm text-ink-soft">{c.letter}</div>
                </div>
              ))}
            </Card>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-ink">Recent Grades</h2>
            <Card className="divide-y divide-border-soft">
              {data.recentGrades.map((g) => (
                <div key={g.submissionId} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{g.assignmentTitle}</p>
                    <p className="truncate text-xs text-ink-faint">
                      {g.courseTitle} · {formatDate(g.submittedAt)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-ink">
                      {g.marks}/{g.maxMarks}
                    </p>
                    <p className="text-xs text-ink-faint">{g.letter}</p>
                  </div>
                </div>
              ))}
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
