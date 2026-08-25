import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { OrdersProvider } from '@/context/OrdersContext';
import { TasksProvider } from '@/context/TasksContext';
import { UsersProvider } from '@/context/UsersContext';
import { ExpensesProvider } from '@/context/ExpensesContext';
import { InvoicesProvider } from '@/context/InvoicesContext';
import { ProvidersProvider } from '@/context/ProvidersContext';
import { ProviderContextProvider } from '@/context/ProviderContext';
import { router } from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <OrdersProvider>
          <TasksProvider>
            <UsersProvider>
              <ExpensesProvider>
                <InvoicesProvider>
                  <ProvidersProvider>
                    <ProviderContextProvider>
                      <RouterProvider router={router} />
                    </ProviderContextProvider>
                  </ProvidersProvider>
                </InvoicesProvider>
              </ExpensesProvider>
            </UsersProvider>
          </TasksProvider>
        </OrdersProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}