import { createContext, useCallback, useState, type ReactNode } from 'react';
import { INVOICES } from '@/constants/mockData';
import type { Invoice, InvoiceStatus } from '@/types/domain';

export type InvoiceInput = Omit<Invoice, 'id' | 'invoiceNo'>;

interface InvoicesContextValue {
  invoices: Invoice[];
  addInvoice: (input: InvoiceInput) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
}

export const InvoicesContext = createContext<InvoicesContextValue | undefined>(undefined);

function nextInvoiceNumber(invoices: Invoice[]): string {
  const numbers = invoices
    .map((inv) => parseInt(inv.invoiceNo.replace('#INV-', ''), 10))
    .filter((n) => !Number.isNaN(n));
  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `#INV-${String(max + 1).padStart(4, '0')}`;
}

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);

  const addInvoice = useCallback((input: InvoiceInput) => {
    setInvoices((prev) => {
      const invoiceNo = nextInvoiceNumber(prev);
      const id = `inv${Date.now()}`;
      return [{ ...input, id, invoiceNo }, ...prev];
    });
  }, []);

  const updateInvoiceStatus = useCallback((id: string, status: InvoiceStatus) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
  }, []);

  return (
    <InvoicesContext.Provider value={{ invoices, addInvoice, updateInvoiceStatus }}>
      {children}
    </InvoicesContext.Provider>
  );
}