import { useState, useEffect } from 'react'

/* ─────────────────────────────────────────
   Button Component
───────────────────────────────────────── */
const Btn = ({ to, variant = 'primary', size = 'md', className = '', children, onClick }) => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 active:scale-95 cursor-pointer select-none'

  const variants = {
    primary: 'bg-crave-cocoa text-white hover:bg-crave-blush shadow-md hover:shadow-lg',
    outline: 'border-2 border-crave-cocoa text-crave-cocoa hover:bg-crave-cream',
    ghost: 'text-crave-cocoa hover:bg-crave-cream',
    secondary: 'bg-crave-pistachio text-white hover:bg-crave-caramel shadow-md hover:shadow-lg',
  }

  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-7 py-2.5 text-sm',
    lg: 'px-10 py-4 text-base',
  }

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (to) return <a href={to} className={cls}>{children}</a>
  return <button className={cls} onClick={onClick}>{children}</button>
}

/* ─────────────────────────────────────────
   Health Badge Component
───────────────────────────────────────── */
function HealthBadge({ icon, label, color }) {
  const colors = {
    pistachio: 'bg-crave-pistachio/20 text-crave-cocoa',
    caramel: 'bg-crave-caramel/20 text-crave-cocoa',
    lavender: 'bg-crave-lavender/20 text-crave-cocoa',
    blush: 'bg-crave-blush/20 text-crave-cocoa',
  }

  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-full ${colors[color]} hover:shadow-md transition-all`}>
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-bold text-center">{label}</span>
    </div>
  )
}

/* ─────────────────────────────────────────
   Navbar
───────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const linkCls = scrolled
    ? 'text-crave-cocoa hover:text-crave-blush'
    : 'text-crave-cocoa hover:text-crave-blush'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-crave-cream/95 backdrop-blur'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-crave-cocoa font-display tracking-tight shrink-0 flex items-center gap-2">
          <img src="/images/logo.png" alt="Crave Better" className="h-12" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {(() => {
            const links = [['Menu', '/menu'], ['Pick-up Orders', '/reservations']]
            if (user) links.push(['Orders', '/customer/dashboard'])
            return links.map(([label, href]) => (
              <a key={label} href={href} className={`text-sm font-medium transition-colors ${linkCls}`}>
                {label}
              </a>
            ))
          })()}
        </nav>

        {/* Right: Login/User */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-semibold text-crave-cocoa">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-xs font-semibold text-crave-blush hover:text-crave-cocoa transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Btn to="/login" variant="primary" size="sm" className="hidden md:inline-flex">
              Login
            </Btn>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className={`md:hidden flex flex-col gap-1 p-2 rounded-lg transition-colors text-crave-cocoa hover:bg-crave-blush/10`}
          >
            <span className="block w-5 h-0.5 bg-current rounded-full" />
            <span className="block w-5 h-0.5 bg-current rounded-full" />
            <span className="block w-3.5 h-0.5 bg-current rounded-full" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-crave-cream border-t-2 border-crave-caramel shadow-xl px-6 py-5 flex flex-col gap-3">
          {(() => {
            const links = [['Home', '/'], ['Menu', '/menu'], ['Pick-up Orders', '/reservations']]
            if (user) links.push(['Orders', '/customer/dashboard'])
            return links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-crave-cocoa font-medium py-2 border-b border-crave-caramel/30 hover:text-crave-blush transition-colors"
              >
                {label}
              </a>
            ))
          })()}
          {user ? (
            <>
              <span className="text-crave-cocoa font-bold py-1 border-t pt-3 mt-1">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-crave-blush font-semibold text-left py-1">
                Logout
              </button>
            </>
          ) : (
            <Btn to="/login" variant="primary" size="md" className="mt-2 w-full justify-center">
              Login
            </Btn>
          )}
        </div>
      )}
    </header>
  )
}

/* ─────────────────────────────────────────
   Hero Section
───────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative pt-32 pb-24 bg-gradient-to-br from-crave-cream via-white to-crave-lavender/20 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-crave-pistachio/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-crave-caramel/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-crave-cocoa leading-tight mb-6 font-display">
              Crave Better, Choose Better
            </h1>

            <p className="text-lg text-crave-cocoa/70 leading-relaxed mb-8 max-w-lg">
              Indulge guilt-free with our delicious, healthy baked goods. Made with love, natural ingredients, and zero compromises on taste.
            </p>

            <div className="flex flex-wrap gap-4">
              <Btn to="/menu" variant="primary" size="lg">
                🛒 Order Now
              </Btn>
              <Btn to="/reservations" variant="outline" size="lg">
                📦 Pick-up Orders
              </Btn>
            </div>

            {/* Trust badges */}
            <div className="flex gap-6 mt-10 text-sm text-crave-cocoa/60">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥗</span>
                <span className="font-semibold">100% Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-semibold">Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="hidden md:block relative">
            <div className="relative h-96 bg-gradient-to-br from-crave-blush/20 to-crave-pistachio/20 rounded-3xl overflow-hidden">
              <img
                src="/images/MAIN.jpg"
                alt="Crave Better Bakery"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Health Badges Section
───────────────────────────────────────── */
const HEALTH_BADGES = [
  { icon: '🌱', label: 'Plant Based', color: 'pistachio' },
  { icon: '🌾', label: 'Gluten Free', color: 'caramel' },
  { icon: '🍯', label: 'No Refined Sugar', color: 'lavender' },
  { icon: '😊', label: 'Guilt Free', color: 'blush' },
]

function HealthBadgesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-crave-cocoa mb-4 font-display">
          Our Story
        </h2>
        <p className="text-center text-crave-cocoa/60 mb-12 max-w-2xl mx-auto">
          Crave Better began with five girls who believed that the food you crave should also be the food you trust. We created a brand built on honest ingredients, real flavor, and desserts that feel good to enjoy without hidden additives or complicated labels. From fresh products to fast delivery, every part of Crave Better was designed to give people a simpler and better way to crave what they love.
        </p>

        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HEALTH_BADGES.map(({ icon, label, color }) => (
              <HealthBadge key={label} icon={icon} label={label} color={color} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Featured Products
───────────────────────────────────────── */
const FEATURED_PRODUCTS = [
  {
    name: 'Brownie Balls',
    image: '/images/brownie-balls.jpg',
    price: 'LE 100',
    desc: 'Rich, fudgy brownie balls with dark chocolate chips.',
  },
  {
    name: 'Chocolate Cookies',
    image: '/images/chocolate-cookies.jpg',
    price: 'LE 75',
    desc: 'Crispy yet chewy cookies with whole grain flour.',
  },
  {
    name: 'Salty Cupcakes',
    image: '/images/salty-cupcakes.jpg',
    price: 'LE 95',
    desc: 'Savory-sweet with perfect balance and sea salt.',
  },
  {
    name: 'Oatmeal Apple Cupcakes',
    image: '/images/oatmeal-apple-cupcakes.jpg',
    price: 'LE 90',
    desc: 'Wholesome with fresh apples and hearty oatmeal.',
  },
]

function FeaturedProducts() {
  return (
    <section className="py-20 bg-gradient-to-b from-crave-cream/30 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-crave-cocoa mb-4 font-display">
            Our Delicious Collection
          </h2>
          <p className="text-crave-cocoa/60 max-w-2xl mx-auto">
            Handcrafted with premium ingredients. Every bite is a celebration of healthy indulgence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-crave-cream"
            >
              <div className="relative h-48 overflow-hidden bg-crave-cream">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-crave-cocoa mb-2 font-display">
                  {product.name}
                </h3>
                <p className="text-crave-cocoa/60 text-sm mb-3 line-clamp-2">{product.desc}</p>

                <div className="flex items-center justify-between pt-3 border-t border-crave-cream">
                  <span className="text-lg font-bold text-crave-cocoa">{product.price}</span>
                  <Btn to="/menu" variant="primary" size="sm">
                    Add
                  </Btn>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Btn to="/menu" variant="secondary" size="lg">
            View Full Menu
          </Btn>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Why Crave Better
───────────────────────────────────────── */
const WHY_CRAVE = [
  {
    icon: '❤️',
    title: 'Made with Love',
    desc: 'Every item is handcrafted with care using the finest natural ingredients.',
  },
  {
    icon: '🥗',
    title: 'Nutritious Ingredients',
    desc: 'No artificial preservatives, no refined sugar, just pure goodness.',
  },
  {
    icon: '🚚',
    title: 'Fresh Delivery',
    desc: 'Your treats arrive fresh and delicious within 30 minutes.',
  },
  {
    icon: '🎯',
    title: 'Guilt-Free Indulgence',
    desc: 'Enjoy your cravings without the guilt. Taste meets health.',
  },
]

function WhyCraveBetter() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-crave-cocoa mb-14 font-display">
          Why Choose Crave Better?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_CRAVE.map(({ icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="w-20 h-20 bg-crave-pistachio/20 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-crave-blush/20 transition-colors">
                <span className="text-4xl">{icon}</span>
              </div>
              <h3 className="text-lg font-bold text-crave-cocoa mb-2">{title}</h3>
              <p className="text-crave-cocoa/60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   CTA Banner
───────────────────────────────────────── */
function CTABanner({ user }) {
  if (user) return null
  return (
    <section className="py-20 bg-gradient-to-r from-crave-cocoa via-crave-blush to-crave-caramel text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-5 font-display">Ready to Crave Better?</h2>
        <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of happy customers enjoying delicious, healthy treats. Order now and experience the difference.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/register"
            className="inline-flex items-center justify-center font-semibold rounded-full px-10 py-4 text-base bg-white text-crave-cocoa hover:bg-crave-cream active:scale-95 transition-all shadow-lg"
          >
            Sign Up Now
          </a>
          <Btn to="/menu" variant="outline" size="lg">
            Browse Menu
          </Btn>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Footer
───────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-crave-cocoa text-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-crave-cream/20">
          {/* Brand column */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-3 bg-white rounded-lg p-1 w-fit">
              <img src="/images/logo.png" alt="Crave Better" className="h-10" />
            </a>
            <p className="text-sm leading-relaxed text-white/80">
              Healthy bakeries crafted with love. Fresh, delicious, and guilt-free treats delivered to your door.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {['𝕏', 'f', 'in', '📸'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-crave-cream/20 flex items-center justify-center text-xs font-bold hover:bg-crave-blush hover:text-white transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['Home', '/'], ['Menu', '/menu'], ['Orders', '/orders'], ['Contact', '#']].map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Account</h4>
            <ul className="space-y-2 text-sm">
              {[['Login', '/login'], ['Register', '/register'], ['My Orders', '/orders'], ['Profile', '/profile']].map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-crave-blush mt-0.5">📍</span>
                <span>District 5</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-crave-blush">📞</span>
                <span>+20 (555) BAKE-BETTER</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-crave-blush">✉️</span>
                <span>hello@cravebetter.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-crave-blush">🕐</span>
                <span>Mon–Sun: 8am – 8pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/80">
          <p>© 2026 Crave Better. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────
   Landing Page Export
───────────────────────────────────────── */
export function LandingPage() {
  const [user] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  return (
    <div className="min-h-screen bg-crave-cream font-sans">
      <Navbar />
      <Hero />
      <HealthBadgesSection />
      <FeaturedProducts />
      <WhyCraveBetter />
      <CTABanner user={user} />
      <Footer />
    </div>
  )
}
