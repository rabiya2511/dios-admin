import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import type { AdminUser } from '@/types/domain';

interface DeleteUserModalProps {
  user: AdminUser;
  onClose: () => void;
  onConfirm: (userId: string) => void;
}

export function DeleteUserModal({ user, onClose, onConfirm }: DeleteUserModalProps) {
  function handleConfirm() {
    onConfirm(user.id);
    onClose();
  }

  return (
    <Modal title="Delete User" onClose={onClose}>
      <div className="mb-4 rounded-lg border border-danger/20 bg-danger-bg p-3">
        <p className="text-[12px] text-danger">
          This will permanently remove <span className="font-semibold">{user.name}</span> ({user.email}) from the
          platform. This action cannot be undone.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-canvas p-3 text-[11px] text-text-muted">
        <div>Orders: <span className="font-medium text-text-primary">{user.orders}</span></div>
        <div>Revenue: <span className="font-medium text-text-primary">{user.revenue}</span></div>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={handleConfirm} className="flex-1">
          Delete Permanently
        </Button>
      </div>
    </Modal>
  );
}