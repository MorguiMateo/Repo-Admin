import { Navigate, Outlet } from 'react-router-dom'
import { useAuthInit } from '../../modules/auth/hooks/useAuth'
import { useAuthStore } from '../../store/authStore'

export function AuthGate() {
  const { loading } = useAuthInit()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (loading) {
    return (
      <p className="flex h-screen items-center justify-center text-text-muted">
        Cargando…
      </p>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  //si esta cargado renderiza outlet q es el componente fhiijo
  return <Outlet />
}
