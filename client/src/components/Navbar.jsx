import { useState } from 'react'

export function Navbar({ activePath = '' }) {
  const [open, setOpen] = useState(false)
  const [user] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const links = [['Menu', '/menu'], ['Pick-up Orders', '/reservations']]
  if (user) {
    links.push(['Orders', '/customer/dashboard'])
  }

  return (
    <header className="bg-crave-cream shadow-sm border-b-2 border-crave-caramel sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold font-display flex items-center gap-2">
          <img src="/images/logo.png" alt="Crave Better" className="h-12" />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(([l, h]) => (
            <a key={l} href={h} className={`text-sm font-medium transition-colors ${activePath === h ? 'text-crave-blush' : 'text-crave-cocoa hover:text-crave-blush'}`}>{l}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-crave-cocoa">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-xs font-semibold text-crave-cocoa/60 hover:text-crave-blush transition-colors">Logout</button>
            </div>
          ) : (
            <a href="/login" className="bg-crave-cocoa text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-crave-blush transition-colors">Login</a>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-crave-cocoa">☰</button>
      </div>
      {open && (
        <div className="md:hidden bg-crave-cream border-t-2 border-crave-caramel px-6 py-4 flex flex-col gap-3">
          {links.map(([l, h]) => <a key={l} href={h} className="text-crave-cocoa font-medium py-1">{l}</a>)}
          {user ? (
            <>
              <span className="text-crave-cocoa font-bold py-1 border-t border-crave-caramel pt-3 mt-1">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-crave-blush font-semibold text-left py-1">Logout</button>
            </>
          ) : (
            <a href="/login" className="bg-crave-cocoa text-white text-center font-semibold py-2 rounded-full mt-2">Login</a>
          )}
        </div>
      )}
    </header>
  )
}
