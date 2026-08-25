import { createContext, useCallback, useState, type ReactNode } from 'react';
import { ADMIN_USERS } from '@/constants/mockData';
import type { AdminUser } from '@/types/domain';

interface UsersContextValue {
  users: AdminUser[];
  updateUser: (userId: string, updates: Partial<AdminUser>) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
}

export const UsersContext = createContext<UsersContextValue | undefined>(undefined);

function todayLabel(): string {
  return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);

  const updateUser = useCallback((userId: string, updates: Partial<AdminUser>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
  }, []);

  const blockUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'blocked', blockedAt: todayLabel() } : u)),
    );
  }, []);

  const unblockUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'active', blockedAt: undefined } : u)),
    );
  }, []);

  return (
    <UsersContext.Provider value={{ users, updateUser, blockUser, unblockUser }}>
      {children}
    </UsersContext.Provider>
  );
}