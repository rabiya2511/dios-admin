type StatusTone = 'green' | 'blue' | 'orange' | 'gray' | 'gold' | 'red';

interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  green: 'bg-success-bg text-success',
  blue: 'bg-info-bg text-info',
  orange: 'bg-warning-bg text-warning',
  gray: 'bg-canvas text-text-muted',
  gold: 'bg-gold-tint text-[#7A5800]',
  red: 'bg-danger-bg text-danger',
};

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold',
        TONE_CLASSES[tone],
      ].join(' ')}
    >
      {label}
    </span>
  );
}