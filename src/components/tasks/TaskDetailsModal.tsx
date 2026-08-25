import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TASK_STATUS_MAP, TASK_PRIORITY_MAP } from '@/utils/statusMaps';
import type { TaskRecord, TaskAcceptStatus } from '@/types/domain';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{label}</div>
      <div className="mt-1 text-[13px] font-medium text-text-primary">{value}</div>
    </div>
  );
}

interface TaskDetailsModalProps {
  task: TaskRecord;
  liveStatus: TaskAcceptStatus;
  liveProvider: string;
  liveRef: string;
  onClose: () => void;
  onReassign: () => void;
  onAssign: () => void;
}

export function TaskDetailsModal({
  task,
  liveStatus,
  liveProvider,
  liveRef,
  onClose,
  onReassign,
  onAssign,
}: TaskDetailsModalProps) {
  const statusMeta = TASK_STATUS_MAP[liveStatus];
  const priorityMeta = TASK_PRIORITY_MAP[task.priority];

  return (
    <Modal title="Task Details" onClose={onClose}>
      <div className="mb-4">
        <div className="text-[11px] font-semibold text-gold">{liveRef}</div>
        <div className="mt-0.5 text-[15px] font-bold text-text-primary">{task.service}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-4">
        <Field label="Client" value={task.client} />
        <Field label="Provider" value={liveProvider} />
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Status</div>
          <div className="mt-1.5">
            <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Priority</div>
          <div className="mt-1.5">
            <StatusBadge label={priorityMeta.label} tone={priorityMeta.tone} />
          </div>
        </div>
        <Field label="Created Date" value={task.createdDate} />
        <Field label="Due Date" value={task.dueDate} />
        <Field label="Estimated Time" value={task.estimatedTime} />
        {liveStatus === 'accepted' || liveStatus === 'in-progress' ? (
          <Field label="Progress" value={`${task.progress}%`} />
        ) : null}
      </div>

      <div className="mt-4 border-t border-border-subtle pt-4">
        <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Description</div>
        <p className="mt-1 text-[12px] leading-relaxed text-text-primary">{task.description}</p>
      </div>

      {task.notes && (
        <div className="mt-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Notes</div>
          <p className="mt-1 text-[12px] leading-relaxed text-text-primary">{task.notes}</p>
        </div>
      )}

      <div className="mt-5 flex gap-2 border-t border-border-subtle pt-4">
        {liveStatus === 'unassigned' ? (
          <Button variant="gold" size="sm" onClick={onAssign} className="flex-1">
            Assign Provider
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={onReassign} className="flex-1">
            Reassign
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">
          Close
        </Button>
      </div>
    </Modal>
  );
}       