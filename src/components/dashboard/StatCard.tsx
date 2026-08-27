import { ArrowUp, ArrowDown } from 'lucide-react';

type StatTone = 'gold' | 'info' | 'success' | 'warning' | 'danger';
type TrendDirection = 'up' | 'down' | 'neutral';

const TONE_CLASSES: Record<StatTone, string> = {
  gold: 'bg-gold-tint',
  info: 'bg-info-bg',
  success: 'bg-success-bg',
  warning: 'bg-warning-bg',
  danger: 'bg-danger-bg',
};

const TREND_COLOR_CLASSES: Record<TrendDirection, string> = {
  up: 'text-success',
  down: 'text-warning',
  neutral: 'text-text-primary',
};

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  tone: StatTone;
  trend?: string;
  trendDirection?: TrendDirection;
  /** Which arrow to show. Defaults to matching trendDirection, but can differ
   *  (e.g. Pending Tasks shows an "up" arrow while colored as a warning). */
  trendArrow?: 'up' | 'down';
}

export function StatCard({
  label,
  value,
  icon,
  tone,
  trend,
  trendDirection = 'neutral',
  trendArrow,
}: StatCardProps) {
  const ArrowIcon = (trendArrow ?? trendDirection) === 'down' ? ArrowDown : ArrowUp;

  return (
    <div className="relative rounded-xl border border-border-subtle bg-surface p-4">
      <span
        className={[
          'absolute right-4 top-4 flex h-[34px] w-[34px] items-center justify-center rounded-[9px] text-[14px]',
          TONE_CLASSES[tone],
        ].join(' ')}
      >
        {icon}
      </span>
      <div className="mb-[7px] pr-10 text-[10px] font-medium uppercase tracking-wider text-text-muted">
        {label}
      </div>
      <div className="font-display text-[26px] font-bold leading-none text-text-primary">{value}</div>
      {trend && (
        <div
          className={[
            'mt-[5px] inline-flex items-center gap-0.5 text-[11px]',
            TREND_COLOR_CLASSES[trendDirection],
          ].join(' ')}
        >
          <ArrowIcon size={10} strokeWidth={2.5} />
          {trend}
        </div>
      )}
    </div>
  );
}