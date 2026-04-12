/**
 * Kenai Borough Network — Escrow Hook
 *
 * React hook for managing escrow transaction state, events,
 * messages, and actions from any Kenai Network site.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { EscrowTransaction, EscrowEvent, TransactionMessage } from '../types/escrow';

// ── Supabase client (injected per-site) ────────────────────────────────────

let supabaseClient: any = null;

export function setEscrowSupabase(client: any) {
  supabaseClient = client;
}

// ── Types ──────────────────────────────────────────────────────────────────

interface UseEscrowOptions {
  transactionId: string;
  /** Real-time updates via Supabase Realtime */
  realtime?: boolean;
}

interface UseEscrowReturn {
  transaction: EscrowTransaction | null;
  events: EscrowEvent[];
  messages: TransactionMessage[];
  loading: boolean;
  error: string | null;
  /** Refresh all data */
  refresh: () => Promise<void>;
  /** Send a message in the transaction thread */
  sendMessage: (content: string, type?: string) => Promise<void>;
  /** Advance the escrow state */
  advanceState: (action: string, data?: Record<string, unknown>) => Promise<void>;
}

// ── Hook ───────────────────────────────────────────────────────────────────

/**
 * Hook for managing a single escrow transaction.
 * Provides real-time updates, message sending, and state management.
 */
export function useEscrow({ transactionId, realtime = true }: UseEscrowOptions): UseEscrowReturn {
  const [transaction, setTransaction] = useState<EscrowTransaction | null>(null);
  const [events, setEvents] = useState<EscrowEvent[]>([]);
  const [messages, setMessages] = useState<TransactionMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  const fetchTransaction = useCallback(async () => {
    if (!supabaseClient || !transactionId) return;

    try {
      const { data, error: err } = await supabaseClient
        .from('kenai_escrow_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (err) throw err;
      setTransaction(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load transaction');
    }
  }, [transactionId]);

  const fetchEvents = useCallback(async () => {
    if (!supabaseClient || !transactionId) return;

    try {
      const { data, error: err } = await supabaseClient
        .from('kenai_escrow_events')
        .select('*')
        .eq('transaction_id', transactionId)
        .order('created_at', { ascending: true });

      if (err) throw err;
      setEvents(data || []);
    } catch (e: any) {
      console.error('Failed to load events:', e);
    }
  }, [transactionId]);

  const fetchMessages = useCallback(async () => {
    if (!supabaseClient || !transactionId) return;

    try {
      const { data, error: err } = await supabaseClient
        .from('kenai_transaction_messages')
        .select('*')
        .eq('transaction_id', transactionId)
        .order('created_at', { ascending: true });

      if (err) throw err;
      setMessages(data || []);
    } catch (e: any) {
      console.error('Failed to load messages:', e);
    }
  }, [transactionId]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchTransaction(), fetchEvents(), fetchMessages()]);
    setLoading(false);
  }, [fetchTransaction, fetchEvents, fetchMessages]);

  const sendMessage = useCallback(async (content: string, type = 'text') => {
    if (!supabaseClient || !transactionId) return;

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error: err } = await supabaseClient
      .from('kenai_transaction_messages')
      .insert({
        transaction_id: transactionId,
        sender_id: user.id,
        message_type: type,
        content,
      });

    if (err) throw err;
    if (!realtime) await fetchMessages();
  }, [transactionId, realtime, fetchMessages]);

  const advanceState = useCallback(async (action: string, data?: Record<string, unknown>) => {
    if (!supabaseClient || !transactionId) return;

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Call the advance_escrow_state database function
    const { error: err } = await supabaseClient.rpc('advance_escrow_state', {
      p_transaction_id: transactionId,
      p_action: action,
      p_actor_id: user.id,
      p_metadata: data || {},
    });

    if (err) throw err;
    if (!realtime) await refresh();
  }, [transactionId, realtime, refresh]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [transactionId]);

  // Real-time subscription
  useEffect(() => {
    if (!realtime || !supabaseClient || !transactionId) return;

    const channel = supabaseClient
      .channel(`escrow:${transactionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kenai_escrow_transactions',
          filter: `id=eq.${transactionId}`,
        },
        (payload: any) => {
          if (payload.new) setTransaction(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'kenai_escrow_events',
          filter: `transaction_id=eq.${transactionId}`,
        },
        (payload: any) => {
          if (payload.new) setEvents((prev) => [...prev, payload.new]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'kenai_transaction_messages',
          filter: `transaction_id=eq.${transactionId}`,
        },
        (payload: any) => {
          if (payload.new) setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabaseClient.removeChannel(channelRef.current);
      }
    };
  }, [transactionId, realtime]);

  return {
    transaction,
    events,
    messages,
    loading,
    error,
    refresh,
    sendMessage,
    advanceState,
  };
}

// ── Transaction List Hook ──────────────────────────────────────────────────

interface UseTransactionsOptions {
  siteKey?: string;
  userId?: string;
  role?: 'buyer' | 'seller' | 'admin';
  status?: string[];
}

interface UseTransactionsReturn {
  transactions: EscrowTransaction[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for listing escrow transactions with filters.
 */
export function useTransactions(options: UseTransactionsOptions = {}): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabaseClient) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabaseClient
        .from('kenai_escrow_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (options.siteKey) {
        query = query.eq('site_key', options.siteKey);
      }

      if (options.userId && options.role === 'buyer') {
        query = query.eq('buyer_id', options.userId);
      } else if (options.userId && options.role === 'seller') {
        query = query.eq('seller_id', options.userId);
      }

      if (options.status?.length) {
        query = query.in('status', options.status);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setTransactions(data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [options.siteKey, options.userId, options.role, JSON.stringify(options.status)]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { transactions, loading, error, refresh };
}
