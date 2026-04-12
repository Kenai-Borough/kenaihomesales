
/* eslint-disable react-refresh/only-export-components */
import { useMemo, type ReactNode } from 'react';
import type { UserRole } from '../types';
import { KenaiAuthProvider, useKenaiAuth } from '../contexts/KenaiAuthContext';

export function AuthProvider(props: { children: ReactNode }) {
  return <KenaiAuthProvider>{props.children}</KenaiAuthProvider>;
}

export function useAuth() {
  const auth = useKenaiAuth();
  return useMemo(function () {
    return {
      user: auth.user
        ? {
            id: auth.user.id,
            email: auth.user.email,
            fullName: auth.user.fullName,
            phone: auth.user.phone || '',
            role: auth.user.currentSiteRole as UserRole,
            verified: auth.user.isVerified,
          }
        : null,
      loading: auth.loading,
      signIn: auth.signIn,
      signUp: function (payload: { email: string; password: string; fullName: string; role: UserRole; phone: string }) {
        return auth.signUp(payload.email, payload.password, payload.fullName, payload.role);
      },
      signOut: auth.signOut,
    };
  }, [auth]);
}
