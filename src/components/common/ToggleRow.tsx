import { Toggle } from '@/components/common/Toggle';

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  bordered?: boolean;
}

export function ToggleRow({ label, checked, onChange, bordered = false }: ToggleRowProps) {
  return (
    <div
      className={[
        'flex items-center justify-between py-2.5',
        bordered ? 'border-t border-border-subtle' : '',
      ].join(' ')}
    >
      <span className="text-[13px] text-text-primary">{label}</span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}