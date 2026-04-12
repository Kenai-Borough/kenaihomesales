import React, { useState } from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Diamond,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  FileCheck,
  UserCheck,
} from 'lucide-react'

interface NetworkTrustBadgeProps {
  trustLevel: 'new' | 'basic' | 'verified' | 'trusted' | 'premium'
  score: number
  stats?: {
    totalTransactions: number
    completedTransactions: number
    averageRating: number
    responseTimeHours: number
  }
  verifications?: {
    identity: boolean
    phone: boolean
    email: boolean
    documents: number
  }
  compact?: boolean
  className?: string
}

const TRUST_CONFIG = {
  new: {
    label: 'New to Network',
    icon: Shield,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    ring: 'ring-gray-400/30',
    gradient: 'from-gray-500/20 to-gray-600/10',
  },
  basic: {
    label: 'Active Member',
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    ring: 'ring-blue-400/30',
    gradient: 'from-blue-500/20 to-blue-600/10',
  },
  verified: {
    label: 'Identity Verified',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    ring: 'ring-emerald-400/30',
    gradient: 'from-emerald-500/20 to-emerald-600/10',
  },
  trusted: {
    label: 'Trusted Seller',
    icon: ShieldAlert,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    ring: 'ring-amber-400/30',
    gradient: 'from-amber-500/20 to-amber-600/10',
  },
  premium: {
    label: 'Premium Network Member',
    icon: Diamond,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    ring: 'ring-purple-400/30',
    gradient: 'from-purple-500/20 to-purple-600/10',
  },
} as const

function VerificationItem({ verified, label, icon: Icon }: { verified: boolean; label: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {verified ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-gray-500" />
      )}
      <Icon className="w-3 h-3 text-gray-400" />
      <span className={verified ? 'text-gray-200' : 'text-gray-500'}>{label}</span>
    </div>
  )
}

export default function NetworkTrustBadge({
  trustLevel,
  score,
  stats,
  verifications,
  compact = false,
  className = '',
}: NetworkTrustBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const config = TRUST_CONFIG[trustLevel]
  const TrustIcon = config.icon

  const completionRate = stats && stats.totalTransactions > 0
    ? Math.round((stats.completedTransactions / stats.totalTransactions) * 100)
    : 0

  if (compact) {
    return (
      <div
        className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border
          ${config.bg} ${config.border} backdrop-blur-sm animate-[fadeIn_0.3s_ease-out] ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <TrustIcon className={`w-3.5 h-3.5 ${config.color}`} />
        <span className={`text-xs font-semibold ${config.color}`}>{score}</span>

        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 p-3 rounded-xl
            bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl text-left">
            <p className={`text-sm font-semibold ${config.color} mb-1`}>{config.label}</p>
            <p className="text-xs text-gray-400">Trust Score: {score}/100</p>
            {stats && (
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <p>{stats.completedTransactions} completed transactions</p>
                <p>{completionRate}% completion rate</p>
                <p>{stats.averageRating.toFixed(1)} avg rating</p>
              </div>
            )}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2
              bg-gray-900/95 rotate-45 border-r border-b border-white/10" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border backdrop-blur-xl overflow-hidden
      bg-gradient-to-br ${config.gradient} ${config.border}
      dark:bg-gray-900/60 animate-[fadeIn_0.4s_ease-out] ${className}`}
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${config.bg} ring-1 ${config.ring}`}>
              <TrustIcon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${config.color}`}>{config.label}</p>
              <p className="text-xs text-gray-500">Trust Score</p>
            </div>
          </div>
          <div className={`text-3xl font-black ${config.color}`}>{score}</div>
        </div>

        {/* Score bar */}
        <div className="h-1.5 rounded-full bg-gray-700/50 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-700`}
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>

        {/* Verifications */}
        {verifications && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <VerificationItem verified={verifications.identity} label="ID Verified" icon={UserCheck} />
            <VerificationItem verified={verifications.phone} label="Phone" icon={Phone} />
            <VerificationItem verified={verifications.email} label="Email" icon={Mail} />
            <VerificationItem
              verified={verifications.documents > 0}
              label={`${verifications.documents} Doc${verifications.documents !== 1 ? 's' : ''}`}
              icon={FileCheck}
            />
          </div>
        )}

        {/* Transaction stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-100">{stats.completedTransactions}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-100">{completionRate}%</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rate</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-lg font-bold text-gray-100">{stats.averageRating.toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rating</p>
            </div>
          </div>
        )}

        {/* Response time */}
        {stats && (
          <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Responds in ~{stats.responseTimeHours}h</span>
          </div>
        )}
      </div>
    </div>
  )
}
