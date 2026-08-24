export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-md page-transition">
        <div className="mb-8 text-center">
          <p className="font-serif text-xl font-semibold tracking-tight text-ink">EduTrack</p>
          {eyebrow && <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-faint">{eyebrow}</p>}
        </div>

        <div className="card p-7 sm:p-8">
          <h1 className="text-xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>}
      </div>
    </div>
  );
}
