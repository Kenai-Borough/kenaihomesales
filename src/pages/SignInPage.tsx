import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Seo } from '../components/common/Seo';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('buyer@kenaihomesales.com');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell">
      <Seo title="Sign in" description="Sign in as a buyer, seller, or admin." path="/signin" />
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="card-elevated">
          <p className="section-eyebrow">Sign in</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Access your Kenai Home Sales dashboard.</h1>
          <p className="mt-3 text-sm text-slate-300">Demo accounts: buyer@kenaihomesales.com, seller@kenaihomesales.com, or admin@kenaihomesales.com — all with <span className="text-white">demo1234</span>.</p>
          {error && <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</div>}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-glass" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            <input className="input-glass" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
            <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>
          <p className="mt-4 text-sm text-slate-300">No account yet? <Link className="text-cyan-300" to="/signup">Create one here</Link>.</p>
        </div>
      </div>
    </div>
  );
}
