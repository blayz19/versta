import { Link } from 'react-router-dom'
import { useChallenges } from '../hooks/useChallenges'
import { useUser } from '../hooks/useUser'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'

export default function Challenges() {
  const { challenges, loading, isJoined, joinChallenge } = useChallenges()
  const { visitedPlaceIds } = useUser()
  const { isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="mx-auto h-16 w-16 rounded-full border border-glass bg-surface flex items-center justify-center text-mist-muted mb-6">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-mist mb-2">Загрузка челленджей…</h2>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-start justify-between gap-4 mb-10 sm:mb-14">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-5xl mb-2">Челленджи</h1>
          <p className="text-lg text-mist-soft/70">
            Примите участие в общем вызове, посетите места из списка и отслеживайте прогресс.
          </p>
        </div>
        <Link to="/" className="rounded-xl border border-glass bg-surface px-4 py-2.5 text-sm text-mist-soft hover:border-brand/40 hover:text-brand transition-all">
          На главную
        </Link>
      </div>

      {challenges.length === 0 ? (
        <div className="rounded-3xl border border-glass bg-surface p-16 sm:p-24 text-center">
          <div className="mx-auto h-24 w-24 rounded-full border border-glass bg-surface-hover flex items-center justify-center text-mist-muted mb-8">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-mist mb-3">Активных челленджей нет</h2>
          <p className="text-mist-soft/60 mb-8">Следите за обновлениями.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => {
            const joined = isJoined(challenge.id)
            const { total, visited, percent } = getProgress(challenge, visitedPlaceIds)
            return (
              <div key={challenge.id} className="rounded-2xl border border-glass bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-brand/40 hover:bg-surface-hover">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 border border-brand/30 px-2.5 py-1 text-xs font-semibold text-brand backdrop-blur-sm">
                      Активен
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-mist leading-snug">{challenge.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-mist-soft/60 mb-6 line-clamp-2">{challenge.description}</p>
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-mist-muted mb-1">
                    <span>Мест в челлендже</span>
                    <span>{total}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div className="bg-brand h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-mist-muted/60">
                    Прогресс: {visited} из {total}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/challenge/${challenge.id}`}
                    className="flex-1 rounded-xl border border-glass bg-surface px-4 py-2.5 text-sm font-medium text-mist-soft hover:border-brand/40 hover:text-brand transition-all text-center"
                  >
                    Открыть прогресс
                  </Link>
                  {!joined && (
                    <Button
                      onClick={() => joinChallenge(challenge)}
                      variant="outline"
                      className="flex-1"
                      disabled={!isAuthenticated}
                    >
                      Принять участие
                    </Button>
                  )}
                </div>
                {!joined && !isAuthenticated && (
                  <p className="mt-4 text-xs text-mist-muted/50 text-center">
                    Войдите, чтобы участвовать и отслеживать прогресс.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function getProgress(challenge: { place_ids: number[] }, visitedPlaceIds: Set<number>) {
  const total = challenge.place_ids.length
  const visited = challenge.place_ids.filter((pid) => visitedPlaceIds.has(pid)).length
  const percent = total ? Math.round((visited / total) * 100) : 0
  return { total, visited, percent }
}
