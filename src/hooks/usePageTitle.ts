import { useLocation } from 'react-router-dom';
import { NAV_SECTIONS } from '@/constants/navigation';

const ALL_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

/** Resolves the current route to its Topbar title (falls back to the sidebar label). */
export function usePageTitle(): string {
  const { pathname } = useLocation();

  const exact = ALL_ITEMS.find((item) => pathname === item.to);
  if (exact) return exact.pageTitle ?? exact.label;

  // No exact match — pick the longest (most specific) prefix match,
  // so e.g. "/books/invoices/new" resolves to the "New Invoice" item
  // rather than the "Invoices" item just because it appears first.
  const prefixMatches = ALL_ITEMS.filter((item) => pathname.startsWith(`${item.to}/`));
  if (prefixMatches.length === 0) return 'StartupSaaS';

  const best = prefixMatches.reduce((longest, item) => (item.to.length > longest.to.length ? item : longest));
  return best.pageTitle ?? best.label;
}