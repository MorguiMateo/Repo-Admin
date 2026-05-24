// pagina generica
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// El back devuelve listas planas con `skip` / `limit`.
// Este helper traduce paginación page/size a skip/limit y envuelve
// la respuesta para que los consumidores existentes sigan usando
// `data.items` y `data.pages` sin romperse.
export function toSkipLimit(page = 1, size = 20): { skip: number; limit: number } {
  const safePage = Math.max(1, page)
  const safeSize = Math.max(1, Math.min(100, size))
  return { skip: (safePage - 1) * safeSize, limit: safeSize }
}

export function wrapAsPage<T>(items: T[], page = 1, size = 20): PaginatedResponse<T> {
  const safeSize = Math.max(1, size)
  // Si recibimos exactamente `size` filas suponemos que puede haber otra página.
  const pages = items.length === safeSize ? page + 1 : page
  return {
    items,
    total: items.length,
    page,
    size: safeSize,
    pages,
  }
}
