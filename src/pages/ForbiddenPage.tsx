import { useNavigate } from 'react-router-dom'

export default function ForbiddenPage() {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg-base">
      <span className="text-6xl font-bold text-danger">403</span>
      <p className="text-text-secondary">No tenés permisos para acceder a esta sección.</p>
      <button
        onClick={() => navigate('/admin')}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Volver al inicio
      </button>
    </div>
  )
}
