import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useUsers } from '@/hooks/useUsers';
import type { AdminUser } from '@/types/domain';

export function BlockUserModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const { blockUser } = useUsers();

  function handleConfirm() {
    blockUser(user.id);
    onClose();
  }

  return (
    <Modal title="Block User" onClose={onClose}>
      <p className="text-[13px] text-text-primary">
        Are you sure you want to block <strong>{user.name}</strong>? They will lose access to their account until
        unblocked.
      </p>
      <div className="mt-4 flex gap-2">
        <Button variant="danger" size="sm" onClick={handleConfirm}>
          Block User
        </Button>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}