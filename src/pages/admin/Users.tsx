import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { ADMIN_USERS } from '@/constants/mockData';
import { USER_STATUS_MAP } from '@/utils/statusMaps';
import type { AdminUser } from '@/types/domain';

type FilterValue = 'all' | 'active' | 'inactive';

export default function Users() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('all');

  const filteredUsers = useMemo(() => {
    return ADMIN_USERS.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || u.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div>
      <Topbar
        actions={
          <Button variant="primary" size="sm">
            + Invite User
          </Button>
        }
      />
      <div className="p-5">
        <PageHeader title="Users & Clients" subtitle="Manage all registered users and their accounts" />

        <Card>
          <div className="mb-3.5 flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-[220px] rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterValue)}
              className="w-[150px] cursor-pointer rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <DataTable<AdminUser>
            data={filteredUsers}
            rowKey={(u) => u.id}
            emptyMessage="No users match your search."
            columns={[
              {
                header: 'Name',
                render: (u) => (
                  <div className="flex items-center gap-2">
                    <Avatar initials={u.initials} tone={u.avatarTone} />
                    <span className="font-medium">{u.name}</span>
                  </div>
                ),
              },
              { header: 'Email', render: (u) => u.email },
              {
                header: 'Status',
                render: (u) => {
                  const meta = USER_STATUS_MAP[u.status];
                  return <StatusBadge label={meta.label} tone={meta.tone} />;
                },
              },
              { header: 'Orders', render: (u) => u.orders },
              { header: 'Revenue', render: (u) => u.revenue },
              {
                header: 'Actions',
                render: () => (
                  <div className="flex gap-1.5">
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm">
                      Block
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}