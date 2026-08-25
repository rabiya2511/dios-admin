import { createContext, useCallback, useState, type ReactNode } from 'react';
import { EXPENSES } from '@/constants/mockData';
import type { Expense } from '@/types/domain';

export type ExpenseInput = Omit<Expense, 'id'>;

interface ExpensesContextValue {
  expenses: Expense[];
  addExpense: (input: ExpenseInput) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

export const ExpensesContext = createContext<ExpensesContextValue | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);

  const addExpense = useCallback((input: ExpenseInput) => {
    setExpenses((prev) => {
      const nextNumber = prev.length + 1;
      const id = `EXP-${String(nextNumber).padStart(3, '0')}`;
      return [{ ...input, id }, ...prev];
    });
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
}