import React from 'react';
import type { BadgeTone } from './Badge';

const styles: Record<BadgeTone, string> = {
  neutral: 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-subtle)] text-[var(--egvox-text-primary)]',
  success: 'border-[var(--egvox-success-border)] bg-[var(--egvox-success-bg)] text-[var(--egvox-success)]',
  warning: 'border-[var(--egvox-warning-border)] bg-[var(--egvox-warning-bg)] text-[var(--egvox-warning)]',
  danger: 'border-[var(--egvox-danger-border)] bg-[var(--egvox-danger-bg)] text-[var(--egvox-danger)]',
  info: 'border-[var(--egvox-info-border)] bg-[var(--egvox-info-bg)] text-[var(--egvox-info)]',
};

export function Alert({ tone = 'info', title, children, className = '' }: { tone?: BadgeTone; title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={`rounded-[var(--egvox-radius-md)] border p-3 text-sm ${styles[tone]} ${className}`}>
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}
