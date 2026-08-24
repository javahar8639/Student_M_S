import { useNotifications } from '../context/NotificationsContext.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { NotificationsIcon, CheckCircleIcon } from '../components/icons.jsx';
import { timeAgo } from '../lib/format.js';

const TYPE_ICON_COLOR = {
  assignment: 'text-warning',
  grade: 'text-success',
  course: 'text-accent',
  general: 'text-info',
};

export default function Notifications() {
  const { notifications, unreadCount, isLoading, markRead, markAllRead } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Notifications</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You’re all caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={<NotificationsIcon width={28} height={28} />} title="No notifications" description="We'll let you know when something needs your attention." />
      ) : (
        <Card className="divide-y divide-border-soft">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-3.5 px-5 py-4 transition-colors ${!n.is_read ? 'bg-accent-light/30' : ''}`}>
              <div className={`mt-0.5 shrink-0 ${TYPE_ICON_COLOR[n.type] || 'text-ink-faint'}`}>
                <NotificationsIcon width={18} height={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  {!n.is_read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger" aria-label="Unread" />}
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">{n.message}</p>
                <p className="mt-1 text-xs text-ink-faint">{timeAgo(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-DEFAULT px-2.5 py-1.5 text-xs font-medium text-accent hover:bg-accent-light"
                >
                  <CheckCircleIcon width={14} height={14} /> Mark read
                </button>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
