// pagina generica
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

//el back acepta skip y limit pero la ui trabaja con page y size.
// toSkipLimit y weapAsPage hacen la convercion.

export function toSkipLimit(page = 1, size = 20): { skip: number; limit: number } {
  const safePage = Math.max(1, page) // si alguien pasa page 0 o negativa lo fuerza a 1
  const safeSize = Math.max(1, Math.min(100, size)) // minimo 1 maximo 100. 
  return { skip: (safePage - 1) * safeSize, limit: safeSize } // pagina 1 = skip 0. Pagina 2 = skip 20. pagina 3 = skip 40
}

//agarra el array que devuelve el back y lo envuelve en Paginatedresponse
export function wrapAsPage<T>(items: T[], page = 1, size = 20): PaginatedResponse<T> {
  const safeSize = Math.max(1, size)
  const pages = items.length === safeSize ? page + 1 : page //el back nunca dice cuantas pags hay en total. aca las "calculamos" y se lo asignamos a la variable pages
  //si devuelve exactamente size probablemente hay mas paginas entonces page + 1. si no no llegamos al final entonces estamos en la ultima page
  return {
    items,
    total: items.length, //cuantos items hay en la pagina actual
    page,
    size: safeSize,
    pages,
  }
}
