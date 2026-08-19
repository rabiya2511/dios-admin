import type { LucideIcon } from 'lucide-react';

export type AppMode = 'admin' | 'books';

export interface NavItem {
  id: string;
  label: string;
  /** Longer descriptive title shown in the Topbar. Falls back to `label` if omitted. */
  pageTitle?: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
  mode: AppMode;
}

export interface NavSection {
  id: string;
  label: string;
  mode: AppMode;
  items: NavItem[];
}