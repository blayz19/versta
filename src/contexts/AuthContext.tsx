import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
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

const MOCK_KEY = 'versta_mock_user'

function getMockUser(): Profile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(MOCK_KEY)
    return raw ? (JSON.parse(raw) as Profile) : null
  } catch {
    return null
  }
}

function setMockUser(user: Profile | null) {
  if (typeof window === 'undefined') return
  if (user) localStorage.setItem(MOCK_KEY, JSON.stringify(user))
  else localStorage.removeItem(MOCK_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setUser({
            id: data.user.id,
            nickname: data.user.user_metadata?.nickname || data.user.email || 'Пользователь',
            avatar_url: data.user.user_metadata?.avatar_url,
            created_at: data.user.created_at,
          })
        }
        setLoading(false)
      })

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            nickname: session.user.user_metadata?.nickname || session.user.email || 'Пользователь',
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
          })
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      })
      return () => authListener?.subscription.unsubscribe()
    } else {
      setUser(getMockUser())
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } else {
      // Mock sign-in: create or find a local profile
      const mock: Profile = {
        id: 'mock-' + Math.random().toString(36).slice(2),
        nickname: email.split('@')[0],
        created_at: new Date().toISOString(),
        xp: 0,
        level: 1,
      }
      setMockUser(mock)
      setUser(mock)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, nickname: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname } },
      })
      if (error) throw error
    } else {
      const mock: Profile = {
        id: 'mock-' + Math.random().toString(36).slice(2),
        nickname,
        created_at: new Date().toISOString(),
        xp: 0,
        level: 1,
      }
      setMockUser(mock)
      setUser(mock)
    }
  }, [])

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    } else {
      setMockUser(null)
      setUser(null)
    }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
      if (error) throw error
      setUser({ ...user, ...updates })
    } else {
      const next: Profile = { ...user, ...updates }
      setMockUser(next)
      setUser(next)
    }
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
