export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6 text-8xl select-none">🍽️</div>
      <h1 className="text-8xl font-extrabold text-[#FF4D00] mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
      <p className="text-gray-500 max-w-sm mb-8">Oops! The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3">
        <a href="/" className="bg-[#FF4D00] hover:bg-[#e64400] text-white font-semibold px-8 py-3 rounded-full transition-colors">Go Home</a>
        <a href="/menu" className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-full transition-colors">Browse Menu</a>
      </div>
    </div>
  )
}
