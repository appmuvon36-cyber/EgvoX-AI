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
      className="fixed bottom-20 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#B7791F] px-3.5 py-2 text-xs font-medium text-white shadow-lg"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>
        {locale === 'id'
          ? 'Mode Offline — Menampilkan shell aplikasi & data tersimpan.'
          : 'Offline Mode — Showing app shell and saved data.'}
      </span>
    </div>
  );
};
