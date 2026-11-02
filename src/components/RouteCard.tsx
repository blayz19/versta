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
      className="group block overflow-hidden rounded-3xl border border-glass bg-surface transition-all duration-300 hover:border-brand/40 hover:bg-surface-hover hover:-translate-y-1"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium tracking-wider text-brand/60 uppercase">
              Сценарий №{index + 1}
            </span>
            <h3 className="mt-1.5 text-xl font-bold text-mist sm:text-2xl group-hover:text-brand transition-colors leading-snug">
              {scenario.name}
            </h3>
          </div>
          <span className="rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-semibold text-brand">
            Подходит под запрос
          </span>
        </div>

        <p className="mt-3 text-sm text-mist-soft/60 leading-relaxed">{scenario.description}</p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5 text-sm">
          <span className="text-mist-soft/70">{scenario.time}</span>
          <span className="font-bold text-brand">до {scenario.budget.toLocaleString('ru-RU')} ₽</span>
          <span className="text-mist-muted/60">{scenario.places_count} места</span>
          <span className="text-mist-muted/60">{scenario.distance}</span>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-brand hover:text-brand/90 transition-colors cursor-pointer">
          <span>Открыть маршрут</span>
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
