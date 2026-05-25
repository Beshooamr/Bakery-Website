import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { apiUrl } from '../lib/api'

const DC = {
  'ready': 'bg-yellow-100 text-yellow-700',
  'out_for_delivery': 'bg-purple-100 text-purple-700',
  'delivered': 'bg-green-100 text-green-700'
}
const DN = { 'ready': 'Pick Up Order', 'out_for_delivery': 'Mark Delivered' }

export function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('deliveries')

  const del_links = [
    { icon: '🚗', label: 'My Deliveries', id: 'deliveries' },
    { icon: '✅', label: 'History', id: 'history' },
    { icon: '⚙️', label: 'Settings', id: 'settings' },
  ]

  const fetchDeliveries = () => {
    fetch(apiUrl('/api/orders/all'))
      .then(res => res.json())
      .then(data => {
        // Show ready and out_for_delivery
        setDeliveries(Array.isArray(data) ? data.filter(d => ['ready', 'out_for_delivery'].includes(d.status)) : [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.role !== 'delivery') {
      window.location.href = '/login'
      return
    }

    fetchDeliveries()
    const interval = setInterval(fetchDeliveries, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  const advance = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ready' ? 'out_for_delivery' : 'delivered'

    // Optimistic UI update
    setDeliveries(prev => prev.map(d => d._id === id ? { ...d, status: nextStatus } : d).filter(d => d.status !== 'delivered'))

    try {
      await fetch(apiUrl(`/api/orders/update/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
    } catch (err) {
      console.error(err)
      fetchDeliveries() // Revert on failure
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar role="Delivery" links={del_links} activeTab={tab} onTabChange={setTab} />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Active Deliveries</h1>
        <p className="text-gray-500 text-sm mb-6">{deliveries.length} orders pending delivery</p>

        {deliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <span className="text-5xl mb-4">🚗</span>
            <p className="text-lg font-semibold">No deliveries right now!</p>
            <p className="text-sm">Wait for the kitchen to finish cooking orders.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {deliveries.map(d => (
              <div key={d._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-gray-900">#{d._id.slice(-6).toUpperCase()}</p>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-semibold uppercase ${DC[d.status]}`}>{d.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">👤 {d.customer?.name || 'Guest'}</p>
                  <p className="text-sm text-gray-500 mb-1">📍 {d.deliveryAddress || 'No Address Provided'}</p>
                  <p className="text-sm text-gray-500">🍔 {d.items?.length} items · <span className="font-semibold text-gray-700">LE {d.totalPrice?.toFixed(2)}</span></p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button onClick={() => advance(d._id, d.status)}
                    className="bg-[#FF4D00] hover:bg-[#e64400] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
                    {DN[d.status]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
