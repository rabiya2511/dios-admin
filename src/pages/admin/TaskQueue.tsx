import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { AssignTaskModal } from '@/components/tasks/AssignTaskModal';
import { ReassignTaskModal } from '@/components/tasks/ReassignTaskModal';
import { TaskDetailsModal } from '@/components/tasks/TaskDetailsModal';
import { TASK_RECORDS } from '@/constants/mockData';
import { TASK_STATUS_MAP, TASK_PRIORITY_MAP } from '@/utils/statusMaps';
import { useTasks } from '@/context/TasksContext';
import type { TaskRecord, TaskAcceptStatus, UnassignedTask } from '@/types/domain';

type TaskFilter = 'all' | 'unassigned' | 'pending' | 'in-progress' | 'rejected';

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unassigned', label: 'Unassigned' },
  { key: 'pending', label: 'Pending Accept' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'rejected', label: 'Rejected' },
];

function matchesFilter(status: TaskAcceptStatus, filter: TaskFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'unassigned') return status === 'unassigned';
  if (filter === 'pending') return status === 'pending';
  if (filter === 'in-progress') return status === 'accepted' || status === 'in-progress';
  if (filter === 'rejected') return status === 'rejected';
  return false;
}

let refCounter = 100;
function generateRef(task: TaskRecord): string {
  refCounter += 1;
  const prefix = task.category === 'Legal' ? 'LEG' : task.category === 'Design' ? 'DES' : task.category === 'Tech' ? 'DEV' : task.category === 'Food & ISO' ? 'FSS' : 'CA';
  return `PRV-${prefix}-2026-${String(refCounter).padStart(4, '0')}`;
}

export default function TaskQueue() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [search, setSearch] = useState('');
  const [detailsTask, setDetailsTask] = useState<TaskRecord | null>(null);
  const [assignTask, setAssignTask] = useState<TaskRecord | null>(null);
  const [reassignTask, setReassignTask] = useState<TaskRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { taskStatuses, updateTaskStatus, taskProviders, updateTaskProvider, taskRefs, updateTaskRef } = useTasks();

  function liveStatus(task: TaskRecord): TaskAcceptStatus {
    return taskStatuses[task.id] ?? task.acceptStatus;
  }
  function liveProvider(task: TaskRecord): string {
    return taskProviders[task.id] ?? task.provider;
  }
  function liveRef(task: TaskRecord): string {
    return taskRefs[task.id] ?? task.ref;
  }

  const counts = useMemo(() => {
    const c: Record<TaskFilter, number> = { all: 0, unassigned: 0, pending: 0, 'in-progress': 0, rejected: 0 };
    TASK_RECORDS.forEach((t) => {
      const s = liveStatus(t);
      FILTERS.forEach((f) => {
        if (matchesFilter(s, f.key)) c[f.key] += 1;
      });
    });
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskStatuses]);

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TASK_RECORDS.filter((t) => {
      const s = liveStatus(t);
      const p = liveProvider(t);
      const r = liveRef(t);
      if (!matchesFilter(s, filter)) return false;
      if (!q) return true;
      return (
        r.toLowerCase().includes(q) ||
        t.service.toLowerCase().includes(q) ||
        t.client.toLowerCase().includes(q) ||
        p.toLowerCase().includes(q)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search, taskStatuses, taskProviders, taskRefs]);

  function showToast(message: string) {
    setToastMessage(message);
  }

  function handleAssignSubmit(providerName: string) {
    if (!assignTask) return;
    const newRef = generateRef(assignTask);
    updateTaskProvider(assignTask.id, providerName);
    updateTaskStatus(assignTask.id, 'pending');
    updateTaskRef(assignTask.id, newRef);
    setAssignTask(null);
    showToast('Task assigned successfully.');
  }

  function handleReassignSubmit(providerName: string) {
    if (!reassignTask) return;
    updateTaskProvider(reassignTask.id, providerName);
    updateTaskStatus(reassignTask.id, 'pending');
    setReassignTask(null);
    showToast('Task reassigned successfully.');
  }

  function toUnassignedTaskShape(task: TaskRecord): UnassignedTask {
    return {
      id: task.id,
      task: task.service,
      client: task.client,
      category: task.category,
      categoryTone: task.categoryTone,
    };
  }

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader title="Task Queue" subtitle="Full accept/reject workflow tracking across all orders" />

        <div className="mb-3.5 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={[
                'rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors',
                filter === f.key
                  ? 'border-gold bg-gold-tint text-[#7A5800]'
                  : 'border-border-subtle bg-surface text-text-primary hover:border-gold',
              ].join(' ')}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>

        <Card>
          <div className="mb-3.5 flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task ref, service, client, provider..."
              className="w-[280px] rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>

          <DataTable<TaskRecord>
            data={filteredTasks}
            rowKey={(t) => t.id}
            emptyMessage="No tasks match your filters."
            columns={[
              { header: 'Task Ref', render: (t) => <span className="font-medium text-gold">{liveRef(t)}</span> },
              { header: 'Task / Service', render: (t) => t.service },
              { header: 'Client', render: (t) => t.client },
              {
                header: 'Provider',
                render: (t) => {
                  const p = liveProvider(t);
                  return <span className={p === '—' ? 'text-text-muted' : ''}>{p}</span>;
                },
              },
              {
                header: 'Accept Status',
                render: (t) => {
                  const meta = TASK_STATUS_MAP[liveStatus(t)];
                  return <StatusBadge label={meta.label} tone={meta.tone} />;
                },
              },
              {
                header: 'Priority',
                render: (t) => {
                  const meta = TASK_PRIORITY_MAP[t.priority];
                  return <StatusBadge label={meta.label} tone={meta.tone} />;
                },
              },
              {
                header: 'Action',
                render: (t) => {
                  const s = liveStatus(t);
                  if (s === 'unassigned') {
                    return (
                      <Button variant="gold" size="sm" onClick={() => setAssignTask(t)}>
                        Assign
                      </Button>
                    );
                  }
                  if (s === 'rejected') {
                    return (
                      <Button variant="primary" size="sm" onClick={() => setReassignTask(t)}>
                        Reassign
                      </Button>
                    );
                  }
                  return (
                    <Button variant="secondary" size="sm" onClick={() => setDetailsTask(t)}>
                      View
                    </Button>
                  );
                },
              },
            ]}
          />
        </Card>

        {detailsTask && (
          <TaskDetailsModal
            task={detailsTask}
            liveStatus={liveStatus(detailsTask)}
            liveProvider={liveProvider(detailsTask)}
            liveRef={liveRef(detailsTask)}
            onClose={() => setDetailsTask(null)}
            onAssign={() => {
              setAssignTask(detailsTask);
              setDetailsTask(null);
            }}
            onReassign={() => {
              setReassignTask(detailsTask);
              setDetailsTask(null);
            }}
          />
        )}

        {assignTask && (
          <AssignTaskModal
            task={toUnassignedTaskShape(assignTask)}
            onClose={() => setAssignTask(null)}
            onAssigned={handleAssignSubmit}
          />
        )}

        {reassignTask && (
          <ReassignTaskModal
            task={reassignTask}
            onClose={() => setReassignTask(null)}
            onReassigned={handleReassignSubmit}
          />
        )}

        {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
      </div>
    </div>
  );
}