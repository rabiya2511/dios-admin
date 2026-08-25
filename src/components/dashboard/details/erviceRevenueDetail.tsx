import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SERVICE_REVENUE_DETAILS } from '@/constants/dashboardDetailData';

export function ServiceRevenueDetail({ serviceKey, onViewOrders }: { serviceKey: string; onViewOrders: () => void }) {
  const d = SERVICE_REVENUE_DETAILS[serviceKey];
  if (!d) return null;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Total Revenue</div>
        <div className="mt-1 font-display text-[28px] font-bold leading-none text-text-primary">{d.totalRevenue}</div>
        <div className="mt-1 text-[12px] text-text-muted">{d.contributionPercent}% of total revenue</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Total Orders</div>
          <div className="mt-0.5 font-display text-xl font-bold text-text-primary">{d.totalOrders}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Avg Order Value</div>
          <div className="mt-0.5 font-display text-xl font-bold text-text-primary">{d.avgOrderValue}</div>
        </div>
        <div className="rounded-lg bg-success-bg p-2.5">
          <div className="text-[10px] font-semibold text-success">COMPLETED</div>
          <div className="mt-0.5 text-[15px] font-bold text-success">{d.completed}</div>
        </div>
        <div className="rounded-lg bg-info-bg p-2.5">
          <div className="text-[10px] font-semibold text-info">ACTIVE</div>
          <div className="mt-0.5 text-[15px] font-bold text-info">{d.active}</div>
        </div>
        <div className="col-span-2 rounded-lg bg-warning-bg p-2.5">
          <div className="text-[10px] font-semibold text-warning">PENDING</div>
          <div className="mt-0.5 text-[15px] font-bold text-warning">{d.pending}</div>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Recent Orders</h4>
        <div className="flex flex-col gap-2">
          {d.recentOrders.map((o, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border-subtle p-2.5 text-[12px]">
              <span className="font-medium text-text-primary">{o.client}</span>
              <span className="text-text-muted">{o.amount}</span>
              <StatusBadge label={o.status} tone={o.status === 'Done' ? 'green' : 'blue'} />
            </div>
          ))}
        </div>
      </div>

      <Button variant="primary" size="sm" onClick={onViewOrders} className="w-full">
        View Orders
      </Button>
    </div>
  );
}