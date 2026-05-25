import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { apiUrl } from '../lib/api'

export function CheckoutPage() {
  const [cart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tb_cart') || '{}')
    } catch {
      return {}
    }
  })
  const [address, setAddress] = useState('')
  const [instructions, setInstructions] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showVisaForm, setShowVisaForm] = useState(false)
  const [visaDetails, setVisaDetails] = useState({ card: '', expiry: '', cvv: '' })

  const items = Object.values(cart)
  const total = items.reduce((a, b) => a + b.price * b.qty, 0)
  const finalTotal = total + 2.99 + total * 0.1

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (paymentMethod === 'visa' && !showVisaForm) {
      setShowVisaForm(true)
      return
    }

    setError('')
    setLoading(true)

    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      window.location.href = '/login'
      return
    }

    try {
      const response = await fetch(apiUrl('/api/orders/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: user.id || user._id, // Handle both id formats
          items: items.map(i => ({ product: i._id || i.id, name: i.name, quantity: i.qty, price: i.price })),
          totalPrice: finalTotal,
          deliveryAddress: address,
          specialInstructions: instructions,
          paymentMethod
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Checkout failed')

      // Clear cart
      localStorage.removeItem('tb_cart')

      // Navigate to tracking
      window.location.href = `/track-order/${data.order._id}`
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <h1 className="text-2xl font-bold mb-2">Cart is Empty</h1>
          <p className="text-gray-500 mb-6">Please add items to your cart first.</p>
          <a href="/menu" className="bg-[#FF4D00] text-white px-8 py-3 rounded-full font-bold">Go to Menu</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && <div className="mb-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold">Delivery Details</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Delivery Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main St, Apt 4B"
              className="bg-gray-100 rounded-xl px-4 py-3 border-0 outline-none focus:ring-2 focus:ring-[#FF4D00]/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Special Instructions (Optional)</label>
            <input
              type="text"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="E.g., Leave at the front door"
              className="bg-gray-100 rounded-xl px-4 py-3 border-0 outline-none focus:ring-2 focus:ring-[#FF4D00]/30"
            />
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <label className="text-sm font-semibold text-gray-700">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-[#FF4D00] bg-orange-50 ring-1 ring-[#FF4D00]' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-4 h-4 text-[#FF4D00] focus:ring-[#FF4D00]" />
                <span className="font-bold text-gray-900">💵 Cash on Delivery</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'visa' ? 'border-[#FF4D00] bg-orange-50 ring-1 ring-[#FF4D00]' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="visa" checked={paymentMethod === 'visa'} onChange={() => setPaymentMethod('visa')} className="w-4 h-4 text-[#FF4D00] focus:ring-[#FF4D00]" />
                <span className="font-bold text-gray-900">💳 Visa / Mastercard</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-2">
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total to Pay:</span>
              <span className="text-[#FF4D00]">LE {finalTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4D00] hover:bg-[#e64400] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>

        {showVisaForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Enter Visa Details</h3>
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                  <input type="text" placeholder="1234 5678 9101 1121" required value={visaDetails.card} onChange={e => setVisaDetails({ ...visaDetails, card: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-[#FF4D00]/30" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" required value={visaDetails.expiry} onChange={e => setVisaDetails({ ...visaDetails, expiry: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-[#FF4D00]/30" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">CVV</label>
                    <input type="text" placeholder="123" required value={visaDetails.cvv} onChange={e => setVisaDetails({ ...visaDetails, cvv: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-[#FF4D00]/30" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowVisaForm(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 transition-colors font-bold rounded-xl text-gray-700">Cancel</button>
                <button type="button" onClick={handleSubmit} disabled={!visaDetails.card || !visaDetails.expiry || !visaDetails.cvv} className="flex-1 py-3 bg-[#FF4D00] hover:bg-[#e64400] disabled:opacity-50 text-white font-bold rounded-xl transition-colors">Confirm & Pay</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
