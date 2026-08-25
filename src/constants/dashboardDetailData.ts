import type { ActiveOrderRow, DashboardUserRow, PendingTaskRow, ServiceRevenueDetailData } from '@/types/dashboardDetail';

export const SERVICE_KEY_MAP: Record<string, string> = {
  'Company Registration': 'companyRegistration',
  'Mobile App Dev': 'mobileAppDev',
  'Accounting': 'accounting',
  'Branding': 'branding',
  'ISO Certification': 'isoCertification',
};

export const REVENUE_DETAIL = {
  total: '₹8,40,000',
  growth: '+23% this month',
  breakdown: [
    { service: 'Company Registration', amount: '₹2.1L' },
    { service: 'Mobile App Development', amount: '₹1.8L' },
    { service: 'Accounting', amount: '₹1.2L' },
    { service: 'Branding', amount: '₹0.9L' },
    { service: 'ISO Certification', amount: '₹0.7L' },
    { service: 'Other Services', amount: '₹1.7L' },
  ],
  monthly: [
    { month: 'March', amount: '₹6.2L' },
    { month: 'April', amount: '₹6.8L' },
    { month: 'May', amount: '₹7.1L' },
    { month: 'June', amount: '₹7.5L' },
    { month: 'July', amount: '₹8.0L' },
    { month: 'August', amount: '₹8.4L' },
  ],
  paid: '₹6.9L',
  pending: '₹1.1L',
  overdue: '₹40K',
  avgOrderValue: '₹17,872',
};

export const ACTIVE_ORDERS_DETAIL: {
  total: number; newToday: number; inProgress: number; awaitingReview: number; orders: ActiveOrderRow[];
} = {
  total: 47,
  newToday: 8,
  inProgress: 31,
  awaitingReview: 10,
  orders: [
    { orderId: 'ORD-1047', client: 'Rajesh Kumar', service: 'Company Registration', amount: '₹11,799', provider: 'CA Ananya Sharma', created: 'Today', deadline: 'Mar 22', status: 'active' },
    { orderId: 'ORD-1046', client: 'Priya Sharma', service: 'Branding', amount: '₹8,999', provider: 'Designer Priya V', created: 'Today', deadline: 'Mar 20', status: 'review' },
    { orderId: 'ORD-1045', client: 'Amit Verma', service: 'Mobile App', amount: '₹79,999', provider: 'Dev Rajan Kumar', created: 'Yesterday', deadline: 'Apr 5', status: 'active' },
    { orderId: 'ORD-1044', client: 'Neha Gupta', service: 'Accounting', amount: '₹2,999', provider: 'CA Rohit Mehra', created: 'Yesterday', deadline: 'Mar 24', status: 'active' },
    { orderId: 'ORD-1043', client: 'Karan Singh', service: 'ISO Cert', amount: '₹18,999', provider: 'Unassigned', created: '2 days ago', deadline: 'Mar 30', status: 'queued' },
  ],
};

export const USERS_DETAIL: {
  total: number; newThisWeek: number; active: number; inactive: number;
  growth: { month: string; count: number }[];
  categories: { clients: number; providers: number; admins: number; other: number };
  users: DashboardUserRow[];
} = {
  total: 312,
  newThisWeek: 14,
  active: 284,
  inactive: 28,
  growth: [
    { month: 'May', count: 248 },
    { month: 'June', count: 265 },
    { month: 'July', count: 298 },
    { month: 'August', count: 312 },
  ],
  categories: { clients: 267, providers: 28, admins: 5, other: 12 },
  users: [
    { name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', type: 'Client', joined: 'Mar 8, 2024', lastActive: 'Today', status: 'Active' },
    { name: 'CA Ananya Sharma', email: 'ananya.sharma@startupsaas.in', type: 'Provider', joined: 'Jan 12, 2024', lastActive: 'Today', status: 'Active' },
    { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', type: 'Client', joined: 'Mar 6, 2024', lastActive: 'Yesterday', status: 'Active' },
    { name: 'Admin User', email: 'admin@startupsaas.in', type: 'Admin', joined: 'Jan 1, 2024', lastActive: 'Today', status: 'Active' },
    { name: 'Vikram Rao', email: 'vikram.rao@gmail.com', type: 'Client', joined: 'Feb 2, 2024', lastActive: '2 weeks ago', status: 'Inactive' },
  ],
};

export const PENDING_TASKS_DETAIL: {
  total: number; unassigned: number; assigned: number; dueToday: number; overdue: number; tasks: PendingTaskRow[];
} = {
  total: 18,
  unassigned: 3,
  assigned: 15,
  dueToday: 5,
  overdue: 2,
  tasks: [
    { task: 'FSSAI Application', client: 'Meera Foods', category: 'Food', provider: 'Unassigned', priority: 'High', deadline: 'Today', status: 'Pending' },
    { task: 'Trademark Filing', client: 'Brandco LLP', category: 'Legal', provider: 'CA Ananya Sharma', priority: 'Medium', deadline: 'Tomorrow', status: 'In Progress' },
    { task: 'Website Development', client: 'Amit Verma', category: 'Tech', provider: 'Dev Rajan Kumar', priority: 'High', deadline: 'Today', status: 'Pending' },
  ],
};

export const SERVICE_REVENUE_DETAILS: Record<string, ServiceRevenueDetailData> = {
  companyRegistration: {
    key: 'companyRegistration', name: 'Company Registration', totalRevenue: '₹2.1L',
    totalOrders: 18, completed: 14, active: 3, pending: 1, avgOrderValue: '₹11,667', contributionPercent: 25,
    recentOrders: [
      { client: 'Rajesh Kumar', amount: '₹11,799', status: 'Active' },
      { client: 'Meera Foods', amount: '₹14,999', status: 'Done' },
      { client: 'Karan Singh', amount: '₹9,999', status: 'Active' },
    ],
  },
  mobileAppDev: {
    key: 'mobileAppDev', name: 'Mobile App Development', totalRevenue: '₹1.8L',
    totalOrders: 9, completed: 5, active: 3, pending: 1, avgOrderValue: '₹20,000', contributionPercent: 21,
    recentOrders: [
      { client: 'Amit Verma', amount: '₹79,999', status: 'Active' },
      { client: 'TechNova Pvt', amount: '₹45,000', status: 'Done' },
    ],
  },
  accounting: {
    key: 'accounting', name: 'Accounting', totalRevenue: '₹1.2L',
    totalOrders: 16, completed: 12, active: 3, pending: 1, avgOrderValue: '₹7,500', contributionPercent: 14,
    recentOrders: [
      { client: 'Neha Gupta', amount: '₹2,999', status: 'Active' },
      { client: 'Brandco LLP', amount: '₹8,249', status: 'Done' },
    ],
  },
  branding: {
    key: 'branding', name: 'Branding', totalRevenue: '₹90,000',
    totalOrders: 10, completed: 7, active: 2, pending: 1, avgOrderValue: '₹9,000', contributionPercent: 11,
    recentOrders: [{ client: 'Priya Sharma', amount: '₹8,999', status: 'Active' }],
  },
  isoCertification: {
    key: 'isoCertification', name: 'ISO Certification', totalRevenue: '₹70,000',
    totalOrders: 7, completed: 5, active: 1, pending: 1, avgOrderValue: '₹10,000', contributionPercent: 8,
    recentOrders: [{ client: 'Karan Singh', amount: '₹18,999', status: 'Active' }],
  },
};