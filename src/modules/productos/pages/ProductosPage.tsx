import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
//renombrep ara no confundir con getAll de los otros modulos.
import { getAll as getCategorias } from '../../categorias/services/categoriasService'
import { ProductTable } from '../components/ProductTable'
import { ProductFormModal } from '../components/ProductFormModal'
import type { ProductFilters } from '../types'

export default function ProductosPage() {
  const hasRole = useAuthStore((s) => s.hasRole)
  const isAdmin = hasRole(['ADMIN'])
  const isStock = hasRole(['STOCK'])

  //modal abierta o cerrada
  const [showCreate, setShowCreate] = useState(false)
  //texto del input de busqueda
  const [search, setSearch] = useState('')
  //que categoría esta seleccionada. undefined = todas
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)
  //se espera un true o false. sino un undefined.
  const [disponibleFilter, setDisponibleFilter] = useState<boolean | undefined>(undefined)

  //fetche d categorías y hacemos que no se refetchee a no ser que se llame a invalidateQueries([categorias])
  const { data: categoriasData } = useQuery({
    //se agrega el parametro size: 100 para diferenciarse de la query de categorias. si la clave es igual comparte la cache
    queryKey: ['categorias', { size: 100 }],
    queryFn: () => getCategorias({ size: 100 }),
    //norefetch
    staleTime: Infinity,
  })


  const externalFilters: ProductFilters = {
    //si el string del search esta vacio se definde como undefied para que axios no haga ?search en la url
    search: search || undefined,
    //estos ya son undefined cuando no hay filtro activo
    categoria_id: categoriaId,
    disponible: disponibleFilter,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Productos</h1>
          <p className="text-sm text-text-muted mt-1">Gestioná el catálogo de productos.</p>
        </div>
        {/* solo se renderiza si se es admin. al clickearlo setea showCreate a true y mas abajo esto renderiza la modal del producto */}
        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg bg-info hover:bg-info-hover text-white text-sm font-medium transition-colors cursor-pointer"
          >
            + Nuevo producto
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          //setea/actualiza el el texto del imput
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info transition-colors w-56"
        />

        <select
        //si categoria id es undefind muestra todas las categorías
          value={categoriaId ?? ''}
          //si el usuario elije la opcion vacía(todas las categorpias)
          //si seleciona una categoria convierte el strung del value a numero x el Numver
          onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors cursor-pointer"
        >
          {/*los option solo aceptan string entonces se lo deja vacio para representar undefined que significa que no tien filtro activo */}
          <option value="">Todas las categorías</option>
          {/*se fija q haya data de actegorias sino deja lista vacia mapea y carga las opciones con su id */}
          {(categoriasData?.items ?? []).map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
          ))}
        </select>

        <select
        //pregunta si disponibleFilter es undefined y si es así se le asigna vacio pero si tiene true o false ese true o false lo transforma en texto
          value={disponibleFilter === undefined ? '' : String(disponibleFilter)}


          onChange={(e) => {
            //si el valor es vacio guardamos undefined sino con cualquier otro se guarda como true
            if (e.target.value === '') setDisponibleFilter(undefined)
              //si hay valor es true se compara con true  y da true si es false se compara con true y da false porque no es igual a true
            else setDisponibleFilter(e.target.value === 'true')
          }}
          className="rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors cursor-pointer"
        >
          {/*depende del valor es lo que muestra */}
          <option value="">Disponibilidad</option>
          <option value="true">Disponibles</option>
          <option value="false">No disponibles</option>
        </select>
      </div>

            {/*renderizamos ProductTable y le pasamos 3 props
            el externalFilter lo tuliza para armar la queryKey y pasarselo al useQUery para fetchear los productos
            Cada vez q cambia un flitro externalFilter cambia la tabla detecta el cambio y resetea la pag a 1 y
             hace un nuevo fetch con los filtros actualados
             luego ambos booleanos q usa la tabla para decidir q renderizar 
             si sos admin ves editar/eliminar 
             si sos stock ves el toggle de disponible pero no ves editar/eliminar 
             si sos pedidos no ves ninguno 
            */}
      <ProductTable
        externalFilters={externalFilters}
        isAdmin={isAdmin}
        isStock={isStock}
      />

      {/*muestra la modal si showCreate es true si no no la muestra. este estado cuando el usuario clickea "nuevo producto" */}
      {showCreate && (
        //cuando el usuario cancela o guarda setea el estado en false y cierra la modal
        <ProductFormModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}
