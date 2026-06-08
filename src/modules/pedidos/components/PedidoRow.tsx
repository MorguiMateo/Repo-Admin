import { Link } from 'react-router-dom'
import { AdvanceStatusButton } from './AdvanceStatusButton'
import type { Order, OrderStatusCode } from '../types'

interface Props {
  pedido: Order
  canAdvance: boolean
}

const STATUS_CLASSES: Record<OrderStatusCode, string> = {
  PENDIENTE: 'bg-warning-muted text-warning',
  CONFIRMADO: 'bg-info-muted text-info',
  EN_PREP: 'bg-info-muted text-info',
  ENTREGADO: 'bg-success-muted text-success',
  CANCELADO: 'bg-danger-muted text-danger',
}

const STATUS_LABEL: Record<OrderStatusCode, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export function PedidoRow({ pedido, canAdvance }: Props) {
  const statusClass = STATUS_CLASSES[pedido.estado_codigo]
  const statusLabel = STATUS_LABEL[pedido.estado_codigo]
  const fecha = new Date(pedido.created_at).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <tr className="bg-bg-surface-2 hover:bg-bg-surface transition-colors">
      <td className="px-4 py-3 font-medium text-text-primary">
        <Link to={`/admin/pedidos/${pedido.id}`} className="hover:text-primary transition-colors">
          #{pedido.id}
        </Link>
      </td>
      <td className="px-4 py-3 text-text-secondary">{fecha}</td>
      <td className="px-4 py-3 text-text-secondary">{pedido.forma_pago_codigo}</td>
      <td className="px-4 py-3 font-medium text-text-primary">${pedido.total.toFixed(2)}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
          {statusLabel}
        </span>
      </td>
      {canAdvance && (
        <td className="px-4 py-3">
          <AdvanceStatusButton pedidoId={pedido.id} estadoActual={pedido.estado_codigo} />
        </td>
      )}
    </tr>
  )
}
