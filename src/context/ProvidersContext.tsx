import { createContext, useCallback, useState, type ReactNode } from 'react';
import { ADMIN_PROVIDERS } from '@/constants/mockData';
import type { AdminProvider } from '@/types/domain';

export type ProviderInput = Omit<AdminProvider, 'id' | 'tasks'>;

interface ProvidersContextValue {
  providers: AdminProvider[];
  addProvider: (input: ProviderInput) => void;
  deactivateProvider: (id: string) => void;
}

export const ProvidersContext = createContext<ProvidersContextValue | undefined>(undefined);

function nextProviderId(providers: AdminProvider[]): string {
  const numbers = providers
    .map((p) => parseInt(p.id.replace('YBS-PRV-', ''), 10))
    .filter((n) => !Number.isNaN(n));
  const max = numbers.length > 0 ? Math.max(...numbers) : 20;
  return `YBS-PRV-${String(max + 1).padStart(4, '0')}`;
}

export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<AdminProvider[]>(ADMIN_PROVIDERS);

  const addProvider = useCallback((input: ProviderInput) => {
    setProviders((prev) => [{ ...input, id: nextProviderId(prev), tasks: 0 }, ...prev]);
  }, []);

  const deactivateProvider = useCallback((id: string) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'inactive' } : p)));
  }, []);

  return (
    <ProvidersContext.Provider value={{ providers, addProvider, deactivateProvider }}>
      {children}
    </ProvidersContext.Provider>
  );
}
