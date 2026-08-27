import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ADMIN_PROVIDERS } from '@/constants/mockData';
import type { ServiceCategory, TaskPriority, TaskRecord } from '@/types/domain';

const CATEGORIES: ServiceCategory[] = ['Legal', 'Design', 'Tech', 'Finance', 'Food & ISO'];
const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low'];

const CATEGORY_TONE: Record<ServiceCategory, TaskRecord['categoryTone']> = {
  Legal: 'gray',
  Design: 'orange',
  Tech: 'blue',
  Finance: 'green',
  'Food & ISO': 'orange',
};

const CATEGORY_PREFIX: Record<ServiceCategory, string> = {
  Legal: 'LEG',
  Design: 'DES',
  Tech: 'DEV',
  Finance: 'CA',
  'Food & ISO': 'FSS',
};

let refCounter = 200;
function generateRef(category: ServiceCategory): string {
  refCounter += 1;
  return `PRV-${CATEGORY_PREFIX[category]}-2026-${String(refCounter).padStart(4, '0')}`;
}

interface FormState {
  service: string;
  client: string;
  category: ServiceCategory;
  priority: TaskPriority;
  dueDate: string;
  estimatedTime: string;
  description: string;
  provider: string; // '' means leave unassigned
}

const EMPTY_FORM: FormState = {
  service: '',
  client: '',
  category: 'Legal',
  priority: 'Medium',
  dueDate: '',
  estimatedTime: '',
  description: '',
  provider: '',
};

export function CreateTaskModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (task: TaskRecord) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const activeProviders = ADMIN_PROVIDERS.filter((p) => p.status === 'active');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.service.trim() || !form.client.trim() || !form.dueDate.trim()) {
      setError('Task, client, and due date are required.');
      return;
    }

    const isAssigned = form.provider !== '';
    const newTask: TaskRecord = {
      id: `tq-custom-${Date.now()}`,
      ref: isAssigned ? generateRef(form.category) : 'Unassigned',
      service: form.service.trim(),
      client: form.client.trim(),
      provider: isAssigned ? form.provider : '—',
      acceptStatus: isAssigned ? 'pending' : 'unassigned',
      priority: form.priority,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: form.dueDate.trim(),
      estimatedTime: form.estimatedTime.trim() || '—',
      description: form.description.trim(),
      progress: 0,
      category: form.category,
      categoryTone: CATEGORY_TONE[form.category],
    };

    onCreate(newTask);
  }

  return (
    <Modal title="Create Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="rounded-lg bg-danger-bg px-3 py-2 text-[12px] text-danger">{error}</div>}

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Task / Service *</label>
          <input
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            placeholder="e.g. Trademark Filing"
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Client *</label>
          <input
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            placeholder="e.g. Brandco LLP"
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Due Date *</label>
            <input
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              placeholder="e.g. Apr 15, 2026"
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-muted">Estimated Time</label>
            <input
              value={form.estimatedTime}
              onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
              placeholder="e.g. ~3h"
              className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="Brief description of the task"
            className="w-full resize-none rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-muted">Assign To</label>
          <select
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
            className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
          >
            <option value="">Leave unassigned</option>
            {activeProviders.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.role})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}