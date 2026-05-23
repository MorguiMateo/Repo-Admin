// rol
export type RoleCode = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT'

export interface Role {
  codigo: RoleCode
  nombre: string
  descripcion: string | null
}

// Usuario sin pass xq no devuelve el back
export interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  celular: string | null
  created_at: string
  updated_at: string
}

// Respuesta de GET /auth/me
export interface AuthMeResponse {
  usuario: User
  roles: RoleCode[]
}

// formulario de login
export interface LoginForm {
  email: string
  password: string
}
