export function formatDate(dateInput, options = {}) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

export function formatDateTime(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return `${formatDate(date)} · ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export function timeAgo(dateInput) {
  if (!dateInput) return '';
  const seconds = Math.floor((Date.now() - new Date(dateInput).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, secondsInUnit] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function daysUntil(dateInput) {
  const due = new Date(dateInput);
  const now = new Date();
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
}

export function statusLabel(status) {
  const labels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
    upcoming: 'Upcoming',
    due_soon: 'Due Soon',
    overdue: 'Overdue',
    submitted: 'Submitted',
    graded: 'Graded',
    pending: 'Pending',
  };
  return labels[status] || status;
}

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
