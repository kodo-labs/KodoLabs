import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar'
import WeeklyCalendar from '../components/calendar/WeeklyCalendar'
import Badge from '../components/common/Badge'
import { RESOURCES, WEEK_DAYS } from '../data/mockData'
import { useReservations } from '../context/ReservationsContext'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const { reservations } = useReservations()
  const navigate = useNavigate()

  const [filter, setFilter] = useState('all')
  const [selectedResource, setSelectedResource] = useState(RESOURCES[0].id)

  const resource = RESOURCES.find(r => r.id === selectedResource)

  const filteredResources = filter === 'all'
    ? RESOURCES
    : RESOURCES.filter(r => r.type === filter)

  // Próximas reservas del usuario
  const today = '2026-04-06'
  const myUpcoming = reservations
    .filter(r => r.userId === user.id && r.status !== 'cancelled' && r.date >= today)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 3)

  return (
    <div>
      <TopBar
        title={`Hola, ${user.name.split(' ')[0]} 👋`}
        subtitle="Semana 7–11 de abril 2026 — Verificá disponibilidad y reservá"
      />

      <div className="p-6 space-y-6">

        {/* Mis próximas reservas */}
        {myUpcoming.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Mis próximas reservas
              </h2>
              <button
                onClick={() => navigate('/reservations')}
                className="text-xs text-brand-600 hover:text-brand-800 font-medium"
              >
                Ver todas →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {myUpcoming.map(r => {
                const res = RESOURCES.find(x => x.id === r.resourceId)
                return (
                  <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{res?.type === 'room' ? '🏢' : '💻'}</span>
                      <Badge variant={r.status} />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm truncate">{res?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.date.slice(8)}/04 · {r.startTime}–{r.endTime}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-1">{r.title}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Selector de recurso + calendario */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">

          {/* Panel izquierdo: filtros + lista de recursos */}
          <div className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Recursos
              </h2>
              <div className="flex gap-2 mb-3">
                {[
                  { value: 'all',  label: 'Todos' },
                  { value: 'room', label: 'Salas' },
                  { value: 'desk', label: 'Escritorios' },
                ].map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      filter === f.value
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredResources.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedResource(r.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all text-sm ${
                    selectedResource === r.id
                      ? 'border-brand-600 bg-brand-50 text-brand-800'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{r.type === 'room' ? '🏢' : '💻'}</span>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {r.type === 'room' ? `${r.capacity} personas` : `Escritorio · P${r.floor}`}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Panel derecho: calendario */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-900">{resource?.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{resource?.description}</p>
              </div>
              <button
                onClick={() => navigate('/booking')}
                className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                + Reservar
              </button>
            </div>
            <WeeklyCalendar
              resourceId={selectedResource}
              reservations={reservations}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
