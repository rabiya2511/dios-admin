import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EXPENSES } from '@/constants/mockData';
import { EXPENSE_STATUS_MAP } from '@/utils/statusMaps';
import type { Expense, ExpenseCategory } from '@/types/domain';

const CATEGORY_TONE: Record<ExpenseCategory, 'blue' | 'gold' | 'green' | 'orange' | 'gray'> = {
  Tech: 'blue',
  Marketing: 'orange',
  Office: 'gray',
  Meals: 'gray',
  Software: 'blue',
};

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function Expenses() {
  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Expenses"
          subtitle="Track and categorize all business expenses"
          action={
            <Button variant="primary" size="sm">
              + Add Expense
            </Button>
          }
        />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Total Expenses</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">₹1.8L</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">This Month</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">₹42K</div>
            <div className="mt-1 text-[11px] text-danger">↑ 8% vs last</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Reimbursable</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">₹12K</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Tax Deductible</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">₹1.4L</div>
          </Card>
        </div>

        <Card>
          <DataTable<Expense>
            data={EXPENSES}
            rowKey={(e) => e.id}
            columns={[
              { header: 'Date', render: (e) => e.date },
              { header: 'Description', render: (e) => <span className="font-medium">{e.description}</span> },
              {
                header: 'Category',
                render: (e) => <StatusBadge label={e.category} tone={CATEGORY_TONE[e.category]} />,
              },
              { header: 'Amount', render: (e) => formatINR(e.amount) },
              { header: 'GST', render: (e) => formatINR(e.gst) },
              { header: 'Paid Via', render: (e) => e.paidVia },
              {
                header: 'Status',
                render: (e) => {
                  const meta = EXPENSE_STATUS_MAP[e.status];
                  return <StatusBadge label={meta.label} tone={meta.tone} />;
                },
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}