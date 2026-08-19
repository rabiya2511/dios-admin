import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

interface TopbarProps {
  actions?: ReactNode;
}

export function Topbar({ actions }: TopbarProps) {
  const title = usePageTitle();

  return (
    <header className="flex h-[52px] shrink-0 items-center gap-3 border-b border-border-subtle bg-surface px-5">
      <h1 className="min-w-0 flex-1 truncate font-display text-xl font-bold text-text-primary">
        {title}
      </h1>
      <div className="hidden w-[200px] shrink-0 items-center gap-2 rounded-md border border-border-subtle bg-canvas px-3 py-1.5 md:flex">
        <Search size={13} className="shrink-0 text-text-muted" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search..."
          aria-label="Search"
          className="w-full bg-transparent font-sans text-[12px] text-text-primary outline-none placeholder:text-text-muted"
        />
      </div>
      {actions}
    </header>
  );
}