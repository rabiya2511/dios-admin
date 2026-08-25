import { useMemo } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useProvider } from '@/context/ProviderContext';
import type { ProviderTask } from '@/types/domain';

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

function RatingDisplay({ rating }: { rating: number | undefined }) {
  if (rating === undefined) {
    return <span className="text-[11px] text-text-muted">Awaiting rating</span>;
  }
  return (
    <span className="text-[12px]">
      {'⭐'.repeat(rating)}
      {'☆'.repeat(5 - rating)} <span className="text-text-muted">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function CompletedTasks() {
  const { tasks } = useProvider();

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === 'completed').sort((a, b) => (b.completedDate ?? '').localeCompare(a.completedDate ?? '')),
    [tasks],
  );

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader title="Completed Tasks" />

        <Card>
          <DataTable<ProviderTask>
            data={completedTasks}
            rowKey={(t) => t.id}
            emptyMessage="No completed tasks yet."
            columns={[
              { header: 'Task Ref', render: (t) => <span className="font-semibold text-gold">{t.ref}</span> },
              { header: 'Service / Client', render: (t) => `${t.title} · ${t.client}` },
              { header: 'Completed', render: (t) => t.completedDate ?? '—' },
              { header: 'Payout', render: (t) => formatINR(t.payout) },
              {
                header: 'Status',
                render: () => <StatusBadge label="Pending Payout" tone="orange" />,
              },
              { header: 'Rating', render: (t) => <RatingDisplay rating={t.rating} /> },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}