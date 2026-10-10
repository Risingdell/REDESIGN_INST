import { Link } from 'react-router-dom';
import { useUI } from '@/context/UIContext';
import { Icon } from './Icon';

export function Stars({ value = 5 }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" style={{ opacity: i < value ? 1 : 0.25 }} />
      ))}
    </span>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} aria-current={i === items.length - 1 ? 'page' : undefined}>
            {item.to && i !== items.length - 1 ? <Link to={item.to}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Toasts() {
  const { toasts, dismissToast } = useUI();
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.tone}`} role="status">
          <Icon name={t.tone === 'error' ? 'alert' : 'check-circle'} size={20} />
          {t.message}
          <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss">
            <Icon name="x" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon = 'search', title, children }) {
  return (
    <div className="empty">
      <Icon name={icon} />
      <p style={{ fontWeight: 700, color: 'var(--text)' }}>{title}</p>
      {children && <div style={{ marginTop: 8 }}>{children}</div>}
    </div>
  );
}
