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

export type UserStatus = 'active' | 'inactive' | 'blocked';

export interface AdminUser {
  id: string;
  name: string;
  initials: string;
  avatarTone: 'gold' | 'info' | 'warning' | 'success';
  email: string;
  status: UserStatus;
  orders: number;
  revenue: string;
  blockedAt?: string;
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

export interface OrderDetailRecord {
  id: string;
  orderNo: string;
  client: string;
  email: string;
  service: string;
  package: string;
  amount: string;
  status: OrderStatus;
  provider: string;
  orderDate: string;
  dueDate: string;
}
export type ProviderTaskStatus = 'pending-decision' | 'in-progress' | 'docs-awaited' | 'review' | 'blocked' | 'completed';

export interface ProviderTask {
  id: string;
  ref: string;
  title: string;
  client: string;
  category: string;
  brief: string;
  dueDate: string;
  estimatedHours: string;
  payout: number;
  status: ProviderTaskStatus;
  progress: number; // 0-100, only meaningful once accepted
  completedDate?: string;
  rating?: number; // 1-5, set once client rates it
}

export interface ProviderPayout {
  id: string;
  payoutRef: string;
  period: string;
  taskCount: number;
  gross: number;
  tds: number;
  netPaid: number;
  status: 'paid' | 'pending';
}

export interface ProviderProfile {
  id: string;
  name: string;
  initials: string;
  role: string; // e.g. "CA · YBS-PRV-0021"
  avatarColor: string;
}

export type ProviderRole = 'CA' | 'CS' | 'DEV' | 'DES' | 'MKT' | 'HR' | 'FSS' | 'ISO' | 'LEG';
export type CommissionType = 'percent' | 'fixed';
export type BooksAccessLevel = 'full' | 'scoped' | 'none';

export interface AdminProvider {
  id: string;
  name: string;
  initials: string;
  email: string;
  mobile: string;
  role: ProviderRole;
  commissionType: CommissionType;
  commissionValue: number;
  tasks: number;
  availability: ProviderStatus;
  booksAccess: BooksAccessLevel;
  status: 'active' | 'inactive';
}

export type TaskAcceptStatus = 'unassigned' | 'pending' | 'accepted' | 'in-progress' | 'rejected' | 'completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface TaskRecord {
  id: string;
  ref: string; // e.g. 'PRV-CA-2026-0047', or 'Unassigned' when no ref assigned yet
  service: string;
  client: string;
  provider: string; // '—' when unassigned
  acceptStatus: TaskAcceptStatus;
  priority: TaskPriority;
  createdDate: string;
  dueDate: string;
  estimatedTime: string;
  description: string;
  progress: number; // 0-100
  category: string;
  categoryTone: 'blue' | 'orange' | 'green' | 'gray';
  notes?: string;
}