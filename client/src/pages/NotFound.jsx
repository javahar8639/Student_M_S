import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <p className="font-serif text-5xl font-semibold text-ink">404</p>
      <h1 className="mt-3 text-lg font-medium text-ink">Page not found</h1>
      <p className="mt-1.5 max-w-sm text-sm text-ink-soft">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link to="/dashboard" className="btn-primary mt-6">
        Back to Dashboard
      </Link>
    </div>
  );
}
