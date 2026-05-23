import type { Category } from '../../categorias/types'
import type { Ingredient } from '../../ingredientes/types'

// Ingrediente asociado a un producto
export interface ProductIngredient {
  ingrediente: Ingredient
  cantidad: number
  unidad_medida_id: number
  es_removible: boolean // si es true aparece como opción de personalización en el carrito
}

export interface Product {
  id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagenes_url: string[]
  stock_cantidad: number
  disponible: boolean
  unidad_venta_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  categorias?: Category[]
  ingredientes?: ProductIngredient[]
}

// crear editar producto
export interface ProductForm {
  nombre: string
  descripcion: string
  precio_base: number
  imagenes_url: string[]
  stock_cantidad: number
  disponible: boolean
  categoria_ids: number[]
  ingrediente_ids: number[]
}

// filtros para el listado — van como query params
export interface ProductFilters {
  search?: string
  categoria_id?: number
  disponible?: boolean
  page?: number
  size?: number
}
