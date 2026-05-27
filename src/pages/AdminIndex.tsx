import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { NAV_ITEMS } from '../layouts/navItems'
import ForbiddenPage from './ForbiddenPage'

// Redirige al primer módulo que el usuario
// puede ver según sus roles. 
export default function AdminIndex() {
  const hasRole = useAuthStore((s) => s.hasRole)
  const target = NAV_ITEMS.find((item) => hasRole(item.roles))

  if (!target) return <ForbiddenPage />
  return <Navigate to={target.to} replace />
}
