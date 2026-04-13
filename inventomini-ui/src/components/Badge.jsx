const Badge = ({ label, color = '#6366f1' }) => (
  <span style={{
    background: color + '22', color,
    padding: '3px 9px', borderRadius: 99,
    fontSize: 12, fontWeight: 600,
  }}>
    {label}
  </span>
)

export default Badge
