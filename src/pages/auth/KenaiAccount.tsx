
import { Globe2, KeyRound, Trash2, UserCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { SITE_ROLE_OPTIONS, useKenaiAuth } from '../../contexts/KenaiAuthContext'
import { EmailPreferences } from '../../components/EmailPreferences'

export function KenaiAccount() {
  const auth = useKenaiAuth()
  const [fullName, setFullName] = useState(auth.user ? auth.user.fullName : '')
  const [phone, setPhone] = useState(auth.user ? auth.user.phone || '' : '')
  const [city, setCity] = useState(auth.user ? auth.user.city || 'Kenai' : 'Kenai')
  const [bio, setBio] = useState(auth.user ? auth.user.bio || '' : '')
  const [avatarUrl, setAvatarUrl] = useState(auth.user ? auth.user.avatarUrl || '' : '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  if (!auth.user) return <Navigate to="/sign-in" replace />

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await auth.updateProfile({ fullName: fullName, phone: phone, city: city, bio: bio, avatarUrl: avatarUrl })
      setMessage('Your Kenai Network profile has been updated.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save your profile.')
    }
  }

  async function handlePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!password) return
    setError('')
    setMessage('')
    try {
      await auth.changePassword(password)
      setPassword('')
      setMessage('Your password has been updated.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update your password.')
    }
  }

  async function handleDelete() {
    const ok = window.confirm('Delete your Kenai Network account across all Kenai sites?')
    if (!ok) return
    try {
      await auth.deleteAccount()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to delete your account.')
    }
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[1.05fr,0.95fr]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 text-white shadow-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Kenai Peninsula Network</p>
            <h1 className="mt-4 text-4xl font-semibold">My Kenai Network account</h1>
            <p className="mt-3 text-sm text-slate-300">Manage your shared profile for this marketplace and every sister site in the Kenai sale bundle.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Current role: <span className="capitalize text-emerald-300">{auth.user.currentSiteRole}</span></span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Verification: {auth.user.isVerified ? 'Verified' : 'Pending'}</span>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/85 dark:text-white">
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium">Full name<input value={fullName} onChange={function (event) { setFullName(event.target.value) }} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900" /></label>
                <label className="block text-sm font-medium">Phone<input value={phone} onChange={function (event) { setPhone(event.target.value) }} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium">City<input value={city} onChange={function (event) { setCity(event.target.value) }} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900" /></label>
                <label className="block text-sm font-medium">Avatar URL<input value={avatarUrl} onChange={function (event) { setAvatarUrl(event.target.value) }} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900" /></label>
              </div>
              <label className="block text-sm font-medium">Bio<textarea value={bio} onChange={function (event) { setBio(event.target.value) }} rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900" /></label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Save profile</button>
                <button type="button" onClick={function () { void auth.signOut() }} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold dark:border-white/10">Sign out</button>
              </div>
            </form>
            {message ? <p className="mt-4 text-sm text-emerald-500">{message}</p> : null}
            {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/85 dark:text-white">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-300"><Globe2 className="h-4 w-4" /> My Kenai Network</div>
            <div className="mt-6 space-y-3">
              {auth.networkSites.map(function (site) {
                return (
                  <a key={site.key} href={auth.getSiteHref(site)} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm transition hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-400/40">
                    <span>{site.label}</span>
                    <span className="capitalize text-sky-600 dark:text-sky-300">{auth.user ? auth.user.siteRoles[site.key] || 'Not set yet' : 'Not set yet'}</span>
                  </a>
                )
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/85 dark:text-white">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300"><UserCircle2 className="h-4 w-4" /> Site role</div>
            <div className="mt-4 grid gap-3">
              {SITE_ROLE_OPTIONS.map(function (option) {
                const selected = auth.user && auth.user.currentSiteRole === option.value
                const className = selected
                  ? 'rounded-2xl border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-left text-sm text-emerald-600 dark:text-emerald-200'
                  : 'rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm dark:border-white/10'
                return (
                  <button key={option.value} type="button" onClick={function () { void auth.switchSiteRole(option.value) }} className={className}>
                    <div className="font-semibold capitalize">{option.value.replace(/_/g, ' ')}</div>
                    <div className="mt-1 opacity-75">{option.label}</div>
                  </button>
                )
              })}
            </div>
          </section>

          <EmailPreferences userId={auth.user.id} userEmail={auth.user.email} />

          <EmailPreferences userId={auth.user.id} userEmail={auth.user.email} />

          <EmailPreferences userId={auth.user.id} userEmail={auth.user.email} />

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/85 dark:text-white">
            <form className="space-y-4" onSubmit={handlePassword}>
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-300"><KeyRound className="h-4 w-4" /> Change password</div>
              <input type="password" value={password} onChange={function (event) { setPassword(event.target.value) }} minLength={6} placeholder="New password" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900" />
              <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Update password</button>
            </form>
            <div className="mt-8 rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 dark:border-rose-500/20 dark:bg-rose-500/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-300"><Trash2 className="h-4 w-4" /> Delete account</div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This removes your Kenai Network account for every connected Kenai site.</p>
              <button type="button" onClick={handleDelete} className="mt-4 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white">Delete account</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default KenaiAccount
