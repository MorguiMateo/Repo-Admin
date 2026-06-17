import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getById } from '../services/pedidosService'
import type { Order } from '../types'

interface Props {
  pedido: Order
}

//tarjeta del historial: muestra el detalle completo de un pedido entregado
//el listado /pedidos no trae usuario, detalles ni historial, asi que los pedimos por id
//usamos la misma queryKey ['pedido', id] que detalle y cocina asi se reusa la cache
export function HistorialCard({ pedido }: Props) {
  const { data: detalle, isLoading } = useQuery({
    queryKey: ['pedido', pedido.id],
    queryFn: () => getById(pedido.id),
  })

  //mientras carga el detalle usamos lo que ya trae el listado
  const full = detalle ?? pedido
  const detalles = full.detalles ?? []

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
      {/* Encabezado: número de pedido + estado entregado */}
      <div className="flex items-center justify-between">
        <Link
          to={`/admin/pedidos/${full.id}`}
          className="text-sm font-semibold text-text-primary hover:text-primary transition-colors"
        >
          #{full.id}
        </Link>
        <span className="text-xs font-medium text-success bg-success-muted px-2 py-0.5 rounded-full">
          Entregado
        </span>
      </div>

      {/* Cliente */}
      {full.usuario && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">
            {full.usuario.nombre} {full.usuario.apellido}
          </span>
          <span className="text-xs text-text-muted">{full.usuario.email}</span>
        </div>
      )}

      {/* Productos */}
      {isLoading ? (
        <p className="text-xs text-text-muted">Cargando detalle…</p>
      ) : detalles.length === 0 ? (
        <p className="text-xs text-text-muted">Sin detalle disponible.</p>
      ) : (
        <ul className="flex flex-col gap-1.5 border-t border-border-subtle pt-2">
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

      {/* Desglose de montos */}
      <div className="flex flex-col gap-1 border-t border-border-subtle pt-2 text-sm">
        <Monto label="Subtotal" valor={full.subtotal} />
        {full.descuento > 0 && (
          <Monto label="Descuento" valor={-full.descuento} />
        )}
        <Monto label="Envío" valor={full.costo_envio} />
        <Monto label="Total" valor={full.total} destacado />
      </div>

      {/* Metadatos */}
      <div className="flex flex-col gap-1 border-t border-border-subtle pt-2 text-xs text-text-muted">
        <div className="flex items-center justify-between">
          <span>Forma de pago</span>
          <span className="text-text-secondary">{full.forma_pago_codigo}</span>
        </div>
        {full.notas && (
          <div className="flex items-start justify-between gap-3">
            <span className="shrink-0">Notas</span>
            <span className="text-text-secondary text-right">{full.notas}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Monto({ label, valor, destacado = false }: { label: string; valor: number; destacado?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={destacado ? 'text-text-primary font-medium' : 'text-text-muted'}>{label}</span>
      <span className={destacado ? 'text-text-primary font-semibold' : 'text-text-secondary'}>
        ${valor.toFixed(2)}
      </span>
    </div>
  )
}
