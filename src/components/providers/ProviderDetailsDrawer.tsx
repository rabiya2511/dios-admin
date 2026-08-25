import { Drawer } from '@/components/common/Drawer';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PROVIDER_STATUS_MAP, BOOKS_ACCESS_MAP } from '@/utils/statusMaps';
import type { AdminProvider } from '@/types/domain';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="text-[12px] font-medium text-text-primary">{value}</span>
    </div>
  );
}

export function ProviderDetailsDrawer({ provider, onClose }: { provider: AdminProvider; onClose: () => void }) {
  const availabilityMeta = PROVIDER_STATUS_MAP[provider.availability];
  const booksMeta = BOOKS_ACCESS_MAP[provider.booksAccess];

  return (
    <Drawer title="Provider Details" subtitle={provider.name} onClose={onClose}>
      <div className="flex flex-col gap-1">
        <Row label="Provider ID" value={provider.id} />
        <Row label="Full Name" value={provider.name} />
        <Row label="Role" value={provider.role} />
        <Row label="Email" value={provider.email} />
        <Row label="Mobile" value={provider.mobile} />
        <Row label="Current Tasks" value={String(provider.tasks)} />
        <div className="flex items-center justify-between py-1.5">
          <span className="text-[11px] text-text-muted">Availability</span>
          <StatusBadge label={availabilityMeta.label} tone={availabilityMeta.tone} />
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span className="text-[11px] text-text-muted">Books &amp; Accounting Access</span>
          <StatusBadge label={booksMeta.label} tone={booksMeta.tone} />
        </div>
        <Row
          label="Commission Type"
          value={provider.commissionType === 'percent' ? '% per order' : 'Fixed fee per task'}
        />
        <Row
          label="Commission Value"
          value={provider.commissionType === 'percent' ? `${provider.commissionValue}%` : `₹${provider.commissionValue}`}
        />
        <Row label="Account Status" value={provider.status === 'active' ? 'Active' : 'Deactivated'} />
      </div>
    </Drawer>
  );
}