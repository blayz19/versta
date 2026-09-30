import type { Place, Route } from '../types'
import routesData from '../data/routes.json'
import { getPlaceById } from './useRecommendations'

const routes = routesData as Route[]

export interface RoutePoint {
  place: Place
  position: number
  duration: number
  walk_minutes: number
}

export function getRouteById(id: number): Route | undefined {
  return routes.find((r) => r.id === id)
}

export function getRouteWithPlaces(id: number): { route: Route; points: RoutePoint[] } | undefined {
  const route = getRouteById(id)
  if (!route) return undefined

  const points: RoutePoint[] = route.points
    .map((rp) => {
      const place = getPlaceById(rp.place_id)
      if (!place) return null
      return { place, position: rp.position, duration: rp.duration, walk_minutes: rp.walk_minutes }
    })
    .filter((p): p is RoutePoint => p !== null)
    .sort((a, b) => a.position - b.position)

  return { route, points }
}

export function getAllRoutes(): Route[] {
  return routes
}
