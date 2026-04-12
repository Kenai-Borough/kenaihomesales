import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Seo } from '../components/common/Seo';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', role: 'buyer' as UserRole });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(form);
      navigate('/dashboard');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell">
      <Seo title="Create an account" description="Create a buyer, seller, or admin-ready Kenai Home Sales account." path="/signup" />
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <div className="card-elevated">
          <p className="section-eyebrow">Create account</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Launch your buyer or seller workspace.</h1>
          {error && <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</div>}
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <input className="input-glass" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} placeholder="Full name" />
            <input className="input-glass" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" />
            <input className="input-glass" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" />
            <input className="input-glass" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" />
            <select className="select-glass md:col-span-2" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as UserRole }))}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">By creating an account, you agree to our <Link to="/terms" className="text-sky-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-sky-400 hover:underline">Privacy Policy</Link>.</p>
            <button className="btn-primary md:col-span-2" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
          </form>
          <p className="mt-4 text-sm text-slate-300">Already have an account? <Link className="text-cyan-300" to="/signin">Sign in</Link>.</p>
        </div>
      </div>
    </div>
  );
}
