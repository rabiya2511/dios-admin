import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useUsers } from '@/hooks/useUsers';
import { useProviders } from '@/hooks/useProviders';
import { ORDER_RECORDS, INVOICES, BILLS, EXPENSES, ADMIN_SERVICES } from '@/constants/mockData';
import { NAV_SECTIONS } from '@/constants/navigation';

interface TopbarProps {
  actions?: ReactNode;
}

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  category: string;
  path: string;
}

const MAX_PER_CATEGORY = 4;

const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export function Topbar({ actions }: TopbarProps) {
  const title = usePageTitle();
  const navigate = useNavigate();
  const { users } = useUsers();
  const { providers } = useProviders();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: SearchResult[] = [];

    ALL_NAV_ITEMS.filter((item) => {
      const searchable = `${item.label} ${item.pageTitle ?? ''}`.toLowerCase();
      return searchable.includes(q);
    })
      .slice(0, MAX_PER_CATEGORY)
      .forEach((item) =>
        matches.push({
          id: `nav-${item.id}`,
          label: item.pageTitle ?? item.label,
          sublabel: item.mode === 'admin' ? 'Admin' : 'Books & Accounting',
          category: 'Pages',
          path: item.to,
        }),
      );

    users
      .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .slice(0, MAX_PER_CATEGORY)
      .forEach((u) =>
        matches.push({ id: `u-${u.id}`, label: u.name, sublabel: u.email, category: 'Users', path: '/admin/users' }),
      );

    ORDER_RECORDS.filter((o) => o.client.toLowerCase().includes(q) || o.orderNo.toLowerCase().includes(q))
      .slice(0, MAX_PER_CATEGORY)
      .forEach((o) =>
        matches.push({
          id: `o-${o.id}`,
          label: o.orderNo,
          sublabel: `${o.client} — ${o.service}`,
          category: 'Orders',
          path: '/admin/orders',
        }),
      );

    providers
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q),
      )
      .slice(0, MAX_PER_CATEGORY)
      .forEach((p) =>
        matches.push({
          id: `prov-${p.id}`,
          label: p.name,
          sublabel: `${p.id} — ${p.role}`,
          category: 'Providers',
          path: '/admin/providers',
        }),
      );

    INVOICES.filter((i) => i.client.toLowerCase().includes(q) || i.invoiceNo.toLowerCase().includes(q))
      .slice(0, MAX_PER_CATEGORY)
      .forEach((i) =>
        matches.push({
          id: `inv-${i.id}`,
          label: i.invoiceNo,
          sublabel: `${i.client} — ${i.service}`,
          category: 'Invoices',
          path: '/books/invoices',
        }),
      );

    BILLS.filter((b) => b.vendor.toLowerCase().includes(q) || b.billNo.toLowerCase().includes(q))
      .slice(0, MAX_PER_CATEGORY)
      .forEach((b) =>
        matches.push({
          id: `b-${b.id}`,
          label: b.billNo,
          sublabel: b.vendor,
          category: 'Bills',
          path: '/books/bills',
        }),
      );

    EXPENSES.filter((e) => e.description.toLowerCase().includes(q))
      .slice(0, MAX_PER_CATEGORY)
      .forEach((e) =>
        matches.push({
          id: `e-${e.id}`,
          label: e.description,
          sublabel: `${e.category} — ${e.paidVia}`,
          category: 'Expenses',
          path: '/books/expenses',
        }),
      );

    ADMIN_SERVICES.filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, MAX_PER_CATEGORY)
      .forEach((s) =>
        matches.push({
          id: `s-${s.id}`,
          label: s.name,
          sublabel: s.category,
          category: 'Services',
          path: '/admin/services',
        }),
      );

    return matches;
  }, [query, users, providers]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [results]);

  function handleSelect(result: SearchResult) {
    setQuery('');
    setIsOpen(false);
    navigate(result.path);
  }

  function handleBlur() {
    // Delay closing so a click on a result registers before the dropdown unmounts.
    blurTimeout.current = setTimeout(() => setIsOpen(false), 150);
  }

  function handleFocus() {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setIsOpen(true);
  }

  return (
    <header className="relative flex h-[52px] shrink-0 items-center gap-3 border-b border-border-subtle bg-surface px-5">
      <h1 className="min-w-0 flex-1 truncate font-display text-xl font-bold text-text-primary">{title}</h1>

      <div className="relative hidden w-[240px] shrink-0 md:block">
        <div className="flex items-center gap-2 rounded-md border border-border-subtle bg-canvas px-3 py-1.5">
          <Search size={13} className="shrink-0 text-text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search users, orders, invoices..."
            aria-label="Search"
            className="w-full bg-transparent font-sans text-[12px] text-text-primary outline-none placeholder:text-text-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="shrink-0 text-text-muted hover:text-text-primary"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {isOpen && query.trim() && (
          <div className="scroll-thin absolute right-0 top-[calc(100%+6px)] z-50 max-h-[360px] w-[320px] overflow-y-auto rounded-[10px] border border-border-subtle bg-surface shadow-xl">
            {results.length === 0 ? (
              <p className="px-3.5 py-4 text-center text-[12px] text-text-muted">No results found.</p>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="border-b border-border-subtle py-1.5 last:border-b-0">
                  <div className="px-3.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                    {category}
                  </div>
                  {items.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelect(r)}
                      className="flex w-full flex-col items-start px-3.5 py-2 text-left hover:bg-canvas"
                    >
                      <span className="text-[12px] font-medium text-text-primary">{r.label}</span>
                      <span className="text-[10px] text-text-muted">{r.sublabel}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {actions}
    </header>
  );
}