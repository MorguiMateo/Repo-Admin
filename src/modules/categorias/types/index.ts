export interface Category {
  id: number
  // si es null no tiene padre ej: Mar y si tiene id ej merluza y comparte el id de mar es de ahí.
  parent_id: number | null
  nombre: string
  descripcion: string | null
  imagen_url: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  // el backend puede incluir los hijos en el listado
  subcategorias?: Category[]
}

// crear editar categoría
export interface CategoryForm {
  nombre: string
  descripcion: string
  imagen_url: string
  parent_id: number | null
}
