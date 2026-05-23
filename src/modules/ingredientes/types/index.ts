export interface Ingredient {
  id: number
  nombre: string
  descripcion: string | null
  es_alergeno: boolean // si es true mostrar advertencia en UI
  created_at: string
  updated_at: string
}

// crear editar ingrediente
export interface IngredientForm {
  nombre: string
  descripcion: string
  es_alergeno: boolean
}
