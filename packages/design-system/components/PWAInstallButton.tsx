'use client';

import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { useAppState } from '@/lib/hooks/useAppState';
import { usePWAInstall } from '@/lib/hooks/usePWAInstall';
import { Modal } from './Modal';
import { Button } from './Button';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => {
  const { locale } = useAppState();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={install}
        className="gap-2 border-[var(--egvox-brand-teal-700)] text-xs text-[var(--egvox-brand-teal-700)] hover:bg-[var(--egvox-bg-subtle)] dark:text-[var(--egvox-brand-teal-300)]"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span>
          {compact
            ? locale === 'id' ? 'Pasang' : 'Install'
            : locale === 'id' ? 'Pasang Aplikasi' : 'Install App'}
        </span>
      </Button>
    );
  }

  if (!isIOS) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setShowGuide(true)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] px-3 py-2 text-xs font-medium text-[var(--egvox-text-secondary)] transition-colors hover:bg-[var(--egvox-bg-subtle)]"
      >
        <Smartphone className="h-4 w-4 text-[var(--egvox-brand-teal-700)] dark:text-[var(--egvox-brand-teal-300)]" aria-hidden="true" />
        <span>{locale === 'id' ? 'Pasang Aplikasi' : 'Install PWA'}</span>
      </button>

      <Modal
        open={showGuide}
        onClose={() => setShowGuide(false)}
        title={locale === 'id' ? 'Install EgvoX di iPhone / iPad' : 'Install EgvoX on iPhone / iPad'}
        subtitle={locale === 'id'
          ? 'Akses cepat Marketplace & Workspace langsung dari Home Screen'
          : 'Quick access to Marketplace & Workspace directly from your Home Screen'}
        maxWidthClass="max-w-sm"
      >
        <ol className="space-y-2.5 text-sm text-[var(--egvox-text-secondary)]">
          <li>{locale === 'id'
            ? <>1. Ketuk tombol <strong className="text-[var(--egvox-text-primary)]">Share</strong> pada toolbar Safari.</>
            : <>1. Tap the <strong className="text-[var(--egvox-text-primary)]">Share</strong> button in Safari&apos;s toolbar.</>}</li>
          <li>{locale === 'id'
            ? <>2. Gulir ke bawah lalu pilih <strong className="text-[var(--egvox-text-primary)]">Add to Home Screen</strong>.</>
            : <>2. Scroll down and select <strong className="text-[var(--egvox-text-primary)]">Add to Home Screen</strong>.</>}</li>
          <li>{locale === 'id'
            ? <>3. Ketuk <strong className="text-[var(--egvox-text-primary)]">Add</strong> untuk memasang EgvoX.</>
            : <>3. Tap <strong className="text-[var(--egvox-text-primary)]">Add</strong> to install EgvoX.</>}</li>
        </ol>
        <Button type="button" fullWidth className="mt-5">
          {locale === 'id' ? 'Mengerti' : 'Got It'}
        </Button>
      </Modal>
    </>
  );
};
