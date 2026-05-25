import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAll, create, update } from '../services/categoriasService'
import type { Category, CategoryForm } from '../types'

interface Props {
  category?: Category
  onClose: () => void
}

export function CategoryFormModal({ category, onClose }: Props) {
  const queryClient = useQueryClient()
  const isEditing = !!category

  const { register, handleSubmit, formState: { errors } } = useForm<CategoryForm>({
    defaultValues: category
      ? { nombre: category.nombre, descripcion: category.descripcion ?? '', imagen_url: category.imagen_url ?? '', parent_id: category.parent_id }
      : { nombre: '', descripcion: '', imagen_url: '', parent_id: null },
  })

  const { data: categoriasData } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => getAll({ size: 100 }),
    staleTime: Infinity,
  })
  const padres = (categoriasData?.items ?? []).filter((c) => c.parent_id === null)

  const mutation = useMutation({
    mutationFn: (body: CategoryForm) =>
      isEditing ? update(category!.id, body) : create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      onClose()
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        console.error('Error al guardar categoría:', err.response?.status, err.response?.data)
      }
    },
  })

  const onSubmit = (values: CategoryForm) => {
    mutation.mutate({
      ...values,
      parent_id: values.parent_id ? Number(values.parent_id) : null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-surface rounded-xl border border-border w-full max-w-md p-6 flex flex-col gap-5">

        <h3 className="text-lg font-semibold text-text-primary">
          {isEditing ? 'Editar categoría' : 'Nueva categoría'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Nombre *</label>
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info transition-colors"
              placeholder="Ej: Platos principales"
            />
            {errors.nombre && <p className="text-xs text-danger">{errors.nombre.message}</p>}
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Descripción</label>
            <textarea
              {...register('descripcion')}
              rows={3}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info transition-colors resize-none"
              placeholder="Descripción opcional"
            />
          </div>

          {/* Categoría padre */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Categoría padre</label>
            <select
              {...register('parent_id')}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
            >
              <option value="">— Ninguna (es categoría raíz) —</option>
              {padres.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          {mutation.isError && (
            <p className="text-xs text-danger">Ocurrió un error. Revisá los datos.</p>
          )}

          {/* Botones */}
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
