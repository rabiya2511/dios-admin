import { createContext, useCallback, useState, type ReactNode } from 'react';
import { ADMIN_USERS } from '@/constants/mockData';
import type { AdminUser } from '@/types/domain';

export type NewUserInput = Omit<AdminUser, 'id' | 'initials' | 'avatarTone' | 'status' | 'orders' | 'revenue' | 'blockedAt'>;

interface UsersContextValue {
  users: AdminUser[];
  updateUser: (userId: string, updates: Partial<AdminUser>) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  inviteUser: (input: NewUserInput) => void;
}

export const UsersContext = createContext<UsersContextValue | undefined>(undefined);

function todayLabel(): string {
  return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const AVATAR_TONES: AdminUser['avatarTone'][] = ['gold', 'info', 'warning', 'success'];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || '??';
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

  const deleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  const inviteUser = useCallback((input: NewUserInput) => {
    const newUser: AdminUser = {
      ...input,
      id: `u${Date.now()}`,
      initials: initialsFromName(input.name),
      avatarTone: AVATAR_TONES[Math.floor(Math.random() * AVATAR_TONES.length)],
      status: 'active',
      orders: 0,
      revenue: '₹0',
    };
    setUsers((prev) => [newUser, ...prev]);
  }, []);

  return (
    <UsersContext.Provider value={{ users, updateUser, blockUser, unblockUser, deleteUser, inviteUser }}>
      {children}
    </UsersContext.Provider>
  );
}