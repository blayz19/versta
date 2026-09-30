import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import RouteTimeline from '../components/RouteTimeline'
import { getRouteWithPlaces } from '../hooks/useRoute'

export default function RoutePage() {
  const { id } = useParams<{ id: string }>()
  const data = getRouteWithPlaces(Number(id))

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-mist">Маршрут не найден</h1>
        <Link to="/results" className="mt-4 inline-block text-brand hover:underline">
          Вернуться к результатам
        </Link>
      </div>
    )
  }

  const { route, points } = data

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-4xl">Твой сценарий на вечер</h1>
          <p className="mt-2 text-mist/50">
            {route.duration} · {route.budget.toLocaleString('ru-RU')} ₽ · {points.length} точки
          </p>
        </div>
        <Button size="lg">Построить маршрут</Button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Timeline */}
        <div>
          <RouteTimeline points={points} />
        </div>

        {/* Map placeholder */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="relative h-80 bg-brand-dim/30">
              {/* Schematic map */}
              <svg viewBox="0 0 360 320" className="h-full w-full">
                {/* Grid lines */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="320" stroke="#254030" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 45} x2="360" y2={i * 45} stroke="#254030" strokeWidth="0.5" />
                ))}
                {/* Route line */}
                <polyline
                  points="80,260 180,160 280,80"
                  fill="none"
                  stroke="#4ae89a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 4"
                />
                {/* Points */}
                <circle cx="80" cy="260" r="10" fill="#4ae89a" />
                <circle cx="180" cy="160" r="10" fill="#4ae89a" />
                <circle cx="280" cy="80" r="10" fill="#4ae89a" />
                <text x="80" y="264" textAnchor="middle" fill="#0a1810" fontSize="10" fontWeight="bold">1</text>
                <text x="180" y="164" textAnchor="middle" fill="#0a1810" fontSize="10" fontWeight="bold">2</text>
                <text x="280" y="84" textAnchor="middle" fill="#0a1810" fontSize="10" fontWeight="bold">3</text>
              </svg>
              <div className="absolute bottom-3 left-3 rounded-lg bg-ink/80 px-3 py-1.5 text-xs text-mist/50 backdrop-blur-sm">
                Схематичная карта
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-mist">{route.name}</h3>
              <p className="mt-1 text-xs text-mist/50">{route.description}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
