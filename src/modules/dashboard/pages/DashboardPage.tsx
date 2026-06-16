import { useDashboardData } from '../hooks/useDashboardData'
import { KpiCards } from '../components/KpiCards'
import { VentasChart } from '../components/VentasChart'
import { TopProductosChart } from '../components/TopProductosChart'
import { EstadosChart } from '../components/EstadosChart'
import { IngresosChart } from '../components/IngresosChart'

export default function DashboardPage() {
  const { isLoading, isError, resumen, ventas, productosTop, pedidosPorEstado, ingresos } =
    useDashboardData()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>

      {isLoading && <p className="text-text-muted">Cargando métricas...</p>}
      {isError && <p className="text-danger">Error al cargar las métricas.</p>}

      {!isLoading && !isError && (
        <>
          {resumen.data && <KpiCards resumen={resumen.data} />}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VentasChart data={ventas.data ?? []} />
            <TopProductosChart data={productosTop.data ?? []} />
            <EstadosChart data={pedidosPorEstado.data ?? []} />
            <IngresosChart data={ingresos.data ?? []} />
          </div>
        </>
      )}
    </div>
  )
}
