import { useMemo, useState } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TabRow } from '@/components/common/TabRow';
import { ACTIVE_ORDERS_DETAIL } from '@/constants/dashboardDetailData';
import { ORDER_STATUS_MAP } from '@/utils/statusMaps';
import type { ActiveOrderRow } from '@/types/dashboardDetail';

type Filter = 'all' | 'active' | 'review' | 'queued';
const TABS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'review', label: 'Review' },
  { id: 'queued', label: 'Queued' },
];

export function ActiveOrdersDetail({ onViewAll }: { onViewAll: () => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const d = ACTIVE_ORDERS_DETAIL;

  const filtered = useMemo(
    () => (filter === 'all' ? d.orders : d.orders.filter((o) => o.status === filter)),
    [filter],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Total Active</div>
          <div className="mt-0.5 font-display text-xl font-bold text-text-primary">{d.total}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">New Today</div>
          <div className="mt-0.5 font-display text-xl font-bold text-text-primary">{d.newToday}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">In Progress</div>
          <div className="mt-0.5 font-display text-xl font-bold text-text-primary">{d.inProgress}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Awaiting Review</div>
          <div className="mt-0.5 font-display text-xl font-bold text-text-primary">{d.awaitingReview}</div>
        </div>
      </div>

      <TabRow tabs={TABS} active={filter} onChange={setFilter} />

      <DataTable<ActiveOrderRow>
        data={filtered}
        rowKey={(o) => o.orderId}
        columns={[
          { header: 'Order ID', render: (o) => o.orderId },
          { header: 'Client', render: (o) => o.client },
          { header: 'Service', render: (o) => o.service },
          { header: 'Amount', render: (o) => o.amount },
          { header: 'Provider', render: (o) => o.provider },
          { header: 'Deadline', render: (o) => o.deadline },
          {
            header: 'Status',
            render: (o) => {
              const meta = ORDER_STATUS_MAP[o.status];
              return <StatusBadge label={meta.label} tone={meta.tone} />;
            },
          },
        ]}
      />

      <Button variant="primary" size="sm" onClick={onViewAll} className="w-full">
        View All Orders
      </Button>
    </div>
  );
}