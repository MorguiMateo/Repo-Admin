// rol
export type RoleCode = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT'

export interface Role {
  codigo: RoleCode
  nombre: string
  descripcion: string | null
}

//usuario sin pass xq el back no la devuelve. trae los roles porque /auth/me los incluye
export interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  celular: string | null
  roles: RoleCode[]
  created_at: string
}

//lo que devuelve el GET /auth/me
export type AuthMeResponse = User

// formulario de login
export interface LoginForm {
  email: string
  password: string
}
