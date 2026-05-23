// funciones que hablan con la API de categorías.los componentes no llaman a api directamente, siempre pasan por acá
import api from '../../../api/axiosInstance'
import type { Category, CategoryForm } from '../types'
import type { PaginatedResponse } from '../../../shared/types'

// devuelve una promesa que cuando se resuelve te da una lista paginada de categorías
export async function getAll(params: { page?: number; size?: number }): Promise<PaginatedResponse<Category>> {
  const { data } = await api.get('/categorias/', { params })
  return data
}

export async function create(body: CategoryForm): Promise<Category> {
  const { data } = await api.post('/categorias/', body)
  return data
}

// Partial hace todos los campos de CategoryForm opcionales. en un PATCH solo mandas lo que cambio
export async function update(id: number, body: Partial<CategoryForm>): Promise<Category> {
  const { data } = await api.patch(`/categorias/${id}`, body)
  return data
}

// no devuelve ningún valor cuando se resuelve
export async function remove(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`)
}
