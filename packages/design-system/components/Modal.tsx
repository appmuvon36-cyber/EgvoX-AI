'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-lg',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    closeButtonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgb(16_35_38_/_55%)] p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-t-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-primary)] shadow-[var(--egvox-shadow-modal)] sm:rounded-2xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="egvox-modal-title"
        aria-describedby={subtitle ? 'egvox-modal-description' : undefined}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-5 py-4">
          <div className="min-w-0">
            <h2 id="egvox-modal-title" className="text-lg font-bold tracking-tight text-[var(--egvox-text-primary)]">
              {title}
            </h2>
            {subtitle ? (
              <p id="egvox-modal-description" className="mt-0.5 text-xs text-[var(--egvox-text-muted)]">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--egvox-text-secondary)] transition-colors hover:bg-[var(--egvox-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--egvox-brand-teal-600)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
