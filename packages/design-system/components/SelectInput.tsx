import React from 'react';

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ invalid = false, className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={`min-h-11 w-full rounded-[var(--egvox-radius-md)] border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm text-[var(--egvox-text-primary)] transition-colors hover:border-[var(--egvox-border-strong)] focus:border-[var(--egvox-brand-teal-600)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[var(--egvox-bg-subtle)] disabled:opacity-70 ${invalid ? 'border-[var(--egvox-danger)] focus:border-[var(--egvox-danger)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
  ),
);
SelectInput.displayName = 'SelectInput';
