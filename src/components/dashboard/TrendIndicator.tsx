import { ArrowUp, ArrowDown } from 'lucide-react';

type TrendType = 'positive' | 'negative' | 'neutral';

interface TrendIndicatorProps {
  direction: 'up' | 'down';
  value: string;
  label: string;
  type: TrendType;
}

const TYPE_CLASSES: Record<TrendType, string> = {
  positive: 'text-success',
  negative: 'text-warning',
  neutral: 'text-text-muted',
};

export function TrendIndicator({ direction, value, label, type }: TrendIndicatorProps) {
  const Icon = direction === 'up' ? ArrowUp : ArrowDown;

  return (
    <span className={['inline-flex items-center gap-0.5 text-[11px]', TYPE_CLASSES[type]].join(' ')}>
      <Icon size={10} strokeWidth={2.5} />
      {value} {label}
    </span>
  );
}