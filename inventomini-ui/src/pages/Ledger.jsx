import { useState, useEffect } from 'react'
import api   from '../api/client.js'
import Table from '../components/Table.jsx'
import Badge from '../components/Badge.jsx'
import Btn   from '../components/Btn.jsx'
import Icon  from '../components/Icon.jsx'

const Ledger = ({ customer, onBack, toast }) => {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    api.get(`/customers/${customer.id}/ledger`).then(setEntries)
  }, [customer.id])

  const downloadPdf = () => {
    api.download(`/customers/${customer.id}/ledger/pdf`, `ledger_${customer.id}.pdf`)
    toast.show('Downloading PDF…', 'info')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBack}
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex', color: 'var(--text)' }}
          >
            <Icon name="arrowLeft" size={18} />
          </button>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22 }}>{customer.shopName}</h2>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>
              {customer.ownerName} · {customer.city}
            </p>
          </div>
        </div>
        <Btn icon="download" variant="secondary" onClick={downloadPdf}>Download PDF</Btn>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 14, border: '1px solid var(--border)', padding: '8px 0' }}>
        <Table
          headers={['Type', 'Order ID', 'Amount', 'Balance', 'Date']}
          rows={entries.map((e) => [
            <Badge label={e.type} color={e.type === 'ORDER' ? '#6366f1' : '#22c55e'} />,
            <span style={{ color: 'var(--muted)' }}>#{e.orderId}</span>,
            <span style={{ fontFamily: 'monospace' }}>₹{e.amount?.toFixed(2)}</span>,
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: e.balance > 0 ? '#f59e0b' : '#22c55e' }}>
              ₹{e.balance?.toFixed(2)}
            </span>,
            new Date(e.date).toLocaleString('en-IN'),
          ])}
        />
      </div>
    </div>
  )
}

export default Ledger
