import { useState, useEffect, useCallback } from 'react'
import api   from '../api/client.js'
import Table from '../components/Table.jsx'
import Badge from '../components/Badge.jsx'
import Btn   from '../components/Btn.jsx'
import Modal from '../components/Modal.jsx'
import Field from '../components/Field.jsx'
import Icon  from '../components/Icon.jsx'
import Pagination from './../components/Pagination';

 

const PER_PAGE      = 10
const ITEMS_PER_PAGE = 5   // items pagination inside the modal

const Orders = ({ toast }) => {
  const [orders,    setOrders]    = useState([])
  const [products,  setProducts]  = useState([])
  const [customers, setCustomers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editOrder, setEditOrder] = useState(null)
  const [page,      setPage]      = useState(1)
  const [itemPage,  setItemPage]  = useState(1)   // pagination inside modal
  const [form, setForm] = useState({ customerId: '', items: [] })

  const load = useCallback(() => {
    api.get('/orders').then(setOrders)
    api.get('/products').then(setProducts)
    api.get('/customers').then(setCustomers)
  }, [])
  useEffect(() => { load() }, [load])

  // ── item helpers ──────────────────────────────────────────
  const addItem = () => {
    setForm((f) => ({ ...f, items: [...f.items, { productId: '', quantity: 1, isNew: true }] }))
    // jump to last page of items
    setTimeout(() => {
      const newCount = form.items.length + 1
      setItemPage(Math.ceil(newCount / ITEMS_PER_PAGE))
    }, 0)
  }
  const removeItem = (i) => setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))
  const updateItem = (i, key, val) => setForm((f) => {
    const items = [...f.items]; items[i] = { ...items[i], [key]: val }; return { ...f, items }
  })

  const openCreate = () => {
    setEditOrder(null)
    setItemPage(1)
    setForm({ customerId: '', items: [{ productId: '', quantity: 1, isNew: true }] })
    setShowModal(true)
  }

  const openEdit = (order) => {
    setEditOrder(order)
    setItemPage(1)
    setForm({
      customerId: order.customer?.id ? String(order.customer.id) : '',
      items: (order.items || []).map((item) => ({
        productId: item.product?.id ? String(item.product.id) : '',
        quantity:  item.quantity ?? 1,
        isNew:     false,
        _name:     item.product?.name  || '—',
        _price:    item.product?.price || 0,
      })),
    })
    setShowModal(true)
  }

  const save = async () => {
    if (!form.customerId) return toast.show('Select a customer', 'error')
    if (form.items.length === 0) return toast.show('Add at least one item', 'error')
    if (form.items.some((i) => !i.productId)) return toast.show('Select a product for every item', 'error')
    const payload = {
      customerId: +form.customerId,
      items: form.items.map((i) => ({ productId: +i.productId, quantity: +i.quantity })),
    }
    if (editOrder) { await api.put(`/orders/${editOrder.id}`, payload); toast.show('Order updated!') }
    else           { await api.post('/orders', payload);                 toast.show('Order created!') }
    setShowModal(false)
    load()
  }

  // paginated orders table
  const paginated = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // paginated items inside modal
  const pagedItems = form.items.slice((itemPage - 1) * ITEMS_PER_PAGE, itemPage * ITEMS_PER_PAGE)
  // real index in form.items for each paged item
  const realIndex  = (localIdx) => (itemPage - 1) * ITEMS_PER_PAGE + localIdx

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: 26 }}>Orders</h2>
        <Btn icon="plus" onClick={openCreate}>New Order</Btn>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 14, border: '1px solid var(--border)', padding: '8px 0' }}>
        <Table
          headers={['ID', 'Customer', 'Items', 'Total', 'Date', 'Actions']}
          rows={paginated.map((o) => [
            <Badge label={`#${o.id}`} color="#6366f1" />,
            o.customer?.shopName || '—',
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>{o.items?.length || 0} item(s)</span>,
            <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>₹{o.totalAmount?.toFixed(2)}</span>,
            new Date(o.orderDate).toLocaleDateString('en-IN'),
            <Btn small variant="secondary" icon="eye" onClick={() => openEdit(o)}>Edit</Btn>,
          ])}
        />
        <Pagination page={page} total={orders.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      {showModal && (
        <Modal
          title={editOrder ? `Edit Order #${editOrder.id}` : 'Create Order'}
          onClose={() => setShowModal(false)}
        >
          {/* Customer */}
          <Field label="Customer" type="select" value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            disabled={!!editOrder}
          >
            <option value="">— Select customer —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.shopName} ({c.ownerName})</option>
            ))}
          </Field>

          {/* Items header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Items ({form.items.length})
            </label>
            <Btn small variant="secondary" icon="plus" onClick={addItem}>Add Item</Btn>
          </div>

          {/* Paginated items list */}
          <div style={{ marginBottom: 10 }}>
            {pagedItems.map((item, localIdx) => {
              const i          = realIndex(localIdx)
              const prod       = products.find((p) => String(p.id) === String(item.productId))
              const isExisting = !item.isNew

              return (
                <div key={i} style={{
                  display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center',
                  background: 'var(--bg)', borderRadius: 10, padding: '10px 14px',
                  border: `1.5px solid ${isExisting ? 'var(--border)' : '#6366f155'}`,
                }}>
                  {/* Product */}
                  <div style={{ flex: 2, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Product
                      {item.isNew && <span style={{ marginLeft: 5, color: '#6366f1', background: '#6366f122', borderRadius: 4, padding: '1px 5px', fontSize: 9 }}>NEW</span>}
                    </div>
                    {isExisting ? (
                      <div style={{ padding: '8px 12px', borderRadius: 7, border: '1.5px solid var(--border)', background: 'var(--card)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, display: 'inline-block' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {prod?.name || item._name || '—'}
                        </span>
                        <span style={{ color: 'var(--muted)', marginLeft: 'auto', fontFamily: 'monospace', fontSize: 12, flexShrink: 0 }}>
                          ₹{prod?.price ?? item._price ?? 0}
                        </span>
                      </div>
                    ) : (
                      <select value={item.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1.5px solid #6366f166', background: 'var(--card)', color: item.productId ? 'var(--text)' : 'var(--muted)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}>
                        <option value="">— Select product —</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}  ·  ₹{p.price}  (stock: {p.stock})</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Qty */}
                  <div style={{ width: 72, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Qty</div>
                    <input type="number" min="1" value={item.quantity}
                      onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1.5px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                  </div>

                  {/* Delete */}
                  <button onClick={() => removeItem(i)} title="Remove"
                    style={{ marginTop: 18, background: '#ff475718', border: '1.5px solid #ff475744', borderRadius: 7, cursor: 'pointer', color: '#ff4757', display: 'flex', padding: '7px', flexShrink: 0 }}>
                    <Icon name="trash2" size={14} />
                  </button>
                </div>
              )
            })}

            {/* Items pagination */}
            {form.items.length > ITEMS_PER_PAGE && (
              <Pagination page={itemPage} total={form.items.length} perPage={ITEMS_PER_PAGE} onChange={setItemPage} />
            )}
          </div>

          {/* Summary */}
          {form.items.some((i) => i.productId) && (
            <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)', marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Summary</div>
              {form.items.filter((i) => i.productId).map((item, i) => {
                const p = products.find((p) => String(p.id) === String(item.productId))
                const name = p?.name || item._name || '—'
                const price = p?.price || item._price || 0
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                    <span style={{ color: 'var(--text)' }}>{name} × {item.quantity}</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>₹{(price * (item.quantity || 0)).toFixed(2)}</span>
                  </div>
                )
              })}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ fontFamily: 'monospace', color: '#22c55e' }}>
                  ₹{form.items.reduce((sum, item) => {
                    const p = products.find((p) => String(p.id) === String(item.productId))
                    return sum + ((p?.price || item._price || 0) * (item.quantity || 0))
                  }, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn icon="check" onClick={save}>{editOrder ? 'Update Order' : 'Create Order'}</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Orders
