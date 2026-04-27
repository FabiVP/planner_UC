import './StatCard.css';

export default function StatCard({ icon: Icon, iconBg, title, value, label, subtitle, color }) {
  return (
    <div className="stat-card animate-fadeIn">
      <div className="stat-card-icon" style={{ background: iconBg }}>
        <Icon />
      </div>
      <div className="stat-card-info">
        {title && <span className="stat-card-title">{title}</span>}
        <div className="stat-card-value">
          <span className="stat-number">{value}</span>
          <span className="stat-label" style={{ color: color || 'var(--text-secondary)' }}>{label}</span>
        </div>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

