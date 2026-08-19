import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, className = '', ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{label}</label>
      <input
        className={[
          'rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  );
}