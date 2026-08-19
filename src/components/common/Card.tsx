import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  noPadding?: boolean;
}

export function Card({ children, noPadding = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-(--radius-card) border border-border-subtle bg-surface',
        'shadow-[0_1px_2px_rgba(11,30,61,0.04)]',
        noPadding ? '' : 'p-4',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}