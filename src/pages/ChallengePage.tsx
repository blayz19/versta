import { useParams, Link } from 'react-router-dom'
import { useChallenges } from '../hooks/useChallenges'
import { useUser } from '../hooks/useUser'
import PlaceCard from '../components/PlaceCard'
import type { Place } from '../types'

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>()
  const { challenges, loading, joinChallenge, placeById } = useChallenges()
  const { markVisit, visitedPlaceIds } = useUser()

  const challenge = challenges.find((c) => c.id === id)

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="mx-auto h-16 w-16 rounded-full border border-glass bg-surface flex items-center justify-center text-mist-muted mb-6">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-mist mb-2">Загрузка челленджа…</h2>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 text-center">
        <h1 className="text-3xl font-bold text-mist mb-4">Челлендж не найден</h1>
        <p className="text-mist-soft/60 mb-8">Такого челленджа нет.</p>
        <Link to="/challenges" className="inline-flex items-center gap-2 text-brand hover:underline">
          К списку челленджей
        </Link>
      </div>
    )
  }

  const { total, visited, percent } = getProgress(challenge, visitedPlaceIds)
  const places = challenge.place_ids
    .map((pid) => placeById(pid))
    .filter((p): p is Place => !!p)

  const handleVisit = async (placeId: number) => {
    const place = places.find((p) => p.id === placeId)
    if (place) await markVisit(place)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-start justify-between gap-4 mb-10 sm:mb-14">
        <div>
          <Link to="/challenges" className="rounded-xl border border-glass bg-surface px-4 py-2 text-xs sm:text-sm text-mist-soft hover:border-brand/40 hover:text-brand transition-all inline-block">
          Назад к челленджам
        </Link>
          <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-5xl mb-2">{challenge.title}</h1>
          <p className="text-lg text-mist-soft/70">{challenge.description}</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-mist-soft">
            <span>{challenge.start_at.slice(0, 10)} — {challenge.end_at.slice(0, 10)}</span>
            <span aria-hidden="true">·</span>
            <span>{total} мест</span>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <button
            onClick={() => joinChallenge(challenge)}
            className="rounded-xl border border-glass bg-surface px-4 py-2.5 text-sm font-medium text-mist-soft hover:border-brand/40 hover:text-brand transition-all"
          >
            Принять участие
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="rounded-xl border border-glass bg-surface px-4 py-2.5 text-sm font-medium text-mist-soft hover:border-brand/40 hover:text-brand transition-all"
          >
            Поделиться ссылкой
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-glass bg-surface p-6 sm:p-8 mb-10 sm:mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-mist">Ваш прогресс</h2>
            <p className="text-sm text-mist-soft/60">{visited} из {total} мест посещено</p>
          </div>
          <div className="w-full sm:w-64">
            <div className="flex justify-between text-xs text-mist-muted mb-1">
              <span>Завершено</span>
              <span>{percent}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3">
              <div className="bg-brand h-3 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
        {percent === 100 && (
          <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-brand mt-4">
            <p className="font-medium">Поздравляем! Вы прошли челлендж.</p>
          </div>
        )}
      </div>

      <div className="mb-10 sm:mb-14">
        <h2 className="text-sm font-medium tracking-wider text-mist-muted/60 uppercase mb-4">Места челленджа</h2>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              compact
              onVisit={() => handleVisit(place.id)}
              visited={visitedPlaceIds.has(place.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}



function getProgress(challenge: { place_ids: number[] }, visitedPlaceIds: Set<number>) {
  const total = challenge.place_ids.length
  const visited = challenge.place_ids.filter((pid) => visitedPlaceIds.has(pid)).length
  const percent = total ? Math.round((visited / total) * 100) : 0
  return { total, visited, percent }
}
