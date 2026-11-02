import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/discover', label: 'Подобрать' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/map', label: 'Карта' },
  { to: '/markers', label: 'Метки' },
  { to: '/challenges', label: 'Челленджи' },
]

export default function Header() {
  const { user, signOut, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-glass bg-ink/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-brand">ВЕРСТА</span>
          <span className="hidden text-[10px] font-medium tracking-[0.2em] text-mist-muted/60 sm:inline">
            ЛОКАЛЬНЫЙ ДИСКОВЕРИ
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-xs font-medium sm:text-sm transition-all ${
                  isActive
                    ? 'bg-brand text-ink shadow-lg shadow-brand/25'
                    : 'text-mist-soft/70 hover:text-brand hover:bg-surface'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <Link to="/auth" className="rounded-xl px-4 py-2 text-xs font-medium sm:text-sm transition-all border border-glass text-mist-soft/70 hover:text-brand hover:bg-surface hover:border-brand/40">
              Войти
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-mist-soft/70">{user?.nickname}</span>
              <button
                onClick={() => signOut().then(() => navigate('/'))}
                className="rounded-xl px-4 py-2 text-xs font-medium sm:text-sm transition-all border border-glass text-mist-soft/70 hover:text-brand hover:bg-surface hover:border-brand/40"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
