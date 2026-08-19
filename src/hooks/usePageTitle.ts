import { useLocation } from 'react-router-dom';
import { NAV_SECTIONS } from '@/constants/navigation';

const ALL_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

/** Resolves the current route to its Topbar title (falls back to the sidebar label). */
export function usePageTitle(): string {
  const { pathname } = useLocation();
  const match = ALL_ITEMS.find(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  );
  return match?.pageTitle ?? match?.label ?? 'StartupSaaS';
}