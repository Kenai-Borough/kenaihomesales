import { useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, Search, ShieldCheck, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Seo } from '../components/common/Seo';
import { FeaturedCarousel } from '../components/homes/FeaturedCarousel';
import { HomeMap } from '../components/homes/HomeMap';
import { homes, featuredHomes, marketTrends, reviews, whySellDirect } from '../data/homes';
import { useToast } from '../context/ToastContext';
import { currency, loadHomeIds, saveHomeIds } from '../lib/utils';

export default function HomePage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [query, setQuery] = useState('');

  const stats = useMemo(() => {
    const prices = homes.map((home) => home.price);
    return {
      listings: homes.length,
      averagePrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
      cities: new Set(homes.map((home) => home.city)).size,
      verified: homes.filter((home) => home.verifiedSeller).length,
    };
  }, []);

  const saveHome = (id: string) => {
    const current = loadHomeIds();
    if (!current.includes(id)) {
      saveHomeIds([id, ...current]);
      notify('Saved to your dashboard shortlist');
    }
  };

  return (
    <div>
      <Seo
        title="Direct-sale homes on the Kenai Peninsula"
        description="Browse Kenai Peninsula homes with filters, maps, mortgage tools, and seller verification built in."
        path="/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: 'Kenai Home Sales',
          url: 'https://kenaihomesales.com',
          areaServed: 'Kenai Peninsula Borough',
          description: 'Modern FSBO home marketplace for Kenai Peninsula buyers and sellers.',
        }}
      />

      <section className="section-shell border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div>
            <p className="section-eyebrow">Kenai Peninsula homes</p>
            <h1 className="section-title text-5xl leading-tight md:text-6xl">Buy or sell Alaska homes without losing the professional edge.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Search 25+ sample homes, review neighborhood context, compare mortgage costs, and launch a five-step FSBO listing flow designed for Kenai Peninsula sellers.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary gap-2" type="button" onClick={() => navigate('/browse')}>
                Browse homes <ArrowRight className="h-4 w-4" />
              </button>
              <button className="btn-secondary" type="button" onClick={() => navigate('/sell')}>
                Sell your home direct
              </button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Live homes', value: stats.listings },
                { label: 'Median-ready pricing', value: currency(stats.averagePrice) },
                { label: 'Verified sellers', value: stats.verified },
              ].map((item) => (
                <div key={item.label} className="metric-card">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated space-y-5">
            <div className="flex items-center gap-3 text-cyan-300"><Search className="h-5 w-5" /> Smart home search</div>
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <input className="input-glass" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Kenai, Soldotna, Homer, cabins, townhomes..." />
              <button className="btn-primary" type="button" onClick={() => navigate(`/browse?q=${encodeURIComponent(query)}`)}>Search</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <div className="flex items-center gap-2 text-emerald-200"><ShieldCheck className="h-4 w-4" /> FSBO trust</div>
                <p className="mt-3 text-sm leading-7 text-emerald-50">Seller verification, Alaska closing guidance, and buyer-ready listing detail pages increase confidence without traditional agent overhead.</p>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <div className="flex items-center gap-2 text-cyan-100"><TrendingUp className="h-4 w-4" /> Local signal</div>
                <p className="mt-3 text-sm leading-7 text-cyan-50">Track pricing, inventory, and days on market for the Kenai Peninsula communities buyers compare most.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FeaturedCarousel homes={featuredHomes} onSave={saveHome} />
        </div>
      </section>

      <section className="section-shell border-y border-white/10 bg-slate-950/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="section-eyebrow">Why sell direct</p>
            <h2 className="section-title">A real FSBO storefront, not a bare classifieds page.</h2>
            <div className="mt-8 space-y-4">
              {whySellDirect.map((item) => (
                <div key={item} className="card-elevated flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-5 w-5 text-cyan-300" />
                  <p className="text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card-elevated">
            <div className="flex items-center gap-3 text-cyan-300"><TrendingUp className="h-5 w-5" /> Market momentum</div>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketTrends}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }} formatter={(value) => currency(value)} />
                  <Area type="monotone" dataKey="medianPrice" stroke="#22d3ee" fill="url(#trendGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="section-eyebrow">Peninsula coverage</p>
            <h2 className="section-title">Map-first browsing across Kenai, Soldotna, Homer, Seward, Sterling, Cooper Landing, Nikiski, and Anchor Point.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">Every detail page includes a home map, financing tool, and seller trust notes. Buyers can save homes locally and return through the dashboard.</p>
          </div>
          <HomeMap homes={homes.slice(0, 12)} />
        </div>
      </section>

      <section className="section-shell border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Seller success</p>
              <h2 className="section-title">Confidence for buyers, stronger margins for sellers.</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="card-elevated">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{review.city}</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">“{review.quote}”</p>
                <p className="mt-5 font-semibold text-white">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
