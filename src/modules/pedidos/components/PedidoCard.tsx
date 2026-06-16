import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AdvanceStatusButton } from './AdvanceStatusButton'
import { getById } from '../services/pedidosService'
import type { Order } from '../types'

interface Props {
  pedido: Order
  canAdvance: boolean
}

export function PedidoCard({ pedido, canAdvance }: Props) {
  const hora = new Date(pedido.created_at).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // El listado /pedidos no trae `detalles`; los pedimos por id para mostrarlos
  // siempre, igual que en Cocina. La queryKey ['pedido', id] se comparte con la
  // página de detalle y Cocina, así que se cachea. Los detalles son un snapshot
  // inmutable, por eso no hace falta refetchInterval.
  const { data: detalle, isLoading } = useQuery({
    queryKey: ['pedido', pedido.id],
    queryFn: () => getById(pedido.id),
  })

  const detalles = detalle?.detalles ?? []

  return (
    <div className="bg-bg-surface-2 border border-border rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Link
          to={`/admin/pedidos/${pedido.id}`}
          className="text-sm font-semibold text-text-primary hover:text-primary transition-colors"
        >
          #{pedido.id}
        </Link>
        <span className="text-xs text-text-muted">{hora}</span>
      </div>

      {/* Productos del pedido (siempre visibles, como en Cocina) */}
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

      <span className="text-sm font-medium text-text-primary">${pedido.total.toFixed(2)}</span>
      {/* Los pedidos en preparación se gestionan desde el módulo Cocina:
          acá solo se indica su estado, sin botones de avanzar/cancelar. */}
      {pedido.estado_codigo === 'EN_PREP' ? (
        <span className="self-start text-xs font-medium text-info bg-info-muted px-2 py-0.5 rounded-full">
          En cocina
        </span>
      ) : (
        canAdvance && (
          <AdvanceStatusButton pedidoId={pedido.id} estadoActual={pedido.estado_codigo} />
        )
      )}
    </div>
  )
}
