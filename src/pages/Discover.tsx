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

type FilterSection = {
  key: keyof DiscoverFilters
  label: string
  options: string[]
}

const sections: FilterSection[] = [
  { key: 'query', label: 'Запрос', options: querySuggestions },
  { key: 'time', label: 'Время', options: timeOptions },
  { key: 'budget', label: 'Бюджет', options: budgetOptions },
  { key: 'company', label: 'Компания', options: companyOptions },
  { key: 'format', label: 'Формат', options: formatOptions },
  { key: 'weather', label: 'Погода', options: weatherOptions },
]

export default function Discover() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('query') || defaultFilters.query

  const [filters, setFilters] = useState<DiscoverFilters>({ ...defaultFilters, query: initialQuery })
  const [activeSection, setActiveSection] = useState<string>('query')

  const update = (key: keyof DiscoverFilters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value }))

  const handleSubmit = () => {
    navigate('/results', { state: { filters } })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 sm:mb-16">
        <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-5xl mb-4">Что тебе нужно?</h1>
        <p className="text-lg text-mist-soft/70 max-w-xl">
          Ответь на несколько вопросов — и мы подберем сценарии, которые точно попадают в твои интересы.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const isQuery = section.key === 'query'
          const isOpen = activeSection === section.key || isQuery
          return (
            <section
              key={section.key}
              className="rounded-2xl border border-glass bg-surface transition-all duration-300 hover:border-brand/40 hover:bg-surface-hover"
            >
              <button
                onClick={() => setActiveSection(section.key)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border-b border-glass/50 bg-surface px-5 py-4 sm:px-6 sm:py-5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium tracking-wider uppercase text-mist-muted/60">
                    {section.label}
                  </span>
                </div>
                {isQuery && (
                  <span className="text-sm font-medium text-mist-soft">{filters.query}</span>
                )}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-mist-muted/50`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="border-t border-glass/50 px-5 py-5 sm:px-6 sm:py-6">
                  {isQuery ? (
                    <>
                      <input
                        type="text"
                        value={filters.query}
                        onChange={(e) => update('query', e.target.value)}
                        placeholder="Например: «Хочу необычный вечер»"
                        className="mt-3 w-full rounded-xl border border-glass bg-surface-hover px-4 py-3 text-lg text-mist placeholder:text-mist-muted/50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink transition-colors"
                      />
                      <div className="mt-4 flex flex-wrap gap-2">
                        {querySuggestions.map((q) => (
                          <FilterChip
                            key={q}
                            label={q}
                            selected={filters.query === q}
                            onClick={() => update('query', q)}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {section.options.map((opt) => (
                        <FilterChip
                          key={opt}
                          label={opt}
                          selected={filters[section.key] === opt}
                          onClick={() => update(section.key, opt)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )
        })}
      </div>

      <div className="mt-12 sm:mt-16 pt-8 border-t border-glass">
        <Button size="lg" className="w-full sm:w-auto" onClick={handleSubmit}>
          Подобрать сценарии для меня
        </Button>
        <p className="mt-4 text-xs text-mist-muted/50 text-center">
          Мы подберем до 3 вариантов под твой запрос, время и бюджет.
        </p>
      </div>
    </div>
  )
}
