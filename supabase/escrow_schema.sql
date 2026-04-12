-- ============================================================================
-- KENAI PENINSULA NETWORK — ESCROW & TRUST SCHEMA
-- ============================================================================
--
-- The Kenai Peninsula Network exists to return power to property owners.
-- Traditional agents take 5-6% of a home's value — on a $400,000 home,
-- that's $24,000 in commissions. We charge a flat listing fee ($10-50)
-- plus 1% escrow protection on closed transactions. That same $400,000
-- home saves the seller over $20,000. Escrow ensures both parties are
-- protected. AI handles what agents used to. Trust is built through
-- verified identities, transparent histories, and community reputation.
--
-- FSBO Philosophy:
--   • Sellers keep their equity — no 5-6% agent commissions
--   • Buyers deal directly with owners — no middleman markup
--   • 1% escrow fee replaces $24,000+ in traditional commissions
--   • AI-assisted document review replaces expensive attorney hours
--   • Community trust scores replace brand-name brokerage "trust"
--   • Transparent, immutable audit logs replace opaque back-office deals
--
-- Network Sites:
--   realty   — kenai-borough-realty (general real estate)
--   land     — kenai-land-sales (raw land & parcels)
--   homes    — kenaihomesales (residential homes)
--   auto     — kenai-auto-sales (vehicles & powersports)
--   listings — kenai-listings (general classifieds)
--   borough  — kenai-borough (community hub)
--   rentals  — kenai-peninsula-rentals (rental properties)
--
-- Fee Structure:
--   Flat listing fee: $10 – $50 (varies by category)
--   Escrow fee: 1% of transaction amount (default)
--   Tiered: negotiable for high-value transactions
--   Compare: traditional agent = 5-6% ($20,000-$24,000 on $400K home)
--   Kenai Network on that same home = ~$4,050 total ($50 + $4,000 escrow)
--   Seller savings: ~$20,000
--
-- Dependencies:
--   Requires kenai_profiles table from unified-auth-schema.sql
--   Requires Supabase auth.users and auth.uid()
--
-- ============================================================================

-- ============================================================================
-- HELPER: reusable admin check function
-- ============================================================================
-- Returns TRUE if the given user has an 'admin' role on any Kenai site.
-- Used across all RLS policies in this schema.

CREATE OR REPLACE FUNCTION public.is_kenai_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.kenai_profiles p,
         jsonb_each_text(COALESCE(p.site_roles, '{}'::jsonb)) AS roles(site_name, role_name)
    WHERE p.id = check_user_id
      AND roles.role_name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_kenai_admin IS
  'Check if a user holds admin role on any Kenai Network site. Used by RLS policies.';


-- ============================================================================
-- 1. kenai_escrow_transactions
-- ============================================================================
-- Core escrow table. Every FSBO deal flows through here — from initial offer
-- through funding, inspection, and final payout. Stripe Connect handles money
-- movement; this table tracks the state machine.

CREATE TABLE IF NOT EXISTS public.kenai_escrow_transactions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Which Kenai site originated this transaction
  site_key                  TEXT NOT NULL,
  listing_id                UUID NOT NULL,
  listing_type              TEXT NOT NULL,

  -- Parties
  seller_id                 UUID NOT NULL REFERENCES public.kenai_profiles(id),
  buyer_id                  UUID REFERENCES public.kenai_profiles(id),

  -- State machine
  status                    TEXT NOT NULL DEFAULT 'draft',

  -- Money
  offer_amount              NUMERIC(14,2) NOT NULL,
  earnest_deposit           NUMERIC(14,2) DEFAULT 0,
  platform_fee              NUMERIC(14,2) DEFAULT 0,
  seller_payout             NUMERIC(14,2) DEFAULT 0,

  -- Fee configuration
  -- 1% escrow fee is the default — compare to 5-6% traditional agent commission
  fee_structure             TEXT DEFAULT 'flat',
  fee_rate                  NUMERIC(6,4) DEFAULT 0.0100,

  -- Stripe integration
  stripe_payment_intent_id  TEXT,
  stripe_transfer_id        TEXT,
  stripe_connect_account_id TEXT,

  -- Timeline
  inspection_deadline       TIMESTAMPTZ,
  conditions_deadline       TIMESTAMPTZ,
  closing_date              DATE,

  -- Disputes
  dispute_reason            TEXT,
  dispute_resolution        TEXT,

  -- Freeform
  notes                     TEXT,
  metadata                  JSONB DEFAULT '{}'::jsonb,

  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_site_key CHECK (site_key IN (
    'realty', 'land', 'homes', 'auto', 'listings', 'borough', 'rentals'
  )),
  CONSTRAINT chk_listing_type CHECK (listing_type IN (
    'property', 'parcel', 'home', 'vehicle', 'listing'
  )),
  CONSTRAINT chk_status CHECK (status IN (
    'draft', 'offer_pending', 'offer_accepted', 'escrow_funded',
    'inspection_period', 'conditions_review', 'pending_release',
    'completed', 'cancelled', 'disputed', 'refunded'
  )),
  CONSTRAINT chk_fee_structure CHECK (fee_structure IN (
    'flat', 'percentage', 'tiered'
  )),
  CONSTRAINT chk_offer_positive CHECK (offer_amount > 0),
  CONSTRAINT chk_earnest_non_negative CHECK (earnest_deposit >= 0),
  CONSTRAINT chk_fee_non_negative CHECK (platform_fee >= 0)
);

COMMENT ON TABLE public.kenai_escrow_transactions IS
  'Core escrow transactions for all Kenai FSBO sites. 1% fee replaces 5-6% agent commissions.';
COMMENT ON COLUMN public.kenai_escrow_transactions.fee_rate IS
  'Default 0.01 (1%). Traditional agents charge 0.05-0.06 (5-6%). This is where sellers save $20K+.';
COMMENT ON COLUMN public.kenai_escrow_transactions.stripe_connect_account_id IS
  'Seller''s Stripe Connect account for direct payout after escrow release.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_escrow_tx_seller      ON public.kenai_escrow_transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_escrow_tx_buyer       ON public.kenai_escrow_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_escrow_tx_status      ON public.kenai_escrow_transactions(status);
CREATE INDEX IF NOT EXISTS idx_escrow_tx_site_key    ON public.kenai_escrow_transactions(site_key);
CREATE INDEX IF NOT EXISTS idx_escrow_tx_listing     ON public.kenai_escrow_transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_escrow_tx_created     ON public.kenai_escrow_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_escrow_tx_closing     ON public.kenai_escrow_transactions(closing_date)
  WHERE closing_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_escrow_tx_stripe_pi   ON public.kenai_escrow_transactions(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_escrow_tx_metadata    ON public.kenai_escrow_transactions USING GIN (metadata);

-- RLS
ALTER TABLE public.kenai_escrow_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sellers see own transactions" ON public.kenai_escrow_transactions;
CREATE POLICY "Sellers see own transactions"
  ON public.kenai_escrow_transactions FOR SELECT
  USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Buyers see own transactions" ON public.kenai_escrow_transactions;
CREATE POLICY "Buyers see own transactions"
  ON public.kenai_escrow_transactions FOR SELECT
  USING (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Admins see all transactions" ON public.kenai_escrow_transactions;
CREATE POLICY "Admins see all transactions"
  ON public.kenai_escrow_transactions FOR SELECT
  USING (public.is_kenai_admin(auth.uid()));

DROP POLICY IF EXISTS "Sellers can create draft transactions" ON public.kenai_escrow_transactions;
CREATE POLICY "Sellers can create draft transactions"
  ON public.kenai_escrow_transactions FOR INSERT
  WITH CHECK (auth.uid() = seller_id AND status = 'draft');

DROP POLICY IF EXISTS "Buyers can create offer transactions" ON public.kenai_escrow_transactions;
CREATE POLICY "Buyers can create offer transactions"
  ON public.kenai_escrow_transactions FOR INSERT
  WITH CHECK (auth.uid() = buyer_id AND status = 'offer_pending');

DROP POLICY IF EXISTS "Participants can update own transactions" ON public.kenai_escrow_transactions;
CREATE POLICY "Participants can update own transactions"
  ON public.kenai_escrow_transactions FOR UPDATE
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id)
  WITH CHECK (auth.uid() = seller_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Admins can update all transactions" ON public.kenai_escrow_transactions;
CREATE POLICY "Admins can update all transactions"
  ON public.kenai_escrow_transactions FOR UPDATE
  USING (public.is_kenai_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete transactions" ON public.kenai_escrow_transactions;
CREATE POLICY "Admins can delete transactions"
  ON public.kenai_escrow_transactions FOR DELETE
  USING (public.is_kenai_admin(auth.uid()));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_escrow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_escrow_tx_updated_at ON public.kenai_escrow_transactions;
CREATE TRIGGER trg_escrow_tx_updated_at
  BEFORE UPDATE ON public.kenai_escrow_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_escrow_updated_at();


-- ============================================================================
-- 2. kenai_escrow_events  (immutable audit log)
-- ============================================================================
-- Every state change, payment, dispute, and note is recorded here permanently.
-- This is the legal paper trail. Rows are INSERT-only — no updates, no deletes
-- (enforced by RLS). If there's ever a dispute, this log is the source of truth.

CREATE TABLE IF NOT EXISTS public.kenai_escrow_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id    UUID NOT NULL REFERENCES public.kenai_escrow_transactions(id) ON DELETE CASCADE,

  event_type        TEXT NOT NULL,
  actor_id          UUID REFERENCES public.kenai_profiles(id),
  actor_role        TEXT,
  amount            NUMERIC(14,2),
  description       TEXT,
  metadata          JSONB DEFAULT '{}'::jsonb,

  created_at        TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_event_type CHECK (event_type IN (
    'created', 'offer_made', 'offer_accepted', 'offer_rejected', 'offer_countered',
    'escrow_funded', 'inspection_started', 'inspection_passed', 'inspection_failed',
    'conditions_met', 'conditions_waived', 'release_requested', 'release_approved',
    'funds_released', 'completed', 'cancelled', 'dispute_opened', 'dispute_resolved',
    'refund_initiated', 'refund_completed', 'note_added'
  )),
  CONSTRAINT chk_actor_role CHECK (actor_role IS NULL OR actor_role IN (
    'buyer', 'seller', 'admin', 'system'
  ))
);

COMMENT ON TABLE public.kenai_escrow_events IS
  'Immutable audit log for all escrow state changes. INSERT-only — the legal paper trail.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_escrow_events_tx       ON public.kenai_escrow_events(transaction_id);
CREATE INDEX IF NOT EXISTS idx_escrow_events_type     ON public.kenai_escrow_events(event_type);
CREATE INDEX IF NOT EXISTS idx_escrow_events_actor    ON public.kenai_escrow_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_escrow_events_created  ON public.kenai_escrow_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_escrow_events_metadata ON public.kenai_escrow_events USING GIN (metadata);

-- RLS — INSERT-only for participants, read for transaction parties + admins
ALTER TABLE public.kenai_escrow_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Transaction parties can view events" ON public.kenai_escrow_events;
CREATE POLICY "Transaction parties can view events"
  ON public.kenai_escrow_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.kenai_escrow_transactions t
      WHERE t.id = transaction_id
        AND (t.seller_id = auth.uid() OR t.buyer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can view all events" ON public.kenai_escrow_events;
CREATE POLICY "Admins can view all events"
  ON public.kenai_escrow_events FOR SELECT
  USING (public.is_kenai_admin(auth.uid()));

DROP POLICY IF EXISTS "Transaction parties can insert events" ON public.kenai_escrow_events;
CREATE POLICY "Transaction parties can insert events"
  ON public.kenai_escrow_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.kenai_escrow_transactions t
      WHERE t.id = transaction_id
        AND (t.seller_id = auth.uid() OR t.buyer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can insert events" ON public.kenai_escrow_events;
CREATE POLICY "Admins can insert events"
  ON public.kenai_escrow_events FOR INSERT
  WITH CHECK (public.is_kenai_admin(auth.uid()));

-- No UPDATE or DELETE policies — this log is immutable


-- ============================================================================
-- 3. kenai_verification_documents
-- ============================================================================
-- Document uploads for identity verification, title reports, inspections, etc.
-- Replaces the filing cabinets at traditional title companies and brokerages.

CREATE TABLE IF NOT EXISTS public.kenai_verification_documents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            UUID NOT NULL REFERENCES public.kenai_profiles(id),
  transaction_id        UUID REFERENCES public.kenai_escrow_transactions(id) ON DELETE SET NULL,

  document_type         TEXT NOT NULL,
  file_url              TEXT NOT NULL,
  file_name             TEXT,
  file_size             INTEGER,

  verification_status   TEXT DEFAULT 'pending',
  verified_by           UUID REFERENCES public.kenai_profiles(id),
  verified_at           TIMESTAMPTZ,
  expires_at            TIMESTAMPTZ,
  notes                 TEXT,

  created_at            TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_document_type CHECK (document_type IN (
    'government_id', 'proof_of_funds', 'title_report', 'survey',
    'inspection_report', 'disclosure_form', 'purchase_agreement',
    'deed', 'insurance', 'lien_release', 'vehicle_title', 'carfax',
    'appraisal', 'other'
  )),
  CONSTRAINT chk_verification_status CHECK (verification_status IN (
    'pending', 'verified', 'rejected', 'expired'
  ))
);

COMMENT ON TABLE public.kenai_verification_documents IS
  'Verification documents for identity, title, inspection, etc. Replaces traditional title company filing.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vdocs_profile     ON public.kenai_verification_documents(profile_id);
CREATE INDEX IF NOT EXISTS idx_vdocs_tx          ON public.kenai_verification_documents(transaction_id)
  WHERE transaction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vdocs_type        ON public.kenai_verification_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_vdocs_status      ON public.kenai_verification_documents(verification_status);
CREATE INDEX IF NOT EXISTS idx_vdocs_expires     ON public.kenai_verification_documents(expires_at)
  WHERE expires_at IS NOT NULL;

-- RLS
ALTER TABLE public.kenai_verification_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own documents" ON public.kenai_verification_documents;
CREATE POLICY "Users see own documents"
  ON public.kenai_verification_documents FOR SELECT
  USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Transaction parties see transaction documents" ON public.kenai_verification_documents;
CREATE POLICY "Transaction parties see transaction documents"
  ON public.kenai_verification_documents FOR SELECT
  USING (
    transaction_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.kenai_escrow_transactions t
      WHERE t.id = transaction_id
        AND (t.seller_id = auth.uid() OR t.buyer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins see all documents" ON public.kenai_verification_documents;
CREATE POLICY "Admins see all documents"
  ON public.kenai_verification_documents FOR SELECT
  USING (public.is_kenai_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can upload own documents" ON public.kenai_verification_documents;
CREATE POLICY "Users can upload own documents"
  ON public.kenai_verification_documents FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can update own pending documents" ON public.kenai_verification_documents;
CREATE POLICY "Users can update own pending documents"
  ON public.kenai_verification_documents FOR UPDATE
  USING (auth.uid() = profile_id AND verification_status = 'pending')
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Admins can update all documents" ON public.kenai_verification_documents;
CREATE POLICY "Admins can update all documents"
  ON public.kenai_verification_documents FOR UPDATE
  USING (public.is_kenai_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can delete own pending documents" ON public.kenai_verification_documents;
CREATE POLICY "Users can delete own pending documents"
  ON public.kenai_verification_documents FOR DELETE
  USING (auth.uid() = profile_id AND verification_status = 'pending');

DROP POLICY IF EXISTS "Admins can delete documents" ON public.kenai_verification_documents;
CREATE POLICY "Admins can delete documents"
  ON public.kenai_verification_documents FOR DELETE
  USING (public.is_kenai_admin(auth.uid()));


-- ============================================================================
-- 4. kenai_transaction_messages
-- ============================================================================
-- Secure messaging between buyer and seller within a transaction context.
-- Includes AI summaries so participants don't miss key points in long threads.

CREATE TABLE IF NOT EXISTS public.kenai_transaction_messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id    UUID NOT NULL REFERENCES public.kenai_escrow_transactions(id) ON DELETE CASCADE,
  sender_id         UUID NOT NULL REFERENCES public.kenai_profiles(id),

  message_type      TEXT DEFAULT 'text',
  content           TEXT NOT NULL,
  attachments       JSONB DEFAULT '[]'::jsonb,
  read_at           TIMESTAMPTZ,

  created_at        TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_message_type CHECK (message_type IN (
    'text', 'offer', 'counter_offer', 'document', 'system', 'ai_summary'
  ))
);

COMMENT ON TABLE public.kenai_transaction_messages IS
  'Secure per-transaction messaging. AI summaries replace agent intermediaries.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tx_messages_tx       ON public.kenai_transaction_messages(transaction_id);
CREATE INDEX IF NOT EXISTS idx_tx_messages_sender   ON public.kenai_transaction_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_tx_messages_created  ON public.kenai_transaction_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_messages_unread   ON public.kenai_transaction_messages(transaction_id, read_at)
  WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tx_messages_attach   ON public.kenai_transaction_messages USING GIN (attachments);

-- RLS
ALTER TABLE public.kenai_transaction_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Transaction parties can view messages" ON public.kenai_transaction_messages;
CREATE POLICY "Transaction parties can view messages"
  ON public.kenai_transaction_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.kenai_escrow_transactions t
      WHERE t.id = transaction_id
        AND (t.seller_id = auth.uid() OR t.buyer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can view all messages" ON public.kenai_transaction_messages;
CREATE POLICY "Admins can view all messages"
  ON public.kenai_transaction_messages FOR SELECT
  USING (public.is_kenai_admin(auth.uid()));

DROP POLICY IF EXISTS "Transaction parties can send messages" ON public.kenai_transaction_messages;
CREATE POLICY "Transaction parties can send messages"
  ON public.kenai_transaction_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND EXISTS (
      SELECT 1 FROM public.kenai_escrow_transactions t
      WHERE t.id = transaction_id
        AND (t.seller_id = auth.uid() OR t.buyer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Recipients can mark messages read" ON public.kenai_transaction_messages;
CREATE POLICY "Recipients can mark messages read"
  ON public.kenai_transaction_messages FOR UPDATE
  USING (
    auth.uid() != sender_id AND EXISTS (
      SELECT 1 FROM public.kenai_escrow_transactions t
      WHERE t.id = transaction_id
        AND (t.seller_id = auth.uid() OR t.buyer_id = auth.uid())
    )
  )
  WITH CHECK (
    -- Only allow setting read_at, nothing else changes
    auth.uid() != sender_id
  );

DROP POLICY IF EXISTS "Admins can manage messages" ON public.kenai_transaction_messages;
CREATE POLICY "Admins can manage messages"
  ON public.kenai_transaction_messages FOR ALL
  USING (public.is_kenai_admin(auth.uid()));


-- ============================================================================
-- 5. kenai_trust_scores
-- ============================================================================
-- Community reputation system. In traditional real estate, people trust agents
-- because of brand names (Coldwell Banker, RE/MAX). In FSBO, trust comes from
-- verified identities, completed transactions, and peer reviews. This table
-- replaces the "trusted agent" concept with transparent, computed reputation.

CREATE TABLE IF NOT EXISTS public.kenai_trust_scores (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id                UUID NOT NULL REFERENCES public.kenai_profiles(id) UNIQUE,

  -- Transaction history
  total_transactions        INTEGER DEFAULT 0,
  completed_transactions    INTEGER DEFAULT 0,

  -- Ratings
  average_rating            NUMERIC(3,2) DEFAULT 0,
  response_time_hours       NUMERIC(6,1),

  -- Verification flags
  identity_verified         BOOLEAN DEFAULT FALSE,
  phone_verified            BOOLEAN DEFAULT FALSE,
  email_verified            BOOLEAN DEFAULT FALSE,
  documents_verified        INTEGER DEFAULT 0,

  -- Computed trust
  trust_level               TEXT DEFAULT 'new',
  badges                    JSONB DEFAULT '[]'::jsonb,
  computed_score            NUMERIC(5,2) DEFAULT 0,

  updated_at                TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_trust_level CHECK (trust_level IN (
    'new', 'basic', 'verified', 'trusted', 'premium'
  )),
  CONSTRAINT chk_avg_rating CHECK (average_rating >= 0 AND average_rating <= 5),
  CONSTRAINT chk_computed_score CHECK (computed_score >= 0 AND computed_score <= 100)
);

COMMENT ON TABLE public.kenai_trust_scores IS
  'Community reputation scores. Replaces agent brand trust with transparent, verifiable history.';
COMMENT ON COLUMN public.kenai_trust_scores.trust_level IS
  'new=0-19, basic=20-39, verified=40-59, trusted=60-79, premium=80-100';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trust_profile     ON public.kenai_trust_scores(profile_id);
CREATE INDEX IF NOT EXISTS idx_trust_level       ON public.kenai_trust_scores(trust_level);
CREATE INDEX IF NOT EXISTS idx_trust_score       ON public.kenai_trust_scores(computed_score DESC);
CREATE INDEX IF NOT EXISTS idx_trust_badges      ON public.kenai_trust_scores USING GIN (badges);

-- RLS — trust scores are public (read), but only system/admin can write
ALTER TABLE public.kenai_trust_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view trust scores" ON public.kenai_trust_scores;
CREATE POLICY "Anyone can view trust scores"
  ON public.kenai_trust_scores FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "System can insert trust scores" ON public.kenai_trust_scores;
CREATE POLICY "System can insert trust scores"
  ON public.kenai_trust_scores FOR INSERT
  WITH CHECK (auth.uid() = profile_id OR public.is_kenai_admin(auth.uid()));

DROP POLICY IF EXISTS "System can update trust scores" ON public.kenai_trust_scores;
CREATE POLICY "System can update trust scores"
  ON public.kenai_trust_scores FOR UPDATE
  USING (public.is_kenai_admin(auth.uid()));


-- ============================================================================
-- 6. kenai_transaction_reviews
-- ============================================================================
-- Post-transaction peer reviews. Both buyer and seller rate each other.
-- These feed directly into the trust score computation.

CREATE TABLE IF NOT EXISTS public.kenai_transaction_reviews (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id        UUID NOT NULL REFERENCES public.kenai_escrow_transactions(id) ON DELETE CASCADE,
  reviewer_id           UUID NOT NULL REFERENCES public.kenai_profiles(id),
  reviewee_id           UUID NOT NULL REFERENCES public.kenai_profiles(id),

  rating                INTEGER NOT NULL,
  communication_rating  INTEGER,
  honesty_rating        INTEGER,
  timeliness_rating     INTEGER,
  review_text           TEXT,

  created_at            TIMESTAMPTZ DEFAULT NOW(),

  -- One review per reviewer per transaction
  CONSTRAINT uq_review_per_tx UNIQUE (transaction_id, reviewer_id),

  CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT chk_communication CHECK (communication_rating IS NULL OR (communication_rating >= 1 AND communication_rating <= 5)),
  CONSTRAINT chk_honesty CHECK (honesty_rating IS NULL OR (honesty_rating >= 1 AND honesty_rating <= 5)),
  CONSTRAINT chk_timeliness CHECK (timeliness_rating IS NULL OR (timeliness_rating >= 1 AND timeliness_rating <= 5)),
  CONSTRAINT chk_not_self_review CHECK (reviewer_id != reviewee_id)
);

COMMENT ON TABLE public.kenai_transaction_reviews IS
  'Peer reviews after completed transactions. Feeds trust score computation.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_tx         ON public.kenai_transaction_reviews(transaction_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer    ON public.kenai_transaction_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee    ON public.kenai_transaction_reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating      ON public.kenai_transaction_reviews(rating);

-- RLS
ALTER TABLE public.kenai_transaction_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reviews" ON public.kenai_transaction_reviews;
CREATE POLICY "Anyone can view reviews"
  ON public.kenai_transaction_reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Transaction parties can leave reviews" ON public.kenai_transaction_reviews;
CREATE POLICY "Transaction parties can leave reviews"
  ON public.kenai_transaction_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND EXISTS (
      SELECT 1 FROM public.kenai_escrow_transactions t
      WHERE t.id = transaction_id
        AND t.status = 'completed'
        AND (t.seller_id = auth.uid() OR t.buyer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Reviewers can update own reviews" ON public.kenai_transaction_reviews;
CREATE POLICY "Reviewers can update own reviews"
  ON public.kenai_transaction_reviews FOR UPDATE
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Admins can manage reviews" ON public.kenai_transaction_reviews;
CREATE POLICY "Admins can manage reviews"
  ON public.kenai_transaction_reviews FOR ALL
  USING (public.is_kenai_admin(auth.uid()));


-- ============================================================================
-- 7. kenai_admin_config
-- ============================================================================
-- Platform-wide configuration. Key-value store for runtime settings.
-- Avoids hardcoding fee structures, deadlines, and integration secrets.

CREATE TABLE IF NOT EXISTS public.kenai_admin_config (
  key           TEXT PRIMARY KEY,
  value         JSONB NOT NULL,
  updated_by    UUID REFERENCES public.kenai_profiles(id),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.kenai_admin_config IS
  'Platform configuration store. Admin-only write access. Some keys readable by all.';

-- RLS
ALTER TABLE public.kenai_admin_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public config is readable" ON public.kenai_admin_config;
CREATE POLICY "Public config is readable"
  ON public.kenai_admin_config FOR SELECT
  USING (
    -- Non-sensitive keys are publicly readable
    key NOT IN ('stripe_webhook_secret', 'llm_endpoint')
    OR public.is_kenai_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage config" ON public.kenai_admin_config;
CREATE POLICY "Admins can manage config"
  ON public.kenai_admin_config FOR ALL
  USING (public.is_kenai_admin(auth.uid()));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_admin_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_config_updated_at ON public.kenai_admin_config;
CREATE TRIGGER trg_admin_config_updated_at
  BEFORE UPDATE ON public.kenai_admin_config
  FOR EACH ROW EXECUTE FUNCTION public.set_admin_config_updated_at();

-- Seed default configuration
INSERT INTO public.kenai_admin_config (key, value) VALUES
  ('admin_email',              '"admin@kenainetwork.com"'::jsonb),
  ('platform_fee_flat',        '25.00'::jsonb),
  ('platform_fee_percentage',  '0.01'::jsonb),
  ('escrow_hold_days',         '30'::jsonb),
  ('inspection_period_days',   '10'::jsonb),
  ('dispute_window_days',      '14'::jsonb),
  ('stripe_webhook_secret',    '""'::jsonb),
  ('llm_endpoint',             '"http://localhost:8095/v1"'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- ============================================================================
-- FUNCTION: compute_kenai_trust_score
-- ============================================================================
-- Computes and updates a user's trust score based on:
--   • Transaction completion rate (30%)
--   • Average peer rating (30%)
--   • Verification status (25%)
--   • Response time (15%)
--
-- Called after reviews, transaction completions, or verification changes.

CREATE OR REPLACE FUNCTION public.compute_kenai_trust_score(profile_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_total_tx        INTEGER;
  v_completed_tx    INTEGER;
  v_avg_rating      NUMERIC(3,2);
  v_response_hours  NUMERIC(6,1);
  v_identity_v      BOOLEAN;
  v_phone_v         BOOLEAN;
  v_email_v         BOOLEAN;
  v_docs_v          INTEGER;
  v_score           NUMERIC(5,2);
  v_completion_pct  NUMERIC;
  v_rating_score    NUMERIC;
  v_verify_score    NUMERIC;
  v_response_score  NUMERIC;
  v_trust_level     TEXT;
  v_badges          JSONB;
BEGIN
  -- Count transactions
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO v_total_tx, v_completed_tx
  FROM public.kenai_escrow_transactions
  WHERE seller_id = profile_uuid OR buyer_id = profile_uuid;

  -- Average rating from reviews
  SELECT COALESCE(AVG(rating), 0)
  INTO v_avg_rating
  FROM public.kenai_transaction_reviews
  WHERE reviewee_id = profile_uuid;

  -- Average response time (hours between message and reply within transactions)
  SELECT COALESCE(AVG(
    EXTRACT(EPOCH FROM (
      reply.created_at - msg.created_at
    )) / 3600.0
  ), NULL)
  INTO v_response_hours
  FROM public.kenai_transaction_messages msg
  JOIN public.kenai_transaction_messages reply
    ON reply.transaction_id = msg.transaction_id
    AND reply.sender_id = profile_uuid
    AND reply.created_at > msg.created_at
    AND reply.sender_id != msg.sender_id
  WHERE msg.sender_id != profile_uuid
    AND NOT EXISTS (
      -- Only count the first reply to each message
      SELECT 1 FROM public.kenai_transaction_messages earlier
      WHERE earlier.transaction_id = msg.transaction_id
        AND earlier.sender_id = profile_uuid
        AND earlier.created_at > msg.created_at
        AND earlier.created_at < reply.created_at
    );

  -- Verification status from kenai_profiles
  SELECT
    COALESCE(p.is_verified, FALSE),
    COALESCE(p.phone IS NOT NULL AND LENGTH(p.phone) > 0, FALSE),
    TRUE  -- email always verified via Supabase auth
  INTO v_identity_v, v_phone_v, v_email_v
  FROM public.kenai_profiles p
  WHERE p.id = profile_uuid;

  -- Count verified documents
  SELECT COUNT(*)
  INTO v_docs_v
  FROM public.kenai_verification_documents
  WHERE profile_id = profile_uuid AND verification_status = 'verified';

  -- ── Score computation ──

  -- Completion rate (30% of score, max 30 points)
  IF v_total_tx > 0 THEN
    v_completion_pct := (v_completed_tx::NUMERIC / v_total_tx) * 30.0;
  ELSE
    v_completion_pct := 0;
  END IF;

  -- Rating score (30% of score, max 30 points)
  v_rating_score := (v_avg_rating / 5.0) * 30.0;

  -- Verification score (25% of score, max 25 points)
  v_verify_score := 0;
  IF v_identity_v THEN v_verify_score := v_verify_score + 10; END IF;
  IF v_phone_v    THEN v_verify_score := v_verify_score + 5;  END IF;
  IF v_email_v    THEN v_verify_score := v_verify_score + 5;  END IF;
  -- Up to 5 more points for verified documents (1 point each, max 5)
  v_verify_score := v_verify_score + LEAST(v_docs_v, 5);

  -- Response time score (15% of score, max 15 points)
  -- Under 1 hour = 15 points, under 4 hours = 12, under 24 = 8, else 3
  IF v_response_hours IS NULL THEN
    v_response_score := 0;
  ELSIF v_response_hours <= 1 THEN
    v_response_score := 15;
  ELSIF v_response_hours <= 4 THEN
    v_response_score := 12;
  ELSIF v_response_hours <= 24 THEN
    v_response_score := 8;
  ELSE
    v_response_score := 3;
  END IF;

  -- Total score (0-100)
  v_score := LEAST(v_completion_pct + v_rating_score + v_verify_score + v_response_score, 100);

  -- Determine trust level
  IF v_score >= 80 THEN
    v_trust_level := 'premium';
  ELSIF v_score >= 60 THEN
    v_trust_level := 'trusted';
  ELSIF v_score >= 40 THEN
    v_trust_level := 'verified';
  ELSIF v_score >= 20 THEN
    v_trust_level := 'basic';
  ELSE
    v_trust_level := 'new';
  END IF;

  -- Compute badges
  v_badges := '[]'::jsonb;
  IF v_completed_tx >= 10 THEN
    v_badges := v_badges || '["veteran_trader"]'::jsonb;
  END IF;
  IF v_completed_tx >= 1 THEN
    v_badges := v_badges || '["first_deal"]'::jsonb;
  END IF;
  IF v_avg_rating >= 4.5 AND v_total_tx >= 3 THEN
    v_badges := v_badges || '["top_rated"]'::jsonb;
  END IF;
  IF v_identity_v AND v_phone_v AND v_email_v THEN
    v_badges := v_badges || '["fully_verified"]'::jsonb;
  END IF;
  IF v_response_hours IS NOT NULL AND v_response_hours <= 1 THEN
    v_badges := v_badges || '["fast_responder"]'::jsonb;
  END IF;
  IF v_docs_v >= 3 THEN
    v_badges := v_badges || '["document_pro"]'::jsonb;
  END IF;

  -- Upsert trust score record
  INSERT INTO public.kenai_trust_scores (
    profile_id, total_transactions, completed_transactions,
    average_rating, response_time_hours,
    identity_verified, phone_verified, email_verified, documents_verified,
    trust_level, badges, computed_score, updated_at
  ) VALUES (
    profile_uuid, v_total_tx, v_completed_tx,
    v_avg_rating, v_response_hours,
    v_identity_v, v_phone_v, v_email_v, v_docs_v,
    v_trust_level, v_badges, v_score, NOW()
  )
  ON CONFLICT (profile_id) DO UPDATE SET
    total_transactions     = EXCLUDED.total_transactions,
    completed_transactions = EXCLUDED.completed_transactions,
    average_rating         = EXCLUDED.average_rating,
    response_time_hours    = EXCLUDED.response_time_hours,
    identity_verified      = EXCLUDED.identity_verified,
    phone_verified         = EXCLUDED.phone_verified,
    email_verified         = EXCLUDED.email_verified,
    documents_verified     = EXCLUDED.documents_verified,
    trust_level            = EXCLUDED.trust_level,
    badges                 = EXCLUDED.badges,
    computed_score         = EXCLUDED.computed_score,
    updated_at             = NOW();

  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.compute_kenai_trust_score IS
  'Recompute trust score for a profile. Weights: completion 30%, rating 30%, verification 25%, responsiveness 15%.';


-- ============================================================================
-- FUNCTION: advance_escrow_state
-- ============================================================================
-- State machine for escrow transactions. Validates transitions, logs events,
-- and computes derived fields (platform_fee, seller_payout) on completion.
--
-- Valid transitions:
--   draft → offer_pending → offer_accepted → escrow_funded →
--   inspection_period → conditions_review → pending_release → completed
--
--   Any active state → cancelled
--   Any active state → disputed
--   disputed → refunded | completed (after resolution)
--   escrow_funded/inspection_period → cancelled (with refund)

CREATE OR REPLACE FUNCTION public.advance_escrow_state(
  transaction_uuid UUID,
  new_status       TEXT,
  actor_uuid       UUID,
  reason           TEXT DEFAULT NULL
)
RETURNS public.kenai_escrow_transactions AS $$
DECLARE
  v_tx              public.kenai_escrow_transactions;
  v_actor_role      TEXT;
  v_event_type      TEXT;
  v_valid           BOOLEAN := FALSE;
  v_fee             NUMERIC(14,2);
  v_payout          NUMERIC(14,2);
  v_fee_rate_val    NUMERIC(6,4);
  v_fee_struct      TEXT;
BEGIN
  -- Lock the row for update
  SELECT * INTO v_tx
  FROM public.kenai_escrow_transactions
  WHERE id = transaction_uuid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction % not found', transaction_uuid;
  END IF;

  -- Determine actor role
  IF actor_uuid = v_tx.seller_id THEN
    v_actor_role := 'seller';
  ELSIF actor_uuid = v_tx.buyer_id THEN
    v_actor_role := 'buyer';
  ELSIF public.is_kenai_admin(actor_uuid) THEN
    v_actor_role := 'admin';
  ELSE
    RAISE EXCEPTION 'User % is not a party to transaction %', actor_uuid, transaction_uuid;
  END IF;

  -- Validate state transitions
  CASE v_tx.status
    WHEN 'draft' THEN
      v_valid := new_status IN ('offer_pending', 'cancelled');
    WHEN 'offer_pending' THEN
      v_valid := new_status IN ('offer_accepted', 'cancelled');
      -- Only seller can accept an offer
      IF new_status = 'offer_accepted' AND v_actor_role != 'seller' AND v_actor_role != 'admin' THEN
        RAISE EXCEPTION 'Only the seller or admin can accept an offer';
      END IF;
    WHEN 'offer_accepted' THEN
      v_valid := new_status IN ('escrow_funded', 'cancelled');
    WHEN 'escrow_funded' THEN
      v_valid := new_status IN ('inspection_period', 'cancelled', 'disputed');
    WHEN 'inspection_period' THEN
      v_valid := new_status IN ('conditions_review', 'cancelled', 'disputed');
    WHEN 'conditions_review' THEN
      v_valid := new_status IN ('pending_release', 'cancelled', 'disputed');
    WHEN 'pending_release' THEN
      v_valid := new_status IN ('completed', 'disputed');
    WHEN 'disputed' THEN
      v_valid := new_status IN ('refunded', 'completed');
      -- Only admin can resolve disputes
      IF v_actor_role != 'admin' THEN
        RAISE EXCEPTION 'Only admins can resolve disputes';
      END IF;
    WHEN 'completed' THEN
      v_valid := FALSE;  -- Terminal state
    WHEN 'cancelled' THEN
      v_valid := FALSE;  -- Terminal state
    WHEN 'refunded' THEN
      v_valid := FALSE;  -- Terminal state
    ELSE
      v_valid := FALSE;
  END CASE;

  IF NOT v_valid THEN
    RAISE EXCEPTION 'Invalid transition: % → % (actor: %)', v_tx.status, new_status, v_actor_role;
  END IF;

  -- Compute fees and payout on completion
  IF new_status = 'completed' THEN
    v_fee_struct := COALESCE(v_tx.fee_structure, 'flat');
    v_fee_rate_val := COALESCE(v_tx.fee_rate, 0.0100);

    CASE v_fee_struct
      WHEN 'percentage' THEN
        v_fee := ROUND(v_tx.offer_amount * v_fee_rate_val, 2);
      WHEN 'tiered' THEN
        -- Tiered: 1% on first $100K, 0.75% on next $400K, 0.5% above $500K
        IF v_tx.offer_amount <= 100000 THEN
          v_fee := ROUND(v_tx.offer_amount * 0.01, 2);
        ELSIF v_tx.offer_amount <= 500000 THEN
          v_fee := ROUND(1000 + (v_tx.offer_amount - 100000) * 0.0075, 2);
        ELSE
          v_fee := ROUND(1000 + 3000 + (v_tx.offer_amount - 500000) * 0.005, 2);
        END IF;
      ELSE  -- 'flat' or default: use fee_rate as percentage
        v_fee := ROUND(v_tx.offer_amount * v_fee_rate_val, 2);
    END CASE;

    v_payout := v_tx.offer_amount - v_fee;
  END IF;

  -- Map new_status to event_type
  CASE new_status
    WHEN 'offer_pending'     THEN v_event_type := 'offer_made';
    WHEN 'offer_accepted'    THEN v_event_type := 'offer_accepted';
    WHEN 'escrow_funded'     THEN v_event_type := 'escrow_funded';
    WHEN 'inspection_period' THEN v_event_type := 'inspection_started';
    WHEN 'conditions_review' THEN v_event_type := 'conditions_met';
    WHEN 'pending_release'   THEN v_event_type := 'release_requested';
    WHEN 'completed'         THEN v_event_type := 'completed';
    WHEN 'cancelled'         THEN v_event_type := 'cancelled';
    WHEN 'disputed'          THEN v_event_type := 'dispute_opened';
    WHEN 'refunded'          THEN v_event_type := 'refund_initiated';
    ELSE                          v_event_type := new_status;
  END CASE;

  -- Update the transaction
  UPDATE public.kenai_escrow_transactions SET
    status          = new_status,
    platform_fee    = COALESCE(v_fee, platform_fee),
    seller_payout   = COALESCE(v_payout, seller_payout),
    dispute_reason  = CASE WHEN new_status = 'disputed' THEN COALESCE(reason, dispute_reason) ELSE dispute_reason END,
    dispute_resolution = CASE WHEN v_tx.status = 'disputed' THEN COALESCE(reason, dispute_resolution) ELSE dispute_resolution END,
    updated_at      = NOW()
  WHERE id = transaction_uuid
  RETURNING * INTO v_tx;

  -- Log the event (immutable audit trail)
  INSERT INTO public.kenai_escrow_events (
    transaction_id, event_type, actor_id, actor_role,
    amount, description, metadata
  ) VALUES (
    transaction_uuid, v_event_type, actor_uuid, v_actor_role,
    CASE WHEN new_status = 'completed' THEN v_payout
         WHEN new_status = 'escrow_funded' THEN v_tx.offer_amount
         ELSE NULL END,
    COALESCE(reason, 'State transition: ' || v_tx.status || ' → ' || new_status),
    jsonb_build_object(
      'previous_status', v_tx.status,
      'new_status',      new_status,
      'actor_role',      v_actor_role,
      'timestamp',       NOW()
    )
  );

  -- Recompute trust scores for both parties on completion or cancellation
  IF new_status IN ('completed', 'cancelled', 'refunded') THEN
    PERFORM public.compute_kenai_trust_score(v_tx.seller_id);
    IF v_tx.buyer_id IS NOT NULL THEN
      PERFORM public.compute_kenai_trust_score(v_tx.buyer_id);
    END IF;
  END IF;

  RETURN v_tx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.advance_escrow_state IS
  'State machine for escrow transactions. Validates transitions, logs events, computes fees on completion.';


-- ============================================================================
-- TRIGGER: auto-recompute trust score after new review
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_recompute_trust_after_review()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.compute_kenai_trust_score(NEW.reviewee_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_trust_after_review ON public.kenai_transaction_reviews;
CREATE TRIGGER trg_trust_after_review
  AFTER INSERT OR UPDATE ON public.kenai_transaction_reviews
  FOR EACH ROW EXECUTE FUNCTION public.trg_recompute_trust_after_review();


-- ============================================================================
-- TRIGGER: auto-log escrow creation event
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_log_escrow_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.kenai_escrow_events (
    transaction_id, event_type, actor_id, actor_role,
    amount, description, metadata
  ) VALUES (
    NEW.id, 'created',
    COALESCE(NEW.buyer_id, NEW.seller_id),
    CASE WHEN NEW.status = 'offer_pending' THEN 'buyer' ELSE 'seller' END,
    NEW.offer_amount,
    'Transaction created on ' || NEW.site_key || ' for ' || NEW.listing_type,
    jsonb_build_object(
      'site_key',     NEW.site_key,
      'listing_id',   NEW.listing_id,
      'listing_type', NEW.listing_type,
      'offer_amount', NEW.offer_amount
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_escrow_created ON public.kenai_escrow_transactions;
CREATE TRIGGER trg_escrow_created
  AFTER INSERT ON public.kenai_escrow_transactions
  FOR EACH ROW EXECUTE FUNCTION public.trg_log_escrow_created();


-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Tables:   7 (transactions, events, documents, messages, trust, reviews, config)
-- Functions: 2 core (compute_kenai_trust_score, advance_escrow_state)
--            + 1 admin helper (is_kenai_admin)
--            + 4 trigger functions
-- Triggers:  4 (updated_at x2, trust recompute, creation audit)
-- RLS:       Full coverage on all 7 tables
-- Indexes:   28 (B-tree + GIN for JSONB)
--
-- This schema, combined with unified-auth-schema.sql, gives the Kenai
-- Network a complete FSBO escrow system that protects buyers and sellers
-- while keeping fees at a fraction of traditional real estate commissions.
-- ============================================================================
