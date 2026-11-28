import React from 'react';

export function Table({ children, className = '', ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-[var(--egvox-radius-lg)] border border-[var(--egvox-border-default)]">
      <table className={`w-full border-collapse text-left text-sm ${className}`} {...props}>{children}</table>
    </div>
  );
}

export function TableHeader({ children, className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th scope="col" className={`whitespace-nowrap bg-[var(--egvox-bg-subtle)] px-4 py-3 font-semibold text-[var(--egvox-text-secondary)] ${className}`} {...props}>{children}</th>;
}

export function TableCell({ children, className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`border-t border-[var(--egvox-border-default)] px-4 py-3 align-middle text-[var(--egvox-text-primary)] ${className}`} {...props}>{children}</td>;
}
