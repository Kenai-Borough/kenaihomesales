
import { LockKeyhole, MountainSnow } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SITE_LABEL, useKenaiAuth } from '../../contexts/KenaiAuthContext'

export function KenaiSignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useKenaiAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const redirect = ((location.state as { from?: string } | null) || {}).from || '/account'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.signIn(email, password)
      navigate(redirect)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sign in right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-slate-950" />
      <svg className="absolute inset-x-0 top-0 -z-10 h-72 w-full text-emerald-300/10" viewBox="0 0 1200 320" fill="currentColor"><path d="M0 256l92-53.3C184 149 368 43 552 32s368 75 552 101.3L1200 160v160H0z" /></svg>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr,0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 text-white shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Kenai Peninsula Network</p>
          <h1 className="mt-4 text-4xl font-semibold">Sign in to the Kenai Peninsula Network</h1>
          <p className="mt-4 max-w-xl text-sm text-slate-300">One account for all Kenai sites, including {SITE_LABEL}. Your shared profile follows you across the borough, realty, land, rentals, homes, and auto marketplaces.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">Unified login for this site and every sister marketplace.</div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">Shared profile, site roles, and cross-site navigation from one account.</div>
          </div>
          {auth.user ? (
            <div className="mt-8 rounded-[1.5rem] border border-emerald-400/30 bg-emerald-500/10 p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white"><MountainSnow className="h-5 w-5 text-emerald-300" /> Connected Sites</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {auth.networkSites.filter(function (site) { return Boolean(auth.user && auth.user.siteRoles[site.key]) }).map(function (site) {
                  return (
                    <a key={site.key} href={auth.getSiteHref(site)} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-100 transition hover:bg-white/5">
                      <div className="font-semibold">{site.label}</div>
                      <div className="mt-1 capitalize text-emerald-300">{auth.user ? auth.user.siteRoles[site.key] : ''}</div>
                    </a>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-slate-200/20 bg-white/90 p-8 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-950/85 dark:text-white">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300"><LockKeyhole className="h-4 w-4" /> Secure Kenai Network sign in</div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium">Email<input value={email} onChange={function (event) { setEmail(event.target.value) }} type="email" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 dark:border-white/10 dark:bg-slate-900" /></label>
            <label className="block text-sm font-medium">Password<input value={password} onChange={function (event) { setPassword(event.target.value) }} type="password" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 dark:border-white/10 dark:bg-slate-900" /></label>
            {error ? <p className="text-sm text-rose-500">{error}</p> : null}
            <button disabled={loading} className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 disabled:opacity-60" type="submit">{loading ? 'Signing in…' : 'Sign in to the network'}</button>
          </form>
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">Don't have an account? <Link to="/sign-up" className="font-semibold text-emerald-600 dark:text-emerald-300">Create one once and use it everywhere</Link>.</p>
        </div>
      </div>
    </div>
  )
}

export default KenaiSignIn
