import { useState } from 'react'
import { useAuthStore } from '../../../store/authStore'
import { IngredientTable } from '../components/IngredientTable'
import { IngredientFormModal } from '../components/IngredientFormModal'

export default function IngredientesPage() {
  const hasRole = useAuthStore((s) => s.hasRole)
  const canManage = hasRole(['ADMIN']) // crear / eliminar: solo ADMIN
  const canEdit = hasRole(['ADMIN', 'STOCK']) // editar: ADMIN y STOCK
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="flex flex-col gap-4 min-w-0">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-text-muted">Gestioná los ingredientes del menú.</p>
        {canManage && (
          <button
            onClick={() => setShowCreate(true)}
            className="shrink-0 px-3 py-1.5 rounded border border-border bg-bg-surface text-text-primary text-sm cursor-pointer"
          >
            Nuevo ingrediente
          </button>
        )}
      </div>

      <IngredientTable canEdit={canEdit} canManage={canManage} />

      {showCreate && (
        <IngredientFormModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}
