import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { apiUrl } from '../lib/api'

const STATUS_STEPS = ['pending', 'cooking', 'ready', 'out_for_delivery', 'delivered']
const STATUS_LABELS = {
  'pending': 'Order Received',
  'cooking': 'Cooking',
  'ready': 'Ready for Delivery',
  'out_for_delivery': 'Out for Delivery',
  'delivered': 'Delivered'
}

export function OrderTrackingPage() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Extract ID from URL path: /track-order/12345
  const orderId = window.location.pathname.split('/').pop()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) throw new Error("Not logged in")

        // Fetch all customer orders and find this one
        const res = await fetch(apiUrl(`/api/orders/customer/${user.id || user._id}`))
        const orders = await res.json()

        let currentOrder;
        if (orderId && orderId !== 'track-order') {
          currentOrder = orders.find(o => o._id === orderId)
        } else {
          currentOrder = orders[orders.length - 1] // get most recent order
        }

        if (!currentOrder) throw new Error("No orders found to track")

        setOrder(currentOrder)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()

    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchOrder, 5000)
    return () => clearInterval(interval)
  }, [orderId])

  if (loading) return <div className="min-h-screen bg-[#F8FAFC] flex flex-col"><Navbar /><div className="flex-1 flex justify-center items-center">Loading...</div></div>
  if (error) return <div className="min-h-screen bg-[#F8FAFC] flex flex-col"><Navbar /><div className="flex-1 flex justify-center items-center text-red-500">{error}</div></div>

  const currentStepIndex = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500 mb-10">Order ID: #{order._id.slice(-6).toUpperCase()}</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full" />

            {/* Active Progress */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#FF4D00] -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${(Math.max(currentStepIndex, 0) / (STATUS_STEPS.length - 1)) * 100}%` }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, index) => {
                const isActive = index <= currentStepIndex
                const isCurrent = index === currentStepIndex
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors ${isActive ? 'bg-[#FF4D00] text-white shadow-lg shadow-orange-500/30' : 'bg-gray-200 text-gray-500'
                      }`}>
                      {index + 1}
                    </div>
                    <span className={`absolute mt-10 text-xs font-semibold whitespace-nowrap ${isCurrent ? 'text-[#FF4D00]' : isActive ? 'text-gray-800' : 'text-gray-400'
                      }`}>
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold mb-4">Order Details</h2>
          <div className="flex flex-col gap-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-semibold">LE {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-[#FF4D00]">LE {order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
