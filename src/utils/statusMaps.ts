import type { OrderStatus, ProviderStatus, UserStatus, InvoiceStatus, BillStatus, ExpenseStatus } from '@/types/domain';
import type { PaymentStatus } from '@/types/accounting';

interface StatusMeta {
  label: string;
  tone: 'green' | 'blue' | 'orange' | 'gray' | 'gold' | 'red';
}

export const ORDER_STATUS_MAP: Record<OrderStatus, StatusMeta> = {
  active: { label: 'Active', tone: 'blue' },
  review: { label: 'Review', tone: 'orange' },
  done: { label: 'Done', tone: 'green' },
  queued: { label: 'Queued', tone: 'gray' },
  rejected: { label: 'Rejected', tone: 'red' },
};

export const PROVIDER_STATUS_MAP: Record<ProviderStatus, StatusMeta> = {
  available: { label: 'Available', tone: 'green' },
  busy: { label: 'Busy', tone: 'orange' },
  'on-leave': { label: 'On Leave', tone: 'blue' },
};

export const USER_STATUS_MAP: Record<UserStatus, StatusMeta> = {
  active: { label: 'Active', tone: 'green' },
  inactive: { label: 'Inactive', tone: 'orange' },
};

export const PAYMENT_STATUS_MAP: Record<PaymentStatus, StatusMeta> = {
  due: { label: 'Due', tone: 'orange' },
  overdue: { label: 'Overdue', tone: 'red' },
  paid: { label: 'Paid', tone: 'green' },
  scheduled: { label: 'Scheduled', tone: 'blue' },
};

export const INVOICE_STATUS_MAP: Record<InvoiceStatus, StatusMeta> = {
  paid: { label: 'Paid', tone: 'green' },
  due: { label: 'Due', tone: 'orange' },
  overdue: { label: 'Overdue', tone: 'red' },
  scheduled: { label: 'Scheduled', tone: 'blue' },
};

export const BILL_STATUS_MAP: Record<BillStatus, StatusMeta> = {
  due: { label: 'Due', tone: 'orange' },
  paid: { label: 'Paid', tone: 'green' },
  scheduled: { label: 'Scheduled', tone: 'blue' },
};

export const EXPENSE_STATUS_MAP: Record<ExpenseStatus, StatusMeta> = {
  approved: { label: 'Approved', tone: 'green' },
  pending: { label: 'Pending', tone: 'orange' },
};