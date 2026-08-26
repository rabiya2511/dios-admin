import { useSyncExternalStore } from 'react';
import { EXPENSES as INITIAL_EXPENSES } from '@/constants/mockData';
import type { Expense, ExpenseCategory, ExpenseStatus, PaymentMethod } from '@/types/domain';

let expenses: Expense[] = [...INITIAL_EXPENSES];
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return expenses;
}

export interface NewExpenseInput {
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  gstRate: number;
  paidVia: PaymentMethod;
  status: ExpenseStatus;
  reimbursable: boolean;
  taxDeductible: boolean;
  vendor?: string;
  invoiceNumber?: string;
  notes?: string;
}

export function addExpense(input: NewExpenseInput): Expense {
  const gstAmount = Math.round(input.amount * (input.gstRate / 100));
  const newExpense: Expense = {
    id: `exp-${Date.now()}`,
    date: input.date,
    description: input.description,
    category: input.category,
    amount: input.amount,
    gstRate: input.gstRate,
    gstAmount,
    totalAmount: input.amount + gstAmount,
    paidVia: input.paidVia,
    status: input.status,
    reimbursable: input.reimbursable,
    taxDeductible: input.taxDeductible,
    vendor: input.vendor,
    invoiceNumber: input.invoiceNumber,
    notes: input.notes,
  };
  expenses = [newExpense, ...expenses];
  emitChange();
  return newExpense;
}

export function useExpenses(): Expense[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}