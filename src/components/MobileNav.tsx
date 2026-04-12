import { Home, Menu, MoonStar, SunMedium, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { KenaiNetworkBadge } from './KenaiNetworkBadge';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface MobileNavProps {
  navItems: Array<{ to: string; label: string }>;
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (drawerRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="icon-button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <div className={`fixed inset-0 z-40 bg-slate-950/70 transition ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden="true" />

      <div
        id="mobile-navigation"
        ref={drawerRef}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-slate-950 px-5 py-5 shadow-2xl shadow-slate-950/60 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Home className="h-5 w-5" /></div>
            <div><p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Kenai Home Sales</p><p className="text-sm text-slate-300">Modern FSBO home sales across the Kenai Peninsula</p></div>
          </Link>
          <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label="Close navigation drawer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Account</p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{user?.fullName || 'Browsing as guest'}</p>
              <p className="mt-1 text-sm text-slate-300">{user?.email || 'Sign in to save homes and manage your seller dashboard.'}</p>
            </div>
            {user ? <KenaiNetworkBadge /> : null}
          </div>
        </div>

        <nav className="mt-5 grid gap-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950' : 'rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
          <button type="button" onClick={toggleTheme} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100" aria-label="Toggle color theme">
            <span>{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</span>
            {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </button>
          {user ? (
            <>
              <Link to="/account" className="flex items-center justify-center rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white">
                Account
              </Link>
              <button type="button" className="rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950" onClick={() => void signOut()}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="flex items-center justify-center rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white">
                Sign in
              </Link>
              <Link to="/sign-up" className="rounded-full bg-cyan-400 px-4 py-3 text-center text-sm font-semibold text-slate-950">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
