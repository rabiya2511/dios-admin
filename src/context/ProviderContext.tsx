import { createContext, useContext, useState, type ReactNode } from 'react';
import { PROVIDER_TASKS, PROVIDER_PAYOUTS } from '@/constants/mockData';
import type { ProviderTask, ProviderTaskStatus, ProviderPayout } from '@/types/domain';

interface ProviderContextValue {
  tasks: ProviderTask[];
  payouts: ProviderPayout[];
  acceptTask: (id: string) => void;
  rejectTask: (id: string, reason: string) => void;
  updateTaskProgress: (id: string, progress: number, status: ProviderTaskStatus) => void;
}

const ProviderContext = createContext<ProviderContextValue | undefined>(undefined);

export function ProviderContextProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<ProviderTask[]>(PROVIDER_TASKS);
  const [payouts] = useState<ProviderPayout[]>(PROVIDER_PAYOUTS);

  function acceptTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'in-progress' as ProviderTaskStatus, progress: 0 } : t)),
    );
  }

  function rejectTask(id: string, _reason: string) {
    // Rejected tasks leave the provider's list entirely — they return to the admin queue,
    // which this app doesn't yet model, so we just remove it here.
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTaskProgress(id: string, progress: number, status: ProviderTaskStatus) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const clamped = Math.max(0, Math.min(100, progress));
        if (clamped >= 100) {
          return {
            ...t,
            progress: 100,
            status: 'completed' as ProviderTaskStatus,
            completedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          };
        }
        return { ...t, progress: clamped, status };
      }),
    );
  }

  return (
    <ProviderContext.Provider value={{ tasks, payouts, acceptTask, rejectTask, updateTaskProgress }}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProvider() {
  const ctx = useContext(ProviderContext);
  if (!ctx) throw new Error('useProvider must be used within ProviderContextProvider');
  return ctx;
}