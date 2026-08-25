export interface ActiveOrderRow {
  orderId: string;
  client: string;
  service: string;
  amount: string;
  provider: string;
  created: string;
  deadline: string;
  status: 'active' | 'review' | 'queued';
}

export interface DashboardUserRow {
  name: string;
  email: string;
  type: 'Client' | 'Provider' | 'Admin' | 'Other';
  joined: string;
  lastActive: string;
  status: 'Active' | 'Inactive';
}

export interface PendingTaskRow {
  task: string;
  client: string;
  category: string;
  provider: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  status: 'Pending' | 'In Progress';
}

export interface ServiceRevenueDetailData {
  key: string;
  name: string;
  totalRevenue: string;
  totalOrders: number;
  completed: number;
  active: number;
  pending: number;
  avgOrderValue: string;
  contributionPercent: number;
  recentOrders: { client: string; amount: string; status: 'Active' | 'Done' }[];
}