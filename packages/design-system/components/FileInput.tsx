import React from 'react';

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  invalid?: boolean;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ invalid = false, className = '', ...props }, ref) => (
    <input
      ref={ref}
      type="file"
      aria-invalid={invalid || undefined}
      className={`min-h-11 w-full rounded-[var(--egvox-radius-md)] border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] text-sm text-[var(--egvox-text-secondary)] file:mr-3 file:min-h-11 file:border-0 file:bg-[var(--egvox-bg-subtle)] file:px-3 file:font-medium file:text-[var(--egvox-text-primary)] hover:border-[var(--egvox-border-strong)] disabled:cursor-not-allowed disabled:opacity-60 ${invalid ? 'border-[var(--egvox-danger)]' : ''} ${className}`}
      {...props}
    />
  ),
);
FileInput.displayName = 'FileInput';
