import type { RecentInvoice, RecentBill } from '@/types/accounting';

export const RECENT_INVOICES: RecentInvoice[] = [
  { id: 'inv-24', invoiceNo: '#INV-0024', client: 'Rajesh Kumar', amount: '₹11,799', dueDate: 'Mar 20', status: 'due' },
  { id: 'inv-23', invoiceNo: '#INV-0023', client: 'Meera Foods', amount: '₹2,949', dueDate: 'Mar 18', status: 'overdue' },
  { id: 'inv-22', invoiceNo: '#INV-0022', client: 'Brandco LLP', amount: '₹8,249', dueDate: 'Mar 15', status: 'paid' },
  { id: 'inv-21', invoiceNo: '#INV-0021', client: 'Amit Verma', amount: '₹94,399', dueDate: 'Mar 10', status: 'paid' },
];

export const RECENT_BILLS: RecentBill[] = [
  { id: 'bill-14', billNo: '#BILL-014', vendor: 'AWS Cloud', amount: '₹8,200', dueDate: 'Mar 22', status: 'due' },
  { id: 'bill-13', billNo: '#BILL-013', vendor: 'Razorpay', amount: '₹1,450', dueDate: 'Mar 20', status: 'paid' },
  { id: 'bill-12', billNo: '#BILL-012', vendor: 'Office Rent', amount: '₹22,000', dueDate: 'Apr 1', status: 'scheduled' },
];