import type { RoleCode } from '../modules/auth/types'

export interface NavItem {
  to: string
  label: string
  roles: RoleCode[]
}

// Fuente de verdad de la navegación del panel. El orden define tanto el orden
// en el sidebar como la prioridad del landing por defecto (ver AdminIndex):
// el usuario aterriza en el primer item para el que tenga rol.
export const NAV_ITEMS: NavItem[] = [
  { to: '/admin/categorias',   label: 'Categorías',   roles: ['ADMIN'] },
  { to: '/admin/ingredientes', label: 'Ingredientes', roles: ['ADMIN'] },
  { to: '/admin/productos',    label: 'Productos',    roles: ['ADMIN', 'STOCK'] },
  { to: '/admin/pedidos',      label: 'Pedidos',      roles: ['ADMIN', 'PEDIDOS'] },
  { to: '/admin/usuarios',     label: 'Usuarios',     roles: ['ADMIN'] },
]
