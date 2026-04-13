import { useState } from 'react'
import api  from '../api/client.js'
import Btn  from '../components/Btn.jsx'
import Field from '../components/Field.jsx'

const Reports = ({ toast }) => {
  const today      = new Date().toISOString().split('T')[0]
  const monthStart = today.slice(0, 7) + '-01'

  const [from,    setFrom]    = useState(monthStart)
  const [to,      setTo]      = useState(today)
  const [loading, setLoading] = useState(false)

  const download = async (type) => {
    setLoading(true)
    toast.show(`Generating ${type.toUpperCase()}…`, 'info')
    try {
      await api.download(
        `/reports/${type}?from=${from}&to=${to}`,
        `report.${type === 'pdf' ? 'pdf' : 'xlsx'}`
      )
      toast.show('Downloaded!')
    } catch {
      toast.show('Download failed', 'error')
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontWeight: 800, fontSize: 26 }}>Reports</h2>

      <div style={{ background: 'var(--card)', borderRadius: 14, border: '1px solid var(--border)', padding: 28, maxWidth: 480 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Generate Report</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Field label="From Date" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Field label="To Date"   type="date" value={to}   onChange={(e) => setTo(e.target.value)}   />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <Btn icon="fileText" onClick={() => download('pdf')}   disabled={loading}>Download PDF</Btn>
          <Btn icon="download" onClick={() => download('excel')} disabled={loading} variant="secondary">Download Excel</Btn>
        </div>
      </div>
    </div>
  )
}

export default Reports
