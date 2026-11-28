import React from 'react';

export function Skeleton({ className = '', rounded = 'md' }: { className?: string; rounded?: 'sm' | 'md' | 'lg' | 'full' }) {
  const radius = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' };
  return <div aria-hidden="true" className={`animate-pulse bg-[var(--egvox-bg-subtle)] ${radius[rounded]} ${className}`} />;
}
