'use client';

import React from 'react';
import Image from 'next/image';

interface EgvoXLogoProps {
  variant?: 'full' | 'symbol';
  width?: number;
  className?: string;
}

export const EgvoXLogo: React.FC<EgvoXLogoProps> = ({
  variant = 'full',
  width = 136,
  className = '',
}) => {
  if (variant === 'symbol') {
    const size = Math.max(32, Math.round(width));
    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg bg-white p-1 border border-[var(--egvox-border-default)] shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/icon.svg"
          alt="EgvoX"
          width={size - 8}
          height={size - 8}
          referrerPolicy="no-referrer"
          className="object-contain"
        />
      </span>
    );
  }

  const height = Math.round(width * 0.34);

  return (
    <span
      className={`inline-flex items-center shrink-0 dark:rounded-lg dark:bg-white dark:px-1.5 sm:dark:px-2 dark:py-0.5 ${className}`}
    >
      <Image
        src="/assets/aistudio/EgvoX_Official_Logo_ef943c39.webp"
        alt="EgvoX"
        width={width}
        height={height}
        priority
        referrerPolicy="no-referrer"
        className="h-auto w-full max-h-9 sm:max-h-10 object-contain select-none"
      />
    </span>
  );
};
