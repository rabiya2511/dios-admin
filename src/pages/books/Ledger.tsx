import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TabRow } from '@/components/common/TabRow';
import { LEDGER_ACCOUNTS } from '@/constants/mockData';
import type { AccountType, LedgerAccount } from '@/types/domain';

type LedgerTab = 'all' | 'Asset' | 'Liability' | 'Income' | 'Expense';

const TABS: { id: LedgerTab; label: string }[] = [
  { id: 'all', label: 'All Accounts' },
  { id: 'Asset', label: 'Assets' },
  { id: 'Liability', label: 'Liabilities' },
  { id: 'Income', label: 'Income' },
  { id: 'Expense', label: 'Expenses' },
];

const TYPE_TONE: Record<AccountType, 'green' | 'red' | 'blue' | 'orange' | 'gold'> = {
  Asset: 'green',
  Liability: 'red',
  Equity: 'gold',
  Income: 'blue',
  Expense: 'orange',
};

const BALANCE_COLOR: Record<LedgerAccount['balanceTone'], string> = {
  success: 'text-success',
  danger: 'text-danger',
  info: 'text-info',
  warning: 'text-warning',
};

function formatINR(n: number): string {
  return n.toLocaleString('en-IN');
}

export default function Ledger() {
  const [activeTab, setActiveTab] = useState<LedgerTab>('all');

  const filteredAccounts = useMemo(() => {
    if (activeTab === 'all') return LEDGER_ACCOUNTS;
    return LEDGER_ACCOUNTS.filter((a) => a.type === activeTab);
  }, [activeTab]);

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Chart of Accounts"
          subtitle="View all ledger accounts and balances"
          action={
            <Button variant="primary" size="sm">
              + New Account
            </Button>
          }
        />

        <Card>
          <TabRow tabs={TABS} active={activeTab} onChange={setActiveTab} />

          <DataTable<LedgerAccount>
            data={filteredAccounts}
            rowKey={(a) => a.id}
            emptyMessage="No accounts in this category."
            columns={[
              { header: 'Code', render: (a) => <span className="font-mono text-[11px]">{a.code}</span> },
              { header: 'Account Name', render: (a) => a.name },
              { header: 'Type', render: (a) => <StatusBadge label={a.type} tone={TYPE_TONE[a.type]} /> },
              { header: 'Debit (₹)', render: (a) => a.debit },
              { header: 'Credit (₹)', render: (a) => a.credit },
              {
                header: 'Balance (₹)',
                render: (a) => (
                  <span className={['font-semibold', BALANCE_COLOR[a.balanceTone]].join(' ')}>
                    {formatINR(a.balance)}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}