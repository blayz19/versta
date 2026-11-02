import { useMemo } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import RouteCard from '../components/RouteCard'
import { getTopScenarios } from '../hooks/useRecommendations'
import type { DiscoverFilters } from '../types'
import Button from '../components/Button'

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
  const navigate = useNavigate()
  const filters = (location.state as { filters?: DiscoverFilters })?.filters || defaultFilters

  const scenarios = useMemo(() => getTopScenarios(filters, 3), [filters])

  const budgetLabel = filters.budget === 'Неважно' ? 'бюджет не важен' : filters.budget.toLowerCase()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-5xl mb-2">Вот что подходит тебе сейчас</h1>
          <p className="text-lg text-mist-soft/70 leading-relaxed">
            {filters.time} · {budgetLabel} · для{' '}
            {filters.company.toLowerCase() === 'пара' ? 'двоих' : filters.company.toLowerCase()}
            {filters.weather !== 'Любая' && ` · ${filters.weather.toLowerCase()}`}
          </p>
        </div>
        <Link to="/discover" className="inline-flex items-center gap-2 rounded-xl border border-glass bg-surface px-4 py-2.5 text-sm font-medium text-mist-soft hover:border-brand/40 hover:text-brand transition-all">
          Изменить параметры
        </Link>
      </div>

      {scenarios.length === 0 ? (
        <div className="rounded-3xl border border-glass bg-surface p-16 sm:p-24 text-center">
          <div className="mx-auto h-24 w-24 rounded-full border border-glass bg-surface-hover flex items-center justify-center text-mist-muted mb-8">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-mist mb-3">Ничего не найдено</h2>
          <p className="text-mist-soft/60 max-w-md mx-auto mb-8">
            Попробуй изменить время, бюджет или формат — так откроются новые варианты.
          </p>
          <Button size="lg" onClick={() => navigate('/discover')}>
            Вернуться к подбору
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8">
          {scenarios.map((s, i) => (
            <RouteCard key={s.id} scenario={s} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
