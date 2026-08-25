import { useMemo, useState } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FilterChips } from '@/components/dashboard/FilterChips';
import { USERS_DETAIL } from '@/constants/dashboardDetailData';
import type { DashboardUserRow } from '@/types/dashboardDetail';

type Filter = 'all' | 'Client' | 'Provider' | 'Admin' | 'Active' | 'Inactive';
const OPTIONS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Client', label: 'Clients' },
  { id: 'Provider', label: 'Providers' },
  { id: 'Admin', label: 'Admins' },
  { id: 'Active', label: 'Active' },
  { id: 'Inactive', label: 'Inactive' },
];

export function UsersDetail({ onViewAll }: { onViewAll: () => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const d = USERS_DETAIL;
  const growthMax = Math.max(...d.growth.map((g) => g.count));

  const filtered = useMemo(() => {
    if (filter === 'all') return d.users;
    if (filter === 'Active' || filter === 'Inactive') return d.users.filter((u) => u.status === filter);
    return d.users.filter((u) => u.type === filter);
  }, [filter]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Total Users</div>
          <div className="mt-0.5 font-display text-xl font-bold text-text-primary">{d.total}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">New This Week</div>
          <div className="mt-0.5 font-display text-xl font-bold text-text-primary">{d.newThisWeek}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Active</div>
          <div className="mt-0.5 font-display text-xl font-bold text-success">{d.active}</div>
        </div>
        <div className="rounded-lg border border-border-subtle p-2.5">
          <div className="text-[10px] font-medium uppercase text-text-muted">Inactive</div>
          <div className="mt-0.5 font-display text-xl font-bold text-warning">{d.inactive}</div>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">User Growth</h4>
        <div className="flex flex-col gap-2">
          {d.growth.map((g) => (
            <div key={g.month}>
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="text-text-muted">{g.month}</span>
                <span className="font-semibold text-text-primary">{g.count}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-canvas">
                <div
                  className="h-full rounded-full bg-info transition-[width] duration-300"
                  style={{ width: `${(g.count / growthMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="rounded-lg bg-canvas p-2">
          <div className="text-[15px] font-bold text-text-primary">{d.categories.clients}</div>
          <div className="text-[9px] uppercase text-text-muted">Clients</div>
        </div>
        <div className="rounded-lg bg-canvas p-2">
          <div className="text-[15px] font-bold text-text-primary">{d.categories.providers}</div>
          <div className="text-[9px] uppercase text-text-muted">Providers</div>
        </div>
        <div className="rounded-lg bg-canvas p-2">
          <div className="text-[15px] font-bold text-text-primary">{d.categories.admins}</div>
          <div className="text-[9px] uppercase text-text-muted">Admins</div>
        </div>
        <div className="rounded-lg bg-canvas p-2">
          <div className="text-[15px] font-bold text-text-primary">{d.categories.other}</div>
          <div className="text-[9px] uppercase text-text-muted">Other</div>
        </div>
      </div>

      <FilterChips options={OPTIONS} active={filter} onChange={setFilter} />

      <DataTable<DashboardUserRow>
        data={filtered}
        rowKey={(u) => u.email}
        columns={[
          { header: 'Name', render: (u) => u.name },
          { header: 'Email', render: (u) => u.email },
          { header: 'Type', render: (u) => u.type },
          { header: 'Joined', render: (u) => u.joined },
          { header: 'Last Active', render: (u) => u.lastActive },
          {
            header: 'Status',
            render: (u) => <StatusBadge label={u.status} tone={u.status === 'Active' ? 'green' : 'orange'} />,
          },
        ]}
      />

      <Button variant="primary" size="sm" onClick={onViewAll} className="w-full">
        View All Users
      </Button>
    </div>
  );
}