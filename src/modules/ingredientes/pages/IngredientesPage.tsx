import { useState } from 'react'
import { useAuthStore } from '../../../store/authStore'
import { IngredientTable } from '../components/IngredientTable'
import { IngredientFormModal } from '../components/IngredientFormModal'

export default function IngredientesPage() {
  const hasRole = useAuthStore((s) => s.hasRole)
  const isAdmin = hasRole(['ADMIN'])
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Ingredientes</h1>
          <p className="text-sm text-text-muted mt-1">Gestioná los ingredientes del menú.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg bg-info hover:bg-info-hover text-white text-sm font-medium transition-colors cursor-pointer"
          >
            + Nuevo ingrediente
          </button>
        )}
      </div>

      <IngredientTable isAdmin={isAdmin} />

      {showCreate && (
        <IngredientFormModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}
