import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Profile } from '../types'

interface AuthContextType {
  user: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nickname: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_KEY = 'versta_users'
const CURRENT_USER_KEY = 'versta_current_user'

function getUsers(): Record<string, { email: string; password: string; profile: Profile }> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveUsers(users: Record<string, { email: string; password: string; profile: Profile }>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (raw) {
      try {
        setUser(JSON.parse(raw) as Profile)
      } catch {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const users = getUsers()
    const found = Object.values(users).find((u) => u.email === email && u.password === password)
    if (!found) throw new Error('Неверный email или пароль')
    setUser(found.profile)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found.profile))
  }, [])

  const signUp = useCallback(async (email: string, password: string, nickname: string) => {
    const users = getUsers()
    if (Object.values(users).some((u) => u.email === email)) {
      throw new Error('Пользователь с таким email уже зарегистрирован')
    }

    const id = 'user-' + Math.random().toString(36).slice(2, 9)
    const profile: Profile = {
      id,
      nickname: nickname || email.split('@')[0] || 'Пользователь',
      created_at: new Date().toISOString(),
      xp: 0,
      level: 1,
    }

    const nextUsers = { ...users, [id]: { email, password, profile } }
    saveUsers(nextUsers)

    setUser(profile)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile))
  }, [])

  const signOut = useCallback(async () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }, [])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return

    const users = getUsers()
    const userKey = Object.keys(users).find((k) => users[k].profile.id === user.id)
    if (!userKey) return

    const nextProfile: Profile = { ...user, ...updates }
    users[userKey].profile = nextProfile
    saveUsers(users)

    setUser(nextProfile)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextProfile))
  }, [user])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
