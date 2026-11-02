import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import { Link } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp, loading } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/profile'

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

  const handleGuest = async () => {
    setError('')
    try {
      await signIn('guest@versta.ru', 'guest123')
      navigate('/profile', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Не удалось войти как гость')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ink via-ink-soft to-ink px-4">
      <div className="max-w-md w-full">
        {/* Бренд */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-2xl font-bold tracking-tight text-brand">ВЕРСТА</span>
          <span className="text-[10px] font-medium tracking-[0.2em] text-mist-muted/50 uppercase">
            ЛОКАЛЬНЫЙ ДИСКОВЕРИ
          </span>
        </div>

        <div className="rounded-3xl border border-glass bg-surface p-8 sm:p-12 shadow-2xl shadow-black/50">
          <div className="flex justify-center items-baseline gap-2 mb-10">
            <button
              onClick={() => setMode('signin')}
              className={`px-6 py-2 text-lg font-bold transition-all ${
                mode === 'signin'
                  ? 'text-brand underline underline-offset-4'
                  : 'text-mist-soft hover:text-brand'
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`px-6 py-2 text-lg font-bold transition-all ${
                mode === 'signup'
                  ? 'text-brand underline underline-offset-4'
                  : 'text-mist-soft hover:text-brand'
              }`}
            >
              Регистрация
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl border border-brand/20 bg-brand/5 text-sm text-brand flex items-start gap-2">
              <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.859-3.077l-.306-.652c-.217-.46-.954-1.305-2.33-1.576a5.002 5.002 0 00-9.394 0c-1.376.271-2.113 1.116-2.33 1.576l-.306.652c-.644 1.41.319 3.077 1.859 3.077z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-mist-muted/70 mb-2">Email</label>
              <input
                type="email"
                required
                autoComplete={mode === 'signin' ? 'email' : 'new-email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-glass bg-surface px-4 py-3.5 text-mist placeholder:text-mist-muted/50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink transition-colors"
                placeholder="ivan@example.ru"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-mist-muted/70 mb-2">Пароль</label>
              <input
                type="password"
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-glass bg-surface px-4 py-3.5 text-mist placeholder:text-mist-muted/50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink transition-colors"
                placeholder="••••••••"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-mist-muted/70 mb-2">Имя / никнейм</label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full rounded-xl border border-glass bg-surface px-4 py-3.5 text-mist placeholder:text-mist-muted/50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink transition-colors"
                  placeholder="Иван"
                />
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {mode === 'signin' ? 'Войти в аккаунт' : 'Создать аккаунт'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-glass"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-mist-muted">или продолжить как</span>
              </div>
            </div>

            <Button
              onClick={handleGuest}
              variant="outline"
              size="lg"
              className="w-full mt-4"
              loading={loading}
            >
              Гость
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-mist-muted/50">
            Войти нужно, чтобы сохранять места, отмечать посещения и получать опыт.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="text-xs text-mist-muted hover:text-brand transition-colors underline underline-offset-4"
          >
            На главную без входа
          </Link>
        </div>
      </div>
    </div>
  )
}
