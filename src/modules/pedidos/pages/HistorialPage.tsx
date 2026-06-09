import { useQuery } from '@tanstack/react-query'
import { getAll } from '../services/pedidosService'
import { HistorialCard } from '../components/HistorialCard'

// Historial de entregados: lista solo los pedidos en estado ENTREGADO.
// ENTREGADO es terminal, así que las tarjetas no muestran botones de avance.
export default function HistorialPage() {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['pedidos', { historial: true }],
    queryFn: () => getAll({ estado: 'ENTREGADO', size: 200 }),
    refetchInterval: 5000,
  })

  // El filtro de estado lo aplica el backend; reforzamos en cliente por las dudas.
  const items = (data?.items ?? []).filter((p) => p.estado_codigo === 'ENTREGADO')

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3 flex-shrink-0">
        <h1 className="text-xl font-semibold text-text-primary">Historial de entregados</h1>
        <span className="text-xs text-text-muted bg-bg-surface-2 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
        {isFetching && !isLoading && (
          <span className="text-xs text-text-muted animate-pulse">Actualizando…</span>
        )}
      </div>

      {isLoading && <p className="text-text-muted">Cargando...</p>}
      {isError && <p className="text-danger">Error al cargar pedidos.</p>}

      {!isLoading && !isError && (
        items.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-12">
            Sin pedidos entregados.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-y-auto content-start">
            {items.map((pedido) => (
              <HistorialCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
