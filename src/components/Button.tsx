import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink'

const variants = {
  primary: 'bg-brand text-ink hover:bg-brand/90 active:scale-[0.98] shadow-lg shadow-brand/25',
  secondary: 'bg-brand-dim text-mist hover:bg-brand-dim/80 active:scale-[0.98] border border-brand/20',
  ghost: 'bg-transparent text-mist/70 hover:text-mist hover:bg-surface active:scale-[0.98]',
  outline: 'bg-transparent border border-glass text-mist hover:border-brand/40 hover:text-brand hover:bg-surface active:scale-[0.98]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-9 py-4 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...rest}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin text-ink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && children}
    </button>
  )
}
