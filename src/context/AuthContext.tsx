/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Profile, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: { email: string; password: string; fullName: string; role: UserRole; phone: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

interface MockUserRecord {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone: string;
  verified: boolean;
}

const storageKey = 'kenaihomesales-auth-user';
const mockUsersKey = 'kenaihomesales-mock-users';

const baseMockUsers: MockUserRecord[] = [
  { id: 'buyer-demo', email: 'buyer@kenaihomesales.com', password: 'demo1234', fullName: 'Avery Buyer', role: 'buyer', phone: '(907) 555-1001', verified: true },
  { id: 'seller-demo', email: 'seller@kenaihomesales.com', password: 'demo1234', fullName: 'Morgan Seller', role: 'seller', phone: '(907) 555-1002', verified: true },
  { id: 'admin-demo', email: 'admin@kenaihomesales.com', password: 'demo1234', fullName: 'Taylor Admin', role: 'admin', phone: '(907) 555-1003', verified: true },
];

const normalizeProfile = (record: MockUserRecord): Profile => ({
  id: record.id,
  email: record.email,
  fullName: record.fullName,
  phone: record.phone,
  role: record.role,
  verified: record.verified,
});

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadMockUsers = () => {
  const existing = window.localStorage.getItem(mockUsersKey);
  if (!existing) {
    window.localStorage.setItem(mockUsersKey, JSON.stringify(baseMockUsers));
    return baseMockUsers;
  }
  return JSON.parse(existing) as MockUserRecord[];
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const metadata = session.user.user_metadata as Record<string, string | undefined>;
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: metadata.full_name || 'Kenai Home Sales Member',
            phone: metadata.phone || '(907) 555-0000',
            role: (metadata.role as UserRole) || 'buyer',
            verified: !!session.user.email_confirmed_at,
          });
        }
      } else if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setUser(JSON.parse(saved) as Profile);
        loadMockUsers();
      }
      setLoading(false);
    };

    bootstrap();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const metadata = data.user.user_metadata as Record<string, string | undefined>;
      const profile: Profile = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: metadata.full_name || 'Kenai Home Sales Member',
        phone: metadata.phone || '(907) 555-0000',
        role: (metadata.role as UserRole) || 'buyer',
        verified: !!data.user.email_confirmed_at,
      };
      setUser(profile);
      return;
    }

    const match = loadMockUsers().find((entry) => entry.email === email && entry.password === password);
    if (!match) throw new Error('Use buyer@kenaihomesales.com, seller@kenaihomesales.com, or admin@kenaihomesales.com with demo1234.');
    const profile = normalizeProfile(match);
    setUser(profile);
    window.localStorage.setItem(storageKey, JSON.stringify(profile));
  }, []);

  const signUp = useCallback(async ({ email, password, fullName, role, phone }: { email: string; password: string; fullName: string; role: UserRole; phone: string }) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role, phone } },
      });
      if (error) throw error;
      if (!data.user) throw new Error('Unable to create account.');
      const profile: Profile = { id: data.user.id, email, fullName, phone, role, verified: false };
      setUser(profile);
      return;
    }

    const users = loadMockUsers();
    if (users.some((entry) => entry.email === email)) throw new Error('An account with that email already exists.');
    const record: MockUserRecord = {
      id: `mock-${Date.now()}`,
      email,
      password,
      fullName,
      role,
      phone,
      verified: role === 'seller',
    };
    const nextUsers = [...users, record];
    window.localStorage.setItem(mockUsersKey, JSON.stringify(nextUsers));
    const profile = normalizeProfile(record);
    setUser(profile);
    window.localStorage.setItem(storageKey, JSON.stringify(profile));
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    if (typeof window !== 'undefined') window.localStorage.removeItem(storageKey);
  }, []);

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut }), [user, loading, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
