import type { DiscoverFilters, Place, ScoredPlace } from '../types'
import placesData from '../data/places.json'
import scenariosData from '../data/scenarios.json'

const places = placesData as Place[]
const scenarios = scenariosData

// Map free-text query interests to categories and tags
const INTEREST_MAP: Record<string, { categories: string[]; tags: string[] }> = {
  'необычный вечер': { categories: ['Необычные места', 'Развлечения', 'Культура'], tags: ['необычно', 'вечер', 'дождь'] },
  'свидание': { categories: ['Рестораны', 'Кафе', 'Культура'], tags: ['свидание', 'тихо', 'вечер'] },
  'друзья': { categories: ['Развлечения', 'Бары', 'Спорт'], tags: ['компания', 'вечер', 'настольные игры'] },
  'дождь': { categories: ['Культура', 'Развлечения', 'Кафе'], tags: ['дождь', 'в помещении'] },
  'семья': { categories: ['Культура', 'Прогулки', 'События'], tags: ['семья', 'прогулка'] },
  'недорого': { categories: ['Кафе', 'Прогулки', 'Культура'], tags: ['недорого', 'тихо'] },
}

function parseBudget(budget: string): number {
  if (budget === 'Неважно') return 99999
  const n = parseInt(budget.replace(/\D/g, ''), 10)
  return isNaN(n) ? 99999 : n
}

function parseTimeMinutes(time: string): number {
  switch (time) {
    case '< 1 часа':
      return 60
    case '1–2 часа':
      return 120
    case '2–4 часа':
      return 240
    case 'Весь день':
      return 480
    default:
      return 120
  }
}

export function scorePlace(place: Place, filters: DiscoverFilters): number {
  let score = 0

  // Budget match: +20 if place fits within budget
  const budget = parseBudget(filters.budget)
  if (place.price_max <= budget) {
    score += 20
  }

  // Category match: +20 if category matches interest
  const interest = INTEREST_MAP[filters.query]
  if (interest && interest.categories.includes(place.category)) {
    score += 20
  }

  // Weather match: +20 if indoor when rain
  if (filters.weather === 'Дождь' && place.indoor) {
    score += 20
  }
  if (filters.weather === 'Хорошая погода' && place.outdoor) {
    score += 20
  }
  if (filters.weather === 'В помещении' && place.indoor) {
    score += 20
  }

  // Time match: +15 if average_duration fits within time budget
  const timeMinutes = parseTimeMinutes(filters.time)
  if (place.average_duration <= timeMinutes) {
    score += 15
  }

  // Company match: +15
  if (filters.company === 'Пара' && (place.tags.includes('свидание') || place.tags.includes('тихо') || place.category === 'Рестораны' || place.category === 'Кафе')) {
    score += 15
  }
  if (filters.company === 'Друзья' && (place.tags.includes('компания') || place.category === 'Развлечения' || place.category === 'Бары' || place.category === 'Спорт')) {
    score += 15
  }
  if (filters.company === 'Семья' && (place.tags.includes('семья') || place.category === 'Культура' || place.category === 'Прогулки' || place.category === 'События')) {
    score += 15
  }
  if (filters.company === 'Один' && (place.category === 'Кафе' || place.category === 'Культура' || place.category === 'Прогулки')) {
    score += 15
  }

  // Tag match: +10 if any tag matches interest
  if (interest) {
    const matchingTags = place.tags.filter((t) => interest.tags.includes(t))
    if (matchingTags.length > 0) {
      score += 10
    }
  }

  // Format match: +10 if format matches category
  const formatCategoryMap: Record<string, string[]> = {
    'Еда': ['Рестораны', 'Кафе', 'Бары'],
    'Развлечения': ['Развлечения', 'События'],
    'Прогулка': ['Прогулки'],
    'Культура': ['Культура', 'События'],
    'Спорт': ['Спорт'],
    'Необычные места': ['Необычные места'],
    'События': ['События'],
  }
  if (formatCategoryMap[filters.format]?.includes(place.category)) {
    score += 10
  }

  return score
}

export function getRecommendations(filters: DiscoverFilters): ScoredPlace[] {
  return places
    .filter((p) => p.is_active)
    .map((place) => ({ place, score: scorePlace(place, filters) }))
    .sort((a, b) => b.score - a.score)
}

export function getTopScenarios(filters: DiscoverFilters, count = 3) {
  // Score scenarios based on how well their tags match the query
  const interest = INTEREST_MAP[filters.query]
  const budget = parseBudget(filters.budget)

  return scenarios
    .map((s) => {
      let score = 0
      if (interest) {
        const matchingTags = s.tags.filter((t) => interest.tags.includes(t))
        score += matchingTags.length * 15
      }
      if (s.budget <= budget) score += 20
      if (filters.weather === 'Дождь' && s.tags.includes('дождь')) score += 20
      if (filters.company === 'Пара' && s.tags.includes('пара')) score += 15
      return { ...s, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
}

export function getPlaceById(id: number): Place | undefined {
  return places.find((p) => p.id === id)
}

export function getAllPlaces(): Place[] {
  return places.filter((p) => p.is_active)
}
