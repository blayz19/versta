import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import FilterChip from '../components/FilterChip'
import type { DiscoverFilters } from '../types'

const querySuggestions = [
  'Хочу необычный вечер',
  'Где провести свидание?',
  'Куда сходить с друзьями?',
  'Что делать в дождь?',
  'Хочу провести день интересно',
]

const timeOptions = ['< 1 часа', '1–2 часа', '2–4 часа', 'Весь день']
const budgetOptions = ['до 500 ₽', 'до 1 000 ₽', 'до 1 500 ₽', 'до 3 000 ₽', 'Неважно']
const companyOptions = ['Один', 'Пара', 'Друзья', 'Семья']
const formatOptions = ['Еда', 'Развлечения', 'Прогулка', 'Культура', 'Спорт', 'Необычные места', 'События']
const weatherOptions = ['Любая', 'Хорошая погода', 'Дождь', 'В помещении']

const defaultFilters: DiscoverFilters = {
  query: 'необычный вечер',
  time: '2–4 часа',
  budget: 'до 1 500 ₽',
  company: 'Пара',
  format: 'Необычные места',
  weather: 'Дождь',
}

export default function Discover() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('query') || defaultFilters.query

  const [filters, setFilters] = useState<DiscoverFilters>({ ...defaultFilters, query: initialQuery })

  const update = (key: keyof DiscoverFilters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value }))

  const handleSubmit = () => {
    navigate('/results', { state: { filters } })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-4xl">Что тебе нужно?</h1>
      <p className="mt-2 text-mist/50">Ответь на несколько вопросов — и мы подберём подходящие сценарии.</p>

      {/* Query */}
      <section className="mt-10">
        <label className="text-sm font-medium tracking-wider text-mist/40">ЗАПРОС</label>
        <input
          type="text"
          value={filters.query}
          onChange={(e) => update('query', e.target.value)}
          placeholder="Например: «Хочу необычный вечер»"
          className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-lg text-mist placeholder:text-mist/30 outline-none transition-colors focus:border-brand/50"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {querySuggestions.map((q) => (
            <FilterChip key={q} label={q} selected={filters.query === q} onClick={() => update('query', q)} />
          ))}
        </div>
      </section>

      {/* Time */}
      <section className="mt-8">
        <label className="text-sm font-medium tracking-wider text-mist/40">ВРЕМЯ</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {timeOptions.map((t) => (
            <FilterChip key={t} label={t} selected={filters.time === t} onClick={() => update('time', t)} />
          ))}
        </div>
      </section>

      {/* Budget */}
      <section className="mt-8">
        <label className="text-sm font-medium tracking-wider text-mist/40">БЮДЖЕТ</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {budgetOptions.map((b) => (
            <FilterChip key={b} label={b} selected={filters.budget === b} onClick={() => update('budget', b)} />
          ))}
        </div>
      </section>

      {/* Company */}
      <section className="mt-8">
        <label className="text-sm font-medium tracking-wider text-mist/40">КОМПАНИЯ</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {companyOptions.map((c) => (
            <FilterChip key={c} label={c} selected={filters.company === c} onClick={() => update('company', c)} />
          ))}
        </div>
      </section>

      {/* Format */}
      <section className="mt-8">
        <label className="text-sm font-medium tracking-wider text-mist/40">ФОРМАТ</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {formatOptions.map((f) => (
            <FilterChip key={f} label={f} selected={filters.format === f} onClick={() => update('format', f)} />
          ))}
        </div>
      </section>

      {/* Weather */}
      <section className="mt-8">
        <label className="text-sm font-medium tracking-wider text-mist/40">ПОГОДА</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {weatherOptions.map((w) => (
            <FilterChip key={w} label={w} selected={filters.weather === w} onClick={() => update('weather', w)} />
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="mt-12">
        <Button size="lg" className="w-full sm:w-auto" onClick={handleSubmit}>
          Найти для меня
        </Button>
      </div>
    </div>
  )
}
