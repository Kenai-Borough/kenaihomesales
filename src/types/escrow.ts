/**
 * @fileoverview Unified escrow & transaction types for the Kenai Borough Network.
 *
 * The Kenai Network comprises 7 interconnected FSBO (For Sale By Owner)
 * marketplace sites on the Kenai Peninsula, Alaska. Every site shares a
 * single Supabase project, a unified auth schema (`kenai_profiles`), and
 * this common escrow layer so buyers and sellers can transact directly —
 * no agents, no middlemen, no hidden commissions.
 *
 * Traditional real-estate commissions on the Kenai Peninsula run 5–6 %.
 * Our flat + low-percentage model returns the vast majority of that back
 * to the people who actually own and buy the property.
 *
 * @module kenai-shared/types/escrow
 * @version 1.0.0
 * @license UNLICENSED — proprietary to the Kenai Borough Network
 */

// ────────────────────────────────────────────────────────────────────────────
// Site & Listing Identifiers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Identifiers for each site in the Kenai Borough Network.
 *
 * | Key        | Domain                         |
 * |------------|--------------------------------|
 * | borough    | kenaiborough.com               |
 * | realty     | kenaiboroughrealty.com          |
 * | land       | kenailandsales.com             |
 * | homes      | kenaihomesales.com             |
 * | auto       | kenaiautosales.com             |
 * | listings   | kenailistings.com              |
 * | rentals    | kenaipeninsula-rentals.com      |
 */
export type KenaiSiteKey =
  | 'borough'
  | 'realty'
  | 'land'
  | 'homes'
  | 'auto'
  | 'listings'
  | 'rentals'

/**
 * The category of item being sold or transferred.
 * Each listing type maps loosely to one or more network sites.
 */
export type ListingType =
  | 'property'   // realty — houses, condos, multi-family
  | 'parcel'     // land  — raw land, acreage, homestead lots
  | 'home'       // homes — residential homes
  | 'vehicle'    // auto  — cars, trucks, ATVs, boats
  | 'listing'    // listings — general marketplace items
  | 'rental'     // rentals — lease/rental agreements

// ────────────────────────────────────────────────────────────────────────────
// Transaction & Escrow Status
// ────────────────────────────────────────────────────────────────────────────

/**
 * Full lifecycle status for an escrow transaction.
 *
 * Happy path: draft → offer_pending → offer_accepted → escrow_funded
 *   → inspection_period → conditions_review → pending_release → completed
 *
 * Unhappy paths branch off at any active step:
 *   - cancelled  — either party walks away before funding
 *   - disputed   — disagreement after funding; requires admin review
 *   - refunded   — funds returned to buyer after dispute resolution
 */
export type EscrowStatus =
  | 'draft'
  | 'offer_pending'
  | 'offer_accepted'
  | 'escrow_funded'
  | 'inspection_period'
  | 'conditions_review'
  | 'pending_release'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'refunded'

/**
 * Every mutation to an escrow transaction is recorded as an event.
 * This provides an immutable audit trail for both parties and the platform.
 */
export type EscrowEventType =
  // Lifecycle transitions
  | 'transaction_created'
  | 'offer_submitted'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'offer_countered'
  | 'offer_expired'
  | 'escrow_funded'
  | 'escrow_funding_failed'
  // Inspection & conditions
  | 'inspection_started'
  | 'inspection_completed'
  | 'inspection_waived'
  | 'condition_added'
  | 'condition_met'
  | 'condition_waived'
  | 'conditions_cleared'
  // Document events
  | 'document_uploaded'
  | 'document_signed'
  | 'document_rejected'
  | 'document_requested'
  // Contract events
  | 'contract_generated'
  | 'contract_signed_buyer'
  | 'contract_signed_seller'
  | 'contract_finalized'
  // Payment events
  | 'payment_initiated'
  | 'payment_received'
  | 'payment_released'
  | 'payment_refunded'
  | 'payment_failed'
  // Release & completion
  | 'release_requested'
  | 'release_approved'
  | 'release_delayed'
  | 'transaction_completed'
  // Unhappy paths
  | 'transaction_cancelled'
  | 'dispute_opened'
  | 'dispute_evidence_submitted'
  | 'dispute_resolved'
  | 'refund_initiated'
  | 'refund_completed'
  // Communication
  | 'message_sent'
  | 'message_read'
  // Admin actions
  | 'admin_override'
  | 'admin_note_added'
  | 'admin_hold_placed'
  | 'admin_hold_released'
  // Deadlines
  | 'deadline_set'
  | 'deadline_extended'
  | 'deadline_expired'

// ────────────────────────────────────────────────────────────────────────────
// Verification & Trust
// ────────────────────────────────────────────────────────────────────────────

/**
 * Document types accepted for identity and property verification.
 * Alaska-specific documents (e.g. PFD statements) are included because
 * they can help establish residency and identity on the Kenai Peninsula.
 */
export type VerificationDocumentType =
  // Identity
  | 'government_id'
  | 'drivers_license'
  | 'passport'
  | 'military_id'
  // Residency / Alaska-specific
  | 'utility_bill'
  | 'pfd_statement'          // Alaska Permanent Fund Dividend
  | 'ak_residency_cert'
  // Property
  | 'title_report'
  | 'deed'
  | 'survey'
  | 'appraisal'
  | 'tax_assessment'
  | 'environmental_report'
  | 'disclosure_statement'
  | 'hoa_documents'
  | 'easement_agreement'
  | 'lien_release'
  // Vehicle (auto site)
  | 'vehicle_title'
  | 'vehicle_registration'
  | 'vin_check'
  | 'smog_certificate'
  // Transaction
  | 'purchase_agreement'
  | 'earnest_money_receipt'
  | 'inspection_report'
  | 'financing_preapproval'
  | 'closing_statement'
  | 'insurance_binder'
  // Other
  | 'other'

/**
 * Trust levels earned through platform activity and verification.
 *
 * | Level    | Requirements                                         |
 * |----------|------------------------------------------------------|
 * | new      | Just created an account                              |
 * | basic    | Email verified                                       |
 * | verified | Government ID + phone verified                       |
 * | trusted  | ≥ 3 completed transactions, ≥ 4.0 avg rating        |
 * | premium  | ≥ 10 transactions, all docs verified, admin-approved |
 */
export type TrustLevel = 'new' | 'basic' | 'verified' | 'trusted' | 'premium'

/**
 * Verification status for individual documents or profile fields.
 */
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

// ────────────────────────────────────────────────────────────────────────────
// Fee Structures
// ────────────────────────────────────────────────────────────────────────────

/** How platform fees are calculated for a given listing or transaction. */
export type FeeStructure = 'flat' | 'percentage' | 'tiered'

/** Accepted payment rails. */
export type PaymentMethod = 'stripe' | 'crypto_usdc' | 'wire' | 'cashiers_check'

// ────────────────────────────────────────────────────────────────────────────
// Core Interfaces
// ────────────────────────────────────────────────────────────────────────────

/**
 * A single escrow transaction.
 *
 * Every sale on any Kenai Network site ultimately creates one of these.
 * The `origin_site` field tracks which marketplace initiated the deal,
 * while the underlying `kenai_profiles` IDs ensure cross-site identity.
 */
export interface EscrowTransaction {
  /** UUID primary key */
  id: string
  /** Which network site originated this transaction */
  origin_site: KenaiSiteKey
  /** Category of the item being sold */
  listing_type: ListingType
  /** Foreign key to the listing/parcel/property/vehicle on the origin site */
  listing_id: string
  /** Human-readable listing title (denormalized for quick display) */
  listing_title: string
  /** Listing address or location description */
  listing_address: string

  // ── Parties ──────────────────────────────────────────────────────────
  /** Seller's `kenai_profiles.id` */
  seller_id: string
  /** Buyer's `kenai_profiles.id` */
  buyer_id: string
  /** Seller display name (denormalized) */
  seller_name: string
  /** Buyer display name (denormalized) */
  buyer_name: string

  // ── Financials ───────────────────────────────────────────────────────
  /** Original listing / asking price in USD */
  asking_price: number
  /** Accepted offer amount in USD */
  offer_amount: number
  /** Earnest money deposit amount in USD */
  earnest_deposit: number
  /** Platform fee percentage as a decimal (e.g. 0.03 = 3 %) */
  platform_fee_pct: number
  /** Platform fee charged on this transaction in USD */
  platform_fee: number
  /** Amount the seller will receive after platform fee */
  seller_amount: number
  /** How the fee was calculated */
  fee_structure: FeeStructure
  /** Payment rail used */
  payment_method: PaymentMethod

  // ── Stripe integration ───────────────────────────────────────────────
  /** Stripe escrow identifier */
  stripe_escrow_id: string | null
  /** Stripe-side escrow status */
  stripe_escrow_status: 'pending' | 'funded' | 'released' | 'refunded' | null
  /** Stripe PaymentIntent ID for the escrow funding */
  stripe_payment_intent_id?: string
  /** Stripe Transfer ID for the seller payout */
  stripe_transfer_id?: string
  /** Stripe Connect account ID for the seller */
  stripe_connect_account_id?: string

  // ── Crypto integration ───────────────────────────────────────────────
  /** USDC wallet address for escrow hold */
  crypto_wallet_address?: string
  /** On-chain transaction hash */
  crypto_transaction_hash?: string
  /** Crypto amount (may differ from USD due to timing) */
  crypto_amount?: number

  // ── Status & lifecycle ───────────────────────────────────────────────
  /** Current transaction status */
  status: EscrowStatus
  /** When escrow was opened / funds received */
  escrow_funded_at?: string
  /** Scheduled or actual release date */
  escrow_release_at?: string
  /** When funds were actually released to seller */
  released_at?: string
  /** When the transaction reached a terminal state */
  closed_at?: string

  // ── Inspection & conditions ──────────────────────────────────────────
  /** Inspection period end date (ISO 8601) */
  inspection_deadline: string | null
  /** Whether the buyer has waived inspection */
  inspection_waived: boolean
  /** Conditions review deadline (ISO 8601) */
  conditions_deadline: string | null
  /** Contingencies that must be met before release */
  contingencies: string[]
  /** Number of contingencies that have been satisfied */
  contingencies_met: number

  // ── Closing details ──────────────────────────────────────────────────
  /** Title/escrow company handling the close (for real property) */
  title_company?: string
  /** Escrow company name */
  escrow_company?: string
  /** Scheduled closing date */
  closing_date: string | null
  /** Financing type (cash, conventional, FHA, VA, owner-financed) */
  financing_type?: string

  // ── Dispute ──────────────────────────────────────────────────────────
  /** Reason for dispute, if status is 'disputed' */
  dispute_reason?: string
  /** Admin-assigned dispute resolution notes */
  dispute_resolution?: string
  /** Admin ID who resolved the dispute */
  dispute_resolved_by?: string

  // ── Metadata ─────────────────────────────────────────────────────────
  /** Arbitrary metadata (site-specific fields, notes, etc.) */
  metadata?: Record<string, unknown>

  // ── Timestamps ───────────────────────────────────────────────────────
  created_at: string
  updated_at: string
}

/**
 * Immutable event log entry for an escrow transaction.
 * Every state change, document upload, message, and admin action
 * is recorded as an EscrowEvent for full auditability.
 */
export interface EscrowEvent {
  /** UUID primary key */
  id: string
  /** Foreign key to the parent transaction */
  transaction_id: string
  /** The type of event that occurred */
  event_type: EscrowEventType
  /** Which user triggered this event (null for system events) */
  actor_id: string
  /** Display name of the actor */
  actor_name: string
  /** Role of the actor at the time of the event */
  actor_role: 'buyer' | 'seller' | 'admin' | 'system'
  /** Human-readable summary of what happened */
  description: string
  /** Structured payload with event-specific data */
  metadata?: Record<string, unknown>
  /** IP address of the actor (for audit) */
  ip_address?: string
  /** User agent string (for audit) */
  user_agent?: string
  /** ISO 8601 timestamp — immutable once written */
  created_at: string
}

/**
 * A document uploaded for verification or transaction purposes.
 * Documents may be attached to a user profile (identity verification)
 * or to a specific transaction (inspection reports, contracts, etc.).
 */
export interface VerificationDocument {
  /** UUID primary key */
  id: string
  /** Foreign key to the transaction (null for profile-level docs) */
  transaction_id?: string
  /** Foreign key to the user who uploaded the document */
  uploaded_by: string
  /** Category of document */
  document_type: VerificationDocumentType
  /** Display title */
  title: string
  /** Secure URL to the stored file (Supabase Storage) */
  file_url: string
  /** File size in bytes */
  file_size?: number
  /** MIME type (e.g. application/pdf, image/jpeg) */
  mime_type?: string
  /** Current verification status */
  verification_status: VerificationStatus
  /** ID of the admin who reviewed this document */
  reviewed_by?: string
  /** Admin review notes */
  review_notes?: string
  /** When the document was reviewed */
  reviewed_at?: string
  /** Whether this document requires a signature */
  requires_signature: boolean
  /** Whether the document has been signed */
  signed: boolean
  /** Signature data (e.g. base64 image, typed name, coordinates) */
  signature_data?: Record<string, unknown>
  /** When the document was signed */
  signed_at?: string
  /** ID of the signer */
  signed_by?: string
  /** Expiration date for time-limited documents (e.g. appraisals) */
  expires_at?: string
  created_at: string
}

/**
 * In-transaction message between buyer, seller, and/or admin.
 * All messages are scoped to a transaction for context and privacy.
 */
export interface TransactionMessage {
  /** UUID primary key */
  id: string
  /** Foreign key to the parent transaction */
  transaction_id: string
  /** Who sent this message */
  sender_id: string
  /** Role of the sender at send time */
  sender_role: 'buyer' | 'seller' | 'admin' | 'system'
  /** Message body (plain text; may contain markdown) */
  content: string
  /** Optional file attachments */
  attachments?: TransactionMessageAttachment[]
  /** Whether the message has been read by the recipient(s) */
  read: boolean
  /** When the message was first read */
  read_at?: string
  /** Whether this is a system-generated notification */
  is_system_message: boolean
  created_at: string
}

/** File attached to a transaction message. */
export interface TransactionMessageAttachment {
  /** File name */
  name: string
  /** Secure URL */
  url: string
  /** File size in bytes */
  size: number
  /** MIME type */
  mime_type: string
}

/**
 * Composite trust score for a user on the Kenai Network.
 * Trust is earned through verified identity, successful transactions,
 * positive reviews, and consistent platform activity.
 */
export interface TrustScore {
  /** The user's `kenai_profiles.id` */
  user_id: string
  /** Current computed trust level */
  level: TrustLevel
  /** Numeric score from 0–100 */
  score: number

  // ── Score components ─────────────────────────────────────────────────
  /** Whether email has been verified */
  email_verified: boolean
  /** Whether phone has been verified */
  phone_verified: boolean
  /** Whether government ID has been verified */
  id_verified: boolean
  /** Total number of completed transactions across the network */
  completed_transactions: number
  /** Average rating from counterparties (1.0–5.0) */
  average_rating: number
  /** Total number of reviews received */
  total_reviews: number
  /** How quickly the user responds to messages (seconds, averaged) */
  response_time_avg: number
  /** Percentage of messages responded to within 24 hours */
  response_rate: number
  /** Number of disputes where this user was found at fault */
  disputes_lost: number
  /** Number of successful disputes (resolved in user's favor) */
  disputes_won: number
  /** Account age in days */
  account_age_days: number
  /** Which network sites this user has been active on */
  active_sites: KenaiSiteKey[]

  /** When this score was last recalculated */
  calculated_at: string
}

/**
 * Post-transaction review left by one party about the other.
 * Reviews are only allowed after a transaction reaches 'completed' status.
 */
export interface TransactionReview {
  /** UUID primary key */
  id: string
  /** Foreign key to the completed transaction */
  transaction_id: string
  /** ID of the user leaving the review */
  reviewer_id: string
  /** ID of the user being reviewed */
  reviewee_id: string
  /** Star rating: 1–5 */
  rating: number
  /** Free-text comment */
  comment?: string
  /** Specific aspect ratings */
  aspects?: TransactionReviewAspects
  /** Whether the reviewer would transact with this person again */
  would_recommend: boolean
  /** Which site the transaction occurred on */
  origin_site: KenaiSiteKey
  /** Admin-hidden flag (for moderation) */
  hidden: boolean
  /** Reason the review was hidden, if applicable */
  hidden_reason?: string
  created_at: string
  updated_at: string
}

/** Granular aspect ratings within a transaction review. */
export interface TransactionReviewAspects {
  /** Communication quality (1–5) */
  communication?: number
  /** Accuracy of listing description (1–5) */
  accuracy?: number
  /** Timeliness / met deadlines (1–5) */
  timeliness?: number
  /** Overall professionalism (1–5) */
  professionalism?: number
}

/**
 * Network-wide administrative configuration for the escrow system.
 * These values are managed via the kenai-borough-network-admin dashboard.
 */
export interface AdminConfig {
  /** UUID primary key */
  id: string

  // ── Fee defaults ─────────────────────────────────────────────────────
  /** Default platform fee percentage (e.g. 0.03 = 3 %) */
  default_fee_percentage: number
  /** Flat listing fee in USD (charged when a listing goes active) */
  listing_fee: number
  /** Minimum platform fee in USD (floor for percentage-based fees) */
  min_platform_fee: number
  /** Maximum platform fee in USD (cap for high-value transactions) */
  max_platform_fee: number

  // ── Tiered fee schedule ──────────────────────────────────────────────
  /** Tiered fee breakpoints: array sorted ascending by `up_to` */
  fee_tiers: FeeTier[]

  // ── Escrow timing ────────────────────────────────────────────────────
  /** Default inspection period in calendar days */
  default_inspection_days: number
  /** Hours to hold funds in escrow after conditions are met */
  escrow_hold_hours: number
  /** Days before an unfunded offer auto-expires */
  offer_expiry_days: number

  // ── Trust thresholds ─────────────────────────────────────────────────
  /** Minimum trust score to list without manual review */
  auto_approve_trust_threshold: number
  /** Minimum completed transactions for 'trusted' level */
  trusted_min_transactions: number
  /** Minimum average rating for 'trusted' level */
  trusted_min_rating: number
  /** Minimum completed transactions for 'premium' level */
  premium_min_transactions: number

  // ── Operational ──────────────────────────────────────────────────────
  /** Stripe Connect platform account ID */
  stripe_platform_account_id?: string
  /** Whether crypto payments are currently enabled */
  crypto_enabled: boolean
  /** Whether new transactions are paused (maintenance mode) */
  transactions_paused: boolean
  /** Admin notification email addresses */
  admin_emails: string[]

  updated_at: string
  updated_by: string
}

/** A single tier in the tiered fee schedule. */
export interface FeeTier {
  /** Maximum sale price for this tier (USD). `Infinity` for the top tier. */
  up_to: number
  /** Fee percentage for sales within this tier (e.g. 0.03 = 3 %) */
  rate: number
  /** Optional flat minimum for this tier */
  min_fee?: number
}

// ────────────────────────────────────────────────────────────────────────────
// Escrow Flow Definition
// ────────────────────────────────────────────────────────────────────────────

/** A single step in the visual escrow flow / progress tracker. */
export interface EscrowFlowStep {
  /** The escrow status this step represents */
  status: EscrowStatus
  /** Short human-readable label */
  label: string
  /** Longer description shown in tooltips or detail views */
  description: string
  /** Lucide icon name (https://lucide.dev) */
  icon: string
  /** Which party is responsible for advancing past this step */
  requiredBy?: 'buyer' | 'seller' | 'admin' | 'system'
  /** ISO 8601 duration hint (e.g. "P3D" = 3 days) */
  deadline?: string
}

/**
 * The canonical happy-path escrow flow.
 *
 * Branch paths (cancelled, disputed, refunded) can occur at any active
 * step and are handled separately in the UI via `isTerminalStatus()`.
 */
export const ESCROW_FLOW_STEPS: EscrowFlowStep[] = [
  {
    status: 'draft',
    label: 'Draft',
    description: 'Transaction created. Buyer is preparing their offer.',
    icon: 'file-edit',
    requiredBy: 'buyer',
  },
  {
    status: 'offer_pending',
    label: 'Offer Submitted',
    description: 'Offer sent to the seller for review. Awaiting acceptance, counter, or rejection.',
    icon: 'send',
    requiredBy: 'seller',
    deadline: 'P3D',
  },
  {
    status: 'offer_accepted',
    label: 'Offer Accepted',
    description: 'Both parties have agreed on terms. Buyer must fund escrow to proceed.',
    icon: 'handshake',
    requiredBy: 'buyer',
    deadline: 'P5D',
  },
  {
    status: 'escrow_funded',
    label: 'Escrow Funded',
    description: 'Buyer\'s funds are held securely in escrow. Inspection period may begin.',
    icon: 'lock-keyhole',
    requiredBy: 'system',
  },
  {
    status: 'inspection_period',
    label: 'Inspection',
    description: 'Buyer may conduct inspections, appraisals, and due diligence on the property.',
    icon: 'search-check',
    requiredBy: 'buyer',
    deadline: 'P10D',
  },
  {
    status: 'conditions_review',
    label: 'Conditions Review',
    description: 'All contingencies are being reviewed and cleared by both parties.',
    icon: 'clipboard-check',
    requiredBy: 'admin',
    deadline: 'P5D',
  },
  {
    status: 'pending_release',
    label: 'Pending Release',
    description: 'All conditions met. Funds will be released after the hold period.',
    icon: 'timer',
    requiredBy: 'system',
    deadline: 'P2D',
  },
  {
    status: 'completed',
    label: 'Completed',
    description: 'Transaction complete. Funds released to seller. Congratulations!',
    icon: 'circle-check-big',
  },
]

/**
 * Branch-path steps shown when a transaction leaves the happy path.
 */
export const ESCROW_BRANCH_STEPS: EscrowFlowStep[] = [
  {
    status: 'cancelled',
    label: 'Cancelled',
    description: 'Transaction was cancelled before escrow funding or by mutual agreement.',
    icon: 'circle-x',
  },
  {
    status: 'disputed',
    label: 'Disputed',
    description: 'A dispute has been filed. An admin will review evidence from both parties.',
    icon: 'shield-alert',
    requiredBy: 'admin',
  },
  {
    status: 'refunded',
    label: 'Refunded',
    description: 'Escrow funds have been returned to the buyer.',
    icon: 'undo-2',
    requiredBy: 'system',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// Fee Calculation
// ────────────────────────────────────────────────────────────────────────────

/** Breakdown of all fees and amounts for a transaction. */
export interface FeeCalculation {
  /** One-time listing fee in USD */
  listingFee: number
  /** Escrow fee rate applied (decimal, e.g. 0.03) */
  escrowFeeRate: number
  /** Escrow fee amount in USD */
  escrowFeeAmount: number
  /** Total the buyer pays (sale price + buyer-side fees, if any) */
  totalBuyerPays: number
  /** Net amount the seller receives after platform fees */
  sellerReceives: number
  /** Total platform revenue from this transaction */
  platformRevenue: number
  /**
   * Estimated savings compared to a traditional 5.5 % real-estate
   * agent commission. Positive number = money saved.
   */
  savingsVsTraditional: number
}

/** Default fee configuration constants. */
const DEFAULT_LISTING_FEE = 149
const DEFAULT_FEE_RATE = 0.03
const TRADITIONAL_COMMISSION_RATE = 0.055

/** Default tiered fee schedule used for high-value transactions. */
const DEFAULT_FEE_TIERS: FeeTier[] = [
  { up_to: 50_000, rate: 0.04, min_fee: 500 },
  { up_to: 250_000, rate: 0.03 },
  { up_to: 1_000_000, rate: 0.025 },
  { up_to: Infinity, rate: 0.02 },
]

/**
 * Calculate the full fee breakdown for a sale.
 *
 * @param salePrice - The agreed-upon sale price in USD
 * @param feeStructure - How the platform fee should be calculated
 * @param listingFee - Override for the flat listing fee (defaults to $149)
 * @returns Complete fee breakdown including savings vs. traditional commissions
 *
 * @example
 * ```ts
 * const fees = calculateFees(325_000, 'percentage')
 * // fees.escrowFeeAmount  → 9750
 * // fees.sellerReceives   → 315101  (325000 - 9750 - 149)
 * // fees.savingsVsTraditional → 7975
 * ```
 */
export function calculateFees(
  salePrice: number,
  feeStructure: FeeStructure,
  listingFee: number = DEFAULT_LISTING_FEE,
): FeeCalculation {
  let escrowFeeRate: number
  let escrowFeeAmount: number

  switch (feeStructure) {
    case 'flat':
      escrowFeeRate = 0
      escrowFeeAmount = listingFee
      break

    case 'percentage':
      escrowFeeRate = DEFAULT_FEE_RATE
      escrowFeeAmount = Math.round(salePrice * escrowFeeRate * 100) / 100
      break

    case 'tiered': {
      const tier = DEFAULT_FEE_TIERS.find((t) => salePrice <= t.up_to)
        ?? DEFAULT_FEE_TIERS[DEFAULT_FEE_TIERS.length - 1]
      escrowFeeRate = tier.rate
      escrowFeeAmount = Math.round(salePrice * escrowFeeRate * 100) / 100
      if (tier.min_fee && escrowFeeAmount < tier.min_fee) {
        escrowFeeAmount = tier.min_fee
      }
      break
    }

    default: {
      const _exhaustive: never = feeStructure
      throw new Error(`Unknown fee structure: ${_exhaustive}`)
    }
  }

  const platformRevenue = escrowFeeAmount + listingFee
  const sellerReceives = salePrice - escrowFeeAmount - listingFee
  const totalBuyerPays = salePrice
  const traditionalCommission = salePrice * TRADITIONAL_COMMISSION_RATE
  const savingsVsTraditional = Math.round(
    (traditionalCommission - platformRevenue) * 100,
  ) / 100

  return {
    listingFee,
    escrowFeeRate,
    escrowFeeAmount,
    totalBuyerPays,
    sellerReceives,
    platformRevenue,
    savingsVsTraditional,
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Status Display Helpers
// ────────────────────────────────────────────────────────────────────────────

/** Tailwind-compatible color class for each escrow status. */
const STATUS_COLORS: Record<EscrowStatus, string> = {
  draft: 'text-gray-400',
  offer_pending: 'text-amber-500',
  offer_accepted: 'text-blue-500',
  escrow_funded: 'text-indigo-500',
  inspection_period: 'text-cyan-500',
  conditions_review: 'text-violet-500',
  pending_release: 'text-yellow-500',
  completed: 'text-emerald-500',
  cancelled: 'text-gray-500',
  disputed: 'text-red-500',
  refunded: 'text-orange-500',
}

/** Human-readable labels for each escrow status. */
const STATUS_LABELS: Record<EscrowStatus, string> = {
  draft: 'Draft',
  offer_pending: 'Offer Pending',
  offer_accepted: 'Offer Accepted',
  escrow_funded: 'Escrow Funded',
  inspection_period: 'Inspection Period',
  conditions_review: 'Conditions Review',
  pending_release: 'Pending Release',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
  refunded: 'Refunded',
}

/** Lucide icon name for each escrow status. */
const STATUS_ICONS: Record<EscrowStatus, string> = {
  draft: 'file-edit',
  offer_pending: 'send',
  offer_accepted: 'handshake',
  escrow_funded: 'lock-keyhole',
  inspection_period: 'search-check',
  conditions_review: 'clipboard-check',
  pending_release: 'timer',
  completed: 'circle-check-big',
  cancelled: 'circle-x',
  disputed: 'shield-alert',
  refunded: 'undo-2',
}

/** Terminal statuses that cannot transition to any other state. */
const TERMINAL_STATUSES: Set<EscrowStatus> = new Set([
  'completed',
  'cancelled',
  'refunded',
])

/**
 * Valid state transitions. Each key maps to the set of statuses it
 * can transition to. Used to enforce workflow integrity.
 */
const VALID_TRANSITIONS: Record<EscrowStatus, EscrowStatus[]> = {
  draft: ['offer_pending', 'cancelled'],
  offer_pending: ['offer_accepted', 'cancelled'],
  offer_accepted: ['escrow_funded', 'cancelled'],
  escrow_funded: ['inspection_period', 'conditions_review', 'disputed', 'cancelled'],
  inspection_period: ['conditions_review', 'disputed', 'cancelled'],
  conditions_review: ['pending_release', 'disputed', 'cancelled'],
  pending_release: ['completed', 'disputed'],
  completed: [],
  cancelled: [],
  disputed: ['pending_release', 'refunded', 'cancelled'],
  refunded: [],
}

/**
 * Get the Tailwind color class for an escrow status.
 * @param status - The escrow status
 * @returns A Tailwind CSS class string (e.g. `"text-emerald-500"`)
 */
export function getStatusColor(status: EscrowStatus): string {
  return STATUS_COLORS[status] ?? 'text-gray-400'
}

/**
 * Get a human-readable label for an escrow status.
 * @param status - The escrow status
 * @returns Display label (e.g. `"Offer Pending"`)
 */
export function getStatusLabel(status: EscrowStatus): string {
  return STATUS_LABELS[status] ?? status
}

/**
 * Get the Lucide icon name for an escrow status.
 * @param status - The escrow status
 * @returns Lucide icon name (e.g. `"circle-check-big"`)
 */
export function getStatusIcon(status: EscrowStatus): string {
  return STATUS_ICONS[status] ?? 'circle-help'
}

/**
 * Check whether a status is terminal (no further transitions possible).
 * @param status - The escrow status to check
 * @returns `true` if the status is completed, cancelled, or refunded
 */
export function isTerminalStatus(status: EscrowStatus): boolean {
  return TERMINAL_STATUSES.has(status)
}

/**
 * Check whether a transition from one status to another is valid.
 * @param from - Current escrow status
 * @param to - Desired next escrow status
 * @returns `true` if the transition is allowed by the workflow
 */
export function canTransitionTo(from: EscrowStatus, to: EscrowStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}

// ────────────────────────────────────────────────────────────────────────────
// Trust Level Helpers
// ────────────────────────────────────────────────────────────────────────────

/** Tailwind-compatible color classes for trust levels. */
const TRUST_LEVEL_COLORS: Record<TrustLevel, string> = {
  new: 'text-gray-400',
  basic: 'text-blue-400',
  verified: 'text-green-500',
  trusted: 'text-amber-500',
  premium: 'text-purple-500',
}

/** Human-readable labels for trust levels. */
const TRUST_LEVEL_LABELS: Record<TrustLevel, string> = {
  new: 'New Member',
  basic: 'Basic',
  verified: 'Verified',
  trusted: 'Trusted',
  premium: 'Premium',
}

/**
 * Get the Tailwind color class for a trust level.
 * @param level - The trust level
 * @returns A Tailwind CSS class string
 */
export function getTrustLevelColor(level: TrustLevel): string {
  return TRUST_LEVEL_COLORS[level] ?? 'text-gray-400'
}

/**
 * Get a human-readable label for a trust level.
 * @param level - The trust level
 * @returns Display label (e.g. `"Verified"`)
 */
export function getTrustLevelLabel(level: TrustLevel): string {
  return TRUST_LEVEL_LABELS[level] ?? level
}

/**
 * Derive displayable badge strings from a user's trust score.
 * Badges are used in seller profiles, listing cards, and the
 * transaction detail view to build buyer confidence.
 *
 * @param score - The user's computed trust score
 * @returns Array of badge label strings, e.g. `["✓ Verified ID", "⭐ 4.8 Rating"]`
 */
export function getTrustBadges(score: TrustScore): string[] {
  const badges: string[] = []

  if (score.id_verified) badges.push('✓ Verified ID')
  if (score.phone_verified) badges.push('✓ Phone Verified')
  if (score.email_verified) badges.push('✓ Email Verified')

  if (score.completed_transactions > 0) {
    badges.push(`${score.completed_transactions} Transaction${score.completed_transactions !== 1 ? 's' : ''} Completed`)
  }
  if (score.average_rating >= 4.0) {
    badges.push(`⭐ ${score.average_rating.toFixed(1)} Rating`)
  }
  if (score.response_rate >= 0.9) {
    badges.push('⚡ Fast Responder')
  }
  if (score.account_age_days >= 365) {
    const years = Math.floor(score.account_age_days / 365)
    badges.push(`${years}+ Year${years !== 1 ? 's' : ''} on Kenai Network`)
  }
  if (score.active_sites.length >= 3) {
    badges.push('🌐 Multi-Site Member')
  }
  if (score.disputes_lost === 0 && score.completed_transactions >= 5) {
    badges.push('🛡️ Zero Disputes')
  }
  if (score.level === 'premium') {
    badges.push('💎 Premium Member')
  }

  return badges
}
