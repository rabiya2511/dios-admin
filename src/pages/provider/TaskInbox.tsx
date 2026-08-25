import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useProvider } from '@/context/ProviderContext';

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

const REJECTION_REASONS = [
  'Capacity full',
  'Outside my expertise',
  'Conflict of interest',
  'Schedule conflict',
  'Other',
];

function InboxTaskCard({
  task,
  onAccept,
  onReject,
}: {
  task: ReturnType<typeof useProvider>['tasks'][number];
  onAccept: () => void;
  onReject: (reason: string) => void;
}) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState(REJECTION_REASONS[0]);

  return (
    <Card className="mb-3">
      <div className="text-[9px] font-bold uppercase tracking-wider text-gold">{task.ref}</div>
      <div className="mt-0.5 text-[13px] font-semibold text-text-primary">{task.title}</div>
      <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-text-muted">
        <span>🏢 {task.client}</span>
        <span>📁 {task.category}</span>
        <span>📅 Due {task.dueDate}</span>
        <span>⏱ {task.estimatedHours}</span>
      </div>
      <p className="mt-2 text-[11px] text-text-muted">{task.brief}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-display text-[14px] font-bold text-text-primary">{formatINR(task.payout)}</span>
        <StatusBadge label="Awaiting Your Decision" tone="gold" />
      </div>

      {!showRejectForm ? (
        <div className="mt-3 flex gap-2">
          <Button variant="success" size="sm" className="flex-1" onClick={onAccept}>
            ✅ Accept Task
          </Button>
          <Button variant="danger" size="sm" className="flex-1" onClick={() => setShowRejectForm(true)}>
            ✗ Reject Task
          </Button>
        </div>
      ) : (
        <div className="mt-3 rounded-lg bg-canvas p-3">
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Reason for rejection</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mb-2 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          >
            {REJECTION_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={() => onReject(reason)}>
              Submit Rejection
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowRejectForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function TaskInbox() {
  const { tasks, acceptTask, rejectTask } = useProvider();

  const inboxTasks = useMemo(() => tasks.filter((t) => t.status === 'pending-decision'), [tasks]);

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader title="Task Inbox" subtitle="New assignments — accept or reject each task" />

        <div className="mb-3 rounded-lg border border-danger/20 bg-danger-bg px-4 py-2.5 text-[11px] text-danger">
          ⚠️ Tasks not actioned within <b>24 hours</b> auto-escalate to admin for reassignment.
        </div>

        {inboxTasks.length === 0 ? (
          <Card>
            <div className="py-8 text-center">
              <div className="mb-2 text-2xl">📭</div>
              <p className="text-[12px] text-text-muted">Inbox zero! No tasks awaiting your decision.</p>
            </div>
          </Card>
        ) : (
          inboxTasks.map((task) => (
            <InboxTaskCard
              key={task.id}
              task={task}
              onAccept={() => acceptTask(task.id)}
              onReject={(reason) => rejectTask(task.id, reason)}
            />
          ))
        )}
      </div>
    </div>
  );
}