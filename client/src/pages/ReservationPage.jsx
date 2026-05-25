import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { apiUrl } from '../lib/api'

const TIMES = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']

export function PickupPage() {
  const [form, setForm] = useState({ date: '', time: '', name: '', email: '', phone: '', notes: '' })
  const [alternatePhone, setAlternatePhone] = useState('')
  const [showAlternate, setShowAlternate] = useState(false)
  const [selectedItems, setSelectedItems] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [productsLoading, setProductsLoading] = useState(true)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  useEffect(() => {
    // Get logged-in user data
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.name || user.email || user.phone) {
      setForm(p => ({
        ...p,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }))
    }

    // Fetch products
    fetch(apiUrl('/api/products/get'))
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || [])
        setProductsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setProductsLoading(false)
      })
  }, [])

  const addItem = (itemId) => {
    setSelectedItems(p => ({
      ...p,
      [itemId]: (p[itemId] || 0) + 1
    }))
  }

  const removeItem = (itemId) => {
    setSelectedItems(p => {
      const newItems = { ...p }
      if (newItems[itemId] > 1) {
        newItems[itemId]--
      } else {
        delete newItems[itemId]
      }
      return newItems
    })
  }

  const selectedProducts = Object.entries(selectedItems).map(([id, qty]) => {
    const prod = products.find(p => p._id === id || p.id === id)
    return prod ? { ...prod, qty } : null
  }).filter(Boolean)

  const totalItems = Object.values(selectedItems).reduce((a, b) => a + b, 0)

  const submit = async e => {
    e.preventDefault()
    if (totalItems === 0) {
      alert('Please select at least one item')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(apiUrl('/api/reservations/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          time: form.time,
          partySize: totalItems,
          specialRequests: form.notes
        })
      })
      if (res.ok) {
        setDone(true)
      } else {
        alert("Failed to submit reservation")
      }
    } catch (err) {
      console.error(err)
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar activePath="/pickup" />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pick-up Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">{form.date} at {form.time}</p>
        <p className="text-gray-400 text-sm mb-8">We'll send a confirmation to {form.email}</p>
        <a href="/" className="bg-[#FF4D00] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#e64400] transition-colors">Back to Home</a>
      </div>
    </div>
  )

  const inputCls = "w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 border-0 outline-none focus:ring-2 focus:ring-[#FF4D00]/30 focus:bg-white transition-all"

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isLoggedIn = !!user.name

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar activePath="/pickup" />
      <div className="max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Reserve Pick-up Order</h1>
          <p className="text-gray-500">Select your items and schedule pickup</p>
        </div>

        <form onSubmit={submit} className="grid md:grid-cols-3 gap-6">
          {/* Items Selection */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Items</h2>

              {productsLoading ? (
                <p className="text-gray-500">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-gray-500">No products available</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map(product => {
                    const itemId = product._id || product.id
                    const qty = selectedItems[itemId] || 0
                    return (
                      <div key={itemId} className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${qty > 0 ? 'border-[#FF4D00] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <img src={product.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} alt={product.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">LE {product.price}</p>
                        <div className="flex gap-2 items-center">
                          <button type="button" onClick={() => removeItem(itemId)} className="flex-1 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-600" disabled={qty === 0}>-</button>
                          <span className="flex-1 text-center font-bold">{qty}</span>
                          <button type="button" onClick={() => addItem(itemId)} className="flex-1 py-1 text-sm bg-[#FF4D00] hover:bg-[#e64400] text-white rounded">+</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {totalItems === 0 ? (
                <p className="text-gray-500 text-sm mb-6">No items selected</p>
              ) : (
                <div className="mb-6 space-y-2 max-h-40 overflow-y-auto">
                  {selectedProducts.map(p => (
                    <div key={p._id || p.id} className="flex justify-between text-sm text-gray-600">
                      <span>{p.name} x{p.qty}</span>
                      <span className="font-semibold">LE {(p.price * p.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total Items:</span>
                  <span className="text-[#FF4D00]">{totalItems}</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Date</label>
                  <input type="date" value={form.date} onChange={set('date')} required min={new Date().toISOString().split('T')[0]} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Time</label>
                  <select value={form.time} onChange={set('time')} required className={inputCls + ' cursor-pointer'}>
                    <option value="">Select time</option>
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Name</label>
                  <input type="text" placeholder="John Doe" value={form.name} onChange={set('name')} required readOnly={isLoggedIn} className={inputCls + (isLoggedIn ? ' bg-gray-50 cursor-not-allowed' : '')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required readOnly={isLoggedIn} className={inputCls + (isLoggedIn ? ' bg-gray-50 cursor-not-allowed' : '')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <div className="flex gap-2">
                    <input type="tel" placeholder="+20..." value={form.phone} onChange={isLoggedIn ? () => { } : set('phone')} readOnly={isLoggedIn} className={inputCls + (isLoggedIn ? ' bg-gray-50 cursor-not-allowed' : '')} />
                    <button type="button" onClick={() => setShowAlternate(!showAlternate)} className="px-3 py-2 bg-[#FF4D00] hover:bg-[#e64400] text-white font-bold rounded-xl transition-all">
                      {showAlternate ? '−' : '+'}
                    </button>
                  </div>
                </div>
                {showAlternate && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Alternate Phone</label>
                    <div className="flex gap-2">
                      <input type="tel" placeholder="+20..." value={alternatePhone} onChange={e => setAlternatePhone(e.target.value)} className={inputCls} />
                      <button type="button" onClick={() => { setShowAlternate(false); setAlternatePhone(''); }} className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all">
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Notes</label>
                  <textarea rows={2} placeholder="Special requests..." value={form.notes} onChange={set('notes')} className={inputCls + ' resize-none text-xs'} />
                </div>

                <button type="submit" disabled={loading || totalItems === 0}
                  className="w-full bg-[#FF4D00] hover:bg-[#e64400] text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50">
                  {loading ? 'Confirming…' : 'Reserve Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
