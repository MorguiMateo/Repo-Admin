import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAll } from '../services/pedidosService'
import { PedidoRow } from '../components/PedidoRow'
import { useAuthStore } from '../../../store/authStore'
import type { OrderStatusCode } from '../types'

const ESTADOS: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'EN_PREP', label: 'En preparación' },
  { value: 'EN_CAMINO', label: 'En camino' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

export default function PedidosPage() {
  const canAdvance = useAuthStore((s) => s.hasRole(['ADMIN', 'PEDIDOS']))
  const [estado, setEstado] = useState<string>('')
  const [page, setPage] = useState(1)

  const filters = { estado: estado || undefined, page, size: 20 }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pedidos', filters],
    queryFn: () => getAll(filters),
  })

  const items = data?.items ?? []
  const totalPages = data?.pages ?? 1

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Pedidos</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm text-text-secondary">Estado</label>
          <select
            value={estado}
            onChange={(e) => { setEstado(e.target.value); setPage(1) }}
            className="px-3 py-1.5 rounded-lg bg-bg-input border border-border text-text-primary text-sm focus:outline-none focus:border-primary"
          >
            {ESTADOS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <p className="text-text-muted">Cargando...</p>}
      {isError && <p className="text-danger">Error al cargar pedidos.</p>}

      {!isLoading && !isError && (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg-surface text-text-muted uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Pago</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  {canAdvance && <th className="px-4 py-3 text-left">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={canAdvance ? 6 : 5}
                      className="px-4 py-8 text-center text-text-muted"
                    >
                      No hay pedidos para mostrar.
                    </td>
                  </tr>
                )}
                {items.map((pedido) => (
                  <PedidoRow
                    key={pedido.id}
                    pedido={pedido}
                    canAdvance={canAdvance}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-3 text-sm text-text-secondary">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded-lg border border-border hover:bg-bg-surface-2 disabled:opacity-40 transition-colors cursor-pointer"
              >
                ← Anterior
              </button>
              <span>Página {page} de {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg border border-border hover:bg-bg-surface-2 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
