import StatCard from '../components/StatCard.jsx'
import Table    from '../components/Table.jsx'
import Badge    from '../components/Badge.jsx'
import Icon     from '../components/Icon.jsx'
import { useEffect, useState } from 'react'

// ── Animated Bar Chart ────────────────────────────────────────
const BarChart = ({ data, color, valuePrefix = '', valueSuffix = '' }) => {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 150); return () => clearTimeout(t) }, [])

  if (!data || data.length === 0)
    return <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No data yet</div>

  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110, padding: '0 2px' }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
              {valuePrefix}{d.value >= 1000 ? (d.value / 1000).toFixed(1) + 'k' : d.value}{valueSuffix}
            </span>
            <div style={{
              width: '100%', borderRadius: '4px 4px 0 0',
              background: color,
              height: animated ? `${Math.max(pct, d.value > 0 ? 3 : 0)}%` : '0%',
              transition: `height 0.65s cubic-bezier(.4,0,.2,1) ${i * 55}ms`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,255,255,0.18) 0%,transparent 60%)', borderRadius: 'inherit' }} />
            </div>
            <span style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Donut chart (Paid vs Balance) ─────────────────────────────
const DonutChart = ({ paid, balance }) => {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 180); return () => clearTimeout(t) }, [])

  const total = paid + balance
  if (total === 0)
    return <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No payment data yet</div>

  const r = 36, cx = 50, cy = 50, circ = 2 * Math.PI * r
  const paidPct = (paid / total) * 100
  const paidDash = animated ? (paidPct / 100) * circ : 0
  const balDash  = animated ? ((100 - paidPct) / 100) * circ : 0

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <svg viewBox="0 0 100 100" width={100} height={100} style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={11} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f59e0b" strokeWidth={11}
          strokeDasharray={`${balDash} ${circ}`} strokeDashoffset={-paidDash}
          strokeLinecap="butt" transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.8s ease 0.1s' }} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth={11}
          strokeDasharray={`${paidDash} ${circ}`} strokeDashoffset={0}
          strokeLinecap="butt" transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        <text x={cx} y={cy - 3} textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="700">{paidPct.toFixed(0)}%</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill="var(--muted)" fontSize="7">paid</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[['Paid', paid, '#22c55e'], ['Balance', balance, '#f59e0b']].map(([lbl, val, col]) => (
          <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: col, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{lbl}</div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: col }}>₹{val.toFixed(0)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Chart card wrapper ────────────────────────────────────────
const ChartCard = ({ title, icon, accent, children }) => (
  <div style={{ background: 'var(--card)', borderRadius: 14, padding: '18px 20px', border: '1px solid var(--border)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: accent + '22', color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={14} />
      </div>
      <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
    </div>
    {children}
  </div>
)

// ── Dashboard ─────────────────────────────────────────────────
const Dashboard = ({ products, customers, orders }) => {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    if (orders.length === 0) return
    const load = async () => {
      const all = []
      for (const o of orders.slice(0, 30)) {
        try {
          const p = await api.get(`/payments/${o.id}`)
          if (Array.isArray(p)) all.push(...p.map((x) => ({ ...x, _orderId: o.id, _shopName: o.customer?.shopName })))
        } catch { /* skip */ }
      }
      setPayments(all)
    }
    load()
  }, [orders])

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0)
  const lowStock     = products.filter((p) => p.stock < 10)

  // top products
  const prodMap = {}
  orders.forEach((o) => (o.items || []).forEach((it) => {
    const n = it.product?.name || `P#${it.product?.id}`
    prodMap[n] = (prodMap[n] || 0) + (it.quantity || 0)
  }))
  const topProducts = Object.entries(prodMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([l, v]) => ({ label: l.length > 9 ? l.slice(0, 8) + '…' : l, value: v }))

  // top customers
  const custMap = {}
  orders.forEach((o) => {
    const n = o.customer?.shopName || `C#${o.customer?.id}`
    custMap[n] = (custMap[n] || 0) + (o.totalAmount || 0)
  })
  const topCustomers = Object.entries(custMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([l, v]) => ({ label: l.length > 9 ? l.slice(0, 8) + '…' : l, value: Math.round(v) }))

  // orders by month (last 6)
  const now = new Date()
  const monthMap = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthMap[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 0
  }
  orders.forEach((o) => {
    const d = new Date(o.orderDate)
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (k in monthMap) monthMap[k]++
  })
  const monthlyData = Object.entries(monthMap).map(([k, v]) => ({
    label: new Date(k + '-01').toLocaleString('en-IN', { month: 'short' }),
    value: v,
  }))

  // paid vs balance
  const totalPaid    = payments.reduce((s, p) => s + (p.amount || 0), 0)
  const totalBalance = Math.max(0, totalRevenue - totalPaid)

  // recent 5 payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
    .slice(0, 5)

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontWeight: 800, fontSize: 26 }}>Dashboard</h2>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Products" value={products.length}               icon="package"      accent="#6366f1" />
        <StatCard label="Customers"      value={customers.length}              icon="users"        accent="#22c55e" />
        <StatCard label="Total Orders"   value={orders.length}                 icon="shoppingCart" accent="#f59e0b" />
        <StatCard label="Revenue"        value={'₹' + totalRevenue.toFixed(0)} icon="trendingUp"   accent="#ec4899" />
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div style={{ background: '#f59e0b11', border: '1.5px solid #f59e0b44', borderRadius: 12, padding: '13px 18px', marginBottom: 22, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ color: '#f59e0b', marginTop: 1 }}><Icon name="alertCircle" size={16} /></div>
          <div>
            <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: 2, fontSize: 13 }}>Low Stock</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{lowStock.map((p) => p.name).join(', ')} — below 10 units.</div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 16, marginBottom: 22 }}>
        <ChartCard title="Top Sold Products" icon="package" accent="#6366f1">
          <BarChart data={topProducts} color="#6366f1" valueSuffix=" u" />
        </ChartCard>
        <ChartCard title="Top Customers" icon="users" accent="#22c55e">
          <BarChart data={topCustomers} color="#22c55e" valuePrefix="₹" />
        </ChartCard>
        <ChartCard title="Orders by Month" icon="shoppingCart" accent="#f59e0b">
          <BarChart data={monthlyData} color="#f59e0b" />
        </ChartCard>
        <ChartCard title="Paid vs Balance" icon="creditCard" accent="#ec4899">
          <DonutChart paid={totalPaid} balance={totalBalance} />
        </ChartCard>
      </div>

      {/* Recent Orders + Recent Payments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--card)', borderRadius: 14, padding: '18px 20px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#6366f122', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shoppingCart" size={14} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Orders</span>
          </div>
          <Table
            headers={['Order', 'Customer', 'Amount', 'Date']}
            rows={[...orders].reverse().slice(0, 5).map((o) => [
              <Badge label={`#${o.id}`} color="#6366f1" />,
              <span style={{ fontSize: 13 }}>{o.customer?.shopName || '—'}</span>,
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>₹{o.totalAmount?.toFixed(2)}</span>,
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(o.orderDate).toLocaleDateString('en-IN')}</span>,
            ])}
          />
        </div>

        <div style={{ background: 'var(--card)', borderRadius: 14, padding: '18px 20px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#22c55e22', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="creditCard" size={14} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Payments</span>
          </div>
          {recentPayments.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No payments yet</div>
          ) : (
            <Table
              headers={['#', 'Shop', 'Paid', 'Balance', 'Date']}
              rows={recentPayments.map((p) => [
                <Badge label={`O#${p._orderId}`} color="#22c55e" />,
                <span style={{ fontSize: 12 }}>{p._shopName || '—'}</span>,
                <span style={{ fontFamily: 'monospace', color: '#22c55e', fontWeight: 700, fontSize: 13 }}>₹{p.amount?.toFixed(2)}</span>,
                <span style={{ fontFamily: 'monospace', color: p.balance > 0 ? '#f59e0b' : '#22c55e', fontSize: 13 }}>₹{p.balance?.toFixed(2)}</span>,
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(p.paymentDate).toLocaleDateString('en-IN')}</span>,
              ])}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
