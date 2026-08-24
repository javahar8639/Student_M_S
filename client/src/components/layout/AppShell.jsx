import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import MobileNav from './MobileNav.jsx';
import { NotificationsProvider } from '../../context/NotificationsContext.jsx';

export default function AppShell() {
  return (
    <NotificationsProvider>
      <div className="flex min-h-screen bg-paper">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="page-transition flex-1 px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pb-10">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    </NotificationsProvider>
  );
}
