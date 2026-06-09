import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type AuthState = {
  userId: string;
  setUserId: (id: string) => void;
  clearUserId: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

function getUserIdFromToken(token: string): string {
  const payload = token.split('.')[1];
  if (!payload) return '';

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded) as { sub?: unknown };
    return typeof parsed.sub === 'string' ? parsed.sub : '';
  } catch {
    return '';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem('user_id') ?? '';
    if (storedUserId) return storedUserId;
    return getUserIdFromToken(localStorage.getItem('access_token') ?? '');
  });
  const value = useMemo(
    () => ({
      userId,
      setUserId: (id: string) => {
        setUserId(id);
        localStorage.setItem('user_id', id);
      },
      clearUserId: () => {
        setUserId('');
        localStorage.removeItem('user_id');
      },
      isAuthenticated: Boolean(userId),
    }),
    [userId],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not found');
  return ctx;
}
