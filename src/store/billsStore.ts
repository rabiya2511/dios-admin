import { useSyncExternalStore } from 'react';
import { BILLS as INITIAL_BILLS } from '@/constants/mockData';
import type { Bill, BillCategory, BillStatus } from '@/types/domain';

let bills: Bill[] = [...INITIAL_BILLS];
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return bills;
}

function nextBillNumber(): string {
  const numbers = bills
    .map((b) => parseInt(b.billNo.replace('#BILL-', ''), 10))
    .filter((n) => !Number.isNaN(n));
  const max = numbers.length ? Math.max(...numbers) : 0;
  return `#BILL-${String(max + 1).padStart(3, '0')}`;
}

export interface NewBillInput {
  vendor: string;
  category: BillCategory;
  amount: number;
  tax: number;
  dueDate: string;
  status: BillStatus;
}

export function addBill(input: NewBillInput): Bill {
  const newBill: Bill = {
    id: `bill-${Date.now()}`,
    billNo: nextBillNumber(),
    vendor: input.vendor,
    category: input.category,
    amount: input.amount,
    tax: input.tax,
    total: input.amount + input.tax,
    dueDate: input.dueDate,
    status: input.status,
  };
  bills = [newBill, ...bills];
  emitChange();
  return newBill;
}

export function updateBillStatus(id: string, status: BillStatus): void {
  bills = bills.map((b) => (b.id === id ? { ...b, status } : b));
  emitChange();
}

export function useBills(): Bill[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}