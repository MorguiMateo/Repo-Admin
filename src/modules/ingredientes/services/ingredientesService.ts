import api from '../../../api/axiosInstance'
import type { Ingredient, IngredientForm } from '../types'
import type { PaginatedResponse } from '../../../shared/types'

// devuelve una promesa que cuando se resuelve te da una lista paginada de ingredientes
export async function getAll(params: { page?: number; size?: number }): Promise<PaginatedResponse<Ingredient>> {
  const { data } = await api.get('/ingredientes/', { params })
  return data
}

export async function create(body: IngredientForm): Promise<Ingredient> {
  const { data } = await api.post('/ingredientes/', body)
  return data
}

// Partial hace todos los campos de IngredientForm opcionales.
export async function update(id: number, body: Partial<IngredientForm>): Promise<Ingredient> {
  const { data } = await api.patch(`/ingredientes/${id}`, body)
  return data
}

// no devuelve ningún valor cuando se resuelve
export async function remove(id: number): Promise<void> {
  await api.delete(`/ingredientes/${id}`)
}
