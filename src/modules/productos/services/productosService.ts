import api from '../../../api/axiosInstance'
import type { Product, ProductForm } from '../types'

export async function getAll(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/productos', {
    params: { skip: 0, limit: 200 },
  })
  return data
}

export async function getById(id: number): Promise<Product> {
  const { data } = await api.get(`/productos/${id}`)
  return data
}

export async function create(body: ProductForm): Promise<Product> {
  const { data } = await api.post('/productos', body)
  return data
}

// PUT con body completo.
export async function update(id: number, body: Partial<ProductForm>): Promise<Product> {
  const { data } = await api.put(`/productos/${id}`, body)
  return data
}

export async function remove(id: number): Promise<void> {
  await api.delete(`/productos/${id}`)
}

// PATCH dedicado para ADMIN/STOCK.
export async function patchDisponible(id: number, disponible: boolean): Promise<Product> {
  const { data } = await api.patch(`/productos/${id}/disponibilidad`, { disponible })
  return data
}
