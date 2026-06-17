import { useQuery } from '@tanstack/react-query'
import { getById } from '../../pedidos/services/pedidosService'
import { AdvanceStatusButton } from '../../pedidos/components/AdvanceStatusButton'
import type { Order } from '../../pedidos/types'

interface Props {
  pedido: Order
  canAdvance: boolean
}

//tarjeta de cocina: muestra los productos a preparar de un pedido en preparacion
//el listado /pedidos no trae los detalles, asi que los pedimos por id
//usamos la misma queryKey ['pedido', id] que la pagina de detalle asi se reusa la cache
export function CocinaCard({ pedido, canAdvance }: Props) {
  const hora = new Date(pedido.created_at).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const { data: detalle, isLoading } = useQuery({
    queryKey: ['pedido', pedido.id],
    queryFn: () => getById(pedido.id),
    refetchInterval: 5000,
  })

  const detalles = detalle?.detalles ?? []

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary">#{pedido.id}</span>
        <span className="text-xs text-text-muted">{hora}</span>
      </div>

      {/* Productos a preparar */}
      {isLoading ? (
        <p className="text-xs text-text-muted">Cargando productos…</p>
      ) : detalles.length === 0 ? (
        <p className="text-xs text-text-muted">Sin detalle disponible.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {detalles.map((det) => (
            <li key={det.producto_id} className="text-sm text-text-primary">
              <span className="font-medium text-text-secondary">{det.cantidad}×</span>{' '}
              {det.nombre_snapshot}
              {det.personalizacion.length > 0 && (
                <span className="block text-xs text-text-muted">
                  Sin: {det.personalizacion.join(', ')}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
        <span className="text-sm font-medium text-text-primary">${pedido.total.toFixed(2)}</span>
        {canAdvance && (
          <AdvanceStatusButton pedidoId={pedido.id} estadoActual={pedido.estado_codigo} />
        )}
      </div>
    </div>
  )
}
