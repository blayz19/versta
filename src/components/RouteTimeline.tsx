import { Link } from 'react-router-dom'
import type { RoutePoint } from '../hooks/useRoute'

interface RouteTimelineProps {
  points: RoutePoint[]
  startTime?: string
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  const nh = Math.floor(total / 60) % 24
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

export default function RouteTimeline({ points, startTime = '19:00' }: RouteTimelineProps) {
  let currentTime = startTime

  return (
    <div className="relative">
      {points.map((point, idx) => {
        const start = currentTime
        const end = addMinutes(start, point.duration)
        currentTime = addMinutes(end, point.walk_minutes)

        return (
          <div key={point.place.id}>
            {/* Place card */}
            <div className="animate-rise" style={{ animationDelay: `${idx * 0.08}s` }}>
              <Link
                to={`/place/${point.place.id}`}
                className="group flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-brand/30 hover:bg-white/[0.04] sm:gap-6 sm:p-6"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-ink">
                    {point.position}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-semibold text-mist group-hover:text-brand transition-colors">
                      {point.place.name}
                    </h3>
                    <span className="text-sm font-medium text-brand">
                      {start}–{end}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-mist/50">{point.place.description}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mist/40">
                    <span>{point.place.address}</span>
                    <span>{point.place.category}</span>
                    {point.place.price_max > 0 && (
                      <span className="text-mist/60">
                        {point.place.price_min === point.place.price_max
                          ? `${point.place.price_max} ₽`
                          : `${point.place.price_min}–${point.place.price_max} ₽`}
                      </span>
                    )}
                  </div>
                </div>
                <img
                  src={point.place.image}
                  alt={point.place.name}
                  className="hidden h-20 w-20 shrink-0 rounded-xl object-cover sm:block"
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Walk connector */}
            {idx < points.length - 1 && (
              <div className="flex items-center gap-4 py-1 pl-9 sm:pl-11">
                <div className="flex flex-col items-center">
                  <div className="h-6 w-px bg-brand/30" />
                  <svg className="h-4 w-4 text-brand/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div className="h-6 w-px bg-brand/30" />
                </div>
                <span className="text-xs text-mist/40">{point.walk_minutes} минут пешком</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
