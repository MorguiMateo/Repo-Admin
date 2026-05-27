import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { NAV_ITEMS } from './navItems'

//Filtra NAV_ITEMS con hasrole para mostrar solo los modulos accesibles al usuario.
//NavLink aplica la clase isActive automaticamente cuando la ruta coincide. 
export function Sidebar() {
  const { user, hasRole } = useAuthStore()

  const visibleItems = NAV_ITEMS.filter((item) => hasRole(item.roles))

  return (
    <aside className="w-[240px] h-full flex flex-col bg-bg-sidebar border-r border-border shrink-0">

      <div className="h-16 flex items-center px-5 border-b border-border">
        <span className="text-base font-semibold text-text-primary">Repo Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm ${
                isActive
                  ? 'bg-bg-surface-2 text-text-primary'
                  : 'text-text-secondary'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
{/*  info usuario que trae del store de zustand */}
      <div className="px-5 py-4 border-t border-border">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-text-primary truncate">{user?.nombre}</span>
          <span className="text-xs text-text-muted truncate">{user?.email}</span>
        </div>
      </div>

    </aside>
  )
}
