// ============================================================
// AdminDashboard.jsx – Admin overview with complaint management
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  Loader2,
  Brain,
  Send,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RepeatIcon,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { ANALYTICS_DATA } from '../data/sampleData';

function StatusBadge({ status }) {
  const map = { 'Pending': 'badge-pending', 'In Progress': 'badge-progress', 'Resolved': 'badge-resolved' };
  return <span className={`badge ${map[status] || 'badge-primary'}`}>{status}</span>;
}
function PriorityBadge({ priority }) {
  const map = { 'High': 'badge-high', 'Medium': 'badge-medium', 'Low': 'badge-low' };
  return <span className={`badge ${map[priority] || 'badge-neutral'}`}>{priority}</span>;
}
function SentimentBadge({ s }) {
  const map = { 'Positive': 'badge-positive', 'Negative': 'badge-negative', 'Neutral': 'badge-neutral' };
  return <span className={`badge ${map[s] || 'badge-neutral'}`}>{s}</span>;
}

// ── Admin Complaint Card with manage controls ─────────────────
function AdminComplaintCard({ c }) {
  const { updateComplaintStatus, addAdminResponse } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [response, setResponse] = useState(c.adminResponse || '');
  const [sending, setSending] = useState(false);

  const handleSendResponse = async () => {
    if (!response.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 500));
    addAdminResponse(c.id, response);
    setSending(false);
  };

  const handleStatusChange = (status) => {
    updateComplaintStatus(c.id, status);
  };

  return (
    <div className={`complaint-card ${c.status === 'Pending' && c.priority === 'High' ? 'complaint-card-urgent' : ''}`}>
      <div className="complaint-card-header">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="complaint-title">{c.title}</span>
            {c.isRepeat && (
              <span className="badge badge-negative" title="Repeat complaint">
                <RepeatIcon size={10} /> ×{c.repeatCount}
              </span>
            )}
          </div>
          <div className="complaint-meta" style={{ marginTop: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>👤 {c.studentName}</span>
            <span className="badge badge-primary">{c.category}</span>
            <PriorityBadge priority={c.priority} />
            <span className="complaint-date">{c.date}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusBadge status={c.status} />
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="complaint-expanded">
          <p className="complaint-body">{c.description}</p>

          {/* AI Analysis */}
          <div className="ai-panel">
            <div className="ai-panel-header">
              <span className="ai-badge"><Brain size={11} /> AI Analysis</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div className="ai-result-row">
                <span className="ai-result-label">Category</span>
                <span className="badge badge-primary">{c.aiCategory}</span>
              </div>
              <div className="ai-result-row">
                <span className="ai-result-label">Sentiment</span>
                <SentimentBadge s={c.aiSentiment} />
              </div>
              {c.isRepeat && (
                <div className="ai-result-row repeat-alert">
                  <AlertTriangle size={13} />
                  <span>Repeat issue – reported {c.repeatCount} times. Consider escalating.</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Controls */}
          <div className="admin-controls">
            <div className="admin-controls-label">Update Status</div>
            <div className="status-buttons">
              {['Pending', 'In Progress', 'Resolved'].map(s => (
                <button
                  key={s}
                  className={`btn btn-sm ${c.status === s ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleStatusChange(s)}
                  id={`status-${c.id}-${s.replace(' ', '-')}`}
                >
                  {c.status === s && <CheckCircle2 size={13} />}
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Response Box */}
          <div className="form-group" style={{ marginTop: '14px' }}>
            <label className="form-label" htmlFor={`resp-${c.id}`}>Send Response to Student</label>
            <textarea
              id={`resp-${c.id}`}
              className="form-textarea"
              rows={3}
              placeholder="Write a response to the student..."
              value={response}
              onChange={e => setResponse(e.target.value)}
            />
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: '8px' }}
              onClick={handleSendResponse}
              disabled={sending || !response.trim()}
              id={`send-resp-${c.id}`}
            >
              {sending ? <span className="spinner" /> : <Send size={13} />}
              {sending ? 'Sending…' : 'Send Response'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Admin Dashboard ────────────────────────────────────
export default function AdminDashboard({ onNavigate }) {
  const { complaints, feedback, stats } = useApp();

  const highPriority = complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved');
  const repeatIssues  = complaints.filter(c => c.isRepeat && c.status !== 'Resolved').sort((a,b) => b.repeatCount - a.repeatCount);
  const recentResolved = complaints.filter(c => c.status === 'Resolved').slice(0, 3);
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').slice(0, 5);

  const topIssue = ANALYTICS_DATA.topIssues[0];

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Total Complaints', val: stats.total,      icon: MessageSquareWarning, color: 'var(--color-primary)' },
          { label: 'Pending',          val: stats.pending,    icon: Clock,                color: 'var(--status-pending)' },
          { label: 'In Progress',      val: stats.inProgress, icon: Loader2,              color: 'var(--status-progress)' },
          { label: 'Resolved',         val: stats.resolved,   icon: CheckCircle2,         color: 'var(--status-resolved)' },
          { label: 'Total Feedback',   val: feedback.length,  icon: Brain,                color: 'var(--color-accent)' },
          { label: 'Positive Feedback',val: stats.positive,   icon: TrendingUp,           color: 'var(--color-success)' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-card-icon" style={{ background: `${color}22` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div className="stat-value">{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="section-grid" style={{ marginBottom: '24px' }}>
        {/* Urgent Attention */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <AlertTriangle size={18} style={{ color: 'var(--color-danger)' }} /> Urgent Attention
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-danger)', fontWeight: 600 }}>
              {highPriority.length} high priority
            </span>
          </div>
          {highPriority.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 10px' }}>
              <CheckCircle2 size={28} style={{ color: 'var(--color-success)', margin: '0 auto 8px' }} />
              <p>No urgent issues!</p>
            </div>
          ) : (
            <div className="complaint-list">
              {highPriority.slice(0, 3).map(c => (
                <AdminComplaintCard key={c.id} c={c} />
              ))}
            </div>
          )}
          {highPriority.length > 3 && (
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('complaints')} style={{ marginTop: '10px' }} id="see-all-urgent">
              See all {highPriority.length} urgent →
            </button>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Repeat Issues */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><RepeatIcon size={18} style={{ color: 'var(--color-warning)' }} /> Repeat Issues</div>
              <span className="ai-badge"><Brain size={11} /> AI Flagged</span>
            </div>
            {repeatIssues.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>No repeat issues detected</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {repeatIssues.slice(0, 4).map(c => (
                  <div key={c.id} className="repeat-issue-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>{c.title}</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="badge badge-primary">{c.category}</span>
                        <span className="badge badge-negative"><RepeatIcon size={10} /> ×{c.repeatCount}</span>
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Summary Panel */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Zap size={18} style={{ color: 'var(--color-accent)' }} /> AI Campus Summary</div>
              <span className="ai-badge"><Brain size={11} /> AI</span>
            </div>
            <div className="ai-insights-list">
              <div className="insight-item">
                <div className="insight-icon" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)' }}>
                  <AlertTriangle size={15} />
                </div>
                <div>
                  <div className="insight-label">Top Issue</div>
                  <div className="insight-val">"{topIssue.issue}" ({topIssue.count} reports)</div>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }}>
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <div className="insight-label">Resolution Rate</div>
                  <div className="insight-val">
                    {stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}% of complaints resolved
                  </div>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)' }}>
                  <Brain size={15} />
                </div>
                <div>
                  <div className="insight-label">Sentiment Health</div>
                  <div className="insight-val">{stats.positive} positive · {stats.negative} negative feedback</div>
                </div>
              </div>
            </div>
            <div className="ai-disclaimer">
              AI insights generated from complaint and feedback patterns.
            </div>
          </div>
        </div>
      </div>

      {/* Pending Complaints Queue */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title"><Clock size={18} style={{ color: 'var(--status-pending)' }} /> Pending Queue</div>
            <div className="card-subtitle">{stats.pending} complaints awaiting action</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('complaints')} id="manage-all">
            Manage All
          </button>
        </div>
        {pendingComplaints.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px' }}>
            <CheckCircle2 size={30} style={{ color: 'var(--color-success)', margin: '0 auto 8px' }} />
            <h3>No pending complaints!</h3>
            <p>All complaints are handled. Great work!</p>
          </div>
        ) : (
          <div className="complaint-list">
            {pendingComplaints.map(c => <AdminComplaintCard key={c.id} c={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
