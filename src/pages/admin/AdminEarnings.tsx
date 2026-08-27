import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useInvoices } from '@/hooks/useInvoices';
import { PROVIDER_PAYOUTS, ADMIN_PROVIDERS } from '@/constants/mockData';
import type { ProviderPayout } from '@/types/domain';

function fmtINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function AdminEarnings() {
  const { invoices } = useInvoices();

  const grossRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalPayouts = PROVIDER_PAYOUTS.reduce((sum, p) => sum + p.netPaid, 0);
  const totalTds = PROVIDER_PAYOUTS.reduce((sum, p) => sum + p.tds, 0);
  const netEarnings = grossRevenue - totalPayouts - totalTds;
  const marginPercent = grossRevenue > 0 ? Math.round((netEarnings / grossRevenue) * 100) : 0;

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader title="Platform Earnings" subtitle="Revenue collected, provider payouts, and net platform margin" />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Gross Revenue</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">{fmtINR(grossRevenue)}</div>
            <div className="mt-1 text-[11px] text-text-muted">From paid invoices</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Provider Payouts</div>
            <div className="mt-2 font-display text-2xl font-bold text-warning">{fmtINR(totalPayouts)}</div>
            <div className="mt-1 text-[11px] text-text-muted">Net paid to providers</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">TDS Withheld</div>
            <div className="mt-2 font-display text-2xl font-bold text-info">{fmtINR(totalTds)}</div>
            <div className="mt-1 text-[11px] text-text-muted">On provider payments</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Net Platform Earnings</div>
            <div className="mt-2 font-display text-2xl font-bold text-success">{fmtINR(netEarnings)}</div>
            <div className="mt-1 text-[11px] text-success">{marginPercent}% margin</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[2fr_1fr]">
          <Card>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Provider Payout History
            </h3>
            <DataTable<ProviderPayout>
              data={PROVIDER_PAYOUTS}
              rowKey={(p) => p.id}
              columns={[
                { header: 'Payout Ref', render: (p) => <span className="font-mono text-[11px]">{p.payoutRef}</span> },
                { header: 'Period', render: (p) => p.period },
                { header: 'Tasks', render: (p) => p.taskCount },
                { header: 'Gross', render: (p) => fmtINR(p.gross) },
                { header: 'TDS', render: (p) => fmtINR(p.tds) },
                { header: 'Net Paid', render: (p) => <span className="font-semibold">{fmtINR(p.netPaid)}</span> },
                {
                  header: 'Status',
                  render: (p) => (
                    <StatusBadge label={p.status === 'paid' ? 'Paid' : 'Pending'} tone={p.status === 'paid' ? 'green' : 'orange'} />
                  ),
                },
              ]}
            />
          </Card>

          <Card>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Commission by Provider
            </h3>
            <div className="flex flex-col gap-2.5">
              {ADMIN_PROVIDERS.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-[12px]">
                  <div>
                    <div className="font-medium text-text-primary">{p.name}</div>
                    <div className="text-[10px] text-text-muted">{p.role}</div>
                  </div>
                  <span className="font-semibold text-gold">
                    {p.commissionType === 'percent' ? `${p.commissionValue}%` : `₹${p.commissionValue}/task`}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}