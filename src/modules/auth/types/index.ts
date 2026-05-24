// rol
export type RoleCode = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT'

export interface Role {
  codigo: RoleCode
  nombre: string
  descripcion: string | null
}

// Usuario sin pass xq no devuelve el back. Incluye roles porque /auth/me
// devuelve un UserPublic plano con la lista de roles incluida.
export interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  celular: string | null
  roles: RoleCode[]
  created_at: string
}

// Respuesta de GET /auth/me: UserPublic plano.
export type AuthMeResponse = User

// formulario de login
export interface LoginForm {
  email: string
  password: string
}
