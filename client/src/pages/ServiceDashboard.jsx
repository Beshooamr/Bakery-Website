import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'

const TABLES = [
  { id:1, seats:2, status:'Available' },{ id:2, seats:4, status:'Occupied',  order:'#2045', guests:3 },
  { id:3, seats:6, status:'Reserved', time:'7:00 PM' },{ id:4, seats:4, status:'Occupied', order:'#2047', guests:2 },
  { id:5, seats:2, status:'Available' },{ id:6, seats:8, status:'Available' },
  { id:7, seats:4, status:'Occupied', order:'#2046', guests:4 },{ id:8, seats:2, status:'Reserved', time:'8:30 PM' },
  { id:9, seats:4, status:'Occupied', order:'#2044', guests:3 },
]
const TC = { Available:'border-green-300 bg-green-50', Occupied:'border-[#FF4D00] bg-orange-50', Reserved:'border-yellow-300 bg-yellow-50' }

export function ServiceDashboard() {
  const [tables, setTables] = useState(TABLES)
  const [tab, setTab] = useState('tables')
  const clear = id => setTables(prev => prev.map(t => t.id===id ? { ...t, status:'Available', order:undefined, guests:undefined } : t))
  
  const svc_links = [
    { icon:'🪑', label:'Tables', id:'tables' },
    { icon:'📋', label:'Orders', id:'orders' },
    { icon:'📅', label:'Reservations', id:'reservations' },
  ]

  const counts = { Available: tables.filter(t=>t.status==='Available').length, Occupied: tables.filter(t=>t.status==='Occupied').length, Reserved: tables.filter(t=>t.status==='Reserved').length }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar role="Service" links={svc_links} activeTab={tab} onTabChange={setTab} />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tables Overview</h1>
        {/* Legend */}
        <div className="flex gap-4 mb-6">
          {Object.entries(counts).map(([s, n]) => (
            <span key={s} className="text-sm text-gray-600 font-medium">{s}: <strong>{n}</strong></span>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map(t => (
            <div key={t.id} className={`bg-white rounded-2xl border-2 ${TC[t.status]} p-5 shadow-sm`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-lg">Table {t.id}</p>
                  <p className="text-gray-500 text-sm">{t.seats} seats</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${t.status==='Available'?'bg-green-100 text-green-700':t.status==='Occupied'?'bg-orange-100 text-[#FF4D00]':'bg-yellow-100 text-yellow-700'}`}>{t.status}</span>
              </div>
              {t.status==='Occupied' && <p className="text-sm text-gray-600 mb-3">Order {t.order} · {t.guests} guests</p>}
              {t.status==='Reserved' && <p className="text-sm text-gray-600 mb-3">Reserved for {t.time}</p>}
              {t.status==='Occupied' && (
                <button onClick={() => clear(t.id)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 rounded-xl transition-colors">Clear Table</button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
