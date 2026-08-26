import { useMemo, useState } from 'react';
import { Drawer } from '@/components/common/Drawer';
import { Button } from '@/components/common/Button';
import { Toggle } from '@/components/common/Toggle';
import type { ExpenseInput } from '@/context/ExpensesContext';
import type { Expense, ExpenseCategory, PaymentMethod } from '@/types/domain';

const CATEGORIES: ExpenseCategory[] = [
  'Tech', 'Marketing', 'Office', 'Meals', 'Software', 'Travel', 'Utilities', 'Professional Services', 'Other',
];
const GST_RATES = [0, 5, 12, 18, 28];
const PAYMENT_METHODS: PaymentMethod[] = ['Bank Transfer', 'Credit Card', 'Debit Card', 'Cash', 'UPI', 'Other'];

interface ExpenseFormProps {
  mode: 'create' | 'edit';
  initial?: Expense;
  onSave: (input: ExpenseInput) => void;
  onClose: () => void;
}

function fmtINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function ExpenseForm({ mode, initial, onSave, onClose }: ExpenseFormProps) {
  const [date, setDate] = useState(initial?.date ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState<ExpenseCategory>(initial?.category ?? 'Tech');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [gstRate, setGstRate] = useState(initial?.gstRate ?? 18);
  const [paidVia, setPaidVia] = useState<PaymentMethod>(initial?.paidVia ?? 'Bank Transfer');
  const [paymentReference, setPaymentReference] = useState(initial?.paymentReference ?? '');
  const [paymentDate, setPaymentDate] = useState(initial?.paymentDate ?? '');
  const [reimbursable, setReimbursable] = useState(initial?.reimbursable ?? false);
  const [taxDeductible, setTaxDeductible] = useState(initial?.taxDeductible ?? true);
  const [vendor, setVendor] = useState(initial?.vendor ?? '');
  const [invoiceNumber, setInvoiceNumber] = useState(initial?.invoiceNumber ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState<string | null>(null);

  const amountNum = Number(amount) || 0;
  const gstAmount = useMemo(() => Math.round(amountNum * (gstRate / 100)), [amountNum, gstRate]);
  const totalAmount = amountNum + gstAmount;

  function handleSave() {
    if (!description.trim() || amountNum <= 0) {
      setError('Description and a valid amount are required.');
      return;
    }
    onSave({
      date: date || 'Today',
      description,
      category,
      amount: amountNum,
      gstRate,
      gstAmount,
      totalAmount,
      paidVia,
      paymentReference: paymentReference || undefined,
      paymentDate: paymentDate || undefined,
      status: initial?.status ?? 'pending',
      reimbursable,
      taxDeductible,
      vendor: vendor || undefined,
      invoiceNumber: invoiceNumber || undefined,
      notes: notes || undefined,
      attachment: initial?.attachment,
    });
  }

  const inputClass =
    'rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold';
  const labelClass = 'text-[10px] font-semibold uppercase tracking-wide text-text-muted';

  return (
    <Drawer title={mode === 'create' ? 'Add Expense' : 'Edit Expense'} onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Expense Information
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Expense Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. AWS Infrastructure"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className={['cursor-pointer', inputClass].join(' ')}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10000"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>GST</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className={['cursor-pointer', inputClass].join(' ')}
              >
                {GST_RATES.map((r) => (
                  <option key={r} value={r}>{r}%</option>
                ))}
              </select>
            </div>
            <div className="rounded-lg bg-canvas p-3 text-[12px]">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span>{fmtINR(amountNum)}</span>
              </div>
              <div className="mt-1 flex justify-between text-text-muted">
                <span>GST ({gstRate}%)</span>
                <span>{fmtINR(gstAmount)}</span>
              </div>
              <div className="mt-1.5 flex justify-between border-t border-border-subtle pt-1.5 font-semibold text-text-primary">
                <span>Total</span>
                <span>{fmtINR(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Payment Information
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Paid Via</label>
              <select
                value={paidVia}
                onChange={(e) => setPaidVia(e.target.value as PaymentMethod)}
                className={['cursor-pointer', inputClass].join(' ')}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Payment Reference (optional)</label>
              <input
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Classification
          </h3>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-text-primary">Reimbursable</span>
              <Toggle checked={reimbursable} onChange={setReimbursable} label="Reimbursable" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-text-primary">Tax Deductible</span>
              <Toggle checked={taxDeductible} onChange={setTaxDeductible} label="Tax Deductible" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Vendor / Merchant</label>
              <input value={vendor} onChange={(e) => setVendor(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Invoice / Receipt Number</label>
              <input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Additional Information
          </h3>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={[inputClass, 'resize-none'].join(' ')}
            />
          </div>
        </div>

        {error && <p className="text-[12px] text-danger">{error}</p>}

        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={handleSave}>
            {mode === 'create' ? 'Save Expense' : 'Save Changes'}
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
}