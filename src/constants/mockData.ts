import type {
  AdminService,
  AdminUser,
  Bill,
  Expense,
  Invoice,
  LedgerAccount,
  LedgerTransaction,
  OrderRecord,
  PricingPackage,
  ProviderAvailability,
  RecentOrder,
  ServiceRevenue,
  UnassignedTask,
} from '@/types/domain';

export const RECENT_ORDERS: RecentOrder[] = [
  { id: 'o1', client: 'Rajesh Kumar', service: 'Registration', amount: '₹11,799', status: 'active' },
  { id: 'o2', client: 'Priya Sharma', service: 'Branding', amount: '₹8,999', status: 'review' },
  { id: 'o3', client: 'Amit Verma', service: 'Mobile App', amount: '₹79,999', status: 'done' },
  { id: 'o4', client: 'Neha Gupta', service: 'Accounting', amount: '₹2,999', status: 'active' },
  { id: 'o5', client: 'Karan Singh', service: 'ISO Cert', amount: '₹18,999', status: 'queued' },
];

export const UNASSIGNED_TASKS: UnassignedTask[] = [
  { id: 't1', task: 'FSSAI Application', client: 'Meera Foods', category: 'Food', categoryTone: 'orange' },
  { id: 't2', task: 'Website Dev', client: 'TechNova Pvt', category: 'Tech', categoryTone: 'blue' },
  { id: 't3', task: 'Trademark Filing', client: 'Brandco LLP', category: 'Legal', categoryTone: 'gray' },
];

export const REVENUE_BY_SERVICE: ServiceRevenue[] = [
  { service: 'Company Registration', amount: '₹2.1L', percent: 100 },
  { service: 'Mobile App Dev', amount: '₹1.8L', percent: 86 },
  { service: 'Accounting', amount: '₹1.2L', percent: 57 },
  { service: 'Branding', amount: '₹0.9L', percent: 43 },
  { service: 'ISO Certification', amount: '₹0.7L', percent: 33 },
];

export const PROVIDER_AVAILABILITY: ProviderAvailability[] = [
  { name: 'CA Ananya Sharma', status: 'available' },
  { name: 'Dev Rajan Kumar', status: 'busy', busyCount: 3 },
  { name: 'Designer Priya V', status: 'available' },
  { name: 'CA Rohit Mehra', status: 'on-leave' },
  { name: 'Marketer Sana Ali', status: 'available' },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: 'u1', name: 'Rajesh Kumar', initials: 'RK', avatarTone: 'gold', email: 'rajesh@techventure.in', status: 'active', orders: 5, revenue: '₹84K' },
  { id: 'u2', name: 'Priya Sharma', initials: 'PS', avatarTone: 'info', email: 'priya@gmail.com', status: 'active', orders: 2, revenue: '₹21K' },
  { id: 'u3', name: 'Amit Verma', initials: 'AV', avatarTone: 'warning', email: 'amit@verma.co', status: 'inactive', orders: 1, revenue: '₹80K' },
  { id: 'u4', name: 'Neha Gupta', initials: 'NG', avatarTone: 'success', email: 'neha@startupco.in', status: 'active', orders: 3, revenue: '₹36K' },
];

export const ORDER_RECORDS: OrderRecord[] = [
  { id: 'ord1', orderNo: '#SAS-0042', client: 'Rajesh Kumar', service: 'Co. Registration', package: 'Growth', amount: '₹11,799', status: 'active', provider: 'Ananya S.' },
  { id: 'ord2', orderNo: '#SAS-0041', client: 'Priya Sharma', service: 'Brand Identity', package: 'Standard', amount: '₹8,999', status: 'review', provider: 'Designer V.' },
  { id: 'ord3', orderNo: '#SAS-0040', client: 'Meera Foods', service: 'FSSAI License', package: 'Starter', amount: '₹2,949', status: 'queued', provider: 'Unassigned' },
  { id: 'ord4', orderNo: '#SAS-0039', client: 'Amit Verma', service: 'Mobile App', package: 'Enterprise', amount: '₹94,399', status: 'done', provider: 'Rajan K.' },
  { id: 'ord5', orderNo: '#SAS-0038', client: 'Brandco LLP', service: 'Trademark', package: 'Standard', amount: '₹8,249', status: 'rejected', provider: 'CA Mehra' },
];

export const ADMIN_SERVICES: AdminService[] = [
  { id: 's1', name: 'Company Registration', category: 'Legal', description: 'LLP, Pvt Ltd, OPC incorporation', startingPrice: 4999, icon: '🏢' },
  { id: 's2', name: 'Brand Identity', category: 'Design', description: 'Logo, colors, brand kit', startingPrice: 8999, icon: '🎨' },
  { id: 's3', name: 'Website Design', category: 'Tech', description: 'Corporate & landing pages', startingPrice: 24999, icon: '💻' },
  { id: 's4', name: 'Mobile App Dev', category: 'Tech', description: 'iOS & Android apps', startingPrice: 79999, icon: '📱' },
  { id: 's5', name: 'Accounting & GST', category: 'Finance', description: 'Monthly bookkeeping', startingPrice: 2999, icon: '📊' },
  { id: 's6', name: 'HR & Payroll', category: 'Finance', description: 'PF, ESI, salary mgmt', startingPrice: 3499, icon: '👥' },
  { id: 's7', name: 'FSSAI License', category: 'Food & ISO', description: 'Food biz registration', startingPrice: 2499, icon: '🍽️' },
  { id: 's8', name: 'ISO Certification', category: 'Food & ISO', description: 'ISO 9001, 14001, 27001', startingPrice: 18999, icon: '🏅' },
];

export const PRICING_PACKAGES: PricingPackage[] = [
  { id: 'p1', packageName: 'Starter', serviceName: 'Company Reg.', price: 4999, gstPercent: 18 },
  { id: 'p2', packageName: 'Growth', serviceName: 'Company Reg.', price: 9999, gstPercent: 18 },
  { id: 'p3', packageName: 'Enterprise', serviceName: 'Company Reg.', price: 18999, gstPercent: 18 },
  { id: 'p4', packageName: 'Starter', serviceName: 'Branding', price: 8999, gstPercent: 18 },
];

export const INVOICES: Invoice[] = [
  { id: 'inv1', invoiceNo: '#INV-0024', client: 'Rajesh Kumar', service: 'Co. Registration', amount: 9999, gst: 1800, total: 11799, dueDate: 'Mar 20', status: 'due' },
  { id: 'inv2', invoiceNo: '#INV-0023', client: 'Meera Foods', service: 'FSSAI License', amount: 2499, gst: 450, total: 2949, dueDate: 'Mar 18', status: 'overdue' },
  { id: 'inv3', invoiceNo: '#INV-0022', client: 'Brandco LLP', service: 'Trademark', amount: 6999, gst: 1260, total: 8259, dueDate: 'Mar 15', status: 'paid' },
  { id: 'inv4', invoiceNo: '#INV-0021', client: 'Amit Verma', service: 'Mobile App', amount: 79999, gst: 14400, total: 94399, dueDate: 'Mar 10', status: 'paid' },
  { id: 'inv5', invoiceNo: '#INV-0020', client: 'Neha Gupta', service: 'Accounting', amount: 2999, gst: 540, total: 3539, dueDate: 'Apr 1', status: 'scheduled' },
];

export const BILLS: Bill[] = [
  { id: 'b1', billNo: '#BILL-014', vendor: 'AWS Cloud', category: 'Infrastructure', amount: 6949, tax: 1251, total: 8200, dueDate: 'Mar 22', status: 'due' },
  { id: 'b2', billNo: '#BILL-013', vendor: 'Razorpay', category: 'Payment', amount: 1229, tax: 221, total: 1450, dueDate: 'Mar 20', status: 'paid' },
  { id: 'b3', billNo: '#BILL-012', vendor: 'Office Rent', category: 'Facilities', amount: 18644, tax: 3356, total: 22000, dueDate: 'Apr 1', status: 'scheduled' },
  { id: 'b4', billNo: '#BILL-011', vendor: 'Google Ads', category: 'Marketing', amount: 15000, tax: 2700, total: 17700, dueDate: 'Mar 28', status: 'due' },
  { id: 'b5', billNo: '#BILL-010', vendor: 'Tally Software', category: 'Software', amount: 6780, tax: 1220, total: 8000, dueDate: 'Mar 15', status: 'paid' },
];

export const EXPENSES: Expense[] = [
  { id: 'e1', date: 'Mar 12', description: 'AWS Infrastructure', category: 'Tech', amount: 6949, gst: 1251, paidVia: 'Bank Transfer', status: 'approved' },
  { id: 'e2', date: 'Mar 10', description: 'Google Ads Campaign', category: 'Marketing', amount: 15000, gst: 2700, paidVia: 'Credit Card', status: 'approved' },
  { id: 'e3', date: 'Mar 8', description: 'Office Supplies', category: 'Office', amount: 3200, gst: 576, paidVia: 'Cash', status: 'pending' },
  { id: 'e4', date: 'Mar 5', description: 'Team Lunch Meeting', category: 'Meals', amount: 2800, gst: 504, paidVia: 'UPI', status: 'approved' },
  { id: 'e5', date: 'Mar 1', description: 'Tally Software License', category: 'Software', amount: 6780, gst: 1220, paidVia: 'Bank Transfer', status: 'approved' },
];

export const LEDGER_ACCOUNTS: LedgerAccount[] = [
  { id: 'l1', code: '1001', name: 'Cash & Bank', type: 'Asset', debit: '4,20,000', credit: '1,80,000', balance: 240000, balanceTone: 'success', status: 'Active' },
  { id: 'l2', code: '1100', name: 'Accounts Receivable', type: 'Asset', debit: '84,000', credit: '—', balance: 84000, balanceTone: 'success', status: 'Active' },
  { id: 'l3', code: '2001', name: 'Accounts Payable', type: 'Liability', debit: '—', credit: '31,000', balance: 31000, balanceTone: 'danger', status: 'Active' },
  { id: 'l4', code: '2100', name: 'GST Payable', type: 'Liability', debit: '—', credit: '36,400', balance: 36400, balanceTone: 'danger', status: 'Active' },
  { id: 'l5', code: '4001', name: 'Service Revenue', type: 'Income', debit: '—', credit: '4,20,000', balance: 420000, balanceTone: 'info', status: 'Active' },
  { id: 'l6', code: '5001', name: 'Provider Payouts', type: 'Expense', debit: '1,10,000', credit: '—', balance: 110000, balanceTone: 'warning', status: 'Active' },
  { id: 'l7', code: '5100', name: 'Infrastructure', type: 'Expense', debit: '42,000', credit: '—', balance: 42000, balanceTone: 'warning', status: 'Active' },
  { id: 'l8', code: '5200', name: 'Marketing', type: 'Expense', debit: '28,000', credit: '—', balance: 28000, balanceTone: 'warning', status: 'Active' },
];

export const LEDGER_TRANSACTIONS: Record<string, LedgerTransaction[]> = {
  l1: [
    { date: '01 Mar', reference: 'INV-0021', description: 'Service Revenue receipt', debit: 0, credit: 94399, balance: 94399 },
    { date: '05 Mar', reference: 'EXP-0012', description: 'Software Expense', debit: 12000, credit: 0, balance: 82399 },
    { date: '10 Mar', reference: 'INV-0022', description: 'Service Revenue receipt', debit: 0, credit: 8249, balance: 90648 },
  ],
  l2: [
    { date: '15 Mar', reference: 'INV-0024', description: 'Invoice raised — Rajesh Kumar', debit: 11799, credit: 0, balance: 11799 },
    { date: '20 Mar', reference: 'RCPT-041', description: 'Payment received', debit: 0, credit: 8259, balance: 3540 },
  ],
};