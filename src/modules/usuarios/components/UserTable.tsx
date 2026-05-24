import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, removeRole, softDelete } from '../services/usuariosService'
import { AssignRoleModal } from './AssignRoleModal'
import type { AdminUser } from '../types'
import type { RoleCode } from '../../auth/types'
import type { UsuarioFilters } from '../services/usuariosService'


//recive filter pueden ser todolos usuarios o solo x rol ejemplo admin
export function UserTable({ filters }: { filters: UsuarioFilters }) {
  const queryClient = useQueryClient()
  //si es null la modal esta cerrada si tiene un AdminUser la modal esta abierta con ese usuario
  const [assignTarget, setAssignTarget] = useState<AdminUser | null>(null)

  //traemos el rol de la prop y size 100 para traer 100 usuarios si es que hay 100. en caso de haber mas lo correcto sería paginacion
  const { data, isLoading, isError } = useQuery({
    queryKey: ['usuarios', filters],
    queryFn: () => getAll({ ...filters, size: 100 }),
  })

  //se pasa id y rol y se le hace delete con removeRole desp se invalida la cache y se actualiz
  const removeRoleMutation = useMutation({
    mutationFn: ({ id, rol }: { id: number; rol: RoleCode }) => removeRole(id, rol),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  })

  //soft delete de usuario
  const deleteMutation = useMutation({
    mutationFn: (id: number) => softDelete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  })

  //salta alerta de confirmar remover el rol y si se acepta lo remueve
  const handleRemoveRole = (user: AdminUser, rol: RoleCode) => {
    if (!window.confirm(`¿Quitar el rol ${rol} de ${user.nombre}?`)) return
    removeRoleMutation.mutate({ id: user.id, rol })
  }

  // lo mismo pero para elimianr
  const handleDelete = (user: AdminUser) => {
    if (!window.confirm(`¿Daseas eliminar a ${user.nombre} ${user.apellido}? Esta acción no se puede deshacer.`)) return
    deleteMutation.mutate(user.id)
  }

  if (isLoading) return <p className="text-text-muted">Cargando...</p>
  if (isError)   return <p className="text-danger">Error al cargar usuarios.</p>

  //se le da el valor de data si existe sino array vacío
  const items = data?.items ?? []

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-surface text-text-muted uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Roles</th>
              <th className="px-4 py-3 text-left">Registrado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          {/* divide-y bordes entre filas */}
          <tbody className="divide-y divide-border">
            {/*cargamos la lista de usuarios */}
            {items.map((user) => (
              <tr key={user.id} className="bg-bg-surface-2 hover:bg-bg-surface transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary">
                  {user.nombre} {user.apellido}
                </td>
                <td className="px-4 py-3 text-text-secondary">{user.email}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((rol) => (
                      <span
                        key={rol}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-bg-surface-2 text-text-secondary"
                      >
                        {rol}
                        <button
                          onClick={() => handleRemoveRole(user, rol)}
                          className="hover:opacity-70 transition-opacity cursor-pointer leading-none"
                          title={`Quitar rol ${rol}`}
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {/*transforma la fecha a una forma mas facil de entender ej (25/5/2026)  */}
                  {new Date(user.created_at).toLocaleDateString('es-AR')}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setAssignTarget(user)}
                      className="text-text-muted hover:text-info transition-colors cursor-pointer"
                    >
                      Asignar rol
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-text-muted hover:text-danger transition-colors cursor-pointer"
                    >
                      Dar de baja
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


            {/*ciando hay estado se abre la ,odal  y se asigna/cambia el rol */}
      {assignTarget && (
        <AssignRoleModal
          user={assignTarget}
          onClose={() => setAssignTarget(null)}
        />
      )}
    </>
  )
}
