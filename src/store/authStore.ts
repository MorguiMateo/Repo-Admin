//estado global de la sesion (usuario + roles)
import { create } from 'zustand'
import type { User, RoleCode } from '../modules/auth/types'

interface AuthState {
  user: User | null
  roles: RoleCode[]
  isAuthenticated: boolean

  setAuth: (user: User, roles: RoleCode[]) => void
  clearAuth: () => void
  /* true si tiene al menos uno  */
  hasRole: (allowed: RoleCode[]) => boolean
}

//Guarda el estado de sesion en memoria del cliente.
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  roles: [],
  isAuthenticated: false,

  setAuth: (user, roles) => set({ user, roles, isAuthenticated: true }),

  clearAuth: () => set({ user: null, roles: [], isAuthenticated: false }),

  hasRole: (allowed) => get().roles.some((r) => allowed.includes(r)),
}))