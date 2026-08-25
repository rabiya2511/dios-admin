import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/common/FormField';
import { Toast } from '@/components/common/Toast';
import { useInvoices } from '@/hooks/useInvoices';

interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  gstPercent: number;
}

let nextId = 2;

function formatINR(n: number): string {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function formatDate(value: string): string {
  if (!value) return '';
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Matches the short "Mon Day" format used by existing invoice mock data (no year).
function formatDueDateShort(value: string): string {
  if (!value) return '';
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { addInvoice } = useInvoices();
  const previewRef = useRef<HTMLDivElement>(null);

  const [invoiceNumber, setInvoiceNumber] = useState('INV-0025');
  const [invoiceDate, setInvoiceDate] = useState('2024-03-15');
  const [dueDate, setDueDate] = useState('2024-03-30');
  const [paymentTerms, setPaymentTerms] = useState('Net 15');

  const [clientName, setClientName] = useState('Rajesh Kumar');
  const [company, setCompany] = useState('TechVenture Pvt Ltd');
  const [gstin, setGstin] = useState('');
  const [email, setEmail] = useState('rajesh@techventure.in');

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 'li1', description: 'Company Registration – Growth', qty: 1, rate: 9999, gstPercent: 18 },
  ]);

  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function updateLineItem<K extends keyof LineItem>(id: string, field: K, value: LineItem[K]) {
    setLineItems((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function addLineItem() {
    nextId += 1;
    setLineItems((items) => [...items, { id: `li${nextId}`, description: '', qty: 1, rate: 0, gstPercent: 18 }]);
  }

  function removeLineItem(id: string) {
    setLineItems((items) => items.filter((item) => item.id !== id));
  }

  const itemsWithTotals = useMemo(
    () =>
      lineItems.map((item) => {
        const amount = item.qty * item.rate;
        const gstAmount = amount * (item.gstPercent / 100);
        return { ...item, amount, gstAmount, total: amount + gstAmount };
      }),
    [lineItems],
  );

  const subtotal = itemsWithTotals.reduce((sum, i) => sum + i.amount, 0);
  const gstTotal = itemsWithTotals.reduce((sum, i) => sum + i.gstAmount, 0);
  const grandTotal = subtotal + gstTotal;
  const commonGstPercent = lineItems.every((i) => i.gstPercent === lineItems[0]?.gstPercent)
    ? lineItems[0]?.gstPercent
    : null;
  const gstLabel = commonGstPercent !== null ? `GST (${commonGstPercent}%)` : 'GST';

  function handlePreview() {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleSaveAndSend() {
    if (!clientName.trim()) {
      setFormError('Client name is required.');
      return;
    }
    if (lineItems.length === 0 || lineItems.every((i) => !i.description.trim())) {
      setFormError('Add at least one line item with a description.');
      return;
    }
    if (!dueDate) {
      setFormError('Due date is required.');
      return;
    }

    setFormError(null);

    const serviceLabel =
      itemsWithTotals.length === 1
        ? itemsWithTotals[0].description || 'Service'
        : `${itemsWithTotals[0].description || 'Service'} +${itemsWithTotals.length - 1} more`;

    addInvoice({
      client: clientName,
      service: serviceLabel,
      amount: subtotal,
      gst: gstTotal,
      total: grandTotal,
      dueDate: formatDueDateShort(dueDate),
      status: 'due',
    });

    setToastMessage('Invoice created and sent successfully.');
    setTimeout(() => navigate('/books/invoices'), 900);
  }

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Create Invoice"
          subtitle="Fill in details to generate a GST-compliant invoice"
          action={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handlePreview}>
                Preview
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveAndSend}>
                Save &amp; Send
              </Button>
            </div>
          }
        />

        {formError && (
          <div className="mb-3.5 rounded-lg border border-danger/20 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
          {/* LEFT: form */}
          <div className="flex flex-col gap-3">
            <Card>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Invoice Details
              </h3>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <FormField label="Invoice Number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                <FormField label="Invoice Date" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">Payment Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                  >
                    <option>Net 15</option>
                    <option>Net 30</option>
                    <option>Immediate</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Bill To</h3>
              <div className="mb-3">
                <FormField label="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div className="mb-3">
                <FormField label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="GSTIN" placeholder="27AABCS1429B1ZB" value={gstin} onChange={(e) => setGstin(e.target.value)} />
                <FormField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Line Items</h3>
                <Button variant="secondary" size="sm" onClick={addLineItem}>
                  + Add Item
                </Button>
              </div>
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr>
                    <th className="w-[35%] border-b border-border-subtle px-2 pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      Description
                    </th>
                    <th className="w-[12%] border-b border-border-subtle px-2 pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      Qty
                    </th>
                    <th className="w-[18%] border-b border-border-subtle px-2 pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      Rate (₹)
                    </th>
                    <th className="w-[12%] border-b border-border-subtle px-2 pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      GST%
                    </th>
                    <th className="w-[15%] border-b border-border-subtle px-2 pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      Total
                    </th>
                    <th className="w-[8%] border-b border-border-subtle pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {itemsWithTotals.map((item) => (
                    <tr key={item.id}>
                      <td className="border-b border-border-subtle px-2 py-2">
                        <input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          className="w-full rounded-md border border-border-subtle bg-canvas px-2 py-1.5 text-[11px] text-text-primary outline-none focus:border-gold"
                        />
                      </td>
                      <td className="border-b border-border-subtle px-2 py-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateLineItem(item.id, 'qty', Number(e.target.value))}
                          className="w-full rounded-md border border-border-subtle bg-canvas px-2 py-1.5 text-center text-[11px] text-text-primary outline-none focus:border-gold"
                        />
                      </td>
                      <td className="border-b border-border-subtle px-2 py-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value))}
                          className="w-full rounded-md border border-border-subtle bg-canvas px-2 py-1.5 text-right text-[11px] text-text-primary outline-none focus:border-gold"
                        />
                      </td>
                      <td className="border-b border-border-subtle px-2 py-2">
                        <select
                          value={item.gstPercent}
                          onChange={(e) => updateLineItem(item.id, 'gstPercent', Number(e.target.value))}
                          className="w-full rounded-md border border-border-subtle bg-canvas px-1 py-1.5 text-[11px] text-text-primary outline-none focus:border-gold"
                        >
                          <option value={18}>18</option>
                          <option value={12}>12</option>
                          <option value={5}>5</option>
                          <option value={0}>0</option>
                        </select>
                      </td>
                      <td className="border-b border-border-subtle px-2 py-2 text-[12px] font-medium">
                        {formatINR(item.total)}
                      </td>
                      <td className="border-b border-border-subtle px-2 py-2">
                        <Button variant="danger" size="sm" onClick={() => removeLineItem(item.id)}>
                          ✕
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-3.5 border-t border-border-subtle pt-3">
                <div className="ml-auto flex max-w-[220px] flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span>{gstLabel}</span>
                    <span>{formatINR(gstTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border-subtle pt-1.5 text-[14px] font-bold">
                    <span>Total</span>
                    <span className="text-gold">{formatINR(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT: live preview */}
          <div ref={previewRef}>
            <Card>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Invoice Preview
              </h3>
              <div className="rounded-xl border border-border-subtle bg-surface p-6">
                <div className="mb-5 flex items-start justify-between border-b-2 border-navy pb-4">
                  <div>
                    <div className="font-display text-lg font-bold text-navy">StartupSaaS</div>
                    <div className="mt-0.5 text-[11px] text-text-muted">support@startupsaas.in</div>
                    <div className="text-[11px] text-text-muted">GSTIN: 27AABCS1429B1ZB</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[22px] font-bold text-text-primary">INVOICE</div>
                    <div className="mt-0.5 text-[12px] text-text-muted">{invoiceNumber}</div>
                    <div className="mt-0.5 text-[11px] text-text-muted">Due: {formatDate(dueDate)}</div>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">Bill To</div>
                    <div className="text-[11px] font-medium text-text-primary">{clientName}</div>
                    <div className="text-[11px] text-text-muted">{company}</div>
                  </div>
                  <div className="text-right">
                    <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">Invoice Date</div>
                    <div className="text-[11px] font-medium text-text-primary">{formatDate(invoiceDate)}</div>
                  </div>
                </div>

                <table className="mb-4 w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-border-subtle py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Description
                      </th>
                      <th className="border-b border-border-subtle py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Qty
                      </th>
                      <th className="border-b border-border-subtle py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Rate
                      </th>
                      <th className="border-b border-border-subtle py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        GST
                      </th>
                      <th className="border-b border-border-subtle py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsWithTotals.map((item) => (
                      <tr key={item.id}>
                        <td className="border-b border-border-subtle py-2 text-[12px]">{item.description}</td>
                        <td className="border-b border-border-subtle py-2 text-right text-[12px]">{item.qty}</td>
                        <td className="border-b border-border-subtle py-2 text-right text-[12px]">{formatINR(item.rate)}</td>
                        <td className="border-b border-border-subtle py-2 text-right text-[12px]">{formatINR(item.gstAmount)}</td>
                        <td className="border-b border-border-subtle py-2 text-right text-[12px] font-semibold">
                          {formatINR(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="ml-auto w-[240px]">
                  <div className="flex items-center justify-between py-1 text-[12px]">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 text-[12px]">
                    <span>{gstLabel}</span>
                    <span>{formatINR(gstTotal)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-navy pt-2 text-[14px] font-bold">
                    <span>Total Due</span>
                    <span>{formatINR(grandTotal)}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-border-subtle pt-3 text-[11px] text-text-muted">
                  Thank you for your business. Payment due within 15 days.
                </div>
              </div>
            </Card>
          </div>
        </div>

        {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
      </div>
    </div>
  );
}