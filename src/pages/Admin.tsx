import { useState } from 'react'
import { getAllPlaces } from '../hooks/useRecommendations'
import { getAllRoutes } from '../hooks/useRoute'

type Tab = 'places' | 'routes' | 'leads'

const mockLeads = [
  { id: 1, name: 'Иван', company: 'Кофейня «Север»', phone: '+7 900 123-45-67', email: 'ivan@sever.ru', message: 'Хотим попасть в сценарии' },
  { id: 2, name: 'Мария', company: 'Ресторан «Томь»', phone: '+7 900 234-56-78', email: 'maria@tom.ru', message: 'Нужна аналитика' },
]

export default function Admin() {
  const [tab, setTab] = useState<Tab>('places')
  const places = getAllPlaces()
  const routes = getAllRoutes()

  const tabs: { key: Tab; label: string }[] = [
    { key: 'places', label: 'Места' },
    { key: 'routes', label: 'Сценарии' },
    { key: 'leads', label: 'Заявки бизнеса' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-mist">Админ-панель</h1>

      <div className="mt-6 flex gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              tab === t.key ? 'bg-brand text-ink' : 'text-mist/50 hover:text-mist'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'places' && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-left text-mist/40">
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Категория</th>
                <th className="px-4 py-3 font-medium">Цена</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {places.map((p) => (
                <tr key={p.id} className="border-b border-white/5 text-mist/70">
                  <td className="px-4 py-3 font-medium text-mist">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{p.price_max > 0 ? `${p.price_min}–${p.price_max} ₽` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? 'bg-brand/10 text-brand' : 'bg-white/5 text-mist/40'}`}>
                      {p.is_active ? 'Активно' : 'Неактивно'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-brand hover:underline cursor-pointer">Редактировать</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'routes' && (
        <div className="mt-6 space-y-3">
          {routes.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div>
                <h3 className="font-semibold text-mist">{r.name}</h3>
                <p className="mt-1 text-sm text-mist/50">{r.description}</p>
              </div>
              <span className="text-sm text-mist/40">{r.points.length} точки</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'leads' && (
        <div className="mt-6 space-y-3">
          {mockLeads.map((l) => (
            <div key={l.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-mist">{l.company}</h3>
                <span className="text-xs text-mist/40">#{l.id}</span>
              </div>
              <p className="mt-1 text-sm text-mist/50">{l.name} · {l.phone} · {l.email}</p>
              <p className="mt-2 text-sm text-mist/60">{l.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
