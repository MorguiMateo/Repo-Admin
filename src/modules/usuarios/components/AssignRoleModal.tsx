import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignRole } from '../services/usuariosService'
import type { AdminUser, AssignRoleForm } from '../types'

const ROLE_OPTIONS = ['ADMIN', 'STOCK', 'PEDIDOS', 'CLIENT'] as const

interface Props {
  user: AdminUser
  onClose: () => void
}

export function AssignRoleModal({ user, onClose }: Props) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm<AssignRoleForm>({
    defaultValues: { rol_codigo: 'STOCK', expires_at: null },
  })

  const mutation = useMutation({
    mutationFn: (body: AssignRoleForm) => assignRole(user.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      onClose()
    },
  })

  const onSubmit = (data: AssignRoleForm) => {
    mutation.mutate({ ...data, expires_at: data.expires_at || null })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-surface rounded-xl border border-border w-full max-w-sm p-6 flex flex-col gap-5">

        <div>
          <h3 className="text-lg font-semibold text-text-primary">Asignar rol</h3>
          <p className="text-sm text-text-muted mt-1">{user.nombre} {user.apellido}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Rol *</label>
            <select
              {...register('rol_codigo', { required: 'Seleccioná un rol' })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
            >
              {ROLE_OPTIONS.map((rol) => (
                <option key={rol} value={rol}>{rol}</option>
              ))}
            </select>
            {errors.rol_codigo && <p className="text-xs text-danger">{errors.rol_codigo.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">
              Expira el <span className="text-text-muted">(opcional)</span>
            </label>
            <input
              type="date"
              {...register('expires_at')}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
            />
          </div>

          {mutation.isError && (
            <p className="text-xs text-danger">No se pudo asignar el rol. Revisá los datos.</p>
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
              {mutation.isPending ? 'Asignando...' : 'Asignar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
