import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAll, remove } from '../services/ingredientesService'
import { IngredientFormModal } from './IngredientFormModal'
import type { Ingredient } from '../types'

// canEdit: ADMIN o STOCK pueden editar. canManage: solo ADMIN puede eliminar.
interface Props {
  canEdit: boolean
  canManage: boolean
}

// Umbral genérico para marcar "stock bajo". Ajustable cuando el back defina la
// unidad real de stock por ingrediente.
const LOW_STOCK_THRESHOLD = 10

export function IngredientTable({ canEdit, canManage }: Props) {
  const queryClient = useQueryClient()
  //la pagina arranca por 1 
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Ingredient | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)


  const { data, isLoading, isError } = useQuery({
    // cada pagina es una entrada de cache distinta. cuando se cambia la pagina tanstack busca en cache si ya se fetcheo para saber si llama o no a la api
    queryKey: ['ingredientes', page],
    //llama a getAll y obtiene los items de la pagina actual. devuelve la data incluyendo isLoading y isError
    queryFn: () => getAll({ page, size: 20 }),
  })

  //recibe id y llama al remove que hace delete en api.
  const deleteMutation = useMutation({
    mutationFn: (id: number) => remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      setDeleteError(null)
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setDeleteError('No se puede eliminar: el ingrediente está en uso por un producto activo.')
      } else {
        setDeleteError('Ocurrió un error al eliminar.')
      }
    },
  })

  const handleDelete = (ing: Ingredient) => {
    setDeleteError(null)
    if (!window.confirm(`¿Eliminar "${ing.nombre}"?`)) return
    deleteMutation.mutate(ing.id)
  }

  //si la query esta cargando o falla renderiza.
  if (isLoading) return <p className="text-text-muted">Cargando...</p>
  if (isError)   return <p className="text-danger">Error al cargar ingredientes.</p>

  //si hay data obtiene los items si no lista vacia lo mismo con las pages nada mas q arranca en 1
  const items = data?.items ?? []
  const totalPages = data?.pages ?? 1

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
              <th className="px-4 py-2 text-left font-medium">Descripción</th>
              <th className="px-4 py-2 text-left font-medium">Alérgeno</th>
              <th className="px-4 py-2 text-left font-medium">Stock</th>
              {(canEdit || canManage) && <th className="px-4 py-2 text-right font-medium">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((ing) => (
              <tr key={ing.id}>
                <td className="px-4 py-2.5 text-text-primary">{ing.nombre}</td>
                <td className="px-4 py-2.5 text-text-secondary">{ing.descripcion ?? '—'}</td>
                <td className="px-4 py-2.5">
                  {ing.es_alergeno ? (
                    <span className="text-xs text-warning">Sí</span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <StockBadge stock={ing.stock_cantidad} />
                </td>

                {(canEdit || canManage) && (
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {canEdit && (
                        <button
                          onClick={() => setEditTarget(ing)}
                          className="text-xs text-text-secondary cursor-pointer"
                        >
                          Editar
                        </button>
                      )}
                      {canManage && (
                        <button
                          onClick={() => handleDelete(ing)}
                          className="text-xs text-text-secondary cursor-pointer"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
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
        <IngredientFormModal
          ingredient={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
    </>
  )
}

// Muestra el stock del ingrediente (solo lectura). El back todavía no expone el
// campo, por eso degrada a "—" cuando llega null/undefined.
function StockBadge({ stock }: { stock?: number | null }) {
  if (stock == null) {
    return <span className="text-text-muted">—</span>
  }
  if (stock === 0) {
    return (
      <span className="text-xs text-danger bg-danger-muted px-2 py-0.5 rounded">
        Agotado
      </span>
    )
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return <span className="text-warning">{stock}</span>
  }
  return <span className="text-text-secondary">{stock}</span>
}
