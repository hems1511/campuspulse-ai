// ============================================================
// ComplaintsPage.jsx – Submit & view complaints
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Search,
  MessageSquareWarning,
  Brain,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  RepeatIcon,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../data/sampleData';

function StatusBadge({ status }) {
  const map = { 'Pending': 'badge-pending', 'In Progress': 'badge-progress', 'Resolved': 'badge-resolved' };
  const icons = {
    'Pending': <AlertTriangle size={11} />,
    'In Progress': <Loader2 size={11} />,
    'Resolved': <CheckCircle2 size={11} />,
  };
  return <span className={`badge ${map[status] || 'badge-primary'}`}>{icons[status]}{status}</span>;
}
function PriorityBadge({ priority }) {
  const map = { 'High': 'badge-high', 'Medium': 'badge-medium', 'Low': 'badge-low' };
  return <span className={`badge ${map[priority] || 'badge-neutral'}`}>{priority}</span>;
}
function SentimentBadge({ s }) {
  const map = { 'Positive': 'badge-positive', 'Negative': 'badge-negative', 'Neutral': 'badge-neutral' };
  return <span className={`badge ${map[s] || 'badge-neutral'}`}>{s}</span>;
}

// ── Submit Form ───────────────────────────────────────────────
function ComplaintForm({ onClose }) {
  const { submitComplaint } = useApp();
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = submitComplaint(form);
    setSubmitted(result);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="submit-success">
        <div className="success-icon"><CheckCircle2 size={40} style={{ color: 'var(--color-success)' }} /></div>
        <h3>Complaint Submitted!</h3>
        <p>Your complaint has been logged and will be reviewed by the administration.</p>
        <div className="ai-result">
          <div className="ai-result-row">
            <span className="ai-result-label"><Brain size={13} /> AI Category</span>
            <span className="badge badge-primary">{submitted.aiCategory}</span>
          </div>
          <div className="ai-result-row">
            <span className="ai-result-label"><Zap size={13} /> AI Sentiment</span>
            <SentimentBadge s={submitted.aiSentiment} />
          </div>
          {submitted.isRepeat && (
            <div className="ai-result-row repeat-alert">
              <RepeatIcon size={13} />
              <span>This is a repeat complaint (reported {submitted.repeatCount}x). Priority flagged!</span>
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={onClose} id="submit-done">Back to Complaints</button>
      </div>
    );
  }

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="c-title">Complaint Title *</label>
        <input
          id="c-title"
          type="text"
          className="form-input"
          placeholder="Brief summary of the issue..."
          value={form.title}
          onChange={set('title')}
          required
          maxLength={120}
        />
        <span className="char-count">{form.title.length}/120</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="c-category">Category</label>
          <select id="c-category" className="form-select" value={form.category} onChange={set('category')}>
            <option value="">AI will auto-detect…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="form-hint">Leave blank for AI auto-categorization</span>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="c-priority">Priority</label>
          <select id="c-priority" className="form-select" value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-desc">Description *</label>
        <textarea
          id="c-desc"
          className="form-textarea"
          placeholder="Describe the issue in detail. Include location, duration, and impact..."
          value={form.description}
          onChange={set('description')}
          required
          rows={5}
          maxLength={1000}
        />
        <span className="char-count">{form.description.length}/1000</span>
      </div>

      <div className="ai-info-bar">
        <Brain size={14} />
        <span>AI will analyze sentiment and auto-categorize your complaint upon submission</span>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose} id="cancel-complaint">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading || !form.title || !form.description} id="submit-complaint">
          {loading ? <><span className="spinner" /> Analyzing…</> : <><Send size={15} /> Submit Complaint</>}
        </button>
      </div>
    </form>
  );
}

// ── Complaint Card ─────────────────────────────────────────────
function ComplaintCard({ c, showStudent = false }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="complaint-card">
      <div className="complaint-card-header">
        <div style={{ flex: 1 }}>
          <div className="complaint-title">{c.title}</div>
          <div className="complaint-meta">
            <span className="badge badge-primary">{c.category}</span>
            <PriorityBadge priority={c.priority} />
            {c.isRepeat && (
              <span className="badge badge-negative" title="Repeat complaint">
                <RepeatIcon size={10} /> ×{c.repeatCount}
              </span>
            )}
            <span className="complaint-date">{c.date}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusBadge status={c.status} />
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
            aria-label="Expand complaint"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="complaint-expanded">
          {showStudent && (
            <div className="complaint-student">
              <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.8rem' }}>From:</span>
              <strong style={{ fontSize: '0.85rem' }}>{c.studentName}</strong>
            </div>
          )}
          <p className="complaint-body">{c.description}</p>
          <div className="ai-panel">
            <div className="ai-panel-header">
              <span className="ai-badge"><Brain size={11} /> AI Analysis</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div className="ai-result-row">
                <span className="ai-result-label">Detected Category</span>
                <span className="badge badge-primary">{c.aiCategory}</span>
              </div>
              <div className="ai-result-row">
                <span className="ai-result-label">Sentiment</span>
                <SentimentBadge s={c.aiSentiment} />
              </div>
            </div>
          </div>
          {c.adminResponse && (
            <div className="admin-response">
              <div className="admin-response-label">Admin Response</div>
              <div className="admin-response-text">{c.adminResponse}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function ComplaintsPage({ isAdmin = false }) {
  const { myComplaints, complaints } = useApp();
  const list = isAdmin ? complaints : myComplaints;

  const [showForm, setShowForm]   = useState(false);
  const [search, setSearch]       = useState('');
  const [filterStatus, setStatus] = useState('');
  const [filterPriority, setPrio] = useState('');
  const [filterCat, setCat]       = useState('');

  const filtered = list.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    const matchS = !filterStatus   || c.status === filterStatus;
    const matchP = !filterPriority || c.priority === filterPriority;
    const matchC = !filterCat      || c.category === filterCat;
    return matchQ && matchS && matchP && matchC;
  });

  const hasFilters = search || filterStatus || filterPriority || filterCat;

  return (
    <div>
      {showForm ? (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="modal-header">
            <div className="card-title"><Plus size={18} /> New Complaint</div>
            <button className="modal-close" onClick={() => setShowForm(false)} id="close-form">
              <X size={18} />
            </button>
          </div>
          <ComplaintForm onClose={() => setShowForm(false)} />
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{isAdmin ? 'All Complaints' : 'My Complaints'}</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {filtered.length} of {list.length} complaints
              </p>
            </div>
            {!isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)} id="new-complaint-btn">
                <Plus size={16} /> New Complaint
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search complaints..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="complaint-search"
              />
            </div>
            <select className="filter-select" value={filterStatus} onChange={e => setStatus(e.target.value)} id="filter-status">
              <option value="">All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <select className="filter-select" value={filterPriority} onChange={e => setPrio(e.target.value)} id="filter-priority">
              <option value="">All Priorities</option>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="filter-select" value={filterCat} onChange={e => setCat(e.target.value)} id="filter-category" style={{ maxWidth: '180px' }}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setStatus(''); setPrio(''); setCat(''); }} id="clear-filters">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><MessageSquareWarning size={28} /></div>
              <h3>{hasFilters ? 'No results found' : 'No complaints yet'}</h3>
              <p>{hasFilters ? 'Try adjusting your filters.' : 'Submit your first complaint using the button above.'}</p>
              {!isAdmin && !hasFilters && (
                <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)} id="empty-new-complaint">
                  <Plus size={14} /> New Complaint
                </button>
              )}
            </div>
          ) : (
            <div className="complaint-list">
              {filtered.map(c => (
                <ComplaintCard key={c.id} c={c} showStudent={isAdmin} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
