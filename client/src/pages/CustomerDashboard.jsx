import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { apiUrl } from '../lib/api'

const STATUS_COLOR = {
  'delivered': 'bg-green-100 text-green-700',
  'pending': 'bg-yellow-100 text-yellow-700',
  'cancelled': 'bg-red-100 text-red-700',
  'cooking': 'bg-orange-100 text-orange-700',
  'ready': 'bg-blue-100 text-blue-700',
  'out_for_delivery': 'bg-indigo-100 text-indigo-700'
}

export function CustomerDashboard() {
  const [orders, setOrders] = useState([])
  const [reservations, setReservations] = useState([])
  const [user] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(apiUrl(`/api/orders/customer/${user.id || user._id}`)).then(res => res.json()),
        fetch(apiUrl(`/api/reservations/customer/${user.id || user._id}`)).then(res => res.json())
      ])
        .then(([ordersData, resData]) => {
          setOrders(Array.isArray(ordersData) ? ordersData : [])
          setReservations(Array.isArray(resData) ? resData : [])
        })
        .catch(console.error)
        .finally(() => setLoading(false))

    } else {
      window.location.href = '/login'
    }
  }, [user])

  if (loading) return <div className="min-h-screen bg-[#F8FAFC] flex flex-col"><Navbar /><div className="flex-1 flex justify-center items-center">Loading...</div></div>

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}! Here's your activity overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦' },
            { label: 'Total Spent', value: `LE ${totalSpent.toFixed(2)}`, icon: '💳' },
            { label: 'Reservations', value: reservations.length, icon: '📅' },
            { label: 'Loyalty Points', value: Math.floor(totalSpent * 10), icon: '⭐' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <span className="text-2xl">{icon}</span>
              <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <a href="/menu" className="text-sm text-[#FF4D00] font-semibold hover:underline">+ New Order</a>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center text-gray-400">
              <span className="text-4xl mb-3">🍔</span>
              <p className="font-medium text-gray-600">No orders yet</p>
              <p className="text-sm mt-1 mb-4">You haven't placed any orders. Hungry?</p>
              <a href="/menu" className="text-sm bg-[#FF4D00] text-white px-5 py-2 rounded-full font-bold">Browse Menu</a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3">Order ID</th><th className="pb-3">Date</th><th className="pb-3">Items</th><th className="pb-3">Total</th><th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice().reverse().map(o => (
                    <tr key={o._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href = `/track-order/${o._id}`}>
                      <td className="py-3 font-semibold text-[#FF4D00]">#{o._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 text-gray-700 max-w-[200px] truncate">{o.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                      <td className="py-3 font-semibold text-gray-900">${o.totalPrice?.toFixed(2)}</td>
                      <td className="py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status.replace('_', ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reservations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">My Reservations</h2>
            <a href="/reservations" className="text-sm text-[#FF4D00] font-semibold hover:underline">+ New Reservation</a>
          </div>

          {reservations.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center text-gray-400">
              <span className="text-4xl mb-3">📅</span>
              <p className="font-medium text-gray-600">No upcoming reservations</p>
              <p className="text-sm mt-1">Book a table for a special experience</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3">Date</th><th className="pb-3">Time</th><th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reservations.slice().reverse().map(r => (
                    <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-semibold text-gray-900">{r.date}</td>
                      <td className="py-3 text-gray-500">{r.time}</td>
                      <td className="py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${r.status === 'approved' ? 'bg-green-100 text-green-700' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
