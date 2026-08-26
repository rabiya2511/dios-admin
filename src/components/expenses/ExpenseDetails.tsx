import type { ReactNode } from 'react';
import { Drawer } from '@/components/common/Drawer';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EXPENSE_STATUS_MAP } from '@/utils/statusMaps';
import type { Expense } from '@/types/domain';

function fmtINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="text-[12px] font-medium text-text-primary">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-border-subtle pb-3.5 last:border-b-0 last:pb-0">
      <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">{title}</h4>
      {children}
    </div>
  );
}

interface ExpenseDetailsProps {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ExpenseDetails({ expense: e, onEdit, onDelete, onClose }: ExpenseDetailsProps) {
  const meta = EXPENSE_STATUS_MAP[e.status];

  return (
    <Drawer title="Expense Details" subtitle={e.description} onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-text-primary">{e.description}</span>
          <StatusBadge label={meta.label} tone={meta.tone} />
        </div>

        <Section title="Expense Information">
          <Row label="Expense ID" value={e.id} />
          <Row label="Expense Date" value={e.date} />
          <Row label="Description" value={e.description} />
          <Row label="Category" value={e.category} />
        </Section>

        <Section title="Financial Details">
          <Row label="Amount" value={fmtINR(e.amount)} />
          <Row label="GST" value={`${e.gstRate}%`} />
          <Row label="GST Amount" value={fmtINR(e.gstAmount)} />
          <Row label="Total Amount" value={fmtINR(e.totalAmount)} />
        </Section>

        <Section title="Payment Information">
          <Row label="Paid Via" value={e.paidVia} />
          <Row label="Payment Reference" value={e.paymentReference ?? '—'} />
          <Row label="Payment Date" value={e.paymentDate ?? '—'} />
        </Section>

        <Section title="Classification">
          <Row label="Reimbursable" value={e.reimbursable ? 'Yes' : 'No'} />
          <Row label="Tax Deductible" value={e.taxDeductible ? 'Yes' : 'No'} />
        </Section>

        <Section title="Vendor Information">
          <Row label="Vendor / Merchant" value={e.vendor ?? '—'} />
          <Row label="Invoice / Receipt Number" value={e.invoiceNumber ?? '—'} />
        </Section>

        {e.notes && (
          <Section title="Notes">
            <p className="text-[12px] text-text-primary">{e.notes}</p>
          </Section>
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit Expense
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            Delete Expense
          </Button>
        </div>
      </div>
    </Drawer>
  );
}