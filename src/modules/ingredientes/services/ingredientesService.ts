import api from '../../../api/axiosInstance'
import type { Ingredient, IngredientForm } from '../types'
import type { PaginatedResponse } from '../../../shared/types'
import { toSkipLimit, wrapAsPage } from '../../../shared/types'

export async function getAll(
  params: { page?: number; size?: number; nombre?: string; es_alergeno?: boolean } = {},
): Promise<PaginatedResponse<Ingredient>> {
  const { page = 1, size = 20, nombre, es_alergeno } = params
  const { skip, limit } = toSkipLimit(page, size)
  const { data } = await api.get<Ingredient[]>('/ingredientes', {
    params: { skip, limit, nombre, es_alergeno },
  })
  return wrapAsPage(data, page, size)
}

export async function create(body: IngredientForm): Promise<Ingredient> {
  const { data } = await api.post('/ingredientes', body)
  return data
}

//va con PUT porque el back actualiza con el body completo
export async function update(id: number, body: Partial<IngredientForm>): Promise<Ingredient> {
  const { data } = await api.put(`/ingredientes/${id}`, body)
  return data
}

export async function remove(id: number): Promise<void> {
  await api.delete(`/ingredientes/${id}`)
}
