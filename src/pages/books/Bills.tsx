import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { useBills, addBill } from '@/store/billsStore';
import { BILL_STATUS_MAP } from '@/utils/statusMaps';
import type { Bill, BillCategory, BillStatus } from '@/types/domain';

const CATEGORY_TONE: Record<BillCategory, 'blue' | 'gold' | 'green' | 'orange' | 'gray'> = {
  Infrastructure: 'blue',
  Payment: 'gold',
  Facilities: 'gray',
  Marketing: 'orange',
  Software: 'gray',
};

const CATEGORIES: BillCategory[] = ['Infrastructure', 'Payment', 'Facilities', 'Marketing', 'Software'];

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

// dueDate is stored as e.g. "Mar 22" with no year in the existing data model.
// "This Month" is derived by matching the month abbreviation against the
// current month — a bill from a previous year with the same month name
// would still be counted, since the underlying data has no year field.
const MONTH_ABBR = new Date().toLocaleString('en-US', { month: 'short' });

function isDueThisMonth(dueDate: string): boolean {
  return dueDate.trim().startsWith(MONTH_ABBR);
}

interface NewBillFormState {
  vendor: string;
  category: BillCategory;
  amount: string;
  tax: string;
  dueDate: string;
  status: BillStatus;
}

const EMPTY_FORM: NewBillFormState = {
  vendor: '',
  category: 'Infrastructure',
  amount: '',
  tax: '',
  dueDate: '',
  status: 'due',
};

function AddBillModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<NewBillFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const amountNum = parseFloat(form.amount) || 0;
  const taxNum = parseFloat(form.tax) || 0;
  const total = amountNum + taxNum;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.vendor.trim() || !form.category || !form.amount || !form.dueDate.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (amountNum <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    addBill({
      vendor: form.vendor.trim(),
      category: form.category,
      amount: amountNum,
      tax: taxNum,
      dueDate: form.dueDate.trim(),
      status: form.status,
    });
    onClose();
  }

  return (
    <Modal title="Add Bill" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-lg bg-danger-bg px-3 py-2 text-[12px] text-danger">{error}</div>
        )}

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Vendor *</label>
          <input
            value={form.vendor}
            onChange={(e) => setForm({ ...form, vendor: e.target.value })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as BillCategory })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Amount (₹) *</label>
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Tax (₹)</label>
            <input
              type="number"
              min="0"
              value={form.tax}
              onChange={(e) => setForm({ ...form, tax: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Due Date *</label>
            <input
              placeholder="e.g. Apr 15"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Total</label>
            <div className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] font-semibold text-text-primary">
              {formatINR(total)}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Status *</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as BillStatus })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          >
            <option value="paid">Paid</option>
            <option value="due">Due</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Add Bill
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Bills() {
  const bills = useBills();
  const [showAddBillModal, setShowAddBillModal] = useState(false);

  const totals = useMemo(() => {
    const totalBills = bills.reduce((sum, b) => sum + b.total, 0);
    const paid = bills.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.total, 0);
    const due = bills.filter((b) => b.status === 'due').reduce((sum, b) => sum + b.total, 0);
    const thisMonth = bills.filter((b) => isDueThisMonth(b.dueDate)).reduce((sum, b) => sum + b.total, 0);
    return { totalBills, paid, due, thisMonth };
  }, [bills]);

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Bills & Payments"
          subtitle="Track vendor bills and outgoing payments"
          action={
            <Button variant="primary" size="sm" onClick={() => setShowAddBillModal(true)}>
              + Add Bill
            </Button>
          }
        />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Total Bills</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">
              {formatINR(totals.totalBills)}
            </div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Paid</div>
            <div className="mt-2 font-display text-2xl font-bold text-success">{formatINR(totals.paid)}</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Due</div>
            <div className="mt-2 font-display text-2xl font-bold text-warning">{formatINR(totals.due)}</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">This Month</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">
              {formatINR(totals.thisMonth)}
            </div>
          </Card>
        </div>

        <Card>
          <DataTable<Bill>
            data={bills}
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

      {showAddBillModal && <AddBillModal onClose={() => setShowAddBillModal(false)} />}
    </div>
  );
}