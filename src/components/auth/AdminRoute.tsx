import type { ReactElement } from 'react'
import { ProtectedRoute } from './ProtectedRoute'

export function AdminRoute(props: { children: ReactElement }) {
  return <ProtectedRoute allowedRoles={['admin']}>{props.children}</ProtectedRoute>
}
