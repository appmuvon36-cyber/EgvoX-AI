'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useAppState } from '@/lib/hooks/useAppState';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const { locale } = useAppState();
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-4 z-50 flex min-h-11 items-center gap-2 rounded-lg border border-[var(--egvox-warning-border)] bg-[var(--egvox-warning-bg)] px-3.5 py-2 text-xs font-semibold text-[var(--egvox-warning)] shadow-lg sm:bottom-4"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        {locale === 'id'
          ? 'Mode Offline — Menampilkan shell aplikasi & data tersimpan.'
          : 'Offline Mode — Showing app shell and saved data.'}
      </span>
    </div>
  );
};
