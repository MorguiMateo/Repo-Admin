import api from '../../../api/axiosInstance'
import type { Category, CategoryForm } from '../types'
import type { PaginatedResponse } from '../../../shared/types'
import { toSkipLimit, wrapAsPage } from '../../../shared/types'

export async function getAll(
  params: { page?: number; size?: number; parent_id?: number } = {},
): Promise<PaginatedResponse<Category>> {
  const { page = 1, size = 100, parent_id } = params
  const { skip, limit } = toSkipLimit(page, size)
  const { data } = await api.get<Category[]>('/categorias', {
    params: { skip, limit, parent_id },
  })
  return wrapAsPage(data, page, size)
}

export async function create(body: CategoryForm): Promise<Category> {
  const { data } = await api.post('/categorias', body)
  return data
}

// PUT porque el back recibe el body completo.
export async function update(id: number, body: Partial<CategoryForm>): Promise<Category> {
  const { data } = await api.put(`/categorias/${id}`, body)
  return data
}

export async function remove(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`)
}
