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

  //Math.ceil redondea para arriba: 21 productos con PAGE_SIZE=20 da 2 paginas
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
        <p className="text-sm text-danger bg-danger-muted px-3 py-2 rounded">{deleteError}</p>
      )}

      <div className="border border-border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-surface text-text-muted text-xs">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Nombre</th>
              <th className="px-4 py-2 text-left font-medium">Precio</th>
              <th className="px-4 py-2 text-left font-medium">Categorías</th>
              <th className="px-4 py-2 text-left font-medium">Alérgenos</th>
              <th className="px-4 py-2 text-left font-medium">Stock</th>
              {canToggle && <th className="px-4 py-2 text-left font-medium">Disponible</th>}
              {isAdmin && <th className="px-4 py-2 text-right font-medium">Acciones</th>}
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
                <tr key={prod.id}>
                  <td className="px-4 py-2.5 text-text-primary">{prod.nombre}</td>
                  <td className="px-4 py-2.5 text-text-secondary">${prod.precio_base.toFixed(2)}</td>

                  <td className="px-4 py-2.5 text-text-secondary">
                    {(prod.categorias ?? []).length > 0
                      ? prod.categorias!.map((pc) => pc.categoria.nombre).join(', ')
                      : <span className="text-text-muted">—</span>}
                  </td>

                  <td className="px-4 py-2.5 text-text-secondary">
                    {alergenos.length > 0
                      ? alergenos.join(', ')
                      : <span className="text-text-muted">—</span>}
                  </td>

                  <td className="px-4 py-2.5">
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
                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={prod.disponible}
                        disabled={pendingToggleId === prod.id}
                        onChange={() => handleToggle(prod)}
                        className="cursor-pointer"
                      />
                    </td>
                  )}

                  {isAdmin && (
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setEditTarget(prod)}
                          className="text-xs text-text-secondary cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(prod)}
                          className="text-xs text-text-secondary cursor-pointer"
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
            className="px-3 py-1 rounded border border-border disabled:opacity-40 cursor-pointer"
          >
            Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border border-border disabled:opacity-40 cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      )}

      {editTarget && (
        <ProductFormModal product={editTarget} onClose={() => setEditTarget(null)} />
      )}
    </>
  )
}

//celda de stock. para roles sin permiso es solo lectura. para ADMIN/STOCK muestra un input editable
//y un boton "Guardar" que solo aparece cuando el valor cambio
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

  //si el producto se refresca (despues de guardar u otra mutacion) sincronizamos el input
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
        className="w-20 rounded border border-border bg-bg-input px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-info disabled:opacity-50"
      />
      {dirty && (
        <button
          onClick={() => onSave(parsed)}
          disabled={!valid || saving}
          className="text-xs text-text-secondary disabled:opacity-50 cursor-pointer"
        >
          {saving ? '…' : 'Guardar'}
        </button>
      )}
    </div>
  )
}
