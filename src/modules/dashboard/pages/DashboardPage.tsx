import { useDashboardData } from '../hooks/useDashboardData'
import { KpiCards } from '../components/KpiCards'
import { VentasChart } from '../components/VentasChart'
import { TopProductosChart } from '../components/TopProductosChart'
import { PedidosPorDiaChart } from '../components/PedidosPorDiaChart'

export default function DashboardPage() {
  const { isLoading, isError, kpis, ventas, topProductos, pedidosPorDiaSemana } = useDashboardData()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>

      {isLoading && <p className="text-text-muted">Cargando métricas...</p>}
      {isError && <p className="text-danger">Error al cargar las métricas.</p>}

      {!isLoading && !isError && (
        <>
          <KpiCards kpis={kpis} />
          <VentasChart data={ventas} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProductosChart data={topProductos} />
            <PedidosPorDiaChart data={pedidosPorDiaSemana} />
          </div>
        </>
      )}
    </div>
  )
}
