import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Users from '@/pages/admin/Users';
import Orders from '@/pages/admin/Orders';
import ServicesPricing from '@/pages/admin/ServicesPricing';
import Providers from '@/pages/admin/Providers';
import TaskQueue from '@/pages/admin/TaskQueue';
import AdminSettings from '@/pages/admin/AdminSettings';
import BooksOverview from '@/pages/books/BooksOverview';
import Invoices from '@/pages/books/Invoices';
import Bills from '@/pages/books/Bills';
import Expenses from '@/pages/books/Expenses';
import Ledger from '@/pages/books/Ledger';
import Reports from '@/pages/books/Reports';
import CreateInvoice from '@/pages/books/CreateInvoice';
import OrderDetail from '@/pages/admin/OrderDetail';
import ProviderDashboard from '@/pages/provider/ProviderDashboard';
import TaskInbox from '@/pages/provider/TaskInbox';
import ActiveTasks from '@/pages/provider/ActiveTasks';
import CompletedTasks from '@/pages/provider/CompletedTasks';
import Earnings from '@/pages/provider/Earnings';
import AdminEarnings from '@/pages/admin/AdminEarnings';
import Login from '@/pages/Login';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin/users', element: <Users /> },
      { path: '/admin/orders', element: <Orders /> },
      { path: '/admin/services', element: <ServicesPricing /> },
      { path: '/admin/providers', element: <Providers /> },
      { path: '/admin/tasks', element: <TaskQueue /> },
      { path: '/admin/settings', element: <AdminSettings /> },
      { path: '/admin/earnings', element: <AdminEarnings /> },
      { path: '/books/overview', element: <BooksOverview /> },
      { path: '/books/invoices', element: <Invoices /> },
      { path: '/books/invoices/new', element: <CreateInvoice /> },
      { path: '/books/bills', element: <Bills /> },
      { path: '/books/expenses', element: <Expenses /> },
      { path: '/books/ledger', element: <Ledger /> },
      { path: '/books/reports', element: <Reports /> },
      { path: '/provider/dashboard', element: <ProviderDashboard /> },
      { path: '/provider/inbox', element: <TaskInbox /> },
      { path: '/provider/active', element: <ActiveTasks /> },
      { path: '/provider/completed', element: <CompletedTasks /> },
      { path: '/provider/earnings', element: <Earnings /> },
      { path: '/admin/orders/:orderId', element: <OrderDetail /> },
      { path: '*', element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },
]);