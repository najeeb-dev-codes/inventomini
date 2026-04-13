import { useState, useEffect, useCallback } from 'react'
import api    from '../api/client.js'
import Table  from '../components/Table.jsx'
import Badge  from '../components/Badge.jsx'
import Btn    from '../components/Btn.jsx'
import Modal  from '../components/Modal.jsx'
import Field  from '../components/Field.jsx'
import Pagination from './../components/Pagination';


const PER_PAGE = 10

const Products = ({ toast }) => {
  const [products,  setProducts]  = useState([])
  const [showModal, setShowModal] = useState(false)
  const [page,      setPage]      = useState(1)
  const [form,      setForm]      = useState({ name: '', price: '', stock: '' })

  const load = useCallback(() => api.get('/products').then(setProducts), [])
  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!form.name || !form.price || !form.stock) return toast.show('Fill all fields', 'error')
    await api.post('/products', { name: form.name, price: +form.price, stock: +form.stock })
    toast.show('Product added!')
    setShowModal(false)
    setForm({ name: '', price: '', stock: '' })
    setPage(1)
    load()
  }

  const remove = async (id) => {
    await api.del(`/products/${id}`)
    toast.show('Product deleted', 'info')
    // Stay on same page unless it's now empty
    const remaining = products.filter((p) => p.id !== id)
    const maxPage = Math.max(1, Math.ceil(remaining.length / PER_PAGE))
    if (page > maxPage) setPage(maxPage)
    load()
  }

  const paginated = products.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: 26 }}>Products</h2>
        <Btn icon="plus" onClick={() => setShowModal(true)}>Add Product</Btn>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 14, border: '1px solid var(--border)', padding: '8px 0' }}>
        <Table
          headers={['ID', 'Name', 'Price', 'Stock', 'Status', 'Action']}
          rows={paginated.map((p) => [
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>#{p.id}</span>,
            <strong>{p.name}</strong>,
            <span style={{ fontFamily: 'monospace' }}>₹{p.price?.toFixed(2)}</span>,
            p.stock,
            <Badge label={p.stock < 10 ? 'Low' : 'OK'} color={p.stock < 10 ? '#f59e0b' : '#22c55e'} />,
            <Btn small variant="danger" icon="trash2" onClick={() => remove(p.id)}>Delete</Btn>,
          ])}
        />
        <Pagination page={page} total={products.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      {showModal && (
        <Modal title="Add Product" onClose={() => setShowModal(false)}>
          <Field label="Name"      value={form.name}  onChange={(e) => setForm({ ...form, name:  e.target.value })} placeholder="Product name" />
          <Field label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
          <Field label="Stock"     type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" />
          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn icon="check" onClick={save}>Save Product</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Products
