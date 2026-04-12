
import { CheckCircle2, UserPlus2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEFAULT_ROLE, SITE_ROLE_OPTIONS, useKenaiAuth } from '../../contexts/KenaiAuthContext'

export function KenaiSignUp() {
  const navigate = useNavigate()
  const auth = useKenaiAuth()
  const defaultOption = SITE_ROLE_OPTIONS.find(function (option) { return option.value === DEFAULT_ROLE }) || SITE_ROLE_OPTIONS[0]
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<string>(defaultOption.value)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!acceptTerms || !acceptPrivacy) {
      setError('Please accept the Terms of Service and Privacy Policy to continue.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await auth.signUp(email, password, fullName, role)
      navigate('/account')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create your Kenai Network account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-500/10 via-emerald-500/10 to-slate-950" />
      <svg className="absolute inset-x-0 top-0 -z-10 h-72 w-full text-sky-300/10" viewBox="0 0 1200 320" fill="currentColor"><path d="M0 224l109.1-21.3C218.2 181 436 139 654.5 154.7 872.7 171 1091 245 1200 282.7V320H0Z" /></svg>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr,1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 text-white shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-300">Kenai Peninsula Network</p>
          <h1 className="mt-4 text-4xl font-semibold">Create one account for every Kenai site</h1>
          <p className="mt-4 text-sm text-slate-300">Your account works across all Kenai Peninsula sites. Choose how you want to use this marketplace today and add more roles later from your network account page.</p>
          <div className="mt-8 space-y-3 text-sm text-slate-200">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">Shared login across borough, realty, land, rentals, homes, and auto marketplaces.</div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">Profile syncing with site-specific roles stored in the unified Kenai Network profile.</div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">Change roles, edit your profile, and jump across sister sites from one dashboard.</div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/20 bg-white/90 p-8 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-950/85 dark:text-white">
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-300"><UserPlus2 className="h-4 w-4" /> Unified Kenai Network registration</div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium">Full name<input value={fullName} onChange={function (event) { setFullName(event.target.value) }} required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 dark:border-white/10 dark:bg-slate-900" /></label>
            <label className="block text-sm font-medium">Email<input value={email} onChange={function (event) { setEmail(event.target.value) }} type="email" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 dark:border-white/10 dark:bg-slate-900" /></label>
            <label className="block text-sm font-medium">Password<input value={password} onChange={function (event) { setPassword(event.target.value) }} type="password" minLength={6} required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 dark:border-white/10 dark:bg-slate-900" /></label>
            <div>
              <p className="text-sm font-medium">How do you want to use this site?</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {SITE_ROLE_OPTIONS.filter(function (option) { return option.value !== 'admin' }).map(function (option) {
                  const selected = role === option.value
                  const className = selected
                    ? 'rounded-2xl border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-left text-sm text-emerald-500 dark:text-emerald-200'
                    : 'rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-600 dark:border-white/10 dark:text-slate-300'
                  return (
                    <button key={option.value} type="button" onClick={function () { setRole(option.value) }} className={className}>
                      <div className="font-semibold capitalize">{option.value.replace(/_/g, ' ')}</div>
                      <div className="mt-1 text-xs opacity-80">{option.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-sky-200 bg-sky-50 p-4 text-sm text-slate-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-slate-200"><div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-sky-500" /> <span>Your account works across all Kenai Peninsula sites.</span></div></div>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-white/10"><input type="checkbox" checked={acceptTerms} onChange={function (event) { setAcceptTerms(event.target.checked) }} className="mt-1" /> <span>I agree to the Terms of Service.</span></label>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-white/10"><input type="checkbox" checked={acceptPrivacy} onChange={function (event) { setAcceptPrivacy(event.target.checked) }} className="mt-1" /> <span>I agree to the Privacy Policy.</span></label>
            {error ? <p className="text-sm text-rose-500">{error}</p> : null}
            <button disabled={loading} type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-500 disabled:opacity-60">{loading ? 'Creating account…' : 'Create Kenai Network account'}</button>
          </form>
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">Already have an account? <Link to="/sign-in" className="font-semibold text-sky-600 dark:text-sky-300">Sign in</Link>.</p>
        </div>
      </div>
    </div>
  )
}

export default KenaiSignUp
