import { useState } from 'react'
import { UserTable } from '../components/UserTable'
import type { RoleCode } from '../../auth/types'

const ROL_OPTIONS: { text: string; value: RoleCode | null }[] = [
  { text: 'Todos',   value: null },
  { text: 'ADMIN',   value: 'ADMIN' },
  { text: 'STOCK',   value: 'STOCK' },
  { text: 'PEDIDOS', value: 'PEDIDOS' },
  { text: 'CLIENT',  value: 'CLIENT' },
]

export default function UsuariosPage() {

  const [rolFilter, setRolFilter] = useState<RoleCode | null> (null)

  return (
    <div className="flex flex-col gap-6 p-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Usuarios</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-text-muted">Filtrar por rol:</span>
        {/*escribimos los botones */}
        {ROL_OPTIONS.map((opt) => (
          <button   
            key={opt.value}
            onClick={() => setRolFilter(opt.value)}
            className="px-3 py-1 rounded-lg text-sm border transition-colors cursor-pointer border-border text-text-secondary hover:bg-bg-surface-2"
          >
            {opt.text}
          </button>
        ))}
      </div>

        {/* si es unll pasan todoos si hay valor se asigna el valor y la tabla lo usa */}
      <UserTable key={rolFilter} filters={rolFilter ? { rol: rolFilter } : {}} />

    </div>
  )
}
