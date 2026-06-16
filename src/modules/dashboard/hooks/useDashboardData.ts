import { useQuery } from '@tanstack/react-query'
import {
  getIngresos,
  getPedidosPorEstado,
  getProductosTop,
  getResumen,
  getVentas,
} from '../services/dashboardService'

export function useDashboardData() {
  const resumen = useQuery({ queryKey: ['estadisticas', 'resumen'], queryFn: getResumen })
  const ventas = useQuery({ queryKey: ['estadisticas', 'ventas'], queryFn: getVentas })
  const productosTop = useQuery({ queryKey: ['estadisticas', 'productos-top'], queryFn: getProductosTop })
  const pedidosPorEstado = useQuery({ queryKey: ['estadisticas', 'pedidos-por-estado'], queryFn: getPedidosPorEstado })
  const ingresos = useQuery({ queryKey: ['estadisticas', 'ingresos'], queryFn: getIngresos })

  const queries = [resumen, ventas, productosTop, pedidosPorEstado, ingresos]

  return {
    resumen,
    ventas,
    productosTop,
    pedidosPorEstado,
    ingresos,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  }
}
