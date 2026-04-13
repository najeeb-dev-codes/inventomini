import { useState } from 'react'
import api  from '../api/client.js'
import Icon from '../components/Icon.jsx'

const FEATURES = [
  { icon: 'package',      label: 'Inventory Tracking',  color: '#6366f1' },
  { icon: 'users',        label: 'Customer Ledgers',     color: '#22c55e' },
  { icon: 'shoppingCart', label: 'Order Management',     color: '#f59e0b' },
  { icon: 'fileText',     label: 'PDF & Excel Reports',  color: '#ec4899' },
]

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleLogin = async () => {
    if (!username || !password) { setError('Please enter username and password.'); return }
    setLoading(true)
    setError('')
    try {
      const { ok, encoded } = await api.verify(username, password)
      if (ok) {
        sessionStorage.setItem('inventomini_auth', encoded)
        sessionStorage.setItem('inventomini_user', username)
        onLogin(username)
      } else {
        setError('Invalid username or password.')
      }
    } catch {
      setError('Cannot connect to server. Is Spring Boot running on port 8080?')
    }
    setLoading(false)
  }

  const onKey = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient orbs + grid */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, #6366f122 0%, transparent 70%)', top: '-80px', left: '-100px' }} />
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, #22c55e18 0%, transparent 70%)', bottom: '-60px', right: '-60px' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #f59e0b14 0%, transparent 70%)', top: '55%', left: '15%' }} />
        <svg width="100%" height="100%" style={{ opacity: 0.035 }}>
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#fff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Card */}
      <div style={{
        display: 'flex', width: '100%', maxWidth: 900, minHeight: 520,
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        border: '1px solid var(--border)', zIndex: 1,
        margin: '0 16px',
      }}>

        {/* ── Left branding ── */}
        <div style={{
          flex: 1, minWidth: 0,
          background: 'linear-gradient(145deg, #1a1d2e 0%, #0f1117 100%)',
          padding: '56px 44px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          borderRight: '1px solid var(--border)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Rainbow top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: 'linear-gradient(90deg, #6366f1, #22c55e, #f59e0b)' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px #6366f144' }}>
                <Icon name="box" size={20} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>InventoMini</span>
            </div>

            <h1 style={{
              fontSize: 34, fontWeight: 800, lineHeight: 1.2,
              letterSpacing: '-0.03em', marginBottom: 16,
              background: 'linear-gradient(135deg, #fff 40%, #6b7280)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Wholesale<br />Made Simple.
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, maxWidth: 280 }}>
              Manage products, customers, orders, payments and reports — all in one place.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FEATURES.map((f) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: f.color + '22', color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={f.icon} size={14} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form ── */}
        <div style={{ width: 380, flexShrink: 0, background: 'var(--card)', padding: '56px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>Welcome back</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Sign in to your account to continue</p>
          </div>

          {error && (
            <div style={{ background: '#ff475714', border: '1.5px solid #ff475744', borderRadius: 10, padding: '11px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#ff4757' }}>
              <Icon name="alertCircle" size={15} />
              {error}
            </div>
          )}

          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Username</label>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 14px', transition: 'border-color 0.2s' }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
              onBlurCapture={(e)  => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <Icon name="users" size={16} />
              <input
                value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={onKey}
                placeholder="Enter username" autoFocus
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--text)', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 14px', transition: 'border-color 0.2s' }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
              onBlurCapture={(e)  => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <Icon name="creditCard" size={16} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onKey}
                placeholder="Enter password"
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--text)', width: '100%', fontFamily: 'inherit' }}
              />
              <button onClick={() => setShowPass((s) => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', flexShrink: 0, padding: 0 }}>
                <Icon name={showPass ? 'x' : 'eye'} size={15} />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin} disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: loading ? 'var(--border)' : 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', letterSpacing: '-0.01em',
              boxShadow: loading ? 'none' : '0 4px 20px #6366f144',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid #ffffff66', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Verifying…
              </>
            ) : (
              <>
                <Icon name="check" size={16} />
                Sign In
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
           
            Default Login : <code style={{ background: 'var(--bg)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>admin</code> / admin123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
