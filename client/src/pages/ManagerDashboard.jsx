import { useState, useEffect } from 'react'

import { Sidebar } from '../components/Sidebar'
import { apiUrl } from '../lib/api'
const ST = {
  delivered: 'bg-green-100 text-green-700',
  out_for_delivery: 'bg-blue-100 text-blue-700',
  ready: 'bg-yellow-100 text-yellow-700',
  cooking: 'bg-orange-100 text-orange-700',
  pending: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700'
}

export function ManagerDashboard() {
  const [tab, setTab] = useState('analytics')
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [reservations, setReservations] = useState([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', cat: 'Burgers', price: '', quantity: '', time: '15 min', description: '', img: '' })
  let cumulPct = 0

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user || user.role !== 'manager') {
      window.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, ordersRes, reservationsRes] = await Promise.all([
          fetch(apiUrl('/api/users/all')),
          fetch(apiUrl('/api/products/get')),
          fetch(apiUrl('/api/orders/all')),
          fetch(apiUrl('/api/reservations/all'))
        ])
        if (usersRes.ok) setUsers(await usersRes.json())
        if (productsRes.ok) {
          const pData = await productsRes.json()
          setProducts(pData.data || [])
        }
        if (ordersRes.ok) setOrders(await ordersRes.json())
        if (reservationsRes.ok) setReservations(await reservationsRes.json())
      } catch (err) {
        console.error('Failed to fetch data', err)
      }
    }
    fetchData()
  }, [])

  const handleRoleChange = async (id, role) => {
    try {
      await fetch(apiUrl(`/api/users/${id}/role`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u))
    } catch (err) { console.error(err) }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(apiUrl(`/api/users/${id}`), { method: 'DELETE' })
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch (err) { console.error(err) }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(apiUrl(`/api/products/delete/${id}`), { method: 'DELETE' })
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err) { console.error(err) }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(apiUrl('/api/products/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity, 10)
        })
      })
      if (res.ok) {
        const added = await res.json()
        // Controller returns { message, product: ... }
        setProducts(prev => [...prev, added.product || added])
        setShowAddProduct(false)
        setNewProduct({ name: '', cat: 'Burgers', price: '', quantity: '', time: '15 min', description: '', img: '' })
      } else {
        alert("Failed to add product")
      }
    } catch (err) { console.error(err) }
  }

  const mgr_links = [
    { icon: '📊', label: 'Analytics', id: 'analytics' },
    { icon: '🍔', label: 'Menu Management', id: 'menu' },
    { icon: '📋', label: 'All Orders', id: 'orders' },
    { icon: '📅', label: 'Reservations', id: 'reservations' },
    { icon: '👥', label: 'Staff', id: 'staff' },
    { icon: '⚙️', label: 'Settings', id: 'settings' },
  ]

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
  const totalOrdersCount = orders.length
  const avgOrderValue = totalOrdersCount ? totalRevenue / totalOrdersCount : 0
  const lowStockCount = products.filter(p => p.quantity < 20).length

  // PIE_DATA
  const categorySales = {}
  orders.forEach(o => {
    o.items.forEach(item => {
      const product = products.find(p => p.name === item.name)
      const cat = product?.cat || 'Other'
      categorySales[cat] = (categorySales[cat] || 0) + item.quantity
    })
  })
  const totalItemsSold = Object.values(categorySales).reduce((a, b) => a + b, 0)
  const colors = ['#FF4D00', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
  const PIE_DATA = Object.entries(categorySales).map(([label, qty], i) => ({
    label,
    pct: totalItemsSold ? Math.round((qty / totalItemsSold) * 100) : 0,
    color: colors[i % colors.length]
  }))

  // BAR_DATA
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dailyCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 }
  orders.forEach(o => {
    const d = new Date(o.createdAt)
    dailyCounts[days[d.getDay()]] += 1
  })
  const BAR_DATA = days.map(day => ({ day, val: dailyCounts[day] }))
  const max = Math.max(...BAR_DATA.map(d => d.val), 1) // ensure max is at least 1

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar role="Manager" links={mgr_links} activeTab={tab} onTabChange={setTab} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, sub: 'Lifetime', icon: '💰', color: 'text-green-600' },
            { label: 'Total Orders', value: totalOrdersCount, sub: 'Lifetime', icon: '📦', color: 'text-blue-600' },
            { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, sub: 'Lifetime', icon: '📈', color: 'text-purple-600' },
            { label: 'Low Stock Items', value: lowStockCount, sub: 'Needs restock', icon: '⚠️', color: 'text-red-500' },
          ].map(({ label, value, sub, icon, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{icon}</span>
                <span className={`text-xs font-semibold ${color}`}>{sub}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          {[['analytics', '📊 Analytics'], ['menu', '🍔 Menu Management'], ['orders', '📋 All Orders'], ['reservations', '📅 Reservations'], ['staff', '👥 Staff']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${tab === k ? 'border-[#FF4D00] text-[#FF4D00]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Analytics tab */}
        {tab === 'analytics' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Bar chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-5">Daily Orders This Week</h3>
              <div className="flex items-end gap-3 h-40">
                {BAR_DATA.map(({ day, val }) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-gray-600">{val}</span>
                    <div className="w-full bg-[#FF4D00] rounded-t-lg transition-all" style={{ height: `${(val / max) * 120}px` }} />
                    <span className="text-xs text-gray-400">{day}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Pie chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-5">Sales by Category</h3>
              <svg viewBox="0 0 36 36" className="w-36 h-36 mx-auto -rotate-90">
                {PIE_DATA.map(({ pct, color, label }) => {
                  const stroke = (pct / 100) * 100
                  const offset = 100 - cumulPct
                  cumulPct += pct
                  return (
                    <circle key={label} cx="18" cy="18" r="15.9" fill="none" stroke={color}
                      strokeWidth="3.8" strokeDasharray={`${stroke} ${100 - stroke}`} strokeDashoffset={offset} />
                  )
                })}
              </svg>
              <div className="flex flex-col gap-2 mt-4">
                {PIE_DATA.map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <span className="text-gray-600">{label}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Menu Management tab */}
        {tab === 'menu' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-gray-900">Menu Items</h3>
              <button onClick={() => setShowAddProduct(true)} className="bg-[#FF4D00] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#e64400] transition-colors">+ Add Item</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">Name</th><th className="pb-3">Category</th><th className="pb-3">Price</th><th className="pb-3">Stock</th><th className="pb-3">Orders</th><th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-3 font-semibold text-gray-900 flex items-center gap-3">
                      {item.img && <img src={item.img} alt={item.name} className="w-8 h-8 rounded object-cover" />}
                      {item.name}
                    </td>
                    <td className="py-3 text-gray-500">{item.cat || 'Main'}</td>
                    <td className="py-3 text-[#FF4D00] font-semibold">LE {item.price}</td>
                    <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.quantity <= 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{item.quantity > 0 ? item.quantity + ' in stock' : 'Out of Stock'}</span></td>
                    <td className="py-3 text-gray-700">-</td>
                    <td className="py-3 flex gap-2">
                      <button onClick={() => handleDeleteProduct(item._id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* All Orders tab */}
        {tab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5">All Orders</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">ID</th><th className="pb-3">Customer</th><th className="pb-3">Items</th><th className="pb-3">Total</th><th className="pb-3">Status</th><th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="py-3 font-semibold text-gray-900">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 text-gray-700">{o.customer?.name || 'Guest'}</td>
                    <td className="py-3 text-gray-500 max-w-[160px] truncate">{o.items.map(i => i.name).join(', ')}</td>
                    <td className="py-3 font-semibold text-gray-900">LE {o.totalPrice.toFixed(2)}</td>
                    <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${ST[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span></td>
                    <td className="py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reservations tab */}
        {tab === 'reservations' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5">All Reservations</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">Name</th><th className="pb-3">Contact</th><th className="pb-3">Date & Time</th><th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="py-3 font-semibold text-gray-900">{r.name}</td>
                    <td className="py-3 text-gray-500">
                      <div>{r.email}</div>
                      <div className="text-xs">{r.phone}</div>
                    </td>
                    <td className="py-3 font-semibold text-gray-700">{r.date} <span className="text-gray-400 font-normal">at</span> {r.time}</td>
                    <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.status === 'approved' ? 'bg-green-100 text-green-700' : r.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span></td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr><td colSpan="4" className="py-4 text-center text-gray-500">No reservations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Staff / Users tab */}
        {tab === 'staff' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5">Staff & Users Management</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="py-3 font-semibold text-gray-900">{u.name}</td>
                    <td className="py-3 text-gray-500">{u.email}</td>
                    <td className="py-3">
                      <select
                        value={u.role || 'customer'}
                        onChange={e => handleRoleChange(u._id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-[#FF4D00] font-semibold text-gray-700"
                      >
                        <option value="customer">Customer</option>
                        <option value="service">Service</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="delivery">Delivery</option>
                        <option value="supplier">Supplier</option>
                        <option value="manager">Manager</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <button onClick={() => handleDeleteUser(u._id)} className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                  <input type="text" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#FF4D00]" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                    <select value={newProduct.cat} onChange={e => setNewProduct({ ...newProduct, cat: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#FF4D00]">
                      <option value="Burgers">Burgers</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Salads">Salads</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Steaks">Steaks</option>
                      <option value="Sushi">Sushi</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Soups">Soups</option>
                      <option value="Tacos">Tacos</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Prep Time</label>
                    <input type="text" placeholder="e.g. 15 min" required value={newProduct.time} onChange={e => setNewProduct({ ...newProduct, time: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#FF4D00]" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Price (LE)</label>
                    <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#FF4D00]" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Quantity (Stock)</label>
                    <input type="number" required value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#FF4D00]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                  <textarea required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#FF4D00]" rows="2"></textarea>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                  <input type="url" placeholder="https://..." required value={newProduct.img} onChange={e => setNewProduct({ ...newProduct, img: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#FF4D00]" />
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-bold rounded-lg text-gray-700">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-[#FF4D00] hover:bg-[#e64400] text-white font-bold rounded-lg transition-colors">Add Product</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
