import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { Seo } from '../components/common/Seo';
import { useAuth } from '../context/AuthContext';
import { homes } from '../data/homes';
import { currency, loadHomeIds } from '../lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();

  const sellerHomes = useMemo(() => homes.filter((home) => home.sellerEmail === user?.email).slice(0, 6), [user]);
  const buyerHomes = useMemo(() => {
    const savedIds = new Set(loadHomeIds());
    return homes.filter((home) => savedIds.has(home.id));
  }, []);

  const chartData = useMemo(() => sellerHomes.map((home) => ({ title: home.city, views: home.views, inquiries: home.inquiries })), [sellerHomes]);

  if (!user) {
    return (
      <div className="section-shell">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="section-eyebrow">Dashboard</p>
          <h1 className="section-title mx-auto">Sign in to manage saved homes, seller analytics, and messages.</h1>
          <Link className="btn-primary mt-8" to="/signin">Sign in</Link>
        </div>
      </div>
    );
  }

  const isSeller = user.role === 'seller';
  const isAdmin = user.role === 'admin';
  const inbox = [
    { id: 'msg-1', sender: 'River buyer', preview: 'Can we schedule a showing Saturday morning?', createdAt: '2026-01-18T10:00:00Z' },
    { id: 'msg-2', sender: 'Cash buyer', preview: 'We reviewed the disclosures and can move quickly.', createdAt: '2026-01-17T18:30:00Z' },
  ];

  return (
    <div className="section-shell">
      <Seo title="Your dashboard" description="Track saved homes, seller analytics, and admin oversight in one place." path="/dashboard" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Dashboard</p>
            <h1 className="section-title">Welcome back, {user.fullName}.</h1>
            <p className="mt-3 text-sm text-slate-300">{isSeller ? 'Track listings, inquiries, and direct-sale performance.' : 'Review your saved homes and buyer messages.'}</p>
          </div>
          {isAdmin && <Link className="btn-secondary" to="/admin">Open admin view</Link>}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="metric-card"><p className="text-xs uppercase tracking-[0.3em] text-slate-400">Role</p><p className="mt-3 text-2xl font-semibold text-white">{user.role}</p></div>
          <div className="metric-card"><p className="text-xs uppercase tracking-[0.3em] text-slate-400">Saved homes</p><p className="mt-3 text-2xl font-semibold text-white">{buyerHomes.length}</p></div>
          <div className="metric-card"><p className="text-xs uppercase tracking-[0.3em] text-slate-400">Verification</p><p className="mt-3 text-2xl font-semibold text-white">{user.verified ? 'Verified' : 'Pending'}</p></div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            {isSeller ? (
              <>
                <div className="card-elevated">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">Seller analytics</h2>
                      <p className="mt-2 text-sm text-slate-300">Listing views and inquiries across your current homes.</p>
                    </div>
                    <Link className="btn-secondary" to="/sell">Create listing</Link>
                  </div>
                  <div className="mt-6 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                        <XAxis dataKey="title" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }} />
                        <Bar dataKey="views" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="card-elevated">
                  <h2 className="text-2xl font-semibold text-white">Your listings</h2>
                  <div className="mt-6 space-y-4">
                    {sellerHomes.map((home) => (
                      <div key={home.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                        <div>
                          <p className="font-semibold text-white">{home.title}</p>
                          <p>{home.city} • {currency(home.price)}</p>
                        </div>
                        <div className="flex gap-6">
                          <span>{home.views} views</span>
                          <span>{home.inquiries} inquiries</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="card-elevated">
                <h2 className="text-2xl font-semibold text-white">Saved homes</h2>
                <div className="mt-6 space-y-4">
                  {buyerHomes.length ? buyerHomes.map((home) => (
                    <div key={home.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <div>
                        <p className="font-semibold text-white">{home.title}</p>
                        <p>{home.city} • {currency(home.price)}</p>
                      </div>
                      <Link className="text-cyan-300" to={`/home/${home.id}`}>View</Link>
                    </div>
                  )) : <p className="text-sm text-slate-300">No saved homes yet — explore the browse page and start a shortlist.</p>}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-8">
            <div className="card-elevated">
              <h2 className="text-2xl font-semibold text-white">Messages</h2>
              <div className="mt-6 space-y-4">
                {inbox.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-white">{message.sender}</p>
                      <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
                    </div>
                    <p className="mt-2 leading-7">{message.preview}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-elevated">
              <h2 className="text-2xl font-semibold text-white">Quick actions</h2>
              <div className="mt-6 grid gap-3">
                <Link className="btn-primary" to="/browse">Browse homes</Link>
                <Link className="btn-secondary" to="/sell">Sell your home</Link>
                {isAdmin && <Link className="btn-secondary" to="/admin">Admin controls</Link>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
