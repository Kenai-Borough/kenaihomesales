import { useMemo } from 'react';
import { Users, ShieldCheck, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { Seo } from '../components/common/Seo';
import { useAuth } from '../context/AuthContext';
import { homes, marketTrends } from '../data/homes';
import { currency } from '../lib/utils';

export default function AdminPage() {
  const { user } = useAuth();
  const totals = useMemo(() => ({
    listings: homes.length,
    verified: homes.filter((home) => home.verifiedSeller).length,
    inquiries: homes.reduce((sum, home) => sum + home.inquiries, 0),
  }), []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="section-shell">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="section-eyebrow">Admin</p>
          <h1 className="section-title mx-auto">Admin access is reserved for verified staff accounts.</h1>
          <Link className="btn-primary mt-8" to="/signin">Sign in as admin</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell">
      <Seo title="Admin overview" description="Moderation, user, and analytics view for Kenai Home Sales staff." path="/admin" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="section-eyebrow">Admin</p>
          <h1 className="section-title">Moderation, user health, and listing analytics in one place.</h1>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="metric-card"><div className="inline-flex items-center gap-2 text-cyan-300"><Users className="h-4 w-4" /> Users</div><p className="mt-3 text-2xl font-semibold text-white">143</p></div>
          <div className="metric-card"><div className="inline-flex items-center gap-2 text-cyan-300"><ShieldCheck className="h-4 w-4" /> Verified sellers</div><p className="mt-3 text-2xl font-semibold text-white">{totals.verified}</p></div>
          <div className="metric-card"><div className="inline-flex items-center gap-2 text-cyan-300"><TrendingUp className="h-4 w-4" /> Open inquiries</div><p className="mt-3 text-2xl font-semibold text-white">{totals.inquiries}</p></div>
        </div>
        <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="card-elevated">
            <h2 className="text-2xl font-semibold text-white">Median price trend</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketTrends}>
                  <defs>
                    <linearGradient id="adminTrendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }} formatter={(value) => currency(value)} />
                  <Area type="monotone" dataKey="medianPrice" stroke="#22d3ee" fill="url(#adminTrendGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-6">
            <div className="card-elevated">
              <h2 className="text-2xl font-semibold text-white">Moderation queue</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">3 new seller verification packets awaiting ID and title review.</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">2 listings flagged for photo quality and duplicate image cleanup.</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">1 buyer requested fraud review after a no-show seller interaction.</div>
              </div>
            </div>
            <div className="card-elevated">
              <h2 className="text-2xl font-semibold text-white">Platform snapshot</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between"><span>Total listings</span><span className="text-white">{totals.listings}</span></div>
                <div className="flex items-center justify-between"><span>Inventory coverage</span><span className="text-white">8 cities</span></div>
                <div className="flex items-center justify-between"><span>Average list price</span><span className="text-white">{currency(Math.round(homes.reduce((sum, home) => sum + home.price, 0) / homes.length))}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
