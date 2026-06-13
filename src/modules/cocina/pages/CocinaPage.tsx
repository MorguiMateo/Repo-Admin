import { useQuery } from '@tanstack/react-query'
import { getAll } from '../../pedidos/services/pedidosService'
import { CocinaCard } from '../components/CocinaCard'
import { useAuthStore } from '../../../store/authStore'

// Pantalla de Cocina: recibe los pedidos EN PREPARACIÓN para marcarlos
// como Entregado o cancelarlos. Solo ADMIN/PEDIDOS puede ejecutar las acciones.
export default function CocinaPage() {
  const canAdvance = useAuthStore((s) => s.hasRole(['ADMIN', 'PEDIDOS']))

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pedidos', { cocina: true }],
    queryFn: () => getAll({ estado: 'EN_PREP', size: 200 }),
  })

  // El filtro de estado lo aplica el backend; reforzamos en cliente por las dudas.
  const items = (data?.items ?? []).filter((p) => p.estado_codigo === 'EN_PREP')

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3 flex-shrink-0">
        <h1 className="text-xl font-semibold text-text-primary">Cocina</h1>
        <span className="text-xs text-text-muted bg-bg-surface-2 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      {isLoading && <p className="text-text-muted">Cargando...</p>}
      {isError && <p className="text-danger">Error al cargar pedidos.</p>}

      {!isLoading && !isError && (
        items.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-12">
            Sin pedidos en preparación.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-y-auto content-start">
            {items.map((pedido) => (
              <CocinaCard key={pedido.id} pedido={pedido} canAdvance={canAdvance} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
