// ============================================================
// FeedbackPage.jsx – Submit & view feedback with AI analysis
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Brain,
  Send,
  CheckCircle2,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Search,
  X,
} from 'lucide-react';

function SentimentBadge({ s }) {
  const cfg = {
    'Positive': { cls: 'badge-positive', icon: <ThumbsUp size={11} /> },
    'Negative': { cls: 'badge-negative', icon: <ThumbsDown size={11} /> },
    'Neutral':  { cls: 'badge-neutral',  icon: <Minus size={11} /> },
  };
  const { cls, icon } = cfg[s] || cfg['Neutral'];
  return <span className={`badge ${cls}`}>{icon}{s}</span>;
}

function SentimentBar({ positive, neutral, negative, total }) {
  if (!total) return null;
  const pct = v => Math.round((v / total) * 100);
  return (
    <div className="sentiment-bar-container">
      <div className="sbar-row">
        <span className="sbar-label" style={{ color: 'var(--sent-positive)' }}><ThumbsUp size={12} /> Positive</span>
        <div className="sentiment-bar-wrap">
          <div className="sentiment-bar" style={{ width: `${pct(positive)}%`, background: 'var(--sent-positive)' }} />
        </div>
        <span className="sbar-pct">{pct(positive)}%</span>
      </div>
      <div className="sbar-row">
        <span className="sbar-label" style={{ color: 'var(--sent-neutral)' }}><Minus size={12} /> Neutral</span>
        <div className="sentiment-bar-wrap">
          <div className="sentiment-bar" style={{ width: `${pct(neutral)}%`, background: 'var(--sent-neutral)' }} />
        </div>
        <span className="sbar-pct">{pct(neutral)}%</span>
      </div>
      <div className="sbar-row">
        <span className="sbar-label" style={{ color: 'var(--sent-negative)' }}><ThumbsDown size={12} /> Negative</span>
        <div className="sentiment-bar-wrap">
          <div className="sentiment-bar" style={{ width: `${pct(negative)}%`, background: 'var(--sent-negative)' }} />
        </div>
        <span className="sbar-pct">{pct(negative)}%</span>
      </div>
    </div>
  );
}

// ── Submit Form ───────────────────────────────────────────────
function FeedbackForm() {
  const { submitFeedback } = useApp();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const res = submitFeedback(text);
    setResult(res);
    setLoading(false);
  };

  if (result) {
    return (
      <div className="submit-success">
        <div className="success-icon"><CheckCircle2 size={36} style={{ color: 'var(--color-success)' }} /></div>
        <h3>Feedback Received!</h3>
        <p>Thank you for your feedback. Our AI has analyzed your submission.</p>
        <div className="ai-result">
          <div className="ai-result-row">
            <span className="ai-result-label"><Brain size={13} /> Sentiment</span>
            <SentimentBadge s={result.aiSentiment} />
          </div>
          {result.aiKeywords?.length > 0 && (
            <div className="ai-result-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
              <span className="ai-result-label"><Zap size={13} /> Keywords Detected</span>
              <div className="keyword-tags">
                {result.aiKeywords.map(kw => <span key={kw} className="keyword-tag">{kw}</span>)}
              </div>
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => { setResult(null); setText(''); }} id="submit-another">
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="fb-text">Your Feedback</label>
        <textarea
          id="fb-text"
          className="form-textarea"
          style={{ minHeight: '140px' }}
          placeholder="Share your thoughts about campus facilities, academics, administration, events, or anything else..."
          value={text}
          onChange={e => setText(e.target.value)}
          required
          maxLength={1000}
        />
        <span className="char-count">{text.length}/1000</span>
      </div>

      <div className="ai-info-bar">
        <Brain size={14} />
        <span>AI will analyze sentiment and extract key topics from your feedback</span>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !text.trim()}
        id="submit-feedback-btn"
        style={{ marginTop: '12px' }}
      >
        {loading ? <><span className="spinner" /> Analyzing…</> : <><Send size={15} /> Submit Feedback</>}
      </button>
    </form>
  );
}

// ── Feedback Item ─────────────────────────────────────────────
function FeedbackItem({ f, showStudent = false }) {
  return (
    <div className="feedback-card">
      <div className="feedback-card-header">
        <div>
          {showStudent && <div className="feedback-student">{f.studentName}</div>}
          <div className="complaint-date">{f.date}</div>
        </div>
        <SentimentBadge s={f.aiSentiment} />
      </div>
      <p className="complaint-body" style={{ marginTop: '10px' }}>{f.text}</p>
      {f.aiKeywords?.length > 0 && (
        <div className="keyword-tags" style={{ marginTop: '8px' }}>
          {f.aiKeywords.map(kw => <span key={kw} className="keyword-tag">{kw}</span>)}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function FeedbackPage({ isAdmin = false }) {
  const { feedback, currentUser, stats } = useApp();

  const [search, setSearch]   = useState('');
  const [filterSent, setSent] = useState('');

  const myFeedback = isAdmin ? feedback : feedback.filter(f => f.studentId === currentUser?.id);

  const filtered = myFeedback.filter(f => {
    const q = search.toLowerCase();
    const matchQ = !q || f.text.toLowerCase().includes(q);
    const matchS = !filterSent || f.aiSentiment === filterSent;
    return matchQ && matchS;
  });

  const pos = myFeedback.filter(f => f.aiSentiment === 'Positive').length;
  const neu = myFeedback.filter(f => f.aiSentiment === 'Neutral').length;
  const neg = myFeedback.filter(f => f.aiSentiment === 'Negative').length;

  return (
    <div>
      <div className="section-grid">
        {/* Left: Form (students) or Overview (admin) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isAdmin && (
            <div className="card">
              <div className="card-header">
                <div className="card-title"><MessageSquare size={18} style={{ color: 'var(--color-teal)' }} /> Share Feedback</div>
                <span className="ai-badge"><Brain size={11} /> AI-Powered</span>
              </div>
              <FeedbackForm />
            </div>
          )}

          {/* Sentiment Overview */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Brain size={18} style={{ color: 'var(--color-accent)' }} /> Sentiment Overview</div>
            </div>
            <div className="sentiment-stats">
              <div className="sent-stat" style={{ '--c': 'var(--sent-positive)' }}>
                <ThumbsUp size={20} />
                <div className="sent-val">{isAdmin ? stats.positive : pos}</div>
                <div className="sent-lbl">Positive</div>
              </div>
              <div className="sent-stat" style={{ '--c': 'var(--sent-neutral)' }}>
                <Minus size={20} />
                <div className="sent-val">{isAdmin ? stats.neutral : neu}</div>
                <div className="sent-lbl">Neutral</div>
              </div>
              <div className="sent-stat" style={{ '--c': 'var(--sent-negative)' }}>
                <ThumbsDown size={20} />
                <div className="sent-val">{isAdmin ? stats.negative : neg}</div>
                <div className="sent-lbl">Negative</div>
              </div>
            </div>
            <SentimentBar
              positive={isAdmin ? stats.positive : pos}
              neutral={isAdmin ? stats.neutral : neu}
              negative={isAdmin ? stats.negative : neg}
              total={isAdmin ? feedback.length : myFeedback.length}
            />
          </div>
        </div>

        {/* Right: Feedback list */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <MessageSquare size={18} style={{ color: 'var(--color-primary)' }} />
              {isAdmin ? 'All Feedback' : 'My Feedback'}
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{filtered.length} entries</span>
          </div>

          {/* Filters */}
          <div className="filter-bar" style={{ marginBottom: '16px' }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search feedback..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="feedback-search"
              />
            </div>
            <select className="filter-select" value={filterSent} onChange={e => setSent(e.target.value)} id="filter-sentiment">
              <option value="">All Sentiments</option>
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
            </select>
            {(search || filterSent) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setSent(''); }} id="clear-fb-filter">
                <X size={14} />
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 10px' }}>
              <div className="empty-state-icon"><MessageSquare size={24} /></div>
              <h3>{search || filterSent ? 'No matching feedback' : 'No feedback yet'}</h3>
              <p>{isAdmin ? 'No student feedback to display.' : 'Submit your first feedback using the form.'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filtered.map(f => <FeedbackItem key={f.id} f={f} showStudent={isAdmin} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
