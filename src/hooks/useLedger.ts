import { useContext } from 'react';
import { LedgerContext } from '@/context/LedgerContext';

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) throw new Error('useLedger must be used within a LedgerProvider');
  return context;
}