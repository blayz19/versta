import { Link, useParams, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { getPlaceById } from '../hooks/useRecommendations'
import { getMapLinks } from '../hooks/useMap'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../hooks/useUser'
import PlaceMap from '../components/PlaceMap'

export default function PlacePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { isVisited, isSaved, markVisit, toggleSave } = useUser()
  const place = getPlaceById(Number(id))

  const mapLinks = place ? getMapLinks(place.latitude, place.longitude, place.name) : null

  const visited = place ? isVisited(place.id) : false
  const saved = place ? isSaved(place.id) : false

  if (!place) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 text-center">
        <div className="mx-auto h-24 w-24 rounded-full border border-glass bg-surface flex items-center justify-center text-mist-muted mb-8">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-mist mb-4">Место не найдено</h1>
        <p className="text-mist-soft/60 mb-10">Такой страницы пока нет в базе Версты.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-brand hover:underline">
          На главную
        </Link>
      </div>
    )
  }

  const handleVisit = async () => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    try {
      await markVisit(place)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    try {
      await toggleSave(place)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="mb-8 flex items-center gap-2 text-xs text-mist-muted">
        <Link to="/" className="hover:text-brand transition-colors">Главная</Link>
        <span className="mx-1">/</span>
        <Link to="/catalog" className="hover:text-brand transition-colors">Каталог</Link>
        <span className="mx-1">/</span>
        <span className="text-mist">{place.name}</span>
      </nav>

      {/* Hero image */}
      <div className="relative rounded-3xl overflow-hidden border border-glass bg-surface shadow-2xl shadow-black/40 mb-10">
        <div className="relative h-80 sm:h-96 lg:h-[500px]">
          <img
            src={place.image}
            alt={place.name}
            className="block h-full w-full object-cover"
            loading="eager"
            decoding="async"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.src = 'https://images.unsplash.com/photo-1492392760666-7f6072e9f855?w=1200&q=80'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 border border-brand/30 px-3 py-1.5 text-xs font-semibold text-brand backdrop-blur-sm">
              {place.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold text-mist sm:text-5xl leading-tight">{place.name}</h1>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-12">
        <div className="rounded-2xl border border-glass bg-surface p-5 sm:p-6">
          <p className="text-xs font-medium tracking-wider text-mist-muted/60 flex items-center gap-1.5 mb-2">📍 Адрес</p>
          <p className="text-sm font-semibold text-mist leading-snug">{place.address}</p>
        </div>
        <div className="rounded-2xl border border-glass bg-surface p-5 sm:p-6">
          <p className="text-xs font-medium tracking-wider text-mist-muted/60 flex items-center gap-1.5 mb-2">🕒 Часы работы</p>
          <p className="text-sm font-semibold text-mist leading-snug">{place.working_hours}</p>
        </div>
        <div className="rounded-2xl border border-glass bg-surface p-5 sm:p-6">
          <p className="text-xs font-medium tracking-wider text-mist-muted/60 flex items-center gap-1.5 mb-2">💰 Средний чек</p>
          <p className="text-sm font-semibold text-mist leading-snug">
            {place.price_max > 0
              ? place.price_min === place.price_max
                ? `${place.price_max} ₽`
                : `${place.price_min}–${place.price_max} ₽`
              : 'Бесплатно'}
          </p>
        </div>
        <div className="rounded-2xl border border-glass bg-surface p-5 sm:p-6">
          <p className="text-xs font-medium tracking-wider text-mist-muted/60 flex items-center gap-1.5 mb-2">⏱ В среднем</p>
          <p className="text-sm font-semibold text-mist leading-snug">~{place.average_duration} мин</p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* Main content */}
        <div className="space-y-10">
          {/* Actions */}
          <section className="rounded-2xl border border-glass bg-surface p-6 sm:p-8">
            <h2 className="text-lg font-bold text-mist mb-4">Ваши действия</h2>
            <div className="flex flex-wrap gap-3 sm:flex-row sm:items-center">
              <button
                onClick={handleSave}
                className={`flex-1 flex items-center gap-2.5 rounded-xl border px-5 py-3.5 text-sm font-medium transition-all ${
                  saved
                    ? 'border-brand bg-brand text-ink shadow-md shadow-brand/25'
                    : 'border-glass bg-surface text-mist-soft hover:border-brand/40 hover:text-brand hover:bg-surface-hover'
                }`}
              >
                {saved ? '✓ Сохранено' : 'Сохранить'}
              </button>
              <button
                onClick={handleVisit}
                className={`flex-1 flex items-center gap-2.5 rounded-xl border px-5 py-3.5 text-sm font-medium transition-all ${
                  visited
                    ? 'border-brand bg-brand text-ink shadow-md shadow-brand/25'
                    : 'border-glass bg-surface text-mist-soft hover:border-brand/40 hover:text-brand hover:bg-surface-hover'
                }`}
              >
                {visited ? '✓ Посещено' : 'Отметить посещение'}
              </button>
              {!isAuthenticated && (
                <span className="text-xs text-mist-muted/50 bg-white/[0.02] rounded-full px-3 py-1">
                  Вход для сохранений и посещений
                </span>
              )}
            </div>
            {!isAuthenticated && (
              <p className="mt-3 text-xs text-mist-muted/50">
                Войдите в аккаунт, чтобы сохранять места, отмечать посещения и получать опыт.
              </p>
            )}
          </section>

          {/* Description */}
          <section>
            <h2 className="text-lg font-bold text-mist mb-4">Описание</h2>
            <p className="text-lg text-mist-soft/70 leading-relaxed">{place.description}</p>
          </section>

          {/* Tags */}
          <section>
            <h2 className="text-xs font-medium tracking-wider text-mist-muted/60 uppercase mb-3">Теги</h2>
            <div className="flex flex-wrap gap-2">
              {place.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-glass bg-surface px-3 py-1.5 text-xs text-mist-soft/80">
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          {/* Format */}
          <section>
            <h2 className="text-xs font-medium tracking-wider text-mist-muted/60 uppercase mb-3">Формат</h2>
            <div className="flex flex-wrap gap-2">
              {place.indoor && (
                <span className="rounded-full bg-brand/10 border border-brand/20 px-3 py-1.5 text-xs font-medium text-brand">
                  В помещении
                </span>
              )}
              {place.outdoor && (
                <span className="rounded-full bg-brand/10 border border-brand/20 px-3 py-1.5 text-xs font-medium text-brand">
                  На улице
                </span>
              )}
              <span className="rounded-full bg-surface border border-glass px-3 py-1.5 text-xs text-mist-soft/70">
                ★ {place.rating} · {place.average_duration} мин
              </span>
            </div>
          </section>

          {/* Map links */}
          <section className="rounded-2xl border border-glass bg-surface p-6 sm:p-8">
            <h2 className="text-lg font-bold text-mist mb-4">Открыть на карте</h2>
            <p className="text-sm text-mist-soft/60 mb-6">
              Мы используем точные координаты места, поэтому карта всегда откроет правильное здание.
            </p>
            {mapLinks && (
              <div className="grid gap-3">
                <MapLinkButton provider="yandex" links={mapLinks} label="Яндекс Карты" />
                <MapLinkButton provider="google" links={mapLinks} label="Google Карты" />
                <MapLinkButton provider="apple" links={mapLinks} label="Apple Карты" />
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="flex flex-col gap-3 sm:flex-row">
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
            <Link to="/" className="flex-1">
              <Button variant="ghost" className="w-full border border-glass">
                К подбору сценариев
              </Button>
            </Link>
          </section>
        </div>

        {/* Sidebar: map */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-2xl border border-glass bg-surface overflow-hidden shadow-lg shadow-black/30">
            <PlaceMap places={[place]} socialMarkers={[]} height="420px" />
            <div className="p-5 sm:p-6">
              <h3 className="text-sm font-bold text-mist">{place.name}</h3>
              <p className="mt-1 text-xs text-mist-soft/60">{place.address}</p>
              <div className="mt-4 flex gap-2">
                <a href={mapLinks?.yandex || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl border border-glass bg-surface px-3 py-2 text-xs text-mist-soft hover:border-brand/40 hover:text-brand transition-colors">
                  Яндекс
                </a>
                <a href={mapLinks?.google || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl border border-glass bg-surface px-3 py-2 text-xs text-mist-soft hover:border-brand/40 hover:text-brand transition-colors">
                  Google
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function MapLinkButton({ provider, links, label }: { provider: 'yandex' | 'google' | 'apple'; links: ReturnType<typeof getMapLinks>; label: string }) {
  const icons: Record<string, string> = {
    yandex: 'https://yandex.ru/favicon.ico',
    google: 'https://www.google.com/favicon.ico',
    apple: 'https://www.apple.com/favicon.ico',
  }
  return (
    <a
      href={links[provider]}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-glass bg-surface px-4 py-3.5 text-left transition-all hover:border-brand/40 hover:bg-surface-hover hover:text-brand"
    >
      <img
        src={icons[provider]}
        alt={label}
        className="h-5 w-5 rounded"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      <span className="text-sm font-semibold">{label}</span>
      <span className="ml-auto text-xs text-mist-muted/50">Открыть</span>
      <svg className="w-4 h-4 text-mist-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </a>
  )
}
