export default function StatsCard({ title, value, subtitle, color = 'blue', icon }) {
  const colorMap = {
    blue:   'bg-blue-50 text-blue-700 border-blue-200',
    green:  'bg-green-50 text-green-700 border-green-200',
    amber:  'bg-amber-50 text-amber-700 border-amber-200',
    red:    'bg-red-50 text-red-700 border-red-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
  }

  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-60">{subtitle}</p>}
        </div>
        {icon && (
          <div className="opacity-40 mt-0.5">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
