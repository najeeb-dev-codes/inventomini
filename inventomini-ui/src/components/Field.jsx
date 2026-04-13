const Field = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{
      display: 'block', fontSize: 12, fontWeight: 600,
      color: 'var(--muted)', marginBottom: 5,
      textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      {label}
    </label>

    {props.type === 'select' ? (
      <select
        {...props}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: '1.5px solid var(--border)', background: 'var(--bg)',
          color: 'var(--text)', fontSize: 14, outline: 'none',
          fontFamily: 'inherit',
        }}
      >
        {props.children}
      </select>
    ) : (
      <input
        {...props}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: '1.5px solid var(--border)', background: 'var(--bg)',
          color: 'var(--text)', fontSize: 14, outline: 'none',
          boxSizing: 'border-box', fontFamily: 'inherit',
        }}
      />
    )}
  </div>
)

export default Field
