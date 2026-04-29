import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function TopBar({ title, subtitle, action }) {
  const { user } = useAuth()
  const ctx = useOutletContext?.() ?? {}
  const onMenuClick = ctx.onMenuClick

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/70 bg-white/48 px-4 py-3 backdrop-blur-2xl md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-[#667085] transition-colors hover:bg-white md:hidden"
          aria-label="Abrir menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          {title && <h1 className="truncate text-xl font-black tracking-normal text-[#202837] md:text-2xl">{title}</h1>}
          {subtitle && <p className="mt-0.5 truncate text-xs font-semibold text-[#7a8496] md:text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {action}
        {user?.role === 'admin' && (
          <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563eb] sm:inline-flex">
            Administrador
          </span>
        )}
        <button className="hidden h-9 w-9 place-items-center rounded-full bg-white/70 text-[#667085] shadow-sm transition-colors hover:bg-white sm:grid" aria-label="Notificaciones">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[#111827] text-xs font-black text-white shadow-sm">
          {user?.avatar}
        </div>
      </div>
    </header>
  )
}
