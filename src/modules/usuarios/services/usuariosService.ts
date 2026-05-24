import api from '../../../api/axiosInstance'
import type { AdminUser, AssignRoleForm } from '../types'
import type { RoleCode } from '../../auth/types'
import type { PaginatedResponse } from '../../../shared/types'

//parametros aceptados por el endpoint. todos opcionales porq el back tiene valores por defaulkt
//cuando axios recibe un objeto en params lo serializa como query string ejemplo ?rol=ADMIN&page=1&size=20
export interface UsuarioFilters {
  rol?: RoleCode
  page?: number
  size?: number
}

// hacemos get y le pasa por parametros UsuarioFilters
// params le dice a axios que el objeto va como query string
export async function getAll(params: UsuarioFilters): Promise<PaginatedResponse<AdminUser>> {
  const { data } = await api.get('/usuarios/', { params })
  return data
}

//post al usuario x id con el body AssingRoleForm que tiene rol y fecha de expiracion opcional
export async function assignRole(id: number, body: AssignRoleForm): Promise<void> {
  await api.post(`/usuarios/${id}/roles`, body)
}

// hace delete del rol x id de usuairio
export async function removeRole(id: number, roleCode: RoleCode): Promise<void> {
  await api.delete(`/usuarios/${id}/roles/${roleCode}`)
}

// el back setea deleted_at = now() para no borrar el registro en la base de datos
export async function softDelete(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`)
}
