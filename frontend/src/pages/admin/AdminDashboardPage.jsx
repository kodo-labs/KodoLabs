import { useState } from 'react'
import TopBar from '../../components/layout/TopBar'
import StatsCard from '../../components/common/StatsCard'
import Badge from '../../components/common/Badge'
import WeeklyCalendar from '../../components/calendar/WeeklyCalendar'
import { RESOURCES, USERS, formatDate } from '../../data/mockData'
import { useReservations } from '../../context/ReservationsContext'

export default function AdminDashboardPage() {
  const { reservations, cancelReservation, blockSlot } = useReservations()
  const [selectedResource, setSelectedResource] = useState(RESOURCES[0].id)
  const [showBlockForm, setShowBlockForm] = useState(false)
  const [blockDate, setBlockDate] = useState('2026-04-07')
  const [blockStart, setBlockStart] = useState('08:00')
  const [blockEnd, setBlockEnd] = useState('18:00')
  const [blockSuccess, setBlockSuccess] = useState(false)

  const totalReservations = reservations.filter(r => !r.isBlocked)
  const confirmed  = totalReservations.filter(r => r.status === 'confirmed').length
  const pending    = totalReservations.filter(r => r.status === 'pending').length
  const cancelled  = totalReservations.filter(r => r.status === 'cancelled').length
  const blocked    = reservations.filter(r => r.isBlocked).length

  const recent = reservations
    .filter(r => !r.isBlocked)
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 8)

  function getUserName(userId) {
    return USERS.find(u => u.id === userId)?.name ?? 'Desconocido'
  }

  function handleBlock() {
    blockSlot(selectedResource, blockDate, blockStart, blockEnd)
    setShowBlockForm(false)
    setBlockSuccess(true)
    setTimeout(() => setBlockSuccess(false), 3000)
  }

  return (
    <div>
      <TopBar title="Panel administrador" subtitle="Resumen general del sistema de reservas." />

      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Reservas confirmadas"
            value={confirmed}
            color="green"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Pendientes"
            value={pending}
            color="amber"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Canceladas"
            value={cancelled}
            color="red"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Slots bloqueados"
            value={blocked}
            color="violet"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

          {/* Calendario admin */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="font-bold text-gray-900">Vista semanal de reservas</h2>
                <p className="text-xs text-gray-500 mt-0.5">Visualizá la ocupación por recurso.</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedResource}
                  onChange={e => setSelectedResource(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {RESOURCES.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowBlockForm(!showBlockForm)}
                  className="px-3 py-1.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  🔒 Bloquear horario
                </button>
              </div>
            </div>

            {blockSuccess && (
              <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                ✓ Horario bloqueado exitosamente.
              </div>
            )}

            {showBlockForm && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-amber-800">Bloquear horario en: {RESOURCES.find(r=>r.id===selectedResource)?.name}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                    <select value={blockDate} onChange={e => setBlockDate(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500">
                      <option value="2026-04-07">Lun 07/04</option>
                      <option value="2026-04-08">Mar 08/04</option>
                      <option value="2026-04-09">Mié 09/04</option>
                      <option value="2026-04-10">Jue 10/04</option>
                      <option value="2026-04-11">Vie 11/04</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Desde</label>
                    <select value={blockStart} onChange={e => setBlockStart(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500">
                      {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Hasta</label>
                    <select value={blockEnd} onChange={e => setBlockEnd(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500">
                      {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleBlock}
                    className="px-4 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors">
                    Bloquear
                  </button>
                  <button onClick={() => setShowBlockForm(false)}
                    className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <WeeklyCalendar
              resourceId={selectedResource}
              reservations={reservations}
            />
          </div>

          {/* Actividad reciente */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Actividad reciente</h2>
            <div className="space-y-2.5 overflow-y-auto max-h-[480px]">
              {recent.map(r => {
                const res = RESOURCES.find(x => x.id === r.resourceId)
                return (
                  <div key={r.id} className="flex items-start gap-3 text-sm border-b border-gray-50 pb-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      res?.type === 'room' ? 'bg-blue-100' : 'bg-violet-100'
                    }`}>
                      {res?.type === 'room' ? '🏢' : '💻'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs truncate">{res?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{getUserName(r.userId)}</p>
                      <p className="text-xs text-gray-400">{r.date.slice(8)}/04 · {r.startTime}–{r.endTime}</p>
                    </div>
                    <Badge variant={r.isBlocked ? 'blocked' : r.status} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tabla de todas las reservas */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Todas las reservas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Recurso', 'Usuario', 'Fecha', 'Horario', 'Motivo', 'Estado', 'Acción'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations
                  .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime))
                  .map(r => {
                    const res = RESOURCES.find(x => x.id === r.resourceId)
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-gray-900 text-xs">{res?.name}</td>
                        <td className="px-4 py-2.5 text-gray-600 text-xs">{getUserName(r.userId)}</td>
                        <td className="px-4 py-2.5 text-gray-600 text-xs">{r.date.slice(8)}/04</td>
                        <td className="px-4 py-2.5 text-gray-600 text-xs whitespace-nowrap">{r.startTime}–{r.endTime}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-xs max-w-[140px] truncate">{r.title}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant={r.isBlocked ? 'blocked' : r.status} />
                        </td>
                        <td className="px-4 py-2.5">
                          {!r.isBlocked && r.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelReservation(r.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
