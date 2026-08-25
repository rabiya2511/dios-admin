import { useSyncExternalStore } from 'react';
import { EXPENSES as INITIAL_EXPENSES } from '@/constants/mockData';
import type { Expense, ExpenseCategory, ExpenseStatus } from '@/types/domain';

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
  gst: number;
  paidVia: string;
  status: ExpenseStatus;
}

export function addExpense(input: NewExpenseInput): Expense {
  const newExpense: Expense = {
    id: `exp-${Date.now()}`,
    date: input.date,
    description: input.description,
    category: input.category,
    amount: input.amount,
    gst: input.gst,
    paidVia: input.paidVia,
    status: input.status,
  };
  expenses = [newExpense, ...expenses];
  emitChange();
  return newExpense;
}

export function useExpenses(): Expense[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}