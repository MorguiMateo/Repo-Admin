import { useState } from 'react'
import { useAuthStore } from '../../../store/authStore'
import { CategoryTable } from '../components/CategoryTable'
import { CategoryFormModal } from '../components/CategoryFormModal'

export default function CategoriasPage() {
  const { hasRole } = useAuthStore()
  const isAdmin = hasRole(['ADMIN'])

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 min-w-0">

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-text-muted">Gestioná las categorías y subcategorías del catálogo.</p>

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 px-3 py-1.5 rounded border border-border bg-bg-surface text-text-primary text-sm cursor-pointer"
          >
            Nueva categoría
          </button>
        )}
      </div>

      <CategoryTable isAdmin={isAdmin} />

      {modalOpen && (
        <CategoryFormModal
          onClose={() => setModalOpen(false)}
        />
      )}

    </div>
  )
}
