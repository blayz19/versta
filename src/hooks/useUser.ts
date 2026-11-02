import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Place, UserVisit, SavedPlace, Achievement, UserAchievement } from '../types'

const VISITS_KEY = 'versta_visits'
const SAVED_KEY = 'versta_saved'
const ACHIEVEMENTS_KEY = 'versta_user_achievements'

const XP_PER_VISIT = 10

const LEVEL_THRESHOLDS = [0, 50, 150, 300]

function levelFromXP(xp: number): number {
  let level = 1
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t) level++
  }
  return level
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_visit',
    title: 'Первое открытие',
    description: 'Посетил 1 место',
    category_id: null,
    rule_type: 'visit_count',
    rule_value: 1,
    icon: '🗺',
  },
  {
    id: 'coffee_explorer',
    title: 'Кофейный исследователь',
    description: 'Посетил 3 места категории «Кафе»',
    category_id: 'Кафе',
    rule_type: 'category_visits',
    rule_value: 3,
    icon: '☕',
  },
  {
    id: 'culture_lover',
    title: 'Любитель искусства',
    description: 'Посетил 3 места категории «Культура»',
    category_id: 'Культура',
    rule_type: 'category_visits',
    rule_value: 3,
    icon: '🎨',
  },
  {
    id: 'city_explorer',
    title: 'Городской исследователь',
    description: 'Посетил 5 уникальных мест',
    category_id: null,
    rule_type: 'visit_count',
    rule_value: 5,
    icon: '🏙',
  },
  {
    id: 'challenge_collector',
    title: 'Коллекционер маршрутов',
    description: 'Выполнил 1 челлендж',
    category_id: null,
    rule_type: 'challenge_count',
    rule_value: 1,
    icon: '🏆',
  },
]

function loadLocal<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : fallback
  } catch {
    return fallback
  }
}

function saveLocal<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function useUser() {
  const { user, updateProfile } = useAuth()
  const [visits, setVisits] = useState<UserVisit[]>([])
  const [saved, setSaved] = useState<SavedPlace[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setVisits(loadLocal<UserVisit>(VISITS_KEY, []))
    setSaved(loadLocal<SavedPlace>(SAVED_KEY, []))
    setUserAchievements(loadLocal<UserAchievement>(ACHIEVEMENTS_KEY, []))
    const totalXp = visits.reduce((sum, v) => sum + v.xp_awarded, 0)
    setXp(totalXp)
    setLevel(levelFromXP(totalXp))
    setLoading(false)
  }, [])

  const isVisited = useCallback(
    (placeId: number) => visits.some((v) => v.place_id === placeId),
    [visits]
  )

  const isSaved = useCallback(
    (placeId: number) => saved.some((s) => s.place_id === placeId),
    [saved]
  )

  const markVisit = useCallback(
    async (place: Place) => {
      if (!user) throw new Error('Требуется вход')
      if (isVisited(place.id)) return

      const visit: UserVisit = {
        id: `visit-${Date.now()}`,
        user_id: user.id,
        place_id: place.id,
        visited_at: new Date().toISOString(),
        xp_awarded: XP_PER_VISIT,
      }

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('visits').insert([visit])
        if (error) throw error
      }

      setVisits((prev) => [...prev, visit])
      const totalXp = visits.reduce((sum, v) => sum + v.xp_awarded, 0) + XP_PER_VISIT
      setXp(totalXp)
      setLevel(levelFromXP(totalXp))
      if (updateProfile) {
        await updateProfile({ xp: totalXp, level: levelFromXP(totalXp) })
      }

      // Local persistence
      const nextVisits = [...visits, visit]
      saveLocal(VISITS_KEY, nextVisits)

      // Check achievements
      checkAchievements(nextVisits)
    },
    [user, isVisited, visits, saved, updateProfile]
  )

  const toggleSave = useCallback(
    async (place: Place) => {
      if (!user) throw new Error('Требуется вход')
      const already = isSaved(place.id)

      if (already) {
        setSaved((prev) => prev.filter((s) => s.place_id !== place.id))
        saveLocal(SAVED_KEY, saved.filter((s) => s.place_id !== place.id))
        if (isSupabaseConfigured && supabase) {
          await supabase.from('saved_places').delete().eq('user_id', user.id).eq('place_id', place.id)
        }
      } else {
        const item: SavedPlace = {
          id: `saved-${Date.now()}`,
          user_id: user.id,
          place_id: place.id,
          created_at: new Date().toISOString(),
        }
        setSaved((prev) => [...prev, item])
        saveLocal(SAVED_KEY, [...saved, item])
        if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.from('saved_places').insert([item])
          if (error) throw error
        }
      }
      return !already
    },
    [user, isSaved, saved, updateProfile]
  )

  function checkAchievements(nextVisits: UserVisit[]) {
    const totalVisits = nextVisits.length
    const newUnlocks: UserAchievement[] = []

    for (const ach of INITIAL_ACHIEVEMENTS) {
      const already = userAchievements.some((ua) => ua.achievement_id === ach.id)
      if (already) continue

      let unlocked = false
      if (ach.rule_type === 'visit_count') {
        unlocked = totalVisits >= ach.rule_value
      }

      if (unlocked && user) {
        const ua: UserAchievement = {
          id: `ua-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          user_id: user.id,
          achievement_id: ach.id,
          unlocked_at: new Date().toISOString(),
        }
        newUnlocks.push(ua)
      }
    }

    if (newUnlocks.length > 0) {
      setUserAchievements((prev) => [...prev, ...newUnlocks])
      saveLocal(ACHIEVEMENTS_KEY, [...userAchievements, ...newUnlocks])
    }
    return newUnlocks
  }

  const visitedPlaceIds = new Set(visits.map((v) => v.place_id))

  return {
    user,
    visits,
    saved,
    userAchievements,
    xp,
    level,
    loading,
    isVisited,
    isSaved,
    markVisit,
    toggleSave,
    visitedPlaceIds,
    allAchievements: INITIAL_ACHIEVEMENTS,
  }
}

// Re-export Achievement type for components that need it
export type { Achievement }
