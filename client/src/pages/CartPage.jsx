import { useState } from 'react'
import { Navbar } from '../components/Navbar'

export function CartPage() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tb_cart') || '{}') } catch { return {} }
  })
  const [fulfillmentType, setFulfillmentType] = useState('delivery')

  const items = Object.values(cart)
  const total = items.reduce((a, b) => a + b.price * b.qty, 0)
  const deliveryFee = fulfillmentType === 'delivery' ? 25 : 0
  const serviceFee = total * 0.05

  const updateQty = (id, delta) => {
    setCart(prev => {
      const next = { ...prev }
      if (!next[id]) return prev
      if (delta > 0 && next[id].qty >= next[id].quantity) return prev
      next[id] = { ...next[id], qty: next[id].qty + delta }
      if (next[id].qty <= 0) delete next[id]
      localStorage.setItem('tb_cart', JSON.stringify(next))
      return next
    })
  }

  const clearCart = () => { setCart({}); localStorage.removeItem('tb_cart') }

  /* ── Empty state ── */
  if (items.length === 0) return (
    <div className="min-h-screen bg-crave-cream flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-24 h-24 bg-crave-pistachio/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-crave-cocoa/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8M7 13l-1-5m11 5l1.6 8M17 13l1-5M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-crave-cocoa mb-2 font-display">Your cart is empty</h1>
        <p className="text-crave-cocoa/60 mb-8">Add some delicious Crave Better treats to get started!</p>
        <a href="/menu" className="bg-crave-cocoa hover:bg-crave-blush text-white font-semibold px-10 py-3 rounded-full transition-colors">Browse Menu</a>
      </div>
    </div>
  )

  /* ── Cart with items ── */
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 w-full">
        <h1 className="text-3xl font-bold text-crave-cocoa mb-8 font-display">Your Cart</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {items.map(item => {
              const itemId = item._id || item.id
              const atStockLimit = item.qty >= item.quantity
              return (
                <div key={itemId} className="bg-white rounded-2xl shadow-md border-2 border-crave-cream p-5 flex gap-4">
                  <img src={item.img} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-crave-cocoa mb-1 font-display">{item.name}</h3>
                    <p className="text-crave-blush font-semibold">LE {Math.floor(item.price)}</p>
                    <p className="text-xs text-crave-cocoa/50 mt-1">{item.quantity} in stock</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-bold text-crave-cocoa">LE {Math.floor(item.price * item.qty)}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(itemId, -1)} className="w-7 h-7 rounded-full bg-crave-pistachio/20 hover:bg-crave-caramel/20 flex items-center justify-center text-crave-cocoa font-bold text-lg transition-colors">−</button>
                      <span className="w-6 text-center font-semibold text-crave-cocoa">{item.qty}</span>
                      <button onClick={() => updateQty(itemId, 1)} disabled={atStockLimit} className="w-7 h-7 rounded-full bg-crave-cocoa hover:bg-crave-blush disabled:bg-crave-cocoa/40 flex items-center justify-center text-white font-bold text-lg transition-colors">+</button>
                    </div>
                  </div>
                </div>
              )
            })}
            <button onClick={clearCart} className="text-sm text-crave-blush hover:text-crave-cocoa font-medium transition-colors mt-2 text-left">🗑 Clear cart</button>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-crave-cream p-6 h-fit">
            <h2 className="text-lg font-bold text-crave-cocoa mb-5 font-display">Order Summary</h2>

            {/* Fulfillment Type Selection */}
            <div className="mb-6 pb-6 border-b-2 border-crave-cream">
              <p className="text-sm font-bold text-crave-cocoa mb-3">Fulfillment:</p>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-crave-cream/50 transition-colors">
                  <input type="radio" name="fulfillment" value="delivery" checked={fulfillmentType === 'delivery'} onChange={(e) => setFulfillmentType(e.target.value)} className="w-4 h-4" />
                  <span className="text-sm font-semibold text-crave-cocoa">🚚 Delivery</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-crave-cream/50 transition-colors">
                  <input type="radio" name="fulfillment" value="pickup" checked={fulfillmentType === 'pickup'} onChange={(e) => setFulfillmentType(e.target.value)} className="w-4 h-4" />
                  <span className="text-sm font-semibold text-crave-cocoa">🏪 Pickup</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-crave-cocoa/70"><span>Subtotal</span><span>LE {Math.floor(total)}</span></div>
              {fulfillmentType === 'delivery' && (
                <div className="flex justify-between text-crave-cocoa/70"><span>Delivery fee</span><span>LE 25</span></div>
              )}
              <div className="flex justify-between text-crave-cocoa/70"><span>Service Fee (5%)</span><span>LE {serviceFee.toFixed(2)}</span></div>
              <div className="h-px bg-crave-cream my-1" />
              <div className="flex justify-between font-bold text-crave-cocoa text-base">
                <span>Total</span><span>LE {(total + deliveryFee + serviceFee).toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => window.location.href = '/checkout'} className="w-full bg-crave-cocoa hover:bg-crave-blush text-white font-semibold py-3 rounded-xl mt-6 transition-colors">
              Proceed to Checkout
            </button>
            <a href="/menu" className="block text-center text-sm text-crave-cocoa/50 hover:text-crave-cocoa/70 mt-3 transition-colors">← Continue Shopping</a>
          </div>
        </div>
      </div>
    </div>
  )
}
