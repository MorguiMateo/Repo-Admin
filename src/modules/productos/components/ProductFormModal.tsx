import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../../api/axiosInstance'
import { create, update } from '../services/productosService'
import { getAll as getCategorias } from '../../categorias/services/categoriasService'
import { getAll as getIngredientes } from '../../ingredientes/services/ingredientesService'
import { ImageUploader } from '../../../shared/ImageUploader'
import type { Product, ProductForm } from '../types'

interface UnidadMedida {
  id: number
  nombre: string
  simbolo: string
  tipo: string
}

interface Props {
  product?: Product
  onClose: () => void
}

type FormFields = {
  nombre: string
  descripcion: string
  precio_base: number
  stock_cantidad: number
  disponible: boolean
}

export function ProductFormModal({ product, onClose }: Props) {
  const queryClient = useQueryClient()
  const isEditing = !!product

  const [selectedCatIds, setSelectedCatIds] = useState<number[]>(
    product?.categorias?.map((pc) => pc.categoria.id) ?? []
  )
  const [selectedIngIds, setSelectedIngIds] = useState<number[]>(
    product?.ingredientes?.map((pi) => pi.ingrediente.id) ?? []
  )
  const [imagenes, setImagenes] = useState<string[]>(product?.imagenes_url ?? [])

  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
    defaultValues: product
      ? {
          nombre: product.nombre,
          descripcion: product.descripcion ?? '',
          precio_base: product.precio_base,
          stock_cantidad: product.stock_cantidad,
          disponible: product.disponible,
        }
      : {
          nombre: '',
          descripcion: '',
          precio_base: 0,
          stock_cantidad: 0,
          disponible: true,
        },
  })

  const { data: categoriasData } = useQuery({
    queryKey: ['categorias', { size: 100 }],
    queryFn: () => getCategorias({ size: 100 }),
    staleTime: Infinity,
  })

  const { data: ingredientesData } = useQuery({
    queryKey: ['ingredientes', { size: 100 }],
    queryFn: () => getIngredientes({ size: 100 }),
    staleTime: Infinity,
  })

  // Necesitamos al menos una unidad para mandar al back en cada ingrediente.
  // La UI hoy no permite elegirla, así que usamos la primera disponible como default.
  const { data: unidades } = useQuery({
    queryKey: ['unidades-medida'],
    queryFn: async () => {
      const { data } = await api.get<UnidadMedida[]>('/unidades-medida', { params: { limit: 50 } })
      return data
    },
    staleTime: Infinity,
  })
  const defaultUnidadId = unidades?.[0]?.id

  const toggleCat = (id: number) =>
    setSelectedCatIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const toggleIng = (id: number) =>
    setSelectedIngIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const mutation = useMutation({
    mutationFn: (body: ProductForm) =>
      isEditing ? update(product!.id, body) : create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      onClose()
    },
    onError: (err) => {
      console.error('[ProductFormModal] Error al guardar:', err)
    },
  })

  // Mapas con los datos originales del producto, para preservar es_principal /
  // cantidad / unidad_medida_id / es_removible cuando el usuario edita sin tocar
  // esos campos (la UI hoy no los expone).
  const originalCatById = new Map(
    (product?.categorias ?? []).map((pc) => [pc.categoria.id, pc])
  )
  const originalIngById = new Map(
    (product?.ingredientes ?? []).map((pi) => [pi.ingrediente.id, pi])
  )

  const onSubmit = (fields: FormFields) => {
    // Solo bloqueamos si hay ingredientes NUEVOS (que no estaban antes) y no
    // tenemos una unidad de medida default para asignarles.
    const ingredientesNuevosSinUnidad = selectedIngIds.some(
      (id) => !originalIngById.has(id),
    )
    if (ingredientesNuevosSinUnidad && !defaultUnidadId) {
      window.alert('No hay unidades de medida cargadas. Creá al menos una antes de asociar ingredientes.')
      return
    }

    const body: ProductForm = {
      nombre: fields.nombre,
      descripcion: fields.descripcion,
      precio_base: Number(fields.precio_base),
      stock_cantidad: Number(fields.stock_cantidad),
      disponible: fields.disponible,
      imagenes_url: imagenes,
      categorias: selectedCatIds.map((id, idx) => {
        const original = originalCatById.get(id)
        return {
          categoria_id: id,
          // Si la categoría ya estaba asociada, preservamos su es_principal.
          // Si es nueva, la marcamos como principal solo si es la primera seleccionada.
          es_principal: original ? original.es_principal : idx === 0,
        }
      }),
      ingredientes: selectedIngIds.map((id) => {
        const original = originalIngById.get(id)
        if (original) {
          return {
            ingrediente_id: id,
            es_removible: original.es_removible,
            cantidad: original.cantidad,
            unidad_medida_id: original.unidad_medida_id,
          }
        }
        return {
          ingrediente_id: id,
          es_removible: true,
          cantidad: 1,
          unidad_medida_id: defaultUnidadId!,
        }
      }),
    }
    mutation.mutate(body)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-surface rounded-xl border border-border w-full max-w-lg p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">

        <h3 className="text-lg font-semibold text-text-primary">
          {isEditing ? 'Editar producto' : 'Nuevo producto'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Nombre *</label>
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info transition-colors"
              placeholder="Ej: Pizza Margarita"
            />
            {errors.nombre && <p className="text-xs text-danger">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Descripción</label>
            <textarea
              {...register('descripcion')}
              rows={2}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info transition-colors resize-none"
              placeholder="Descripción opcional"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">Precio base *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('precio_base', {
                  required: 'El precio es obligatorio',
                  min: { value: 0, message: 'Debe ser positivo' },
                })}
                className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
              />
              {errors.precio_base && <p className="text-xs text-danger">{errors.precio_base.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">Stock</label>
              <input
                type="number"
                min="0"
                {...register('stock_cantidad', { min: { value: 0, message: 'Debe ser positivo' } })}
                className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Imágenes</label>
            <ImageUploader value={imagenes} onChange={setImagenes} folder="productos" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('disponible')}
              className="w-4 h-4 rounded accent-success cursor-pointer"
            />
            <span className="text-sm text-text-secondary">Disponible para la venta</span>
          </label>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">Categorías</label>
            <div className="rounded-lg border border-border bg-bg-input p-3 max-h-36 overflow-y-auto flex flex-col gap-1.5">
              {(categoriasData?.items ?? []).map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCatIds.includes(cat.id)}
                    onChange={() => toggleCat(cat.id)}
                    className="w-3.5 h-3.5 rounded accent-info cursor-pointer"
                  />
                  {cat.nombre}
                </label>
              ))}
              {!categoriasData && <p className="text-xs text-text-muted">Cargando...</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">Ingredientes</label>
            <div className="rounded-lg border border-border bg-bg-input p-3 max-h-36 overflow-y-auto flex flex-col gap-1.5">
              {(ingredientesData?.items ?? []).map((ing) => (
                <label key={ing.id} className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedIngIds.includes(ing.id)}
                    onChange={() => toggleIng(ing.id)}
                    className="w-3.5 h-3.5 rounded accent-info cursor-pointer"
                  />
                  <span>{ing.nombre}</span>
                  {ing.es_alergeno && (
                    <span className="text-xs text-warning">(alérgeno)</span>
                  )}
                </label>
              ))}
              {!ingredientesData && <p className="text-xs text-text-muted">Cargando...</p>}
            </div>
          </div>

          {mutation.isError && (
            <p className="text-xs text-danger">Ocurrió un error. Revisá los datos.</p>
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
