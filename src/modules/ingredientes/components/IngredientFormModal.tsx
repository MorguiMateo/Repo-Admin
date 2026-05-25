import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { create, update } from '../services/ingredientesService'
import type { Ingredient, IngredientForm } from '../types'

interface Props {
  ingredient?: Ingredient
  onClose: () => void
}

export function IngredientFormModal({ ingredient, onClose }: Props) {
  const queryClient = useQueryClient()
  const isEditing = !!ingredient

  const { register, handleSubmit, formState: { errors } } = useForm<IngredientForm>({
    defaultValues: ingredient
      ? { nombre: ingredient.nombre, descripcion: ingredient.descripcion ?? '', es_alergeno: ingredient.es_alergeno }
      : { nombre: '', descripcion: '', es_alergeno: false },
  })

  const mutation = useMutation({
    mutationFn: (body: IngredientForm) =>
      isEditing ? update(ingredient!.id, body) : create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      onClose()
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        console.error('Error al guardar ingrediente:', err.response?.status, err.response?.data)
      }
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-surface rounded-xl border border-border w-full max-w-md p-6 flex flex-col gap-5">

        <h3 className="text-lg font-semibold text-text-primary">
          {isEditing ? 'Editar ingrediente' : 'Nuevo ingrediente'}
        </h3>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Nombre *</label>
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info transition-colors"
              placeholder="Ej: Tomate"
            />
            {errors.nombre && <p className="text-xs text-danger">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Descripción</label>
            <textarea
              {...register('descripcion')}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info transition-colors resize-none"
              placeholder="Descripción opcional"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('es_alergeno')}
              className="w-4 h-4 rounded accent-warning cursor-pointer"
            />
            <span className="text-sm text-text-secondary">Es alérgeno</span>
          </label>

          {mutation.isError && (
            <p className="text-xs text-danger">Ocurrió un error al guardar. Revisá los datos.</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-lg text-sm bg-info hover:bg-info-hover text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {mutation.isPending ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
