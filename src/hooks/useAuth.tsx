import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, Role, Volunteer, Admin } from '@/types'
import { mockVolunteers, mockAdmins, allUsers } from '@/data/mock-users'

interface AuthContextType {
  currentUser: User | null
  role: Role | null
  isAuthenticated: boolean
  login: (userId: string) => void
  logout: () => void
  switchRole: () => void
  volunteers: Volunteer[]
  admins: Admin[]
}

const AuthContext = createContext<AuthContextType | null>(null)

function getInitialUser(): User | null {
  const stored = localStorage.getItem('auth_user_id')
  if (stored) {
    return allUsers.find((u) => u.id === stored) ?? null
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(getInitialUser)

  const login = useCallback((userId: string) => {
    const user = allUsers.find((u) => u.id === userId) ?? null
    setCurrentUser(user)
    if (user) {
      localStorage.setItem('auth_user_id', user.id)
    }
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem('auth_user_id')
  }, [])

  const switchRole = useCallback(() => {
    if (!currentUser) return
    if (currentUser.role === 'volunteer') {
      login(mockAdmins[0].id)
    } else {
      login(mockVolunteers[0].id)
    }
  }, [currentUser, login])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role ?? null,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
        volunteers: mockVolunteers,
        admins: mockAdmins,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
