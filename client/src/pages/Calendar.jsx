import { useMemo, useState } from 'react';
import { calendarApi } from '../api/calendar.js';
import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Modal from '../components/ui/Modal.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { statusLabel, formatDate } from '../lib/format.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toKey(date) {
  return date.toISOString().slice(0, 10);
}

export default function Calendar() {
  const { data, isLoading, error, refetch } = useFetch(calendarApi.list, []);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState(null);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const event of data?.events || []) {
      const key = new Date(event.date).toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(event);
    }
    return map;
  }, [data]);

  const cells = useMemo(() => {
    const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startOffset);

    return Array.from({ length: 42 }).map((_, i) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      return date;
    });
  }, [cursor]);

  const today = toKey(new Date());
  const selectedEvents = selectedDay ? eventsByDay.get(selectedDay) || [] : [];

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Calendar</h1>
        <p className="mt-1 text-sm text-ink-soft">Assignment deadlines at a glance.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="rounded-DEFAULT p-2 text-ink-soft hover:bg-black/[0.04]"
              aria-label="Previous month"
            >
              ←
            </button>
            <h2 className="text-base font-semibold text-ink">
              {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="rounded-DEFAULT p-2 text-ink-soft hover:bg-black/[0.04]"
              aria-label="Next month"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink-faint">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((date) => {
              const key = toKey(date);
              const inMonth = date.getMonth() === cursor.getMonth();
              const dayEvents = eventsByDay.get(key) || [];
              const isToday = key === today;

              return (
                <button
                  key={key}
                  onClick={() => dayEvents.length > 0 && setSelectedDay(key)}
                  disabled={dayEvents.length === 0}
                  className={`flex min-h-[64px] flex-col items-center gap-1 rounded-DEFAULT border p-1.5 text-sm transition-colors duration-150 sm:min-h-[80px] ${
                    inMonth ? 'border-transparent' : 'border-transparent opacity-35'
                  } ${dayEvents.length > 0 ? 'cursor-pointer hover:border-accent/40 hover:bg-accent-light/40' : 'cursor-default'}`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${isToday ? 'bg-accent text-white' : 'text-ink'}`}>
                    {date.getDate()}
                  </span>
                  <div className="flex flex-wrap justify-center gap-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={`h-1.5 w-1.5 rounded-full ${
                          e.status === 'graded' ? 'bg-success' : e.status === 'submitted' ? 'bg-info' : 'bg-warning'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <Modal isOpen={!!selectedDay} onClose={() => setSelectedDay(null)} title={selectedDay ? formatDate(selectedDay) : ''}>
        <div className="space-y-3">
          {selectedEvents.map((event) => (
            <div key={event.id} className="rounded-DEFAULT border border-border-soft p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">{event.title}</p>
                <Badge status={event.status}>{statusLabel(event.status)}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-faint">{event.courseTitle}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
