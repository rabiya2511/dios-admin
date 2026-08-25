import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useProvider } from '@/context/ProviderContext';
import { CURRENT_PROVIDER } from '@/constants/mockData';
import type { ProviderTask, ProviderTaskStatus } from '@/types/domain';

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

const STATUS_META: Record<ProviderTaskStatus, { label: string; tone: 'green' | 'blue' | 'orange' | 'gray' | 'gold' | 'red' }> = {
  'pending-decision': { label: 'Awaiting Decision', tone: 'gold' },
  'in-progress': { label: 'In Progress', tone: 'blue' },
  'docs-awaited': { label: 'Docs Awaited', tone: 'gold' },
  review: { label: 'Review', tone: 'orange' },
  blocked: { label: 'Blocked', tone: 'red' },
  completed: { label: 'Completed', tone: 'green' },
};

// completedDate is a bare "Mar 1" string with no year (same limitation as Bills'
// dueDate). "This Month" is derived by matching the month abbreviation against
// today's month — a completion from a previous year with the same month name
// would still be counted, since the underlying data has no year field.
const MONTH_ABBR = new Date().toLocaleString('en-US', { month: 'short' });

function isThisMonth(dateStr: string | undefined): boolean {
  return !!dateStr && dateStr.trim().startsWith(MONTH_ABBR);
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full rounded-full bg-canvas">
      <div className="h-1 rounded-full bg-gold" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function ProviderDashboard() {
  const { tasks, acceptTask } = useProvider();

  const inboxTasks = useMemo(() => tasks.filter((t) => t.status === 'pending-decision'), [tasks]);
  const activeTasks = useMemo(
    () => tasks.filter((t) => ['in-progress', 'docs-awaited', 'review', 'blocked'].includes(t.status)),
    [tasks],
  );
  const doneThisMonth = useMemo(
    () => tasks.filter((t) => t.status === 'completed' && isThisMonth(t.completedDate)),
    [tasks],
  );
  const earnedThisMonth = useMemo(
    () => doneThisMonth.reduce((sum, t) => sum + t.payout, 0),
    [doneThisMonth],
  );

  const nextAction: ProviderTask | undefined = inboxTasks[0];

  const upcomingDeadlines = useMemo(
    () => [...activeTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3),
    [activeTasks],
  );

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="My Dashboard"
          subtitle={
            inboxTasks.length
              ? `Welcome, ${CURRENT_PROVIDER.name.split(' ')[0]}! You have ${inboxTasks.length} task${inboxTasks.length === 1 ? '' : 's'} awaiting action.`
              : `Welcome, ${CURRENT_PROVIDER.name.split(' ')[0]}! Your inbox is all clear.`
          }
        />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">New Inbox</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">{inboxTasks.length}</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Active Tasks</div>
            <div className="mt-2 font-display text-2xl font-bold text-info">{activeTasks.length}</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Done This Month</div>
            <div className="mt-2 font-display text-2xl font-bold text-success">{doneThisMonth.length}</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Earned This Month</div>
            <div className="mt-2 font-display text-2xl font-bold text-gold">{formatINR(earnedThisMonth)}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            {nextAction && (
              <Card>
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gold">
                  ⏰ Task requiring action (accept/reject within 24h)
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-gold">{nextAction.ref}</div>
                <div className="mt-0.5 text-[13px] font-semibold text-text-primary">{nextAction.title}</div>
                <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-text-muted">
                  <span>📁 {nextAction.category}</span>
                  <span>📅 Due {nextAction.dueDate}</span>
                  <span>⏱ {nextAction.estimatedHours}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display text-[14px] font-bold text-text-primary">
                    {formatINR(nextAction.payout)} payout
                  </span>
                  <StatusBadge label="New Assignment" tone="gold" />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="success" size="sm" className="flex-1" onClick={() => acceptTask(nextAction.id)}>
                    ✅ Accept Task
                  </Button>
                  <Link to="/provider/inbox" className="flex-1">
                    <Button variant="danger" size="sm" className="w-full">
                      Review in Inbox
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            <Card>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Active Tasks
              </div>
              {activeTasks.length === 0 ? (
                <p className="py-4 text-center text-[12px] text-text-muted">No active tasks right now.</p>
              ) : (
                <div className="space-y-3">
                  {activeTasks.slice(0, 4).map((t) => (
                    <div key={t.id} className="border-b border-border-subtle pb-2 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-text-primary">
                          {t.title} <span className="text-text-muted">· {t.client}</span>
                        </span>
                        <StatusBadge label={STATUS_META[t.status].label} tone={STATUS_META[t.status].tone} />
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar value={t.progress} />
                        </div>
                        <span className="text-[10px] text-text-muted">{t.progress}%</span>
                        <span className="text-[10px] text-text-muted">Due {t.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl bg-navy p-4 text-white">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
                Earned This Month
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-gold">{formatINR(earnedThisMonth)}</div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-[10px]">
                <div>
                  <div className="text-white/40">Tasks Done</div>
                  <div className="font-semibold text-white">{doneThisMonth.length}</div>
                </div>
                <div>
                  <div className="text-white/40">Active Now</div>
                  <div className="font-semibold text-white">{activeTasks.length}</div>
                </div>
              </div>
            </div>

            <Card>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Upcoming Deadlines
              </div>
              {upcomingDeadlines.length === 0 ? (
                <p className="py-2 text-center text-[11px] text-text-muted">Nothing due soon.</p>
              ) : (
                upcomingDeadlines.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 border-b border-border-subtle py-2 last:border-b-0">
                    <div className="flex-1">
                      <div className="text-[11px] font-medium text-text-primary">{t.title}</div>
                      <div className="text-[9px] text-text-muted">{t.ref}</div>
                    </div>
                    <span className="text-[10px] font-medium text-text-muted">{t.dueDate}</span>
                  </div>
                ))
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}