import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-3.5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[12px] text-text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}