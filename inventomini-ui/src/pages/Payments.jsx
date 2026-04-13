import { useState, useEffect } from 'react'
import api   from '../api/client.js'
import Table from '../components/Table.jsx'
import Btn   from '../components/Btn.jsx'
import Field from '../components/Field.jsx'
import Pagination from './../components/Pagination';

const PER_PAGE = 10

const Payments = ({ toast }) => {
  const [orders,        setOrders]        = useState([])
  const [selectedOrder, setSelectedOrder] = useState('')
  const [payments,      setPayments]      = useState([])
  const [amount,        setAmount]        = useState('')
  const [page,          setPage]          = useState(1)

  useEffect(() => { api.get('/orders').then(setOrders) }, [])

  const loadPayments = async (oid) => {
    if (!oid) { setPayments([]); setPage(1); return }
    const data = await api.get(`/payments/${oid}`)
    setPayments(Array.isArray(data) ? data : [])
    setPage(1)
  }

  const selectOrder = (oid) => { setSelectedOrder(oid); loadPayments(oid) }

  const pay = async () => {
    if (!selectedOrder || !amount) return toast.show('Select order and enter amount', 'error')
    await fetch(`/api/payments/${selectedOrder}?amount=${amount}`, {
      method: 'POST',
      headers: { Authorization: 'Basic ' + sessionStorage.getItem('inventomini_auth') },
    })
    toast.show('Payment recorded!')
    setAmount('')
    loadPayments(selectedOrder)
  }

  const order     = orders.find((o) => o.id === +selectedOrder)
  const totalPaid = payments.reduce((s, p) => s + (p.amount || 0), 0)
  const balance   = (order?.totalAmount || 0) - totalPaid

  // sorted newest first, then paginated
  const sorted    = [...payments].sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontWeight: 800, fontSize: 26 }}>Payments</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Record panel */}
        <div style={{ background: 'var(--card)', borderRadius: 14, border: '1px solid var(--border)', padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Record Payment</h3>

          <Field label="Select Order" type="select" value={selectedOrder} onChange={(e) => selectOrder(e.target.value)}>
            <option value="">— Select order —</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.id} — {o.customer?.shopName} (₹{o.totalAmount?.toFixed(2)})
              </option>
            ))}
          </Field>

          {order && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                ['Total',   `₹${order.totalAmount?.toFixed(2)}`, '#6366f1'],
                ['Paid',    `₹${totalPaid.toFixed(2)}`,          '#22c55e'],
                ['Balance', `₹${balance.toFixed(2)}`,            balance > 0 ? '#f59e0b' : '#22c55e'],
              ].map(([l, v, c]) => (
                <div key={l} style={{ background: c + '11', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: c, fontWeight: 600, marginBottom: 3, textTransform: 'uppercase' }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: c, fontFamily: 'monospace' }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          <Field label="Amount (₹)" type="number" value={amount}
            onChange={(e) => setAmount(e.target.value)} placeholder="Enter payment amount" />
          <Btn icon="creditCard" onClick={pay} disabled={!selectedOrder || !amount}>
            Record Payment
          </Btn>
        </div>

        {/* History panel with pagination */}
        <div style={{ background: 'var(--card)', borderRadius: 14, border: '1px solid var(--border)', padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
            Payment History {payments.length > 0 && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 13 }}>({payments.length})</span>}
          </h3>
          <Table
            headers={['#', 'Amount', 'Balance', 'Date']}
            empty="Select an order to view payments"
            rows={paginated.map((p, i) => [
              (page - 1) * PER_PAGE + i + 1,
              <span style={{ fontFamily: 'monospace', color: '#22c55e', fontWeight: 700 }}>₹{p.amount?.toFixed(2)}</span>,
              <span style={{ fontFamily: 'monospace', color: p.balance > 0 ? '#f59e0b' : '#22c55e' }}>₹{p.balance?.toFixed(2)}</span>,
              new Date(p.paymentDate).toLocaleString('en-IN'),
            ])}
          />
          <Pagination page={page} total={payments.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}

export default Payments
