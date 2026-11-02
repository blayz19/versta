import { useEffect, useRef, useState } from 'react'
import L, { Map, LayerGroup, type LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Place } from '../types'
import type { SocialMarker } from '../types'

const PLACE_ICON = L.divIcon({
  className: 'place-marker',
  html: `<div style="width:12px;height:12px;background:#4ae89a;border-radius:50%;border:2.5px solid #0a1810;box-shadow:0 2px 8px rgba(0,0,0,0.45);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

const MARKER_ICON = L.divIcon({
  className: 'social-marker',
  html: `<div style="width:14px;height:14px;background:#f59e0b;border-radius:50%;border:2.5px solid #0a1810;box-shadow:0 2px 8px rgba(0,0,0,0.45);animation:pulseSoft 2s infinite;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

interface PlaceMapProps {
  places: Place[]
  socialMarkers: SocialMarker[]
  center?: [number, number]
  zoom?: number
  height?: string
  onPlaceClick?: (place: Place) => void
  onMarkerClick?: (marker: SocialMarker) => void
}

export default function PlaceMap({
  places,
  socialMarkers,
  center = [56.4901, 84.9487],
  zoom = 13,
  height = '100%',
  onPlaceClick,
  onMarkerClick,
}: PlaceMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const layersRef = useRef<LayerGroup | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
      touchZoom: true,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    layersRef.current = L.layerGroup().addTo(map)
    setInitialized(true)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      layersRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!initialized || !mapRef.current || !layersRef.current) return

    const map = mapRef.current
    const layers = layersRef.current

    layers.clearLayers()

    places.forEach((place) => {
      const marker = L.marker([place.latitude, place.longitude], { icon: PLACE_ICON })
        .bindPopup(
          `<div style="min-width:160px"><b style="color:#0a1810">${place.name}</b><br><span style="color:#666;font-size:12px">${place.address}</span></div>`,
          { className: 'place-popup', offset: [0, -6] }
        )
        .addTo(layers)

      marker.on('click', () => {
        if (onPlaceClick) onPlaceClick(place)
      })
    })

    socialMarkers.forEach((m) => {
      const marker = L.marker([m.latitude, m.longitude], { icon: MARKER_ICON })
        .bindPopup(
          `<div style="min-width:160px"><b style="color:#0a1810">${m.marker_type}</b><br><span style="color:#666;font-size:12px">${m.text}</span></div>`,
          { className: 'place-popup', offset: [0, -6] }
        )
        .addTo(layers)

      marker.on('click', () => {
        if (onMarkerClick) onMarkerClick(m)
      })
    })

    const allPoints: LatLngExpression[] = [
      ...places.map((p) => [p.latitude, p.longitude] as [number, number]),
      ...socialMarkers.map((m) => [m.latitude, m.longitude] as [number, number]),
    ]

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints)
      map.fitBounds(bounds.pad(0.2))
    }
  }, [places, socialMarkers, initialized, onPlaceClick, onMarkerClick])

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden border border-glass shadow-lg shadow-black/30"
      style={{ height }}
    />
  )
}
