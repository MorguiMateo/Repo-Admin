import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAll, create, update } from '../services/categoriasService'
import { ImageUploader } from '../../../shared/ImageUploader'
import type { Category, CategoryForm } from '../types'

interface Props {
  category?: Category
  onClose: () => void
}

//detecta si es creacion o edicion mirando si recibio la prop category. si la recive precarga los valores por defecto.

export function CategoryFormModal({ category, onClose }: Props) {
  const queryClient = useQueryClient()
  const isEditing = !!category

  const [imagen, setImagen] = useState<string[]>(category?.imagen_url ? [category.imagen_url] : [])

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

  //convierte pantet_id a numero porque los select devuelven siempre string aunque el value sea numerico.
  const onSubmit = (values: CategoryForm) => {
    mutation.mutate({
      ...values,
      imagen_url: imagen[0] ?? '',
      parent_id: values.parent_id ? Number(values.parent_id) : null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-surface rounded border border-border w-full max-w-md p-6 flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">
            {isEditing ? 'Editar categoría' : 'Nueva categoría'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted cursor-pointer text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Nombre *</label>
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full rounded border border-border bg-bg-input px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info"
              placeholder="Ej: Platos principales"
            />
            {errors.nombre && <p className="text-xs text-danger">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Descripción</label>
            <textarea
              {...register('descripcion')}
              rows={3}
              className="w-full rounded border border-border bg-bg-input px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info resize-none"
              placeholder="Descripción opcional"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Imagen</label>
            <ImageUploader value={imagen} onChange={setImagen} folder="categorias" max={1} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Categoría padre</label>
            <select
              {...register('parent_id')}
              className="w-full rounded border border-border bg-bg-input px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-info"
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
