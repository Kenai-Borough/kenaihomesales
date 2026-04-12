import React, { useState } from 'react'
import {
  ShieldCheck,
  Lock,
  Eye,
  Scale,
  ChevronDown,
  ChevronUp,
  BadgeDollarSign,
  ArrowRight,
  CreditCard,
  FileSearch,
  CheckCircle2,
} from 'lucide-react'

interface EscrowGuaranteeProps {
  salePrice?: number
  compact?: boolean
}

const GUARANTEES = [
  {
    icon: Lock,
    title: 'Secure Escrow',
    description: 'Funds held in secure escrow until all conditions are met',
  },
  {
    icon: Eye,
    title: 'Buyer Protection',
    description: 'Full buyer protection during inspection period',
  },
  {
    icon: Scale,
    title: 'Dispute Resolution',
    description: 'Dispute resolution backed by documented evidence',
  },
] as const

const ESCROW_STEPS = [
  { icon: CreditCard, label: 'Buyer deposits funds into escrow' },
  { icon: FileSearch, label: 'Inspection period begins — buyer reviews asset' },
  { icon: CheckCircle2, label: 'Buyer approves or raises dispute' },
  { icon: BadgeDollarSign, label: 'Funds released to seller upon approval' },
] as const

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function EscrowGuarantee({ salePrice, compact = false }: EscrowGuaranteeProps) {
  const [expanded, setExpanded] = useState(false)

  const traditionalCommission = 0.055
  const savings = salePrice ? Math.round(salePrice * traditionalCommission) : null

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl
        bg-gradient-to-r from-slate-800/80 to-teal-900/40
        border border-teal-500/20 backdrop-blur-sm"
      >
        <div className="relative flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-400" />
        </div>
        <span className="text-sm font-medium text-teal-200">Protected by Kenai Escrow</span>
        {savings && (
          <span className="ml-auto text-xs font-semibold text-emerald-400">
            Save {formatCurrency(savings)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl
      bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950
      border border-teal-500/15 shadow-2xl shadow-teal-900/20"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full
          bg-teal-500/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full
          bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative p-3 rounded-xl bg-teal-500/10 ring-1 ring-teal-400/20">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-teal-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Protected by Kenai Escrow
            </h3>
            <p className="text-sm text-teal-300/70 mt-0.5">
              Your transaction is secured end-to-end
            </p>
          </div>
        </div>

        {/* Guarantee points */}
        <div className="grid gap-3">
          {GUARANTEES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-3 p-3.5 rounded-xl
                bg-white/[0.03] border border-white/[0.06]
                backdrop-blur-sm hover:bg-white/[0.05] transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-teal-500/10 mt-0.5">
                <Icon className="w-4.5 h-4.5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-100">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Savings callout */}
        {savings && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl
            bg-emerald-500/10 border border-emerald-500/20"
          >
            <BadgeDollarSign className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-bold text-emerald-300">
                Save {formatCurrency(savings)}
              </span>
              <span className="text-emerald-400/70 ml-1">
                vs traditional 5.5% agent commission
              </span>
            </p>
          </div>
        )}

        {/* How it works (expandable) */}
        <div className="border-t border-white/5 pt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-teal-300
              hover:text-teal-200 transition-colors w-full"
          >
            <span>How it works</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expanded && (
            <div className="mt-4 space-y-0 animate-[fadeIn_0.3s_ease-out]">
              {ESCROW_STEPS.map(({ icon: StepIcon, label }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="p-1.5 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/20">
                      <StepIcon className="w-4 h-4 text-teal-400" />
                    </div>
                    {i < ESCROW_STEPS.length - 1 && (
                      <div className="w-px h-6 bg-gradient-to-b from-teal-500/30 to-transparent my-1" />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm text-gray-300 leading-tight">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-6 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Secured by Stripe</span>
          </div>
          <div className="w-px h-3 bg-gray-700" />
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  )
}
