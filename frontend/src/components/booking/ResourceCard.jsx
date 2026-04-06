import Badge from '../common/Badge'

export default function ResourceCard({ resource, selected, onClick, compact = false }) {
  const isRoom = resource.type === 'room'

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
          selected
            ? 'border-brand-600 bg-brand-50 shadow-sm'
            : 'border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
            isRoom ? 'bg-blue-100' : 'bg-violet-100'
          }`}>
            {isRoom ? '🏢' : '💻'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm truncate">{resource.name}</p>
            <p className="text-xs text-gray-500">
              {isRoom ? `Sala · ${resource.capacity} personas` : `Escritorio · Piso ${resource.floor}`}
            </p>
          </div>
          {selected && (
            <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
        selected
          ? 'border-brand-600 bg-brand-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-brand-300 hover:shadow-md'
      }`}
    >
      {/* Icono y tipo */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isRoom ? 'bg-blue-100' : 'bg-violet-100'
        }`}>
          {isRoom ? '🏢' : '💻'}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={resource.type} />
          {selected && (
            <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Nombre */}
      <h3 className="font-bold text-gray-900 text-base mb-1">{resource.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{resource.description}</p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
          Piso {resource.floor}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {resource.capacity} {resource.capacity === 1 ? 'persona' : 'personas'}
        </span>
      </div>

      {/* Amenidades */}
      <div className="flex flex-wrap gap-1.5">
        {resource.amenities.map(a => (
          <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {a}
          </span>
        ))}
      </div>
    </button>
  )
}
