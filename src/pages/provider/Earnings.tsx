import { useMemo } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useProvider } from '@/context/ProviderContext';
import type { ProviderPayout } from '@/types/domain';

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

const MONTH_ABBR = new Date().toLocaleString('en-US', { month: 'short' });

function isThisMonth(dateStr: string | undefined): boolean {
  return !!dateStr && dateStr.trim().startsWith(MONTH_ABBR);
}

export default function Earnings() {
  const { tasks, payouts } = useProvider();

  const completedTasks = useMemo(() => tasks.filter((t) => t.status === 'completed'), [tasks]);

  // "Total Earned" = historical paid payouts (net) + any completed-but-unpaid tasks' gross payout,
  // since those haven't been through a payout batch yet.
  const paidTotal = useMemo(() => payouts.reduce((sum, p) => sum + p.netPaid, 0), [payouts]);
  const pendingPayout = useMemo(() => completedTasks.reduce((sum, t) => sum + t.payout, 0), [completedTasks]);
  const totalEarned = paidTotal + pendingPayout;

  const thisMonthEarned = useMemo(
    () => completedTasks.filter((t) => isThisMonth(t.completedDate)).reduce((sum, t) => sum + t.payout, 0),
    [completedTasks],
  );

  const tasksCompletedAllTime = payouts.reduce((sum, p) => sum + p.taskCount, 0) + completedTasks.length;

  const tds = Math.round(pendingPayout * 0.1);
  const netPending = pendingPayout - tds;

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader title="Earnings & Payouts" />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Total Earned</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">{formatINR(totalEarned)}</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">This Month</div>
            <div className="mt-2 font-display text-2xl font-bold text-success">{formatINR(thisMonthEarned)}</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Pending Payout</div>
            <div className="mt-2 font-display text-2xl font-bold text-warning">{formatINR(pendingPayout)}</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Tasks Completed</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">{tasksCompletedAllTime}</div>
          </Card>
        </div>

        <Card>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Payout History
          </div>
          <DataTable<ProviderPayout>
            data={payouts}
            rowKey={(p) => p.id}
            emptyMessage="No payouts yet."
            columns={[
              { header: 'Payout Ref', render: (p) => <span className="font-semibold text-gold">{p.payoutRef}</span> },
              { header: 'Period', render: (p) => p.period },
              { header: 'Tasks', render: (p) => p.taskCount },
              { header: 'Gross', render: (p) => formatINR(p.gross) },
              { header: 'TDS', render: (p) => formatINR(p.tds) },
              { header: 'Net Paid', render: (p) => <span className="font-semibold text-success">{formatINR(p.netPaid)}</span> },
              { header: 'Status', render: () => <StatusBadge label="Paid" tone="green" /> },
            ]}
          />
          {pendingPayout > 0 && (
            <div className="mt-2 flex items-center justify-between rounded-lg border border-border-subtle bg-canvas px-3 py-2.5 text-[11px]">
              <span className="text-text-muted">
                Pending · {completedTasks.length} task{completedTasks.length === 1 ? '' : 's'} · Gross{' '}
                {formatINR(pendingPayout)} · TDS {formatINR(tds)}
              </span>
              <span className="font-semibold text-text-primary">Net {formatINR(netPending)}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}