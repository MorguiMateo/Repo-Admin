import type { Category } from '../../categorias/types'
import type { Ingredient } from '../../ingredientes/types'

export interface UnidadMedida {
  id: number
  nombre: string
  simbolo: string
}

// Categoría asociada a un producto (back lo devuelve anidado con es_principal)
export interface ProductCategory {
  categoria: Category
  es_principal: boolean
}

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
  unidad_venta?: UnidadMedida | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  categorias?: ProductCategory[]
  ingredientes?: ProductIngredient[]
}

//body que espera el back. la UI lo arma con checkboxes simples y completa cantidad y unidad_medida_id con defaults
export interface ProductCategoryLink {
  categoria_id: number
  es_principal: boolean
}

export interface ProductIngredientLink {
  ingrediente_id: number
  es_removible: boolean
  cantidad: number
  unidad_medida_id: number
}

export interface ProductForm {
  nombre: string
  descripcion: string
  precio_base: number
  imagenes_url: string[]
  stock_cantidad: number
  disponible: boolean
  categorias: ProductCategoryLink[]
  ingredientes: ProductIngredientLink[]
}

//filtros del listado, se aplican en el cliente (el back solo acepta skip/limit)
export interface ProductFilters {
  search?: string
  categoria_id?: number
  disponible?: boolean
}
