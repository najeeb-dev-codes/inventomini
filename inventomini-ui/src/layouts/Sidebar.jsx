import Icon from '../components/Icon.jsx'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'trendingUp' },
  { id: 'products',  label: 'Products',  icon: 'package'     },
  { id: 'customers', label: 'Customers', icon: 'users'        },
  { id: 'orders',    label: 'Orders',    icon: 'shoppingCart' },
  { id: 'payments',  label: 'Payments',  icon: 'creditCard'   },
  { id: 'reports',   label: 'Reports',   icon: 'fileText'     },
]

const Sidebar = ({ page, onNavigate, onLogout, username, open, onToggle }) => (
  <aside style={{
    width:        open ? 220 : 64,
    background:   'var(--card)',
    borderRight:  '1px solid var(--border)',
    display:      'flex',
    flexDirection:'column',
    transition:   'width 0.25s ease',
    overflow:     'hidden',
    flexShrink:   0,
    position:     'sticky',
    top:          0,
    height:       '100vh',
  }}>
    {/* Logo */}
    <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="box" size={17} />
      </div>
      {open && <span style={{ fontWeight: 800, fontSize: 16, whiteSpace: 'nowrap', color: 'var(--text)' }}>InventoMini</span>}
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, padding: '12px 8px' }}>
      {NAV_ITEMS.map((item) => {
        const active = page === item.id || (page === 'ledger' && item.id === 'customers')
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              width:          '100%',
              display:        'flex',
              alignItems:     'center',
              gap:            10,
              padding:        open ? '9px 12px' : '9px 0',
              justifyContent: open ? 'flex-start' : 'center',
              borderRadius:   8,
              border:         'none',
              cursor:         'pointer',
              background:     active ? 'var(--accent)' : 'transparent',
              color:          active ? '#fff' : 'var(--muted)',
              fontWeight:     active ? 700 : 500,
              fontSize:       14,
              marginBottom:   2,
              transition:     'all 0.15s',
              fontFamily:     'inherit',
              whiteSpace:     'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = 'var(--hover)'
              e.currentTarget.style.color = active ? '#fff' : 'var(--text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = active ? 'var(--accent)' : 'transparent'
              e.currentTarget.style.color = active ? '#fff' : 'var(--muted)'
            }}
          >
            <Icon name={item.icon} size={18} />
            {open && item.label}
          </button>
        )
      })}
    </nav>

    {/* User + logout */}
    <div style={{ padding: '0 8px 8px' }}>
      {open && (
        <div style={{
          padding: '10px 12px', marginBottom: 6, borderRadius: 8,
          background: 'var(--hover)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#fff',
          }}>
            {username.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {username}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Signed in</div>
          </div>
        </div>
      )}

      <button
        onClick={onLogout}
        style={{
          width: '100%', padding: '8px 0',
          background: '#ff475714', border: '1px solid #ff475733',
          borderRadius: 8, cursor: 'pointer', color: '#ff4757',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}
      >
        <Icon name="logOut" size={14} />
        {open && 'Sign Out'}
      </button>

      <button
        onClick={onToggle}
        style={{
          width: '100%', marginTop: 6, padding: '7px 0',
          background: 'var(--hover)', border: '1px solid var(--border)',
          borderRadius: 8, cursor: 'pointer', color: 'var(--muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name={open ? 'arrowLeft' : 'chevronRight'} size={16} />
      </button>
    </div>
  </aside>
)

export default Sidebar
