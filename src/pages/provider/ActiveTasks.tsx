import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { useProvider } from '@/context/ProviderContext';
import type { ProviderTask, ProviderTaskStatus } from '@/types/domain';

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

const ACTIVE_STATUSES: ProviderTaskStatus[] = ['in-progress', 'docs-awaited', 'review', 'blocked'];

const STATUS_META: Record<ProviderTaskStatus, { label: string; tone: 'green' | 'blue' | 'orange' | 'gray' | 'gold' | 'red' }> = {
  'pending-decision': { label: 'Awaiting Decision', tone: 'gold' },
  'in-progress': { label: 'In Progress', tone: 'blue' },
  'docs-awaited': { label: 'Docs Awaited', tone: 'gold' },
  review: { label: 'Review', tone: 'orange' },
  blocked: { label: 'Blocked', tone: 'red' },
  completed: { label: 'Completed', tone: 'green' },
};

const UPDATABLE_STATUSES: ProviderTaskStatus[] = ['in-progress', 'docs-awaited', 'review', 'blocked'];

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-24 rounded-full bg-canvas">
      <div className="h-1.5 rounded-full bg-gold" style={{ width: `${value}%` }} />
    </div>
  );
}

function UpdateTaskModal({ task, onClose }: { task: ProviderTask; onClose: () => void }) {
  const { updateTaskProgress } = useProvider();
  const [progress, setProgress] = useState(task.progress);
  const [status, setStatus] = useState<ProviderTaskStatus>(task.status);
  const [note, setNote] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateTaskProgress(task.id, progress, status);
    onClose();
  }

  const willComplete = progress >= 100;

  return (
    <Modal title="Update Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-gold">{task.ref}</div>
          <div className="text-[13px] font-semibold text-text-primary">{task.title}</div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Progress %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProviderTaskStatus)}
            disabled={willComplete}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold disabled:opacity-50"
          >
            {UPDATABLE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
          {willComplete && (
            <p className="mt-1 text-[10px] text-success">
              Reaching 100% will mark this task Completed automatically.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Note (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What changed?"
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Update
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function ActiveTasks() {
  const { tasks } = useProvider();
  const [editingTask, setEditingTask] = useState<ProviderTask | null>(null);

  const activeTasks = useMemo(
    () => tasks.filter((t) => ACTIVE_STATUSES.includes(t.status)),
    [tasks],
  );

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader title="My Active Tasks" />

        <Card>
          <DataTable<ProviderTask>
            data={activeTasks}
            rowKey={(t) => t.id}
            emptyMessage="No active tasks right now. Accept something from your Inbox!"
            columns={[
              { header: 'Task Ref', render: (t) => <span className="font-semibold text-gold">{t.ref}</span> },
              { header: 'Service / Client', render: (t) => `${t.title} · ${t.client}` },
              {
                header: 'Progress',
                render: (t) => (
                  <div className="flex items-center gap-2">
                    <ProgressBar value={t.progress} />
                    <span className="text-[10px] text-text-muted">{t.progress}%</span>
                  </div>
                ),
              },
              { header: 'Due', render: (t) => t.dueDate },
              {
                header: 'Status',
                render: (t) => <StatusBadge label={STATUS_META[t.status].label} tone={STATUS_META[t.status].tone} />,
              },
              {
                header: 'Action',
                render: (t) => (
                  <Button variant="gold" size="sm" onClick={() => setEditingTask(t)}>
                    Update
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      </div>

      {editingTask && <UpdateTaskModal task={editingTask} onClose={() => setEditingTask(null)} />}
    </div>
  );
}