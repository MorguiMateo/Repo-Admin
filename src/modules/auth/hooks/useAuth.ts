import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/axiosInstance'
import { useAuthStore } from '../../../store/authStore'
import { logout as logoutService } from '../services/authService'
import type { AuthMeResponse } from '../types'

// Comprueba la sesion al entrar a rutas protegidas. Lo usa AuthGate.
export function useAuthInit() {
  const { setAuth, clearAuth } = useAuthStore()

  const { isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const { data } = await api.get<AuthMeResponse>('/auth/me')
        setAuth(data.usuario, data.roles)
        return data
      } catch (error) {
        clearAuth()
        throw error
      }
    },
    retry: false,
    staleTime: Infinity,
  })

  return { loading: isLoading }
}

// Devuelve handler de logout: API, limpia store/caché y redirige a /login.
export function useLogout() {
  const { clearAuth } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return async () => {
    try {
      await logoutService()
    } finally {
      clearAuth()
      queryClient.removeQueries({ queryKey: ['auth', 'me'] })
      navigate('/login', { replace: true })
    }
  }
}
