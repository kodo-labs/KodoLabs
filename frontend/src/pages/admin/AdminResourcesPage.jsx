import { useState } from 'react'
import TopBar from '../../components/layout/TopBar'
import Badge from '../../components/common/Badge'
import { RESOURCES } from '../../data/mockData'
import { useReservations } from '../../context/ReservationsContext'

export default function AdminResourcesPage() {
  const { reservations } = useReservations()
  const [resources, setResources] = useState(RESOURCES)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', type: 'room', capacity: 4, floor: 1, description: '', amenities: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function openCreate() {
    setEditingId(null)
    setForm({ name: '', type: 'room', capacity: 4, floor: 1, description: '', amenities: '' })
    setShowForm(true)
  }

  function openEdit(resource) {
    setEditingId(resource.id)
    setForm({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity,
      floor: resource.floor,
      description: resource.description,
      amenities: resource.amenities.join(', '),
    })
    setShowForm(true)
  }

  function handleSave() {
    const amenities = form.amenities.split(',').map(a => a.trim()).filter(Boolean)
    if (editingId) {
      setResources(prev =>
        prev.map(r => r.id === editingId
          ? { ...r, ...form, amenities, capacity: parseInt(form.capacity), floor: parseInt(form.floor) }
          : r
        )
      )
    } else {
      const newResource = {
        id: `resource-${Date.now()}`,
        ...form,
        amenities,
        capacity: parseInt(form.capacity),
        floor: parseInt(form.floor),
        image: null,
      }
      setResources(prev => [...prev, newResource])
    }
    setShowForm(false)
    setEditingId(null)
  }

  function handleDelete(id) {
    setResources(prev => prev.filter(r => r.id !== id))
    setDeleteConfirm(null)
  }

  function getReservationCount(resourceId) {
    return reservations.filter(r => r.resourceId === resourceId && r.status !== 'cancelled' && !r.isBlocked).length
  }

  return (
    <div>
      <TopBar title="Gestión de recursos" subtitle="Administrá salas y escritorios del espacio." />

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">{resources.length} recursos registrados</p>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar recurso
          </button>
        </div>

        {/* Formulario crear/editar */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">
              {editingId ? 'Editar recurso' : 'Nuevo recurso'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Sala Delta"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo *</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="room">Sala de reuniones</option>
                  <option value="desk">Escritorio</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Capacidad (personas)</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Piso</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.floor}
                  onChange={e => setForm(f => ({ ...f, floor: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Breve descripción del espacio"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amenidades <span className="text-gray-400 font-normal">(separadas por coma)</span>
                </label>
                <input
                  type="text"
                  value={form.amenities}
                  onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))}
                  placeholder="Proyector, Pizarrón, AC"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!form.name.trim()}
                className="px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-40 transition-colors"
              >
                {editingId ? 'Guardar cambios' : 'Crear recurso'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Grid de recursos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${
                  r.type === 'room' ? 'bg-blue-100' : 'bg-violet-100'
                }`}>
                  {r.type === 'room' ? '🏢' : '💻'}
                </div>
                <Badge variant={r.type} />
              </div>

              {/* Info */}
              <h3 className="font-bold text-gray-900 mb-1">{r.name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{r.description}</p>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span>Piso {r.floor}</span>
                <span>·</span>
                <span>{r.capacity} {r.capacity === 1 ? 'persona' : 'personas'}</span>
                <span>·</span>
                <span className="text-brand-600 font-medium">{getReservationCount(r.id)} reservas</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {r.amenities.slice(0, 3).map(a => (
                  <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
                ))}
                {r.amenities.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{r.amenities.length - 3}</span>
                )}
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEdit(r)}
                  className="flex-1 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
                >
                  Editar
                </button>
                {deleteConfirm === r.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">¿Eliminar?</span>
                    <button onClick={() => handleDelete(r.id)}
                      className="text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition-colors">Sí</button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors">No</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(r.id)}
                    className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
