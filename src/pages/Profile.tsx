import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../hooks/useUser'
import { usePlaces } from '../hooks/usePlaces'
import PlaceCard from '../components/PlaceCard'
import type { Place } from '../types'

export default function Profile() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { visits, saved, userAchievements, xp, level, loading: userLoading } = useUser()
  const { places, loading: placesLoading } = usePlaces()

  const [showVisits, setShowVisits] = useState(true)

  if (authLoading || userLoading || placesLoading || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-mist-soft">Загрузка профиля…</p>
      </div>
    )
  }

  const visitedPlaces: Place[] = visits
    .map((v) => places.find((p) => p.id === v.place_id))
    .filter((p): p is Place => !!p)

  const savedPlaces: Place[] = saved
    .map((s) => places.find((p) => p.id === s.place_id))
    .filter((p): p is Place => !!p)

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-5xl mb-2">Профиль</h1>
          <p className="text-lg text-mist-soft/70">{user.nickname}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 rounded-xl border border-glass bg-surface px-4 py-2.5 text-sm text-mist-soft transition-all hover:border-brand/40 hover:text-brand"
        >
          Выйти
        </button>
      </div>

      <div className="rounded-2xl border border-glass bg-surface p-6 sm:p-8 mb-10 sm:mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'}
              alt={user.nickname}
              className="w-24 h-24 rounded-full border-2 border-brand object-cover shadow-lg shadow-brand/25"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'
              }}
            />
            <div className="absolute bottom-0 right-0 flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-xs font-bold text-ink shadow-lg">
                {level}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-brand">{xp}</span>
              <span className="text-sm text-mist-muted">XP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="bg-brand h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((xp % 50) / 50) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-mist-muted">
                Уровень {level} • до следующего {50 - (xp % 50)} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl border border-glass bg-surface p-1 mb-8 sm:mb-12">
        <button
          onClick={() => setShowVisits(true)}
          className={`flex-1 py-2.5 text-sm font-medium transition-all rounded-lg ${
            showVisits ? 'bg-brand text-ink shadow-lg shadow-brand/25' : 'text-mist-soft hover:text-mist hover:bg-surface-hover'
          }`}
        >
          Посещённые ({visitedPlaces.length})
        </button>
        <button
          onClick={() => setShowVisits(false)}
          className={`flex-1 py-2.5 text-sm font-medium transition-all rounded-lg ${
            !showVisits ? 'bg-brand text-ink shadow-lg shadow-brand/25' : 'text-mist-soft hover:text-mist hover:bg-surface-hover'
          }`}
        >
          Сохранённые ({savedPlaces.length})
        </button>
      </div>

      {showVisits ? (
        <>
          <div className="mb-6">
            <h2 className="text-sm font-medium tracking-wider text-mist-muted/60 uppercase mb-3">Посещённые места</h2>
            <p className="text-sm text-mist-soft/60 mb-4">
              За первое посещение уникального места начисляется 10 XP. Повторное посещение не даёт опыта.
            </p>
            {visitedPlaces.length === 0 ? (
              <p className="text-mist-muted/50">Вы ещё не отметили ни одного места.</p>
            ) : (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visitedPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} compact />
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 sm:mt-16">
            <h2 className="text-sm font-medium tracking-wider text-mist-muted/60 uppercase mb-4">Достижения</h2>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { id: 'first_visit', title: 'Первое открытие', description: 'Посетил 1 место', icon: '🗺', value: 1 },
                { id: 'coffee_explorer', title: 'Кофейный исследователь', description: 'Посетил 3 места категории «Кафе»', icon: '☕', value: 3 },
                { id: 'culture_lover', title: 'Любитель искусства', description: 'Посетил 3 места категории «Культура»', icon: '🎨', value: 3 },
                { id: 'city_explorer', title: 'Городской исследователь', description: 'Посетил 5 уникальных мест', icon: '🏙', value: 5 },
                { id: 'challenge_collector', title: 'Коллекционер маршрутов', description: 'Выполнил 1 челлендж', icon: '🏆', value: 1 },
              ].map((a) => {
                const ua = userAchievements.find((x) => x.achievement_id === a.id)
                return (
                  <div key={a.id} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-colors ${
                    ua ? 'border-brand bg-brand/10' : 'border-white/5 bg-white/[0.02] text-mist-muted'
                  }`}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                      {a.icon}
                    </div>
                    <h4 className={`text-sm font-bold ${ua ? 'text-mist' : 'text-mist-muted/50'}`}>{a.title}</h4>
                    <p className="text-xs text-mist-muted/60 text-center leading-tight">{a.description}</p>
                    {ua && (
                      <span className="text-xs text-brand font-medium">Получено</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-sm font-medium tracking-wider text-mist-muted/60 uppercase mb-4">Сохранённые места</h2>
          {savedPlaces.length === 0 ? (
            <p className="text-mist-muted/50">У вас нет сохранённых мест.</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} compact />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
