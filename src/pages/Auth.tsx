import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp, loading } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password, nickname)
      }
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-glass bg-surface p-8 sm:p-12 shadow-2xl shadow-black/40">
        <div className="flex items-baseline gap-2 mb-8">
          <h2 className="text-2xl font-bold text-mist">{mode === 'signin' ? 'Войти' : 'Регистрация'}</h2>
          <span className="text-xs text-mist-muted">Верста · Томск</span>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl border border-brand/20 bg-brand/5 text-sm text-brand">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-mist-muted/70 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-glass bg-surface px-4 py-3 text-mist placeholder:text-mist-muted/50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-mist-muted/70 mb-2">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-glass bg-surface px-4 py-3 text-mist placeholder:text-mist-muted/50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              placeholder="••••••••"
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-mist-muted/70 mb-2">Имя / никнейм</label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-xl border border-glass bg-surface px-4 py-3 text-mist placeholder:text-mist-muted/50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                placeholder="Иван"
              />
            </div>
          )}
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            {mode === 'signin' ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-mist-muted/60">
          Ещё нет аккаунта?
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-brand font-medium hover:underline ml-1"
          >
            {mode === 'signin' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
        <p className="mt-4 text-center text-xs text-mist-muted/50">
          Входите, чтобы сохранять места, отмечать посещения и получать опыт.
        </p>
      </div>
    </div>
  )
}
