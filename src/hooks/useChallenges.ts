import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { usePlaces } from './usePlaces'
import type { Challenge, ChallengeParticipant } from '../types'
import type { Place } from '../types'

const CHALLENGES_KEY = 'versta_challenges'
const PARTICIPANTS_KEY = 'versta_challenge_participants'

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Три новые кофейни',
    description: 'Посети три кофейни в центре Томска и получи достижение.',
    start_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    place_ids: [1, 11, 19],
    is_active: true,
  },
  {
    id: 'challenge-2',
    title: 'Культурный выходной',
    description: 'Сходи в музей, галерею и театр за один уикенд.',
    start_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    place_ids: [4, 16, 8],
    is_active: true,
  },
  {
    id: 'challenge-3',
    title: 'Открой пять мест в центре',
    description: 'Отметь посещение пяти любых мест в историческом центре.',
    start_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    place_ids: [1, 4, 10, 11, 16],
    is_active: true,
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

export function useChallenges() {
  const { user } = useAuth()
  const { places } = usePlaces()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      Promise.all([
        supabase.from('challenges').select('*').eq('is_active', true),
        supabase.from('challenge_participants').select('*'),
      ])
        .then(([cRes, pRes]) => {
          if (cRes.error) throw cRes.error
          if (pRes.error) throw pRes.error
          setChallenges((cRes.data || []) as Challenge[])
          setParticipants((pRes.data || []) as ChallengeParticipant[])
          setLoading(false)
        })
        .catch(() => {
          setChallenges(loadLocal(CHALLENGES_KEY, MOCK_CHALLENGES))
          setParticipants(loadLocal(PARTICIPANTS_KEY, []))
          setLoading(false)
        })
    } else {
      setChallenges(loadLocal(CHALLENGES_KEY, MOCK_CHALLENGES))
      setParticipants(loadLocal(PARTICIPANTS_KEY, []))
      setLoading(false)
    }
  }, [])

  const isJoined = useCallback(
    (challengeId: string) =>
      participants.some((p) => p.challenge_id === challengeId && p.user_id === user?.id),
    [participants, user?.id]
  )

  const joinChallenge = useCallback(
    async (challenge: Challenge) => {
      if (!user) throw new Error('Требуется вход')
      if (isJoined(challenge.id)) return

      const participant: ChallengeParticipant = {
        id: `cp-${Date.now()}`,
        challenge_id: challenge.id,
        user_id: user.id,
        joined_at: new Date().toISOString(),
      }

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('challenge_participants')
          .insert([participant])
        if (error) throw error
      }

      setParticipants((prev) => [...prev, participant])
      saveLocal(PARTICIPANTS_KEY, [...participants, participant])
    },
    [user, isJoined, participants]
  )

  // Helper to compute progress given a set of visited place ids
  const getProgress = useCallback(
    (challenge: Challenge, visitedPlaceIds: Set<number>) => {
      const total = challenge.place_ids.length
      const visited = challenge.place_ids.filter((pid) => visitedPlaceIds.has(pid)).length
      return { total, visited, percent: total ? Math.round((visited / total) * 100) : 0 }
    },
    []
  )

  const placeById = useCallback(
    (id: number): Place | undefined => places.find((p) => p.id === id),
    [places]
  )

  return {
    challenges,
    participants,
    loading,
    isJoined,
    joinChallenge,
    getProgress,
    placeById,
  }
}

