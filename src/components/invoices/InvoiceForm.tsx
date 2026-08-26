import { useMemo, useState } from 'react';
import { Drawer } from '@/components/common/Drawer';
import { Button } from '@/components/common/Button';
import type { InvoiceInput } from '@/context/InvoicesContext';
import type { InvoiceStatus } from '@/types/domain';

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: 'due', label: 'Due' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'scheduled', label: 'Scheduled' },
];
const GST_RATE = 18;

function fmtINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

interface InvoiceFormProps {
  onSave: (input: InvoiceInput) => void;
  onClose: () => void;
}

export function InvoiceForm({ onSave, onClose }: InvoiceFormProps) {
  const [client, setClient] = useState('');
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState(GST_RATE);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>('due');
  const [error, setError] = useState<string | null>(null);

  const amountNum = Number(amount) || 0;
  const gst = useMemo(() => Math.round(amountNum * (gstRate / 100)), [amountNum, gstRate]);
  const total = amountNum + gst;

  const inputClass =
    'rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold';
  const labelClass = 'text-[10px] font-semibold uppercase tracking-wide text-text-muted';

  function handleSave() {
    if (!client.trim() || !service.trim() || amountNum <= 0 || !dueDate.trim()) {
      setError('Client, service, amount and due date are required.');
      return;
    }
    onSave({ client, service, amount: amountNum, gst, total, dueDate, status });
  }

  return (
    <Drawer title="New Invoice" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Client</label>
          <input value={client} onChange={(e) => setClient(e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Service</label>
          <input value={service} onChange={(e) => setService(e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>GST (%)</label>
            <select
              value={gstRate}
              onChange={(e) => setGstRate(Number(e.target.value))}
              className={['cursor-pointer', inputClass].join(' ')}
            >
              {[0, 5, 12, 18, 28].map((r) => (
                <option key={r} value={r}>{r}%</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
              className={['cursor-pointer', inputClass].join(' ')}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg bg-canvas p-3 text-[12px]">
          <div className="flex justify-between text-text-muted">
            <span>Amount</span>
            <span>{fmtINR(amountNum)}</span>
          </div>
          <div className="mt-1 flex justify-between text-text-muted">
            <span>GST ({gstRate}%)</span>
            <span>{fmtINR(gst)}</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-border-subtle pt-1.5 font-semibold text-text-primary">
            <span>Total</span>
            <span>{fmtINR(total)}</span>
          </div>
        </div>

        {error && <p className="text-[12px] text-danger">{error}</p>}

        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={handleSave}>
            Create Invoice
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
}