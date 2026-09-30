import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const quickScenarios = [
  { label: 'Свидание', query: 'свидание' },
  { label: 'Вечер с друзьями', query: 'друзья' },
  { label: 'Куда сходить одному', query: 'недорого' },
  { label: 'Семейный день', query: 'семья' },
  { label: 'Необычный вечер', query: 'необычный вечер' },
  { label: 'Недорого провести время', query: 'недорого' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
          <div className="max-w-2xl">
            <h1 className="animate-rise text-4xl font-bold leading-tight tracking-tight text-mist sm:text-5xl lg:text-6xl">
              Что тебе подходит{' '}
              <span className="text-brand">прямо сейчас?</span>
            </h1>
            <p className="animate-rise-1 mt-5 text-lg text-mist/60 sm:text-xl">
              Верста помогает найти места, события и готовые сценарии под твоё время, бюджет и настроение.
            </p>
            <div className="animate-rise-2 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button size="lg" onClick={() => navigate('/discover')}>
                Подобрать сценарий
              </Button>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-mist/40">Например:</span>
                <span className="text-sm text-mist/70">«Хочу необычный вечер»</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick scenarios */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="text-sm font-medium tracking-wider text-mist/40">БЫСТРЫЕ СЦЕНАРИИ</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickScenarios.map((s, i) => (
            <Link
              key={s.label}
              to={`/discover?query=${encodeURIComponent(s.query)}`}
              className={`animate-rise-${Math.min(i + 1, 3)} group rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-center transition-all duration-300 hover:border-brand/30 hover:bg-white/[0.04]`}
            >
              <span className="text-sm font-medium text-mist/70 group-hover:text-brand transition-colors">
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-sm font-medium tracking-wider text-mist/40">КАК ЭТО РАБОТАЕТ</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-5">
            {[
              { step: '01', title: 'Запрос', desc: 'Расскажи, что хочешь сделать' },
              { step: '02', title: 'Контекст', desc: 'Укажи время, бюджет и настроение' },
              { step: '03', title: 'Подбор', desc: 'Получи подходящие сценарии' },
              { step: '04', title: 'Маршрут', desc: 'Собери оптимальный путь' },
              { step: '05', title: 'Действие', desc: 'Позвони или забронируй' },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <span className="text-xs font-bold text-brand/50">{item.step}</span>
                <h3 className="mt-2 font-semibold text-mist">{item.title}</h3>
                <p className="mt-1 text-sm text-mist/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
