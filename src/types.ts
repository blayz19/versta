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
  is_promoted?: boolean
  promotion_start_at?: string | null
  promotion_end_at?: string | null
  paid_boost?: number
  source_type?: string
  source_url?: string
  source_external_id?: string
  source_checked_at?: string
  last_verified_at?: string
  data_status?: string
  confidence_score?: number
  updated_at?: string
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

/* ---------- Auth / Profile ---------- */

export interface Profile {
  id: string // matches auth.users.id
  nickname: string
  avatar_url?: string
  created_at: string
  xp?: number
  level?: number
}

export interface UserVisit {
  id: string
  user_id: string
  place_id: number
  visited_at: string
  xp_awarded: number
}

export interface SavedPlace {
  id: string
  user_id: string
  place_id: number
  created_at: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  category_id?: Category | null
  rule_type: string
  rule_value: number
  icon: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
}

/* ---------- Stories ---------- */

export interface Story {
  id: string
  business_name: string
  place_id?: number | null
  image_url: string
  caption: string
  action_url?: string | null
  expires_at: string
  is_active: boolean
  created_at: string
}

/* ---------- Social markers ---------- */

export interface SocialMarker {
  id: string
  user_id: string
  marker_type: string
  text: string
  latitude: number
  longitude: number
  place_id?: number | null
  expires_at: string
  created_at: string
  is_active: boolean
}

/* ---------- Challenges ---------- */

export interface Challenge {
  id: string
  title: string
  description: string
  start_at: string
  end_at: string
  place_ids: number[]
  is_active: boolean
}

export interface ChallengeParticipant {
  id: string
  challenge_id: string
  user_id: string
  joined_at: string
}

/* ---------- Paid promotion ---------- */

export interface Promotion {
  id: string
  place_id: number
  is_promoted: boolean
  promotion_start_at?: string | null
  promotion_end_at?: string | null
  paid_boost: number
  promotion_category?: string | null
  target_context?: string | null
  promotion_status: string
  campaign_name?: string | null
}

/* ---------- Analytics ---------- */

export interface PlaceEvent {
  id: string
  place_id: number
  event_type: 'impression' | 'place_open' | 'action_click'
  is_promoted: boolean
  source?: string | null
  created_at: string
}
