import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { PROVIDER_AVAILABILITY, PROVIDER_CONTACTS } from '@/constants/mockData';
import { PROVIDER_STATUS_MAP } from '@/utils/statusMaps';
import type { UnassignedTask } from '@/types/domain';

interface AssignTaskModalProps {
  task: UnassignedTask;
  onClose: () => void;
  onAssigned: (providerName: string) => void;
}

export function AssignTaskModal({ task, onClose, onAssigned }: AssignTaskModalProps) {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [sent, setSent] = useState(false);

  const contact = selectedProvider ? PROVIDER_CONTACTS[selectedProvider] : undefined;

  function handleSend() {
    if (!selectedProvider) return;
    setSent(true);
  }

  function handleDone() {
    onAssigned(selectedProvider);
    onClose();
  }

  return (
    <Modal title="Assign Task" onClose={onClose}>
      <div className="mb-4">
        <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Task</div>
        <div className="mt-1 text-[13px] font-medium text-text-primary">{task.task}</div>
        <div className="mt-0.5 text-[11px] text-text-muted">Client: {task.client}</div>
      </div>

      {!sent ? (
        <>
          <div className="mb-4">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
              Select Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            >
              <option value="">Choose a provider...</option>
              {PROVIDER_AVAILABILITY.map((p) => (
                <option key={p.name} value={p.name} disabled={p.status !== 'available'}>
                  {p.name}
                  {p.status !== 'available' ? ` (${PROVIDER_STATUS_MAP[p.status].label})` : ''}
                </option>
              ))}
            </select>
          </div>

          {contact && (
            <div className="mb-4 rounded-lg border border-border-subtle bg-canvas p-3">
              <div className="text-[11px] text-text-primary">📧 {contact.email}</div>
              <div className="mt-1 text-[11px] text-text-primary">📞 {contact.phone}</div>
            </div>
          )}

          <Button variant="primary" size="sm" onClick={handleSend} disabled={!selectedProvider} className="w-full">
            Send Assignment
          </Button>
        </>
      ) : (
        <>
          <div className="mb-4 rounded-lg border border-success/20 bg-success-bg p-3 text-[12px] text-success">
            ✓ Task assigned to {selectedProvider}. Email notification sent to {contact?.email}.
          </div>
          <Button variant="primary" size="sm" onClick={handleDone} className="w-full">
            Done
          </Button>
        </>
      )}
    </Modal>
  );
}