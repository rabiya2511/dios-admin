interface TabRowProps<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}

export function TabRow<T extends string>({ tabs, active, onChange }: TabRowProps<T>) {
  return (
    <div className="mb-4 flex w-full gap-0.5 rounded-[9px] bg-canvas p-[3px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            'flex-1 rounded-[7px] p-[7px] text-[12px] font-medium transition-colors',
            active === tab.id
              ? 'border border-border-subtle bg-surface text-text-primary'
              : 'border border-transparent text-text-muted hover:text-text-primary',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}