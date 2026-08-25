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

// Mock completedDate values are fixed to Mar/Feb 2026 and never match the real
// current month, so "this month" is treated as "all completed tasks" — the
// only way these stats show meaningful (non-zero) numbers with static demo data.
function isCompleted(task: ProviderTask): boolean {
  return task.status === 'completed';
}

// Mock due dates are all set in Mar/Apr 2026 with no reference "today" in the
// data itself, so deadline countdowns are computed against a fixed reference
// date that sits in the middle of the mock task timeline.
const MOCK_TODAY = new Date(2026, 2, 15); // Mar 15, 2026

function daysUntil(dueDateStr: string): number | null {
  const match = dueDateStr.match(/^([A-Za-z]{3})\s+(\d{1,2})$/);
  if (!match) return null;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = monthNames.indexOf(match[1]);
  if (monthIdx === -1) return null;
  const due = new Date(2026, monthIdx, parseInt(match[2], 10));
  return Math.round((due.getTime() - MOCK_TODAY.getTime()) / 86_400_000);
}

function parseDueParts(dueDateStr: string): { day: string; month: string } | null {
  const match = dueDateStr.match(/^([A-Za-z]{3})\s+(\d{1,2})$/);
  if (!match) return null;
  return { day: match[2], month: match[1].toUpperCase() };
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full rounded-full bg-canvas">
      <div className="h-1 rounded-full bg-gold" style={{ width: `${value}%` }} />
    </div>
  );
}

function StatIcon({ emoji, tone }: { emoji: string; tone: 'blue' | 'navy' | 'green' | 'gold' }) {
  const toneClasses: Record<string, string> = {
    blue: 'bg-info-bg',
    navy: 'bg-navy/10',
    green: 'bg-success-bg',
    gold: 'bg-gold-tint',
  };
  return (
    <span className={['flex h-8 w-8 items-center justify-center rounded-lg text-[15px]', toneClasses[tone]].join(' ')}>
      {emoji}
    </span>
  );
}

export default function ProviderDashboard() {
  const { tasks, acceptTask } = useProvider();

  const inboxTasks = useMemo(() => tasks.filter((t) => t.status === 'pending-decision'), [tasks]);
  const activeTasks = useMemo(
    () => tasks.filter((t) => ['in-progress', 'docs-awaited', 'review', 'blocked'].includes(t.status)),
    [tasks],
  );
  const doneThisMonth = useMemo(() => tasks.filter(isCompleted), [tasks]);
  const earnedThisMonth = useMemo(
    () => doneThisMonth.reduce((sum, t) => sum + t.payout, 0),
    [doneThisMonth],
  );

  const totalEarnedAllTime = earnedThisMonth; // same pool of completed tasks in this mock dataset
  const pendingAmount = useMemo(
    () => activeTasks.reduce((sum, t) => sum + t.payout, 0),
    [activeTasks],
  );
  const tasksTotal = tasks.length;
  const decidedTasks = tasksTotal - inboxTasks.length;
  const acceptRate = tasksTotal > 0 ? Math.round((decidedTasks / tasksTotal) * 100) : 0;

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
            <div className="flex items-start justify-between">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">New Inbox</div>
              <StatIcon emoji="📥" tone="blue" />
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">{inboxTasks.length}</div>
            {inboxTasks.length > 0 && <div className="mt-1 text-[11px] text-warning">Action needed</div>}
          </Card>
          <Card>
            <div className="flex items-start justify-between">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Active Tasks</div>
              <StatIcon emoji="▶️" tone="navy" />
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-info">{activeTasks.length}</div>
            <div className="mt-1 text-[11px] text-text-muted">In progress</div>
          </Card>
          <Card>
            <div className="flex items-start justify-between">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Done This Month</div>
              <StatIcon emoji="✅" tone="green" />
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-success">{doneThisMonth.length}</div>
            <div className="mt-1 text-[11px] text-text-muted">Mar 2026</div>
          </Card>
          <Card>
            <div className="flex items-start justify-between">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Earned This Month</div>
              <StatIcon emoji="🤑" tone="gold" />
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-gold">{formatINR(earnedThisMonth)}</div>
            <div className="mt-1 text-[11px] text-success">↑ 18%</div>
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
                <div className="scroll-thin -mx-1 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse">
                    <thead>
                      <tr>
                        {['Task Ref', 'Service', 'Progress', 'Due', 'Status'].map((h) => (
                          <th
                            key={h}
                            className="border-b border-border-subtle px-3 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeTasks.slice(0, 4).map((t) => (
                        <tr key={t.id} className="group">
                          <td className="border-b border-border-subtle px-3 py-2.5 text-[11px] font-medium text-gold transition-colors group-last:border-b-0 group-hover:bg-canvas">
                            {t.ref}
                          </td>
                          <td className="border-b border-border-subtle px-3 py-2.5 text-[12px] text-text-primary transition-colors group-last:border-b-0 group-hover:bg-canvas">
                            {t.title.split(' — ')[0].split(' (')[0]}{' '}
                            <span className="text-text-muted">
                              ({t.client.split(' / ')[0]})
                            </span>
                          </td>
                          <td className="border-b border-border-subtle px-3 py-2.5 transition-colors group-last:border-b-0 group-hover:bg-canvas">
                            <div className="flex items-center gap-2">
                              <div className="w-20">
                                <ProgressBar value={t.progress} />
                              </div>
                              <span className="text-[10px] text-text-muted">{t.progress}%</span>
                            </div>
                          </td>
                          <td className="border-b border-border-subtle px-3 py-2.5 text-[11px] text-text-muted transition-colors group-last:border-b-0 group-hover:bg-canvas">
                            {t.dueDate}
                          </td>
                          <td className="border-b border-border-subtle px-3 py-2.5 transition-colors group-last:border-b-0 group-hover:bg-canvas">
                            <StatusBadge label={STATUS_META[t.status].label} tone={STATUS_META[t.status].tone} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl bg-navy p-4 text-white">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
                Total Earned (All Time)
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-gold">{formatINR(totalEarnedAllTime)}</div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-[10px]">
                <div>
                  <div className="text-white/40">Pending</div>
                  <div className="font-semibold text-white">{formatINR(pendingAmount)}</div>
                </div>
                <div>
                  <div className="text-white/40">Tasks Total</div>
                  <div className="font-semibold text-white">{tasksTotal}</div>
                </div>
                <div>
                  <div className="text-white/40">Accept Rate</div>
                  <div className="font-semibold text-white">{acceptRate}%</div>
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
                upcomingDeadlines.map((t) => {
                  const parts = parseDueParts(t.dueDate);
                  const diff = daysUntil(t.dueDate);
                  return (
                    <div key={t.id} className="flex items-center gap-3 border-b border-border-subtle py-2 last:border-b-0">
                      {parts && (
                        <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-gold-tint">
                          <span className="text-[13px] font-bold leading-none text-[#7A5800]">{parts.day}</span>
                          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-[#7A5800]">
                            {parts.month}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[11px] font-medium text-text-primary">
                          {t.title.split(' — ')[0].split(' (')[0]} · {t.client.split(' / ')[0]}
                        </div>
                        <div className="text-[9px] text-text-muted">{t.ref}</div>
                      </div>
                      {diff !== null && (
                        <StatusBadge
                          label={diff < 0 ? 'Overdue' : `${diff} day${diff === 1 ? '' : 's'}`}
                          tone={diff < 0 ? 'red' : diff <= 3 ? 'orange' : 'gray'}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}