import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Story } from '../types'

const MOCK_STORIES: Story[] = [
  {
    id: 'story-1',
    business_name: 'Кофейня «Север»',
    place_id: 1,
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
    caption: 'Новые авторские десерты и виды на набережную',
    action_url: '/place/1',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'story-2',
    business_name: 'Ресторан «Томь»',
    place_id: 2,
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    caption: 'Живая музыка по пятницам и современная русская кухня',
    action_url: '/place/2',
    expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'story-3',
    business_name: 'Бар «Лесная вечеринка»',
    place_id: 3,
    image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80',
    caption: 'Крафтовые коктейли и настольные игры',
    action_url: '/place/3',
    expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export function useStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: dbStories, error } = await supabase
          .from('stories')
          .select('*')
          .eq('is_active', true)
          .gte('expires_at', new Date().toISOString())
        if (error) throw error
        setStories((dbStories || []) as Story[])
      } else {
        setStories(MOCK_STORIES.filter((s) => s.is_active))
      }
    } catch {
      setStories(MOCK_STORIES.filter((s) => s.is_active))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { stories, loading, refresh: load }
}
