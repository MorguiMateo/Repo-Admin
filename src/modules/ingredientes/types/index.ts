export interface Ingredient {
  id: number
  nombre: string
  descripcion: string | null
  es_alergeno: boolean // si es true mostrar advertencia en UI
  stock_cantidad: number // stock disponible del ingrediente (back: stock_cantidad)
  created_at: string
  updated_at: string
}

// crear editar ingrediente
export interface IngredientForm {
  nombre: string
  descripcion: string
  stock_cantidad: number
  es_alergeno: boolean
}
