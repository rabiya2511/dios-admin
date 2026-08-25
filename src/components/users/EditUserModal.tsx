import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useUsers } from '@/hooks/useUsers';
import type { AdminUser } from '@/types/domain';

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function EditUserModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const { updateUser } = useUsers();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  function handleSave() {
    updateUser(user.id, { name, email, initials: deriveInitials(name) });
    onClose();
  }

  return (
    <Modal title={`Edit ${user.name}`} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="primary" size="sm" onClick={handleSave}>
          Save Changes
        </Button>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}