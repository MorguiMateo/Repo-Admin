import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create, update } from '../services/ingredientesService'
import type { Ingredient, IngredientForm } from '../types'

//Props donde pueden llegar ingredientes del tipo ingrediente y funcion para cerrar la modal.
//OnClose viene del padre ingredientesPage.tsx
interface Props {
  ingredient?: Ingredient
  onClose: () => void
}

export function IngredientFormModal({ ingredient, onClose }: Props) {
  const queryClient = useQueryClient()
  // doble !! transforma valor a booleano. ejemplo si elingrediente es undefined = false y si es un bojeto = true
  const isEditing = !!ingredient

  //usamos el form de react-hook-form y lo tipamos con IngredientForm
  //register conecta los imput al form. handleSubmit valida el submit y si sale bn llama a la funcion. 
  // reset reemplaza los valores del formulario (se usa al editar)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IngredientForm>({
    defaultValues: { nombre: '', descripcion: '', es_alergeno: false },
  })

  //recargamos datos para empezar a editar
  //se ejecuta cuando cambian ingredientes 
  useEffect(() => {
    if (ingredient) {
      reset({
        nombre:      ingredient.nombre,
        descripcion: ingredient.descripcion ?? '',
        es_alergeno: ingredient.es_alergeno,
      })
    }
  }, [ingredient, reset])

  //Hace la llamada. si isEditing es true llama al patch(update). Si no llama a post(create)
  const mutation = useMutation({
    mutationFn: (body: IngredientForm) =>
      // 
      isEditing ? update(ingredient!.id, body) : create(body),
    onSuccess: () => {
      //cuando la api responde OK invalida el cache de la lista y luego cierra la modal.
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-surface rounded-xl border border-border w-full max-w-md p-6 flex flex-col gap-5">

        <h3 className="text-lg font-semibold text-text-primary">
          {isEditing ? 'Editar ingrediente' : 'Nuevo ingrediente'}
        </h3>

        {/* revisa que el form este correcto y si es así le pasa la data a mutation */}
        {/*Mutate viene del useMutation de mutation xd (tasntackQ)*/}
        {/*Mutate recibe data lo pasa a mutationFn como body, ejecuta create(body) o update(ingredient.id, body) segun el modo mientras anda actualiza ele stado isPending, si la api responde OK ejecuta el onSucces */}
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Nombre *</label>
            {/* Conectamos los imputs al form con el ...register si el campo esta vacío "el nombre es obligatorio" (errors.nombre.message)*/}
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info transition-colors"
              placeholder="Ej: Tomate"
            />
            {errors.nombre && <p className="text-xs text-danger">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Descripción</label>
            {/*text area permite escribir texto en varias lineas. */}
            <textarea
            /*Conecta bajo la clave descripcion definida en IngredientForm. Al enviar el formulario este valor entra en data y va a create o update */
              {...register('descripcion')}
              /* resize-none para que no se pueda estirar con el mouse */
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-info transition-colors resize-none"
              placeholder="Descripción opcional"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              // Conecta el checkbox a es_alergeno (true/false). Al enviar, ese valor va en data a create o update
              {...register('es_alergeno')}
              className="w-4 h-4 rounded accent-warning cursor-pointer"
            />
            <span className="text-sm text-text-secondary">Es alérgeno</span>
          </label>

          {/* si da error el mutation renderiza el msg de errwor */}
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
              //desabilitamos el boton mientras la api responde
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-lg text-sm bg-info hover:bg-info-hover text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {/*depende el estado cargo el texto x */}
              {mutation.isPending ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
