import { useContext } from 'react';
import { InvoicesContext } from '@/context/InvoicesContext';

export function useInvoices() {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
}