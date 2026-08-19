import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TabRow } from '@/components/common/TabRow';
import { INVOICES } from '@/constants/mockData';
import { INVOICE_STATUS_MAP } from '@/utils/statusMaps';
import type { Invoice } from '@/types/domain';

type InvoiceTab = 'all' | 'paid' | 'due' | 'overdue';

const TABS: { id: InvoiceTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'due', label: 'Outstanding' },
  { id: 'overdue', label: 'Overdue' },
];

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function Invoices() {
  const [activeTab, setActiveTab] = useState<InvoiceTab>('all');
  const [search, setSearch] = useState('');

  const filteredInvoices = useMemo(() => {
    return INVOICES.filter((inv) => {
      const matchesTab =
        activeTab === 'all' || (activeTab === 'due' ? inv.status === 'due' : inv.status === activeTab);
      const matchesSearch =
        inv.client.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoiceNo.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Invoices"
          subtitle="Manage all outgoing invoices and track payments"
          action={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Export CSV
              </Button>
              <Button variant="primary" size="sm">
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
    </div>
  );
}