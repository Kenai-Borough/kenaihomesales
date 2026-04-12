/**
 * Kenai Borough Network — Direct Sale Tools UI
 *
 * Interactive components for the FSBO (For Sale By Owner) workflow:
 * - Fee savings calculator with side-by-side comparison
 * - Disclosure checklist generator
 * - Closing cost estimator
 * - Title verification tracker
 * - Purchase agreement generator
 */

import { useState, useMemo } from 'react';
import {
  Calculator,
  FileText,
  ClipboardCheck,
  Shield,
  DollarSign,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Download,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import {
  calculateFees,
  FEE_SCHEDULE,
  type FeeBreakdown,
} from '../../lib/stripe-escrow';
import {
  ALASKA_PROPERTY_DISCLOSURES,
  ALASKA_VEHICLE_DISCLOSURES,
  estimateClosingCosts,
  getPropertyTitleChecklist,
  getVehicleTitleChecklist,
  type TitleCheckStep,
} from '../../lib/direct-sale-tools';

// ── Fee Savings Calculator ─────────────────────────────────────────────────

export function FeeSavingsCalculator({ type = 'property' }: { type?: 'property' | 'vehicle' | 'land' }) {
  const [price, setPrice] = useState(type === 'vehicle' ? 25000 : type === 'land' ? 150000 : 400000);

  const fees = useMemo(() => calculateFees(price, type === 'vehicle' ? 'standard' : 'premium'), [price, type]);

  const traditionalRate = type === 'vehicle' ? 0.20 : 0.055;
  const traditionalLabel = type === 'vehicle' ? 'Dealer Markup (~20%)' : 'Agent Commission (5.5%)';
  const traditionalFee = price * traditionalRate;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Calculator className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">See What You Save</h3>
          <p className="text-sm text-slate-400">Kenai Network vs traditional {type === 'vehicle' ? 'dealers' : 'agents'}</p>
        </div>
      </div>

      {/* Price slider */}
      <div>
        <label className="text-sm text-slate-300 mb-2 block">Sale Price</label>
        <div className="text-3xl font-bold text-white mb-3">
          ${price.toLocaleString()}
        </div>
        <input
          type="range"
          min={type === 'vehicle' ? 5000 : 50000}
          max={type === 'vehicle' ? 100000 : 2000000}
          step={type === 'vehicle' ? 1000 : 10000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>${(type === 'vehicle' ? 5000 : 50000).toLocaleString()}</span>
          <span>${(type === 'vehicle' ? 100000 : 2000000).toLocaleString()}</span>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* Traditional */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <p className="text-xs text-rose-400 font-medium mb-1">{traditionalLabel}</p>
          <p className="text-2xl font-bold text-rose-400">${Math.round(traditionalFee).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">+ title fees, closing costs</p>
        </div>

        {/* Kenai Network */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs text-emerald-400 font-medium mb-1">Kenai Network (1% + flat fee)</p>
          <p className="text-2xl font-bold text-emerald-400">${Math.round(fees.platformRevenue).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Escrow-protected</p>
        </div>
      </div>

      {/* Savings callout */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 p-4 flex items-center gap-4">
        <TrendingDown className="h-8 w-8 text-emerald-400 shrink-0" />
        <div>
          <p className="text-sm text-slate-300">You save</p>
          <p className="text-2xl font-bold text-emerald-400">
            ${Math.round(fees.savingsVsTraditional).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">
            That's {Math.round((fees.savingsVsTraditional / price) * 100)}% of the sale price back in your pocket
          </p>
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Listing fee</span>
          <span>${fees.listingFee}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Escrow fee ({(fees.escrowFeeRate * 100).toFixed(0)}%, capped at $5,000)</span>
          <span>${fees.escrowFeeAmount.toLocaleString()}</span>
        </div>
        <div className="border-t border-white/10 pt-2 flex justify-between text-white font-semibold">
          <span>Total Kenai Network cost</span>
          <span>${fees.platformRevenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-emerald-400 font-semibold">
          <span>Seller receives</span>
          <span>${fees.sellerReceives.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ── Disclosure Checklist ───────────────────────────────────────────────────

export function DisclosureChecklist({ type = 'property' }: { type?: 'property' | 'vehicle' }) {
  const disclosures = type === 'vehicle' ? ALASKA_VEHICLE_DISCLOSURES : ALASKA_PROPERTY_DISCLOSURES;
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(disclosures.map((d) => d.category))
  );

  const totalRequired = disclosures.flatMap((d) => d.items).filter((i) => i.required).length;
  const checkedRequired = disclosures
    .flatMap((d) => d.items)
    .filter((i) => i.required && checked.has(i.id)).length;
  const progress = totalRequired > 0 ? (checkedRequired / totalRequired) * 100 : 0;

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <ClipboardCheck className="h-5 w-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">
            Alaska {type === 'vehicle' ? 'Vehicle' : 'Property'} Disclosure Checklist
          </h3>
          <p className="text-sm text-slate-400">
            {type === 'vehicle' ? 'Alaska DMV requirements' : 'Required under Alaska Statute AS 34.70'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{checkedRequired}/{totalRequired}</p>
          <p className="text-xs text-slate-500">required complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: progress === 100
              ? 'linear-gradient(90deg, #34d399, #06b6d4)'
              : 'linear-gradient(90deg, #f59e0b, #f97316)',
          }}
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {disclosures.map((category) => (
          <div key={category.category} className="rounded-xl border border-white/5 bg-white/[0.02]">
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors rounded-xl"
            >
              <span className="font-medium text-white">{category.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {category.items.filter((i) => checked.has(i.id)).length}/{category.items.length}
                </span>
                {expandedCategories.has(category.category) ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </div>
            </button>

            {expandedCategories.has(category.category) && (
              <div className="px-4 pb-4 space-y-2">
                {category.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="mt-0.5 shrink-0"
                    >
                      {checked.has(item.id) ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-600" />
                      )}
                    </button>
                    <div>
                      <span className={`text-sm ${checked.has(item.id) ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {item.label}
                      </span>
                      {item.required && !checked.has(item.id) && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
                          REQUIRED
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {progress === 100 && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <p className="text-sm text-emerald-300">All required disclosures complete. You're ready to list!</p>
        </div>
      )}
    </div>
  );
}

// ── Closing Cost Estimator ─────────────────────────────────────────────────

export function ClosingCostEstimator({ type = 'property' }: { type?: 'property' | 'vehicle' | 'land' }) {
  const [price, setPrice] = useState(type === 'vehicle' ? 25000 : 300000);
  const [role, setRole] = useState<'buyer' | 'seller'>('seller');

  const costs = useMemo(() => estimateClosingCosts(price, type), [price, type]);
  const activeCosts = role === 'buyer' ? costs.buyerCosts : costs.sellerCosts;
  const activeTotal = role === 'buyer' ? costs.totalBuyer : costs.totalSeller;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Closing Cost Estimator</h3>
          <p className="text-sm text-slate-400">Kenai Peninsula, Alaska</p>
        </div>
      </div>

      {/* Price input */}
      <div>
        <label className="text-sm text-slate-300 mb-1 block">Sale Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-lg font-semibold focus:outline-none focus:border-cyan-400/50"
        />
      </div>

      {/* Role toggle */}
      <div className="flex rounded-lg border border-white/10 overflow-hidden">
        {(['buyer', 'seller'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              role === r
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-transparent text-slate-400 hover:bg-white/5'
            }`}
          >
            {r === 'buyer' ? 'I\'m Buying' : 'I\'m Selling'}
          </button>
        ))}
      </div>

      {/* Cost breakdown */}
      <div className="space-y-4">
        {activeCosts.map((category) => (
          <div key={category.category}>
            <h4 className="text-sm font-medium text-slate-300 mb-2">{category.category}</h4>
            <div className="space-y-1">
              {category.items.map((item) => (
                <div key={item.label} className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{item.label}</span>
                    {item.note && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{item.note}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {item.amount === 0 ? '—' : `$${item.amount.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <div className="flex justify-between text-white font-bold text-lg">
          <span>Estimated Total ({role})</span>
          <span>${activeTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-rose-400 text-sm">
          <span>Traditional total (with agent fees)</span>
          <span>${Math.round(costs.totalTraditional).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-emerald-400 text-sm font-semibold">
          <span>You save with Kenai Network</span>
          <span>${Math.round(costs.totalTraditional - activeTotal).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ── Title Verification Tracker ─────────────────────────────────────────────

export function TitleTracker({ type = 'property' }: { type?: 'property' | 'vehicle' }) {
  const [steps, setSteps] = useState<TitleCheckStep[]>(
    type === 'vehicle' ? getVehicleTitleChecklist() : getPropertyTitleChecklist()
  );

  const updateStep = (id: string, status: TitleCheckStep['status']) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const completedCount = steps.filter((s) => s.status === 'passed').length;
  const progress = (completedCount / steps.length) * 100;

  const statusIcon = (status: TitleCheckStep['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case 'failed': return <AlertTriangle className="h-5 w-5 text-rose-400" />;
      case 'in_progress': return <div className="h-5 w-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />;
      case 'skipped': return <Circle className="h-5 w-5 text-slate-600" />;
      default: return <Circle className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <Shield className="h-5 w-5 text-violet-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">Title Verification</h3>
          <p className="text-sm text-slate-400">
            {type === 'vehicle' ? 'Vehicle title & transfer' : 'Property title clearance'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{completedCount}/{steps.length}</p>
          <p className="text-xs text-slate-500">steps complete</p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={step.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{statusIcon(step.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-white">{step.label}</h4>
                  {step.required && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
                      REQUIRED
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-1">{step.description}</p>
                {step.estimatedCost !== undefined && step.estimatedCost > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    Est. cost: ${step.estimatedCost.toLocaleString()}
                    {step.provider && ` · ${step.provider}`}
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                {(['passed', 'in_progress', 'failed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStep(step.id, step.status === s ? 'pending' : s)}
                    className={`px-2 py-1 text-[10px] rounded-md border transition-colors ${
                      step.status === s
                        ? s === 'passed'
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                          : s === 'in_progress'
                          ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                          : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                        : 'bg-transparent border-white/10 text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    {s === 'passed' ? '✓' : s === 'in_progress' ? '⟳' : '✗'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {progress === 100 && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-400" />
          <p className="text-sm text-emerald-300">
            Title verification complete. Ready for closing!
          </p>
        </div>
      )}
    </div>
  );
}

// ── Barrel Export ───────────────────────────────────────────────────────────

export { FeeSavingsCalculator as default };
