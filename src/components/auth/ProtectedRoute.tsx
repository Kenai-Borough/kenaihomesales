
import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useKenaiAuth } from '../../contexts/KenaiAuthContext'

export function ProtectedRoute(props: { children: ReactElement; allowedRoles?: string[] }) {
  const auth = useKenaiAuth()
  const location = useLocation()

  if (auth.loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">Loading your Kenai Network account…</div>
  }
  if (!auth.user) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }
  if (props.allowedRoles && props.allowedRoles.length > 0) {
    const ok = props.allowedRoles.some(function (role) { return auth.hasRole(role) })
    if (!ok) return <Navigate to="/account" replace />
  }
  return props.children
}
