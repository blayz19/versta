import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Place, Category } from '../types'
import placesData from '../data/places.json'

const places = placesData as Place[]

const CATEGORY_ORDER: Category[] = [
  'Кафе',
  'Рестораны',
  'Бары',
  'Культура',
  'Развлечения',
  'Прогулки',
  'Спорт',
  'События',
  'Необычные места',
]

export function usePlaces() {
  const [data, setData] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: dbPlaces, error } = await supabase
          .from('places')
          .select('*')
          .eq('is_active', true)
        if (error) throw error
        setData((dbPlaces || []) as Place[])
      } else {
        setData(places.filter((p) => p.is_active))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить места')
      setData(places.filter((p) => p.is_active))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const categories = useMemo(() => {
    const catSet = new Set<Category>()
    data.forEach((p) => catSet.add(p.category))
    return CATEGORY_ORDER.filter((c) => catSet.has(c))
  }, [data])

  const search = useCallback((query: string, category?: Category) => {
    return data.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase())
      const matchesCat = !category || p.category === category
      return matchesQuery && matchesCat
    })
  }, [data])

  const getById = useCallback((id: number): Place | undefined => {
    return data.find((p) => p.id === id)
  }, [data])

  return {
    places: data,
    categories,
    loading,
    error,
    search,
    getById,
    refresh: load,
  }
}

export function useCategories() {
  const [items, setItems] = useState<Category[]>([])
  useEffect(() => {
    setItems(CATEGORY_ORDER)
  }, [])
  return items
}
