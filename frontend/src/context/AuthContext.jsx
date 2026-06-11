import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, getUserFromSession, signIn, signOut } from '../services/bookdeskRepository'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    let active = true

    async function restoreSession() {
      const currentUser = await getCurrentUser()
      if (active) {
        setUser(currentUser)
        setLoading(false)
      }
    }

    restoreSession()
    if (!isSupabaseConfigured) return () => { active = false }

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return
      if (!session) {
        setUser(null)
        setLoading(false)
        return
      }
      setUser(await getUserFromSession(session))
      setLoading(false)
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function login(email, password) {
    const result = await signIn(email, password)
    if (result.ok) {
      setUser(result.user)
    }
    return result
  }

  async function logout() {
    await signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
