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
  // Pre-compute time slots without mutating during render
  const timeSlots: { start: string; end: string }[] = []
  let cursor = startTime
  for (const p of points) {
    const start = cursor
    const end = addMinutes(start, p.duration)
    timeSlots.push({ start, end })
    cursor = addMinutes(end, p.walk_minutes)
  }

  return (
    <div className="relative">
      {points.map((point, idx) => {
        const start = timeSlots[idx].start
        const end = timeSlots[idx].end

        return (
          <div key={point.place.id}>
            <div className="animate-rise" style={{ animationDelay: `${idx * 0.07}s` }}>
              <Link
                to={`/place/${point.place.id}`}
                className="group flex gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5 transition-all duration-300 hover:border-brand/40 hover:bg-surface-hover"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-ink shadow-lg shadow-brand/30">
                    {point.position}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-bold text-mist group-hover:text-brand transition-colors leading-snug">
                      {point.place.name}
                    </h3>
                    <span className="text-sm font-medium text-brand">
                      {start}–{end}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-mist-soft/50">{point.place.description}</p>
                  <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mist-muted/60">
                    <span>{point.place.address}</span>
                    <span aria-hidden="true">·</span>
                    <span>{point.place.category}</span>
                    {point.place.price_max > 0 && (
                      <span className="text-mist-soft/60 font-medium">
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
                  decoding="async"
                />
              </Link>
            </div>

            {idx < points.length - 1 && (
              <div className="flex items-center gap-4 py-2 pl-9 sm:pl-11">
                <div className="flex flex-col items-center">
                  <div className="h-6 w-px bg-brand/20" />
                  <svg className="h-4 w-4 text-brand/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div className="h-6 w-px bg-brand/20" />
                </div>
                <span className="text-xs text-mist-muted/50">{point.walk_minutes} минут пешком</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
