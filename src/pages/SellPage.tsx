import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Seo } from '../components/common/Seo';
import { closingChecklist } from '../data/homes';
import { useToast } from '../context/ToastContext';
import { emailService } from '../lib/email';
import { emailTemplates } from '../lib/email-templates';

const steps = ['Basics', 'Home details', 'Photos & story', 'Pricing', 'Review'];

export default function SellPage() {
  const { notify } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    city: 'Kenai',
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    headline: 'Move-in ready Kenai Peninsula home',
    description: 'Tell buyers what makes your home memorable.',
    photoCount: 20,
  });

  const summary = useMemo(
    () => [
      ['Owner', form.ownerName || 'Add your name'],
      ['Email', form.email || 'Add your email'],
      ['Location', form.city],
      ['Suggested list price', `$${form.price.toLocaleString()}`],
      ['Home facts', `${form.bedrooms} bd • ${form.bathrooms} ba • ${form.sqft.toLocaleString()} sqft`],
      ['Photos', `${form.photoCount} planned uploads`],
    ],
    [form],
  );

  return (
    <div className="section-shell">
      <Seo title="Sell your home direct" description="Launch a polished five-step FSBO workflow for Kenai Peninsula homes." path="/sell" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="section-eyebrow">Sell your home</p>
            <h1 className="section-title">A five-step FSBO wizard that keeps you organized, buyer-ready, and confident.</h1>
            <div className="mt-8 flex flex-wrap gap-3">
              {steps.map((label, index) => (
                <div key={label} className={`rounded-full px-4 py-2 text-sm ${index === step ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 text-slate-300'}`}>{index + 1}. {label}</div>
              ))}
            </div>
            <div className="mt-8 card-elevated space-y-6">
              {step === 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input-glass" placeholder="Owner name" value={form.ownerName} onChange={(event) => setForm((current) => ({ ...current, ownerName: event.target.value }))} />
                  <input className="input-glass" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
                  <select className="select-glass md:col-span-2" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}>
                    {['Kenai', 'Soldotna', 'Homer', 'Seward', 'Sterling', 'Cooper Landing', 'Nikiski', 'Anchor Point'].map((city) => <option key={city}>{city}</option>)}
                  </select>
                </div>
              )}
              {step === 1 && (
                <div className="grid gap-4 md:grid-cols-3">
                  <input className="input-glass" type="number" value={form.bedrooms} onChange={(event) => setForm((current) => ({ ...current, bedrooms: Number(event.target.value || 0) }))} placeholder="Bedrooms" />
                  <input className="input-glass" type="number" value={form.bathrooms} onChange={(event) => setForm((current) => ({ ...current, bathrooms: Number(event.target.value || 0) }))} placeholder="Bathrooms" />
                  <input className="input-glass" type="number" value={form.sqft} onChange={(event) => setForm((current) => ({ ...current, sqft: Number(event.target.value || 0) }))} placeholder="Square feet" />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <input className="input-glass" value={form.headline} onChange={(event) => setForm((current) => ({ ...current, headline: event.target.value }))} placeholder="Headline" />
                  <textarea className="input-glass min-h-40" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
                  <input className="input-glass" type="number" value={form.photoCount} onChange={(event) => setForm((current) => ({ ...current, photoCount: Number(event.target.value || 0) }))} placeholder="Planned photo count" />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <label className="block text-sm text-slate-300">Price: ${form.price.toLocaleString()}</label>
                  <input className="w-full accent-cyan-400" type="range" min="200000" max="800000" step="5000" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))} />
                  <p className="text-sm text-slate-300">Traditional 6% listing cost: <span className="text-white">${Math.round(form.price * 0.06).toLocaleString()}</span> • Estimated direct-sale savings: <span className="text-white">${Math.round(form.price * 0.03).toLocaleString()}</span></p>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-4">
                  {summary.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span>{label}</span><span className="font-medium text-white">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap justify-between gap-3">
                <button className="btn-secondary gap-2" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ArrowLeft className="h-4 w-4" /> Back</button>
                {step < steps.length - 1 ? (
                  <button className="btn-primary gap-2" type="button" onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>Next <ArrowRight className="h-4 w-4" /></button>
                ) : (
                  <button className="btn-primary gap-2" type="button" onClick={() => void (async () => { const listingEmail = emailTemplates.eventSubmissionConfirmation({ eventName: form.headline || 'Home listing draft', dashboardUrl: `${window.location.origin}/dashboard` }); const result = await emailService.send({ to: form.email || 'hello@kenaihomesales.com', ...listingEmail, subject: `Home listing draft ready: ${form.headline}`, metadata: { notificationType: 'listing-created', city: form.city } }); notify(result.queued ? 'Listing draft saved. Email delivery may be delayed.' : 'Listing draft saved. Next step: connect Supabase + Stripe checkout.') })()}>Submit draft <CheckCircle2 className="h-4 w-4" /></button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-elevated">
              <p className="section-eyebrow">Alaska closing guide</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Keep every task organized from disclosures to recording.</h2>
              <div className="mt-6 space-y-4">
                {closingChecklist.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-300">
                    <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-emerald-400" /> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="card-elevated">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">FSBO trust</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">Verification badges, detailed pricing history, and a buyer-ready home detail page help your direct-sale listing feel every bit as credible as an agent-listed property.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
