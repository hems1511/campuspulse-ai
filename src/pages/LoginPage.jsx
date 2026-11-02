// ============================================================
// LoginPage.jsx – Auth page for CampusPulse AI
// Handles Login + Register with role selection
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Shield,
  Mail,
  Lock,
  User,
  Hash,
  BookOpen,
  Zap,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useApp();

  const [mode, setMode]       = useState('login');   // 'login' | 'register'
  const [role, setRole]       = useState('student'); // 'student' | 'admin'
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: '', password: '', name: '', rollNo: '', department: '', year: '1',
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate async

    if (mode === 'login') {
      const res = login(form.email, form.password, role);
      if (!res.success) setError('Invalid credentials. Try demo credentials below.');
    } else {
      if (!form.name || !form.email) {
        setError('Name and email are required.');
        setLoading(false);
        return;
      }
      register(form);
    }
    setLoading(false);
  };

  const fillDemo = () => {
    if (role === 'student') {
      setForm(f => ({ ...f, email: 'aarav@campus.edu', password: 'demo123' }));
    } else {
      setForm(f => ({ ...f, email: 'admin@campus.edu', password: 'demo123' }));
    }
  };

  const departments = [
    'Computer Science', 'Electronics', 'Mechanical', 'Civil',
    'Electrical', 'Chemical', 'Biotechnology', 'General',
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-icon">
            <Zap size={28} color="white" />
          </div>
          <h1>CampusPulse AI</h1>
          <p>Smart Campus Platform for Students &amp; Administration</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          {/* Login / Register tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Register
            </button>
          </div>

          <h2>{mode === 'login' ? 'Welcome back!' : 'Create account'}</h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to access your campus portal'
              : 'Join CampusPulse to submit feedback and track issues'}
          </p>

          {/* Role selector */}
          <div className="role-selector">
            <div
              className={`role-card ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setRole('student')}
              id="role-student"
            >
              <div className="role-icon">🎓</div>
              <div className="role-label">Student</div>
            </div>
            <div
              className={`role-card ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setRole('admin')}
              id="role-admin"
            >
              <div className="role-icon">🛡️</div>
              <div className="role-label">Admin</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Register-only fields */}
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">Full Name</label>
                  <div className="input-group">
                    <User size={16} className="input-icon" />
                    <input
                      id="reg-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Aarav Mehta"
                      value={form.name}
                      onChange={set('name')}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-rollno">Roll No.</label>
                    <div className="input-group">
                      <Hash size={16} className="input-icon" />
                      <input
                        id="reg-rollno"
                        type="text"
                        className="form-input"
                        placeholder="22CS101"
                        value={form.rollNo}
                        onChange={set('rollNo')}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-year">Year</label>
                    <select
                      id="reg-year"
                      className="form-select"
                      value={form.year}
                      onChange={set('year')}
                    >
                      {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-dept">Department</label>
                  <div className="input-group">
                    <BookOpen size={16} className="input-icon" />
                    <select
                      id="reg-dept"
                      className="form-select"
                      style={{ paddingLeft: '40px' }}
                      value={form.department}
                      onChange={set('department')}
                    >
                      <option value="">Select department...</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email Address</label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  id="auth-email"
                  type="email"
                  className="form-input"
                  placeholder={role === 'admin' ? 'admin@campus.edu' : 'you@campus.edu'}
                  value={form.email}
                  onChange={set('email')}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  style={{ paddingRight: '44px' }}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="input-icon"
                  style={{ left: 'auto', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)' }}
                  onClick={() => setShowPass(s => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="form-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              id="auth-submit"
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo notice */}
          {mode === 'login' && (
            <div className="demo-notice">
              <span>Demo mode:</span> Use any email/password to log in, or{' '}
              <button
                type="button"
                className="demo-fill-btn"
                onClick={fillDemo}
                id="fill-demo"
              >
                fill demo credentials
              </button>
            </div>
          )}

          <div className="auth-link">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button type="button" onClick={() => setMode('register')}>Register here</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')}>Sign in</button>
              </>
            )}
          </div>
        </div>

        {/* Feature pills */}
        <div className="auth-features">
          <span className="feature-pill"><Zap size={12} /> AI-Powered</span>
          <span className="feature-pill"><Shield size={12} /> Secure</span>
          <span className="feature-pill"><GraduationCap size={12} /> Campus-Ready</span>
        </div>
      </div>
    </div>
  );
}
