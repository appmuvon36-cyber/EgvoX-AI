import React from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, htmlFor, hint, error, required, children, className = '' }: FormFieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--egvox-text-primary)]">
        {label}{required ? <span aria-hidden="true" className="ml-1 text-[var(--egvox-danger)]">*</span> : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {children}
      {hint ? <p id={hintId} className="text-xs text-[var(--egvox-text-muted)]">{hint}</p> : null}
      {error ? <p id={errorId} role="alert" className="text-xs font-medium text-[var(--egvox-danger)]">{error}</p> : null}
    </div>
  );
}
