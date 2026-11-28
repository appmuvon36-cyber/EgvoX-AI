import React from 'react';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--egvox-bg-subtle)] text-[var(--egvox-text-secondary)]',
  success: 'bg-[var(--egvox-success-bg)] text-[var(--egvox-success)] border-[var(--egvox-success-border)]',
  warning: 'bg-[var(--egvox-warning-bg)] text-[var(--egvox-warning)] border-[var(--egvox-warning-border)]',
  danger: 'bg-[var(--egvox-danger-bg)] text-[var(--egvox-danger)] border-[var(--egvox-danger-border)]',
  info: 'bg-[var(--egvox-info-bg)] text-[var(--egvox-info)] border-[var(--egvox-info-border)]',
};

export function Badge({ tone = 'neutral', children, className = '' }: { tone?: BadgeTone; children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold leading-none ${tones[tone]} ${className}`}>{children}</span>;
}
