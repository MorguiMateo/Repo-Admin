import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { login } from '../services/authService'
import type { LoginForm } from '../types'

export default function LoginPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  //Se recupera texto de error del backend empieza en null y si se llama a setServError el componente se re recarga y muestra el texto
  const [serverError, setServerError] = useState<string | null>(null)

  // crea un form tipado como loginForm con mail y pass. Ademas useForm devuelve un objeto con herramientas para el form.
  // register: Enlaza los imput del form y define las reglas como mail obligatorio etc.
  // handleSubmit Envuelve el onSubmit valida si esta OK y llama a la funcion con los datos
  // errors errores d validacion por campo ejempl eerrros.mail
  // isSubmitting : es true mientras corre el onSubmit async. cuando termina termine bien o mal devuelve false
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()    

  // data ya llega con el mail y la pass validadas
  const onSubmit = async (data: LoginForm) => {
    // limpio el error por si hay uno cargado
    setServerError(null)
    try {
      await login(data)
      // La app se entera de quien sos desp del login si no supiera habría bug con la cache del 401
      // Pide auth/me y actualiza el store con usuarios y roles
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      // replace no permite volver a la pagina anterior. osea no deja volver al login
      navigate('/admin', { replace: true })
    } catch (err) {
      // isAxiosError recupera el error y se fija que sea una respuesta http si es así lee error data detail que envia el backend
      // si no es una resp http renderiza "credenciales invalidas"
      setServerError(
        axios.isAxiosError(err)
          ? err.response?.data?.detail
          : 'Credenciales inválidas'
      )
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-bg-base">
      <div className="w-full max-w-sm rounded-lg border border-border bg-bg-surface p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-text-primary">
          Iniciar sesión
        </h1>

        {/* Cuando el form hace submit, handleSubmit valida y si esta todo bien recien ahí se hace onSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-text-secondary">
            Email
            <input
              type="email"
              placeholder="mail@gmail.com"
              className={`rounded-md border px-3 py-2 bg-bg-base text-text-primary placeholder-text-muted outline-none transition focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.email ? 'border-danger' : 'border-border'
              }`}
              // desestructuramos register que trae name, ref, onchange y onblur.
              {...register('email', {
                required: 'El email es obligatorio',
              })}
            />
            {/*Si hay error se carga el mensaje de error definido arriba "el email es obligatorio" esto porque el segundo argunmento del register es el bojeto de reglas. 
            cuando el form intenta hacer submit evalua y si no cumple guarda el mensaje en errors.email.message */}
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-text-secondary">
            Contraseña
            <input
              type="password"
              placeholder="*****"
              className={`rounded-md border px-3 py-2 bg-bg-base text-text-primary placeholder-text-muted outline-none transition focus:border-primary focus:ring-1 focus:ring-primary 
                ${ errors.password ? 'border-danger' : 'border-border' }`}
              {...register('password', { required: 'La contraseña es obligatoria' })}
            />
            {/*misma logica que arriba. devuelve "la contraseña es obligatoria si no esta" */}
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </label>
              
          {/* Error que viene del backend, distinto a los errores de validación de campo arriba mencionados */}
          {serverError && (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{serverError}</p>
          )}

          {/* disabled evita doble submit  */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-md bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {/*mientras se envia el submit carga ingresando y sino muestra ingresa */}
            {isSubmitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
