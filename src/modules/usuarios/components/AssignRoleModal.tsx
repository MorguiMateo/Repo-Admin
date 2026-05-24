import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setRoles } from '../services/usuariosService'
import type { AdminUser, AssignRoleForm } from '../types'
import type { RoleCode } from '../../auth/types'

// onclose para que lo maneje el padre y lo cierre
interface Props {
  user: AdminUser
  onClose: () => void
}

export function AssignRoleModal({ user, onClose }: Props) {
  const queryClient = useQueryClient()

  // rol arranca en Stock por default
  const { register, handleSubmit, formState: { errors } } = useForm<AssignRoleForm>({
    defaultValues: { rol_codigo: 'STOCK' },
  })

  // El back reemplaza la lista completa: armamos {rol nuevo} ∪ existentes.
  const mutation = useMutation({
    mutationFn: (rol_codigo: RoleCode) => {
      const finalRoles = Array.from(new Set<RoleCode>([...user.roles, rol_codigo]))
      return setRoles(user.id, finalRoles)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      onClose()
    },
  })

  const enviar = (data: AssignRoleForm) => {
    if (user.roles.includes(data.rol_codigo)) {
      onClose()
      return
    }
    mutation.mutate(data.rol_codigo)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-surface rounded-xl border border-border w-full max-w-sm p-6 flex flex-col gap-5">

        <div>
          <h3 className="text-lg font-semibold text-text-primary">Asignar rol</h3>
          <p className="text-sm text-text-muted mt-1">{user.nombre} {user.apellido}</p>
        </div>

        <form onSubmit={handleSubmit(enviar)} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Rol *</label>
            <select
              {...register('rol_codigo', { required: 'Seleccioná un rol' })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-info transition-colors"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="STOCK">STOCK</option>
              <option value="PEDIDOS">PEDIDOS</option>
              <option value="CLIENT">CLIENT</option>
            </select>
            {errors.rol_codigo && <p className="text-xs text-danger">{errors.rol_codigo.message}</p>}
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
