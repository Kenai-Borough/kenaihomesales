import { Home, Handshake, ShieldCheck, Wallet } from 'lucide-react';
import { Seo } from '../components/common/Seo';
import { closingChecklist } from '../data/homes';

const buyerSteps = [
  { icon: <Home className="h-5 w-5 text-cyan-300" />, title: 'Browse with clarity', description: 'Filter by city, price, layout, and year built while comparing map locations and neighborhood context.' },
  { icon: <ShieldCheck className="h-5 w-5 text-cyan-300" />, title: 'Review trust signals', description: 'Check seller verification badges, pricing history, and Alaska-ready listing details before booking a showing.' },
  { icon: <Wallet className="h-5 w-5 text-cyan-300" />, title: 'Model affordability', description: 'Use the mortgage calculator on every home detail page to estimate payments and amortization before making an offer.' },
];

const sellerSteps = [
  { icon: <Handshake className="h-5 w-5 text-cyan-300" />, title: 'Launch a polished listing', description: 'The five-step wizard organizes basics, photos, pricing, and review into one guided publishing flow.' },
  { icon: <ShieldCheck className="h-5 w-5 text-cyan-300" />, title: 'Build buyer confidence', description: 'Verification badges and disclosure-first content make your listing feel structured, transparent, and serious.' },
  { icon: <Wallet className="h-5 w-5 text-cyan-300" />, title: 'Keep more equity', description: 'Track your savings compared with a traditional 5–6% listing model while still presenting like a premium brand.' },
];

export default function HowItWorksPage() {
  return (
    <div className="section-shell">
      <Seo title="How Kenai Home Sales works" description="Understand the buyer and seller flow on Kenai Home Sales, plus a simple Alaska closing checklist." path="/how-it-works" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="section-eyebrow">How it works</p>
          <h1 className="section-title">Simple workflows for buyers and sellers who want a more direct Alaska home sale.</h1>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-white">For buyers</h2>
            <div className="mt-6 space-y-4">
              {buyerSteps.map((step) => (
                <div key={step.title} className="card-elevated">
                  <div className="flex items-center gap-3">{step.icon}<h3 className="text-xl font-semibold text-white">{step.title}</h3></div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">For sellers</h2>
            <div className="mt-6 space-y-4">
              {sellerSteps.map((step) => (
                <div key={step.title} className="card-elevated">
                  <div className="flex items-center gap-3">{step.icon}<h3 className="text-xl font-semibold text-white">{step.title}</h3></div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 card-elevated">
          <p className="section-eyebrow">Alaska closing guide</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">A practical checklist that keeps your transaction moving.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {closingChecklist.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-300">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
