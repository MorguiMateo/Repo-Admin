import api from '../../../api/axiosInstance'
import type { Order, AdvanceStatusForm } from '../types'
import type { PaginatedResponse } from '../../../shared/types'

//parametros aceptados por el endpoint. todos opcionales
//si no se pasan el backend devuelve todos los estados y usa su paginacion defautl.
export interface PedidoFilters {
  estado?: string
  page?: number
  size?: number
}

//Hace GET /pedidos/?estado=PENDIENTE&page=1&size=20 (o los que vengan).
//axios transforma el objeto params como querystring
export async function getAll(params: PedidoFilters): Promise<PaginatedResponse<Order>> {
  const { data } = await api.get('/pedidos/', { params })
  return data
}

//back devuelve usuario detalle historial
export async function getById(id: number): Promise<Order> {
  const { data } = await api.get(`/pedidos/${id}`)
  return data
}

//le pasamos body con el tipado de AdvanceStatusForm y hace ptach el backend valida y devuelve el pedido actualizado
export async function advanceStatus(id: number, body: AdvanceStatusForm): Promise<Order> {
  const { data } = await api.patch(`/pedidos/${id}/estado`, body)
  return data
}
