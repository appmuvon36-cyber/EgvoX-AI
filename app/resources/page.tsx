'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  LifeBuoy,
  Mail,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { useAppState } from '@/lib/hooks/useAppState';

export default function ResourcesPage() {
  const { locale, showToast } = useAppState();
  const [contactEmail, setContactEmail] = useState('');
  const [contactBody, setContactBody] = useState('');

  const tiles = [
    {
      icon: BookOpen,
      title: locale === 'id' ? 'Tentang Marketplace' : 'About Marketplace',
      desc:
        locale === 'id'
          ? 'Arsitektur dua katalog publik dan pemisahan jalur Vendor vs Enterprise.'
          : 'Dual public catalog architecture separating Vendor Marketplace and Enterprise Managed tracks.',
      href: '/marketplace',
    },
    {
      icon: Workflow,
      title: locale === 'id' ? 'Cara Kerja' : 'How It Works',
      desc:
        locale === 'id'
          ? 'Alur Capture Specification, Work Order, Private Raw Upload, QA & Delivery.'
          : 'End-to-end Capture Specification, Work Orders, Private Raw Uploads, QA & Delivery.',
      href: '/#cara-kerja',
    },
    {
      icon: LifeBuoy,
      title: locale === 'id' ? 'Pusat Bantuan (Help Center)' : 'Help Center',
      desc:
        locale === 'id'
          ? 'Panduan SOP kontributor, standar mounting kamera, dan checklist QA.'
          : 'Contributor SOP guides, camera mounting standards, and QA inspection checklists.',
      href: '#sop',
    },
    {
      icon: ShieldCheck,
      title: locale === 'id' ? 'Kebijakan (Privacy & Terms)' : 'Privacy & Terms Policy',
      desc:
        locale === 'id'
          ? 'Tata kelola Data Rights Manifest, consent peserta, dan perlindungan PII.'
          : 'Data Rights Manifest governance, participant consent records, and PII redaction.',
      href: '#privacy',
    },
    {
      icon: FileText,
      title: locale === 'id' ? 'Blog & Resource' : 'Guides & Resources',
      desc:
        locale === 'id'
          ? 'Praktik terbaik perekaman egocentric dan pelabelan temporal.'
          : 'Best practices for egocentric capture and temporal action annotation.',
      href: '#sop',
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      desc:
        locale === 'id'
          ? 'Jawaban seputar role, tarif per jam, pembayaran, dan lisensi data.'
          : 'Answers covering roles, hourly pricing, QA payouts, and licensing.',
      href: '/#cara-kerja',
    },
    {
      icon: Mail,
      title: locale === 'id' ? 'Hubungi Kami (Support)' : 'Contact Support',
      desc:
        locale === 'id'
          ? 'Tiket dukungan operasional dan eskalasi sengketa QA.'
          : 'Operational support desk and QA review dispute escalation.',
      href: '#support',
    },
    {
      icon: CheckCircle2,
      title: locale === 'id' ? 'Status Layanan' : 'Service Status',
      desc:
        locale === 'id'
          ? 'Marketplace, Private Upload Session, dan API Workspace beroperasi normal.'
          : 'Marketplace, Private Upload Sessions, and Workspace APIs operational.',
      href: '/status',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          {locale === 'id'
            ? 'Pusat Bantuan, Kebijakan & Resource EgvoX'
            : 'EgvoX Help Center, Policies & Resources'}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--egvox-text-secondary)]">
          {locale === 'id'
            ? 'Dokumentasi operasional, hak data, dan dukungan resmi untuk Kontributor, Vendor, dan Enterprise.'
            : 'Operational documentation, rights governance, and official support for Contributors, Vendors, and Enterprise.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.title}
              href={t.href}
              className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 hover:border-[#027F86] transition-colors"
            >
              <Icon className="h-5 w-5 text-[#027F86] dark:text-[#04B8B4]" />
              <h2 className="mt-3 text-sm font-bold text-[var(--egvox-text-primary)]">
                {t.title}
              </h2>
              <p className="mt-1 text-xs text-[var(--egvox-text-secondary)]">{t.desc}</p>
            </Link>
          );
        })}
      </div>

      <div id="rights" className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 space-y-3">
        <h2 id="privacy" className="text-lg font-bold">
          {locale === 'id'
            ? 'Hak Data, Persetujuan & Tata Kelola Media Privat'
            : 'Data Rights, Consent & Private Media Governance'}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--egvox-text-secondary)]">
          {locale === 'id'
            ? 'Setiap Work Order memisahkan pencatatan hak cipta, izin pemrosesan platform, lisensi komersial Vendor/Enterprise, retensi, dan persetujuan peserta/pihak ketiga. File tanpa bukti consent valid ditahan di zona karantina hingga diselesaikan oleh Compliance Officer.'
            : 'Every Work Order separates copyright ownership, platform processing permission, Vendor/Enterprise commercial licenses, retention bounds, and participant consent. Assets lacking valid consent remain in isolated quarantine until cleared.'}
        </p>
      </div>

      <div id="sop" className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 space-y-3">
        <h2 className="text-lg font-bold">
          {locale === 'id'
            ? 'Standar Capture & Checklist QA'
            : 'Capture Standards & QA Checklist'}
        </h2>
        <ul className="space-y-2 text-sm text-[var(--egvox-text-secondary)]">
          <li>
            •{' '}
            {locale === 'id'
              ? 'Pastikan resolusi minimum 1080p dan frame rate sesuai versi spesifikasi proyek.'
              : 'Maintain minimum 1080p resolution and frame rate matching the locked project spec version.'}
          </li>
          <li>
            •{' '}
            {locale === 'id'
              ? 'Hindari merekam wajah bystander, pelat nomor, atau dokumen rahasia tanpa izin tertulis.'
              : 'Avoid capturing bystander faces, license plates, or confidential documents without written consent.'}
          </li>
          <li>
            •{' '}
            {locale === 'id'
              ? 'Unggah hanya melalui sesi private upload resmi agar checksum SHA-256 tercatat.'
              : 'Submit footage strictly through official private upload sessions to record SHA-256 checksums.'}
          </li>
        </ul>
      </div>

      <div id="status" className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold">
            {locale === 'id' ? 'Status Sistem EgvoX' : 'EgvoX System Status'}
          </h2>
          <p className="text-xs text-[var(--egvox-text-secondary)]">
            {locale === 'id'
              ? 'Marketplace Katalog, Upload Karantina Privat, QA Pipeline, dan Google Workspace Plugins aktif.'
              : 'Marketplace Catalog, Private Quarantine Uploads, QA Pipeline, and Google Workspace Plugins operational.'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#16835D]/12 px-3 py-1.5 text-xs font-bold text-[#16835D]">
          <CheckCircle2 className="h-4 w-4" />
          {locale === 'id' ? 'Operasional' : 'Operational'}
        </span>
      </div>

      <div id="support" className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 space-y-4">
        <h2 className="text-lg font-bold">
          {locale === 'id' ? 'Hubungi Tim Support EgvoX' : 'Contact EgvoX Support Team'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setContactEmail('');
            setContactBody('');
            showToast(
              locale === 'id'
                ? 'Pesan dukungan telah dikirim ke tim EgvoX.'
                : 'Support ticket submitted to the EgvoX team.'
            );
          }}
          className="space-y-3 max-w-xl"
        >
          <input
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="email@company.com"
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
          />
          <textarea
            rows={3}
            required
            value={contactBody}
            onChange={(e) => setContactBody(e.target.value)}
            placeholder={
              locale === 'id'
                ? 'Jelaskan kendala atau pertanyaan Anda...'
                : 'Describe your question or operational issue...'
            }
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#027F86] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {locale === 'id' ? 'Kirim Pesan' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
