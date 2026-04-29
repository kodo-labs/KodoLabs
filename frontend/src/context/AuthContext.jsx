import { createContext, useContext, useState } from 'react'
import { signIn, signOut } from '../services/bookdeskRepository'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
