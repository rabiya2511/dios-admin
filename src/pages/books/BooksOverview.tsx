import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/common/Card';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { useInvoices, updateInvoiceStatus } from '@/store/invoicesStore';
import { useBills, updateBillStatus } from '@/store/billsStore';
import { INVOICE_STATUS_MAP, BILL_STATUS_MAP } from '@/utils/statusMaps';
import type { Invoice, Bill } from '@/types/domain';

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function BooksOverview() {
  const navigate = useNavigate();
  const invoices = useInvoices();
  const bills = useBills();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recentInvoices = invoices.slice(0, 4);
  const recentBills = bills.slice(0, 4);

  function handleInvoiceAction(invoice: Invoice) {
    if (invoice.status === 'paid') {
      navigate('/books/invoices');
      return;
    }
    if (invoice.status === 'overdue') {
      // No email/SMS backend exists yet — this simulates the reminder being
      // sent and gives the admin visible confirmation, consistent with how
      // other unconnected actions (e.g. Task Queue assignment) work today.
      setToastMessage(`Reminder sent to ${invoice.client} for ${invoice.invoiceNo}.`);
      return;
    }
    // 'due' or 'scheduled' → record the payment as received.
    updateInvoiceStatus(invoice.id, 'paid');
    setToastMessage(`${invoice.invoiceNo} marked as paid.`);
  }

  function handleBillAction(bill: Bill) {
    if (bill.status === 'due') {
      updateBillStatus(bill.id, 'paid');
      setToastMessage(`${bill.billNo} marked as paid.`);
      return;
    }
    navigate('/books/bills');
  }

  function handleExport() {
    const rows: (string | number)[][] = [
      ['Type', 'Reference', 'Party', 'Amount', 'Due Date', 'Status'],
      ...invoices.map((i) => ['Invoice', i.invoiceNo, i.client, i.total, i.dueDate, INVOICE_STATUS_MAP[i.status].label]),
      ...bills.map((b) => ['Bill', b.billNo, b.vendor, b.total, b.dueDate, BILL_STATUS_MAP[b.status].label]),
    ];
    const dateStamp = new Date().toISOString().slice(0, 10);
    downloadCSV(`accounting-overview-${dateStamp}.csv`, rows);
    setToastMessage('Export downloaded successfully.');
  }

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Accounting Overview"
          subtitle="Financial summary — TechVenture Pvt Ltd · FY 2024–25"
          action={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleExport}>
                Export
              </Button>
              <Button variant="gold" size="sm" onClick={() => navigate('/books/invoices/new')}>
                + New Invoice
              </Button>
            </div>
          }
        />

        <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Revenue" value="₹4.2L" icon="💰" tone="gold" trend="↑ 18% YoY" trendDirection="up" />
          <StatCard label="Outstanding" value="₹84K" icon="⏳" tone="warning" trend="3 invoices due" trendDirection="down" />
          <StatCard label="Total Expenses" value="₹1.8L" icon="📉" tone="danger" trend="This FY" trendDirection="neutral" />
          <StatCard label="Net Profit" value="₹2.4L" icon="📈" tone="success" trend="57% margin" trendDirection="up" />
        </div>

        <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[2fr_1fr]">
          <div className="flex min-w-0 flex-col gap-3.5">
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Recent Invoices
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/books/invoices')}
                  className="text-[11px] font-medium text-gold hover:underline"
                >
                  View all
                </button>
              </div>
              <DataTable<Invoice>
                data={recentInvoices}
                rowKey={(i) => i.id}
                emptyMessage="No invoices yet."
                columns={[
                  { header: 'Invoice', render: (i) => <span className="font-medium">{i.invoiceNo}</span> },
                  { header: 'Client', render: (i) => i.client },
                  { header: 'Amount', render: (i) => `₹${i.total.toLocaleString('en-IN')}` },
                  { header: 'Due Date', render: (i) => i.dueDate },
                  {
                    header: 'Status',
                    render: (i) => {
                      const meta = INVOICE_STATUS_MAP[i.status];
                      return <StatusBadge label={meta.label} tone={meta.tone} />;
                    },
                  },
                  {
                    header: 'Action',
                    render: (i) => (
                      <Button
                        variant={i.status === 'overdue' ? 'danger' : 'secondary'}
                        size="sm"
                        onClick={() => handleInvoiceAction(i)}
                      >
                        {i.status === 'paid' ? 'View' : i.status === 'overdue' ? 'Remind' : 'Record'}
                      </Button>
                    ),
                  },
                ]}
              />
            </Card>

            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Recent Bills
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/books/bills')}
                  className="text-[11px] font-medium text-gold hover:underline"
                >
                  View all
                </button>
              </div>
              <DataTable<Bill>
                data={recentBills}
                rowKey={(b) => b.id}
                emptyMessage="No bills yet."
                columns={[
                  { header: 'Bill #', render: (b) => <span className="font-medium">{b.billNo}</span> },
                  { header: 'Vendor', render: (b) => b.vendor },
                  { header: 'Amount', render: (b) => `₹${b.total.toLocaleString('en-IN')}` },
                  { header: 'Due', render: (b) => b.dueDate },
                  {
                    header: 'Status',
                    render: (b) => {
                      const meta = BILL_STATUS_MAP[b.status];
                      return <StatusBadge label={meta.label} tone={meta.tone} />;
                    },
                  },
                  {
                    header: 'Action',
                    render: (b) => (
                      <Button variant="secondary" size="sm" onClick={() => handleBillAction(b)}>
                        {b.status === 'due' ? 'Pay' : 'View'}
                      </Button>
                    ),
                  },
                ]}
              />
            </Card>
          </div>

          <div className="flex min-w-0 flex-col gap-3.5">
            <Card>
              <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Cash Flow
              </h3>
              <div className="flex flex-col gap-2.5">
                <div>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="text-success">Inflow (Invoices)</span>
                    <span className="font-semibold text-success">₹3.36L</span>
                  </div>
                  <ProgressBar value={80} fillClassName="bg-success-bg border border-[#4CAF50]" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="text-warning">Outflow (Bills)</span>
                    <span className="font-semibold text-warning">₹1.8L</span>
                  </div>
                  <ProgressBar value={43} fillClassName="bg-warning-bg border border-[#FF9800]" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="text-text-primary">Net Balance</span>
                    <span className="font-bold text-text-primary">₹1.56L</span>
                  </div>
                  <ProgressBar value={37} />
                </div>
              </div>
              <div className="mt-3.5 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-success-bg p-2.5 text-center">
                  <div className="mb-1 text-[10px] font-semibold text-success">RECEIVABLE</div>
                  <div className="text-base font-bold text-success">₹84K</div>
                </div>
                <div className="rounded-lg bg-warning-bg p-2.5 text-center">
                  <div className="mb-1 text-[10px] font-semibold text-warning">PAYABLE</div>
                  <div className="text-base font-bold text-warning">₹31K</div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Tax Summary
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-lg bg-canvas px-2.5 py-1.5 text-[12px]">
                  <span className="text-text-primary">GST Collected</span>
                  <span className="font-semibold text-text-primary">₹63,600</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-canvas px-2.5 py-1.5 text-[12px]">
                  <span className="text-text-primary">GST Paid</span>
                  <span className="font-semibold text-text-primary">₹27,200</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gold-tint px-2.5 py-1.5 text-[12px]">
                  <span className="font-semibold text-text-primary">Net GST Liability</span>
                  <span className="font-bold text-[#7A5800]">₹36,400</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-info-bg px-2.5 py-1.5 text-[12px]">
                  <span className="text-text-primary">TDS Deducted</span>
                  <span className="font-semibold text-info">₹12,400</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
    </div>
  );
}