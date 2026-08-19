import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { BILLS } from '@/constants/mockData';
import { BILL_STATUS_MAP } from '@/utils/statusMaps';
import type { Bill, BillCategory } from '@/types/domain';

const CATEGORY_TONE: Record<BillCategory, 'blue' | 'gold' | 'green' | 'orange' | 'gray'> = {
  Infrastructure: 'blue',
  Payment: 'gold',
  Facilities: 'gray',
  Marketing: 'orange',
  Software: 'gray',
};

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function Bills() {
  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Bills & Payments"
          subtitle="Track vendor bills and outgoing payments"
          action={
            <Button variant="primary" size="sm">
              + Record Bill
            </Button>
          }
        />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Total Bills</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">₹1.8L</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Paid</div>
            <div className="mt-2 font-display text-2xl font-bold text-success">₹1.49L</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Due</div>
            <div className="mt-2 font-display text-2xl font-bold text-warning">₹31K</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">This Month</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">₹42K</div>
          </Card>
        </div>

        <Card>
          <DataTable<Bill>
            data={BILLS}
            rowKey={(b) => b.id}
            columns={[
              { header: 'Bill #', render: (b) => b.billNo },
              { header: 'Vendor', render: (b) => <span className="font-medium">{b.vendor}</span> },
              {
                header: 'Category',
                render: (b) => <StatusBadge label={b.category} tone={CATEGORY_TONE[b.category]} />,
              },
              { header: 'Amount', render: (b) => formatINR(b.amount) },
              { header: 'Tax', render: (b) => formatINR(b.tax) },
              { header: 'Total', render: (b) => <span className="font-semibold">{formatINR(b.total)}</span> },
              { header: 'Due Date', render: (b) => b.dueDate },
              {
                header: 'Status',
                render: (b) => {
                  const meta = BILL_STATUS_MAP[b.status];
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