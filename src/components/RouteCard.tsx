import { Link } from 'react-router-dom'
import type { Scenario } from '../types'

interface RouteCardProps {
  scenario: Scenario
  index: number
}

export default function RouteCard({ scenario, index }: RouteCardProps) {
  return (
    <Link
      to={`/route/${scenario.route_id}`}
      className="group block overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-brand/30 hover:bg-white/[0.04]"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium tracking-wider text-brand/60">СЦЕНАРИЙ №{index + 1}</span>
            <h3 className="mt-1 text-lg font-semibold text-mist group-hover:text-brand transition-colors">
              {scenario.name}
            </h3>
          </div>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            Подходит под ваш запрос
          </span>
        </div>

        <p className="mt-2 text-sm text-mist/50">{scenario.description}</p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <span className="text-mist/70">{scenario.time}</span>
          <span className="font-semibold text-brand">до {scenario.budget.toLocaleString('ru-RU')} ₽</span>
          <span className="text-mist/50">{scenario.places_count} места</span>
          <span className="text-mist/50">{scenario.distance}</span>
        </div>

        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-brand">
          <span>Посмотреть маршрут</span>
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
