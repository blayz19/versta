import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import RouteCard from '../components/RouteCard'
import { getTopScenarios } from '../hooks/useRecommendations'
import type { DiscoverFilters } from '../types'

const defaultFilters: DiscoverFilters = {
  query: 'необычный вечер',
  time: '2–4 часа',
  budget: 'до 1 500 ₽',
  company: 'Пара',
  format: 'Необычные места',
  weather: 'Дождь',
}

export default function Results() {
  const location = useLocation()
  const filters = (location.state as { filters?: DiscoverFilters })?.filters || defaultFilters

  const scenarios = useMemo(() => getTopScenarios(filters, 3), [filters])

  const budgetLabel = filters.budget === 'Неважно' ? 'бюджет не важен' : filters.budget.toLowerCase()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-4xl">
        Вот что подходит тебе сейчас
      </h1>
      <p className="mt-2 text-mist/50">
        {filters.time} · {budgetLabel} · для {filters.company.toLowerCase() === 'пара' ? 'двоих' : filters.company.toLowerCase()}
        {filters.weather !== 'Любая' && ` · ${filters.weather.toLowerCase()}`}
      </p>

      <div className="mt-8 space-y-4">
        {scenarios.map((s, i) => (
          <RouteCard key={s.id} scenario={s} index={i} />
        ))}
      </div>

      {scenarios.length === 0 && (
        <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
          <p className="text-mist/50">Не нашли подходящих сценариев. Попробуй изменить параметры.</p>
        </div>
      )}
    </div>
  )
}
