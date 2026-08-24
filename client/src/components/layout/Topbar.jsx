import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationsContext.jsx';
import GlobalSearch from '../GlobalSearch.jsx';
import { NotificationsIcon, ChevronDownIcon, LogOutIcon, ProfileIcon, MenuIcon, CloseIcon } from '../icons.jsx';
import { NAV_ITEMS } from './navItems.js';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border-soft bg-surface/95 px-4 backdrop-blur sm:px-6">
      <button
        className="rounded-DEFAULT p-1.5 text-ink-soft hover:bg-black/[0.04] lg:hidden"
        onClick={() => setMobileNavOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={mobileNavOpen}
      >
        {mobileNavOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <span className="font-serif text-base font-semibold text-ink lg:hidden">EduTrack</span>

      <div className="hidden flex-1 lg:block">
        <GlobalSearch />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link
          to="/notifications"
          className="relative rounded-DEFAULT p-2 text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        >
          <NotificationsIcon />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger" aria-hidden="true" />
          )}
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-DEFAULT p-1 pr-2 transition-colors hover:bg-black/[0.04]"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
              {initials || 'S'}
            </span>
            <span className="hidden text-sm font-medium text-ink sm:inline">{user?.name?.split(' ')[0]}</span>
            <ChevronDownIcon className="hidden text-ink-faint sm:inline" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border-soft bg-surface p-1.5 shadow-modal animate-fadeSlideUp"
              role="menu"
            >
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-DEFAULT px-3 py-2 text-sm text-ink hover:bg-black/[0.03]"
                role="menuitem"
              >
                <ProfileIcon width={17} height={17} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-DEFAULT px-3 py-2 text-left text-sm text-danger hover:bg-danger-light"
                role="menuitem"
              >
                <LogOutIcon width={17} height={17} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileNavOpen && (
        <div className="absolute inset-x-0 top-16 z-30 border-b border-border-soft bg-surface p-3 shadow-card lg:hidden animate-fadeSlideUp">
          <GlobalSearch />
          <nav className="mt-3 space-y-1" aria-label="Primary navigation">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-DEFAULT px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-accent-light text-accent-dark' : 'text-ink-soft hover:bg-black/[0.03]'
                  }`
                }
              >
                <Icon /> {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
