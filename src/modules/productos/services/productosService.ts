import api from '../../../api/axiosInstance'
import type { Product, ProductForm, ProductFilters } from '../types'
import type { PaginatedResponse } from '../../../shared/types'

export async function getAll(params: ProductFilters): Promise<PaginatedResponse<Product>> {
  const { data } = await api.get('/productos/', { params })
  return data
}

export async function create(body: ProductForm): Promise<Product> {
  const { data } = await api.post('/productos/', body)
  return data
}

export async function update(id: number, body: Partial<ProductForm>): Promise<Product> {
  const { data } = await api.patch(`/productos/${id}`, body)
  return data
}

export async function remove(id: number): Promise<void> {
  await api.delete(`/productos/${id}`)
}

//No necesitamos todo el ProductForm solo solicitamos dispnible
export async function patchDisponible(id: number, disponible: boolean): Promise<Product> {
  const { data } = await api.patch(`/productos/${id}`, { disponible })
  return data
}
