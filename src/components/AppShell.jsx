// ============================================================
// AppShell.jsx – Sidebar + Topbar layout wrapper
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  MessageSquareWarning,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Zap,
  Users,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import ToastContainer from './ToastContainer';

const STUDENT_NAV = [
  { id: 'dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'complaints',  label: 'My Complaints', icon: MessageSquareWarning },
  { id: 'feedback',    label: 'Submit Feedback',icon: MessageSquare },
  { id: 'analytics',  label: 'Analytics',     icon: BarChart3 },
];

const ADMIN_NAV = [
  { id: 'admin',       label: 'Admin Panel',   icon: LayoutDashboard },
  { id: 'complaints',  label: 'All Complaints', icon: MessageSquareWarning },
  { id: 'feedback',    label: 'Feedback',       icon: MessageSquare },
  { id: 'analytics',  label: 'Analytics',      icon: BarChart3 },
  { id: 'users',       label: 'Students',       icon: Users },
];

export default function AppShell({ currentPage, onNavigate, children }) {
  const { currentUser, logout, stats, myComplaints } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const navItems = isAdmin ? ADMIN_NAV : STUDENT_NAV;

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const pageTitles = {
    dashboard:  { title: 'Dashboard', sub: 'Welcome back, ' + (currentUser?.name?.split(' ')[0] || '') },
    complaints: { title: isAdmin ? 'All Complaints' : 'My Complaints', sub: isAdmin ? 'Manage & respond to student complaints' : 'Track your submitted complaints' },
    feedback:   { title: 'Feedback', sub: isAdmin ? 'Student feedback & AI sentiment analysis' : 'Share your thoughts with administration' },
    analytics:  { title: 'Analytics', sub: 'Campus insights and trends' },
    admin:      { title: 'Admin Overview', sub: 'Campus health at a glance' },
    users:      { title: 'Students', sub: 'Registered student directory' },
  };

  const { title, sub } = pageTitles[currentPage] || pageTitles.dashboard;

  const pendingCount = stats.pending;

  return (
    <div className="app-shell">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-logo">
          <div className="logo-icon-sm">
            <Zap size={18} color="white" />
          </div>
          <div className="logo-text">
            CampusPulse
            <span>AI Campus Platform</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navigation">
          <div className="nav-section-label">
            {isAdmin ? 'Administration' : 'Student Portal'}
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const badge = item.id === 'complaints' && !isAdmin && myComplaints.filter(c => c.status === 'Pending').length;

            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                id={`nav-${item.id}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                {item.label}
                {badge ? <span className="nav-badge">{badge}</span> : null}
              </button>
            );
          })}

          {isAdmin && pendingCount > 0 && (
            <>
              <div className="nav-section-label" style={{ marginTop: '16px' }}>Alerts</div>
              <div className="nav-alert">
                <Bell size={14} />
                <span>{pendingCount} pending complaint{pendingCount !== 1 ? 's' : ''}</span>
                <ChevronRight size={12} style={{ marginLeft: 'auto' }} />
              </div>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{initials}</div>
            <div className="user-details">
              <div className="user-name">{currentUser?.name}</div>
              <div className="user-role">
                {isAdmin ? '🛡️ Admin' : `🎓 ${currentUser?.department || 'Student'}`}
              </div>
            </div>
            <button
              className="logout-btn"
              onClick={logout}
              title="Sign out"
              id="logout-btn"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(s => !s)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="topbar-title">
              <h2>{title}</h2>
              <p>{sub}</p>
            </div>
          </div>
          <div className="topbar-actions">
            {isAdmin && (
              <div className="topbar-stat">
                <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />
                <span>{stats.resolved} resolved</span>
              </div>
            )}
            <div className="topbar-badge">
              <Zap size={12} />
              AI Active
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
