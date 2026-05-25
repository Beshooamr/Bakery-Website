import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Navbar } from '../components/Navbar'
import { apiUrl } from '../lib/api'

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const redirectForUser = (user) => {
    if (user?.role === 'manager') window.location.href = '/manager'
    else if (user?.role === 'kitchen') window.location.href = '/kitchen'
    else if (user?.role === 'delivery') window.location.href = '/delivery'
    else if (user?.role === 'service') window.location.href = '/service'
    else if (user?.role === 'supplier') window.location.href = '/supplier'
    else window.location.href = '/menu'
  }

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/users/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: 'customer' // Default role for public registration
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      alert('Account created successfully! You can now log in.');
      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSuccess = async ({ credential }) => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch(apiUrl('/api/users/google-login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Google registration failed')
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      redirectForUser(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { id: 'name', label: 'Full Name', type: 'text', ph: 'John Doe', f: 'name' },
    { id: 'email', label: 'Email', type: 'email', ph: 'your@email.com', f: 'email' },
    { id: 'phone', label: 'Phone Number', type: 'tel', ph: '+20 (555) 000-0000', f: 'phone' },
    { id: 'pass', label: 'Password', type: 'password', ph: '••••••••', f: 'password' },
    { id: 'confirm', label: 'Confirm Password', type: 'password', ph: '••••••••', f: 'confirm' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#FF4D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
              <p className="text-sm text-gray-500">Join TasteBite today</p>
            </div>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

            {googleClientId && (
              <>
                <div className="mb-5">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google registration failed')}
                    width="100%"
                  />
                </div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px bg-gray-100 flex-1" />
                  <span className="text-xs font-semibold text-gray-400 uppercase">or</span>
                  <div className="h-px bg-gray-100 flex-1" />
                </div>
              </>
            )}

            <form onSubmit={submit} className="flex flex-col gap-4">
              {fields.map(({ id, label, type, ph, f }) => (
                <div key={id} className="flex flex-col gap-1.5">
                  <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
                  <input id={id} type={type} placeholder={ph} value={form[f]} onChange={set(f)} required
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 border-0 outline-none focus:ring-2 focus:ring-[#FF4D00]/30 focus:bg-white transition-all" />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full bg-[#FF4D00] hover:bg-[#e64400] text-white font-semibold py-3 rounded-xl transition-all mt-2 disabled:opacity-60">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-[#FF4D00] font-semibold hover:underline">Login here</a>
            </p>
          </div>
          <p className="mt-5 text-center text-xs text-gray-400"><a href="/" className="hover:text-gray-600">← Back to Home</a></p>
        </div>
      </div>
    </div>
  )
}
