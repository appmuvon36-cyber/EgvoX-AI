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
    const size = Math.max(44, Math.round(width));
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-[var(--egvox-border-default)] bg-white p-1 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/icon.svg"
          alt="EgvoX brand symbol"
          width={size - 8}
          height={size - 8}
          className="object-contain"
        />
      </span>
    );
  }

  const height = Math.round(width * 0.34);

  return (
    <span className={`inline-flex shrink-0 items-center rounded-md bg-white px-1.5 py-0.5 ${className}`}>
      <Image
        src="/assets/aistudio/EgvoX_Official_Logo_ef943c39.webp"
        alt="EgvoX"
        width={width}
        height={height}
        priority
        className="h-auto max-h-9 w-full select-none object-contain sm:max-h-10"
      />
    </span>
  );
};
