import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = 'Nothing to show yet.',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-xs text-text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="scroll-thin -mx-1 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className={[
                  'border-b border-border-subtle px-3 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                  col.className ?? '',
                ].join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)} className="group">
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={[
                    'border-b border-border-subtle px-3 py-2.5 text-[12px] text-text-primary transition-colors group-last:border-b-0 group-hover:bg-canvas',
                    col.className ?? '',
                  ].join(' ')}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}