import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Toggle } from '@/components/common/Toggle';
import type { ProviderInput } from '@/context/ProvidersContext';
import type { BooksAccessLevel, CommissionType, ProviderRole } from '@/types/domain';

const ROLES: { value: ProviderRole; label: string }[] = [
  { value: 'CA', label: 'Chartered Accountant (CA)' },
  { value: 'CS', label: 'Company Secretary (CS)' },
  { value: 'DEV', label: 'Developer (DEV)' },
  { value: 'DES', label: 'Designer (DES)' },
  { value: 'MKT', label: 'Digital Marketer (MKT)' },
  { value: 'HR', label: 'HR Specialist (HR)' },
  { value: 'FSS', label: 'FSSAI Agent (FSS)' },
  { value: 'ISO', label: 'ISO Consultant (ISO)' },
  { value: 'LEG', label: 'Lawyer (LEG)' },
];

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface ProviderOnboardFormProps {
  onSave: (input: ProviderInput) => void;
  onClose: () => void;
}

export function ProviderOnboardForm({ onSave, onClose }: ProviderOnboardFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<ProviderRole>('CA');
  const [commissionType, setCommissionType] = useState<CommissionType>('percent');
  const [commissionValue, setCommissionValue] = useState('');
  const [booksAccessOn, setBooksAccessOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    'rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold';
  const labelClass = 'text-[10px] font-semibold uppercase tracking-wide text-text-muted';

  function handleSubmit() {
    if (!name.trim() || !email.trim() || !mobile.trim() || !commissionValue) {
      setError('Please fill in all required fields.');
      return;
    }
    const booksAccess: BooksAccessLevel = booksAccessOn ? 'scoped' : 'none';
    onSave({
      name,
      initials: deriveInitials(name),
      email,
      mobile,
      role,
      commissionType,
      commissionValue: Number(commissionValue) || 0,
      availability: 'available',
      booksAccess,
      status: 'active',
    });
  }

  return (
    <Card className="mb-3.5">
      <h3 className="mb-3.5 text-[14px] font-semibold text-text-primary">Onboard New Provider</h3>
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ananya Sharma"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Email (Login)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@domain.com"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Mobile</label>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as ProviderRole)}
            className={['cursor-pointer', inputClass].join(' ')}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Commission Type</label>
          <select
            value={commissionType}
            onChange={(e) => setCommissionType(e.target.value as CommissionType)}
            className={['cursor-pointer', inputClass].join(' ')}
          >
            <option value="percent">% per order</option>
            <option value="fixed">Fixed fee per task</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Commission Value</label>
          <input
            type="number"
            value={commissionValue}
            onChange={(e) => setCommissionValue(e.target.value)}
            placeholder="e.g. 15 or 2000"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mb-3.5 flex items-center justify-between rounded-lg border border-border-subtle p-3">
        <div>
          <div className="text-[13px] font-medium text-text-primary">Books &amp; Accounting Access</div>
          <div className="text-[11px] text-text-muted">Grant access to Books module?</div>
        </div>
        <Toggle checked={booksAccessOn} onChange={setBooksAccessOn} label="Books & Accounting Access" />
      </div>

      {error && <p className="mb-3 text-[12px] text-danger">{error}</p>}

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleSubmit}>
          Send Invite &amp; Onboard
        </Button>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}