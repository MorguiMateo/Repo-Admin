import api from '../../../api/axiosInstance'
import type { AdvanceStatusForm, Order } from '../types'
import type { PaginatedResponse } from '../../../shared/types'
import { toSkipLimit, wrapAsPage } from '../../../shared/types'

export interface PedidoFilters {
  estado?: string
  page?: number
  size?: number
}

export async function getAll(params: PedidoFilters): Promise<PaginatedResponse<Order>> {
  const { page = 1, size = 20, estado } = params
  const { skip, limit } = toSkipLimit(page, size)
  const { data } = await api.get<Order[]>('/pedidos', {
    params: { skip, limit, estado },
  })
  return wrapAsPage(data, page, size)
}

export async function getById(id: number): Promise<Order> {
  const { data } = await api.get(`/pedidos/${id}`)
  return data
}

//avance manual de estado, solo para ADMIN y PEDIDOS
//si el estado destino es CANCELADO, el motivo es obligatorio
export async function advanceStatus(id: number, body: AdvanceStatusForm): Promise<Order> {
  const { data } = await api.post(`/pedidos/${id}/avanzar`, {
    estado_hacia: body.estado_hacia,
    motivo: body.motivo,
  })
  return data
}

export async function cancelOrder(id: number, motivo: string): Promise<Order> {
  const { data } = await api.post(`/pedidos/${id}/cancelar`, { motivo })
  return data
}
