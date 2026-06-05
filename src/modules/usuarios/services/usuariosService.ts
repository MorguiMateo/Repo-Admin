import api from '../../../api/axiosInstance'
import type { AdminUser, CreateUserForm } from '../types'
import type { RoleCode } from '../../auth/types'
import type { PaginatedResponse } from '../../../shared/types'
import { toSkipLimit, wrapAsPage } from '../../../shared/types'

// filtros aceptados. todo opcional porque el back tiene defaults.
export interface UsuarioFilters {
  rol?: RoleCode
  q?: string
  page?: number
  size?: number
}

// GET /admin/usuarios
export async function getAll(params: UsuarioFilters): Promise<PaginatedResponse<AdminUser>> {
  const { page = 1, size = 100, rol, q } = params
  const { skip, limit } = toSkipLimit(page, size)
  const { data } = await api.get<AdminUser[]>('/admin/usuarios', {
    params: { skip, limit, rol, q },
  })
  return wrapAsPage(data, page, size)
}

// PATCH /admin/usuarios/{id}/roles — reemplaza la lista completa de roles del usuario.
// El back exige `roles` con min length 1; el caller arma la lista final.
export async function setRoles(id: number, roles: RoleCode[]): Promise<AdminUser> {
  const { data } = await api.patch(`/admin/usuarios/${id}/roles`, { roles })
  return data
}

// DELETE /admin/usuarios/{id} — soft delete (setea deleted_at = now()).
export async function softDelete(id: number): Promise<void> {
  await api.delete(`/admin/usuarios/${id}`)
}

// POST /auth/register + PATCH /admin/usuarios/{id}/roles si el rol no es CLIENT.
// El register siempre asigna CLIENT; si se eligió otro rol lo reemplazamos.
export async function createUser(form: CreateUserForm): Promise<AdminUser> {
  const { rol, celular, ...registerData } = form
  const { data: newUser } = await api.post<AdminUser>('/auth/register', {
    ...registerData,
    celular: celular || null,
  })
  if (rol !== 'CLIENT') {
    const { data: updated } = await api.patch<AdminUser>(`/admin/usuarios/${newUser.id}/roles`, { roles: [rol] })
    return updated
  }
  return newUser
}
