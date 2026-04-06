import { useState } from 'react'
import { formatDate } from '../../data/mockData'

/**
 * Modal de confirmación de reserva.
 *
 * Props:
 *  - resource: objeto recurso
 *  - date: string 'YYYY-MM-DD'
 *  - startTime: string 'HH:MM'
 *  - endTime: string 'HH:MM'
 *  - onConfirm: (title) => void
 *  - onCancel: () => void
 */
export default function BookingModal({ resource, date, startTime, endTime, onConfirm, onCancel }) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    // Simula una llamada al backend (Observer pattern notificaría aquí)
    await new Promise(r => setTimeout(r, 600))
    onConfirm(title || 'Reserva')
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Confirmar reserva</h2>
            <p className="text-sm text-gray-500 mt-0.5">Revisá los detalles antes de confirmar.</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Resumen */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-3 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
              resource.type === 'room' ? 'bg-blue-100' : 'bg-violet-100'
            }`}>
              {resource.type === 'room' ? '🏢' : '💻'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{resource.name}</p>
              <p className="text-xs text-gray-500">Piso {resource.floor}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 font-medium">Fecha</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatDate(date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Horario</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{startTime} – {endTime}</p>
            </div>
          </div>
        </div>

        {/* Título opcional */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Motivo / título <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ej: Reunión de equipo, Entrevista…"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Confirmando…
              </>
            ) : 'Confirmar reserva'}
          </button>
        </div>
      </div>
    </div>
  )
}
