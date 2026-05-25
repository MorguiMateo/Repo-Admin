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
      <div className="bg-bg-surface rounded border border-border w-full max-w-md p-6 flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">
            {isEditing ? 'Editar ingrediente' : 'Nuevo ingrediente'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted cursor-pointer text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-3">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Nombre *</label>
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full rounded border border-border bg-bg-input px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info"
              placeholder="Ej: Tomate"
            />
            {errors.nombre && <p className="text-xs text-danger">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Descripción</label>
            <textarea
              {...register('descripcion')}
              className="w-full rounded border border-border bg-bg-input px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info resize-none"
              placeholder="Descripción opcional"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('es_alergeno')}
              className="cursor-pointer"
            />
            <span className="text-sm text-text-secondary">Es alérgeno</span>
          </label>

          {mutation.isError && (
            <p className="text-xs text-danger">Ocurrió un error al guardar. Revisá los datos.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-border text-sm text-text-secondary cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-3 py-1.5 rounded border border-border bg-bg-surface-2 text-sm text-text-primary cursor-pointer disabled:opacity-50"
            >
              {mutation.isPending ? 'Guardando...' : isEditing ? 'Guardar' : 'Crear'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
