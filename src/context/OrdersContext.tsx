import { createContext, useContext, useState, type ReactNode } from 'react';
import type { OrderStatus } from '@/types/domain';

interface OrdersContextValue {
  orderStatuses: Record<string, OrderStatus>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  orderProviders: Record<string, string>;
  updateOrderProvider: (id: string, provider: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>({});
  const [orderProviders, setOrderProviders] = useState<Record<string, string>>({});

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrderStatuses((prev) => ({ ...prev, [id]: status }));
  }

  function updateOrderProvider(id: string, provider: string) {
    setOrderProviders((prev) => ({ ...prev, [id]: provider }));
  }

  return (
    <OrdersContext.Provider value={{ orderStatuses, updateOrderStatus, orderProviders, updateOrderProvider }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}