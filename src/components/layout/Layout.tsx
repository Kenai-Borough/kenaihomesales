
import { AnimatePresence, motion } from 'framer-motion';
import { Home, MoonStar, SunMedium } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { KenaiNetworkBadge } from '../KenaiNetworkBadge';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { sisterSites } from '../../lib/config';
import { KenaiNetworkBanner } from '../../KenaiNetworkBanner';

const navItems = [
  { to: '/browse', label: 'Browse homes' },
  { to: '/sell', label: 'Sell your home' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function Layout() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Home className="h-5 w-5" /></div><div><p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Kenai Home Sales</p><p className="text-sm text-slate-300">Modern FSBO home sales across the Kenai Peninsula</p></div></Link>
          <nav className="hidden items-center gap-5 text-sm text-slate-300 lg:flex">{navItems.map(function (item) { return <NavLink key={item.to} to={item.to} className={function (props) { return props.isActive ? 'transition hover:text-white text-white' : 'transition hover:text-white' }}>{item.label}</NavLink> })}</nav>
          <div className="flex items-center gap-3">
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle color theme">{theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}</button>
            {user ? <KenaiNetworkBadge /> : null}
            {user ? (
              <><span className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100 sm:inline-flex">{user.fullName} • {user.role}</span><Link className="btn-secondary" to="/account">Account</Link><button className="btn-secondary" type="button" onClick={function () { void signOut() }}>Sign out</button></>
            ) : (
              <><Link to="/sign-in" className="text-sm text-slate-300 transition hover:text-white">Sign in</Link><Link to="/sign-up" className="btn-primary">Get started</Link></>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait"><motion.main key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}><Outlet /></motion.main></AnimatePresence>

      <footer className="border-t border-white/10 bg-slate-950/90"><KenaiNetworkBanner /><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr]"><div><p className="section-eyebrow">Why sell direct</p><h2 className="mt-3 text-2xl font-semibold text-white">Polished listings, buyer-ready trust signals, and more equity left at closing.</h2><p className="mt-4 max-w-xl text-sm text-slate-300">Kenai Home Sales gives homeowners a professional storefront without the traditional listing overhead.</p></div><div><h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Explore</h3><ul className="mt-4 space-y-3 text-sm text-slate-300"><li><Link to="/browse" className="hover:text-white">Browse homes</Link></li><li><Link to="/sell" className="hover:text-white">Sell your home</Link></li><li><Link to="/how-it-works" className="hover:text-white">How it works</Link></li><li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li></ul></div><div><h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Kenai network</h3><ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-1">{sisterSites.map(function (site) { return <li key={site.url}><a href={site.url} className="hover:text-white">{site.name}</a></li> })}</ul></div></div><div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">© {new Date().getFullYear()} Kenai Home Sales. Direct-to-buyer residential homes across the Kenai Peninsula.</div></div></footer>
    </div>
  );
}
