
interface FilterChipsProps<T extends string> {
  options: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}

export function FilterChips<T extends string>({ options, active, onChange }: FilterChipsProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={[
            'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
            active === opt.id
              ? 'border-gold bg-gold-tint text-[#7A5800]'
              : 'border-border-subtle bg-canvas text-text-muted hover:text-text-primary',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}