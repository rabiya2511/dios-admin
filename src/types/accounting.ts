export type PaymentStatus = 'due' | 'overdue' | 'paid' | 'scheduled';

export interface RecentInvoice {
  id: string;
  invoiceNo: string;
  client: string;
  amount: string;
  dueDate: string;
  status: PaymentStatus;
}

export interface RecentBill {
  id: string;
  billNo: string;
  vendor: string;
  amount: string;
  dueDate: string;
  status: PaymentStatus;
}