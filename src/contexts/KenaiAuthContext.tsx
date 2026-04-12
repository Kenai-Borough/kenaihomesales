
  /* eslint-disable react-refresh/only-export-components */
  import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
  } from 'react'
  import type { Session, User } from '@supabase/supabase-js'
  import { supabase } from '../lib/supabase'

  export const SITE_NAME = 'homes'
  export const SITE_LABEL = 'Kenai Home Sales'
  export const SITE_DOMAIN = 'https://kenaihomesales.com'
  export const DEFAULT_ROLE = 'buyer'
  export const KENAI_NETWORK_SITES = [{"key": "borough", "label": "Kenai Borough", "url": "https://kenaiborough.com"}, {"key": "realty", "label": "Kenai Borough Realty", "url": "https://kenaiboroughrealty.com"}, {"key": "land", "label": "Kenai Land Sales", "url": "https://kenailandsales.com"}, {"key": "rentals", "label": "Kenai Peninsula Rentals", "url": "https://kenaipeninsularentals.com"}, {"key": "homes", "label": "Kenai Home Sales", "url": "https://kenaihomesales.com"}, {"key": "auto", "label": "Kenai Auto Sales", "url": "https://kenaiautosales.com"}] as { key: string; label: string; url: string }[]
  export const SITE_ROLE_OPTIONS = [
    { value: 'buyer', label: 'Buy homes' },
{ value: 'seller', label: 'Sell homes' },
{ value: 'admin', label: 'Admin access' }
  ] as const

  const STORAGE_KEY = 'kenai-network-demo-' + SITE_NAME

  export interface KenaiUser {
    id: string
    email: string
    fullName: string
    phone?: string
    avatarUrl?: string
    city?: string
    bio?: string
    siteRoles: Record<string, string>
    currentSiteRole: string
    isAdmin: boolean
    isVerified: boolean
  }

  interface KenaiProfileRow {
    id: string
    email: string
    full_name: string | null
    phone: string | null
    avatar_url: string | null
    city: string | null
    bio: string | null
    is_verified: boolean | null
    site_roles: Record<string, string> | null
  }

  interface KenaiAuthContextValue {
    session: Session | null
    user: KenaiUser | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, fullName: string, siteRole?: string) => Promise<void>
    signOut: () => Promise<void>
    updateProfile: (data: Partial<KenaiUser>) => Promise<void>
    hasRole: (role: string) => boolean
    switchSiteRole: (role: string) => Promise<void>
    changePassword: (password: string) => Promise<void>
    deleteAccount: () => Promise<void>
    networkSites: { key: string; label: string; url: string }[]
    getSiteHref: (site: { key: string; label: string; url: string }) => string
  }

  const KenaiAuthContext = createContext<KenaiAuthContextValue | undefined>(undefined)

  function toRoleMap(value: unknown): Record<string, string> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    const entries = Object.entries(value as Record<string, unknown>).filter(function (entry) {
      return typeof entry[1] === 'string'
    }) as [string, string][]
    return Object.fromEntries(entries)
  }

  function readHashTokens() {
    if (typeof window === 'undefined') return null
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return null
    const params = new URLSearchParams(hash)
    const accessToken = params.get('kenai_access_token')
    const refreshToken = params.get('kenai_refresh_token')
    if (!accessToken || !refreshToken) return null
    return { accessToken, refreshToken }
  }

  function clearHashTokens() {
    if (typeof window === 'undefined') return
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  function mapProfile(profile: KenaiProfileRow, fallbackEmail: string): KenaiUser {
    const siteRoles = toRoleMap(profile.site_roles)
    const currentSiteRole = siteRoles[SITE_NAME] || DEFAULT_ROLE
    return {
      id: profile.id,
      email: profile.email || fallbackEmail,
      fullName: profile.full_name || fallbackEmail.split('@')[0] || 'Kenai Member',
      phone: profile.phone || undefined,
      avatarUrl: profile.avatar_url || undefined,
      city: profile.city || undefined,
      bio: profile.bio || undefined,
      siteRoles: siteRoles,
      currentSiteRole: currentSiteRole,
      isAdmin: Object.values(siteRoles).indexOf('admin') >= 0,
      isVerified: Boolean(profile.is_verified),
    }
  }

  function readDemoUser(): KenaiUser | null {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as KenaiUser
    } catch {
      return null
    }
  }

  function saveDemoUser(user: KenaiUser | null) {
    if (typeof window === 'undefined') return
    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }

  function roleFromUser(authUser?: User | null, requestedRole?: string) {
    if (requestedRole) return requestedRole
    const metadata = (authUser && authUser.user_metadata ? authUser.user_metadata : {}) as Record<string, unknown>
    if (typeof metadata.site_role === 'string') return metadata.site_role
    if (typeof metadata.role === 'string') return metadata.role
    return DEFAULT_ROLE
  }

  export function KenaiAuthProvider(props: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<KenaiUser | null>(readDemoUser())
    const [loading, setLoading] = useState(true)

    const syncProfile = useCallback(async function (authUser: User, requestedRole?: string) {
      if (!supabase) return null
      const desiredRole = roleFromUser(authUser, requestedRole)
      const profileTable: any = (supabase as any).from('kenai_profiles')
      const existingResult = await profileTable
        .select('id, email, full_name, phone, avatar_url, city, bio, is_verified, site_roles')
        .eq('id', authUser.id)
        .maybeSingle()
      const existing = (existingResult.data || null) as KenaiProfileRow | null
      const currentRoles = toRoleMap(existing ? existing.site_roles : {})
      if (!currentRoles[SITE_NAME]) currentRoles[SITE_NAME] = desiredRole
      const metadata = (authUser.user_metadata || {}) as Record<string, unknown>
      const payload = {
        id: authUser.id,
        email: authUser.email || (existing ? existing.email : '') || '',
        full_name: (existing && existing.full_name) || (typeof metadata.full_name === 'string' ? metadata.full_name : null) || (authUser.email ? authUser.email.split('@')[0] : 'Kenai Member'),
        phone: (existing && existing.phone) || (typeof metadata.phone === 'string' ? metadata.phone : null),
        avatar_url: existing ? existing.avatar_url : null,
        city: existing ? existing.city : null,
        bio: existing ? existing.bio : null,
        is_verified: (existing && existing.is_verified) || Boolean(authUser.email_confirmed_at),
        site_roles: currentRoles,
        last_active_site: SITE_NAME,
        updated_at: new Date().toISOString(),
      }
      const result = await profileTable
        .upsert(payload)
        .select('id, email, full_name, phone, avatar_url, city, bio, is_verified, site_roles')
        .single()
      if (result.error) throw result.error
      const nextUser = mapProfile(result.data as KenaiProfileRow, authUser.email || '')
      setUser(nextUser)
      return nextUser
    }, [])

    useEffect(function () {
      let active = true
      async function bootstrap() {
        try {
          if (!supabase) {
            setLoading(false)
            return
          }
          const inbound = readHashTokens()
          if (inbound) {
            await supabase.auth.setSession({
              access_token: inbound.accessToken,
              refresh_token: inbound.refreshToken,
            })
            clearHashTokens()
          }
          const sessionResult = await supabase.auth.getSession()
          if (!active) return
          setSession(sessionResult.data.session)
          if (sessionResult.data.session && sessionResult.data.session.user) {
            await syncProfile(sessionResult.data.session.user)
          } else {
            setUser(null)
          }
        } finally {
          if (active) setLoading(false)
        }
      }
      void bootstrap()
      if (!supabase) {
        return function () {
          active = false
        }
      }
      const subscription = supabase.auth.onAuthStateChange(function (_event: any, nextSession: any) {
        setSession(nextSession)
        if (nextSession && nextSession.user) {
          void syncProfile(nextSession.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      }).data.subscription
      return function () {
        active = false
        subscription.unsubscribe()
      }
    }, [syncProfile])

    const signIn = useCallback(async function (email: string, password: string) {
      if (!supabase) {
        const nextUser = {
          id: email,
          email: email,
          fullName: email.split('@')[0].replace(/[-_.]/g, ' '),
          siteRoles: Object.assign({}, { [SITE_NAME]: DEFAULT_ROLE }),
          currentSiteRole: DEFAULT_ROLE,
          isAdmin: false,
          isVerified: true,
        } as KenaiUser
        saveDemoUser(nextUser)
        setUser(nextUser)
        setLoading(false)
        return
      }
      const result = await supabase.auth.signInWithPassword({ email: email, password: password })
      if (result.error) throw result.error
    }, [])

    const signUp = useCallback(async function (email: string, password: string, fullName: string, siteRole?: string) {
      const chosenRole = siteRole || DEFAULT_ROLE
      if (!supabase) {
        const nextUser = {
          id: SITE_NAME + '-' + String(Date.now()),
          email: email,
          fullName: fullName,
          siteRoles: Object.assign({}, { [SITE_NAME]: chosenRole }),
          currentSiteRole: chosenRole,
          isAdmin: chosenRole === 'admin',
          isVerified: false,
        } as KenaiUser
        saveDemoUser(nextUser)
        setUser(nextUser)
        setLoading(false)
        return
      }
      const result = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            site_role: chosenRole,
            site_name: SITE_NAME,
          },
        },
      })
      if (result.error) throw result.error
      if (result.data.user) {
        await syncProfile(result.data.user, chosenRole)
      }
    }, [syncProfile])

    const signOut = useCallback(async function () {
      saveDemoUser(null)
      if (supabase) {
        const result = await supabase.auth.signOut()
        if (result.error) throw result.error
      }
      setSession(null)
      setUser(null)
    }, [])

    const updateProfile = useCallback(async function (data: Partial<KenaiUser>) {
      if (!user) throw new Error('Please sign in to update your account.')
      const nextUser = Object.assign({}, user, data) as KenaiUser
      nextUser.siteRoles = Object.assign({}, user.siteRoles, data.siteRoles || {}, { [SITE_NAME]: data.currentSiteRole || nextUser.currentSiteRole || user.currentSiteRole })
      nextUser.currentSiteRole = nextUser.siteRoles[SITE_NAME] || user.currentSiteRole
      nextUser.isAdmin = Object.values(nextUser.siteRoles).indexOf('admin') >= 0
      if (!supabase) {
        saveDemoUser(nextUser)
        setUser(nextUser)
        return
      }
      const profileTable: any = (supabase as any).from('kenai_profiles')
      const result = await profileTable.update({
          full_name: nextUser.fullName,
          phone: nextUser.phone || null,
          avatar_url: nextUser.avatarUrl || null,
          city: nextUser.city || null,
          bio: nextUser.bio || null,
          site_roles: nextUser.siteRoles,
          is_verified: nextUser.isVerified,
          last_active_site: SITE_NAME,
          updated_at: new Date().toISOString(),
        })
        .eq('id', nextUser.id)
        .select('id, email, full_name, phone, avatar_url, city, bio, is_verified, site_roles')
        .single()
      if (result.error) throw result.error
      setUser(mapProfile(result.data as KenaiProfileRow, nextUser.email))
    }, [user])

    const switchSiteRole = useCallback(async function (role: string) {
      if (!user) throw new Error('Please sign in to switch roles.')
      await updateProfile({ currentSiteRole: role, siteRoles: Object.assign({}, user.siteRoles, { [SITE_NAME]: role }) })
    }, [updateProfile, user])

    const hasRole = useCallback(function (role: string) {
      if (!user) return false
      if (role === 'admin') return user.isAdmin
      return user.currentSiteRole === role || user.isAdmin
    }, [user])

    const changePassword = useCallback(async function (password: string) {
      if (!supabase) return
      const result = await supabase.auth.updateUser({ password: password })
      if (result.error) throw result.error
    }, [])

    const deleteAccount = useCallback(async function () {
      if (!supabase) {
        await signOut()
        return
      }
      const result = await supabase.rpc('delete_kenai_account')
      if (result.error) throw result.error
      await signOut()
    }, [signOut])

    const getSiteHref = useCallback(function (site: { key: string; label: string; url: string }) {
      if (!session || !session.access_token || !session.refresh_token) return site.url
      const params = new URLSearchParams({
        kenai_access_token: session.access_token,
        kenai_refresh_token: session.refresh_token,
      })
      return site.url + '/#' + params.toString()
    }, [session])

    const value = useMemo(function () {
      return {
        session: session,
        user: user,
        loading: loading,
        signIn: signIn,
        signUp: signUp,
        signOut: signOut,
        updateProfile: updateProfile,
        hasRole: hasRole,
        switchSiteRole: switchSiteRole,
        changePassword: changePassword,
        deleteAccount: deleteAccount,
        networkSites: KENAI_NETWORK_SITES,
        getSiteHref: getSiteHref,
      }
    }, [changePassword, deleteAccount, getSiteHref, hasRole, loading, session, signIn, signOut, signUp, switchSiteRole, updateProfile, user])

    return <KenaiAuthContext.Provider value={value}>{props.children}</KenaiAuthContext.Provider>
  }

  export function useKenaiAuth() {
    const context = useContext(KenaiAuthContext)
    if (!context) throw new Error('useKenaiAuth must be used within KenaiAuthProvider')
    return context
  }
