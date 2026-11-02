import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import RouteTimeline from '../components/RouteTimeline'
import { getRouteWithPlaces } from '../hooks/useRoute'
import { getMapLinks } from '../hooks/useMap'

export default function RoutePage() {
  const { id } = useParams<{ id: string }>()
  const data = getRouteWithPlaces(Number(id))

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 text-center">
        <div className="mx-auto h-24 w-24 rounded-full border border-glass bg-surface flex items-center justify-center text-mist-muted mb-8">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-mist mb-4">Маршрут не найден</h1>
        <p className="text-mist-soft/60 mb-8">Такого сценария пока нет в базе.</p>
        <Link to="/results" className="inline-flex items-center gap-2 text-brand hover:underline">
          Вернуться к результатам
        </Link>
      </div>
    )
  }

  const { route, points } = data
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const routeMapLinks = firstPoint && lastPoint
    ? getMapLinks(
        (firstPoint.place.latitude + lastPoint.place.latitude) / 2,
        (firstPoint.place.longitude + lastPoint.place.longitude) / 2,
        route.name,
      )
    : null

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-10 sm:mb-14">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-5xl mb-2">Твой сценарий</h1>
          <p className="text-lg text-mist-soft/70">{route.name}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-mist-soft">
            <span>{route.duration}</span>
            <span aria-hidden="true">·</span>
            <span>{route.budget.toLocaleString('ru-RU')} ₽</span>
            <span aria-hidden="true">·</span>
            <span>{points.length} точка{points.length > 1 ? 'и' : ''}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button size="lg">Построить маршрут</Button>
          <Button variant="outline" size="lg" onClick={() => navigator.clipboard.writeText(window.location.href)}>
            Поделиться
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Timeline */}
        <div className="space-y-8">
          <h2 className="text-lg font-bold text-mist">Точки маршрута</h2>
          <RouteTimeline points={points} />
        </div>

        {/* Map sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-2xl border border-glass bg-surface overflow-hidden shadow-xl shadow-black/40">
            <div className="relative h-[500px] bg-brand-dim/20">
              <RouteMapPreview points={points} routeName={route.name} />
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-sm font-bold text-mist mb-2">{route.name}</h3>
              <p className="mt-1 text-xs text-mist-soft/60 mb-4">{route.description}</p>
              {routeMapLinks && (
                <div className="grid gap-2 mb-6">
                  <a
                    href={routeMapLinks.yandex}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-glass bg-surface px-3 py-2.5 text-xs font-medium text-mist-soft transition-all hover:border-brand/40 hover:text-brand hover:bg-surface-hover"
                  >
                    Весь маршрут в Яндекс Картах
                    <svg className="w-3.5 h-3.5 text-mist-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </a>
                  <a
                    href={routeMapLinks.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-glass bg-surface px-3 py-2.5 text-xs font-medium text-mist-soft transition-all hover:border-brand/40 hover:text-brand hover:bg-surface-hover"
                  >
                    Весь маршрут в Google Картах
                    <svg className="w-3.5 h-3.5 text-mist-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </a>
                </div>
              )}
              <h4 className="text-xs font-medium tracking-wider text-mist-muted/60 uppercase mb-3">По точкам</h4>
              <div className="grid gap-2">
                {points.map((p) => (
                  <PlaceMapLinkButton key={p.place.id} place={p.place} />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function PlaceMapLinkButton({ place }: { place: { id: number; name: string; latitude: number; longitude: number; address: string } }) {
  const links = getMapLinks(place.latitude, place.longitude, place.name)
  return (
    <a
      href={links.yandex}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-xl border border-glass bg-surface px-3 py-2 text-sm transition-all hover:border-brand/40 hover:text-brand hover:bg-surface-hover"
    >
      <span className="flex-1 text-left text-mist">{place.name}</span>
      <span className="text-xs text-mist-muted/50">Яндекс Карты</span>
      <svg className="w-3.5 h-3.5 text-mist-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </a>
  )
}

function RouteMapPreview({ points, routeName }: { points: { place: { latitude: number; longitude: number; name: string; address: string } }[]; routeName: string }) {
  const first = points[0]
  if (!first) {
    return <div className="h-full w-full flex items-center justify-center text-mist-muted/40 text-sm">Карта недоступна</div>
  }
  const ll = `${first.place.longitude.toFixed(6)}%2C${first.place.latitude.toFixed(6)}`
  const pts = points.map((p) => `${p.place.longitude.toFixed(6)}%2C${p.place.latitude.toFixed(6)}`).join('%7E')

  return (
    <iframe
      title={`Карта маршрута ${routeName}`}
      src={`https://yandex.ru/map-widget/v1/?ll=${ll}&z=14&l=map&pl=${pts}&mode=iframe`}
      className="w-full h-full block"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      style={{ border: 0 }}
    />
  )
}
