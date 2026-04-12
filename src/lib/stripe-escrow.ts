/**
 * Kenai Borough Network — Stripe Escrow Service
 *
 * Handles the full escrow lifecycle via Stripe Connect:
 * 1. Seller onboards to Stripe Connect (one-time)
 * 2. Buyer makes payment → funds held in platform escrow
 * 3. Inspection/conditions period runs
 * 4. On approval, funds transfer to seller minus platform fee
 * 5. On dispute, funds held until resolution
 *
 * Fee structure: flat $10-50 listing fee + 1% escrow fee on closed transactions.
 * Traditional agents take 5-6%. We save sellers thousands.
 */

import { loadStripe, type Stripe } from '@stripe/stripe-js';

// ── Configuration ──────────────────────────────────────────────────────────

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

/** Platform fee tiers — intentionally transparent */
export const FEE_SCHEDULE = {
  listing: {
    basic: 10,       // Basic listing (classifieds, general)
    standard: 25,    // Vehicles, rentals
    premium: 50,     // Real estate, land
  },
  escrow: {
    rate: 0.01,      // 1% of sale price
    minimum: 25,     // Minimum escrow fee
    maximum: 5000,   // Cap at $5,000 — we're not greedy
  },
  traditional: {
    agentRate: 0.055, // 5.5% average agent commission (for savings comparison)
    titleFee: 1500,   // Average title company fee
    closingCosts: 0.02, // ~2% typical closing costs
  },
} as const;

// ── Stripe Instance ────────────────────────────────────────────────────────

let stripeInstance: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripeInstance && STRIPE_PUBLIC_KEY) {
    stripeInstance = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripeInstance || Promise.resolve(null);
}

export function isStripeConfigured(): boolean {
  return Boolean(STRIPE_PUBLIC_KEY);
}

// ── Fee Calculations ───────────────────────────────────────────────────────

export interface FeeBreakdown {
  salePrice: number;
  listingFee: number;
  escrowFeeRate: number;
  escrowFeeAmount: number;
  totalBuyerPays: number;
  sellerReceives: number;
  platformRevenue: number;
  /** How much the seller saves vs traditional 5.5% agent commission */
  savingsVsTraditional: number;
  /** Traditional total cost for comparison */
  traditionalCost: number;
}

/**
 * Calculate the full fee breakdown for a transaction.
 * Our model: flat listing fee + 1% escrow (capped at $5,000).
 * Traditional model: 5.5% agent commission + title fees + closing costs.
 */
export function calculateFees(
  salePrice: number,
  listingTier: keyof typeof FEE_SCHEDULE.listing = 'premium'
): FeeBreakdown {
  const listingFee = FEE_SCHEDULE.listing[listingTier];
  const escrowFeeRate = FEE_SCHEDULE.escrow.rate;
  const rawEscrowFee = salePrice * escrowFeeRate;
  const escrowFeeAmount = Math.min(
    Math.max(rawEscrowFee, FEE_SCHEDULE.escrow.minimum),
    FEE_SCHEDULE.escrow.maximum
  );

  const platformRevenue = listingFee + escrowFeeAmount;
  const sellerReceives = salePrice - escrowFeeAmount;
  const totalBuyerPays = salePrice; // Buyer pays sale price; escrow fee comes from seller side

  // Traditional comparison
  const traditionalAgentFee = salePrice * FEE_SCHEDULE.traditional.agentRate;
  const traditionalCost = traditionalAgentFee + FEE_SCHEDULE.traditional.titleFee;
  const savingsVsTraditional = traditionalCost - platformRevenue;

  return {
    salePrice,
    listingFee,
    escrowFeeRate,
    escrowFeeAmount: Math.round(escrowFeeAmount * 100) / 100,
    totalBuyerPays,
    sellerReceives: Math.round(sellerReceives * 100) / 100,
    platformRevenue: Math.round(platformRevenue * 100) / 100,
    savingsVsTraditional: Math.round(savingsVsTraditional * 100) / 100,
    traditionalCost: Math.round(traditionalCost * 100) / 100,
  };
}

// ── Escrow API Service ─────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface CreateEscrowRequest {
  siteKey: string;
  listingId: string;
  listingType: string;
  sellerId: string;
  buyerId: string;
  offerAmount: number;
  earnestDeposit?: number;
  inspectionDays?: number;
  conditionsDays?: number;
  closingDate?: string;
  notes?: string;
}

export interface EscrowResponse {
  transactionId: string;
  status: string;
  clientSecret?: string; // Stripe PaymentIntent client secret
  error?: string;
}

/**
 * Create a new escrow transaction.
 * Returns a Stripe PaymentIntent client secret for the buyer to fund.
 */
export async function createEscrow(
  request: CreateEscrowRequest,
  accessToken: string
): Promise<EscrowResponse> {
  const res = await fetch(`${API_BASE}/escrow/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    return { transactionId: '', status: 'error', error: err.error || 'Failed to create escrow' };
  }

  return res.json();
}

/**
 * Fund the escrow — buyer confirms Stripe payment.
 * After funding, the inspection period begins.
 */
export async function fundEscrow(
  transactionId: string,
  paymentIntentId: string,
  accessToken: string
): Promise<EscrowResponse> {
  const res = await fetch(`${API_BASE}/escrow/${transactionId}/fund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ paymentIntentId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    return { transactionId, status: 'error', error: err.error || 'Failed to fund escrow' };
  }

  return res.json();
}

/**
 * Advance the escrow to the next state.
 * Valid transitions depend on current status and actor role.
 */
export async function advanceEscrow(
  transactionId: string,
  action: string,
  data: Record<string, unknown> = {},
  accessToken: string
): Promise<EscrowResponse> {
  const res = await fetch(`${API_BASE}/escrow/${transactionId}/advance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ action, ...data }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    return { transactionId, status: 'error', error: err.error || 'Failed to advance escrow' };
  }

  return res.json();
}

/**
 * Open a dispute on an active escrow.
 * Freezes fund release until admin resolution.
 */
export async function openDispute(
  transactionId: string,
  reason: string,
  evidence?: string[],
  accessToken?: string
): Promise<EscrowResponse> {
  const res = await fetch(`${API_BASE}/escrow/${transactionId}/dispute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ reason, evidence }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    return { transactionId, status: 'error', error: err.error || 'Failed to open dispute' };
  }

  return res.json();
}

/**
 * Request release of escrowed funds (seller action after conditions met).
 */
export async function requestRelease(
  transactionId: string,
  accessToken: string
): Promise<EscrowResponse> {
  return advanceEscrow(transactionId, 'request_release', {}, accessToken);
}

/**
 * Admin: approve fund release to seller.
 */
export async function approveRelease(
  transactionId: string,
  accessToken: string
): Promise<EscrowResponse> {
  return advanceEscrow(transactionId, 'approve_release', {}, accessToken);
}

/**
 * Admin: resolve a dispute.
 */
export async function resolveDispute(
  transactionId: string,
  resolution: 'refund_buyer' | 'release_seller' | 'split',
  notes: string,
  accessToken: string
): Promise<EscrowResponse> {
  return advanceEscrow(transactionId, 'resolve_dispute', { resolution, notes }, accessToken);
}

// ── Stripe Connect Seller Onboarding ───────────────────────────────────────

/**
 * Initiate Stripe Connect onboarding for a seller.
 * Returns a URL to redirect the seller to Stripe's onboarding flow.
 */
export async function createSellerOnboarding(
  sellerId: string,
  returnUrl: string,
  accessToken: string
): Promise<{ url: string; accountId: string } | { error: string }> {
  const res = await fetch(`${API_BASE}/stripe/connect/onboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ sellerId, returnUrl }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    return { error: err.error || 'Failed to create onboarding link' };
  }

  return res.json();
}

/**
 * Check if a seller has completed Stripe Connect onboarding.
 */
export async function checkSellerOnboarding(
  sellerId: string,
  accessToken: string
): Promise<{ onboarded: boolean; accountId?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/stripe/connect/status/${sellerId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return { onboarded: false, error: 'Failed to check status' };
  }

  return res.json();
}

// ── Currency Formatting ────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyPrecise(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
