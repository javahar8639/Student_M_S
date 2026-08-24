import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems.js';

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border-soft bg-surface lg:flex lg:flex-col">
      <div className="flex h-16 items-center px-6">
        <span className="font-serif text-lg font-semibold text-ink">EduTrack</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Primary navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-DEFAULT px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive ? 'bg-accent-light text-accent-dark' : 'text-ink-soft hover:bg-black/[0.03] hover:text-ink'
              }`
            }
          >
            <Icon className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
