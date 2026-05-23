import api from '../../../api/axiosInstance'
import type { LoginForm } from '../types'

//login y logout con la info del formulario

export async function login(data: LoginForm): Promise<void> {
  await api.post('/auth/login', data)
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
