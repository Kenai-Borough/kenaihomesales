/**
 * Kenai Borough Network — Direct Sale Tools
 *
 * AI-powered tools that replace what traditional agents charge 5-6% for:
 * - Property/vehicle valuation
 * - Purchase agreement generation
 * - Disclosure checklists (Alaska-specific)
 * - Title verification workflow
 * - Closing cost estimation
 * - Inspection scheduling
 *
 * These tools connect to the local Qwen LLM (port 8095) for intelligent
 * document generation and analysis. Falls back to templates when offline.
 */

// ── Alaska Disclosure Requirements ─────────────────────────────────────────

/**
 * Alaska Statute AS 34.70 requires sellers to disclose known material defects.
 * This checklist covers all required disclosures for Kenai Peninsula properties.
 */
export const ALASKA_PROPERTY_DISCLOSURES = [
  {
    category: 'Structure',
    items: [
      { id: 'foundation', label: 'Foundation condition and any known defects', required: true },
      { id: 'roof', label: 'Roof age, condition, and any known leaks', required: true },
      { id: 'insulation', label: 'Insulation type and condition', required: true },
      { id: 'siding', label: 'Exterior siding/cladding condition', required: true },
      { id: 'windows', label: 'Window condition (single/double/triple pane)', required: true },
      { id: 'structural_damage', label: 'Any known structural damage or modifications', required: true },
    ],
  },
  {
    category: 'Systems',
    items: [
      { id: 'heating', label: 'Heating system type, age, and condition', required: true },
      { id: 'plumbing', label: 'Plumbing system condition and material', required: true },
      { id: 'electrical', label: 'Electrical system (panel amperage, wiring type)', required: true },
      { id: 'water_supply', label: 'Water source (well/municipal) and quality', required: true },
      { id: 'septic', label: 'Septic system details and last pump date', required: true },
      { id: 'fuel_storage', label: 'Fuel storage tanks (underground/above)', required: true },
    ],
  },
  {
    category: 'Environmental',
    items: [
      { id: 'flood_zone', label: 'Flood zone designation', required: true },
      { id: 'wetlands', label: 'Known wetlands on property', required: true },
      { id: 'contamination', label: 'Known soil or water contamination', required: true },
      { id: 'asbestos', label: 'Known asbestos-containing materials', required: true },
      { id: 'radon', label: 'Radon testing results', required: false },
      { id: 'lead_paint', label: 'Lead-based paint (pre-1978 homes)', required: true },
      { id: 'mold', label: 'Known mold or moisture issues', required: true },
    ],
  },
  {
    category: 'Legal',
    items: [
      { id: 'title_clear', label: 'Clear title / liens / encumbrances', required: true },
      { id: 'easements', label: 'Known easements or right-of-way', required: true },
      { id: 'boundary_disputes', label: 'Known boundary disputes', required: true },
      { id: 'zoning', label: 'Current zoning and any variance requests', required: true },
      { id: 'hoa', label: 'HOA/CC&R restrictions and fees', required: false },
      { id: 'permits', label: 'Unpermitted work or modifications', required: true },
      { id: 'pending_litigation', label: 'Pending litigation affecting property', required: true },
    ],
  },
  {
    category: 'Alaska-Specific',
    items: [
      { id: 'permafrost', label: 'Known permafrost conditions', required: true },
      { id: 'earthquake_damage', label: 'Previous earthquake damage or retrofitting', required: true },
      { id: 'winter_access', label: 'Year-round road access / winter maintenance', required: true },
      { id: 'wildfire_risk', label: 'Wildfire risk zone and defensible space', required: false },
      { id: 'wildlife', label: 'Wildlife-related issues (bears, moose)', required: false },
      { id: 'daylight', label: 'Solar exposure / seasonal daylight considerations', required: false },
    ],
  },
] as const;

export const ALASKA_VEHICLE_DISCLOSURES = [
  {
    category: 'Title & History',
    items: [
      { id: 'title_status', label: 'Title status (clean/salvage/rebuilt)', required: true },
      { id: 'odometer', label: 'Accurate odometer reading', required: true },
      { id: 'accidents', label: 'Known accident history', required: true },
      { id: 'liens', label: 'Outstanding liens or loans', required: true },
      { id: 'owner_count', label: 'Number of previous owners', required: false },
    ],
  },
  {
    category: 'Condition',
    items: [
      { id: 'mechanical', label: 'Known mechanical issues', required: true },
      { id: 'frame_rust', label: 'Frame/body rust condition', required: true },
      { id: 'flood_damage', label: 'Flood or water damage', required: true },
      { id: 'emissions', label: 'Emissions compliance status', required: false },
      { id: 'recalls', label: 'Outstanding manufacturer recalls', required: false },
    ],
  },
  {
    category: 'Alaska-Specific',
    items: [
      { id: 'winter_package', label: 'Cold-weather package / block heater', required: false },
      { id: 'studded_tires', label: 'Studded tires included', required: false },
      { id: 'remote_start', label: 'Remote start system', required: false },
      { id: 'rust_treatment', label: 'Undercoating/rust treatment history', required: false },
    ],
  },
] as const;

// ── Purchase Agreement Templates ───────────────────────────────────────────

export interface PurchaseAgreementData {
  type: 'property' | 'vehicle' | 'land';
  buyer: { name: string; address: string; phone: string; email: string };
  seller: { name: string; address: string; phone: string; email: string };
  item: {
    description: string;
    address?: string;
    vin?: string;
    price: number;
  };
  terms: {
    earnestMoney: number;
    inspectionDays: number;
    closingDate: string;
    contingencies: string[];
    additionalTerms?: string;
  };
  escrowTransactionId?: string;
}

/**
 * Generate a purchase agreement from structured data.
 * Returns Markdown-formatted document suitable for printing.
 */
export function generatePurchaseAgreement(data: PurchaseAgreementData): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const typeLabel = {
    property: 'REAL PROPERTY',
    vehicle: 'MOTOR VEHICLE',
    land: 'LAND / PARCEL',
  }[data.type];

  const contingencyList = data.terms.contingencies
    .map((c, i) => `${i + 1}. ${c}`)
    .join('\n');

  return `# ${typeLabel} PURCHASE AGREEMENT

**Date:** ${date}
**Kenai Borough Network Transaction ID:** ${data.escrowTransactionId || 'N/A'}

---

## PARTIES

**BUYER:**
${data.buyer.name}
${data.buyer.address}
Phone: ${data.buyer.phone} | Email: ${data.buyer.email}

**SELLER:**
${data.seller.name}
${data.seller.address}
Phone: ${data.seller.phone} | Email: ${data.seller.email}

---

## PROPERTY / ITEM DESCRIPTION

${data.item.description}
${data.item.address ? `**Address:** ${data.item.address}` : ''}
${data.item.vin ? `**VIN:** ${data.item.vin}` : ''}

---

## PURCHASE PRICE AND TERMS

**Purchase Price:** $${data.item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}

**Earnest Money Deposit:** $${data.terms.earnestMoney.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Earnest money shall be held in escrow via the Kenai Borough Network Stripe escrow system. Funds are secured and will only be released upon completion of all conditions or as otherwise specified in this agreement.

**Closing Date:** ${data.terms.closingDate}

**Inspection Period:** ${data.terms.inspectionDays} calendar days from the date of escrow funding.

---

## CONTINGENCIES

This agreement is contingent upon the following:

${contingencyList}

If any contingency is not satisfied within the specified period, the Buyer may cancel this agreement and receive a full refund of earnest money.

---

## ESCROW TERMS

1. All funds shall be held in escrow via the Kenai Borough Network platform, powered by Stripe.
2. The escrow fee is 1% of the purchase price (capped at $5,000), paid by the Seller at closing.
3. Funds shall be released to the Seller only after all contingencies are satisfied and the Buyer approves release.
4. In the event of a dispute, funds remain in escrow until resolved per the dispute resolution process.

---

## SELLER DISCLOSURES

Seller agrees to provide all required disclosures under Alaska Statute AS 34.70 (for real property) or applicable Alaska DMV requirements (for vehicles) within 5 business days of acceptance of this agreement.

---

## DISPUTE RESOLUTION

Any dispute arising from this transaction shall first be addressed through the Kenai Borough Network dispute resolution process. If unresolved, parties agree to binding arbitration in the Kenai Peninsula Borough, State of Alaska.

---

## ADDITIONAL TERMS

${data.terms.additionalTerms || 'None.'}

---

## SIGNATURES

By proceeding with this transaction on the Kenai Borough Network, both parties acknowledge that they have read, understood, and agree to all terms of this purchase agreement. Digital signatures are captured via the platform's secure authentication system.

**Buyer Signature:** _________________________ Date: _________

**Seller Signature:** _________________________ Date: _________

---

*This agreement was generated by the Kenai Borough Network Direct Sale Platform. This document is provided as a template and does not constitute legal advice. Both parties are encouraged to consult with a licensed attorney before finalizing any transaction.*

*Kenai Borough Network — Returning power to property owners.*
`;
}

// ── Closing Cost Estimator ─────────────────────────────────────────────────

export interface ClosingCostEstimate {
  category: string;
  items: { label: string; amount: number; paidBy: 'buyer' | 'seller' | 'split'; note?: string }[];
  subtotal: number;
}

/**
 * Estimate closing costs for a Kenai Peninsula property transaction.
 * These are the ACTUAL costs — no agent commissions padded in.
 */
export function estimateClosingCosts(
  salePrice: number,
  type: 'property' | 'land' | 'vehicle' = 'property'
): { buyerCosts: ClosingCostEstimate[]; sellerCosts: ClosingCostEstimate[]; totalBuyer: number; totalSeller: number; totalTraditional: number } {
  if (type === 'vehicle') {
    return estimateVehicleClosingCosts(salePrice);
  }

  const buyerCosts: ClosingCostEstimate[] = [
    {
      category: 'Kenai Network Fees',
      items: [
        { label: 'Escrow protection (1%, capped at $5,000)', amount: Math.min(salePrice * 0.01, 5000), paidBy: 'buyer', note: 'Refundable if transaction cancelled' },
      ],
      subtotal: Math.min(salePrice * 0.01, 5000),
    },
    {
      category: 'Title & Recording',
      items: [
        { label: 'Title search', amount: 250, paidBy: 'buyer' },
        { label: 'Title insurance (owner\'s policy)', amount: Math.round(salePrice * 0.005), paidBy: 'buyer' },
        { label: 'Recording fees', amount: 75, paidBy: 'buyer' },
      ],
      subtotal: 325 + Math.round(salePrice * 0.005),
    },
    {
      category: 'Inspections (Optional)',
      items: [
        { label: 'Home inspection', amount: 400, paidBy: 'buyer', note: 'Recommended' },
        { label: 'Well water test', amount: 150, paidBy: 'buyer', note: 'If applicable' },
        { label: 'Septic inspection', amount: 300, paidBy: 'buyer', note: 'If applicable' },
        { label: 'Radon test', amount: 150, paidBy: 'buyer', note: 'Optional' },
      ],
      subtotal: 1000,
    },
  ];

  const sellerCosts: ClosingCostEstimate[] = [
    {
      category: 'Kenai Network Fees',
      items: [
        { label: 'Listing fee', amount: type === 'land' ? 25 : 50, paidBy: 'seller' },
        { label: 'Platform escrow fee (1%)', amount: Math.min(salePrice * 0.01, 5000), paidBy: 'seller' },
      ],
      subtotal: (type === 'land' ? 25 : 50) + Math.min(salePrice * 0.01, 5000),
    },
    {
      category: 'Transfer & Legal',
      items: [
        { label: 'Deed preparation', amount: 200, paidBy: 'seller' },
        { label: 'Property tax proration', amount: Math.round(salePrice * 0.002), paidBy: 'seller', note: 'Estimated' },
        { label: 'Transfer tax (Kenai Peninsula Borough)', amount: 0, paidBy: 'seller', note: 'Alaska has no transfer tax' },
      ],
      subtotal: 200 + Math.round(salePrice * 0.002),
    },
    {
      category: 'Payoff & Liens',
      items: [
        { label: 'Existing mortgage payoff', amount: 0, paidBy: 'seller', note: 'Varies — enter actual amount' },
        { label: 'Lien release fees', amount: 50, paidBy: 'seller', note: 'If applicable' },
      ],
      subtotal: 50,
    },
  ];

  const totalBuyer = buyerCosts.reduce((sum, cat) => sum + cat.subtotal, 0);
  const totalSeller = sellerCosts.reduce((sum, cat) => sum + cat.subtotal, 0);

  // Traditional comparison: 5.5% agent commission + all the same costs
  const traditionalAgentFee = salePrice * 0.055;
  const totalTraditional = totalBuyer + totalSeller + traditionalAgentFee;

  return { buyerCosts, sellerCosts, totalBuyer, totalSeller, totalTraditional };
}

function estimateVehicleClosingCosts(salePrice: number) {
  const buyerCosts: ClosingCostEstimate[] = [
    {
      category: 'Kenai Network Fees',
      items: [
        { label: 'Escrow protection (1%)', amount: Math.min(salePrice * 0.01, 5000), paidBy: 'buyer' },
      ],
      subtotal: Math.min(salePrice * 0.01, 5000),
    },
    {
      category: 'Alaska DMV',
      items: [
        { label: 'Title transfer fee', amount: 15, paidBy: 'buyer' },
        { label: 'Registration fee', amount: 100, paidBy: 'buyer', note: 'Varies by vehicle type' },
        { label: 'License plate fee', amount: 30, paidBy: 'buyer', note: 'If new plates needed' },
      ],
      subtotal: 145,
    },
    {
      category: 'Inspections (Optional)',
      items: [
        { label: 'Pre-purchase inspection', amount: 150, paidBy: 'buyer', note: 'Strongly recommended' },
        { label: 'Vehicle history report', amount: 25, paidBy: 'buyer' },
      ],
      subtotal: 175,
    },
  ];

  const sellerCosts: ClosingCostEstimate[] = [
    {
      category: 'Kenai Network Fees',
      items: [
        { label: 'Listing fee', amount: 10, paidBy: 'seller' },
        { label: 'Platform escrow fee (1%)', amount: Math.min(salePrice * 0.01, 5000), paidBy: 'seller' },
      ],
      subtotal: 10 + Math.min(salePrice * 0.01, 5000),
    },
    {
      category: 'Transfer',
      items: [
        { label: 'Title release / lien payoff', amount: 0, paidBy: 'seller', note: 'If applicable' },
      ],
      subtotal: 0,
    },
  ];

  const totalBuyer = buyerCosts.reduce((sum, cat) => sum + cat.subtotal, 0);
  const totalSeller = sellerCosts.reduce((sum, cat) => sum + cat.subtotal, 0);
  // Dealer markup comparison: typically 15-25% over wholesale
  const totalTraditional = salePrice * 0.20 + totalBuyer + totalSeller;

  return { buyerCosts, sellerCosts, totalBuyer, totalSeller, totalTraditional };
}

// ── Title Verification Workflow ────────────────────────────────────────────

export interface TitleCheckStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'skipped';
  required: boolean;
  estimatedCost?: number;
  provider?: string;
}

export function getPropertyTitleChecklist(): TitleCheckStep[] {
  return [
    {
      id: 'title_search',
      label: 'Title Search',
      description: 'Search public records for ownership history, liens, judgments, and encumbrances.',
      status: 'pending',
      required: true,
      estimatedCost: 250,
      provider: 'Local title company or online service',
    },
    {
      id: 'lien_check',
      label: 'Lien Verification',
      description: 'Verify no outstanding liens, tax liens, or mechanic\'s liens exist on the property.',
      status: 'pending',
      required: true,
      estimatedCost: 0,
      provider: 'Included in title search',
    },
    {
      id: 'survey',
      label: 'Property Survey',
      description: 'Professional boundary survey to confirm lot lines and identify encroachments.',
      status: 'pending',
      required: false,
      estimatedCost: 800,
      provider: 'Licensed Alaska surveyor',
    },
    {
      id: 'title_insurance',
      label: 'Title Insurance',
      description: 'Owner\'s title insurance policy to protect against future claims.',
      status: 'pending',
      required: true,
      estimatedCost: undefined, // Varies by sale price
      provider: 'Title insurance company',
    },
    {
      id: 'deed_preparation',
      label: 'Deed Preparation',
      description: 'Prepare warranty deed or quitclaim deed for transfer of ownership.',
      status: 'pending',
      required: true,
      estimatedCost: 200,
      provider: 'Attorney or title company',
    },
    {
      id: 'recording',
      label: 'Recording',
      description: 'File the deed with the Kenai Peninsula Borough recording office.',
      status: 'pending',
      required: true,
      estimatedCost: 75,
      provider: 'Borough Recorder\'s Office',
    },
  ];
}

export function getVehicleTitleChecklist(): TitleCheckStep[] {
  return [
    {
      id: 'title_check',
      label: 'Title Status Check',
      description: 'Verify title is clean (not salvage, rebuilt, or flood). Check VIN against NMVTIS.',
      status: 'pending',
      required: true,
      estimatedCost: 0,
    },
    {
      id: 'lien_check',
      label: 'Lien Verification',
      description: 'Verify no outstanding loans or liens on the vehicle title.',
      status: 'pending',
      required: true,
      estimatedCost: 0,
    },
    {
      id: 'history_report',
      label: 'Vehicle History Report',
      description: 'Obtain comprehensive vehicle history (accidents, service, owners).',
      status: 'pending',
      required: false,
      estimatedCost: 25,
      provider: 'CARFAX or AutoCheck',
    },
    {
      id: 'inspection',
      label: 'Mechanical Inspection',
      description: 'Independent pre-purchase mechanical inspection by a certified mechanic.',
      status: 'pending',
      required: false,
      estimatedCost: 150,
      provider: 'Local certified mechanic',
    },
    {
      id: 'title_transfer',
      label: 'Title Transfer',
      description: 'Complete Alaska DMV title transfer (Form 812). Both parties must sign.',
      status: 'pending',
      required: true,
      estimatedCost: 15,
      provider: 'Alaska DMV',
    },
    {
      id: 'registration',
      label: 'Registration',
      description: 'Register vehicle in buyer\'s name with Alaska DMV within 30 days.',
      status: 'pending',
      required: true,
      estimatedCost: 100,
      provider: 'Alaska DMV',
    },
  ];
}

// ── Inspection Scheduling ──────────────────────────────────────────────────

export interface InspectionRequest {
  type: 'home' | 'property' | 'vehicle' | 'land' | 'septic' | 'well' | 'radon';
  address: string;
  preferredDates: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  notes?: string;
  transactionId?: string;
}

/**
 * Generate an inspection request message suitable for sending to providers.
 * In a full implementation, this would email/SMS local inspectors.
 */
export function formatInspectionRequest(request: InspectionRequest): string {
  const typeLabels: Record<string, string> = {
    home: 'General Home Inspection',
    property: 'Property Inspection',
    vehicle: 'Pre-Purchase Vehicle Inspection',
    land: 'Land/Environmental Assessment',
    septic: 'Septic System Inspection',
    well: 'Well Water Testing',
    radon: 'Radon Testing',
  };

  return `
INSPECTION REQUEST — Kenai Borough Network

Type: ${typeLabels[request.type] || request.type}
Location: ${request.address}
Preferred Dates: ${request.preferredDates.join(', ')}

Contact:
  Name: ${request.contactName}
  Phone: ${request.contactPhone}
  Email: ${request.contactEmail}

${request.notes ? `Notes: ${request.notes}` : ''}
${request.transactionId ? `Transaction ID: ${request.transactionId}` : ''}

This inspection is part of a direct-sale transaction on the Kenai Borough Network.
Please contact the requester to schedule.
`.trim();
}
