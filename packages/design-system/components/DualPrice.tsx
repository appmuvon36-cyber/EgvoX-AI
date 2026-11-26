'use client';

import React from 'react';
import { egvoxFormatIDR, egvoxFormatUSD } from '../tokens';

interface DualPriceProps {
  amountIDR: number;
  unitLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'inline' | 'stack';
  accent?: 'orange' | 'teal' | 'default';
}

export const DualPrice: React.FC<DualPriceProps> = ({
  amountIDR,
  unitLabel,
  size = 'md',
  layout = 'stack',
  accent = 'orange',
}) => {
  const idrStr = egvoxFormatIDR(amountIDR);
  const usdStr = egvoxFormatUSD(amountIDR);

  const primaryColor =
    accent === 'orange'
      ? 'text-[#FC840E]'
      : accent === 'teal'
      ? 'text-[#027F86] dark:text-[#04B8B4]'
      : 'text-[var(--egvox-text-primary)]';

  const sizeClass =
    size === 'lg'
      ? 'text-2xl font-bold'
      : size === 'sm'
      ? 'text-sm font-bold'
      : 'text-base font-bold';

  const usdSizeClass =
    size === 'lg'
      ? 'text-xs font-semibold'
      : 'text-[11px] font-semibold';

  if (layout === 'inline') {
    return (
      <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 tabular-nums">
        <span className={`${sizeClass} ${primaryColor}`}>
          {idrStr}
          {unitLabel ? (
            <span className="text-xs font-normal text-[var(--egvox-text-muted)]">
              {' '}
              / {unitLabel}
            </span>
          ) : null}
        </span>
        <span
          className={`${usdSizeClass} rounded bg-[#027F86]/10 px-1.5 py-0.5 text-[#027F86] dark:text-[#04B8B4]`}
        >
          {usdStr} USD{unitLabel ? ` / ${unitLabel}` : ''}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-start tabular-nums">
      <span className={`${sizeClass} ${primaryColor} leading-tight`}>
        {idrStr}
        {unitLabel ? (
          <span className="text-xs font-normal text-[var(--egvox-text-muted)]">
            {' '}
            / {unitLabel}
          </span>
        ) : null}
      </span>
      <span
        className={`${usdSizeClass} mt-0.5 text-[#027F86] dark:text-[#04B8B4]`}
      >
        &asymp; {usdStr} USD{unitLabel ? ` / ${unitLabel}` : ''}
      </span>
    </span>
  );
};
