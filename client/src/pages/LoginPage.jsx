import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'

import { Navbar } from '../components/Navbar'
import { apiUrl } from '../lib/api'

/* ─── Input field component ─── */
function Field({ id, label, type = 'text', placeholder, value, onChange, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children ?? (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 border-0 outline-none focus:ring-2 focus:ring-[#FF4D00]/30 focus:bg-white transition-all"
          required
        />
      )}
    </div>
  )
}

/* ─── Main Login Page ─── */
export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  const redirectForUser = (user) => {
    if (user?.role === 'manager') window.location.href = '/manager'
    else if (user?.role === 'kitchen') window.location.href = '/kitchen'
    else if (user?.role === 'delivery') window.location.href = '/delivery'
    else if (user?.role === 'service') window.location.href = '/service'
    else if (user?.role === 'supplier') window.location.href = '/supplier'
    else window.location.href = '/menu'
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      redirectForUser(data.user);
      
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
        throw new Error(data.message || 'Google login failed')
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      redirectForUser(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      {/* Centered card area */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl px-8 py-10">

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#FF4D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
              <p className="text-sm text-gray-500">Login to access your account</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {googleClientId && (
              <>
              <div className="mb-5">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed')}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email */}
              <Field
                id="email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={update('email')}
              />

              {/* Password */}
              <Field
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={update('password')}
              />

              

              {/* Forgot password */}
              <div className="flex justify-end -mt-2">
                <a href="/forgot-password" className="text-xs text-[#FF4D00] hover:underline font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF4D00] hover:bg-[#e64400] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Logging in…
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="/register" className="text-[#FF4D00] font-semibold hover:underline">
                Register here
              </a>
            </p>
          </div>

          {/* Back to home */}
          <p className="mt-5 text-center text-xs text-gray-400">
            <a href="/" className="hover:text-gray-600 transition-colors">← Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  )
}
