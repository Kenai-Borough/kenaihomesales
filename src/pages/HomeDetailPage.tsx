import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BadgeCheck, BedDouble, Bath, Heart, MapPin, Square, Trees } from 'lucide-react';
import { Seo } from '../components/common/Seo';
import { HomeCard } from '../components/homes/HomeCard';
import { HomeMap } from '../components/homes/HomeMap';
import { MortgageCalculator } from '../components/homes/MortgageCalculator';
import { homes } from '../data/homes';
import { useToast } from '../context/ToastContext';
import { currency, findSimilarHomes, loadHomeIds, saveHomeIds, propertyTypeLabel } from '../lib/utils';
import { emailService } from '../lib/email';
import { emailTemplates } from '../lib/email-templates';

export default function HomeDetailPage() {
  const { id } = useParams();
  const { notify } = useToast();
  const home = homes.find((entry) => entry.id === id) ?? homes[0];
  const similarHomes = useMemo(() => findSimilarHomes(home, homes), [home]);

  const saveHome = (homeId: string) => {
    const current = loadHomeIds();
    if (!current.includes(homeId)) {
      saveHomeIds([homeId, ...current]);
      notify('Saved to your buyer shortlist');
    }
  };

  return (
    <div className="section-shell">
      <Seo
        title={home.title}
        description={home.description}
        path={`/home/${home.id}`}
        image={home.images[0]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          name: home.title,
          description: home.description,
          image: home.images,
          url: `https://kenaihomesales.com/home/${home.id}`,
          offers: { '@type': 'Offer', price: home.price, priceCurrency: 'USD' },
          address: {
            '@type': 'PostalAddress',
            streetAddress: home.address,
            addressLocality: home.city,
            addressRegion: home.state,
            postalCode: home.zipCode,
          },
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900">
                <img alt={home.title} loading="lazy" width="1600" height="1067" className="h-[420px] w-full object-cover" src={home.images[0]} />
              </div>
              <div className="grid gap-3">
                {home.images.slice(1).map((image) => (
                  <div key={image} className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900">
                    <img alt={home.title} loading="lazy" width="800" height="533" className="h-[203px] w-full object-cover" src={image} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{propertyTypeLabel(home.propertyType)}</p>
                  <h1 className="mt-3 text-4xl font-semibold text-white">{home.title}</h1>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300"><MapPin className="h-4 w-4 text-cyan-300" /> {home.address}, {home.city}, {home.state} {home.zipCode}</div>
                </div>
                <button type="button" className="icon-button" onClick={() => saveHome(home.id)}><Heart className="h-4 w-4" /></button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <p className="text-4xl font-semibold text-white">{currency(home.price)}</p>
                {home.verifiedSeller && <span className="badge-dark"><BadgeCheck className="h-3.5 w-3.5 text-emerald-400" /> {home.badge}</span>}
                <span className="badge-dark">{home.daysOnMarket} days on market</span>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {[
                  { label: 'Bedrooms', value: home.bedrooms, icon: <BedDouble className="h-4 w-4 text-cyan-300" /> },
                  { label: 'Bathrooms', value: home.bathrooms, icon: <Bath className="h-4 w-4 text-cyan-300" /> },
                  { label: 'Sq Ft', value: home.sqft.toLocaleString(), icon: <Square className="h-4 w-4 text-cyan-300" /> },
                  { label: 'Lot size', value: `${home.lotSize} ac`, icon: <Trees className="h-4 w-4 text-cyan-300" /> },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">{item.icon}{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-base leading-8 text-slate-300">{home.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {home.features.map((feature) => (
                  <span key={feature} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">{feature}</span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-2">
              <div className="card-elevated">
                <h2 className="text-2xl font-semibold text-white">Price history</h2>
                <p className="mt-2 text-sm text-slate-300">Transparent pricing and adjustments build trust for direct-sale buyers.</p>
                <div className="mt-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={home.priceHistory}>
                      <defs>
                        <linearGradient id="priceHistoryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.85} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                      <XAxis dataKey="label" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }} formatter={(value) => currency(value)} />
                      <Area type="monotone" dataKey="price" stroke="#38bdf8" fill="url(#priceHistoryGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-elevated">
                <h2 className="text-2xl font-semibold text-white">Verified seller trust stack</h2>
                <div className="mt-6 space-y-4">
                  {home.verificationNotes.map((note) => (
                    <div key={note} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-300">{note}</div>
                  ))}
                </div>
                <button type="button" className="btn-primary mt-6 w-full" onClick={() => void (async () => { const inquiry = emailTemplates.propertyInquiry({ propertyTitle: home.title, buyerName: 'Interested buyer', buyerEmail: 'notifications@kenaihomesales.com', message: 'A buyer opened the direct contact flow and is ready for a showing or disclosures.', propertyUrl: window.location.href }); const result = await emailService.send({ to: home.sellerEmail ?? 'hello@kenaihomesales.com', ...inquiry, metadata: { notificationType: 'property-inquiry', homeId: home.id } }); notify(result.queued ? 'Message sent (email notification may be delayed).' : `Message sent to ${home.sellerName}`) })()}>Contact seller</button>
              </div>
            </div>

            <div className="mt-8"><HomeMap homes={[home]} height="360px" focus={[home.latitude, home.longitude]} zoom={11} /></div>
            <div className="mt-8"><MortgageCalculator price={home.price} /></div>
          </div>

          <aside className="space-y-6">
            <div className="card-elevated sticky top-24">
              <p className="section-eyebrow">Listing snapshot</p>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between"><span>Monthly estimate</span><span className="text-white">{currency(home.monthlyEstimate)}</span></div>
                <div className="flex items-center justify-between"><span>Year built</span><span className="text-white">{home.yearBuilt}</span></div>
                <div className="flex items-center justify-between"><span>School district</span><span className="text-white">{home.schoolDistrict}</span></div>
                <div className="flex items-center justify-between"><span>Heating</span><span className="text-white">{home.heating}</span></div>
                <div className="flex items-center justify-between"><span>Cooling</span><span className="text-white">{home.cooling}</span></div>
                <div className="flex items-center justify-between"><span>Property taxes</span><span className="text-white">{currency(home.taxes)}</span></div>
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                Estimated seller savings vs. a 6% listing model: <span className="font-semibold text-white">{currency(home.price * 0.03)}</span>
              </div>
              <Link className="btn-secondary mt-4 w-full" to="/sell">List a home like this</Link>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <p className="section-eyebrow">Similar homes</p>
          <h2 className="section-title">More homes buyers compare with this property.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similarHomes.map((entry) => <HomeCard key={entry.id} home={entry} onSave={saveHome} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
