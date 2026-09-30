import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import { getPlaceById } from '../hooks/useRecommendations'

export default function PlacePage() {
  const { id } = useParams<{ id: string }>()
  const place = getPlaceById(Number(id))

  if (!place) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-mist">Место не найдено</h1>
        <Link to="/" className="mt-4 inline-block text-brand hover:underline">
          На главную
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Hero image */}
      <div className="animate-rise relative h-64 overflow-hidden rounded-2xl sm:h-80">
        <img src={place.image} alt={place.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-medium text-brand backdrop-blur-sm">
            {place.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-mist sm:text-4xl">{place.name}</h1>
        </div>
      </div>

      {/* Info grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-xs font-medium tracking-wider text-mist/40">АДРЕС</h3>
          <p className="mt-2 text-mist">{place.address}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-xs font-medium tracking-wider text-mist/40">ЧАСЫ РАБОТЫ</h3>
          <p className="mt-2 text-mist">{place.working_hours}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-xs font-medium tracking-wider text-mist/40">СРЕДНИЙ ЧЕК</h3>
          <p className="mt-2 text-mist">
            {place.price_max > 0
              ? place.price_min === place.price_max
                ? `${place.price_max} ₽`
                : `${place.price_min}–${place.price_max} ₽`
              : 'Бесплатно'}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-xs font-medium tracking-wider text-mist/40">ДЛИТЕЛЬНОСТЬ</h3>
          <p className="mt-2 text-mist">~{place.average_duration} минут</p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-mist">Описание</h2>
        <p className="mt-2 text-mist/60">{place.description}</p>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {place.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-mist/60">
            #{tag}
          </span>
        ))}
      </div>

      {/* Features */}
      <div className="mt-6 flex flex-wrap gap-2">
        {place.indoor && (
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">В помещении</span>
        )}
        {place.outdoor && (
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">На улице</span>
        )}
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-mist/50">★ {place.rating}</span>
      </div>

      {/* CTA buttons */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        {place.phone && (
          <a href={`tel:${place.phone.replace(/[^+\d]/g, '')}`} className="flex-1">
            <Button className="w-full">Позвонить</Button>
          </a>
        )}
        {place.website && (
          <a href={place.website} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="secondary" className="w-full">Перейти на сайт</Button>
          </a>
        )}
        <Link to="/discover" className="flex-1">
          <Button variant="ghost" className="w-full border border-white/10">Добавить в маршрут</Button>
        </Link>
      </div>
    </div>
  )
}
