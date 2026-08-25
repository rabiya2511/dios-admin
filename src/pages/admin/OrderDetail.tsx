import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ORDER_DETAILS } from '@/constants/mockData';
import { ORDER_STATUS_MAP } from '@/utils/statusMaps';
import { useOrders } from '@/context/OrdersContext';
import type { OrderStatus } from '@/types/domain';

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
  { value: 'queued', label: 'Queued' },
  { value: 'rejected', label: 'Rejected' },
];

const TONE_SELECT_CLASSES: Record<'green' | 'blue' | 'orange' | 'gray' | 'gold' | 'red', string> = {
  green: 'bg-success-bg text-success border-success/20',
  blue: 'bg-info-bg text-info border-info/20',
  orange: 'bg-warning-bg text-warning border-warning/20',
  gray: 'bg-canvas text-text-muted border-border-subtle',
  gold: 'bg-gold-tint text-[#7A5800] border-gold/20',
  red: 'bg-danger-bg text-danger border-danger/20',
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{label}</div>
      <div className="mt-1 text-[13px] font-medium text-text-primary">{value}</div>
    </div>
  );
}

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const order = orderId ? ORDER_DETAILS[orderId] : undefined;
  const { orderStatuses, updateOrderStatus } = useOrders();

  const committedStatus = (orderId && orderStatuses[orderId]) || order?.status || 'active';
  const [pendingStatus, setPendingStatus] = useState<OrderStatus>(committedStatus);
  const [justSaved, setJustSaved] = useState(false);

  if (!order || !orderId) {
    return (
      <div>
        <Topbar />
        <div className="p-5">
          <Card>
            <p className="text-[13px] text-text-muted">Order not found.</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const tone = ORDER_STATUS_MAP[pendingStatus].tone;
  const hasChanges = pendingStatus !== committedStatus;

  function handleSave() {
    updateOrderStatus(orderId!, pendingStatus);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  }

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title={order.orderNo}
          subtitle="Order details"
          action={
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
          <Card>
            <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Order Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Service" value={order.service} />
              <Field label="Package" value={order.package} />
              <Field label="Amount" value={order.amount} />
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Status</div>
                <select
                  value={pendingStatus}
                  onChange={(e) => setPendingStatus(e.target.value as OrderStatus)}
                  className={[
                    'mt-1 cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-semibold outline-none',
                    TONE_SELECT_CLASSES[tone],
                  ].join(' ')}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Order Date" value={order.orderDate} />
              <Field label="Due Date" value={order.dueDate} />
            </div>

            {(hasChanges || justSaved) && (
              <div className="mt-4 flex items-center gap-3 border-t border-border-subtle pt-3.5">
                <Button variant="primary" size="sm" onClick={handleSave} disabled={!hasChanges}>
                  Save Changes
                </Button>
                {justSaved && <span className="text-[12px] text-success">✓ Saved</span>}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Client &amp; Provider
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Client" value={order.client} />
              <Field label="Email" value={order.email} />
              <Field
                label="Assigned Provider"
                value={order.provider === 'Unassigned' ? 'Unassigned' : order.provider}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}