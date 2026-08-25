import { useMemo, useState } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FilterChips } from '@/components/dashboard/FilterChips';
import { PENDING_TASKS_DETAIL } from '@/constants/dashboardDetailData';
import type { PendingTaskRow } from '@/types/dashboardDetail';

type Filter = 'all' | 'unassigned' | 'assigned' | 'dueToday' | 'overdue';
const OPTIONS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unassigned', label: 'Unassigned' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'dueToday', label: 'Due Today' },
  { id: 'overdue', label: 'Overdue' },
];

export function PendingTasksDetail({ onViewQueue }: { onViewQueue: () => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const d = PENDING_TASKS_DETAIL;

  const filtered = useMemo(() => {
    if (filter === 'unassigned') return d.tasks.filter((t) => t.provider === 'Unassigned');
    if (filter === 'assigned') return d.tasks.filter((t) => t.provider !== 'Unassigned');
    if (filter === 'dueToday') return d.tasks.filter((t) => t.deadline === 'Today');
    if (filter === 'overdue') return d.tasks.filter((t) => t.deadline === 'Overdue');
    return d.tasks;
  }, [filter]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Total Pending</div>
          <div className="mt-0.5 font-display text-xl font-bold text-text-primary">{d.total}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Unassigned</div>
          <div className="mt-0.5 font-display text-xl font-bold text-warning">{d.unassigned}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Assigned</div>
          <div className="mt-0.5 font-display text-xl font-bold text-success">{d.assigned}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Due Today</div>
          <div className="mt-0.5 font-display text-xl font-bold text-info">{d.dueToday}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Overdue</div>
          <div className="mt-0.5 font-display text-xl font-bold text-danger">{d.overdue}</div>
        </div>
      </div>

      <FilterChips options={OPTIONS} active={filter} onChange={setFilter} />

      <DataTable<PendingTaskRow>
        data={filtered}
        rowKey={(t) => `${t.task}-${t.client}`}
        columns={[
          { header: 'Task', render: (t) => <span className="font-medium text-info">{t.task}</span> },
          { header: 'Client', render: (t) => t.client },
          { header: 'Category', render: (t) => t.category },
          { header: 'Provider', render: (t) => t.provider },
          { header: 'Priority', render: (t) => t.priority },
          { header: 'Deadline', render: (t) => t.deadline },
          {
            header: 'Status',
            render: (t) => <StatusBadge label={t.status} tone={t.status === 'Pending' ? 'orange' : 'blue'} />,
          },
        ]}
      />

      <Button variant="primary" size="sm" onClick={onViewQueue} className="w-full">
        View Task Queue
      </Button>
    </div>
  );
}