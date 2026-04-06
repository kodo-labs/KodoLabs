import { createContext, useContext, useState } from 'react'
import { USERS } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login(email, password) {
    const found = USERS.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      return { ok: true }
    }
    return { ok: false, error: 'Credenciales incorrectas.' }
  }

  function logout() {
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
