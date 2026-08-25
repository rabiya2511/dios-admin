import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Zap,
  Handshake,
  ListTodo,
  Settings,
  Receipt,
  FileText,
  Wallet,
  BookOpen,
  BarChart3,
  Plus,
  Inbox,
  PlayCircle,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react';
import type { NavSection } from '@/types/navigation';

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'admin',
    label: 'Admin',
    mode: 'admin',
    items: [
      { id: 'a-dash', label: 'Dashboard', pageTitle: 'Admin Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, mode: 'admin' },
      { id: 'a-users', label: 'Users & Clients', to: '/admin/users', icon: Users, mode: 'admin' },
      { id: 'a-orders', label: 'Orders', pageTitle: 'Order Management', to: '/admin/orders', icon: ClipboardList, badge: 5, mode: 'admin' },
      { id: 'a-services', label: 'Services & Pricing', pageTitle: 'Service & Pricing Editor', to: '/admin/services', icon: Zap, mode: 'admin' },
      { id: 'a-providers', label: 'Provider Onboarding  ', pageTitle: 'Service Providers', to: '/admin/providers', icon: Handshake, mode: 'admin' },
      { id: 'a-tasks', label: 'Task Queue', to: '/admin/tasks', icon: ListTodo, badge: 3, mode: 'admin' },
      { id: 'a-settings', label: 'Platform Settings', pageTitle: 'Platform Settings', to: '/admin/settings', icon: Settings, mode: 'admin' },
    ],
  },
  {
    id: 'books',
    label: 'Books & Accounting',
    mode: 'books',
    items: [
      { id: 'b-dash', label: 'Overview', pageTitle: 'Accounting Overview', to: '/books/overview', icon: LayoutDashboard, mode: 'books' },
      { id: 'b-invoices', label: 'Invoices', to: '/books/invoices', icon: Receipt, mode: 'books' },
      { id: 'b-bills', label: 'Bills & Payments', to: '/books/bills', icon: FileText, mode: 'books' },
      { id: 'b-expenses', label: 'Expenses', to: '/books/expenses', icon: Wallet, mode: 'books' },
      { id: 'b-ledger', label: 'Chart of Accounts', to: '/books/ledger', icon: BookOpen, mode: 'books' },
      { id: 'b-reports', label: 'Reports', pageTitle: 'Financial Reports', to: '/books/reports', icon: BarChart3, mode: 'books' },
      { id: 'b-create-inv', label: 'New Invoice', pageTitle: 'Create Invoice', to: '/books/invoices/new', icon: Plus, mode: 'books' },
    ],
  },
  {
    id: 'provider',
    label: 'Provider Portal',
    mode: 'provider',
    items: [
      { id: 'p-dash', label: 'My Dashboard', pageTitle: 'Provider Dashboard', to: '/provider/dashboard', icon: LayoutDashboard, mode: 'provider' },
      { id: 'p-inbox', label: 'Task Inbox', pageTitle: 'Task Inbox', to: '/provider/inbox', icon: Inbox, mode: 'provider' },
      { id: 'p-active', label: 'Active Tasks', pageTitle: 'My Active Tasks', to: '/provider/active', icon: PlayCircle, mode: 'provider' },
      { id: 'p-completed', label: 'Completed Tasks', pageTitle: 'Completed Tasks', to: '/provider/completed', icon: CheckCircle2, mode: 'provider' },
      { id: 'p-earnings', label: 'Earnings & Payouts', pageTitle: 'Earnings & Payouts', to: '/provider/earnings', icon: IndianRupee, mode: 'provider' },
    ],
  },
];