import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/axiosInstance'
import { useAuthStore } from '../../../store/authStore'
import { logout as logoutService } from '../services/authService'
import type { AuthMeResponse } from '../types'

//chequea si hay sesion al entrar a las rutas protegidas. lo usa AuthGate
export function useAuthInit() {
  const { setAuth, clearAuth } = useAuthStore()

  const { isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        //auth/me nos devuelve el usuario con su lista de roles
        const { data } = await api.get<AuthMeResponse>('/auth/me')
        setAuth(data, data.roles)
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

//  llama a POST /auth/logout, lpia la store y la cache y navega al login
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
