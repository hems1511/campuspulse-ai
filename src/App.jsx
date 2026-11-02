// ============================================================
// App.jsx – Root router: Auth guard + page routing
// ============================================================

import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import ComplaintsPage from './pages/ComplaintsPage';
import FeedbackPage from './pages/FeedbackPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentsPage from './pages/StudentsPage';
import AppShell from './components/AppShell';

// ── Inner App (needs AppContext) ──────────────────────────────
function AppInner() {
  const { currentUser } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  // Default page per role
  const defaultPage = isAdmin ? 'admin' : 'dashboard';
  const [page, setPage] = useState(defaultPage);

  // Reset page when user changes
  const navigate = (p) => setPage(p);

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <StudentDashboard onNavigate={navigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={navigate} />;
      case 'complaints':
        return <ComplaintsPage isAdmin={isAdmin} />;
      case 'feedback':
        return <FeedbackPage isAdmin={isAdmin} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'users':
        return <StudentsPage />;
      default:
        return isAdmin
          ? <AdminDashboard onNavigate={navigate} />
          : <StudentDashboard onNavigate={navigate} />;
    }
  };

  return (
    <AppShell currentPage={page} onNavigate={navigate}>
      {renderPage()}
    </AppShell>
  );
}

// ── Root App with Provider ────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
