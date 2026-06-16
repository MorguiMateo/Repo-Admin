import api from '../../../api/axiosInstance'
import type {
  IngresoFormaPago,
  PedidoPorEstado,
  ProductoTop,
  ResumenKpis,
  VentaPeriodo,
} from '../types'

export async function getResumen(): Promise<ResumenKpis> {
  const { data } = await api.get<ResumenKpis>('/estadisticas/resumen')
  return data
}

export async function getVentas(): Promise<VentaPeriodo[]> {
  const { data } = await api.get<VentaPeriodo[]>('/estadisticas/ventas')
  return data
}

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
