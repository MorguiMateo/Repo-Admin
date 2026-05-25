import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAll, remove, patchDisponible, patchStock } from '../services/productosService'
import { ProductFormModal } from './ProductFormModal'
import type { Product, ProductFilters } from '../types'

const PAGE_SIZE = 20

interface Props {
  externalFilters: ProductFilters
  isAdmin: boolean
  isStock: boolean
}

export function ProductTable({ externalFilters, isAdmin, isStock }: Props) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [pendingToggleId, setPendingToggleId] = useState<number | null>(null)
  const [savingStockId, setSavingStockId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { search, categoria_id, disponible } = externalFilters
  useEffect(() => { setPage(1) }, [search, categoria_id, disponible])

  const { data: allProducts = [], isLoading, isError } = useQuery({
    queryKey: ['productos'],
    queryFn: getAll,
  })

  // filtrado client-side
  const filtered = allProducts.filter((prod) => {
    if (search && !prod.nombre.toLowerCase().includes(search.toLowerCase())) return false
    if (categoria_id !== undefined && !prod.categorias?.some((pc) => pc.categoria.id === categoria_id)) return false
    if (disponible !== undefined && prod.disponible !== disponible) return false
    return true
  })

  // Math.ceil redondea hacia arriba: 21 productos con PAGE_SIZE=20 → 1.05 → 2 páginas
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1
  const start = (page - 1) * PAGE_SIZE
  const items = filtered.slice(start, start + PAGE_SIZE)

  const deleteMutation = useMutation({
    mutationFn: (id: number) => remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      setDeleteError(null)
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setDeleteError('No se puede eliminar: el producto tiene pedidos asociados.')
      } else {
        setDeleteError('Ocurrió un error al eliminar.')
      }
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, disp }: { id: number; disp: boolean }) => patchDisponible(id, disp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      setPendingToggleId(null)
    },
    onError: () => setPendingToggleId(null),
  })

  const stockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: number; stock: number }) => patchStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      setSavingStockId(null)
    },
    onError: () => setSavingStockId(null),
  })

  const handleDelete = (prod: Product) => {
    setDeleteError(null)
    if (!window.confirm(`¿Eliminar "${prod.nombre}"?`)) return
    deleteMutation.mutate(prod.id)
  }

  const handleToggle = (prod: Product) => {
    setPendingToggleId(prod.id)
    toggleMutation.mutate({ id: prod.id, disp: !prod.disponible })
  }

  if (isLoading) return <p className="text-text-muted">Cargando...</p>
  if (isError) return <p className="text-danger">Error al cargar productos.</p>

  const canToggle = isAdmin || isStock

  return (
    <>
      {deleteError && (
        <p className="text-sm text-danger bg-danger-muted px-4 py-2 rounded-lg">{deleteError}</p>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-surface text-text-muted uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Precio</th>
              <th className="px-4 py-3 text-left">Categorías</th>
              <th className="px-4 py-3 text-left">Alérgenos</th>
              <th className="px-4 py-3 text-left">Stock</th>
              {canToggle && <th className="px-4 py-3 text-left">Disponible</th>}
              {isAdmin && <th className="px-4 py-3 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={4 + (canToggle ? 1 : 0) + (isAdmin ? 2 : 0)}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
            {items.map((prod) => {
              const alergenos = (prod.ingredientes ?? [])
                .filter((pi) => pi.ingrediente.es_alergeno)
                .map((pi) => pi.ingrediente.nombre)

              return (
                <tr key={prod.id} className="bg-bg-surface-2 hover:bg-bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">{prod.nombre}</td>
                  <td className="px-4 py-3 text-text-secondary">${prod.precio_base.toFixed(2)}</td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(prod.categorias ?? []).length > 0 ? (
                        prod.categorias!.map((pc) => (
                          <span
                            key={pc.categoria.id}
                            className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary-muted text-primary"
                          >
                            {pc.categoria.nombre}
                            {pc.es_principal && (
                              <span className="ml-1 text-[10px] uppercase tracking-wide">★</span>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {alergenos.length > 0 ? (
                        alergenos.map((nombre) => (
                          <span
                            key={nombre}
                            className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-warning-muted text-warning"
                          >
                            {nombre}
                          </span>
                        ))
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <StockCell
                      value={prod.stock_cantidad}
                      editable={canToggle}
                      saving={savingStockId === prod.id}
                      onSave={(next) => {
                        setSavingStockId(prod.id)
                        stockMutation.mutate({ id: prod.id, stock: next })
                      }}
                    />
                  </td>

                  {canToggle && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(prod)}
                        disabled={pendingToggleId === prod.id}
                        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors cursor-pointer disabled:opacity-50 ${prod.disponible ? 'bg-success' : 'bg-border'}`}
                      >
                        <span
                          className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${prod.disponible ? 'translate-x-4' : 'translate-x-1'}`}
                        />
                      </button>
                    </td>
                  )}

                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditTarget(prod)}
                          className="text-text-muted hover:text-info transition-colors cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(prod)}
                          className="text-text-muted hover:text-danger transition-colors cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
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

      {editTarget && (
        <ProductFormModal product={editTarget} onClose={() => setEditTarget(null)} />
      )}
    </>
  )
}

// Celda de stock. Solo lectura para roles sin permiso; para ADMIN/STOCK muestra
// un input editable y un botón "Guardar" que aparece únicamente cuando el valor cambió.
function StockCell({
  value,
  editable,
  saving,
  onSave,
}: {
  value: number
  editable: boolean
  saving: boolean
  onSave: (next: number) => void
}) {
  const [draft, setDraft] = useState(String(value))

  // Si el producto se refresca (tras guardar u otra mutación) sincronizamos el input.
  useEffect(() => { setDraft(String(value)) }, [value])

  if (!editable) {
    return <span className="text-text-secondary">{value}</span>
  }

  const parsed = Number(draft)
  const valid = draft.trim() !== '' && Number.isInteger(parsed) && parsed >= 0
  const dirty = parsed !== value

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        value={draft}
        disabled={saving}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && valid && dirty) onSave(parsed) }}
        className="w-20 rounded-lg border border-border bg-bg-input px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-info transition-colors disabled:opacity-50"
      />
      {dirty && (
        <button
          onClick={() => onSave(parsed)}
          disabled={!valid || saving}
          className="text-xs font-medium text-info hover:text-info-hover disabled:opacity-50 transition-colors cursor-pointer"
        >
          {saving ? '…' : 'Guardar'}
        </button>
      )}
    </div>
  )
}
