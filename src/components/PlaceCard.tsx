import { Link } from 'react-router-dom'
import type { Place } from '../types'

interface PlaceCardProps {
  place: Place
  compact?: boolean
}

export default function PlaceCard({ place, compact = false }: PlaceCardProps) {
  return (
    <Link
      to={`/place/${place.id}`}
      className="group block overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-brand/30 hover:bg-white/[0.04]"
    >
      <div className={`relative overflow-hidden ${compact ? 'h-32' : 'h-48'}`}>
        <img
          src={place.image}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-brand backdrop-blur-sm">
          {place.category}
        </span>
        {place.indoor && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-mist/70 backdrop-blur-sm">
            В помещении
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-mist group-hover:text-brand transition-colors">{place.name}</h3>
          <span className="shrink-0 text-sm font-bold text-brand">★ {place.rating}</span>
        </div>
        {!compact && <p className="mt-1 line-clamp-2 text-sm text-mist/50">{place.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mist/40">
          <span>{place.address}</span>
          {place.price_max > 0 && (
            <span className="font-medium text-mist/60">
              {place.price_min === place.price_max
                ? `${place.price_max} ₽`
                : `${place.price_min}–${place.price_max} ₽`}
            </span>
          )}
          <span>{place.average_duration} мин</span>
        </div>
      </div>
    </Link>
  )
}
