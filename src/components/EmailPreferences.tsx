
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

interface EmailPreferencesProps {
  userId?: string
  userEmail?: string
  className?: string
}

interface PreferenceState {
  marketing: boolean
  inquiries: boolean
  bookings: boolean
  alerts: boolean
  weeklyDigest: boolean
}

const DEFAULT_PREFERENCES: PreferenceState = {
  marketing: true,
  inquiries: true,
  bookings: true,
  alerts: true,
  weeklyDigest: true,
}

const storagePrefix = 'kenai-email-preferences:homes'
const canUseSupabase = Boolean(supabase && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

function storageKey(userId?: string, userEmail?: string) {
  return `${storagePrefix}:${userId ?? userEmail ?? 'guest'}`
}

export function EmailPreferences({ userId, userEmail, className = '' }: EmailPreferencesProps) {
  const [preferences, setPreferences] = useState<PreferenceState>(DEFAULT_PREFERENCES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  const localKey = useMemo(() => storageKey(userId, userEmail), [userEmail, userId])

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      try {
        if (canUseSupabase && userId) {
          const { data } = await (supabase as any)
            .from('email_preferences')
            .select('marketing, inquiries, bookings, alerts, weekly_digest')
            .eq('user_id', userId)
            .maybeSingle()

          if (data && active) {
            setPreferences({
              marketing: data.marketing ?? true,
              inquiries: data.inquiries ?? true,
              bookings: data.bookings ?? true,
              alerts: data.alerts ?? true,
              weeklyDigest: data.weekly_digest ?? true,
            })
            setLoading(false)
            return
          }
        }
      } catch {
        // local fallback below
      }

      if (typeof window !== 'undefined') {
        try {
          const raw = window.localStorage.getItem(localKey)
          if (raw && active) setPreferences({ ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<PreferenceState>) })
        } catch {
          // ignore invalid cached prefs
        }
      }
      if (active) setLoading(false)
    }

    void load()
    return () => {
      active = false
    }
  }, [localKey, userId])

  function update(key: keyof PreferenceState) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
    setStatus('')
  }

  async function savePreferences(next: PreferenceState) {
    setSaving(true)
    setStatus('')
    try {
      if (canUseSupabase && userId) {
        const { error } = await (supabase as any).from('email_preferences').upsert({
          user_id: userId,
          marketing: next.marketing,
          inquiries: next.inquiries,
          bookings: next.bookings,
          alerts: next.alerts,
          weekly_digest: next.weeklyDigest,
          updated_at: new Date().toISOString(),
        })
        if (error) throw error
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(localKey, JSON.stringify(next))
      }
      setStatus(canUseSupabase && userId ? 'Preferences saved.' : 'Preferences saved locally until Supabase email tables are ready.')
    } catch (error) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(localKey, JSON.stringify(next))
      }
      setStatus(error instanceof Error ? `Saved locally: ${error.message}` : 'Saved locally with offline fallback.')
    } finally {
      setSaving(false)
    }
  }

  const rows = [
    ['marketing', 'Marketing emails', 'Announcements, promotions, and featured opportunities.'],
    ['inquiries', 'Inquiry notifications', 'Buyer, seller, and message notifications.'],
    ['bookings', 'Booking notifications', 'Guest, host, and reservation updates.'],
    ['alerts', 'Search alerts', 'Saved search matches and listing alerts.'],
    ['weeklyDigest', 'Weekly digest', 'A weekly summary of activity and recommendations.'],
  ] as const

  return (
    <section className={`rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/85 dark:text-white ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: '#0891b2' }}>Email preferences</p>
          <h2 className="mt-2 text-2xl font-semibold">Choose which updates reach your inbox</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Branded notifications are ready now and will queue safely when a provider is not configured.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {rows.map(([key, label, description]) => (
          <label key={key} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-4 dark:border-white/10">
            <div>
              <div className="font-semibold">{label}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</div>
            </div>
            <button
              type="button"
              aria-pressed={preferences[key]}
              onClick={() => update(key)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${preferences[key] ? '' : 'bg-slate-300 dark:bg-slate-700'}`}
              style={{ backgroundColor: preferences[key] ? '#0891b2' : undefined }}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${preferences[key] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving || loading}
          onClick={() => void savePreferences(preferences)}
          className="rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: '#0891b2' }}
        >
          {saving ? 'Saving…' : 'Save preferences'}
        </button>
        <button
          type="button"
          disabled={saving || loading}
          onClick={() => {
            const next = { marketing: false, inquiries: false, bookings: false, alerts: false, weeklyDigest: false }
            setPreferences(next)
            void savePreferences(next)
          }}
          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold dark:border-white/10"
        >
          Unsubscribe from all
        </button>
      </div>

      {loading ? <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading saved preferences…</p> : null}
      {status ? <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{status}</p> : null}
      {!userId && !userEmail ? <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Preferences will be stored locally until an account email is available.</p> : null}
    </section>
  )
}

export default EmailPreferences
