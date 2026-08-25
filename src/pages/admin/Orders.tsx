import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { DashboardDetailDrawer } from '@/components/dashboard/DashboardDetailDrawer';
import { AssignProviderModal } from '@/components/orders/AssignProviderModal';
import { ORDER_RECORDS } from '@/constants/mockData';
import { ORDER_STATUS_MAP } from '@/utils/statusMaps';
import { useOrders } from '@/context/OrdersContext';
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{label}</div>
      <div className="mt-1 text-[13px] font-medium text-text-primary">{value}</div>
    </div>
  );
}

function OrderManagementDetail({
  order,
  readOnly,
  liveStatus,
  onSaveStatus,
}: {
  order: OrderRecord;
  readOnly: boolean;
  liveStatus: OrderStatus;
  onSaveStatus: (status: OrderStatus) => void;
}) {
  const [pendingStatus, setPendingStatus] = useState<OrderStatus>(liveStatus);
  const [justSaved, setJustSaved] = useState(false);
  const hasChanges = pendingStatus !== liveStatus;

  function handleSave() {
    onSaveStatus(pendingStatus);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Status</div>
        {readOnly ? (
          <div className="mt-1.5">
            <StatusBadge label={ORDER_STATUS_MAP[liveStatus].label} tone={ORDER_STATUS_MAP[liveStatus].tone} />
          </div>
        ) : (
          <select
            value={pendingStatus}
            onChange={(e) => setPendingStatus(e.target.value as OrderStatus)}
            className="mt-1.5 w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          >
            <option value="active">Active</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
            <option value="queued">Queued</option>
            <option value="rejected">Rejected</option>
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Client" value={order.client} />
        <Field label="Service" value={order.service} />
        <Field label="Package" value={order.package} />
        <Field label="Provider" value={order.provider} />
        <Field label="Amount" value={order.amount} />
      </div>

      {!readOnly && (
        <div className="flex items-center gap-3 border-t border-border-subtle pt-3.5">
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!hasChanges}>
            Save Changes
          </Button>
          {justSaved && <span className="text-[12px] text-success">✓ Saved</span>}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [drawerMode, setDrawerMode] = useState<'manage' | 'view'>('manage');
  const [assignmentOrder, setAssignmentOrder] = useState<OrderRecord | null>(null);
  const [assignmentMode, setAssignmentMode] = useState<'assign' | 'reassign' | null>(null);
  const { orderStatuses, updateOrderStatus, orderProviders, updateOrderProvider } = useOrders();

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

  function handleAssign(order: OrderRecord) {
    setAssignmentOrder(order);
    setAssignmentMode('assign');
  }

  function handleReassign(order: OrderRecord) {
    setAssignmentOrder(order);
    setAssignmentMode('reassign');
  }

  function handleProviderSubmit(provider: string) {
    if (!assignmentOrder) return;
    updateOrderProvider(assignmentOrder.id, provider);
    // Assigning a provider to a queued order moves it into progress,
    // which is what flips its Action button from "Assign" to "Manage".
    if (assignmentMode === 'assign') {
      updateOrderStatus(assignmentOrder.id, 'active');
    }
    setAssignmentOrder(null);
    setAssignmentMode(null);
  }

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader title="Order Management" subtitle="View, update and manage all client orders" />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_CARDS.map((s) => (
            <Card key={s.label}>
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{s.label}</div>
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
                  const currentStatus = orderStatuses[o.id] ?? o.status;
                  const meta = ORDER_STATUS_MAP[currentStatus];
                  return <StatusBadge label={meta.label} tone={meta.tone} />;
                },
              },
              {
                header: 'Provider',
                render: (o) => {
                  const currentProvider = orderProviders[o.id] ?? o.provider;
                  return (
                    <span className={currentProvider === 'Unassigned' ? 'text-text-muted' : ''}>
                      {currentProvider}
                    </span>
                  );
                },
              },
              {
                header: 'Action',
                render: (o) => {
                  const currentStatus = orderStatuses[o.id] ?? o.status;
                  if (currentStatus === 'queued') {
                    return (
                      <Button variant="gold" size="sm" onClick={() => handleAssign(o)}>
                        Assign
                      </Button>
                    );
                  }
                  if (currentStatus === 'rejected') {
                    return (
                      <Button variant="primary" size="sm" onClick={() => handleReassign(o)}>
                        Reassign
                      </Button>
                    );
                  }
                  if (currentStatus === 'done') {
                    return (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(o);
                          setDrawerMode('view');
                        }}
                      >
                        View
                      </Button>
                    );
                  }
                  return (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(o);
                        setDrawerMode('manage');
                      }}
                    >
                      Manage
                    </Button>
                  );
                },
              },
            ]}
          />
        </Card>

        {selectedOrder && (
          <DashboardDetailDrawer
            title="Order Details"
            subtitle={selectedOrder.orderNo}
            onClose={() => setSelectedOrder(null)}
          >
            <OrderManagementDetail
              order={selectedOrder}
              readOnly={drawerMode === 'view'}
              liveStatus={orderStatuses[selectedOrder.id] ?? selectedOrder.status}
              onSaveStatus={(status) => updateOrderStatus(selectedOrder.id, status)}
            />
          </DashboardDetailDrawer>
        )}

        {assignmentOrder && assignmentMode && (
          <AssignProviderModal
            order={assignmentOrder}
            mode={assignmentMode}
            currentProvider={orderProviders[assignmentOrder.id] ?? assignmentOrder.provider}
            onClose={() => {
              setAssignmentOrder(null);
              setAssignmentMode(null);
            }}
            onSubmit={handleProviderSubmit}
          />
        )}
      </div>
    </div>
  );
}