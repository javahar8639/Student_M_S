import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { dashboardApi } from '../api/dashboard.js';
import { useAuth } from '../context/AuthContext.jsx';
import { greeting, formatDate, timeAgo, daysUntil, statusLabel } from '../lib/format.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { Skeleton, SkeletonCard, SkeletonRow } from '../components/ui/Skeleton.jsx';
import { CoursesIcon, AssignmentsIcon, GradesIcon, CheckCircleIcon, ClockIcon } from '../components/icons.jsx';

const ACTIVITY_COPY = {
  lesson_completed: (label) => `Completed lesson "${label}"`,
  assignment_submitted: (label) => `Submitted "${label}"`,
  course_completed: (label) => `Completed course "${label}"`,
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useFetch(dashboardApi.get, []);

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {greeting()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Here&apos;s what you have to focus on today.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <SummaryCards summary={data.summary} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-ink">Continue Learning</h2>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : data.continueLearning.length === 0 ? (
            <EmptyState
              icon={<CoursesIcon width={28} height={28} />}
              title="No courses in progress"
              description="Browse your courses to pick one up."
              action={
                <Link to="/courses" className="btn-primary">
                  Browse Courses
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.continueLearning.map((course) => (
                <ContinueLearningCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink">Upcoming Tasks</h2>
          {isLoading ? (
            <div className="space-y-3">
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : data.upcomingTasks.length === 0 ? (
            <EmptyState icon={<AssignmentsIcon width={26} height={26} />} title="You're all caught up" description="No pending assignments right now." />
          ) : (
            <div className="space-y-3">
              {data.upcomingTasks.map((task) => (
                <UpcomingTaskRow key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-base font-semibold text-ink">Recent Activity</h2>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : data.recentActivity.length === 0 ? (
            <EmptyState title="No recent activity" description="Your learning activity will show up here." />
          ) : (
            <Card className="divide-y divide-border-soft">
              {data.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <CheckCircleIcon width={16} height={16} className="mt-0.5 shrink-0 text-success" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">
                      {ACTIVITY_COPY[activity.kind]?.(activity.label) || activity.label}
                    </p>
                    <p className="text-xs text-ink-faint">
                      {activity.courseTitle} · {timeAgo(activity.occurredAt)}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink">Recent Grades</h2>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : data.recentGrades.length === 0 ? (
            <EmptyState icon={<GradesIcon width={26} height={26} />} title="No grades yet" description="Submit assignments to see your grades here." />
          ) : (
            <Card className="divide-y divide-border-soft">
              {data.recentGrades.map((grade, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{grade.assignmentTitle}</p>
                    <p className="text-xs text-ink-faint">{grade.courseTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">{grade.percentage}%</p>
                    <p className="text-xs text-ink-faint">{grade.letter}</p>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

function SummaryCards({ summary }) {
  const cards = [
    { label: 'Courses in Progress', value: summary.coursesInProgress },
    { label: 'Overall Progress', value: `${summary.overallProgress}%` },
    { label: 'Pending Assignments', value: summary.pendingAssignments },
    { label: 'Completed Courses', value: summary.completedCourses },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-5 animate-fadeSlideUp">
          <p className="text-2xl font-semibold text-ink">{card.value}</p>
          <p className="mt-1 text-sm text-ink-soft">{card.label}</p>
        </Card>
      ))}
    </div>
  );
}

function ContinueLearningCard({ course }) {
  return (
    <Card hover className="overflow-hidden">
      <img src={course.thumbnail} alt="" className="h-28 w-full object-cover" loading="lazy" />
      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-ink">{course.title}</h3>
        <p className="mt-0.5 text-xs text-ink-soft">{course.instructor}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
          <span>{course.progress}% complete</span>
        </div>
        <ProgressBar value={course.progress} size="sm" className="mt-1.5" />
        {course.nextLesson && <p className="mt-2.5 truncate text-xs text-ink-faint">Next: {course.nextLesson}</p>}
        <Link to={`/courses/${course.id}`} className="btn-secondary mt-3.5 w-full text-xs">
          Continue Learning
        </Link>
      </div>
    </Card>
  );
}

function UpcomingTaskRow({ task }) {
  const urgencyVariant = { due_soon: 'warning', overdue: 'danger', upcoming: 'neutral' }[task.urgency];
  const days = daysUntil(task.dueDate);
  const dueCopy = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `Due in ${days}d`;

  return (
    <Link to={`/assignments?assignmentId=${task.id}`} className="block">
      <Card hover className="flex items-center gap-3 p-4">
        <ClockIcon width={18} height={18} className="shrink-0 text-ink-faint" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{task.title}</p>
          <p className="truncate text-xs text-ink-faint">{task.courseTitle} · {formatDate(task.dueDate)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge variant={urgencyVariant}>{statusLabel(task.urgency)}</Badge>
          <span className="text-xs text-ink-faint">{dueCopy}</span>
        </div>
      </Card>
    </Link>
  );
}
