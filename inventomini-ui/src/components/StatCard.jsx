import Icon from './Icon.jsx'

const StatCard = ({ label, value, icon, accent }) => (
  <div style={{
    background: 'var(--card)', borderRadius: 14, padding: '20px 24px',
    border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: accent + '22', color: accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon name={icon} size={22} />
    </div>
    <div>
      <div style={{
        fontSize: 26, fontWeight: 800, color: 'var(--text)',
        lineHeight: 1.1, fontFamily: "'DM Mono', monospace",
      }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{label}</div>
    </div>
  </div>
)

export default StatCard
