import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PlaceMap from '../components/PlaceMap'
import { usePlaces } from '../hooks/usePlaces'
import { useSocialMarkers } from '../hooks/useSocialMarkers'
import type { Place, SocialMarker } from '../types'

export default function MapPage() {
  const [selectedItem, setSelectedItem] = useState<{ type: 'place'; data: Place } | { type: 'marker'; data: SocialMarker } | null>(null)

  const { places, loading, error } = usePlaces()
  const { markers: socialMarkers, loading: markersLoading } = useSocialMarkers()

  const mapPlaces = places.filter((p) => p.latitude && p.longitude)

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedItem({ type: 'place', data: place })
  }, [])

  const handleMarkerClick = useCallback((marker: SocialMarker) => {
    setSelectedItem({ type: 'marker', data: marker })
  }, [])

  if (loading || markersLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="h-16 w-16 rounded-full border border-glass bg-surface flex items-center justify-center text-mist-muted mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-mist mb-2">Загрузка карты…</h2>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 h-[calc(100vh-112px)] flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-6 z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-5xl mb-2">Карта мест</h1>
          <p className="text-lg text-mist-soft/70">
            Зелёные метки — места из каталога, оранжевые — социальные метки других людей.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-xl border border-glass bg-surface px-4 py-2.5 text-sm text-mist-soft hover:border-brand/40 hover:text-brand transition-all">
            На главную
          </Link>
          <Link to="/markers" className="rounded-xl border border-glass bg-surface px-4 py-2.5 text-sm text-mist-soft hover:border-brand/40 hover:text-brand transition-all">
            Только метки
          </Link>
        </div>
      </div>

      {error && (
        <div className="z-10 rounded-2xl border border-glass bg-surface p-6 mb-6 text-sm text-mist-soft/60 max-w-md">
          {error}
        </div>
      )}

      <div className="relative flex-1 min-h-0 z-0">
        <PlaceMap
          places={mapPlaces}
          socialMarkers={socialMarkers}
          height="100%"
          onPlaceClick={handlePlaceClick}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* Bottom sheet with selected item */}
      {selectedItem && (
        <div className="fixed bottom-0 left-0 right-0 z-30 transform transition-transform duration-300 translate-y-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 rounded-full bg-white/10" />
          <div className="bg-ink/95 backdrop-blur-xl border-t border-glass rounded-t-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 max-h-[55vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                {selectedItem.type === 'place' ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 border border-brand/30 px-3 py-1.5 text-xs font-semibold text-brand backdrop-blur-sm">
                      {selectedItem.data.category}
                    </span>
                    <h3 className="mt-1.5 text-xl font-bold text-mist leading-snug">{selectedItem.data.name}</h3>
                    <p className="mt-1 text-sm text-mist-soft/60 line-clamp-2">{selectedItem.data.description}</p>
                    <p className="mt-2 text-xs text-mist-muted/50">{selectedItem.data.address}</p>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1.5 text-xs font-semibold text-orange-400 backdrop-blur-sm">
                      {selectedItem.data.marker_type}
                    </span>
                    <h3 className="mt-1.5 text-xl font-bold text-mist leading-snug">Социальная метка</h3>
                    <p className="mt-1 text-sm text-mist-soft/60 line-clamp-2">{selectedItem.data.text}</p>
                    <p className="mt-2 text-xs text-mist-muted/50">
                      истекает {new Date(selectedItem.data.expires_at).toLocaleString('ru-RU', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-mist-muted/50 hover:text-mist transition-colors"
              >
                ×
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {selectedItem.type === 'place' && (
                <Link
                  to={`/place/${selectedItem.data.id}`}
                  className="rounded-xl border border-brand bg-brand text-ink px-5 py-3 text-sm font-semibold text-center hover:bg-brand/90 transition-all"
                >
                  Открыть карточку
                </Link>
              )}
              <a
                href={`https://yandex.ru/maps/?pt=${selectedItem.data.longitude.toFixed(6)},${selectedItem.data.latitude.toFixed(6)}&z=16`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-glass bg-surface px-5 py-3 text-sm font-medium text-mist-soft text-center hover:border-brand/40 hover:text-brand transition-all"
              >
                Маршрут
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
