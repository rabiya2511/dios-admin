import { Button } from '@/components/common/Button';
import type { AdminService } from '@/types/domain';

interface ServiceListItemProps {
  service: AdminService;
  onEdit: (service: AdminService) => void;
  onDelete: (id: string) => void;
}

export function ServiceListItem({ service, onEdit, onDelete }: ServiceListItemProps) {
  return (
    <div className="mb-2 flex items-center gap-3 rounded-[10px] border border-border-subtle bg-surface px-3.5 py-2.5 last:mb-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-gold-tint text-[15px]">
        {service.icon}
      </span>
      <div className="min-w-0 flex-1">
        <span className="text-[13px] font-semibold text-text-primary">{service.name}</span>
        <p className="mt-0.5 truncate text-[11px] text-text-muted">
          {service.category} · {service.description}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-[12px] font-semibold text-gold">
          From ₹{service.startingPrice.toLocaleString('en-IN')}
        </span>
        <Button variant="secondary" size="sm" onClick={() => onEdit(service)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(service.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}