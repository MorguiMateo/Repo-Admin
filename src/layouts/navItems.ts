import type { RoleCode } from '../modules/auth/types'

export interface NavItem {
  to: string
  label: string
  roles: RoleCode[]
}

//define el orden del sidebar.
//label = texto que se mmuestra en sidebar
export const NAV_ITEMS: NavItem[] = [
  { to: '/admin/categorias',   label: 'Categorías',   roles: ['ADMIN'] },
  { to: '/admin/ingredientes', label: 'Ingredientes', roles: ['ADMIN'] },
  { to: '/admin/productos',    label: 'Productos',    roles: ['ADMIN', 'STOCK'] },
  { to: '/admin/pedidos',      label: 'Pedidos',      roles: ['ADMIN', 'PEDIDOS'] },
  { to: '/admin/usuarios',     label: 'Usuarios',     roles: ['ADMIN'] },
]
