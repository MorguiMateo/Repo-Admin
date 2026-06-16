import { useQuery } from '@tanstack/react-query'
import {
  getIngresos,
  getPedidosPorEstado,
  getProductosTop,
} from '../services/dashboardService'

export function useDashboardData() {
  const productosTop = useQuery({ queryKey: ['estadisticas', 'productos-top'], queryFn: getProductosTop })
  const pedidosPorEstado = useQuery({ queryKey: ['estadisticas', 'pedidos-por-estado'], queryFn: getPedidosPorEstado })
  const ingresos = useQuery({ queryKey: ['estadisticas', 'ingresos'], queryFn: getIngresos })

  const queries = [productosTop, pedidosPorEstado, ingresos]

  return {
    productosTop,
    pedidosPorEstado,
    ingresos,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  }
}
