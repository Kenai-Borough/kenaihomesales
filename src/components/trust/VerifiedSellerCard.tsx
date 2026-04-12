import React from 'react'
import {
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  Phone,
  Mail,
  FileCheck,
  MessageCircle,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react'
import NetworkTrustBadge from './NetworkTrustBadge'

interface VerifiedSellerCardProps {
  seller: {
    id: string
    fullName: string
    avatarUrl?: string
    memberSince: string
    trustLevel: string
    trustScore: number
    responseTimeHours: number
    totalTransactions: number
    completedTransactions: number
    averageRating: number
    reviewCount: number
    verifications: {
      identity: boolean
      phone: boolean
      email: boolean
      documents: number
    }
  }
  onContact?: () => void
  onViewProfile?: () => void
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function VerificationRow({
  verified,
  label,
  icon: Icon,
}: {
  verified: boolean
  label: string
  icon: React.ElementType
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      {verified ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-gray-600 flex-shrink-0" />
      )}
      <Icon className="w-3.5 h-3.5 text-gray-400" />
      <span className={`text-sm ${verified ? 'text-gray-200' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  )
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-200">{rating.toFixed(1)}</span>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  )
}

export default function VerifiedSellerCard({
  seller,
  onContact,
  onViewProfile,
  className = '',
}: VerifiedSellerCardProps) {
  const memberDate = new Date(seller.memberSince)
  const memberSinceFormatted = memberDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  const trustLevel = seller.trustLevel as
    | 'new'
    | 'basic'
    | 'verified'
    | 'trusted'
    | 'premium'

  return (
    <div
      className={`rounded-2xl border border-white/[0.08] overflow-hidden
        bg-gray-900/60 backdrop-blur-xl
        dark:bg-gray-900/80 dark:border-white/[0.06]
        shadow-xl shadow-black/20
        hover:border-white/[0.12] transition-all duration-300
        animate-[fadeIn_0.4s_ease-out] ${className}`}
    >
      <div className="p-5 space-y-4">
        {/* Profile header */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {seller.avatarUrl ? (
            <img
              src={seller.avatarUrl}
              alt={seller.fullName}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30
              ring-2 ring-white/10 flex items-center justify-center"
            >
              <span className="text-lg font-bold text-gray-200">
                {getInitials(seller.fullName)}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white truncate">{seller.fullName}</h3>
              <NetworkTrustBadge
                trustLevel={trustLevel}
                score={seller.trustScore}
                compact
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Member since {memberSinceFormatted}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 py-3 px-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-base font-bold text-gray-100">
                {seller.completedTransactions}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Sales</p>
          </div>
          <div className="text-center border-x border-white/5">
            <StarRating rating={seller.averageRating} count={seller.reviewCount} />
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-base font-bold text-gray-100">
                {seller.responseTimeHours}h
              </span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Response</p>
          </div>
        </div>

        {/* Response time note */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5 text-teal-400/70" />
          <span>Usually responds within {seller.responseTimeHours} hours</span>
        </div>

        {/* Verification checklist */}
        <div className="space-y-0.5 pt-2 border-t border-white/5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Verifications
          </p>
          <VerificationRow
            verified={seller.verifications.identity}
            label="Identity Verified"
            icon={UserCheck}
          />
          <VerificationRow
            verified={seller.verifications.phone}
            label="Phone Verified"
            icon={Phone}
          />
          <VerificationRow
            verified={seller.verifications.email}
            label="Email Verified"
            icon={Mail}
          />
          <VerificationRow
            verified={seller.verifications.documents > 0}
            label={`${seller.verifications.documents} Document${seller.verifications.documents !== 1 ? 's' : ''} on File`}
            icon={FileCheck}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-white/5">
          <button
            onClick={onContact}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm
              transition-colors shadow-lg shadow-teal-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Seller
          </button>
          <button
            onClick={onViewProfile}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl
              bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08]
              text-gray-300 hover:text-white font-medium text-sm
              transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Profile
          </button>
        </div>
      </div>
    </div>
  )
}
