import { Link } from 'react-router-dom'
import type { Place } from '../types'

interface PlaceCardProps {
  place: Place
  compact?: boolean
  onVisit?: () => void
  visited?: boolean
}

export default function PlaceCard({ place, compact = false, onVisit, visited = false }: PlaceCardProps) {
  const priceLabel =
    place.price_max > 0
      ? place.price_min === place.price_max
        ? `${place.price_max} ₽`
        : `${place.price_min}–${place.price_max} ₽`
      : 'Бесплатно'

  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onVisit?.()
  }

  return (
    <Link
      to={`/place/${place.id}`}
      className="group block overflow-hidden rounded-3xl border border-glass bg-surface transition-all duration-300 hover:border-brand/40 hover:bg-surface-hover hover:-translate-y-1"
    >
      <div className={`relative overflow-hidden ${compact ? 'h-40 sm:h-44' : 'h-48 sm:h-56'}`}>
        <img
          src={place.image}
          alt={place.name}
          className="block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const img = e.target as HTMLImageElement
            img.src = 'https://images.unsplash.com/photo-1492392760666-7f6072e9f855?w=800&q=80'
            img.alt = place.name
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-ink/80 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-brand">
          {place.category}
        </span>
        {place.indoor && (
          <span className="absolute right-4 top-4 rounded-full bg-ink/80 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs text-mist-soft">
            В помещении
          </span>
        )}
        {visited && (
          <span className="absolute right-4 bottom-4 rounded-full bg-brand text-ink px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
            Посещено
          </span>
        )}
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-mist group-hover:text-brand transition-colors leading-snug">
            {place.name}
          </h3>
          <span className="shrink-0 text-sm font-bold text-brand">★ {place.rating}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-mist-soft/60">{place.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-mist-muted/70">
          <span>{place.address}</span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-mist-soft">{priceLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{place.average_duration} мин</span>
        </div>
      </div>
      {onVisit && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <button
            onClick={handleVisit}
            className="w-full rounded-xl border border-brand bg-brand text-ink px-4 py-2.5 text-sm font-medium transition-all hover:bg-brand/90 active:scale-[0.98]"
          >
            Отметить посещение
          </button>
        </div>
      )}
    </Link>
  )
}
