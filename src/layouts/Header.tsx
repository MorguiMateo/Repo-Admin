import { useLocation } from 'react-router-dom'
import { useLogout } from '../modules/auth/hooks/useAuth'
import { useAuthStore } from '../store/authStore'

//record es para especificar el tipo de la key value de un objeto
const ROUTE_TITLES: Record<string, string> = {
  '/admin/categorias':   'Categorías',
  '/admin/ingredientes': 'Ingredientes',
  '/admin/productos':    'Productos',
  '/admin/pedidos':      'Pedidos',
  '/admin/usuarios':     'Usuarios',
}

//muestra el titulo de la seccion actual y el boton de logout
export function Header() {
  const logout = useLogout()
  const { user } = useAuthStore()
  const { pathname } = useLocation()

  const title = ROUTE_TITLES[pathname] ?? 'Admin'

  return (
    <header className="h-16 shrink-0 flex items-center justify-between gap-4 px-8 border-b border-border">
      <h1 className="text-base font-semibold text-text-primary">{title}</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary hidden sm:block">
          {user?.nombre} {user?.apellido}
        </span>

        <button
          onClick={logout}
          className="text-sm text-text-secondary cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
