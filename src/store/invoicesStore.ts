import { useSyncExternalStore } from 'react';
import { INVOICES as INITIAL_INVOICES } from '@/constants/mockData';
import type { Invoice, InvoiceStatus } from '@/types/domain';

let invoices: Invoice[] = [...INITIAL_INVOICES];
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return invoices;
}

function nextInvoiceNumber(): string {
  const numbers = invoices
    .map((inv) => parseInt(inv.invoiceNo.replace('#INV-', ''), 10))
    .filter((n) => !Number.isNaN(n));
  const max = numbers.length ? Math.max(...numbers) : 0;
  return `#INV-${String(max + 1).padStart(4, '0')}`;
}

export interface NewInvoiceInput {
  client: string;
  service: string;
  amount: number;
  gst: number;
  dueDate: string;
  status: InvoiceStatus;
}

export function addInvoice(input: NewInvoiceInput): Invoice {
  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNo: nextInvoiceNumber(),
    client: input.client,
    service: input.service,
    amount: input.amount,
    gst: input.gst,
    total: input.amount + input.gst,
    dueDate: input.dueDate,
    status: input.status,
  };
  invoices = [newInvoice, ...invoices];
  emitChange();
  return newInvoice;
}

export function useInvoices(): Invoice[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}