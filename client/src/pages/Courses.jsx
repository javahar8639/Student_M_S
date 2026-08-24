import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesApi } from '../api/courses.js';
import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import { SearchIcon, CoursesIcon } from '../components/icons.jsx';
import { statusLabel } from '../lib/format.js';

const STATUS_FILTERS = [
  { value: 'All', label: 'All' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'not_started', label: 'Not Started' },
];

const CATEGORY_FILTERS = ['All', 'AI', 'Design', 'Coding', 'Business', 'Marketing'];

export default function Courses() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, error, refetch } = useFetch(
    () => coursesApi.list({ search: debouncedSearch, status, category }),
    [debouncedSearch, status, category]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">My Courses</h1>
        <p className="mt-1 text-sm text-ink-soft">Search and filter across everything you&apos;re learning.</p>
      </div>

      <div className="space-y-3">
        <div className="relative max-w-md">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course, instructor, or category…"
            aria-label="Search courses"
            className="input pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <FilterChip key={f.value} active={status === f.value} onClick={() => setStatus(f.value)}>
              {f.label}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_FILTERS.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)} subtle>
              {c}
            </FilterChip>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={refetch} />}

      {!error && isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!error && !isLoading && data?.courses.length === 0 && (
        <EmptyState
          icon={<CoursesIcon width={28} height={28} />}
          title="No courses found"
          description="Try adjusting your search or filters."
        />
      )}

      {!error && !isLoading && data?.courses.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children, subtle }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
        active
          ? 'border-accent bg-accent text-white'
          : subtle
          ? 'border-border-soft bg-surface text-ink-soft hover:border-ink-faint'
          : 'border-border bg-surface text-ink-soft hover:border-ink-faint'
      }`}
    >
      {children}
    </button>
  );
}

function CourseCard({ course }) {
  return (
    <Card hover className="overflow-hidden">
      <img src={course.thumbnail} alt="" className="h-36 w-full object-cover" loading="lazy" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">{course.title}</h3>
          <Badge status={course.status}>{statusLabel(course.status)}</Badge>
        </div>
        <p className="mt-1 text-xs text-ink-soft">{course.instructor}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-ink-faint">
          <Badge variant="neutral">{course.category}</Badge>
          <span>·</span>
          <span>{course.difficulty}</span>
          <span>·</span>
          <span>{course.duration}</span>
        </div>

        <div className="mt-3.5">
          <div className="mb-1.5 flex justify-between text-xs text-ink-soft">
            <span>{course.progress}% complete</span>
            <span>{course.lessonCount} lessons</span>
          </div>
          <ProgressBar value={course.progress} size="sm" />
        </div>

        <Link to={`/courses/${course.id}`} className="btn-primary mt-4 w-full text-sm">
          {course.progress > 0 ? 'Continue' : 'View Course'}
        </Link>
      </div>
    </Card>
  );
}
