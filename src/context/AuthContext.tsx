import { createContext, useCallback, useState, type ReactNode } from 'react';
import type { AdminAuthUser, LoginPayload } from '@/types/auth';

// TEMPORARY mock credentials — replace with a real API call once a backend exists.
const MOCK_CREDENTIALS = {
  email: 'admin@ybs.in',
  password: 'Admin@123',
};

const MOCK_USER: AdminAuthUser = {
  name: 'Admin User',
  email: 'admin@ybs.in',
  role: 'Super Admin',
};

interface AuthContextValue {
  user: AdminAuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'ybs-admin-auth';

function getInitialUser(): AdminAuthUser | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? MOCK_USER : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminAuthUser | null>(getInitialUser);

  const login = useCallback(async (payload: LoginPayload) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (payload.email.trim().toLowerCase() !== MOCK_CREDENTIALS.email || payload.password !== MOCK_CREDENTIALS.password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    setUser(MOCK_USER);
    if (payload.rememberMe) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}