// ============================================================
// ToastContainer.jsx – Notification toasts
// ============================================================

import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ICONS = {
  success: <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />,
  error:   <AlertCircle  size={16} style={{ color: 'var(--color-danger)' }} />,
  info:    <Info         size={16} style={{ color: 'var(--color-info)' }} />,
};

export default function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} role="alert">
          {ICONS[t.type] || ICONS.info}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
