import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { apiUrl } from '../lib/api'

const CATS = ['All', 'Brownies', 'Cookies', 'Cupcakes']

export function MenuPage() {
  const [cat, setCat] = useState('All')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tb_cart') || '{}') } catch { return {} }
  })

  useEffect(() => {
    fetch(apiUrl('/api/products/get'))
      .then(res => res.json())
      .then(data => setItems(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const addToCart = item => {
    const itemId = item._id || item.id
    if (!itemId || item.quantity <= 0) return
    const currentQty = cart[itemId]?.qty || 0
    if (currentQty >= item.quantity) return
    const next = { ...cart, [itemId]: { ...item, qty: (cart[itemId]?.qty || 0) + 1 } }
    setCart(next)
    localStorage.setItem('tb_cart', JSON.stringify(next))
  }

  // Database products might not have cat, we treat them as 'All' unless specified
  const filtered = cat === 'All' ? items : items.filter(i => (i.cat || 'All') === cat)
  const totalQty = Object.values(cart).reduce((a, b) => a + (b.qty || 0), 0)

  return (
    <div className="min-h-screen bg-crave-cream">
      <Navbar activePath="/menu" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-crave-cream via-white to-crave-lavender/20 py-12 text-center border-b-2 border-crave-caramel">
        <h1 className="text-4xl font-bold text-crave-cocoa mb-3 font-display">Our Delicious Collection</h1>
        <p className="text-crave-cocoa/60 max-w-xl mx-auto text-sm">Handcrafted healthy bakery treats. Every bite is guilt-free indulgence.</p>
      </section>

      {/* Category pills */}
      <div className="sticky top-16 z-40 bg-crave-cream border-b-2 border-crave-caramel shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2 overflow-x-auto">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${cat === c ? 'bg-crave-cocoa text-white shadow-md' : 'bg-crave-pistachio/20 text-crave-cocoa hover:bg-crave-caramel/20'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-sm text-crave-cocoa/60 mb-6">{filtered.length} item{filtered.length !== 1 ? 's' : ''} {cat !== 'All' ? `in ${cat}` : ''}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p className="col-span-full text-center text-crave-cocoa/60">Loading products...</p>}
          {!loading && filtered.length === 0 && <p className="col-span-full text-center text-crave-cocoa/60">No products found.</p>}
          {filtered.map(item => {
            const itemId = item._id || item.id
            const qty = cart[itemId]?.qty || 0
            const isOutOfStock = item.quantity <= 0
            return (
              <div key={itemId} className="bg-white border-2 border-crave-cream rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 group">
                <div className="relative h-48 overflow-hidden bg-crave-cream">
                  <img src={item.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-crave-cocoa text-crave-cream text-xs font-bold px-3 py-1 rounded-full shadow">{item.cat || 'Bakery'}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-crave-cocoa text-lg leading-tight font-display">{item.name}</h3>
                    <span className="text-crave-blush font-bold text-lg shrink-0">LE {Math.floor(item.price)}</span>
                  </div>
                  <p className="text-crave-cocoa/60 text-sm mb-3 leading-relaxed">{item.description || item.desc}</p>

                  <div className="flex items-center justify-end pt-3 border-t border-crave-cream">
                    {isOutOfStock ? (
                      <span className="bg-crave-blush/20 text-crave-cocoa px-4 py-2 rounded-full text-sm font-bold">Out of Stock</span>
                    ) : (
                      <button onClick={() => addToCart(item)}
                        disabled={qty >= item.quantity}
                        className="bg-crave-cocoa hover:bg-crave-blush disabled:bg-crave-cocoa/40 active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all">
                        {qty >= item.quantity ? 'Max in Cart' : qty > 0 ? `Added (${qty})` : '+ Add'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating cart */}
      {totalQty > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 pointer-events-none">
          <a href="/cart" className="pointer-events-auto bg-crave-cocoa hover:bg-crave-blush text-white font-bold px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105">
            🛒 View Cart · {totalQty} item{totalQty > 1 ? 's' : ''}
          </a>
        </div>
      )}
    </div>
  )
}
