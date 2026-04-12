
import { Globe2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useKenaiAuth } from '../contexts/KenaiAuthContext'

export function KenaiNetworkBadge() {
  const [open, setOpen] = useState(false)
  const auth = useKenaiAuth()
  if (!auth.user) return null

  return (
    <div className="relative">
      <button type="button" onClick={function () { setOpen(!open) }} className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100">
        <ShieldCheck className="h-4 w-4" />
        Kenai Network ✓
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-left shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Globe2 className="h-4 w-4 text-emerald-300" />
            You're signed in across the Kenai Peninsula Network
          </div>
          <div className="mt-4 space-y-2">
            {auth.networkSites.map(function (site) {
              return (
                <a key={site.key} href={auth.getSiteHref(site)} className="flex items-center justify-between rounded-2xl border border-white/10 px-3 py-3 text-sm text-slate-200 transition hover:border-emerald-400/40 hover:bg-white/5">
                  <span>{site.label}</span>
                  <span className="capitalize text-emerald-300">{auth.user ? auth.user.siteRoles[site.key] || 'Available' : 'Available'}</span>
                </a>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
