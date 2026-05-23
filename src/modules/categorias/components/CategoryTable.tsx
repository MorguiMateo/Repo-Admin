import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAll, remove } from '../services/categoriasService'
import { CategoryFormModal } from './CategoryFormModal'
import type { Category } from '../types'

interface Props {
  isAdmin: boolean
}

export function CategoryTable({ isAdmin }: Props) {
  const queryClient = useQueryClient()
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => getAll({ size: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setDeleteError('No se puede eliminar: la categoría tiene productos activos.')
      } else {
        setDeleteError('Ocurrió un error al eliminar.')
      }
    },
  })

  const handleDelete = (cat: Category) => {
    setDeleteError(null)
    if (!window.confirm(`¿Eliminar "${cat.nombre}"?`)) return
    deleteMutation.mutate(cat.id)
  }

  if (isLoading) return <p className="text-text-muted">Cargando...</p>
  if (isError)   return <p className="text-danger">Error al cargar categorías.</p>

  const items = data?.items ?? []
  const padres  = items.filter((c) => c.parent_id === null)
  const hijos   = items.filter((c) => c.parent_id !== null)

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
              <th className="px-4 py-3 text-left">Descripción</th>
              {isAdmin && <th className="px-4 py-3 text-right">Acciones</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {padres.map((padre) => {
              const subs = hijos.filter((h) => h.parent_id === padre.id)

              return (
                <>
                  {/* Fila padre */}
                  <tr key={padre.id} className="bg-bg-surface-2 hover:bg-bg-surface transition-colors">
                    <td className="px-4 py-3 font-semibold text-text-primary">{padre.nombre}</td>
                    <td className="px-4 py-3 text-text-secondary">{padre.descripcion ?? '—'}</td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <ActionButtons
                          onEdit={() => setEditTarget(padre)}
                          onDelete={() => handleDelete(padre)}
                        />
                      </td>
                    )}
                  </tr>

                  {/* Filas subcategorías */}
                  {subs.map((sub) => (
                    <tr key={sub.id} className="bg-bg-surface hover:bg-bg-surface-2 transition-colors">
                      <td className="px-4 py-3 pl-10 text-text-secondary">↳ {sub.nombre}</td>
                      <td className="px-4 py-3 text-text-muted">{sub.descripcion ?? '—'}</td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <ActionButtons
                            onEdit={() => setEditTarget(sub)}
                            onDelete={() => handleDelete(sub)}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {editTarget && (
        <CategoryFormModal
          category={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
    </>
  )
}

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={onEdit}
        className="text-text-muted hover:text-info transition-colors cursor-pointer"
      >
        Editar
      </button>
      <button
        onClick={onDelete}
        className="text-text-muted hover:text-danger transition-colors cursor-pointer"
      >
        Eliminar
      </button>
    </div>
  )
}
