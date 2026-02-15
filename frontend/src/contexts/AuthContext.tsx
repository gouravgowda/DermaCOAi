import { createContext, useContext, useState, type ReactNode } from 'react'

export type UserRole = 'doctor' | 'asha'

export interface User {
  id: string
  name: string
  role: UserRole
  phcId: string
}

interface AuthContextType {
  user: User | null
  login: (role: UserRole) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('demo_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (role: UserRole) => {
    const mockUser: User = {
      id: role === 'doctor' ? 'doc_123' : 'asha_456',
      name: role === 'doctor' ? 'Dr. Leena Verma' : 'Smt. Anjali Devi',
      role: role,
      phcId: 'PHC_GUJ_001'
    }
    localStorage.setItem('demo_user', JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const logout = () => {
    localStorage.removeItem('demo_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
