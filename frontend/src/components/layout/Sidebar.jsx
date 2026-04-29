import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function NavIcon({ children }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/55 text-[#2563eb] shadow-sm">
      {children}
    </span>
  )
}

const icons = {
  dashboard: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  ),
  booking: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 2v4M16 2v4M3 10h18" />
      <path d="M5 4h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  ),
  reservations: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  resources: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
      <path d="M9 7h1M14 7h1M9 11h1M14 11h1M10 21v-5h4v5" />
    </svg>
  ),
}

const NAV_BY_ROLE = {
  member: [
    { to: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
    { to: '/booking', label: 'Reservar', icon: icons.booking },
    { to: '/reservations', label: 'Mis reservas', icon: icons.reservations },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: icons.dashboard },
    { to: '/admin/resources', label: 'Recursos', icon: icons.resources },
  ],
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  const navItems = NAV_BY_ROLE[user?.role] ?? NAV_BY_ROLE.member

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col border-r border-white/70 bg-white/72 p-4 text-[#202837] shadow-[18px_0_45px_rgba(35,55,95,0.08)] backdrop-blur-2xl transition-transform duration-200 md:relative md:translate-x-0 md:shadow-none ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#2563eb] text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M2 12h20" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black leading-tight text-[#111827]">
              {isAdmin ? 'Kodo Admin' : 'BookDesk'}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a8496]">
              {isAdmin ? 'Management' : 'Coworking'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-2 text-[#7a8496] hover:bg-slate-100 md:hidden" aria-label="Cerrar menu">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                isActive
                  ? 'bg-[#2563eb] text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)]'
                  : 'text-[#667085] hover:bg-white hover:text-[#202837] hover:shadow-sm'
              }`
            }
          >
            <NavIcon>{item.icon}</NavIcon>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="rounded-2xl border border-white/80 bg-white/65 p-3 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#111827] text-xs font-black text-white">
            {user?.avatar}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-[#202837]">{user?.name}</p>
            <p className="truncate text-[11px] font-semibold text-[#8a94a6]">{isAdmin ? 'Administrador' : 'Cliente'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#667085] transition-colors hover:bg-slate-100 hover:text-[#202837]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
          </svg>
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}
