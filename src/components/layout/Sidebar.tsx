import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, User, Settings, LogOut } from 'lucide-react';
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
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeMode: AppMode = location.pathname.startsWith('/books')
    ? 'books'
    : location.pathname.startsWith('/provider')
      ? 'provider'
      : 'admin';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  function handleProfile() {
    setMenuOpen(false);
    // No dedicated profile page exists yet — route to settings as the closest match.
    navigate('/admin/settings');
  }

  function handleSettings() {
    setMenuOpen(false);
    navigate('/admin/settings');
  }

  function handleLogout() {
    setMenuOpen(false);
    // No auth system wired up yet — placeholder redirect to keep the action functional.
    navigate('/admin/dashboard');
  }

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

        <div className="relative border-t border-white/[0.07] p-2.5" ref={menuRef}>
          {menuOpen && (
            <div className="absolute bottom-full left-2.5 right-2.5 mb-1.5 overflow-hidden rounded-[10px] border border-white/10 bg-navy-2 shadow-lg">
              <button
                type="button"
                onClick={handleProfile}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12px] text-white/75 hover:bg-white/[0.07]"
              >
                <User size={14} />
                Profile
              </button>
              <button
                type="button"
                onClick={handleSettings}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12px] text-white/75 hover:bg-white/[0.07]"
              >
                <Settings size={14} />
                Settings
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 border-t border-white/[0.07] px-3 py-2.5 text-left text-[12px] text-danger hover:bg-white/[0.07]"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-[10px] p-2 hover:bg-white/[0.05]"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy">
              AD
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[11px] font-medium text-white/75">Admin User</span>
              <span className="block truncate text-[9px] text-white/35">Super Admin</span>
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  toggleTheme();
                }
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/60 opacity-70 hover:opacity-100"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}