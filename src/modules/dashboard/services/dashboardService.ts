import api from '../../../api/axiosInstance'
import type {
  IngresoFormaPago,
  PedidoPorEstado,
  ProductoTop,
} from '../types'

export async function getProductosTop(): Promise<ProductoTop[]> {
  const { data } = await api.get<ProductoTop[]>('/estadisticas/productos-top')
  return data
}

export async function getPedidosPorEstado(): Promise<PedidoPorEstado[]> {
  const { data } = await api.get<PedidoPorEstado[]>('/estadisticas/pedidos-por-estado')
  return data
}

export async function getIngresos(): Promise<IngresoFormaPago[]> {
  const { data } = await api.get<IngresoFormaPago[]>('/estadisticas/ingresos')
  return data
}
