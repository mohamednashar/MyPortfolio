import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Wrench,
  GraduationCap,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Code2,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { contactAPI } from '../../api';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
  { name: 'Experience', path: '/admin/experience', icon: Briefcase },
  { name: 'Skills', path: '/admin/skills', icon: Wrench },
  { name: 'Education', path: '/admin/education', icon: GraduationCap },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare, badgeKey: 'messages' },
  { name: 'Settings & Profile', path: '/admin/settings', icon: Settings },
];

const AdminLayout = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch unread messages count
    const fetchUnread = async () => {
      try {
        const res = await contactAPI.getMessages();
        if (res.data?.data) {
          const unread = res.data.data.filter((m) => !m.read).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchUnread();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-dark-900 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-white text-base tracking-tight">
                Portfolio CMS
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badgeKey === 'messages' && unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500 text-dark-950">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile & View Site */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-cyan-400 border border-slate-700/60 transition-colors w-full"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <img
                src="/mohamed-alaa.jpg"
                alt="Mohamed Alaa"
                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-700"
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  {user?.name || 'Mohamed Alaa'}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {user?.email || 'Admin'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-800 bg-dark-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-display font-semibold text-white">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/messages"
              className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Messages"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </Link>

            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
