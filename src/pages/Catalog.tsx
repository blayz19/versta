import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import PlaceCard from '../components/PlaceCard'
import { usePlaces } from '../hooks/usePlaces'
import type { Category } from '../types'

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const initialCategory = (searchParams.get('category') || '') as Category
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | ''>(initialCategory)

  const { categories, loading, error, search } = usePlaces()

  const filtered = useMemo(() => search(query, (activeCategory || undefined) as Category | undefined), [query, activeCategory, search])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="mx-auto h-16 w-16 rounded-full border border-glass bg-surface flex items-center justify-center text-mist-muted mb-6">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-mist mb-2">Загрузка мест…</h2>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-5xl mb-2">Каталог мест</h1>
          <p className="text-lg text-mist-soft/70">
            {filtered.length} мест
            {activeCategory ? ` в категории «${activeCategory}»` : ''}
            {query ? ` по запросу «${query}»` : ''}
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию, адресу…"
            className="w-full rounded-xl border border-glass bg-surface px-4 py-3.5 text-mist placeholder:text-mist-muted/50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 sm:mb-12 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
            !activeCategory
              ? 'border-brand bg-brand text-ink shadow-md shadow-brand/25'
              : 'border-glass bg-surface text-mist-soft hover:border-brand/40 hover:text-mist hover:bg-surface-hover'
          }`}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
              activeCategory === cat
                ? 'border-brand bg-brand text-ink shadow-md shadow-brand/25'
                : 'border-glass bg-surface text-mist-soft hover:border-brand/40 hover:text-mist hover:bg-surface-hover'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-glass bg-surface p-8 text-center text-mist-soft/60 mb-8">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-glass bg-surface p-16 sm:p-24 text-center">
          <div className="mx-auto h-24 w-24 rounded-full border border-glass bg-surface-hover flex items-center justify-center text-mist-muted mb-8">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-mist mb-3">Ничего не найдено</h2>
          <p className="text-mist-soft/60 mb-8">Попробуйте изменить запрос или категорию.</p>
          <Link to="/catalog" className="inline-flex items-center gap-2 text-brand hover:underline">
            Сбросить фильтры
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  )
}
