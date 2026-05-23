import type { ReactNode } from 'react'
import type { RoleCode } from '../../modules/auth/types'
import { useAuthStore } from '../../store/authStore'
import ForbiddenPage from '../../pages/ForbiddenPage'

interface Props {
  allowed: RoleCode[]
  children: ReactNode
}

export function RequireRole({ allowed, children }: Props) {
  const hasRole = useAuthStore((s) => s.hasRole)
  if (!hasRole(allowed)) return <ForbiddenPage />
  return <>{children}</>
}
