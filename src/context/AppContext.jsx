// ============================================================
// AppContext.jsx – Global state via React Context
// Manages: auth, complaints, feedback, toasts
// ============================================================

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  INITIAL_COMPLAINTS,
  INITIAL_FEEDBACK,
  DEMO_STUDENTS,
  DEMO_ADMINS,
  simulateSentiment,
  simulateCategory,
  extractKeywords,
} from '../data/sampleData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth ──────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('campuspulse_user');
    return saved ? JSON.parse(saved) : null;
  });

  // ── Data ──────────────────────────────────────────────────
  const [complaints, setComplaints]   = useState(INITIAL_COMPLAINTS);
  const [feedback,   setFeedback]     = useState(INITIAL_FEEDBACK);

  // ── Toasts ────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // ── Auth Actions ──────────────────────────────────────────
  const login = useCallback((email, password, role) => {
    const allUsers = [...DEMO_STUDENTS, ...DEMO_ADMINS];
    const user = allUsers.find(u => u.email === email && u.role === role);
    if (user) {
      sessionStorage.setItem('campuspulse_user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true, user };
    }
    // Allow any email/password combo for demo – create a guest user
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role,
      rollNo: role === 'student' ? 'DEMO001' : undefined,
      department: role === 'student' ? 'General' : 'Administration',
    };
    sessionStorage.setItem('campuspulse_user', JSON.stringify(guestUser));
    setCurrentUser(guestUser);
    return { success: true, user: guestUser };
  }, []);

  const register = useCallback((data) => {
    const newUser = {
      id: `stu-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student',
      rollNo: data.rollNo || 'NEW001',
      department: data.department || 'General',
      year: parseInt(data.year) || 1,
    };
    sessionStorage.setItem('campuspulse_user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('campuspulse_user');
    setCurrentUser(null);
  }, []);

  // ── Complaint Actions ─────────────────────────────────────
  const submitComplaint = useCallback((data) => {
    const aiCategory  = simulateCategory(data.title + ' ' + data.description);
    const aiSentiment = simulateSentiment(data.title + ' ' + data.description);

    // Check for repeated complaint (same category within existing)
    const sameCategory = complaints.filter(c => c.category === (data.category || aiCategory));
    const isRepeat = sameCategory.length >= 2;

    const newComplaint = {
      id: `cmp-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      title: data.title,
      description: data.description,
      category: data.category || aiCategory,
      priority: data.priority,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      adminResponse: null,
      aiCategory,
      aiSentiment,
      isRepeat,
      repeatCount: isRepeat ? sameCategory.length + 1 : 1,
    };

    setComplaints(prev => [newComplaint, ...prev]);
    addToast('Complaint submitted successfully!', 'success');
    return newComplaint;
  }, [complaints, currentUser, addToast]);

  const updateComplaintStatus = useCallback((id, status, response = null) => {
    setComplaints(prev => prev.map(c =>
      c.id === id ? { ...c, status, adminResponse: response ?? c.adminResponse } : c
    ));
    addToast(`Status updated to "${status}"`, 'success');
  }, [addToast]);

  const addAdminResponse = useCallback((id, response) => {
    setComplaints(prev => prev.map(c =>
      c.id === id ? { ...c, adminResponse: response } : c
    ));
    addToast('Response sent to student.', 'success');
  }, [addToast]);

  // ── Feedback Actions ──────────────────────────────────────
  const submitFeedback = useCallback((text) => {
    const aiSentiment = simulateSentiment(text);
    const aiKeywords  = extractKeywords(text);
    const newFb = {
      id: `fb-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      text,
      date: new Date().toISOString().split('T')[0],
      aiSentiment,
      aiKeywords,
    };
    setFeedback(prev => [newFb, ...prev]);
    addToast('Feedback submitted! AI analysis complete.', 'success');
    return newFb;
  }, [currentUser, addToast]);

  // ── Derived Values ────────────────────────────────────────
  const myComplaints = currentUser
    ? complaints.filter(c => c.studentId === currentUser.id)
    : [];

  const stats = {
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved').length,
    positive:   feedback.filter(f => f.aiSentiment === 'Positive').length,
    negative:   feedback.filter(f => f.aiSentiment === 'Negative').length,
    neutral:    feedback.filter(f => f.aiSentiment === 'Neutral').length,
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    complaints,
    myComplaints,
    feedback,
    stats,
    submitComplaint,
    updateComplaintStatus,
    addAdminResponse,
    submitFeedback,
    toasts,
    addToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
