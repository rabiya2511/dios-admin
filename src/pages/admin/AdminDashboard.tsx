import { useNavigate } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/common/Card';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Button } from '@/components/common/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { useState } from 'react';
import { AssignTaskModal } from '@/components/tasks/AssignTaskModal';
import {
  RECENT_ORDERS,
  UNASSIGNED_TASKS,
  REVENUE_BY_SERVICE,
  PROVIDER_AVAILABILITY,
} from '@/constants/mockData';

import { ORDER_STATUS_MAP, PROVIDER_STATUS_MAP } from '@/utils/statusMaps';
import { useOrders } from '@/context/OrdersContext';
import type { RecentOrder, UnassignedTask } from '@/types/domain';

const TASK_CATEGORY_CLASSES: Record<UnassignedTask['categoryTone'], string> = {
  blue: 'bg-info-bg text-info',
  orange: 'bg-warning-bg text-warning',
  green: 'bg-success-bg text-success',
  gray: 'bg-canvas text-text-muted',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { orderStatuses } = useOrders();
  const [tasks, setTasks] = useState(UNASSIGNED_TASKS);
  const [assigningTask, setAssigningTask] = useState<UnassignedTask | null>(null);

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader title="Admin Dashboard" subtitle="Platform overview and quick actions" />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Revenue" value="₹8.4L" icon="💰" tone="gold" trend="23% this month" trendDirection="up" />
          <StatCard label="Active Orders" value="47" icon="📋" tone="info" trend="8 new today" trendDirection="up" />
          <StatCard label="Total Users" value="312" icon="👥" tone="success" trend="14 this week" trendDirection="up" />
          <StatCard
            label="Pending Tasks"
            value="18"
            icon="⏳"
            tone="warning"
            trend="3 unassigned"
            trendDirection="down"
            trendArrow="up"
          />
        </div>

        <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[2fr_1fr]">
          <div className="flex min-w-0 flex-col gap-3.5">
            <Card>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Recent Orders
              </h3>
              <DataTable<RecentOrder>
                data={RECENT_ORDERS}
                rowKey={(o) => o.id}
                columns={[
                  { header: 'Client', render: (o) => <span className="font-medium">{o.client}</span> },
                  { header: 'Service', render: (o) => o.service },
                  { header: 'Amount', render: (o) => o.amount },
                  {
                    header: 'Status',
                    render: (o) => {
                      const currentStatus = orderStatuses[o.id] ?? o.status;
                      const meta = ORDER_STATUS_MAP[currentStatus];
                      return <StatusBadge label={meta.label} tone={meta.tone} />;
                    },
                  },
                  {
                    header: 'Action',
                    render: (o) => (
                      <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                        View
                      </Button>
                    ),
                  },
                ]}
              />
            </Card>

            <Card>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Task Queue — Unassigned
              </h3>
              <DataTable<UnassignedTask>
                data={tasks}
                rowKey={(t) => t.id}
                columns={[
                  { header: 'Task', render: (t) => <span className="font-medium text-info">{t.task}</span> },
                  { header: 'Client', render: (t) => t.client },
                  {
                    header: 'Category',
                    render: (t) => (
                      <span
                        className={[
                          'inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          TASK_CATEGORY_CLASSES[t.categoryTone],
                        ].join(' ')}
                      >
                        {t.category}
                      </span>
                    ),
                  },
                  {
                    header: 'Action',
                    render: (t) => (
                      <Button variant="gold" size="sm" onClick={() => setAssigningTask(t)}>
                        Assign
                      </Button>
                    ),
                  },
                ]}
              />
            </Card>
          </div>

          <div className="flex min-w-0 flex-col gap-3.5">
            <Card>
              <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Revenue by Service
              </h3>
              <div className="flex flex-col gap-3">
                {REVENUE_BY_SERVICE.map((r) => (
                  <div key={r.service}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="text-text-primary">{r.service}</span>
                      <span className="font-semibold text-text-primary">{r.amount}</span>
                    </div>
                    <ProgressBar value={r.percent} />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Provider Availability
              </h3>
              <div className="flex flex-col gap-2.5">
                {PROVIDER_AVAILABILITY.map((p) => {
                  const meta = PROVIDER_STATUS_MAP[p.status];
                  return (
                    <div key={p.name} className="flex items-center justify-between text-[12px]">
                      <span className="text-text-primary">{p.name}</span>
                      <StatusBadge
                        label={p.status === 'busy' && p.busyCount ? `${meta.label} (${p.busyCount})` : meta.label}
                        tone={meta.tone}
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {assigningTask && (
          <AssignTaskModal
            task={assigningTask}
            onClose={() => setAssigningTask(null)}
            onAssigned={() => setTasks((prev) => prev.filter((t) => t.id !== assigningTask.id))}
          />
        )}
      </div>
    </div>
  );
} 