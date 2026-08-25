import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DashboardDetailDrawerProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export function DashboardDetailDrawer({ title, subtitle, onClose, children }: DashboardDetailDrawerProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} />
      <div className="scroll-thin relative flex h-full w-full max-w-[460px] flex-col overflow-y-auto border-l border-border-subtle bg-surface shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border-subtle bg-surface px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-text-primary">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12px] text-text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-canvas hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 p-5">{children}</div>
      </div>
    </div>
  );
}
