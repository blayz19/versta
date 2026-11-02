import { Link } from 'react-router-dom'
import { useStories } from '../hooks/useStories'
import { usePlaces } from '../hooks/usePlaces'
import PlaceCard from '../components/PlaceCard'
import StoryCard from '../components/StoryCard'

const quickScenarios = [
  { label: 'Свидание', query: 'свидание', desc: 'Уютно и по-романтичному' },
  { label: 'Вечер с друзьями', query: 'друзья', desc: 'Шумно, весело, вместе' },
  { label: 'Куда сходить одному', query: 'один', desc: 'Спокойствие и себя' },
  { label: 'Семейный день', query: 'семья', desc: 'Для взрослых и детей' },
  { label: 'Необычный вечер', query: 'необычный вечер', desc: 'Вне обыденного' },
  { label: 'Недорого провести время', query: 'недорого', desc: 'Без больших трат' },
]

export default function Home() {
  const { stories, loading: storiesLoading } = useStories()
  const { places, categories } = usePlaces()

  const featured = places.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-12 sm:py-24 lg:py-32">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand/10 blur-[140px]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-glass bg-surface px-3 py-1 text-xs font-medium text-brand mb-6">
              Город: Томск
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-mist sm:text-6xl lg:text-7xl leading-[1.1] mb-6">
              Что тебе подходит{' '}
              <span className="text-brand">прямо сейчас?</span>
            </h1>
            <p className="text-lg text-mist-soft/70 sm:text-xl mb-10 max-w-lg leading-relaxed">
              Открывай места в Томске, сохраняй понравившиеся, отмечай посещения и получай опыт.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/discover"
                className="rounded-xl border border-glass bg-surface px-8 py-4 text-sm font-medium text-mist-soft hover:border-brand/40 hover:text-brand hover:bg-surface transition-all text-center w-full sm:w-auto"
              >
                Подобрать сценарий
              </Link>
              <Link to="/catalog" className="flex items-center gap-2 rounded-xl border border-glass bg-surface px-6 py-4 text-sm font-medium text-mist-soft hover:border-brand/40 hover:text-brand transition-all">
                <span>Посмотреть все места</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
        <div className="flex items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <h2 className="text-sm font-medium tracking-wider text-mist-muted/60 uppercase mb-2">Что исследовать</h2>
            <h3 className="text-3xl font-bold text-mist sm:text-4xl">Категории мест</h3>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-16">
          {categories.map((cat) => {
            const count = places.filter((p) => p.category === cat).length
            return (
              <Link
                key={cat}
                to={`/catalog?category=${encodeURIComponent(cat)}`}
                className="group rounded-3xl border border-glass bg-surface p-5 sm:p-6 transition-all duration-300 hover:border-brand/40 hover:bg-surface-hover hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-2xl border border-glass bg-surface-hover flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-ink transition-colors">
                    {cat.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-mist group-hover:text-brand transition-colors">
                    {cat}
                  </span>
                </div>
                <span className="text-xs text-mist-muted/50">{count} мест</span>
              </Link>
            )
          })}
        </div>

        {featured.length > 0 && (
          <>
            <h3 className="text-sm font-medium tracking-wider text-mist-muted/60 uppercase mb-4">Рекомендуем</h3>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Истории бизнеса */}
      <section className="border-y border-glass bg-surface/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-sm font-medium tracking-wider text-mist-muted/60 uppercase mb-2">Истории бизнеса</h2>
              <h3 className="text-3xl font-bold text-mist sm:text-4xl">От заведений города</h3>
            </div>
          </div>
          {storiesLoading ? (
            <div className="h-64 flex items-center justify-center text-mist-muted">Загрузка…</div>
          ) : stories.length === 0 ? (
            <p className="text-mist-muted/50">Пока нет активных историй.</p>
          ) : (
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide sm:pb-8">
                {stories.map((s) => (
                  <StoryCard key={s.id} story={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Быстрые сценарии */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24 sm:pb-28">
        <h2 className="text-sm font-medium tracking-wider text-mist-muted/60 uppercase mb-6">Быстрые сценарии</h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickScenarios.map((s, i) => (
            <Link
              key={s.label}
              to={`/discover?query=${encodeURIComponent(s.query)}`}
              className={`animate-rise-${Math.min(i + 1, 3)} group rounded-3xl border border-glass bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-brand/40 hover:bg-surface-hover hover:-translate-y-1`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl border border-glass bg-surface-hover flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-ink transition-colors">
                  {String(i + 1)}
                </div>
                <span className="text-sm font-semibold text-mist group-hover:text-brand transition-colors">{s.label}</span>
              </div>
              <p className="text-xs text-mist-muted/50 leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
