import Icon from './Icon.jsx'

const ToastContainer = ({ toasts }) => (
  <div style={{
    position: 'fixed', bottom: 24, right: 24,
    zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
  }}>
    {toasts.map((t) => (
      <div
        key={t.id}
        style={{
          background: t.type === 'error' ? '#ff4757' : t.type === 'info' ? '#3b82f6' : '#22c55e',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          animation: 'slideIn 0.25s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon name={t.type === 'error' ? 'alertCircle' : 'check'} size={15} />
        {t.msg}
      </div>
    ))}
  </div>
)

export default ToastContainer
