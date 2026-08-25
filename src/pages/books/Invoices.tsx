import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TabRow } from '@/components/common/TabRow';
import { Modal } from '@/components/common/Modal';
import { useInvoices, addInvoice } from '@/store/invoicesStore';
import { INVOICE_STATUS_MAP } from '@/utils/statusMaps';
import type { Invoice, InvoiceStatus } from '@/types/domain';

type InvoiceTab = 'all' | 'paid' | 'due' | 'overdue';

const TABS: { id: InvoiceTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'due', label: 'Outstanding' },
  { id: 'overdue', label: 'Overdue' },
];

const GST_RATE = 0.18;

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

function downloadInvoicesCSV(invoices: Invoice[]) {
  const header = ['Invoice #', 'Client', 'Service', 'Amount', 'GST', 'Total', 'Due Date', 'Status'];
  const rows = invoices.map((i) => [
    i.invoiceNo,
    i.client,
    i.service,
    i.amount,
    i.gst,
    i.total,
    i.dueDate,
    INVOICE_STATUS_MAP[i.status].label,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'invoices.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface NewInvoiceFormState {
  client: string;
  service: string;
  amount: string;
  dueDate: string;
  status: InvoiceStatus;
}

const EMPTY_FORM: NewInvoiceFormState = {
  client: '',
  service: '',
  amount: '',
  dueDate: '',
  status: 'due',
};

function NewInvoiceModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<NewInvoiceFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const amountNum = parseFloat(form.amount) || 0;
  const gst = Math.round(amountNum * GST_RATE);
  const total = amountNum + gst;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.client.trim() || !form.service.trim() || !form.amount || !form.dueDate.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (amountNum <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    addInvoice({
      client: form.client.trim(),
      service: form.service.trim(),
      amount: amountNum,
      gst,
      dueDate: form.dueDate.trim(),
      status: form.status,
    });
    onClose();
  }

  return (
    <Modal title="Create New Invoice" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-lg bg-danger-bg px-3 py-2 text-[12px] text-danger">{error}</div>
        )}

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Client *</label>
          <input
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Service *</label>
          <input
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
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
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Due Date *</label>
            <input
              placeholder="e.g. Apr 15"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">GST (18%)</label>
            <div className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-muted">
              {formatINR(gst)}
            </div>
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
            onChange={(e) => setForm({ ...form, status: e.target.value as InvoiceStatus })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          >
            <option value="paid">Paid</option>
            <option value="due">Due</option>
            <option value="overdue">Overdue</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Create Invoice
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Invoices() {
  const invoices = useInvoices();
  const [activeTab, setActiveTab] = useState<InvoiceTab>('all');
  const [search, setSearch] = useState('');
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesTab =
        activeTab === 'all' || (activeTab === 'due' ? inv.status === 'due' : inv.status === activeTab);
      const matchesSearch =
        inv.client.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoiceNo.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [invoices, activeTab, search]);

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Invoices"
          subtitle="Manage all outgoing invoices and track payments"
          action={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => downloadInvoicesCSV(filteredInvoices)}>
                Export CSV
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowNewInvoiceModal(true)}>
                + New Invoice
              </Button>
            </div>
          }
        />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Total Invoiced</div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">₹4.2L</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Paid</div>
            <div className="mt-2 font-display text-2xl font-bold text-success">₹3.36L</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Outstanding</div>
            <div className="mt-2 font-display text-2xl font-bold text-warning">₹84K</div>
          </Card>
          <Card>
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Overdue</div>
            <div className="mt-2 font-display text-2xl font-bold text-danger">₹14.7K</div>
          </Card>
        </div>

        <Card>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <TabRow tabs={TABS} active={activeTab} onChange={setActiveTab} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="ml-auto w-[200px] rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>

          <DataTable<Invoice>
            data={filteredInvoices}
            rowKey={(i) => i.id}
            emptyMessage="No invoices match your filters."
            columns={[
              { header: 'Invoice #', render: (i) => <span className="font-semibold text-info">{i.invoiceNo}</span> },
              { header: 'Client', render: (i) => i.client },
              { header: 'Service', render: (i) => i.service },
              { header: 'Amount', render: (i) => formatINR(i.amount) },
              { header: 'GST', render: (i) => formatINR(i.gst) },
              { header: 'Total', render: (i) => <span className="font-semibold">{formatINR(i.total)}</span> },
              { header: 'Due Date', render: (i) => i.dueDate },
              {
                header: 'Status',
                render: (i) => {
                  const meta = INVOICE_STATUS_MAP[i.status];
                  return <StatusBadge label={meta.label} tone={meta.tone} />;
                },
              },
            ]}
          />
        </Card>
      </div>

      {showNewInvoiceModal && <NewInvoiceModal onClose={() => setShowNewInvoiceModal(false)} />}
    </div>
  );
}
