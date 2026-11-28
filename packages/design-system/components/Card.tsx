import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const paddings = { none: 'p-0', sm: 'p-3', md: 'p-4 sm:p-5', lg: 'p-5 sm:p-6' };

export function Card({ padding = 'md', interactive = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-[var(--egvox-radius-xl)] border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] shadow-[var(--egvox-shadow-card)] ${paddings[padding]} ${interactive ? 'transition-shadow hover:shadow-[var(--egvox-shadow-popover)]' : ''} ${className}`}
      {...props}
    />
  );
}
