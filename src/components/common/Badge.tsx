interface BadgeProps {
  count: number;
  className?: string;
}

export function Badge({ count, className = '' }: BadgeProps) {
  if (count <= 0) return null;
  return (
    <span
      className={[
        'ml-auto inline-flex items-center justify-center rounded-full bg-danger px-1.5 py-0.5',
        'text-[9px] font-bold leading-none text-white',
        className,
      ].join(' ')}
      aria-label={`${count} unread`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}