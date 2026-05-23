import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, remove } from '../services/ingredientesService'
import { IngredientFormModal } from './IngredientFormModal'
import type { Ingredient } from '../types'

//ingredientesPage nos dice si el usuario es admin o no. la tabla lo usa para mostrar o esconder acciones
interface Props {
  isAdmin: boolean
}

export function IngredientTable({ isAdmin }: Props) {
  const queryClient = useQueryClient()
  //la pagina arranca por 1 
  const [page, setPage] = useState(1)
  //si es null no hay modal abierto. cuando se le da click a editar se setea con el ingrediente y se abre la modal
  const [editTarget, setEditTarget] = useState<Ingredient | null>(null)


  const { data, isLoading, isError } = useQuery({
    // cada pagina es una entrada de cache distinta. cuando se cambia la pagina tanstack busca en cache si ya se fetcheo para saber si llama o no a la api
    queryKey: ['ingredientes', page],
    //llama a getAll y obtiene los items de la pagina actual. devuelve la data incluyendo isLoading y isError
    queryFn: () => getAll({ page, size: 20 }),
  })

  //recibe id y llama al remove que hace delete en api.
const deleteMutation = useMutation({
    mutationFn: (id: number) => remove(id),
    //cuando delete sale bien invalida las entradas de cache que empiecen con "ingredientes" para que la tabla se refresque automaticamente..
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] }),
  })

  //pregunta si quieres eliminar. si el usuario dice que no corta la ejecucion si confirma llama a deleteMutation.mutate y pasa el id del ingrediente.
  const handleDelete = (ing: Ingredient) => {
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
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-surface text-text-muted uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Descripción</th>
              <th className="px-4 py-3 text-left">Alérgeno</th>
              {isAdmin && <th className="px-4 py-3 text-right">Acciones</th>}
            </tr>
          </thead>
          {/* divide-y dibuja lineas horizontales entre los hijos del elemento excepto el primero(creo) */}
          <tbody className="divide-y divide-border">
            {/*por cada ingrediente carga una fila con 3 columnas de datos */}
            {items.map((ing) => (
              <tr key={ing.id} className="bg-bg-surface-2 hover:bg-bg-surface transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary">{ing.nombre}</td>
                <td className="px-4 py-3 text-text-secondary">{ing.descripcion ?? '..'}</td>
                <td className="px-4 py-3">
                  {/*si es alergeno ccarga */}
                  {ing.es_alergeno ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning-muted text-warning">
                      Alérgeno
                    </span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
              {/* la columna de acciones solo se renderiza si se es admin */}

                {isAdmin && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                      //cambia el estado y eso mas abajo renderiza la modal
                        onClick={() => setEditTarget(ing)}
                        className="text-text-muted hover:text-info transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(ing)}
                        className="text-text-muted hover:text-danger transition-colors cursor-pointer"
                      >
                        Eliminar
                      </button>
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
        <IngredientFormModal
          ingredient={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
    </>
  )
}
