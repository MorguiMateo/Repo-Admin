import api from '../../../api/axiosInstance'
import type { Order } from '../../pedidos/types'

export async function getAllPedidos(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/pedidos', { params: { limit: 1000 } })
  return data
}
