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
  ProviderTask, 
  ProviderPayout,
  ProviderProfile 
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

import type { OrderDetailRecord } from '@/types/domain';

export const ORDER_DETAILS: Record<string, OrderDetailRecord> = {
  o1: { id: 'o1', orderNo: '#SAS-0042', client: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', service: 'Registration', package: 'Growth', amount: '₹11,799', status: 'active', provider: 'Ananya S.', orderDate: 'Mar 8, 2024', dueDate: 'Mar 22, 2024' },
  o2: { id: 'o2', orderNo: '#SAS-0041', client: 'Priya Sharma', email: 'priya.sharma@gmail.com', service: 'Branding', package: 'Standard', amount: '₹8,999', status: 'review', provider: 'Designer V.', orderDate: 'Mar 6, 2024', dueDate: 'Mar 20, 2024' },
  o3: { id: 'o3', orderNo: '#SAS-0039', client: 'Amit Verma', email: 'amit.verma@gmail.com', service: 'Mobile App', package: 'Enterprise', amount: '₹79,999', status: 'done', provider: 'Rajan K.', orderDate: 'Feb 20, 2024', dueDate: 'Mar 15, 2024' },
  o4: { id: 'o4', orderNo: '#SAS-0044', client: 'Neha Gupta', email: 'neha.gupta@gmail.com', service: 'Accounting', package: 'Starter', amount: '₹2,999', status: 'active', provider: 'CA Mehra', orderDate: 'Mar 10, 2024', dueDate: 'Mar 24, 2024' },
  o5: { id: 'o5', orderNo: '#SAS-0043', client: 'Karan Singh', email: 'karan.singh@gmail.com', service: 'ISO Cert', package: 'Standard', amount: '₹18,999', status: 'queued', provider: 'Unassigned', orderDate: 'Mar 9, 2024', dueDate: 'Mar 30, 2024' },
};
export const PROVIDER_CONTACTS: Record<string, { email: string; phone: string }> = {
  'CA Ananya Sharma': { email: 'ananya.sharma@startupsaas.in', phone: '+91 98765 43210' },
  'Dev Rajan Kumar': { email: 'rajan.kumar@startupsaas.in', phone: '+91 98765 43211' },
  'Designer Priya V': { email: 'priya.v@startupsaas.in', phone: '+91 98765 43212' },
  'CA Rohit Mehra': { email: 'rohit.mehra@startupsaas.in', phone: '+91 98765 43213' },
  'Marketer Sana Ali': { email: 'sana.ali@startupsaas.in', phone: '+91 98765 43214' },
};


export const CURRENT_PROVIDER: ProviderProfile = {
  id: 'prv1',
  name: 'Ananya Sharma',
  initials: 'AS',
  role: 'CA · YBS-PRV-0021',
  avatarColor: '#6EA8FE',
};

export const PROVIDER_TASKS: ProviderTask[] = [
  {
    id: 'pt1',
    ref: 'PRV-CA-2026-0051',
    title: 'GST Return Filing — GSTR-3B Feb 2026',
    client: 'Rajesh Kumar / TechVenture',
    category: 'Accounting & GST · Growth',
    brief: 'File GSTR-3B for Feb 2026. Client documents (bank statements, invoices) uploaded. GST portal credentials shared separately.',
    dueDate: 'Mar 18',
    estimatedHours: '~3h',
    payout: 2500,
    status: 'pending-decision',
    progress: 0,
  },
  {
    id: 'pt2',
    ref: 'PRV-CA-2026-0052',
    title: 'TDS Return Q3 FY 2025-26',
    client: 'Neha Gupta / StartupCo',
    category: 'Accounting · Standard',
    brief: 'File Q3 TDS return. All deductee details in the attached Excel sheet.',
    dueDate: 'Mar 31',
    estimatedHours: '~2h',
    payout: 1800,
    status: 'pending-decision',
    progress: 0,
  },
  {
    id: 'pt3',
    ref: 'PRV-CA-2026-0047',
    title: 'Company Registration',
    client: 'Rajesh Kumar',
    category: 'Legal · Growth',
    brief: 'Full incorporation filing — SPICe+, DIN, DSC, MOA/AOA.',
    dueDate: 'Mar 22',
    estimatedHours: '~6h',
    payout: 4500,
    status: 'in-progress',
    progress: 72,
  },
  {
    id: 'pt4',
    ref: 'PRV-CA-2026-0048',
    title: 'GST Registration',
    client: 'Neha Gupta',
    category: 'Accounting & GST · Standard',
    brief: 'New GST registration for StartupCo.',
    dueDate: 'Mar 25',
    estimatedHours: '~2h',
    payout: 2200,
    status: 'in-progress',
    progress: 50,
  },
  {
    id: 'pt5',
    ref: 'PRV-CA-2026-0049',
    title: 'Accounting Setup',
    client: 'Karan Singh',
    category: 'Finance · Starter',
    brief: 'Initial books setup and chart of accounts for KS Traders.',
    dueDate: 'Apr 5',
    estimatedHours: '~5h',
    payout: 3000,
    status: 'docs-awaited',
    progress: 20,
  },
  {
    id: 'pt6',
    ref: 'PRV-CA-2026-0040',
    title: 'GST Return · Rajesh K.',
    client: 'Rajesh Kumar',
    category: 'Accounting & GST',
    brief: 'GST return filed and closed.',
    dueDate: 'Mar 1',
    estimatedHours: '~2h',
    payout: 2500,
    status: 'completed',
    progress: 100,
    completedDate: 'Mar 1',
    rating: 5,
  },
  {
    id: 'pt7',
    ref: 'PRV-CA-2026-0039',
    title: 'Co. Reg. · Meena I.',
    client: 'Meena Iyer',
    category: 'Legal',
    brief: 'Company registration completed.',
    dueDate: 'Feb 28',
    estimatedHours: '~6h',
    payout: 3500,
    status: 'completed',
    progress: 100,
    completedDate: 'Feb 28',
    rating: 4,
  },
  {
    id: 'pt8',
    ref: 'PRV-CA-2026-0038',
    title: 'TDS Return · Suresh P.',
    client: 'Suresh Patil',
    category: 'Accounting',
    brief: 'TDS return filed.',
    dueDate: 'Feb 25',
    estimatedHours: '~2h',
    payout: 1800,
    status: 'completed',
    progress: 100,
    completedDate: 'Feb 25',
    rating: 5,
  },
];

export const PROVIDER_PAYOUTS: ProviderPayout[] = [
  { id: 'pp1', payoutRef: 'YBS-PAY-0021-02-2026', period: 'Feb 2026', taskCount: 8, gross: 16400, tds: 1640, netPaid: 14760, status: 'paid' },
  { id: 'pp2', payoutRef: 'YBS-PAY-0021-01-2026', period: 'Jan 2026', taskCount: 6, gross: 12800, tds: 1280, netPaid: 11520, status: 'paid' },
];

import type { AdminProvider } from '@/types/domain';

export const ADMIN_PROVIDERS: AdminProvider[] = [
  { id: 'YBS-PRV-0021', name: 'Ananya Sharma', initials: 'AS', email: 'ananya.sharma@ybs.in', mobile: '+91 98765 43210', role: 'CA', commissionType: 'percent', commissionValue: 15, tasks: 4, availability: 'available', booksAccess: 'full', status: 'active' },
  { id: 'YBS-PRV-0022', name: 'Rajan Kumar', initials: 'RK', email: 'rajan.kumar@ybs.in', mobile: '+91 98765 43211', role: 'DEV', commissionType: 'fixed', commissionValue: 2000, tasks: 3, availability: 'busy', booksAccess: 'none', status: 'active' },
  { id: 'YBS-PRV-0023', name: 'Priya Vasantha', initials: 'PV', email: 'priya.vasantha@ybs.in', mobile: '+91 98765 43212', role: 'DES', commissionType: 'percent', commissionValue: 12, tasks: 2, availability: 'available', booksAccess: 'scoped', status: 'active' },
  { id: 'YBS-PRV-0024', name: 'Rohit Mehra', initials: 'RM', email: 'rohit.mehra@ybs.in', mobile: '+91 98765 43213', role: 'CA', commissionType: 'percent', commissionValue: 15, tasks: 0, availability: 'on-leave', booksAccess: 'none', status: 'active' },
];

import type { TaskRecord } from '@/types/domain';

export const TASK_RECORDS: TaskRecord[] = [
  // --- Accepted / In Progress (9) ---
  { id: 'tq1', ref: 'PRV-CA-2026-0047', service: 'GST Return Filing', client: 'Rajesh Kumar', provider: 'Ananya S.', acceptStatus: 'accepted', priority: 'High', createdDate: 'Mar 8, 2026', dueDate: 'Mar 22, 2026', estimatedTime: '~3h', description: 'Complete GST return filing and submit required documentation.', progress: 72, category: 'Finance', categoryTone: 'green', notes: 'Client documents received, filing in progress.' },
  { id: 'tq5', ref: 'PRV-CA-2026-0050', service: 'TDS Return Filing', client: 'Neha Gupta', provider: 'Ananya S.', acceptStatus: 'accepted', priority: 'Medium', createdDate: 'Mar 6, 2026', dueDate: 'Mar 31, 2026', estimatedTime: '~2h', description: 'File Q4 TDS return with deductee details.', progress: 40, category: 'Finance', categoryTone: 'green' },
  { id: 'tq6', ref: 'PRV-DEV-2026-0051', service: 'Website Development', client: 'TechNova Pvt', provider: 'Rajan K.', acceptStatus: 'in-progress', priority: 'High', createdDate: 'Mar 2, 2026', dueDate: 'Mar 28, 2026', estimatedTime: '~20h', description: 'Corporate website build — 6 pages, CMS integration.', progress: 55, category: 'Tech', categoryTone: 'blue' },
  { id: 'tq7', ref: 'PRV-DES-2026-0052', service: 'Logo Design', client: 'Karan Singh', provider: 'Priya V.', acceptStatus: 'in-progress', priority: 'Low', createdDate: 'Mar 10, 2026', dueDate: 'Mar 20, 2026', estimatedTime: '~4h', description: 'Primary logo + brand color palette.', progress: 80, category: 'Design', categoryTone: 'orange' },
  { id: 'tq8', ref: 'PRV-CA-2026-0053', service: 'Company Incorporation', client: 'StartupCo', provider: 'CA Mehra', acceptStatus: 'accepted', priority: 'High', createdDate: 'Mar 1, 2026', dueDate: 'Mar 18, 2026', estimatedTime: '~6h', description: 'SPICe+ filing, DIN, DSC, MOA/AOA drafting.', progress: 65, category: 'Legal', categoryTone: 'gray' },
  { id: 'tq9', ref: 'PRV-ISO-2026-0054', service: 'ISO 9001 Certification', client: 'Meera Foods', provider: 'Sana Ali', acceptStatus: 'in-progress', priority: 'Medium', createdDate: 'Feb 26, 2026', dueDate: 'Apr 5, 2026', estimatedTime: '~12h', description: 'Documentation review and audit prep.', progress: 30, category: 'Food & ISO', categoryTone: 'orange' },
  { id: 'tq10', ref: 'PRV-CA-2026-0055', service: 'Monthly Bookkeeping', client: 'TechVenture', provider: 'Ananya S.', acceptStatus: 'accepted', priority: 'Low', createdDate: 'Mar 12, 2026', dueDate: 'Mar 31, 2026', estimatedTime: '~5h', description: 'Reconcile Feb 2026 transactions and close books.', progress: 20, category: 'Finance', categoryTone: 'green' },
  { id: 'tq11', ref: 'PRV-DEV-2026-0056', service: 'Mobile App Dev', client: 'Amit Verma', provider: 'Rajan K.', acceptStatus: 'in-progress', priority: 'High', createdDate: 'Feb 15, 2026', dueDate: 'Apr 10, 2026', estimatedTime: '~60h', description: 'iOS & Android app — MVP build phase 2.', progress: 45, category: 'Tech', categoryTone: 'blue' },
  { id: 'tq12', ref: 'PRV-HR-2026-0057', service: 'Payroll Setup', client: 'StartupCo', provider: 'CA Mehra', acceptStatus: 'accepted', priority: 'Medium', createdDate: 'Mar 14, 2026', dueDate: 'Mar 25, 2026', estimatedTime: '~4h', description: 'PF, ESI registration and salary structure setup.', progress: 10, category: 'Finance', categoryTone: 'green' },

  // --- Pending Accept (4) ---
  { id: 'tq2', ref: 'PRV-DES-2026-0048', service: 'Brand Design', client: 'Priya Sharma', provider: 'Priya V.', acceptStatus: 'pending', priority: 'Medium', createdDate: 'Mar 15, 2026', dueDate: 'Mar 29, 2026', estimatedTime: '~8h', description: 'Full brand identity kit including logo, colors, typography.', progress: 0, category: 'Design', categoryTone: 'orange', notes: 'Awaiting provider acceptance.' },
  { id: 'tq13', ref: 'PRV-CA-2026-0058', service: 'GST Registration', client: 'Karan Singh', provider: 'Ananya S.', acceptStatus: 'pending', priority: 'Medium', createdDate: 'Mar 16, 2026', dueDate: 'Mar 26, 2026', estimatedTime: '~2h', description: 'New GST registration for KS Traders.', progress: 0, category: 'Finance', categoryTone: 'green' },
  { id: 'tq14', ref: 'PRV-MKT-2026-0059', service: 'Social Media Setup', client: 'Meera Foods', provider: 'Sana Ali', acceptStatus: 'pending', priority: 'Low', createdDate: 'Mar 17, 2026', dueDate: 'Mar 27, 2026', estimatedTime: '~3h', description: 'Instagram & Facebook business profile setup.', progress: 0, category: 'Design', categoryTone: 'orange' },
  { id: 'tq15', ref: 'PRV-LEG-2026-0060', service: 'NDA Drafting', client: 'TechNova Pvt', provider: 'CA Mehra', acceptStatus: 'pending', priority: 'High', createdDate: 'Mar 18, 2026', dueDate: 'Mar 21, 2026', estimatedTime: '~1h', description: 'Draft mutual NDA for vendor partnership.', progress: 0, category: 'Legal', categoryTone: 'gray' },

  // --- Rejected (2) ---
  { id: 'tq3', ref: 'PRV-LEG-2026-0049', service: 'Trademark Filing', client: 'Brandco LLP', provider: 'CA Mehra', acceptStatus: 'rejected', priority: 'High', createdDate: 'Mar 9, 2026', dueDate: 'Mar 24, 2026', estimatedTime: '~4h', description: 'File trademark application for Brandco logo mark.', progress: 0, category: 'Legal', categoryTone: 'gray', notes: 'Provider rejected — workload conflict.' },
  { id: 'tq16', ref: 'PRV-DEV-2026-0061', service: 'API Integration', client: 'Amit Verma', provider: 'Rajan K.', acceptStatus: 'rejected', priority: 'Medium', createdDate: 'Mar 11, 2026', dueDate: 'Mar 23, 2026', estimatedTime: '~6h', description: 'Integrate payment gateway API.', progress: 0, category: 'Tech', categoryTone: 'blue', notes: 'Provider rejected — outside scope.' },

  // --- Unassigned (3) ---
  { id: 'tq4', ref: 'Unassigned', service: 'FSSAI Application', client: 'Meera Foods', provider: '—', acceptStatus: 'unassigned', priority: 'Medium', createdDate: 'Mar 19, 2026', dueDate: 'Apr 2, 2026', estimatedTime: '~2h', description: 'Food business registration application under FSSAI.', progress: 0, category: 'Food & ISO', categoryTone: 'orange' },
  { id: 'tq17', ref: 'Unassigned', service: 'Website Dev', client: 'TechNova Pvt', provider: '—', acceptStatus: 'unassigned', priority: 'High', createdDate: 'Mar 20, 2026', dueDate: 'Apr 15, 2026', estimatedTime: '~18h', description: 'Landing page redesign for product launch.', progress: 0, category: 'Tech', categoryTone: 'blue' },
  { id: 'tq18', ref: 'Unassigned', service: 'Trademark Filing', client: 'Brandco LLP', provider: '—', acceptStatus: 'unassigned', priority: 'Low', createdDate: 'Mar 20, 2026', dueDate: 'Apr 10, 2026', estimatedTime: '~4h', description: 'Trademark renewal filing.', progress: 0, category: 'Legal', categoryTone: 'gray' },
];