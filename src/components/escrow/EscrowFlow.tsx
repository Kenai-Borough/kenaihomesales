import { useState, useMemo } from 'react'
import {
  ShieldCheck,
  FileText,
  HandCoins,
  CheckCircle2,
  Search,
  ClipboardCheck,
  Clock,
  Banknote,
  PartyPopper,
  AlertTriangle,
  XCircle,
  ArrowRightCircle,
  MessageSquare,
  Upload,
  Gavel,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Flame,
  Info,
  Lock,
} from 'lucide-react'
import type {
  EscrowTransaction,
  EscrowEvent,
  EscrowStatus,
  EscrowEventType,
} from '../../types/escrow'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STEP_ORDER: EscrowStatus[] = [
  'draft',
  'offer_pending',
  'offer_accepted',
  'escrow_funded',
  'inspection_period',
  'conditions_review',
  'pending_release',
  'completed',
]

interface StepMeta {
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const STEP_META: Record<EscrowStatus, StepMeta> = {
  draft:              { label: 'Draft',              icon: FileText,       description: 'Offer being prepared' },
  offer_pending:      { label: 'Offer Pending',      icon: HandCoins,      description: 'Awaiting seller response' },
  offer_accepted:     { label: 'Offer Accepted',     icon: CheckCircle2,   description: 'Both parties agreed on terms' },
  escrow_funded:      { label: 'Escrow Funded',      icon: Banknote,       description: 'Earnest deposit received' },
  inspection_period:  { label: 'Inspection Period',  icon: Search,         description: 'Property inspection underway' },
  conditions_review:  { label: 'Conditions Review',  icon: ClipboardCheck, description: 'Reviewing contingencies' },
  pending_release:    { label: 'Pending Release',    icon: Clock,          description: 'Funds ready for release' },
  completed:          { label: 'Completed',          icon: PartyPopper,    description: 'Transaction finalized' },
  disputed:           { label: 'Disputed',           icon: AlertTriangle,  description: 'Under dispute resolution' },
  cancelled:          { label: 'Cancelled',          icon: XCircle,        description: 'Transaction cancelled' },
  refunded:           { label: 'Refunded',           icon: RefreshCw,      description: 'Funds returned' },
}

const TERMINAL: EscrowStatus[] = ['completed', 'cancelled', 'refunded']

const EVENT_ICON: Record<EscrowEventType, React.ComponentType<{ className?: string }>> = {
  status_change: ArrowRightCircle,
  payment:       Banknote,
  document:      Upload,
  message:       MessageSquare,
  dispute:       Gavel,
  inspection:    Search,
  deadline:      Clock,
  system:        Info,
}

const EVENT_COLOR: Record<EscrowEventType, string> = {
  status_change: 'text-cyan-400',
  payment:       'text-emerald-400',
  document:      'text-violet-400',
  message:       'text-slate-400',
  dispute:       'text-rose-400',
  inspection:    'text-amber-400',
  deadline:      'text-amber-400',
  system:        'text-slate-500',
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmt(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function usd(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function countdown(iso: string | null): { label: string; urgency: 'green' | 'yellow' | 'red' } | null {
  if (!iso) return null
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return { label: 'Expired', urgency: 'red' }
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  if (days > 3) return { label: `${days}d ${hours}h`, urgency: 'green' }
  if (days >= 1) return { label: `${days}d ${hours}h`, urgency: 'yellow' }
  return { label: `${hours}h ${Math.floor((ms % 3_600_000) / 60_000)}m`, urgency: 'red' }
}

const urgencyRing: Record<string, string> = {
  green:  'border-emerald-400/40 text-emerald-400',
  yellow: 'border-amber-400/40 text-amber-400',
  red:    'border-rose-400/40 text-rose-400',
}

/* ------------------------------------------------------------------ */
/*  Action definitions                                                 */
/* ------------------------------------------------------------------ */

interface ActionDef {
  key: string
  label: string
  variant: 'primary' | 'danger' | 'neutral'
  confirm?: string
}

function getActions(status: EscrowStatus, role: 'buyer' | 'seller' | 'admin'): ActionDef[] {
  const out: ActionDef[] = []

  if (status === 'offer_pending' && role === 'buyer') {
    out.push({ key: 'cancel_offer', label: 'Cancel Offer', variant: 'danger', confirm: 'Withdraw your offer?' })
  }
  if (status === 'offer_pending' && role === 'seller') {
    out.push({ key: 'accept_offer', label: 'Accept Offer', variant: 'primary' })
    out.push({ key: 'reject_offer', label: 'Reject Offer', variant: 'danger', confirm: 'Reject this offer?' })
    out.push({ key: 'counter_offer', label: 'Counter Offer', variant: 'neutral' })
  }
  if (status === 'escrow_funded' && role === 'buyer') {
    out.push({ key: 'submit_inspection', label: 'Submit Inspection Report', variant: 'primary' })
    out.push({ key: 'waive_inspection', label: 'Waive Inspection', variant: 'neutral', confirm: 'Waive your inspection rights?' })
  }
  if (status === 'pending_release' && role === 'seller') {
    out.push({ key: 'request_release', label: 'Request Release', variant: 'primary' })
  }
  if (status === 'disputed' && role === 'admin') {
    out.push({ key: 'resolve_buyer', label: 'Resolve — Buyer Wins', variant: 'primary' })
    out.push({ key: 'resolve_seller', label: 'Resolve — Seller Wins', variant: 'neutral' })
  }

  if (!TERMINAL.includes(status) && status !== 'disputed') {
    out.push({ key: 'open_dispute', label: 'Open Dispute', variant: 'danger', confirm: 'Open a formal dispute?' })
  }
  if (!TERMINAL.includes(status)) {
    out.push({ key: 'cancel_transaction', label: 'Cancel Transaction', variant: 'danger', confirm: 'This cannot be undone. Cancel?' })
  }

  return out
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 bg-slate-50 border-slate-200 ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{children}</h3>
}

/* ---- Visual Timeline ---- */

function Timeline({ transaction, events }: { transaction: EscrowTransaction; events: EscrowEvent[] }) {
  const currentIdx = STEP_ORDER.indexOf(transaction.status)
  const statusEvents = useMemo(() => {
    const map: Record<string, EscrowEvent> = {}
    for (const e of events) {
      if (e.type === 'status_change') {
        const target = (e.metadata?.to_status as string) ?? ''
        if (target) map[target] = e
      }
    }
    return map
  }, [events])

  return (
    <div className="relative space-y-0">
      {STEP_ORDER.map((step, i) => {
        const meta = STEP_META[step]
        const Icon = meta.icon
        const isCompleted = i < currentIdx
        const isCurrent = step === transaction.status
        const isFuture = i > currentIdx
        const ev = statusEvents[step]

        return (
          <div key={step} className="relative flex gap-4">
            {/* Vertical connector */}
            {i < STEP_ORDER.length - 1 && (
              <div
                className={`absolute left-[17px] top-10 h-[calc(100%-16px)] w-px ${
                  isCompleted ? 'bg-emerald-400/60' : 'bg-white/10 dark:bg-white/10 bg-slate-200'
                }`}
              />
            )}

            {/* Icon node */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  isCompleted
                    ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400'
                    : isCurrent
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.35)] animate-pulse'
                    : 'border-white/10 bg-white/5 text-slate-500 dark:border-white/10 dark:bg-white/5 border-slate-200 bg-slate-100'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
            </div>

            {/* Content */}
            <div className={`pb-7 transition-opacity ${isFuture ? 'opacity-40' : 'opacity-100'}`}>
              <p className={`text-sm font-semibold ${isCurrent ? 'text-cyan-300 dark:text-cyan-300 text-cyan-600' : 'text-slate-200 dark:text-slate-200 text-slate-700'}`}>
                {meta.label}
              </p>
              <p className="text-xs text-slate-400">{meta.description}</p>
              {ev && (
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {fmtTime(ev.created_at)} · {ev.actor_name}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---- Action Panel ---- */

function ActionPanel({
  transaction,
  userRole,
  onAction,
}: {
  transaction: EscrowTransaction
  userRole: 'buyer' | 'seller' | 'admin'
  onAction: (action: string, data?: unknown) => Promise<void>
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const actions = getActions(transaction.status, userRole)

  async function fire(a: ActionDef) {
    if (a.confirm && !window.confirm(a.confirm)) return
    setLoading(a.key)
    try { await onAction(a.key) } finally { setLoading(null) }
  }

  if (actions.length === 0) return null

  const btnClass: Record<string, string> = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25',
    danger:  'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30',
    neutral: 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10',
  }

  return (
    <GlassCard>
      <SectionTitle>Actions</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.key}
            disabled={loading !== null}
            onClick={() => fire(a)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 ${btnClass[a.variant]} shadow-lg`}
          >
            {loading === a.key && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            {a.label}
          </button>
        ))}
      </div>
    </GlassCard>
  )
}

/* ---- Financial Summary ---- */

function FinancialSummary({ transaction }: { transaction: EscrowTransaction }) {
  const platformFee = transaction.sale_price * (transaction.platform_fee_pct / 100)
  const sellerReceives = transaction.sale_price - platformFee
  const traditionalCommission = transaction.sale_price * 0.055
  const savings = traditionalCommission - platformFee

  const stripeColor: Record<string, string> = {
    funded:   'text-emerald-400',
    pending:  'text-amber-400',
    released: 'text-cyan-400',
    refunded: 'text-slate-400',
  }

  return (
    <GlassCard>
      <SectionTitle>Financial Summary</SectionTitle>
      <div className="space-y-2 text-sm">
        <Row label="Sale Price" value={usd(transaction.sale_price)} bold />
        <Row label="Earnest Deposit" value={usd(transaction.earnest_deposit)} />
        <Row label={`Platform Fee (${transaction.platform_fee_pct}%)`} value={usd(platformFee)} />
        <div className="my-2 border-t border-white/10 dark:border-white/10 border-slate-200" />
        <Row label="Seller Receives" value={usd(sellerReceives)} bold />
      </div>

      {/* Savings callout */}
      {savings > 0 && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
          <Flame className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
          <p className="text-xs leading-relaxed text-emerald-300 dark:text-emerald-300 text-emerald-700">
            <span className="font-bold">You save {usd(savings)}</span> vs. a traditional 5–6% agent commission
          </p>
        </div>
      )}

      {/* Stripe status */}
      {transaction.stripe_escrow_status && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <Lock className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-slate-400">Stripe Escrow:</span>
          <span className={`font-semibold capitalize ${stripeColor[transaction.stripe_escrow_status] ?? 'text-slate-400'}`}>
            {transaction.stripe_escrow_status}
          </span>
        </div>
      )}
    </GlassCard>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={bold ? 'font-semibold text-white dark:text-white text-slate-900' : 'text-slate-300 dark:text-slate-300 text-slate-600'}>{value}</span>
    </div>
  )
}

/* ---- Event Feed ---- */

function EventFeed({ events }: { events: EscrowEvent[] }) {
  const [expanded, setExpanded] = useState(false)
  const sorted = useMemo(() => [...events].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [events])
  const visible = expanded ? sorted : sorted.slice(0, 5)

  return (
    <GlassCard>
      <SectionTitle>Activity Feed</SectionTitle>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
        {visible.map((ev) => {
          const Icon = EVENT_ICON[ev.type] ?? Info
          return (
            <div key={ev.id} className="flex items-start gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100">
              <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${EVENT_COLOR[ev.type]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-200 dark:text-slate-200 text-slate-700">{ev.description}</p>
                <p className="text-[11px] text-slate-500">
                  {ev.actor_name} · {fmtTime(ev.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        {sorted.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No events yet</p>}
      </div>
      {sorted.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex w-full items-center justify-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition"
        >
          {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> Show all {sorted.length} events</>}
        </button>
      )}
    </GlassCard>
  )
}

/* ---- Deadline Tracker ---- */

function DeadlineTracker({ transaction }: { transaction: EscrowTransaction }) {
  const deadlines = [
    { label: 'Inspection Deadline', cd: countdown(transaction.inspection_deadline), raw: transaction.inspection_deadline },
    { label: 'Conditions Deadline', cd: countdown(transaction.conditions_deadline), raw: transaction.conditions_deadline },
    { label: 'Closing Date',        cd: countdown(transaction.closing_date),        raw: transaction.closing_date },
  ].filter((d) => d.raw)

  if (deadlines.length === 0) return null

  return (
    <GlassCard>
      <SectionTitle>Deadlines</SectionTitle>
      <div className="space-y-2">
        {deadlines.map((d) => (
          <div
            key={d.label}
            className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm ${
              d.cd ? urgencyRing[d.cd.urgency] : 'border-white/10 text-slate-400'
            }`}
          >
            <span className="text-slate-300 dark:text-slate-300 text-slate-600">{d.label}</span>
            <div className="text-right">
              <span className="font-mono font-semibold">{d.cd?.label ?? '—'}</span>
              {d.raw && <p className="text-[10px] text-slate-500">{fmt(d.raw)}</p>}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

/**
 * EscrowFlow — Full escrow transaction lifecycle panel.
 *
 * Renders a visual timeline, context-aware action buttons,
 * financial summary, live event feed, and deadline tracker
 * for a Kenai Borough Network escrow transaction.
 *
 * @example
 * ```tsx
 * <EscrowFlow
 *   transaction={tx}
 *   events={events}
 *   userRole="buyer"
 *   onAction={async (action, data) => { await api.escrow(action, data) }}
 * />
 * ```
 */
export default function EscrowFlow({
  transaction,
  events,
  userRole,
  onAction,
}: {
  transaction: EscrowTransaction
  events: EscrowEvent[]
  userRole: 'buyer' | 'seller' | 'admin'
  onAction: (action: string, data?: unknown) => Promise<void>
}) {
  const isTerminal = TERMINAL.includes(transaction.status)

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-0">
      {/* ---- Header / Shield Badge ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white dark:text-white text-slate-900 sm:text-2xl">
            {transaction.listing_title}
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">{transaction.listing_address}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 dark:text-cyan-300 text-cyan-700 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
          <ShieldCheck className="h-4 w-4" />
          Protected by Kenai Escrow
        </div>
      </div>

      {/* ---- Disputed / Terminal banner ---- */}
      {transaction.status === 'disputed' && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-sm text-rose-300">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          This transaction is under dispute. An administrator will review and resolve.
        </div>
      )}
      {isTerminal && transaction.status !== 'completed' && (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-400">
          <Info className="h-5 w-5 flex-shrink-0" />
          This transaction has been {transaction.status}. No further actions are available.
        </div>
      )}

      {/* ---- Two-column layout ---- */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-6">
          <GlassCard>
            <SectionTitle>Transaction Progress</SectionTitle>
            <Timeline transaction={transaction} events={events} />
          </GlassCard>

          <ActionPanel transaction={transaction} userRole={userRole} onAction={onAction} />

          <EventFeed events={events} />
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <FinancialSummary transaction={transaction} />
          <DeadlineTracker transaction={transaction} />

          {/* Role indicator */}
          <GlassCard className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Your Role</p>
            <p className="mt-1 text-lg font-bold capitalize text-slate-200 dark:text-slate-200 text-slate-700">
              {userRole}
            </p>
            <p className="text-xs text-slate-500">
              Transaction #{transaction.id.slice(0, 8)}
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export { EscrowFlow }
