import { useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { NAV_SECTIONS } from '@/constants/navigation';
import { SidebarNavItem } from '@/components/layout/SidebarNavItem';
import { useTheme } from '@/hooks/useTheme';
import type { AppMode } from '@/types/navigation';

const MODE_PILL_CLASSES: Record<AppMode, string> = {
  admin: 'bg-gold/20 text-gold',
  books: 'bg-emerald-500/20 text-emerald-400',
  provider: 'bg-sky-500/20 text-sky-400',
};

const MODE_LABELS: Record<AppMode, string> = {
  admin: 'Admin Panel',
  books: 'Books & Accounts',
  provider: 'Provider Portal',
};

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const activeMode: AppMode = location.pathname.startsWith('/books')
    ? 'books'
    : location.pathname.startsWith('/provider')
      ? 'provider'
      : 'admin';

  return (
    <aside className="hidden w-(--sidebar-width) shrink-0 lg:block">
      <div className="fixed inset-y-0 left-0 flex w-(--sidebar-width) flex-col bg-navy">
        <div className="border-b border-white/[0.07] px-4 py-4">
          <div className="font-display text-lg font-bold leading-none text-white">YBS</div>
          <span
            className={[
              'mt-1.5 inline-block rounded px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
              MODE_PILL_CLASSES[activeMode],
            ].join(' ')}
          >
            {MODE_LABELS[activeMode]}
          </span>
        </div>

        <nav className="scroll-thin flex-1 overflow-y-auto px-2.5 py-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.id} className="mb-1">
              <div className="mb-1.5 mt-3.5 px-2 text-[9px] uppercase tracking-[0.1em] text-white/30 first:mt-0">
                {section.label}
              </div>
              {section.items.map((item) => (
                <SidebarNavItem key={item.id} item={item} />
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.07] p-2.5">
          <div className="flex items-center gap-2.5 rounded-[10px] p-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy">
              AD
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-medium text-white/75">Admin User</span>
              <span className="block truncate text-[9px] text-white/35">Super Admin</span>
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/60 opacity-70 hover:opacity-100"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}