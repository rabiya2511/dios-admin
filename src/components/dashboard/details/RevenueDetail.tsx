import { Button } from '@/components/common/Button';
import { REVENUE_DETAIL } from '@/constants/dashboardDetailData';

function parseAmount(s: string): number {
  const n = parseFloat(s.replace(/[₹L]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

export function RevenueDetail({ onViewInvoices }: { onViewInvoices: () => void }) {
  const monthlyMax = Math.max(...REVENUE_DETAIL.monthly.map((m) => parseAmount(m.amount)));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Total Revenue</div>
        <div className="mt-1 font-display text-[28px] font-bold leading-none text-text-primary">{REVENUE_DETAIL.total}</div>
        <div className="mt-1 text-[12px] text-success">{REVENUE_DETAIL.growth}</div>
      </div>

      <div>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Breakdown</h4>
        <div className="flex flex-col gap-2">
          {REVENUE_DETAIL.breakdown.map((b) => (
            <div key={b.service} className="flex items-center justify-between text-[12px]">
              <span className="text-text-primary">{b.service}</span>
              <span className="font-semibold text-text-primary">{b.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Revenue by Month</h4>
        <div className="flex flex-col gap-2">
          {REVENUE_DETAIL.monthly.map((m) => (
            <div key={m.month}>
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="text-text-muted">{m.month}</span>
                <span className="font-semibold text-text-primary">{m.amount}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-canvas">
                <div
                  className="h-full rounded-full bg-gold transition-[width] duration-300"
                  style={{ width: `${(parseAmount(m.amount) / monthlyMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-success-bg p-2.5">
          <div className="text-[10px] font-semibold text-success">PAID</div>
          <div className="mt-0.5 text-[15px] font-bold text-success">{REVENUE_DETAIL.paid}</div>
        </div>
        <div className="rounded-lg bg-warning-bg p-2.5">
          <div className="text-[10px] font-semibold text-warning">PENDING</div>
          <div className="mt-0.5 text-[15px] font-bold text-warning">{REVENUE_DETAIL.pending}</div>
        </div>
        <div className="rounded-lg bg-danger-bg p-2.5">
          <div className="text-[10px] font-semibold text-danger">OVERDUE</div>
          <div className="mt-0.5 text-[15px] font-bold text-danger">{REVENUE_DETAIL.overdue}</div>
        </div>
        <div className="rounded-lg bg-info-bg p-2.5">
          <div className="text-[10px] font-semibold text-info">AVG ORDER VALUE</div>
          <div className="mt-0.5 text-[15px] font-bold text-info">{REVENUE_DETAIL.avgOrderValue}</div>
        </div>
      </div>

      <Button variant="primary" size="sm" onClick={onViewInvoices} className="w-full">
        View Invoices
      </Button>
    </div>
  );
}