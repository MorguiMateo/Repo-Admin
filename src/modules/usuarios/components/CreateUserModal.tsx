import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '../services/usuariosService'
import type { CreateUserForm } from '../types'

interface Props {
  onClose: () => void
}

export function CreateUserModal({ onClose }: Props) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserForm>({
    defaultValues: { rol: 'CLIENT' },
  })

  const mutation = useMutation({
    mutationFn: (data: CreateUserForm) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-surface rounded-xl border border-border w-full max-w-sm p-6 flex flex-col gap-5">

        <div>
          <h3 className="text-lg font-semibold text-text-primary">Crear usuario</h3>
          <p className="text-sm text-text-muted mt-1">El usuario podrá iniciar sesión de inmediato.</p>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-text-secondary">Nombre *</label>
              <input
                {...register('nombre', { required: 'Requerido' })}
                className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
              />
              {errors.nombre && <p className="text-xs text-danger">{errors.nombre.message}</p>}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-text-secondary">Apellido *</label>
              <input
                {...register('apellido', { required: 'Requerido' })}
                className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
              />
              {errors.apellido && <p className="text-xs text-danger">{errors.apellido.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Email *</label>
            <input
              type="email"
              {...register('email', { required: 'Requerido' })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
            />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Contraseña *</label>
            <input
              type="password"
              {...register('password', { required: 'Requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
            />
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Celular</label>
            <input
              {...register('celular')}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Rol *</label>
            <select
              {...register('rol', { required: 'Seleccioná un rol' })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
            >
              <option value="CLIENT">CLIENT</option>
              <option value="STOCK">STOCK</option>
              <option value="PEDIDOS">PEDIDOS</option>
            </select>
            {errors.rol && <p className="text-xs text-danger">{errors.rol.message}</p>}
          </div>

          {mutation.isError && (
            <p className="text-xs text-danger">No se pudo crear el usuario. Verificá que el email no esté en uso.</p>
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
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-lg text-sm bg-info hover:bg-info-hover text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {mutation.isPending ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
