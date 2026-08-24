import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems.js';

const PRIMARY_MOBILE_ITEMS = NAV_ITEMS.slice(0, 5);

export default function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border-soft bg-surface/95 backdrop-blur lg:hidden"
      aria-label="Primary navigation"
    >
      {PRIMARY_MOBILE_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150 ${
              isActive ? 'text-accent' : 'text-ink-faint'
            }`
          }
        >
          <Icon width={20} height={20} />
          {label === 'My Courses' ? 'Courses' : label}
        </NavLink>
      ))}
    </nav>
  );
}
