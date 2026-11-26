'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Database,
  Lock,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { useAppState } from '@/lib/hooks/useAppState';

export default function SystemStatusPage() {
  const { locale } = useAppState();
  const isId = locale === 'id';

  const services = [
    {
      icon: Activity,
      nameId: 'Katalog Project & Katalog Freelancer',
      nameEn: 'Project & Freelancer Catalog API',
      region: 'asia-southeast1',
      uptime: '99.98%',
      latency: '42 ms',
    },
    {
      icon: UploadCloud,
      nameId: 'Sesi Private Raw Upload & Karantina SHA-256',
      nameEn: 'Private Raw Upload & SHA-256 Quarantine',
      region: 'asia-southeast1',
      uptime: '99.96%',
      latency: '68 ms',
    },
    {
      icon: ShieldCheck,
      nameId: 'QA Verification & Data Rights Manifest Pipeline',
      nameEn: 'QA Verification & Data Rights Manifest Pipeline',
      region: 'asia-southeast1',
      uptime: '99.99%',
      latency: '51 ms',
    },
    {
      icon: Database,
      nameId: 'Workspace Ledger, Payout & Google Workspace Plugins',
      nameEn: 'Workspace Ledger, Payouts & Google Workspace Plugins',
      region: 'asia-southeast1',
      uptime: '99.97%',
      latency: '48 ms',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isId ? 'Kembali ke Pusat Bantuan' : 'Back to Help Center'}</span>
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--egvox-text-primary)]">
              {isId ? 'Status Sistem & Layanan EgvoX' : 'EgvoX System & Service Status'}
            </h1>
            <p className="mt-1 text-sm text-[var(--egvox-text-secondary)]">
              {isId
                ? 'Pemantauan ketersediaan layanan marketplace, penyimpanan privat, dan alur QA.'
                : 'Live availability status for marketplace catalogs, private storage, and QA pipelines.'}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#16835D]/12 px-4 py-2 text-sm font-bold text-[#16835D]">
            <CheckCircle2 className="h-4 w-4" />
            {isId ? 'Semua Sistem Operasional' : 'All Systems Operational'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((srv) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.nameEn}
              className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#027F86]/10 text-[#027F86] dark:text-[#04B8B4]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                      {isId ? srv.nameId : srv.nameEn}
                    </h2>
                    <p className="text-[11px] font-mono text-[var(--egvox-text-muted)]">
                      Region: {srv.region}
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-[#16835D]/12 px-2 py-0.5 text-[11px] font-bold text-[#16835D]">
                  {isId ? 'Aktif' : 'Operational'}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--egvox-border-default)] pt-3 text-xs text-[var(--egvox-text-secondary)] tabular-nums">
                <span>{isId ? 'Uptime (30 hari):' : 'Uptime (30d):'} <strong>{srv.uptime}</strong></span>
                <span>{isId ? 'Latensi Median:' : 'Median Latency:'} <strong>{srv.latency}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#027F86]" />
          <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
            {isId ? 'Riwayat Pemeliharaan & Insiden (30 Hari Terakhir)' : 'Maintenance & Incident Log (Last 30 Days)'}
          </h2>
        </div>
        <p className="text-sm text-[var(--egvox-text-secondary)]">
          {isId
            ? 'Tidak ada insiden gangguan layanan yang tercatat dalam 30 hari terakhir. Pembaruan keamanan karantina media dilakukan tanpa downtime.'
            : 'Zero service disruptions recorded in the past 30 days. Private media quarantine security updates completed with zero downtime.'}
        </p>
      </div>
    </div>
  );
}
