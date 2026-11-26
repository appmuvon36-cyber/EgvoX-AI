'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { useAppState } from '@/lib/hooks/useAppState';

export default function NotFoundPage() {
  const { locale } = useAppState();
  const isId = locale === 'id';

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#027F86]/12 text-[#027F86] dark:text-[#04B8B4]">
        <Compass className="h-7 w-7" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-mono font-bold text-[#FC840E]">404</p>
        <h1 className="text-2xl font-bold text-[var(--egvox-text-primary)]">
          {isId ? 'Halaman Tidak Ditemukan' : 'Page Not Found'}
        </h1>
        <p className="text-sm text-[var(--egvox-text-secondary)]">
          {isId
            ? 'Tautan yang Anda tuju tidak tersedia atau telah dipindahkan.'
            : 'The requested page is unavailable or has been moved.'}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--egvox-border-default)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--egvox-bg-subtle)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isId ? 'Ke Beranda' : 'Corporate Home'}</span>
        </Link>
        <Link
          href="/marketplace"
          className="inline-flex items-center rounded-xl bg-[#027F86] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#039998]"
        >
          {isId ? 'Jelajahi Marketplace' : 'Explore Marketplace'}
        </Link>
      </div>
    </div>
  );
}
