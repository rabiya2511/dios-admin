import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { EditUserModal } from '@/components/users/EditUserModal';
import { BlockUserModal } from '@/components/users/BlockUserModal';
import { DeleteUserModal } from '@/components/users/DeleteUserModal';
import { InviteUserModal } from '@/components/users/InviteUserModal';
import { useUsers } from '@/hooks/useUsers';
import { USER_STATUS_MAP } from '@/utils/statusMaps';
import type { AdminUser } from '@/types/domain';

type FilterValue = 'all' | 'active' | 'inactive' | 'blocked';

export default function Users() {
  const { users, unblockUser, deleteUser, inviteUser } = useUsers();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('all');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [blockingUser, setBlockingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || u.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  function handleDeleteConfirm(userId: string) {
    const user = users.find((u) => u.id === userId);
    deleteUser(userId);
    setToastMessage(`${user?.name ?? 'User'} has been deleted.`);
  }

  function handleInvite(input: Parameters<typeof inviteUser>[0]) {
    inviteUser(input);
    setShowInviteUser(false);
    setToastMessage(`${input.name} has been invited.`);
  }

  return (
    <div>
      <Topbar
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowInviteUser(true)}>
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
              <option value="blocked">Blocked</option>
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
                render: (u) => (
                  <div className="flex gap-1.5">
                    <Button variant="secondary" size="sm" onClick={() => setEditingUser(u)}>
                      Edit
                    </Button>
                    {u.status === 'blocked' ? (
                      <Button variant="success" size="sm" onClick={() => unblockUser(u.id)}>
                        Unblock
                      </Button>
                    ) : (
                      <Button variant="danger" size="sm" onClick={() => setBlockingUser(u)}>
                        Block
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeletingUser(u)}
                      aria-label={`Delete ${u.name}`}
                    >
                      🗑
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>

      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />}
      {blockingUser && <BlockUserModal user={blockingUser} onClose={() => setBlockingUser(null)} />}
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {showInviteUser && (
        <InviteUserModal onClose={() => setShowInviteUser(false)} onInvite={handleInvite} />
      )}
      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
    </div>
  );
}  