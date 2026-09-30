import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/discover', label: 'Найти' },
  { to: '/results', label: 'Маршруты' },
  { to: '/business', label: 'О проекте' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-brand">ВЕРСТА</span>
          <span className="hidden text-[10px] font-medium tracking-[0.2em] text-mist/40 sm:inline">
            LOCAL DISCOVERY
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/5 text-brand' : 'text-mist/60 hover:text-mist'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-mist/60 transition-colors hover:text-mist">
            Войти
          </button>
        </div>
      </div>
    </header>
  )
}
