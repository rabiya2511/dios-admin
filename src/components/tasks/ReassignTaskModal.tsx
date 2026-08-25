import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PROVIDER_AVAILABILITY, PROVIDER_CONTACTS } from '@/constants/mockData';
import { PROVIDER_STATUS_MAP, TASK_STATUS_MAP } from '@/utils/statusMaps';
import type { TaskRecord } from '@/types/domain';

interface ReassignTaskModalProps {
  task: TaskRecord;
  onClose: () => void;
  onReassigned: (providerName: string) => void;
}

export function ReassignTaskModal({ task, onClose, onReassigned }: ReassignTaskModalProps) {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [sent, setSent] = useState(false);

  const availableProviders = PROVIDER_AVAILABILITY.filter((p) => p.name !== task.provider);
  const contact = selectedProvider ? PROVIDER_CONTACTS[selectedProvider] : undefined;

  function handleSend() {
    if (!selectedProvider) return;
    setSent(true);
  }

  function handleDone() {
    onReassigned(selectedProvider);
    onClose();
  }

  return (
    <Modal title="Reassign Task" onClose={onClose}>
      <div className="mb-4 flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-canvas p-3">
        <div className="text-[11px] text-text-muted">
          <span className="font-semibold text-text-primary">{task.ref}</span> · {task.service}
        </div>
        <div className="text-[11px] text-text-muted">Client: {task.client}</div>
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
          Current Provider: <span className="font-medium text-text-primary">{task.provider}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
          Previous Status: <StatusBadge label={TASK_STATUS_MAP.rejected.label} tone={TASK_STATUS_MAP.rejected.tone} />
        </div>
      </div>

      {!sent ? (
        <>
          <div className="mb-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
              Select Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
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
          </div>

          {contact && (
            <div className="mb-4 mt-3 rounded-lg border border-border-subtle bg-canvas p-3">
              <div className="text-[11px] text-text-primary">📧 {contact.email}</div>
              <div className="mt-1 text-[11px] text-text-primary">📞 {contact.phone}</div>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSend} disabled={!selectedProvider} className="flex-1">
              Reassign Task
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 rounded-lg border border-success/20 bg-success-bg p-3 text-[12px] text-success">
            ✓ Task reassigned to {selectedProvider}. Email notification sent to {contact?.email}.
          </div>
          <Button variant="primary" size="sm" onClick={handleDone} className="w-full">
            Done
          </Button>
        </>
      )}
    </Modal>
  );
}