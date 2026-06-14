import { useQuery } from '@tanstack/react-query'
import { getAllPedidos } from '../services/dashboardService'
import { kpis, pedidosPorDiaSemana, topProductos } from '../utils/aggregations'

export function useDashboardData() {
  const query = useQuery({
    queryKey: ['dashboard', 'pedidos'],
    queryFn: getAllPedidos,
  })

  const orders = query.data ?? []

  return {
    ...query,
    kpis: kpis(orders),
    topProductos: topProductos(orders, 5),
    pedidosPorDiaSemana: pedidosPorDiaSemana(orders),
  }
}
