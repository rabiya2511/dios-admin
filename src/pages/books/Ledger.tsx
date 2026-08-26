import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TabRow } from '@/components/common/TabRow';
import { useLedger } from '@/hooks/useLedger';
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

const ACCOUNT_TYPES: AccountType[] = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];

const EMPTY_ACCOUNT_FORM = {
  code: '',
  name: '',
  type: 'Asset' as AccountType,
  debit: '',
  credit: '',
  status: 'Active' as 'Active' | 'Inactive',
};

function formatINR(n: number): string {
  return n.toLocaleString('en-IN');
}

function validateAccountForm(form: typeof EMPTY_ACCOUNT_FORM): string {
  if (!form.code.trim()) return 'Account code is required.';
  if (!form.name.trim()) return 'Account name is required.';
  if (form.debit && (Number.isNaN(Number(form.debit)) || Number(form.debit) < 0)) {
    return 'Debit must be a valid non-negative number.';
  }
  if (form.credit && (Number.isNaN(Number(form.credit)) || Number(form.credit) < 0)) {
    return 'Credit must be a valid non-negative number.';
  }
  return '';
}

export default function Ledger() {
  const { accounts, addAccount } = useLedger();
  const [activeTab, setActiveTab] = useState<LedgerTab>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_ACCOUNT_FORM);
  const [formError, setFormError] = useState('');

  const filteredAccounts = useMemo(() => {
    if (activeTab === 'all') return accounts;
    return accounts.filter((a) => a.type === activeTab);
  }, [activeTab, accounts]);

  const debitPreview = Number(addForm.debit) || 0;
  const creditPreview = Number(addForm.credit) || 0;
  const balancePreview = Math.abs(debitPreview - creditPreview);

  function handleAddAccount() {
    const error = validateAccountForm(addForm);
    if (error) {
      setFormError(error);
      return;
    }
    addAccount({
      code: addForm.code,
      name: addForm.name,
      type: addForm.type,
      status: addForm.status,
      openingDebit: debitPreview,
      openingCredit: creditPreview,
    });
    setAddForm(EMPTY_ACCOUNT_FORM);
    setFormError('');
    setShowAddForm(false);
  }

  function cancelAddAccount() {
    setAddForm(EMPTY_ACCOUNT_FORM);
    setFormError('');
    setShowAddForm(false);
  }

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Chart of Accounts"
          subtitle="View all ledger accounts and balances"
          action={
            <Button variant="primary" size="sm" onClick={() => setShowAddForm((v) => !v)}>
              + New Account
            </Button>
          }
        />

        {showAddForm && (
          <Card className="mb-3.5">
            <h3 className="mb-3.5 text-[14px] font-semibold text-text-primary">Add New Account</h3>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Account Code
                </label>
                <input
                  value={addForm.code}
                  onChange={(e) => setAddForm((f) => ({ ...f, code: e.target.value }))}
                  placeholder="e.g. 1300"
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Account Name
                </label>
                <input
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Prepaid Expenses"
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Type
                </label>
                <select
                  value={addForm.type}
                  onChange={(e) => setAddForm((f) => ({ ...f, type: e.target.value as AccountType }))}
                  className="cursor-pointer rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Debit (₹)
                </label>
                <input
                  type="number"
                  value={addForm.debit}
                  onChange={(e) => setAddForm((f) => ({ ...f, debit: e.target.value }))}
                  placeholder="0"
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Credit (₹)
                </label>
                <input
                  type="number"
                  value={addForm.credit}
                  onChange={(e) => setAddForm((f) => ({ ...f, credit: e.target.value }))}
                  placeholder="0"
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Status
                </label>
                <select
                  value={addForm.status}
                  onChange={(e) => setAddForm((f) => ({ ...f, status: e.target.value as 'Active' | 'Inactive' }))}
                  className="cursor-pointer rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mb-3.5 text-[12px] text-text-muted">
              Balance: <span className="font-semibold text-text-primary">₹{formatINR(balancePreview)}</span>
            </div>
            {formError && <p className="mb-3.5 text-[11px] text-danger">{formError}</p>}
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleAddAccount}>
                Save Account
              </Button>
              <Button variant="secondary" size="sm" onClick={cancelAddAccount}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

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