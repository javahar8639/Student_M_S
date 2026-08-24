import { useMemo, useState } from 'react';
import { calendarApi } from '../api/calendar.js';
import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Modal from '../components/ui/Modal.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { statusLabel, formatDate } from '../lib/format.js';
import { ClockIcon, AlertIcon, SendIcon, CheckCircleIcon } from '../components/icons.jsx';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_CONFIG = {
  upcoming: { icon: ClockIcon, iconColor: 'text-ink-soft', badgeBg: 'bg-black/[0.07]', label: 'Due' },
  overdue: { icon: AlertIcon, iconColor: 'text-danger', badgeBg: 'bg-danger-light', label: 'Overdue' },
  submitted: { icon: SendIcon, iconColor: 'text-info', badgeBg: 'bg-info-light', label: 'To Be Graded' },
  graded: { icon: CheckCircleIcon, iconColor: 'text-success', badgeBg: 'bg-success-light', label: 'Graded' },
};
const STATUS_ORDER = ['upcoming', 'overdue', 'submitted', 'graded'];

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

  const statusCounts = useMemo(() => {
    const counts = { upcoming: 0, overdue: 0, submitted: 0, graded: 0 };
    for (const event of data?.events || []) {
      if (counts[event.status] !== undefined) counts[event.status] += 1;
    }
    return counts;
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

      {!isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATUS_ORDER.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const Icon = cfg.icon;
            return (
              <Card key={status} className="flex items-center gap-3 p-4">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cfg.badgeBg}`}>
                  <Icon width={16} height={16} className={cfg.iconColor} />
                </span>
                <div>
                  <p className="text-lg font-semibold leading-none text-ink">{statusCounts[status]}</p>
                  <p className="mt-1 text-xs text-ink-soft">{cfg.label}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

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
                  className={`flex min-h-[68px] flex-col items-center gap-1.5 rounded-DEFAULT border p-1.5 text-sm transition-colors duration-150 sm:min-h-[84px] ${
                    inMonth ? 'border-transparent' : 'border-transparent opacity-35'
                  } ${dayEvents.length > 0 ? 'cursor-pointer hover:border-accent/40 hover:bg-accent-light/40' : 'cursor-default'}`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      isToday ? 'bg-accent font-semibold text-white ring-2 ring-accent/30 ring-offset-1 ring-offset-surface' : 'text-ink'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="flex flex-wrap justify-center gap-1">
                    {dayEvents.slice(0, 3).map((e) => {
                      const cfg = STATUS_CONFIG[e.status];
                      const Icon = cfg.icon;
                      return (
                        <span
                          key={e.id}
                          title={cfg.label}
                          className={`flex h-4 w-4 items-center justify-center rounded-full ${cfg.badgeBg}`}
                        >
                          <Icon width={10} height={10} className={cfg.iconColor} strokeWidth={2.2} />
                        </span>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] leading-4 text-ink-faint">+{dayEvents.length - 3}</span>
                    )}
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
