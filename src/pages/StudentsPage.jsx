// ============================================================
// StudentsPage.jsx – Admin view of registered students
// ============================================================

import { useApp } from '../context/AppContext';
import { DEMO_STUDENTS } from '../data/sampleData';
import { Users, GraduationCap, MessageSquareWarning } from 'lucide-react';

export default function StudentsPage() {
  const { complaints } = useApp();

  const studentData = DEMO_STUDENTS.map(s => ({
    ...s,
    totalComplaints: complaints.filter(c => c.studentId === s.id).length,
    resolvedComplaints: complaints.filter(c => c.studentId === s.id && c.status === 'Resolved').length,
    pendingComplaints: complaints.filter(c => c.studentId === s.id && c.status === 'Pending').length,
  }));

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <Users size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="stat-value">{DEMO_STUDENTS.length}</div>
          <div className="stat-label">Registered Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>
            <MessageSquareWarning size={20} style={{ color: 'var(--status-pending)' }} />
          </div>
          <div className="stat-value">{studentData.reduce((s, d) => s + d.totalComplaints, 0)}</div>
          <div className="stat-label">Total Complaints Filed</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(16,185,129,0.12)' }}>
            <GraduationCap size={20} style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="stat-value">{[...new Set(DEMO_STUDENTS.map(s => s.department))].length}</div>
          <div className="stat-label">Departments</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><Users size={18} style={{ color: 'var(--color-primary)' }} /> Student Directory</div>
          <div className="card-subtitle" style={{ marginTop: '2px' }}>{DEMO_STUDENTS.length} registered students</div>
        </div>
        <div className="students-table-wrap">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Department</th>
                <th>Year</th>
                <th>Complaints</th>
                <th>Resolved</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {studentData.map(s => {
                const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{s.rollNo}</span></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{s.department}</td>
                    <td style={{ fontSize: '0.85rem' }}>Year {s.year}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{s.totalComplaints}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>{s.resolvedComplaints}</td>
                    <td>
                      {s.pendingComplaints > 0
                        ? <span className="badge badge-pending">{s.pendingComplaints}</span>
                        : <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.85rem' }}>—</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
