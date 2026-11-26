'use client';

import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { useAppState } from '@/lib/hooks/useAppState';
import { usePWAInstall } from '@/lib/hooks/usePWAInstall';
import { Modal } from './Modal';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => {
  const { locale } = useAppState();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-2 rounded-lg border border-[#027F86] bg-[#027F86]/8 px-3 py-2 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:bg-[#027F86]/15 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
      >
        <Download className="h-4 w-4" />
        <span>
          {compact
            ? locale === 'id'
              ? 'Pasang'
              : 'Install'
            : locale === 'id'
            ? 'Pasang Aplikasi'
            : 'Install App'}
        </span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] px-3 py-2 text-xs font-medium text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
        >
          <Smartphone className="h-4 w-4 text-[#027F86] dark:text-[#04B8B4]" />
          <span>{locale === 'id' ? 'Pasang Aplikasi' : 'Install PWA'}</span>
        </button>

        <Modal
          open={showGuide}
          onClose={() => setShowGuide(false)}
          title={
            locale === 'id'
              ? 'Install EgvoX di iPhone / iPad'
              : 'Install EgvoX on iPhone / iPad'
          }
          subtitle={
            locale === 'id'
              ? 'Akses cepat Marketplace & Workspace langsung dari Home Screen'
              : 'Quick access to Marketplace & Workspace directly from your Home Screen'
          }
          maxWidthClass="max-w-sm"
        >
          <ol className="space-y-2.5 text-sm text-[var(--egvox-text-secondary)]">
            <li>
              {locale === 'id' ? (
                <>
                  1. Ketuk tombol <strong className="text-[var(--egvox-text-primary)]">Share</strong> pada toolbar Safari.
                </>
              ) : (
                <>
                  1. Tap the <strong className="text-[var(--egvox-text-primary)]">Share</strong> button in Safari&apos;s toolbar.
                </>
              )}
            </li>
            <li>
              {locale === 'id' ? (
                <>
                  2. Gulir ke bawah lalu pilih <strong className="text-[var(--egvox-text-primary)]">Add to Home Screen</strong>.
                </>
              ) : (
                <>
                  2. Scroll down and select <strong className="text-[var(--egvox-text-primary)]">Add to Home Screen</strong>.
                </>
              )}
            </li>
            <li>
              {locale === 'id' ? (
                <>
                  3. Ketuk <strong className="text-[var(--egvox-text-primary)]">Add</strong> untuk memasang EgvoX.
                </>
              ) : (
                <>
                  3. Tap <strong className="text-[var(--egvox-text-primary)]">Add</strong> to install EgvoX.
                </>
              )}
            </li>
          </ol>
          <button
            type="button"
            onClick={() => setShowGuide(false)}
            className="mt-5 w-full rounded-lg bg-[#027F86] py-2.5 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
          >
            {locale === 'id' ? 'Mengerti' : 'Got It'}
          </button>
        </Modal>
      </>
    );
  }

  return null;
};
