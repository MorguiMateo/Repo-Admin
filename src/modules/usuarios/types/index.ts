import type { RoleCode } from '../../auth/types'

// tabla junction UsuarioRol
export interface UserRole {
  usuario_id: number
  rol_codigo: RoleCode
  asignado_por_id: number | null
  expires_at: string | null
  created_at: string
}

// usuario visto desde el panel de admin — incluye sus roles
export interface AdminUser {
  id: number
  nombre: string
  apellido: string
  email: string
  celular: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  roles: RoleCode[]
}

// formulario para asignar un rol a un usuario (el back recibe la lista completa final)
export interface AssignRoleForm {
  rol_codigo: Exclude<RoleCode, 'ADMIN'>
}

// formulario para crear un nuevo usuario desde el panel de admin
export interface CreateUserForm {
  nombre: string
  apellido: string
  email: string
  password: string
  celular: string
  rol: Exclude<RoleCode, 'ADMIN'>
}
