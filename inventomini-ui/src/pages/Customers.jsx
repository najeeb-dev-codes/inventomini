import { useState, useEffect, useCallback } from 'react'
import api   from '../api/client.js'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Btn   from '../components/Btn.jsx'
import Field from '../components/Field.jsx'
import Icon  from '../components/Icon.jsx'
import Pagination from './../components/Pagination';


const PER_PAGE = 10

const Customers = ({ toast, onViewLedger }) => {
  const [customers,  setCustomers]  = useState([])
  const [showModal,  setShowModal]  = useState(false)
  const [cityFilter, setCityFilter] = useState('')
  const [page,       setPage]       = useState(1)
  const [form, setForm] = useState({
    shopName: '', ownerName: '', phone: '',
    street: '', area: '', city: '', state: '', pincode: '',
  })

  const load = useCallback(async () => {
    const data = cityFilter.trim()
      ? await api.get(`/customers/city/${cityFilter.trim()}`)
      : await api.get('/customers')
    setCustomers(data)
    setPage(1)
  }, [cityFilter])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!form.shopName || !form.ownerName) return toast.show('Fill required fields', 'error')
    await api.post('/customers', form)
    toast.show('Customer added!')
    setShowModal(false)
    setForm({ shopName: '', ownerName: '', phone: '', street: '', area: '', city: '', state: '', pincode: '' })
    load()
  }

  const paginated = customers.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: 26 }}>Customers</h2>
        <Btn icon="plus" onClick={() => setShowModal(true)}>Add Customer</Btn>
      </div>

      {/* City search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 8, padding: '7px 12px', maxWidth: 280 }}>
          <Icon name="search" size={16} />
          <input
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Filter by city…"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--text)', width: '100%', fontFamily: 'inherit' }}
          />
          {cityFilter && (
            <button onClick={() => setCityFilter('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}>
              <Icon name="x" size={14} />
            </button>
          )}
        </div>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 14, border: '1px solid var(--border)', padding: '8px 0' }}>
        <Table
          headers={['ID', 'Shop Name', 'Owner', 'Phone', 'City', 'Actions']}
          rows={paginated.map((c) => [
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>#{c.id}</span>,
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="store" size={13} /><strong>{c.shopName}</strong>
            </div>,
            c.ownerName,
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)' }}>
              <Icon name="phone" size={13} />{c.phone}
            </div>,
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)' }}>
              <Icon name="mapPin" size={13} />{c.city}
            </div>,
            <Btn small variant="secondary" icon="bookOpen" onClick={() => onViewLedger(c)}>Ledger</Btn>,
          ])}
        />
        <Pagination page={page} total={customers.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      {showModal && (
        <Modal title="Add Customer" onClose={() => setShowModal(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field label="Shop Name *"  value={form.shopName}  onChange={(e) => setForm({ ...form, shopName:  e.target.value })} placeholder="Shop name"  />
            <Field label="Owner Name *" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} placeholder="Owner name" />
            <Field label="Phone"        value={form.phone}     onChange={(e) => setForm({ ...form, phone:     e.target.value })} placeholder="9876543210" />
            <Field label="City"         value={form.city}      onChange={(e) => setForm({ ...form, city:      e.target.value })} placeholder="City"        />
            <Field label="Street"       value={form.street}    onChange={(e) => setForm({ ...form, street:    e.target.value })} placeholder="Street"      />
            <Field label="Area"         value={form.area}      onChange={(e) => setForm({ ...form, area:      e.target.value })} placeholder="Area"        />
            <Field label="State"        value={form.state}     onChange={(e) => setForm({ ...form, state:     e.target.value })} placeholder="State"       />
            <Field label="Pincode"      value={form.pincode}   onChange={(e) => setForm({ ...form, pincode:   e.target.value })} placeholder="600001"      />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn icon="check" onClick={save}>Save Customer</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Customers
