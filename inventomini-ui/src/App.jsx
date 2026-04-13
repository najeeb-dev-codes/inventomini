import { useState, useEffect } from 'react'
import api            from './api/client.js'
import useToast       from './hooks/useToast.js'
import Sidebar        from './layouts/Sidebar.jsx'
import ToastContainer from './components/ToastContainer.jsx'

import Login     from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products  from './pages/Products.jsx'
import Customers from './pages/Customers.jsx'
import Ledger    from './pages/Ledger.jsx'
import Orders    from './pages/Orders.jsx'
import Payments  from './pages/Payments.jsx'
import Reports   from './pages/Reports.jsx'

const App = () => {
  const [authed,   setAuthed]   = useState(() => !!sessionStorage.getItem('inventomini_auth'))
  const [username, setUsername] = useState(() => sessionStorage.getItem('inventomini_user') || '')
  const [page,     setPage]     = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [ledgerCustomer, setLedgerCustomer] = useState(null)

  const [products,  setProducts]  = useState([])
  const [customers, setCustomers] = useState([])
  const [orders,    setOrders]    = useState([])

  const toast = useToast()

  const handleLogin = (user) => {
    setUsername(user)
    setAuthed(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('inventomini_auth')
    sessionStorage.removeItem('inventomini_user')
    setAuthed(false)
    setUsername('')
    setPage('dashboard')
    setProducts([])
    setCustomers([])
    setOrders([])
  }

  const navigate = (id) => {
    setPage(id)
    setLedgerCustomer(null)
  }

  const openLedger = (customer) => {
    setLedgerCustomer(customer)
    setPage('ledger')
  }

  useEffect(() => {
    if (!authed) return
    api.get('/products').then(setProducts)
    api.get('/customers').then(setCustomers)
    api.get('/orders').then(setOrders)
  }, [authed])

  // ── Not logged in ──────────────────────────────────────────
  if (!authed) {
    return <Login onLogin={handleLogin} />
  }

  // ── Page renderer ──────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard products={products} customers={customers} orders={orders} />
      case 'products':  return <Products  toast={toast} />
      case 'customers': return <Customers toast={toast} onViewLedger={openLedger} />
      case 'ledger':    return ledgerCustomer
                          ? <Ledger customer={ledgerCustomer} onBack={() => setPage('customers')} toast={toast} />
                          : null
      case 'orders':    return <Orders   toast={toast} />
      case 'payments':  return <Payments toast={toast} />
      case 'reports':   return <Reports  toast={toast} />
      default:          return null
    }
  }

  // ── Main layout ────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        page={page}
        onNavigate={navigate}
        onLogout={handleLogout}
        username={username}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((s) => !s)}
      />

      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', minWidth: 0 }}>
        {renderPage()}
      </main>

      <ToastContainer toasts={toast.toasts} />
    </div>
  )
}

export default App
