import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { apiUrl } from '../lib/api'

export function SupplierDashboard() {
  const [items, setItems] = useState([])
  const [tab, setTab] = useState('inventory')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user || user.role !== 'supplier') {
      window.location.href = '/login'
      return
    }

    fetch(apiUrl('/api/products/get'))
      .then(res => res.json())
      .then(data => {
        const formatted = (data.data || []).map(p => ({
          ...p,
          unit: 'units',
          supplier: 'Default Supplier',
          min: 20
        }))
        setItems(formatted)
      })
      .catch(console.error)
  }, [])

  const restock = async (id) => {
    const item = items.find(i => i._id === id);
    if (!item) return;
    const newQty = item.quantity + 50;
    try {
      await fetch(apiUrl(`/api/products/update/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.name, description: item.description, price: item.price, quantity: newQty })
      });
      setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: newQty } : i));
    } catch (err) {
      console.error(err);
    }
  }

  const sup_links = [
    { icon: '📦', label: 'Inventory', id: 'inventory' },
    { icon: '🛒', label: 'Purchase Orders', id: 'orders' },
    { icon: '📊', label: 'Reports', id: 'reports' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar role="Supplier" links={sup_links} activeTab={tab} onTabChange={setTab} />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <div className="flex gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
            <span className="font-bold text-red-600">{items.filter(i => i.quantity < i.min).length}</span>
            <span className="text-red-500 ml-1">items low on stock</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Item</th><th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => {
                const low = item.quantity < item.min
                const pct = Math.min((item.quantity / (item.min * 3)) * 100, 100)
                return (
                  <tr key={item._id} className={`hover:bg-gray-50 ${low ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-500">{item.supplier}</td>
                    <td className="px-6 py-4 text-gray-700">LE {item.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${low ? 'bg-red-400' : 'bg-green-400'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-medium text-gray-700">{item.quantity} {item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${low ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {low ? '⚠ Low Stock' : '✓ OK'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {low && (
                        <button onClick={() => restock(item._id)}
                          className="bg-[#FF4D00] hover:bg-[#e64400] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors">
                          Restock
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
