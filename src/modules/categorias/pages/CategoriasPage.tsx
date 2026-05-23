import { useState } from 'react'
import { useAuthStore } from '../../../store/authStore'
import { CategoryTable } from '../components/CategoryTable'
import { CategoryFormModal } from '../components/CategoryFormModal'

export default function CategoriasPage() {
  const { hasRole } = useAuthStore()
  const isAdmin = hasRole(['ADMIN'])

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Categorías</h2>
          <p className="text-sm text-text-secondary mt-1">Gestioná las categorías y subcategorías del catálogo</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-info hover:bg-info-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            + Nueva categoría
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
