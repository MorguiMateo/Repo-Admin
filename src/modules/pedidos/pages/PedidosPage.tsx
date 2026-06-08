import { useQuery } from '@tanstack/react-query'
import { getAll } from '../services/pedidosService'
import { PedidoCard } from '../components/PedidoCard'
import { useAuthStore } from '../../../store/authStore'
import type { Order, OrderStatusCode } from '../types'

const COLUMNS: { code: OrderStatusCode; label: string; dot: string }[] = [
  { code: 'PENDIENTE',  label: 'Pendiente',      dot: 'bg-warning' },
  { code: 'CONFIRMADO', label: 'Confirmado',      dot: 'bg-info' },
  { code: 'EN_PREP',    label: 'En preparación',  dot: 'bg-info' },
  { code: 'ENTREGADO',  label: 'Entregados',      dot: 'bg-success' },
]

export default function PedidosPage() {
  const canAdvance = useAuthStore((s) => s.hasRole(['ADMIN', 'PEDIDOS']))

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['pedidos', { kanban: true }],
    queryFn: () => getAll({ page: 1, size: 200 }),
    refetchInterval: 5000,
  })

  const items = data?.items ?? []

  const byState = Object.fromEntries(
    COLUMNS.map((col) => [col.code, items.filter((p) => p.estado_codigo === col.code)])
  ) as Record<OrderStatusCode, Order[]>

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3 flex-shrink-0">
        <h1 className="text-xl font-semibold text-text-primary">Pedidos</h1>
        {isFetching && !isLoading && (
          <span className="text-xs text-text-muted animate-pulse">Actualizando…</span>
        )}
      </div>

      {isLoading && <p className="text-text-muted">Cargando...</p>}
      {isError && <p className="text-danger">Error al cargar pedidos.</p>}

      {!isLoading && !isError && (
        <div className="flex gap-4 flex-1 min-h-0">
          {COLUMNS.map((col) => {
            const colItems = byState[col.code]
            return (
              <div
                key={col.code}
                className="flex-1 flex flex-col min-h-0 bg-bg-surface border border-border rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`} />
                  <span className="font-semibold text-sm text-text-primary">{col.label}</span>
                  <span className="ml-auto text-xs text-text-muted bg-bg-surface-2 px-2 py-0.5 rounded-full">
                    {colItems.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                  {colItems.length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-8">Sin pedidos</p>
                  ) : (
                    colItems.map((pedido) => (
                      <PedidoCard
                        key={pedido.id}
                        pedido={pedido}
                        canAdvance={canAdvance}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
