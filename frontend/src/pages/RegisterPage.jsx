import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthInput, AuthLogo, AuthShell } from './LoginPage'
import { signUp } from '../services/bookdeskRepository'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signUp({ name, email, password })
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/login')
  }

  return (
    <AuthShell>
      <section className="auth-card">
        <AuthLogo />
        <h1 className="text-center text-3xl font-black tracking-normal text-[#11151b]">Crear cuenta</h1>
        <p className="mx-auto mt-2 max-w-[230px] text-center text-xs font-medium leading-5 text-[#717786]">
          Crea tu acceso para reservar espacios en BookDesk.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <AuthInput
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre completo"
            icon={
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21a8 8 0 10-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />
          <AuthInput
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Correo electronico"
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
            placeholder="Contrasena"
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
            {loading ? 'Creando...' : 'Registrarse'}
            <span aria-hidden="true">-&gt;</span>
          </button>
        </form>

        <div className="mt-5 text-center text-xs font-semibold">
          <Link to="/login" className="text-[#0058bc] hover:text-[#003f8f]">
            Ya tenes una cuenta?
          </Link>
        </div>
      </section>
    </AuthShell>
  )
}
