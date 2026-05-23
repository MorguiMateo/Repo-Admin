import { useLocation } from 'react-router-dom'
import { useLogout } from '../modules/auth/hooks/useAuth'
import { useAuthStore } from '../store/authStore'

//record es tipado generico donde te deja definir el tipado de la clave y el valor del objeto.
const ROUTE_TITLES: Record<string, string> = {
  '/admin/categorias':   'Categorías',
  '/admin/ingredientes': 'Ingredientes',
  '/admin/productos':    'Productos',
  '/admin/pedidos':      'Pedidos',
  '/admin/usuarios':     'Usuarios',
}

export function Header() {
  const logout = useLogout()
  //solo necesitamos el user
  const { user } = useAuthStore()
  //solo necesitamos pathname
  const { pathname } = useLocation()

  //si no recibe path devuele admin. 
  const title = ROUTE_TITLES[pathname] ?? 'Admin'

  return (
    <header className="h-20 shrink-0 flex items-center justify-between px-6 border-b border-border bg-bg-sidebar">

{/* segun el path carga distinto titulo ej ingredientes */}
      <h1 className="text-xl font-bold text-text-primary">{title}</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary hidden sm:block">
          {/* si no hay name o apellido simplemeente no renderiza. no es que vaya a romper  */}
          {user?.nombre} {user?.apellido}
        </span>

        <button
          onClick={logout}
          className="text-sm text-text-muted hover:text-danger transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>

    </header>
  )
}
