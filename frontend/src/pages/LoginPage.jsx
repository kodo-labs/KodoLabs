import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthLogo() {
  return (
    <Link to="/" className="mx-auto mb-8 flex w-max items-center gap-2">
      <span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-[#54c6ff] to-[#0058bc] shadow-[0_8px_18px_rgba(0,112,235,0.25)]">
        <span className="h-2.5 w-2.5 rounded-sm bg-white/35" />
      </span>
      <span className="text-base font-black text-[#11151b]">BookDesk</span>
    </Link>
  )
}

function AuthInput({ icon, type = 'text', value, onChange, placeholder, required = true }) {
  return (
    <label className="auth-input-wrap">
      <span className="text-[#717786]">{icon}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#414755] outline-none placeholder:text-[#8a909c]"
      />
    </label>
  )
}

function AuthShell({ children }) {
  return (
    <main className="auth-page min-h-screen overflow-hidden bg-[#f9f9ff] text-[#11151b]">
      <div className="auth-frame">
        <div className="auth-bg-band" />
        <div className="auth-glass auth-glass-left" />
        <div className="auth-glass auth-glass-top" />
        <div className="auth-glass auth-glass-right" />
        <div className="auth-glass auth-glass-bottom" />
        <div className="relative z-10 flex min-h-[640px] items-center justify-center px-4 py-14">
          {children}
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 400))
    const result = await login(email, password)
    setLoading(false)
    if (result.ok) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  function fillDemo(role) {
    if (role === 'member') {
      setEmail('valentina@bookdesk.co')
      setPassword('1234')
    } else {
      setEmail('admin@bookdesk.co')
      setPassword('admin')
    }
    setError('')
  }

  return (
    <AuthShell>
      <section className="auth-card">
        <AuthLogo />
        <h1 className="text-center text-3xl font-black tracking-normal text-[#11151b]">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <AuthInput
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            icon={
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16v16H4z" />
                <path d="M4 7l8 6 8-6" />
              </svg>
            }
          />
          <AuthInput
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            icon={
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 11V8a5 5 0 0110 0v3" />
                <path d="M5 11h14v10H5z" />
              </svg>
            }
          />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="auth-primary-button">
            {loading ? 'Signing in...' : 'Sign In'}
            <span aria-hidden="true">-&gt;</span>
          </button>
        </form>

        <div className="mt-5 flex flex-col items-center gap-2 text-xs font-semibold">
          <button type="button" onClick={() => fillDemo('member')} className="text-[#0058bc] hover:text-[#003f8f]">
            Use member demo
          </button>
          <button type="button" onClick={() => fillDemo('admin')} className="text-[#9e3d00] hover:text-[#7c2e00]">
            Use admin demo
          </button>
          <Link to="/register" className="text-[#0058bc] hover:text-[#003f8f]">
            Create Account
          </Link>
        </div>
      </section>
    </AuthShell>
  )
}

export { AuthInput, AuthLogo, AuthShell }
