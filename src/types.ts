export type Category =
  | 'Рестораны'
  | 'Кафе'
  | 'Бары'
  | 'Культура'
  | 'Развлечения'
  | 'Прогулки'
  | 'Спорт'
  | 'События'
  | 'Необычные места'

export interface Place {
  id: number
  name: string
  description: string
  category: Category
  address: string
  latitude: number
  longitude: number
  price_min: number
  price_max: number
  working_hours: string
  image: string
  tags: string[]
  phone: string
  website: string
  indoor: boolean
  outdoor: boolean
  average_duration: number // minutes
  rating: number
  is_active: boolean
}

export interface RoutePlace {
  place_id: number
  position: number
  duration: number // minutes at the place
  walk_minutes: number // walk from previous point
}

export interface Scenario {
  id: number
  name: string
  description: string
  time: string
  budget: number
  places_count: number
  distance: string
  tags: string[]
  route_id: number
}

export interface Route {
  id: number
  name: string
  description: string
  duration: string
  budget: number
  points: RoutePlace[]
}

export interface DiscoverFilters {
  query: string
  time: string
  budget: string
  company: string
  format: string
  weather: string
}

export interface ScoredPlace {
  place: Place
  score: number
}
