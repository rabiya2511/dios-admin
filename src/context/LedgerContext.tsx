import { createContext, useCallback, useState, type ReactNode } from 'react';
import { LEDGER_ACCOUNTS } from '@/constants/mockData';
import type { AccountType, LedgerAccount } from '@/types/domain';

export type LedgerAccountInput = Omit<LedgerAccount, 'id' | 'balance' | 'balanceTone' | 'debit' | 'credit'> & {
  openingDebit: number;
  openingCredit: number;
};

const TONE_BY_TYPE: Record<AccountType, LedgerAccount['balanceTone']> = {
  Asset: 'success',
  Liability: 'danger',
  Equity: 'info',
  Income: 'info',
  Expense: 'warning',
};

function fmtINR(n: number): string {
  return n > 0 ? n.toLocaleString('en-IN') : '—';
}

interface LedgerContextValue {
  accounts: LedgerAccount[];
  addAccount: (input: LedgerAccountInput) => void;
}

export const LedgerContext = createContext<LedgerContextValue | undefined>(undefined);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<LedgerAccount[]>(LEDGER_ACCOUNTS);

  const addAccount = useCallback((input: LedgerAccountInput) => {
    const balance = Math.abs(input.openingDebit - input.openingCredit);
    setAccounts((prev) => [
      ...prev,
      {
        id: `l${Date.now()}`,
        code: input.code,
        name: input.name,
        type: input.type,
        parent: input.parent,
        debit: fmtINR(input.openingDebit),
        credit: fmtINR(input.openingCredit),
        balance,
        balanceTone: TONE_BY_TYPE[input.type],
        status: input.status,
      },
    ]);
  }, []);

  return <LedgerContext.Provider value={{ accounts, addAccount }}>{children}</LedgerContext.Provider>;
}