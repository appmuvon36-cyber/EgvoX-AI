import React from 'react';
import { Button } from './Button';

export function EmptyState({ title, description, actionLabel, onAction, className = '' }: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <section className={`flex flex-col items-center justify-center gap-3 rounded-[var(--egvox-radius-xl)] border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-5 py-10 text-center ${className}`} aria-live="polite">
      <h3 className="text-base font-semibold text-[var(--egvox-text-primary)]">{title}</h3>
      {description ? <p className="max-w-md text-sm text-[var(--egvox-text-secondary)]">{description}</p> : null}
      {actionLabel && onAction ? <Button variant="secondary" onClick={onAction}>{actionLabel}</Button> : null}
    </section>
  );
}
