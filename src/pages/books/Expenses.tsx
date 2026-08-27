import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { useExpenses, addExpense } from '@/store/expensesStore';
import { EXPENSE_STATUS_MAP } from '@/utils/statusMaps';
import type { Expense, ExpenseCategory, ExpenseStatus, PaymentMethod } from '@/types/domain';

const CATEGORY_TONE: Record<ExpenseCategory, 'blue' | 'gold' | 'green' | 'orange' | 'gray'> = {
  Tech: 'blue',
  Marketing: 'orange',
  Office: 'gray',
  Meals: 'gray',
  Software: 'blue',
  Travel: 'gold',
  Utilities: 'green',
  'Professional Services': 'orange',
  Other: 'gray',
};

const CATEGORIES: ExpenseCategory[] = [
  'Tech',
  'Marketing',
  'Office',
  'Meals',
  'Software',
  'Travel',
  'Utilities',
  'Professional Services',
  'Other',
];
const PAYMENT_METHODS: PaymentMethod[] = ['Bank Transfer', 'Credit Card', 'Debit Card', 'Cash', 'UPI', 'Other'];

function formatINR(n: number | undefined): string {
  return `₹${(n ?? 0).toLocaleString('en-IN')}`;
}

// date is stored as e.g. "Mar 12" with no year in the existing data model.
// "This Month" is derived by matching the month abbreviation against the
// current month — a record from a previous year with the same month name
// would still be counted, since the underlying data has no year field.
const MONTH_ABBR = new Date().toLocaleString('en-US', { month: 'short' });

function isThisMonth(date: string): boolean {
  return date.trim().startsWith(MONTH_ABBR);
}

interface NewExpenseFormState {
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: string;
  gstRate: string;
  paidVia: PaymentMethod;
  status: ExpenseStatus;
  reimbursable: boolean;
  taxDeductible: boolean;
  vendor: string;
  invoiceNumber: string;
}

const EMPTY_FORM: NewExpenseFormState = {
  date: '',
  description: '',
  category: 'Tech',
  amount: '',
  gstRate: '18',
  paidVia: 'Bank Transfer',
  status: 'pending',
  reimbursable: false,
  taxDeductible: true,
  vendor: '',
  invoiceNumber: '',
};

function AddExpenseModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<NewExpenseFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const amountNum = parseFloat(form.amount) || 0;
  const gstRateNum = parseFloat(form.gstRate) || 0;
  const gstAmount = Math.round(amountNum * (gstRateNum / 100));
  const total = amountNum + gstAmount;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.date.trim() || !form.description.trim() || !form.category || !form.amount || !form.paidVia) {
      setError('Please fill in all required fields.');
      return;
    }
    if (amountNum <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    addExpense({
      date: form.date.trim(),
      description: form.description.trim(),
      category: form.category,
      amount: amountNum,
      gstRate: gstRateNum,
      paidVia: form.paidVia,
      status: form.status,
      reimbursable: form.reimbursable,
      taxDeductible: form.taxDeductible,
      vendor: form.vendor.trim() || undefined,
      invoiceNumber: form.invoiceNumber.trim() || undefined,
    });
    onClose();
  }

  return (
    <Modal title="Add Expense" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-lg bg-danger-bg px-3 py-2 text-[12px] text-danger">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Date *</label>
            <input
              placeholder="e.g. Mar 15"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Description *</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Vendor</label>
            <input
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Invoice Number</label>
            <input
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
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
            <label className="mb-1 block text-[11px] font-medium text-text-muted">GST Rate (%)</label>
            <select
              value={form.gstRate}
              onChange={(e) => setForm({ ...form, gstRate: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            >
              <option value="18">18</option>
              <option value="12">12</option>
              <option value="5">5</option>
              <option value="0">0</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Total</label>
            <div className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] font-semibold text-text-primary">
              {formatINR(total)}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Paid Via *</label>
          <select
            value={form.paidVia}
            onChange={(e) => setForm({ ...form, paidVia: e.target.value as PaymentMethod })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Status *</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ExpenseStatus })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="flex gap-4 pt-1">
          <label className="flex items-center gap-2 text-[12px] text-text-primary">
            <input
              type="checkbox"
              checked={form.reimbursable}
              onChange={(e) => setForm({ ...form, reimbursable: e.target.checked })}
            />
            Reimbursable
          </label>
          <label className="flex items-center gap-2 text-[12px] text-text-primary">
            <input
              type="checkbox"
              checked={form.taxDeductible}
              onChange={(e) => setForm({ ...form, taxDeductible: e.target.checked })}
            />
            Tax Deductible
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Expenses() {
  const expenses = useExpenses();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  const totals = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
    const thisMonth = expenses
      .filter((e) => isThisMonth(e.date))
      .reduce((sum, e) => sum + e.totalAmount, 0);
    const reimbursable = expenses
      .filter((e) => e.reimbursable)
      .reduce((sum, e) => sum + e.totalAmount, 0);
    const taxDeductible = expenses
      .filter((e) => e.taxDeductible)
      .reduce((sum, e) => sum + e.totalAmount, 0);
    return { totalExpenses, thisMonth, reimbursable, taxDeductible };
  }, [expenses]);

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Expenses"
          subtitle="Track and categorize all business expenses"
          action={
            <Button variant="primary" size="sm" onClick={() => setShowAddExpenseModal(true)}>
              + Add Expense
            </Button>
          }
        />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Total Expenses</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">
              {formatINR(totals.totalExpenses)}
            </div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">This Month</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">
              {formatINR(totals.thisMonth)}
            </div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Reimbursable</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">
              {formatINR(totals.reimbursable)}
            </div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Tax Deductible</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">
              {formatINR(totals.taxDeductible)}
            </div>
          </Card>
        </div>

        <Card>
          <DataTable<Expense>
            data={expenses}
            rowKey={(e) => e.id}
            columns={[
              { header: 'Date', render: (e) => e.date },
              { header: 'Description', render: (e) => <span className="font-medium">{e.description}</span> },
              {
                header: 'Category',
                render: (e) => <StatusBadge label={e.category} tone={CATEGORY_TONE[e.category]} />,
              },
              { header: 'Amount', render: (e) => formatINR(e.amount) },
              { header: 'GST', render: (e) => formatINR(e.gstAmount) },
              { header: 'Total', render: (e) => <span className="font-semibold">{formatINR(e.totalAmount)}</span> },
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

      {showAddExpenseModal && <AddExpenseModal onClose={() => setShowAddExpenseModal(false)} />}
    </div>
  );
}