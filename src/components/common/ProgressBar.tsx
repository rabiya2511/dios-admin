interface ProgressBarProps {
  value: number;
  className?: string;
  fillClassName?: string;
}

export function ProgressBar({ value, className = '', fillClassName = 'bg-gold' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={['h-1 w-full rounded-full bg-canvas', className].join(' ')}
    >
      <div
        className={['h-full rounded-full transition-[width] duration-300', fillClassName].join(' ')}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}