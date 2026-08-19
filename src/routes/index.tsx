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

export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin/users', element: <Users /> },
      { path: '/admin/orders', element: <Orders /> },
      { path: '/admin/services', element: <ServicesPricing /> },
      { path: '/admin/providers', element: <Providers /> },
      { path: '/admin/tasks', element: <TaskQueue /> },
      { path: '/admin/settings', element: <AdminSettings /> },
      { path: '/books/overview', element: <BooksOverview /> },
      { path: '/books/invoices', element: <Invoices /> },
      { path: '/books/invoices/new', element: <CreateInvoice /> },
      { path: '/books/bills', element: <Bills /> },
      { path: '/books/expenses', element: <Expenses /> },
      { path: '/books/ledger', element: <Ledger /> },
      { path: '/books/reports', element: <Reports /> },
      { path: '*', element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },
]);