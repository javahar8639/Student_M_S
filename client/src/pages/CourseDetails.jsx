import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { coursesApi } from '../api/courses.js';
import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { CheckCircleIcon, CircleIcon } from '../components/icons.jsx';
import { statusLabel } from '../lib/format.js';

export default function CourseDetails() {
  const { id } = useParams();
  const { data, isLoading, error, refetch, setData } = useFetch(() => coursesApi.get(id), [id]);
  const [pendingLessonId, setPendingLessonId] = useState(null);

  const modules = useMemo(() => {
    if (!data?.lessons) return [];
    const grouped = [];
    for (const lesson of data.lessons) {
      let group = grouped.find((g) => g.title === lesson.moduleTitle);
      if (!group) {
        group = { title: lesson.moduleTitle, lessons: [] };
        grouped.push(group);
      }
      group.lessons.push(lesson);
    }
    return grouped;
  }, [data]);

  async function toggleLesson(lesson) {
    if (pendingLessonId) return;
    setPendingLessonId(lesson.id);
    const nextCompleted = !lesson.completed;
    try {
      const result = await coursesApi.setLessonProgress(id, lesson.id, nextCompleted);
      setData((prev) => ({
        ...prev,
        course: { ...prev.course, progress: result.enrollment.progress, status: result.enrollment.status },
        lessons: prev.lessons.map((l) => (l.id === lesson.id ? { ...l, completed: nextCompleted } : l)),
      }));
    } catch {
      refetch();
    } finally {
      setPendingLessonId(null);
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const { course, lessons } = data;

  return (
    <div className="space-y-6">
      <Link to="/courses" className="text-sm font-medium text-ink-soft hover:text-ink">
        ← Back to My Courses
      </Link>

      <Card className="overflow-hidden">
        <img src={course.thumbnail} alt="" className="h-48 w-full object-cover sm:h-56" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="neutral">{course.category}</Badge>
                <Badge status={course.status}>{statusLabel(course.status)}</Badge>
              </div>
              <h1 className="text-xl font-semibold text-ink sm:text-2xl">{course.title}</h1>
              <p className="mt-1 text-sm text-ink-soft">By {course.instructor}</p>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">{course.description}</p>

          <div className="mt-5 flex flex-wrap gap-6 text-sm text-ink-soft">
            <span>{course.difficulty}</span>
            <span>{course.duration}</span>
            <span>{lessons.length} lessons</span>
          </div>

          <div className="mt-5 max-w-sm">
            <div className="mb-1.5 flex justify-between text-sm text-ink-soft">
              <span>Course Progress</span>
              <span className="font-medium text-ink">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold text-ink">Curriculum</h2>
        <div className="space-y-5">
          {modules.map((module, moduleIndex) => (
            <div key={module.title}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {String(moduleIndex + 1).padStart(2, '0')} {module.title}
              </p>
              <Card className="divide-y divide-border-soft">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => toggleLesson(lesson)}
                    disabled={pendingLessonId === lesson.id}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-black/[0.02] disabled:opacity-60"
                  >
                    {lesson.completed ? (
                      <CheckCircleIcon width={20} height={20} className="shrink-0 text-success" />
                    ) : (
                      <CircleIcon width={20} height={20} className="shrink-0 text-ink-faint" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${lesson.completed ? 'text-ink-soft line-through' : 'font-medium text-ink'}`}>
                        {lesson.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-ink-faint">{lesson.duration}</span>
                  </button>
                ))}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
