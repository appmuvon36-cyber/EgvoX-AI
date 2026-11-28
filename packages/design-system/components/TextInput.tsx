import React from 'react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ invalid = false, className = '', 'aria-describedby': describedBy, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={`min-h-11 w-full rounded-[var(--egvox-radius-md)] border bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm text-[var(--egvox-text-primary)] placeholder:text-[var(--egvox-text-muted)] transition-colors border-[var(--egvox-border-default)] hover:border-[var(--egvox-border-strong)] focus:border-[var(--egvox-brand-teal-600)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[var(--egvox-bg-subtle)] disabled:opacity-70 ${invalid ? 'border-[var(--egvox-danger)] focus:border-[var(--egvox-danger)]' : ''} ${className}`}
      {...props}
    />
  ),
);
TextInput.displayName = 'TextInput';
