import { Link } from 'react-router-dom'
import { AdvanceStatusButton } from './AdvanceStatusButton'
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
