/**
 * Kenai Borough Network — Escrow Transaction Page
 *
 * Unified escrow flow page used across all transaction sites.
 * Shows the full lifecycle: offer → fund → inspect → close.
 *
 * This is a wrapper that loads the shared EscrowFlow component
 * with site-specific data from Supabase.
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import EscrowFlow from '../components/escrow/EscrowFlow';
import { EscrowGuarantee } from '../components/trust/EscrowGuarantee';
import { TransactionAdvisor } from '../components/advisor/TransactionAdvisor';
import type { EscrowTransaction, EscrowEvent } from '../types/escrow';

// Demo data for when Supabase is not configured
const DEMO_TRANSACTION: EscrowTransaction = {
  id: 'demo-tx-001',
  site_key: 'realty',
  listing_id: 'demo-listing-001',
  listing_type: 'property',
  seller_id: 'demo-seller',
  buyer_id: 'demo-buyer',
  status: 'inspection_period',
  offer_amount: 385000,
  earnest_deposit: 10000,
  platform_fee: 3850,
  seller_payout: 381150,
  fee_structure: 'percentage',
  fee_rate: 0.01,
  stripe_payment_intent_id: 'pi_demo_123',
  stripe_transfer_id: null,
  stripe_connect_account_id: 'acct_demo_seller',
  inspection_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  conditions_deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dispute_reason: null,
  dispute_resolution: null,
  notes: null,
  metadata: {},
  created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_EVENTS: EscrowEvent[] = [
  {
    id: 'evt-1',
    transaction_id: 'demo-tx-001',
    event_type: 'created',
    actor_id: 'demo-buyer',
    actor_role: 'buyer',
    amount: null,
    description: 'Transaction created — buyer initiated offer',
    metadata: {},
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-2',
    transaction_id: 'demo-tx-001',
    event_type: 'offer_made',
    actor_id: 'demo-buyer',
    actor_role: 'buyer',
    amount: 385000,
    description: 'Offer submitted: $385,000',
    metadata: {},
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-3',
    transaction_id: 'demo-tx-001',
    event_type: 'offer_accepted',
    actor_id: 'demo-seller',
    actor_role: 'seller',
    amount: null,
    description: 'Seller accepted the offer',
    metadata: {},
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-4',
    transaction_id: 'demo-tx-001',
    event_type: 'escrow_funded',
    actor_id: 'demo-buyer',
    actor_role: 'buyer',
    amount: 10000,
    description: 'Earnest deposit of $10,000 funded via Stripe',
    metadata: { stripe_pi: 'pi_demo_123' },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-5',
    transaction_id: 'demo-tx-001',
    event_type: 'inspection_started',
    actor_id: 'system',
    actor_role: 'system',
    amount: null,
    description: 'Inspection period started — 10 days to complete',
    metadata: {},
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function EscrowTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<EscrowTransaction>(DEMO_TRANSACTION);
  const [events, setEvents] = useState<EscrowEvent[]>(DEMO_EVENTS);
  const [loading, setLoading] = useState(false);
  const [showAdvisor, setShowAdvisor] = useState(false);

  // In production, this would fetch from Supabase
  useEffect(() => {
    if (id && id !== 'demo') {
      // TODO: Fetch from Supabase when configured
      // const { data } = await supabase.from('kenai_escrow_transactions').select('*').eq('id', id).single()
    }
  }, [id]);

  const handleAction = async (action: string, data?: any) => {
    console.log('Escrow action:', action, data);
    // TODO: Wire to Supabase RPC calls
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back navigation */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Escrow guarantee banner */}
        <div className="mb-8">
          <EscrowGuarantee salePrice={transaction.offer_amount} compact />
        </div>

        {/* Main escrow flow */}
        <EscrowFlow
          transaction={transaction}
          events={events}
          userRole="buyer"
          onAction={handleAction}
        />

        {/* AI Advisor toggle */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowAdvisor(!showAdvisor)}
            className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Shield className="h-6 w-6 text-white" />
          </button>
        </div>

        {showAdvisor && (
          <div className="fixed bottom-24 right-6 z-50 w-96">
            <TransactionAdvisor
              context={{ type: 'property', data: transaction }}
              transactionId={transaction.id}
              userRole="buyer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
