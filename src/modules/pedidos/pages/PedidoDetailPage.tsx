import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getById } from '../services/pedidosService'
import { AdvanceStatusButton } from '../components/AdvanceStatusButton'
import { useAuthStore } from '../../../store/authStore'
import type { OrderStatusCode } from '../types'

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

export default function PedidoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const pedidoId = Number(id)
  const canAdvance = useAuthStore((s) => s.hasRole(['ADMIN', 'PEDIDOS']))

  const { data: pedido, isLoading, isError } = useQuery({
    queryKey: ['pedido', pedidoId],
    queryFn: () => getById(pedidoId),
    enabled: !isNaN(pedidoId),
  })

  if (isLoading) return <p className="p-6 text-text-muted">Cargando...</p>
  if (isError || !pedido) return <p className="p-6 text-danger">Error al cargar el pedido.</p>

  const statusClass = STATUS_CLASSES[pedido.estado_codigo]
  const statusLabel = STATUS_LABEL[pedido.estado_codigo]

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/pedidos"
          className="text-text-muted hover:text-text-primary transition-colors text-sm"
        >
          ← Volver
        </Link>
        <h1 className="text-xl font-semibold text-text-primary">Pedido #{pedido.id}</h1>
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {statusLabel}
        </span>
        {canAdvance && (
          <AdvanceStatusButton pedidoId={pedido.id} estadoActual={pedido.estado_codigo} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info general */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Información</h2>
          {pedido.usuario && (
            <Row label="Cliente">
              {pedido.usuario.nombre} {pedido.usuario.apellido}
              <span className="block text-xs text-text-muted">{pedido.usuario.email}</span>
            </Row>
          )}
          <Row label="Forma de pago">{pedido.forma_pago_codigo}</Row>
          <Row label="Subtotal">${pedido.subtotal.toFixed(2)}</Row>
          {pedido.descuento > 0 && (
            <Row label="Descuento">-${pedido.descuento.toFixed(2)}</Row>
          )}
          <Row label="Costo de envío">${pedido.costo_envio.toFixed(2)}</Row>
          <Row label="Total" className="font-semibold text-text-primary">${pedido.total.toFixed(2)}</Row>
          {pedido.notas && <Row label="Notas">{pedido.notas}</Row>}
          <Row label="Creado">
            {new Date(pedido.created_at).toLocaleString('es-AR')}
          </Row>
        </div>

        {/* Historial de estados */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Historial de estados</h2>
          {(!pedido.historial || pedido.historial.length === 0) ? (
            <p className="text-text-muted text-sm">Sin historial disponible.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {pedido.historial.map((entry) => {
                const hacia = STATUS_LABEL[entry.estado_hacia] ?? entry.estado_hacia
                const haciaCls = STATUS_CLASSES[entry.estado_hacia] ?? ''
                return (
                  <li key={entry.id} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${haciaCls}`}>
                      {hacia}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-text-muted text-xs">
                        {new Date(entry.created_at).toLocaleString('es-AR')}
                      </span>
                      {entry.motivo && (
                        <span className="text-text-secondary">{entry.motivo}</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </div>

      {/* Detalle de productos */}
      {pedido.detalles && pedido.detalles.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-surface text-text-muted uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-right">Precio unit.</th>
                <th className="px-4 py-3 text-right">Cantidad</th>
                <th className="px-4 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pedido.detalles.map((det) => (
                <tr key={det.producto_id} className="bg-bg-surface-2">
                  <td className="px-4 py-3 text-text-primary">
                    {det.nombre_snapshot}
                    {det.personalizacion.length > 0 && (
                      <span className="block text-xs text-text-muted">
                        Sin: {det.personalizacion.join(', ')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary">${det.precio_snapshot.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-text-secondary">{det.cantidad}</td>
                  <td className="px-4 py-3 text-right font-medium text-text-primary">${det.subtotal_snap.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Row({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-text-muted text-sm shrink-0">{label}</span>
      <span className={`text-text-secondary text-sm text-right ${className}`}>{children}</span>
    </div>
  )
}
