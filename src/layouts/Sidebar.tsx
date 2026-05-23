import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const NAV_ITEMS = [
  { to: '/admin/categorias',   label: 'Categorías',  roles: ['ADMIN'] },
  { to: '/admin/ingredientes', label: 'Ingredientes', roles: ['ADMIN'] },
  { to: '/admin/productos',    label: 'Productos',    roles: ['ADMIN', 'STOCK'] },
  { to: '/admin/pedidos',      label: 'Pedidos',      roles: ['ADMIN', 'PEDIDOS'] },
  { to: '/admin/usuarios',     label: 'Usuarios',     roles: ['ADMIN'] },
] as const

export function Sidebar() {
  const { user, hasRole } = useAuthStore()

  const visibleItems = NAV_ITEMS.filter((item) =>
    hasRole([...item.roles])
  )

  return (
    <aside className="w-[280px] h-screen flex flex-col bg-bg-sidebar border-r border-border shrink-0">

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-border">
        <span className="text-xl font-bold text-text-primary">Repo Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-info-muted text-info border-l-2 border-info pl-[10px]'
                  : 'text-text-secondary hover:bg-bg-surface-2 hover:text-text-primary'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Usuario */}
      <div className="p-4 border-t border-border">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-text-primary">{user?.nombre}</span>
          <span className="text-xs text-text-muted">{user?.email}</span>
        </div>
      </div>

    </aside>
  )
}
