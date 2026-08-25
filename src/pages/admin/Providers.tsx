import { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/common/Avatar';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Toast } from '@/components/common/Toast';
import { ProviderOnboardForm } from '@/components/providers/ProviderOnboardForm';
import { ProviderDetailsDrawer } from '@/components/providers/ProviderDetailsDrawer';
import { useProviders } from '@/hooks/useProviders';
import { PROVIDER_STATUS_MAP, BOOKS_ACCESS_MAP } from '@/utils/statusMaps';
import type { AdminProvider } from '@/types/domain';

export default function Providers() {
  const { providers, addProvider, deactivateProvider } = useProviders();
  const [showForm, setShowForm] = useState(false);
  const [viewingProvider, setViewingProvider] = useState<AdminProvider | null>(null);
  const [deactivatingProvider, setDeactivatingProvider] = useState<AdminProvider | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleOnboard(input: Parameters<typeof addProvider>[0]) {
    addProvider(input);
    setShowForm(false);
    setToast('Provider onboarded! Invite email sent.');
  }

  function handleDeactivateConfirm() {
    if (!deactivatingProvider) return;
    deactivateProvider(deactivatingProvider.id);
    setDeactivatingProvider(null);
    setToast('Provider deactivated.');
  }

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Provider Onboarding"
          subtitle="Onboard CAs, designers, developers, and more to complete client work"
          action={
            !showForm && (
              <Button variant="gold" size="sm" onClick={() => setShowForm(true)}>
                + Onboard New Provider
              </Button>
            )
          }
        />

        {showForm && <ProviderOnboardForm onSave={handleOnboard} onClose={() => setShowForm(false)} />}

        <Card>
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            All Providers
          </h3>
          <DataTable<AdminProvider>
            data={providers}
            rowKey={(p) => p.id}
            emptyMessage="No providers yet."
            columns={[
              { header: 'Provider ID', render: (p) => <span className="font-mono text-[11px]">{p.id}</span> },
              {
                header: 'Name',
                render: (p) => (
                  <div className="flex items-center gap-2">
                    <Avatar initials={p.initials} tone="info" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                ),
              },
              { header: 'Role', render: (p) => <StatusBadge label={p.role} tone="gold" /> },
              { header: 'Tasks', render: (p) => p.tasks },
              {
                header: 'Availability',
                render: (p) => {
                  const meta = PROVIDER_STATUS_MAP[p.availability];
                  return <StatusBadge label={meta.label} tone={meta.tone} />;
                },
              },
              {
                header: 'Books Access',
                render: (p) => {
                  const meta = BOOKS_ACCESS_MAP[p.booksAccess];
                  return <StatusBadge label={meta.label} tone={meta.tone} />;
                },
              },
              {
                header: 'Actions',
                render: (p) => (
                  <div className="flex gap-1.5">
                    <Button variant="secondary" size="sm" onClick={() => setViewingProvider(p)}>
                      View
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={p.status === 'inactive'}
                      onClick={() => setDeactivatingProvider(p)}
                    >
                      {p.status === 'inactive' ? 'Deactivated' : 'Deactivate'}
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>

      {viewingProvider && <ProviderDetailsDrawer provider={viewingProvider} onClose={() => setViewingProvider(null)} />}

      {deactivatingProvider && (
        <ConfirmDialog
          title="Deactivate Provider?"
          message="Are you sure you want to deactivate this provider?"
          confirmLabel="Deactivate"
          onConfirm={handleDeactivateConfirm}
          onCancel={() => setDeactivatingProvider(null)}
        />
      )}

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}