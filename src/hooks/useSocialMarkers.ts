import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { SocialMarker } from '../types'

const MARKERS_KEY = 'versta_social_markers'

const MOCK_MARKERS: SocialMarker[] = [
  {
    id: 'mock-1',
    user_id: 'mock-user-1',
    marker_type: 'ищу компанию',
    text: 'Иду в кофейню на набережной, кто составит компанию?',
    latitude: 56.4901,
    longitude: 84.9487,
    place_id: 1,
    expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    id: 'mock-2',
    user_id: 'mock-user-2',
    marker_type: 'могу показать город',
    text: 'Провожу экскурсию по старому центру через час, присоединяйтесь.',
    latitude: 56.4865,
    longitude: 84.9478,
    place_id: 4,
    expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    id: 'mock-3',
    user_id: 'mock-user-3',
    marker_type: 'хочу рассказать о новом месте',
    text: 'Открыли скейт-парк у набережной, вечером есть подсветка.',
    latitude: 56.4934,
    longitude: 84.9434,
    place_id: 7,
    expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    is_active: true,
  },
]

function loadLocal(): SocialMarker[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(MARKERS_KEY)
    return raw ? (JSON.parse(raw) as SocialMarker[]) : [...MOCK_MARKERS]
  } catch {
    return [...MOCK_MARKERS]
  }
}

function saveLocal(markers: SocialMarker[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(MARKERS_KEY, JSON.stringify(markers))
}

export function useSocialMarkers() {
  const { user } = useAuth()
  const [markers, setMarkers] = useState<SocialMarker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('social_markers')
        .select('*')
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error
          setMarkers((data || []) as SocialMarker[])
          setLoading(false)
        })
    } else {
      setMarkers(loadLocal())
      setLoading(false)
    }
  }, [])

  const activeMarkers = markers.filter(
    (m) => m.is_active && new Date(m.expires_at) > new Date()
  )

  const createMarker = useCallback(
    async (values: {
      marker_type: string
      text: string
      latitude: number
      longitude: number
      place_id?: number | null
      expiresAt: string
    }) => {
      if (!user) throw new Error('Требуется вход')

      const marker: SocialMarker = {
        id: `marker-${Date.now()}`,
        user_id: user.id,
        marker_type: values.marker_type,
        text: values.text.slice(0, 160),
        latitude: values.latitude,
        longitude: values.longitude,
        place_id: values.place_id ?? null,
        expires_at: values.expiresAt,
        created_at: new Date().toISOString(),
        is_active: true,
      }

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('social_markers').insert([marker])
        if (error) throw error
      }

      setMarkers((prev) => [marker, ...prev])
      saveLocal([marker, ...markers])
      return marker
    },
    [user, markers]
  )

  const deleteMarker = useCallback(
    async (markerId: string) => {
      if (!user) throw new Error('Требуется вход')

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('social_markers')
          .delete()
          .eq('id', markerId)
          .eq('user_id', user.id)
        if (error) throw error
      }

      setMarkers((prev) => prev.filter((m) => m.id !== markerId))
      saveLocal(markers.filter((m) => m.id !== markerId))
    },
    [user, markers]
  )

  return {
    markers: activeMarkers,
    allMarkers: markers,
    loading,
    createMarker,
    deleteMarker,
    isOwner: (marker: SocialMarker) => marker.user_id === user?.id,
  }
}
