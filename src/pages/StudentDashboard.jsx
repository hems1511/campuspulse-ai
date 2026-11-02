// ============================================================
// StudentDashboard.jsx – Student home with stats + recent items
// ============================================================

import { useApp } from '../context/AppContext';
import {
  MessageSquareWarning,
  MessageSquare,
  Clock,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Plus,
  ArrowRight,
  Brain,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="stat-card" style={{ '--card-accent': color, '--icon-bg': `${color}22`, '--icon-color': color.replace('linear-gradient', '').split(',')[0] }}>
      <div className="stat-card-icon" style={{ background: `${color}22` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-change up">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    'Pending':     'badge-pending',
    'In Progress': 'badge-progress',
    'Resolved':    'badge-resolved',
  };
  return <span className={`badge ${map[status] || 'badge-primary'}`}>{status}</span>;
}

function SentimentBadge({ sentiment }) {
  const map = {
    'Positive': 'badge-positive',
    'Negative': 'badge-negative',
    'Neutral':  'badge-neutral',
  };
  return <span className={`badge ${map[sentiment] || 'badge-neutral'}`}>{sentiment}</span>;
}

export default function StudentDashboard({ onNavigate }) {
  const { currentUser, myComplaints, feedback, stats } = useApp();

  const myFeedback = feedback.filter(f => f.studentId === currentUser?.id);
  const recentComplaints = myComplaints.slice(0, 3);
  const recentFeedback = myFeedback.slice(0, 2);

  const myStats = {
    total:      myComplaints.length,
    pending:    myComplaints.filter(c => c.status === 'Pending').length,
    inProgress: myComplaints.filter(c => c.status === 'In Progress').length,
    resolved:   myComplaints.filter(c => c.status === 'Resolved').length,
  };

  const hasResponse = myComplaints.filter(c => c.adminResponse).length;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1 className="welcome-title">
              Welcome back, {currentUser?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="welcome-sub">
              {myStats.pending > 0
                ? `You have ${myStats.pending} pending complaint${myStats.pending > 1 ? 's' : ''} awaiting response.`
                : 'All your complaints are up to date. Great!'}
            </p>
          </div>
          <div className="welcome-actions">
            <button
              className="btn btn-primary"
              onClick={() => onNavigate('complaints')}
              id="dash-new-complaint"
            >
              <Plus size={16} /> New Complaint
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate('feedback')}
              id="dash-give-feedback"
            >
              <MessageSquareWarning size={16} /> Give Feedback
            </button>
          </div>
        </div>
        <div className="welcome-illustration" aria-hidden="true">
          <div className="pulse-ring" />
          <div className="pulse-ring pulse-ring-2" />
          <Brain size={48} style={{ color: 'var(--color-primary)', position: 'relative', zIndex: 1 }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginTop: '24px' }}>
        <StatCard icon={MessageSquareWarning} label="Total Submitted" value={myStats.total} color="var(--color-primary)" />
        <StatCard icon={Clock} label="Pending" value={myStats.pending} color="var(--status-pending)" />
        <StatCard icon={Loader2} label="In Progress" value={myStats.inProgress} color="var(--status-progress)" />
        <StatCard icon={CheckCircle2} label="Resolved" value={myStats.resolved} color="var(--status-resolved)" sub={myStats.resolved > 0 ? `${Math.round(myStats.resolved/Math.max(myStats.total,1)*100)}% resolution rate` : null} />
      </div>

      <div className="section-grid">
        {/* Recent Complaints */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><MessageSquareWarning size={18} style={{ color: 'var(--color-primary)' }} /> Recent Complaints</div>
              <div className="card-subtitle">{myComplaints.length} total submitted</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('complaints')} id="view-all-complaints">
              View All <ArrowRight size={14} />
            </button>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 10px' }}>
              <div className="empty-state-icon"><MessageSquareWarning size={24} /></div>
              <h3>No complaints yet</h3>
              <p>Submit your first complaint to get started.</p>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('complaints')} id="first-complaint">
                <Plus size={14} /> Submit Complaint
              </button>
            </div>
          ) : (
            <div className="complaint-list">
              {recentComplaints.map(c => (
                <div key={c.id} className="complaint-card">
                  <div className="complaint-card-header">
                    <span className="complaint-title">{c.title}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="complaint-meta">
                    <span className="badge badge-primary">{c.category}</span>
                    <span className="complaint-date">{c.date}</span>
                  </div>
                  {c.adminResponse && (
                    <div className="admin-response" style={{ marginTop: '10px' }}>
                      <div className="admin-response-label">Admin Response</div>
                      <div className="admin-response-text">{c.adminResponse}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* AI Analysis Panel */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Sparkles size={18} style={{ color: 'var(--color-accent)' }} /> AI Insights</div>
              <span className="ai-badge"><Brain size={11} /> AI</span>
            </div>
            <div className="ai-insights-list">
              <div className="insight-item">
                <div className="insight-icon" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-primary)' }}>
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div className="insight-label">Your Activity</div>
                  <div className="insight-val">{myStats.total} complaints, {myFeedback.length} feedback</div>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--color-success)' }}>
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="insight-label">Admin Responses</div>
                  <div className="insight-val">{hasResponse} of your complaints have responses</div>
                </div>
              </div>
              {myStats.pending > 0 && (
                <div className="insight-item">
                  <div className="insight-icon" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--status-pending)' }}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <div className="insight-label">Needs Attention</div>
                    <div className="insight-val">{myStats.pending} unresolved complaint{myStats.pending > 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="ai-disclaimer">
              AI analysis is powered by CampusPulse's sentiment engine. Automated suggestions only.
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><MessageSquare size={18} style={{ color: 'var(--color-teal)' }} /> My Feedback</div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('feedback')} id="view-feedback">
                <Plus size={14} /> Add
              </button>
            </div>
            {recentFeedback.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>
                You haven't submitted any feedback yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentFeedback.map(f => (
                  <div key={f.id} className="feedback-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>{f.date}</span>
                      <SentimentBadge sentiment={f.aiSentiment} />
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                      {f.text.length > 100 ? f.text.slice(0, 100) + '…' : f.text}
                    </p>
                    {f.aiKeywords?.length > 0 && (
                      <div className="keyword-tags" style={{ marginTop: '8px' }}>
                        {f.aiKeywords.slice(0, 3).map(kw => (
                          <span key={kw} className="keyword-tag">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
