import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { apiUrl } from '../lib/api'

const ST_COLOR = {
  'pending': 'bg-yellow-100 text-yellow-700',
  'cooking': 'bg-blue-100 text-blue-700',
  'ready': 'bg-green-100 text-green-700'
}
const NEXT = { 'pending': 'Start Cooking', 'cooking': 'Mark Ready' }

export function KitchenDashboard() {
  const [orders, setOrders] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('queue')

  const kit_links = [
    { icon: '🍳', label: 'Order Queue', id: 'queue' },
    { icon: '✅', label: 'Completed', id: 'completed' },
    { icon: '📅', label: 'Reservations', id: 'reservations' },
    { icon: '⚙️', label: 'Settings', id: 'settings' },
  ]

  const fetchOrders = () => {
    Promise.all([
      fetch(apiUrl('/api/orders/all')).then(r => r.json()),
      fetch(apiUrl('/api/reservations/all')).then(r => r.json())
    ]).then(([ordersData, resData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData.filter(o => ['pending', 'cooking'].includes(o.status)) : [])
      setReservations(Array.isArray(resData) ? resData : [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.role !== 'kitchen') {
      window.location.href = '/login'
      return
    }

    fetchOrders()
    const interval = setInterval(fetchOrders, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  const advance = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'cooking' : 'ready'

    // Optimistic UI update
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: nextStatus } : o).filter(o => o.status !== 'ready'))

    try {
      await fetch(apiUrl(`/api/orders/update/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
    } catch (err) {
      console.error(err)
      fetchOrders() // Revert on failure
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar role="Kitchen" links={kit_links} activeTab={tab} onTabChange={setTab} />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Queue</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} active order{orders.length !== 1 ? 's' : ''}</p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <span className="text-5xl mb-4">✅</span>
            <p className="text-lg font-semibold">All orders complete!</p>
            <p className="text-sm">Waiting for new incoming orders...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {orders.map(o => (
              <div key={o._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">#{o._id.slice(-6).toUpperCase()}</p>
                    <p className="text-gray-500 text-sm">{new Date(o.createdAt).toLocaleTimeString()} {o.specialInstructions && `· ⚠️ ${o.specialInstructions}`}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${ST_COLOR[o.status]}`}>{o.status}</span>
                </div>
                <ul className="text-sm text-gray-700 mb-5 space-y-1">
                  {o.items?.map((item, idx) => <li key={idx} className="flex items-center gap-2 font-medium">• {item.quantity}x {item.name}</li>)}
                </ul>
                <button onClick={() => advance(o._id, o.status)}
                  className={`w-full font-semibold py-2.5 rounded-xl text-sm transition-all ${o.status === 'cooking' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-[#FF4D00] hover:bg-[#e64400] text-white'}`}>
                  {NEXT[o.status]}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'reservations' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="font-bold text-gray-900 mb-5">Upcoming Reservations</h3>
            <p className="text-sm text-gray-500 mb-4">Prepare for large parties by monitoring upcoming bookings.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">Name</th><th className="pb-3">Date</th><th className="pb-3">Time</th><th className="pb-3">Special Requests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="py-3 font-semibold text-gray-900">{r.name}</td>
                    <td className="py-3 text-gray-700">{r.date}</td>
                    <td className="py-3 font-bold text-gray-900">{r.time}</td>
                    <td className="py-3 text-gray-500 italic">{r.specialRequests || 'None'}</td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr><td colSpan="4" className="py-4 text-center text-gray-500">No upcoming reservations.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
