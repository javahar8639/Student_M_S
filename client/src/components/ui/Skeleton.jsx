export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-DEFAULT bg-black/[0.06] ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-5">
      <Skeleton className="mb-3 h-32 w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-4 h-3 w-1/2" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="card flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}
