import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type AuthState = {
  userId: string;
  setUserId: (id: string) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(localStorage.getItem('user_id') ?? '');
  const value = useMemo(
    () => ({
      userId,
      setUserId: (id: string) => {
        setUserId(id);
        localStorage.setItem('user_id', id);
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
