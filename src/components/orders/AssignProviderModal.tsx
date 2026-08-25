import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { PROVIDER_AVAILABILITY } from '@/constants/mockData';
import { PROVIDER_STATUS_MAP } from '@/utils/statusMaps';
import type { OrderRecord } from '@/types/domain';

interface AssignProviderModalProps {
  order: OrderRecord;
  mode: 'assign' | 'reassign';
  currentProvider: string;
  onClose: () => void;
  onSubmit: (provider: string) => void;
}

export function AssignProviderModal({ order, mode, currentProvider, onClose, onSubmit }: AssignProviderModalProps) {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [error, setError] = useState(false);

  const availableProviders = PROVIDER_AVAILABILITY.filter((p) => p.name !== currentProvider);

  function handleSubmit() {
    if (!selectedProvider) {
      setError(true);
      return;
    }
    onSubmit(selectedProvider);
  }

  return (
    <Modal title={mode === 'assign' ? 'Assign Provider' : 'Reassign Provider'} onClose={onClose}>
      <div className="mb-4 flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-canvas p-3">
        <div className="text-[11px] text-text-muted">
          <span className="font-semibold text-text-primary">{order.orderNo}</span> · {order.client}
        </div>
        <div className="text-[11px] text-text-muted">{order.service} · {order.package}</div>
        <div className="text-[11px] text-text-muted">
          Current Provider: <span className="font-medium text-text-primary">{currentProvider}</span>
        </div>
      </div>

      <div className="mb-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
          Select Provider
        </label>
        <select
          value={selectedProvider}
          onChange={(e) => {
            setSelectedProvider(e.target.value);
            setError(false);
          }}
          className="mt-1.5 w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
        >
          <option value="">Choose a provider...</option>
          {availableProviders.map((p) => (
            <option key={p.name} value={p.name} disabled={p.status !== 'available'}>
              {p.name}
              {p.status !== 'available' ? ` (${PROVIDER_STATUS_MAP[p.status].label})` : ''}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-[11px] text-danger">Please select a provider.</p>}
      </div>

      <p className="mb-4 text-[10px] text-text-muted">
        Note: this assignment is stored for the current session only — no backend is connected yet.
      </p>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={handleSubmit} className="flex-1">
          {mode === 'assign' ? 'Assign Provider' : 'Reassign Provider'}
        </Button>
      </div>
    </Modal>
  );
}