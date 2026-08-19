import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { ORDER_RECORDS } from '@/constants/mockData';
import { ORDER_STATUS_MAP } from '@/utils/statusMaps';
import type { OrderRecord, OrderStatus } from '@/types/domain';

type StatusFilter = 'all' | OrderStatus;
type ServiceFilter = 'all' | 'Co. Registration' | 'Brand Identity' | 'FSSAI License' | 'Mobile App' | 'Trademark';

const STAT_CARDS = [
  { label: 'Total Orders', value: '127', note: 'All time', tone: 'neutral' as const },
  { label: 'In Progress', value: '47', note: 'Active now', tone: 'up' as const },
  { label: 'Completed', value: '72', note: '↑ 8 this week', tone: 'up' as const },
  { label: 'Rejected Tasks', value: '8', note: 'Needs reassign', tone: 'down' as const },
];

const NOTE_TONE_CLASSES = {
  neutral: 'text-text-primary',
  up: 'text-success',
  down: 'text-danger',
};

function actionForOrder(order: OrderRecord): { label: string; variant: 'secondary' | 'gold' | 'primary' } {
  if (order.status === 'queued') return { label: 'Assign', variant: 'gold' };
  if (order.status === 'rejected') return { label: 'Reassign', variant: 'primary' };
  if (order.status === 'done') return { label: 'View', variant: 'secondary' };
  return { label: 'Manage', variant: 'secondary' };
}

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    return ORDER_RECORDS.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesService = serviceFilter === 'all' || o.service === serviceFilter;
      const matchesSearch =
        o.client.toLowerCase().includes(search.toLowerCase()) ||
        o.orderNo.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesService && matchesSearch;
    });
  }, [statusFilter, serviceFilter, search]);

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Order Management"
          subtitle="View, update and manage all client orders"
        />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_CARDS.map((s) => (
            <Card key={s.label}>
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                {s.label}
              </div>
              <div className="mt-2 font-display text-2xl font-bold text-text-primary">{s.value}</div>
              <div className={['mt-1 text-[11px]', NOTE_TONE_CLASSES[s.tone]].join(' ')}>{s.note}</div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="mb-3.5 flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-[140px] cursor-pointer rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="queued">Queued</option>
              <option value="review">In Review</option>
              <option value="done">Completed</option>
            </select>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value as ServiceFilter)}
              className="w-[140px] cursor-pointer rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            >
              <option value="all">All Services</option>
              <option value="Co. Registration">Co. Registration</option>
              <option value="Brand Identity">Brand Identity</option>
              <option value="FSSAI License">FSSAI License</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Trademark">Trademark</option>
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order or client..."
              className="w-[220px] rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>

          <DataTable<OrderRecord>
            data={filteredOrders}
            rowKey={(o) => o.id}
            emptyMessage="No orders match your filters."
            columns={[
              { header: 'Order ID', render: (o) => o.orderNo },
              { header: 'Client', render: (o) => <span className="font-medium">{o.client}</span> },
              { header: 'Service', render: (o) => o.service },
              { header: 'Package', render: (o) => o.package },
              { header: 'Amount', render: (o) => o.amount },
              {
                header: 'Status',
                render: (o) => {
                  const meta = ORDER_STATUS_MAP[o.status];
                  return <StatusBadge label={meta.label} tone={meta.tone} />;
                },
              },
              {
                header: 'Provider',
                render: (o) => (
                  <span className={o.provider === 'Unassigned' ? 'text-text-muted' : ''}>{o.provider}</span>
                ),
              },
              {
                header: 'Action',
                render: (o) => {
                  const action = actionForOrder(o);
                  return (
                    <Button variant={action.variant} size="sm">
                      {action.label}
                    </Button>
                  );
                },
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}