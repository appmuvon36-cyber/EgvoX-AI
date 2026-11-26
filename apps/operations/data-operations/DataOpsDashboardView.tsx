'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck2,
  FolderKanban,
  PackageCheck,
  ShieldCheck,
  Tag,
  UploadCloud,
} from 'lucide-react';
import { useAppState } from '@/lib/hooks/useAppState';

const WORKFLOW_9_STEPS = [
  { num: 1, title: 'Work Order', subId: '(Authorized)', subEn: '(Authorized)' },
  { num: 2, title: 'Upload', subId: '(Scoped)', subEn: '(Scoped)' },
  { num: 3, title: 'Quarantine', subId: '(Tinjau Awal)', subEn: '(Initial Triage)' },
  { num: 4, titleId: 'Validasi', titleEn: 'Validation', subId: '(Teknis)', subEn: '(Technical)' },
  { num: 5, title: 'Review', subId: '(Konten & Hak)', subEn: '(Content & Rights)' },
  { num: 6, title: 'Annotation', subId: '(Tugas & Schema)', subEn: '(Tasks & Schema)' },
  { num: 7, title: 'QA', subId: '(Multi-Layer)', subEn: '(Multi-Layer)' },
  { num: 8, title: 'Packaging', subId: '(Manifest & Export)', subEn: '(Manifest & Export)' },
  { num: 9, title: 'Delivery', subId: '(Ke Pembeli)', subEn: '(To Buyer)' },
];

export const DataOpsDashboardView: React.FC<{
  onNavigateModule: (mod: string) => void;
}> = ({ onNavigateModule }) => {
  const { locale, opsProjects, opsQuarantineItems, opsAnnotationProjects, opsDeliveryPackages } =
    useAppState();
  const isId = locale === 'id';
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  const kpis = [
    {
      label: isId ? 'Proyek Aktif' : 'Active Projects',
      value: opsProjects.length + 20,
      delta: '+14%',
      color: '#027F86',
      target: 'projects',
    },
    {
      label: 'Work Package',
      value: timeframe === '7d' ? 42 : timeframe === '90d' ? 318 : 128,
      delta: '+8%',
      color: '#039998',
      target: 'projects',
    },
    {
      label: isId ? 'Media Diterima' : 'Accepted Media',
      value: timeframe === '7d' ? '4.820' : timeframe === '90d' ? '48.910' : '18.420',
      delta: '+22%',
      color: '#16835D',
      target: 'review',
    },
    {
      label: isId ? 'Anotasi (Task)' : 'Annotations (Tasks)',
      value: timeframe === '7d' ? '14.200' : timeframe === '90d' ? '142.600' : '56.280',
      delta: '+18%',
      color: '#FC840E',
      target: 'annotation',
    },
    {
      label: isId ? 'Siap Delivery' : 'Ready for Delivery',
      value: opsDeliveryPackages.filter((p) => p.status !== 'delivered').length + 10,
      delta: '+33%',
      color: '#2563A6',
      target: 'packaging',
    },
  ];

  const quarantineCount = opsQuarantineItems.filter((q) => q.status === 'quarantine').length;
  const reviewCount = opsQuarantineItems.filter(
    (q) => q.status === 'human_review' || q.status === 'technical_validation'
  ).length;
  const annotationOpenCount = opsAnnotationProjects.filter((a) => a.status !== 'finalized').length;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {isId ? 'Dashboard Data Operations' : 'Data Operations Dashboard'}
          </h1>
          <p className="text-xs text-[var(--egvox-text-secondary)]">
            {isId
              ? 'Ringkasan operasional produksi dataset, karantina media, anotasi, QA multi-lapis, dan delivery.'
              : 'Operational overview of dataset capture, quarantine validation, annotation, QA, and delivery.'}
          </p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as '7d' | '30d' | '90d')}
          className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2 text-xs font-semibold"
        >
          <option value="7d">{isId ? '7 Hari Terakhir' : 'Last 7 Days'}</option>
          <option value="30d">{isId ? '30 Hari Terakhir' : 'Last 30 Days'}</option>
          <option value="90d">{isId ? '90 Hari Terakhir' : 'Last 90 Days'}</option>
        </select>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => onNavigateModule(kpi.target)}
            className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 text-left hover:border-[#027F86] transition-colors"
          >
            <p className="text-xs text-[var(--egvox-text-muted)] font-medium">{kpi.label}</p>
            <div className="mt-2 flex items-baseline justify-between gap-2 tabular-nums">
              <span className="text-2xl font-bold">{kpi.value}</span>
              <span
                className="text-xs font-bold"
                style={{ color: kpi.color }}
              >
                {kpi.delta}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Charts Row: Multi-Line Production Progress + Donut Status Work Package */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold">
              {isId ? 'Progress Produksi Dataset' : 'Dataset Production Progress'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2563A6]" /> Collection
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FC840E]" /> Annotation
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#027F86]" /> QA
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#16835D]" /> Packaging
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 600 200" className="w-full min-w-[440px] h-48">
              {[20, 60, 100, 140, 175].map((y, idx) => (
                <g key={y}>
                  <line
                    x1="40"
                    y1={y}
                    x2="585"
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="text-[var(--egvox-border-default)]"
                  />
                  <text
                    x="6"
                    y={y + 4}
                    fontSize="10"
                    fill="currentColor"
                    className="text-[var(--egvox-text-muted)]"
                  >
                    {['100%', '80%', '60%', '40%', '20%'][idx]}
                  </text>
                </g>
              ))}
              {/* Collection line */}
              <polyline
                fill="none"
                stroke="#2563A6"
                strokeWidth="2.5"
                points="45,148 125,134 210,118 295,94 380,76 465,56 575,34"
              />
              {/* Annotation line */}
              <polyline
                fill="none"
                stroke="#FC840E"
                strokeWidth="2.5"
                points="45,160 125,146 210,130 295,112 380,96 465,80 575,58"
              />
              {/* QA line */}
              <polyline
                fill="none"
                stroke="#027F86"
                strokeWidth="2.5"
                points="45,168 125,156 210,145 295,129 380,114 465,100 575,78"
              />
              {/* Packaging line */}
              <polyline
                fill="none"
                stroke="#16835D"
                strokeWidth="2.5"
                points="45,176 125,168 210,158 295,146 380,132 465,118 575,98"
              />
              {['1 Nov', '5 Nov', '9 Nov', '13 Nov', '17 Nov', '21 Nov', '29 Nov'].map(
                (lbl, idx) => (
                  <text
                    key={lbl}
                    x={45 + idx * 85}
                    y="194"
                    fontSize="10"
                    fill="currentColor"
                    className="text-[var(--egvox-text-muted)]"
                  >
                    {lbl}
                  </text>
                )
              )}
            </svg>
          </div>
        </div>

        {/* Status Work Package Donut */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
          <h2 className="text-sm font-bold">
            {isId ? 'Status Work Package' : 'Work Package Status'}
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative h-36 w-36 shrink-0">
              <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
                <circle cx="60" cy="60" r="46" fill="none" stroke="#027F86" strokeWidth="14" strokeDasharray="110 289" strokeDashoffset="0" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#2563A6" strokeWidth="14" strokeDasharray="58 289" strokeDashoffset="-110" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#FC840E" strokeWidth="14" strokeDasharray="26 289" strokeDashoffset="-168" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#16835D" strokeWidth="14" strokeDasharray="78 289" strokeDashoffset="-194" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#C43D3D" strokeWidth="14" strokeDasharray="17 289" strokeDashoffset="-272" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold tabular-nums">128</span>
                <span className="text-[10px] text-[var(--egvox-text-muted)]">
                  {isId ? 'Paket' : 'Packages'}
                </span>
              </div>
            </div>
            <div className="flex-1 w-full space-y-2 text-xs tabular-nums">
              {[
                { label: isId ? 'Proses (48)' : 'In Progress (48)', pct: '38%', color: '#027F86' },
                { label: 'Review (26)', pct: '20%', color: '#2563A6' },
                { label: 'Rework (12)', pct: '9%', color: '#FC840E' },
                { label: isId ? 'Selesai (34)' : 'Completed (34)', pct: '27%', color: '#16835D' },
                { label: 'Quarantine (8)', pct: '6%', color: '#C43D3D' },
              ].map((seg) => (
                <div key={seg.label} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span>{seg.label}</span>
                  </span>
                  <span className="font-bold">{seg.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Queues & Live Activity */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
          <h2 className="text-sm font-bold">
            {isId ? 'Antrian Operasional (Perlu Tindakan)' : 'Operational Queue (Action Required)'}
          </h2>
          <div className="space-y-2.5">
            {[
              {
                label: isId ? 'Upload menunggu validasi teknis' : 'Uploads awaiting technical check',
                count: `${quarantineCount + 22} ${isId ? 'item' : 'items'}`,
                color: '#027F86',
                icon: UploadCloud,
                target: 'quarantine',
              },
              {
                label: isId ? 'Review konten & consent' : 'Content & consent review',
                count: `${reviewCount + 15} ${isId ? 'item' : 'items'}`,
                color: '#FC840E',
                icon: ShieldCheck,
                target: 'review',
              },
              {
                label: isId ? 'Anotasi siap ditugaskan' : 'Annotation packages ready to assign',
                count: `${annotationOpenCount + 52} ${isId ? 'task' : 'tasks'}`,
                color: '#2563A6',
                icon: Tag,
                target: 'annotation',
              },
              {
                label: isId ? 'QA multi-lapis menunggu review' : 'Multi-layer QA awaiting decision',
                count: `12 ${isId ? 'paket' : 'pkgs'}`,
                color: '#B7791F',
                icon: ClipboardCheck,
                target: 'qa',
              },
              {
                label: isId ? 'Packaging siap dikirim ke pembeli' : 'Packages ready for buyer delivery',
                count: `${opsDeliveryPackages.length + 2} ${isId ? 'paket' : 'pkgs'}`,
                color: '#16835D',
                icon: PackageCheck,
                target: 'packaging',
              },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => onNavigateModule(q.target)}
                  className="w-full flex items-center justify-between rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-xs hover:border-[#027F86] transition-colors"
                >
                  <span className="inline-flex items-center gap-2.5 font-semibold">
                    <Icon className="h-4 w-4 shrink-0" style={{ color: q.color }} />
                    <span>{q.label}</span>
                  </span>
                  <span className="font-bold tabular-nums" style={{ color: q.color }}>
                    {q.count} →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">
              {isId ? 'Aktivitas Operasional Terbaru' : 'Recent Operational Activity'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigateModule('audit')}
              className="text-xs font-semibold text-[#027F86] hover:underline"
            >
              {isId ? 'Lihat Semua' : 'View All'}
            </button>
          </div>
          <div className="space-y-3 text-xs">
            {[
              {
                time: '10:24',
                text: isId
                  ? 'Upload sesi UP-2026-0012 selesai (120 file masuk Karantina)'
                  : 'Upload session UP-2026-0012 finished (120 files moved to Quarantine)',
                color: '#16835D',
              },
              {
                time: '09:56',
                text: isId
                  ? 'Paket anotasi AN-0543 masuk review QA Schema v1.2'
                  : 'Annotation package AN-0543 entered QA Schema v1.2 review',
                color: '#FC840E',
              },
              {
                time: '09:31',
                text: isId
                  ? 'Work package WP-0256 status diperbarui ke Validasi Teknis'
                  : 'Work package WP-0256 status updated to Technical Validation',
                color: '#027F86',
              },
              {
                time: '09:14',
                text: isId
                  ? 'Dataset PKG-0107 (12.450 file) siap dikirim ke PT Data Visual'
                  : 'Dataset PKG-0107 (12,450 files) ready for dispatch to PT Data Visual',
                color: '#2563A6',
              },
              {
                time: '08:47',
                text: isId
                  ? 'Proyek EGX-0256 Capture Spec v2.1 disinkronisasi'
                  : 'Project EGX-0256 Capture Spec v2.1 synchronized',
                color: '#16835D',
              },
            ].map((act) => (
              <div
                key={act.time + act.text}
                className="flex items-start gap-3 rounded-xl bg-[var(--egvox-bg-canvas)] p-3"
              >
                <span className="font-mono font-bold tabular-nums text-[var(--egvox-text-muted)]">
                  {act.time}
                </span>
                <span className="font-medium leading-snug">{act.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9-Step End-to-End Dataset Production Workflow */}
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold">
              {isId ? 'Workflow Produksi Dataset (End-to-End · 9 Tahap)' : 'End-to-End Dataset Production Workflow (9 Stages)'}
            </h2>
            <p className="text-xs text-[var(--egvox-text-muted)]">
              {isId
                ? 'Pipeline privat terisolasi dari publik: Work Order → Quarantine → QA Multi-Lapis → Delivery Terenkripsi.'
                : 'Private non-public pipeline: Work Order → Quarantine → Multi-Layer QA → Signed Delivery.'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {WORKFLOW_9_STEPS.map((st) => (
            <div
              key={st.num}
              className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-2.5 text-center"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#027F86] text-[10px] font-bold text-white tabular-nums">
                {st.num}
              </span>
              <p className="mt-1 text-[11px] font-bold">
                {'titleId' in st ? (isId ? st.titleId : st.titleEn) : st.title}
              </p>
              <p className="text-[10px] text-[var(--egvox-text-muted)]">
                {isId ? st.subId : st.subEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
