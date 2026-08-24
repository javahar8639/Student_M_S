// Minimal line-icon set (no external icon library) used across navigation and UI.
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const DashboardIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

export const CoursesIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15.5H6.5A2.5 2.5 0 004 16" />
    <path d="M4 5.5V16a2.5 2.5 0 002.5 2.5H20" />
  </svg>
);

export const AssignmentsIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <rect x="5" y="3.5" width="14" height="17" rx="2" />
    <path d="M9 3.5V3a2 2 0 114 0v.5M8.5 10h7M8.5 14h7M8.5 18h4" />
  </svg>
);

export const GradesIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 2.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 14.77l-4.8 2.5.92-5.34-3.88-3.78 5.36-.78z" />
  </svg>
);

export const CalendarIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </svg>
);

export const NotificationsIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 9a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z" />
    <path d="M10 19a2 2 0 004 0" />
  </svg>
);

export const ProfileIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0115 0" />
  </svg>
);

export const SearchIcon = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const ChevronDownIcon = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const LogOutIcon = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const MenuIcon = (p) => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
  </svg>
);

export const CloseIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const CheckCircleIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.3 2.3 4.7-4.8" />
  </svg>
);

export const CircleIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export const ClockIcon = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const BellDotIcon = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 9a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z" />
    <path d="M10 19a2 2 0 004 0" />
  </svg>
);

export const PaperclipIcon = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M20.5 12.5l-8.4 8.4a5 5 0 01-7.1-7.1l9.2-9.2a3.5 3.5 0 014.9 4.9l-9.2 9.2a2 2 0 01-2.8-2.8l8.1-8.1" />
  </svg>
);

export const FileIcon = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 2.5h8l4.5 4.5V21a1 1 0 01-1 1H6a1 1 0 01-1-1V3.5a1 1 0 011-1z" />
    <path d="M14 2.5V7a1 1 0 001 1h4.5" />
  </svg>
);

export const CopyIcon = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
  </svg>
);
