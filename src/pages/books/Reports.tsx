import { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

interface LineRowProps {
  label: string;
  value?: string;
  indentClass?: string;
  bold?: boolean;
  textColor?: string;
  rowBg?: string;
  valueSize?: string;
}

function LineRow({ label, value, indentClass = '', bold = false, textColor = '', rowBg = '', valueSize = '' }: LineRowProps) {
  return (
    <tr className={rowBg}>
      <td className={['border-b border-border-subtle px-3 py-2.5 text-[12px]', indentClass, bold ? 'font-semibold' : '', textColor].join(' ')}>
        {label}
      </td>
      <td className={['border-b border-border-subtle px-3 py-2.5 text-right text-[12px]', bold ? 'font-bold' : '', textColor, valueSize].join(' ')}>
        {value}
      </td>
    </tr>
  );
}

function TableHead({ left, right }: { left: string; right: string }) {
  return (
    <thead>
      <tr>
        <th className="border-b border-border-subtle px-3 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {left}
        </th>
        <th className="border-b border-border-subtle px-3 pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {right}
        </th>
      </tr>
    </thead>
  );
}

export default function Reports() {
  const [fy, setFy] = useState('FY 2024–25');

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Financial Reports"
          subtitle="P&L, Balance Sheet, GST reports for TechVenture Pvt Ltd"
          action={
            <div className="flex gap-2">
              <select
                value={fy}
                onChange={(e) => setFy(e.target.value)}
                className="w-[140px] rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
              >
                <option>FY 2024–25</option>
                <option>FY 2023–24</option>
              </select>
              <Button variant="secondary" size="sm">
                Export PDF
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
          <Card>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Profit &amp; Loss Statement
            </h3>
            <table className="w-full table-fixed border-collapse">
              <TableHead left="Particulars" right="Amount (₹)" />
              <tbody>
                <LineRow label="Revenue" bold textColor="text-success" />
                <LineRow label="Service Revenue" value="4,20,000" indentClass="pl-6" />
                <LineRow label="Total Revenue" value="4,20,000" indentClass="pl-6" bold textColor="text-success" />
                <LineRow label="Expenses" bold textColor="text-warning" />
                <LineRow label="Provider Payouts" value="1,10,000" indentClass="pl-6" />
                <LineRow label="Infrastructure" value="42,000" indentClass="pl-6" />
                <LineRow label="Marketing" value="28,000" indentClass="pl-6" />
                <LineRow label="Salaries" value="60,000" indentClass="pl-6" />
                <LineRow label="Total Expenses" value="2,40,000" indentClass="pl-6" bold textColor="text-warning" />
                <LineRow
                  label="Net Profit"
                  value="1,80,000"
                  bold
                  rowBg="bg-gold-tint"
                  textColor="text-[#7A5800]"
                  valueSize="text-[14px]"
                />
              </tbody>
            </table>
          </Card>

          <div className="flex flex-col gap-3">
            <Card>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Balance Sheet Summary
              </h3>
              <table className="w-full table-fixed border-collapse">
                <TableHead left="Item" right="₹" />
                <tbody>
                  <LineRow label="Assets" bold />
                  <LineRow label="Cash & Bank" value="2,40,000" indentClass="pl-4" />
                  <LineRow label="Receivables" value="84,000" indentClass="pl-4" />
                  <LineRow label="Total Assets" value="3,24,000" indentClass="pl-4" bold />
                  <LineRow label="Liabilities" bold />
                  <LineRow label="Payables" value="31,000" indentClass="pl-4" />
                  <LineRow label="GST Payable" value="36,400" indentClass="pl-4" />
                  <LineRow label="Total Liabilities" value="67,400" indentClass="pl-4" bold />
                  <LineRow label="Net Worth" value="2,56,600" bold rowBg="bg-info-bg" textColor="text-info" />
                </tbody>
              </table>
            </Card>

            <Card>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                GST Report (Q4)
              </h3>
              <div className="flex flex-col gap-[7px]">
                <div className="flex items-center justify-between rounded-[7px] bg-canvas px-2.5 py-2 text-[12px]">
                  <span>Output GST (Collected)</span>
                  <span className="font-semibold">₹63,600</span>
                </div>
                <div className="flex items-center justify-between rounded-[7px] bg-canvas px-2.5 py-2 text-[12px]">
                  <span>Input GST (Paid)</span>
                  <span className="font-semibold">₹27,200</span>
                </div>
                <div className="flex items-center justify-between rounded-[7px] bg-gold-tint px-2.5 py-2 text-[12px]">
                  <span className="font-semibold">Net GST Due</span>
                  <span className="font-bold text-[#7A5800]">₹36,400</span>
                </div>
                <div className="flex items-center justify-between rounded-[7px] bg-info-bg px-2.5 py-2 text-[12px]">
                  <span>GSTR-1 Due Date</span>
                  <span className="font-semibold text-info">April 11</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}