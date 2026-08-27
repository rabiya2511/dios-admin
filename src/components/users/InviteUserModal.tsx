import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import type { NewUserInput } from '@/context/UsersContext';

interface FormState {
  name: string;
  email: string;
}

const EMPTY_FORM: FormState = { name: '', email: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteUserModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (input: NewUserInput) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    onInvite({ name: form.name.trim(), email: form.email.trim() });
  }

  return (
    <Modal title="Invite User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="rounded-lg bg-danger-bg px-3 py-2 text-[12px] text-danger">{error}</div>}

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Vikram Nair"
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="e.g. vikram@company.com"
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Send Invite
          </Button>
        </div>
      </form>
    </Modal>
  );
}