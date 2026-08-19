type AvatarTone = 'gold' | 'info' | 'success' | 'warning';

const TONE_CLASSES: Record<AvatarTone, string> = {
  gold: 'bg-gold-tint text-navy dark:text-gold',
  info: 'bg-info-bg text-info',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
};

interface AvatarProps {
  initials: string;
  tone: AvatarTone;
}

export function Avatar({ initials, tone }: AvatarProps) {
  return (
    <span
      className={[
        'flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] text-[11px] font-semibold',
        TONE_CLASSES[tone],
      ].join(' ')}
    >
      {initials}
    </span>
  );
}