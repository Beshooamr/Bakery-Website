import { useState } from 'react'
import { apiUrl } from '../lib/api'

function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold font-serif">
          <span className="text-gray-900">Taste</span>
          <span className="text-[#FF4D00]">Bite</span>
        </a>
        <a href="/login" className="text-sm font-semibold text-[#FF4D00] hover:text-[#e64400] transition-colors">
          Login
        </a>
      </div>
    </header>
  )
}

function Field({ id, label, type = 'text', placeholder, value, onChange, minLength }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        minLength={minLength}
        className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 border-0 outline-none focus:ring-2 focus:ring-[#FF4D00]/30 focus:bg-white transition-all"
        required
      />
    </div>
  )
}

export function ForgetPasswordPage() {
  const [step, setStep] = useState('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const requestCode = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(apiUrl('/api/users/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset code')
      }

      setMessage(data.devCode ? `${data.message} Code: ${data.devCode}` : data.message || 'Reset code sent to your email')
      setStep('reset')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(apiUrl('/api/users/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password')
      }

      setMessage('Password reset successfully. You can log in now.')
      setStep('done')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#FF4D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {step === 'request' ? 'Forgot Password?' : step === 'reset' ? 'Enter Reset Code' : 'Password Updated'}
              </h1>
              <p className="text-sm text-gray-500">
                {step === 'request'
                  ? "Enter your email and we'll send a reset code."
                  : step === 'reset'
                    ? 'Check your email for the 6-digit code.'
                    : 'Use your new password to access your account.'}
              </p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                {message}
              </div>
            )}

            {step === 'request' && (
              <form onSubmit={requestCode} className="flex flex-col gap-5">
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF4D00] hover:bg-[#e64400] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 mt-2"
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={resetPassword} className="flex flex-col gap-5">
                <Field
                  id="code"
                  label="Reset Code"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Field
                  id="new-password"
                  label="New Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                />
                <Field
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF4D00] hover:bg-[#e64400] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 mt-2"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={requestCode}
                  disabled={loading}
                  className="text-sm text-[#FF4D00] font-semibold hover:underline disabled:text-gray-400"
                >
                  Resend code
                </button>
              </form>
            )}

            {step === 'done' && (
              <a href="/login" className="block w-full text-center bg-[#FF4D00] hover:bg-[#e64400] text-white font-semibold py-3 rounded-xl transition-all">
                Back to Login
              </a>
            )}

            {step !== 'done' && (
              <p className="mt-6 text-center text-sm text-gray-500">
                Remember your password?{' '}
                <a href="/login" className="text-[#FF4D00] font-semibold hover:underline">
                  Login here
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
