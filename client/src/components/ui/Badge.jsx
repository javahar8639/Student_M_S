const STATUS_VARIANT = {
  not_started: 'badge-neutral',
  in_progress: 'badge-info',
  completed: 'badge-success',
  upcoming: 'badge-neutral',
  due_soon: 'badge-warning',
  overdue: 'badge-danger',
  submitted: 'badge-info',
  graded: 'badge-success',
  pending: 'badge-neutral',
};

export default function Badge({ status, children, variant, className = '' }) {
  const cls = variant ? `badge-${variant}` : STATUS_VARIANT[status] || 'badge-neutral';
  return <span className={`${cls} ${className}`}>{children}</span>;
}
