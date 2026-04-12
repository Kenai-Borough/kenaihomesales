
import { supabase } from './supabase'

export type EmailProvider = 'supabase' | 'resend' | 'webhook' | 'none'

export interface EmailPayload {
  to: string
  from?: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  metadata?: Record<string, string>
}

export interface EmailConfig {
  provider: EmailProvider
  apiKey?: string
  webhookUrl?: string
  functionUrl?: string
  defaultFrom: string
}

export interface EmailQueueItem extends EmailPayload {
  id: string
  site: string
  status: 'pending' | 'sent' | 'failed'
  attempts: number
  createdAt: string
  lastAttemptAt?: string
  error?: string
}

export interface EmailSendResult {
  id: string
  provider: EmailProvider | 'queue'
  status: 'sent' | 'queued'
  queued: boolean
  error?: string
}

const site = {
  key: 'homes',
  name: 'Kenai Home Sales',
  domain: 'kenaihomesales.com',
  defaultFrom: 'noreply@kenaihomesales.com',
}

const queueStorageKey = `kenai-email-queue:${site.key}`
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const canUseSupabase = Boolean(supabase && supabaseUrl && supabaseAnonKey)

function getLocalQueue(): EmailQueueItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(queueStorageKey)
    return raw ? (JSON.parse(raw) as EmailQueueItem[]) : []
  } catch {
    return []
  }
}

function setLocalQueue(queue: EmailQueueItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(queueStorageKey, JSON.stringify(queue))
}

function toText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function queueInSupabase(item: EmailQueueItem) {
  if (!canUseSupabase) return false
  try {
    const { error } = await (supabase as any)
      .from('email_queue')
      .insert({
        site: site.key,
        to_email: item.to,
        from_email: item.from,
        subject: item.subject,
        html_body: item.html,
        text_body: item.text,
        reply_to: item.replyTo,
        metadata: item.metadata ?? {},
        status: 'pending',
        attempts: item.attempts,
        last_attempt_at: item.lastAttemptAt ?? null,
        error: item.error ?? null,
      })
    return !error
  } catch {
    return false
  }
}

export class EmailService {
  private config: EmailConfig

  constructor() {
    const provider = (import.meta.env.VITE_EMAIL_PROVIDER as EmailProvider | undefined) ?? 'none'
    this.config = {
      provider,
      apiKey: import.meta.env.VITE_EMAIL_API_KEY as string | undefined,
      webhookUrl: import.meta.env.VITE_EMAIL_WEBHOOK_URL as string | undefined,
      functionUrl: (import.meta.env.VITE_SUPABASE_EMAIL_FUNCTION_URL as string | undefined)
        ?? (supabaseUrl ? `${supabaseUrl}/functions/v1/send-email` : undefined),
      defaultFrom: (import.meta.env.VITE_EMAIL_FROM as string | undefined) ?? site.defaultFrom,
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        void this.processQueue()
      })
    }
  }

  private normalize(payload: EmailPayload): EmailQueueItem {
    return {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      site: site.key,
      status: 'pending',
      attempts: 0,
      createdAt: new Date().toISOString(),
      from: payload.from ?? this.config.defaultFrom,
      text: payload.text ?? toText(payload.html),
      metadata: payload.metadata ?? {},
      ...payload,
    }
  }

  private async dispatch(payload: EmailQueueItem) {
    if (this.config.provider === 'supabase') {
      if (!this.config.functionUrl) throw new Error('Supabase email function URL is missing.')
      const response = await fetch(this.config.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(supabaseAnonKey ? { Authorization: `Bearer ${supabaseAnonKey}` } : {}),
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Supabase email function failed with ${response.status}`)
      return
    }

    if (this.config.provider === 'resend') {
      if (!this.config.apiKey) throw new Error('Resend API key is missing.')
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: payload.from,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
          reply_to: payload.replyTo,
          headers: payload.metadata,
        }),
      })
      if (!response.ok) throw new Error(`Resend request failed with ${response.status}`)
      return
    }

    if (this.config.provider === 'webhook') {
      if (!this.config.webhookUrl) throw new Error('Email webhook URL is missing.')
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Webhook request failed with ${response.status}`)
      return
    }

    throw new Error('No email provider configured.')
  }

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    const item = this.normalize(payload)

    if (this.config.provider === 'none') {
      const queued = await this.queue(item, 'Email provider is not configured yet.')
      console.info(`[${site.name}] queued email`, queued)
      return { id: item.id, provider: 'queue', status: 'queued', queued: true, error: queued.error }
    }

    try {
      await this.dispatch(item)
      return { id: item.id, provider: this.config.provider, status: 'sent', queued: false }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email dispatch failed.'
      const queued = await this.queue(item, message)
      console.warn(`[${site.name}] email queued after send failure`, message)
      return { id: item.id, provider: 'queue', status: 'queued', queued: true, error: queued.error }
    }
  }

  async queue(payload: EmailPayload | EmailQueueItem, error?: string) {
    const base = 'id' in payload ? payload : this.normalize(payload)
    const queued: EmailQueueItem = {
      ...base,
      attempts: (base.attempts ?? 0) + 1,
      lastAttemptAt: new Date().toISOString(),
      error,
      status: 'pending',
    }

    const storedRemotely = await queueInSupabase(queued)
    if (!storedRemotely) {
      const current = getLocalQueue().filter((entry) => entry.id !== queued.id)
      current.unshift(queued)
      setLocalQueue(current.slice(0, 50))
    }

    return queued
  }

  async getQueue(): Promise<EmailQueueItem[]> {
    const local = getLocalQueue()
    if (!canUseSupabase) return local

    try {
      const { data } = await (supabase as any)
        .from('email_queue')
        .select('id, site, to_email, from_email, subject, html_body, text_body, reply_to, metadata, status, attempts, created_at, last_attempt_at, error')
        .eq('site', site.key)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(25)

      const remote = ((data ?? []) as any[]).map((item) => ({
        id: item.id,
        site: item.site,
        to: item.to_email,
        from: item.from_email ?? this.config.defaultFrom,
        subject: item.subject,
        html: item.html_body,
        text: item.text_body ?? toText(item.html_body),
        replyTo: item.reply_to ?? undefined,
        metadata: item.metadata ?? {},
        status: item.status,
        attempts: item.attempts ?? 0,
        createdAt: item.created_at,
        lastAttemptAt: item.last_attempt_at ?? undefined,
        error: item.error ?? undefined,
      }))

      return [...local, ...remote]
    } catch {
      return local
    }
  }

  async processQueue() {
    if (this.config.provider === 'none') return []
    const queue = getLocalQueue()
    const results: EmailSendResult[] = []
    const remaining: EmailQueueItem[] = []

    for (const item of queue) {
      try {
        await this.dispatch(item)
        results.push({ id: item.id, provider: this.config.provider, status: 'sent', queued: false })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Retry failed.'
        remaining.push({ ...item, attempts: item.attempts + 1, lastAttemptAt: new Date().toISOString(), error: message })
        results.push({ id: item.id, provider: 'queue', status: 'queued', queued: true, error: message })
      }
    }

    setLocalQueue(remaining)
    return results
  }
}

export const emailService = new EmailService()
export const emailConfig = site
