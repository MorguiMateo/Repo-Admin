import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { NAV_ITEMS } from '../layouts/navItems'
import ForbiddenPage from './ForbiddenPage'

// Landing por defecto de /admin. Redirige al primer módulo que el usuario
// puede ver según sus roles. Antes redirigía siempre a /admin/categorias
// (solo ADMIN), por lo que un usuario STOCK o PEDIDOS caía en el 403.
export default function AdminIndex() {
  const hasRole = useAuthStore((s) => s.hasRole)
  const target = NAV_ITEMS.find((item) => hasRole(item.roles))

  if (!target) return <ForbiddenPage />
  return <Navigate to={target.to} replace />
}
