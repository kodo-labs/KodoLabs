import { useAuth } from '../../context/AuthContext'

export default function TopBar({ title, subtitle, onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa — solo mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          {title && <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user?.role === 'admin' && (
          <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full hidden sm:inline">
            Administrador
          </span>
        )}
        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {user?.avatar}
        </div>
      </div>
    </header>
  )
}
