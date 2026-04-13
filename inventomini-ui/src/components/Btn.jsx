import Icon from './Icon.jsx'

const variantStyles = {
  primary:   { background: 'var(--accent)', color: '#fff',          border: 'none' },
  secondary: { background: 'var(--card)',   color: 'var(--text)',   border: '1.5px solid var(--border)' },
  danger:    { background: '#ff475722',     color: '#ff4757',       border: '1.5px solid #ff475744' },
  ghost:     { background: 'transparent',   color: 'var(--muted)',  border: 'none' },
}

const Btn = ({ children, onClick, variant = 'primary', disabled, icon, small }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      ...variantStyles[variant],
      padding:        small ? '6px 12px' : '9px 16px',
      borderRadius:   8,
      cursor:         disabled ? 'not-allowed' : 'pointer',
      fontWeight:     600,
      fontSize:       small ? 13 : 14,
      display:        'inline-flex',
      alignItems:     'center',
      gap:            6,
      opacity:        disabled ? 0.5 : 1,
      transition:     'all 0.15s',
      fontFamily:     'inherit',
    }}
  >
    {icon && <Icon name={icon} size={small ? 14 : 16} />}
    {children}
  </button>
)

export default Btn
