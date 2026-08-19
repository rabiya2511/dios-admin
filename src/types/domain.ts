export type OrderStatus = 'active' | 'review' | 'done' | 'queued' | 'rejected';

export interface RecentOrder {
  id: string;
  client: string;
  service: string;
  amount: string;
  status: OrderStatus;
}

export interface UnassignedTask {
  id: string;
  task: string;
  client: string;
  category: string;
  categoryTone: 'blue' | 'orange' | 'green' | 'gray';
}

export interface ServiceRevenue {
  service: string;
  amount: string;
  percent: number;
}

export type ProviderStatus = 'available' | 'busy' | 'on-leave';

export interface ProviderAvailability {
  name: string;
  status: ProviderStatus;
  busyCount?: number;
}

export type UserStatus = 'active' | 'inactive';

export interface AdminUser {
  id: string;
  name: string;
  initials: string;
  avatarTone: 'gold' | 'info' | 'warning' | 'success';
  email: string;
  status: UserStatus;
  orders: number;
  revenue: string;
}

export interface OrderRecord {
  id: string;
  orderNo: string;
  client: string;
  service: string;
  package: string;
  amount: string;
  status: OrderStatus;
  provider: string;
}

export type ServiceCategory = 'Legal' | 'Design' | 'Tech' | 'Finance' | 'Food & ISO';

export interface AdminService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  startingPrice: number;
  icon: string;
}
export interface PricingPackage {
  id: string;
  packageName: string;
  serviceName: string;
  price: number;
  gstPercent: number;
}

export type InvoiceStatus = 'paid' | 'due' | 'overdue' | 'scheduled';

export interface Invoice {
  id: string;
  invoiceNo: string;
  client: string;
  service: string;
  amount: number;
  gst: number;
  total: number;
  dueDate: string;
  status: InvoiceStatus;
}

export type BillStatus = 'due' | 'paid' | 'scheduled';
export type BillCategory = 'Infrastructure' | 'Payment' | 'Facilities' | 'Marketing' | 'Software';

export interface Bill {
  id: string;
  billNo: string;
  vendor: string;
  category: BillCategory;
  amount: number;
  tax: number;
  total: number;
  dueDate: string;
  status: BillStatus;
}

export type ExpenseStatus = 'approved' | 'pending';
export type ExpenseCategory = 'Tech' | 'Marketing' | 'Office' | 'Meals' | 'Software';

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  gst: number;
  paidVia: string;
  status: ExpenseStatus;
}

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parent?: string;
  debit: string;
  credit: string;
  balance: number;
  balanceTone: 'success' | 'danger' | 'info' | 'warning';
  status: 'Active' | 'Inactive';
}

export interface LedgerTransaction {
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}