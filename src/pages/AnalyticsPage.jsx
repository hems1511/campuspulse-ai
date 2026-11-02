// ============================================================
// AnalyticsPage.jsx – Charts & campus insights
// ============================================================

import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Brain,
  TrendingUp,
  Award,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { ANALYTICS_DATA } from '../data/sampleData';

const COLORS = ['#6366f1', '#a78bfa', '#22d3ee', '#f472b6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
const PIE_SENTIMENT = ANALYTICS_DATA.sentimentBreakdown;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      {label && <div className="ct-label">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="ct-row">
          <span className="ct-dot" style={{ background: p.color || p.fill }} />
          <span>{p.name}: <strong>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { stats, complaints, feedback } = useApp();

  const resolutionRate = stats.total
    ? Math.round((stats.resolved / stats.total) * 100)
    : 0;

  const topIssues = ANALYTICS_DATA.topIssues;

  return (
    <div>
      {/* KPI Row */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Total Complaints',   val: stats.total,      color: 'var(--color-primary)',  sub: 'All time' },
          { label: 'Resolution Rate',    val: `${resolutionRate}%`, color: 'var(--color-success)', sub: `${stats.resolved} resolved` },
          { label: 'Active Issues',      val: stats.pending + stats.inProgress, color: 'var(--status-pending)', sub: `${stats.pending} pending · ${stats.inProgress} in progress` },
          { label: 'Feedback Entries',   val: feedback.length,  color: 'var(--color-teal)',     sub: 'Student submissions' },
        ].map(({ label, val, color, sub }) => (
          <div key={label} className="stat-card">
            <div className="stat-card-icon" style={{ background: `${color}22` }}>
              <BarChart3 size={20} style={{ color }} />
            </div>
            <div className="stat-value" style={{ color }}>{val}</div>
            <div className="stat-label">{label}</div>
            <div className="stat-change">{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="section-grid" style={{ marginBottom: '24px' }}>
        {/* Monthly Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><TrendingUp size={18} style={{ color: 'var(--color-primary)' }} /> Monthly Trend</div>
              <div className="card-subtitle">Complaints submitted vs resolved</div>
            </div>
          </div>
          <div className="chart-container" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA.complaintsByMonth} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,180,0.1)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }} />
                <Bar dataKey="complaints" name="Submitted" fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="resolved"   name="Resolved"  fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Pie */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><Brain size={18} style={{ color: 'var(--color-accent)' }} /> Feedback Sentiment</div>
              <div className="card-subtitle">AI-analyzed sentiment distribution</div>
            </div>
            <span className="ai-badge"><Brain size={11} /> AI</span>
          </div>
          <div className="chart-container" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_SENTIMENT}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PIE_SENTIMENT.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="section-grid" style={{ marginBottom: '24px' }}>
        {/* Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><BarChart3 size={18} style={{ color: 'var(--color-primary)' }} /> By Category</div>
            <div className="card-subtitle" style={{ marginTop: '2px' }}>Complaints per department</div>
          </div>
          <div className="chart-container" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA.complaintsByCategory} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,180,0.1)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Complaints" radius={[0,4,4,0]}>
                  {ANALYTICS_DATA.complaintsByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Issues */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><AlertCircle size={18} style={{ color: 'var(--color-warning)' }} /> Top Issues</div>
            <div className="card-subtitle" style={{ marginTop: '2px' }}>Most reported problems</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topIssues.map((issue, i) => {
              const pct = Math.round((issue.count / topIssues[0].count) * 100);
              return (
                <div key={issue.issue} className="top-issue-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="top-issue-rank" style={{ background: COLORS[i] + '22', color: COLORS[i] }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{issue.issue}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-primary">{issue.category.split(' ')[0]}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS[i] }}>{issue.count}</span>
                    </div>
                  </div>
                  <div className="sentiment-bar-wrap">
                    <div className="sentiment-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[(i+1)%COLORS.length]})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resolution Line Chart */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title"><Award size={18} style={{ color: 'var(--color-success)' }} /> Resolution Timeline</div>
            <div className="card-subtitle">Monthly complaint resolution progress</div>
          </div>
        </div>
        <div className="chart-container" style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ANALYTICS_DATA.complaintsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,180,0.1)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }} />
              <Line type="monotone" dataKey="complaints" name="Submitted" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="resolved"   name="Resolved"  stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
