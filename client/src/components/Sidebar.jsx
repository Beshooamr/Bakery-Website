export function Sidebar({ role, links, activeTab, onTabChange }) {
  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <aside className="w-64 shrink-0 bg-gray-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <p className="text-[#FF4D00] text-xl font-bold font-serif">TasteBite</p>
        <p className="text-gray-400 text-xs mt-1 capitalize">{role} Portal</p>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map(({ icon, label, id }) => {
          const isActive = activeTab === id
          return (
            <button key={id} onClick={() => onTabChange && onTabChange(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${isActive ? 'bg-[#FF4D00] text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-red-500 hover:bg-opacity-20 hover:text-red-400 transition-colors w-full text-left">
          <span className="text-lg">🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}
