'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  CreditCard,
  Eye,
  FileCheck2,
  FolderKanban,
  Lock,
  Scale,
  Settings,
  ShieldCheck,
  Tag,
  UserCheck,
} from 'lucide-react';
import { useAppState } from '@/lib/hooks/useAppState';

export const SuperAdminDashboardView: React.FC<{
  onNavigateModule: (mod: string) => void;
  onOpenBreakGlass: () => void;
}> = ({ onNavigateModule, onOpenBreakGlass }) => {
  const {
    locale,
    adminVerifications,
    adminModerations,
    adminDisputes,
    adminAuditLogs,
  } = useAppState();
  const isId = locale === 'id';
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');

  const pendingVer = adminVerifications.filter((v) => v.status === 'pending').length;
  const pendingMod = adminModerations.filter(
    (m) => m.status === 'pending' || m.status === 'review'
  ).length;
  const openDisputes = adminDisputes.filter((d) => d.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {isId ? 'Dashboard Control Plane' : 'Control Plane Dashboard'}
          </h1>
          <p className="text-xs text-[var(--egvox-text-secondary)]">
            {isId
              ? 'Ringkasan tata kelola platform, antrian verifikasi & moderasi, keamanan RBAC, dan kesehatan operasional.'
              : 'Platform governance overview, verification & moderation queues, RBAC security, and operational health.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenBreakGlass}
            className="rounded-xl border border-[#C43D3D]/40 bg-[#C43D3D]/10 px-3 py-2 text-xs font-bold text-[#C43D3D] hover:bg-[#C43D3D]/20"
          >
            Break-Glass Access
          </button>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as '7d' | '30d' | '90d')}
            className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs font-semibold"
          >
            <option value="7d">{isId ? '7 Hari Terakhir' : 'Last 7 Days'}</option>
            <option value="30d">{isId ? '30 Hari Terakhir' : 'Last 30 Days'}</option>
            <option value="90d">{isId ? '90 Hari Terakhir' : 'Last 90 Days'}</option>
          </select>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isId ? 'Pengguna Terverifikasi' : 'Verified Users', val: '52.481', delta: '+6,8%', color: '#027F86', mod: 'verification' },
          { label: isId ? 'Proyek Aktif' : 'Active Projects', val: '1.238', delta: '+12,4%', color: '#039998', mod: 'projects' },
          { label: isId ? 'Order Berjalan' : 'Running Orders', val: '3.917', delta: '+8,1%', color: '#FC840E', mod: 'orders' },
          { label: isId ? 'Dataset Deliver' : 'Datasets Delivered', val: '896', delta: '+15,2%', color: '#16835D', mod: 'ops_monitor' },
        ].map((kpi) => (
          <button
            key={kpi.mod}
            type="button"
            onClick={() => onNavigateModule(kpi.mod)}
            className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 text-left hover:border-[#027F86] transition-colors"
          >
            <p className="text-xs text-[var(--egvox-text-muted)] font-medium">{kpi.label}</p>
            <div className="mt-2 flex items-baseline justify-between gap-2 tabular-nums">
              <span className="text-2xl font-bold">{kpi.val}</span>
              <span className="text-xs font-bold" style={{ color: kpi.color }}>
                {kpi.delta}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Charts: Platform Activity + Project Status Donut */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold">
              {isId ? 'Aktivitas Platform' : 'Platform Activity'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2563A6]" /> {isId ? 'Pendaftaran' : 'Signups'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#027F86]" /> {isId ? 'Proyek' : 'Projects'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FC840E]" /> {isId ? 'Order' : 'Orders'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#16835D]" /> Delivery
              </span>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 600 190" className="w-full min-w-[440px] h-44">
              {[20, 60, 100, 140, 170].map((y, idx) => (
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
                  <text x="6" y={y + 4} fontSize="10" fill="currentColor" className="text-[var(--egvox-text-muted)]">
                    {['1.000', '800', '600', '400', '200'][idx]}
                  </text>
                </g>
              ))}
              <polyline fill="none" stroke="#2563A6" strokeWidth="2.5" points="45,126 125,108 210,98 295,80 380,68 465,48 575,32" />
              <polyline fill="none" stroke="#027F86" strokeWidth="2.5" points="45,142 125,130 210,122 295,110 380,98 465,86 575,68" />
              <polyline fill="none" stroke="#FC840E" strokeWidth="2.5" points="45,152 125,144 210,136 295,125 380,115 465,106 575,88" />
              <polyline fill="none" stroke="#16835D" strokeWidth="2.5" points="45,165 125,158 210,152 295,142 380,134 465,126 575,112" />
              {['1 Nov', '5 Nov', '9 Nov', '13 Nov', '17 Nov', '21 Nov', '29 Nov'].map((lbl, idx) => (
                <text key={lbl} x={45 + idx * 85} y="186" fontSize="10" fill="currentColor" className="text-[var(--egvox-text-muted)]">
                  {lbl}
                </text>
              ))}
            </svg>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
          <h2 className="text-sm font-bold">
            {isId ? 'Status Proyek' : 'Project Status'}
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative h-36 w-36 shrink-0">
              <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
                <circle cx="60" cy="60" r="46" fill="none" stroke="#027F86" strokeWidth="14" strokeDasharray="162 289" strokeDashoffset="0" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#2563A6" strokeWidth="14" strokeDasharray="52 289" strokeDashoffset="-162" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#FC840E" strokeWidth="14" strokeDasharray="26 289" strokeDashoffset="-214" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#16835D" strokeWidth="14" strokeDasharray="40 289" strokeDashoffset="-240" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#C43D3D" strokeWidth="14" strokeDasharray="9 289" strokeDashoffset="-280" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold tabular-nums">1.238</span>
                <span className="text-[10px] text-[var(--egvox-text-muted)]">
                  {isId ? 'Proyek' : 'Projects'}
                </span>
              </div>
            </div>
            <div className="flex-1 w-full space-y-2 text-xs tabular-nums">
              {[
                { label: isId ? 'Produksi' : 'Production', pct: '56%', color: '#027F86' },
                { label: 'Review / QA', pct: '18%', color: '#2563A6' },
                { label: isId ? 'Revisi' : 'Rework', pct: '9%', color: '#FC840E' },
                { label: isId ? 'Selesai' : 'Completed', pct: '14%', color: '#16835D' },
                { label: isId ? 'Ditunda' : 'On Hold', pct: '3%', color: '#C43D3D' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.label}</span>
                  </span>
                  <span className="font-bold">{s.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Queues & Live Immutable Audit Trail */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
          <h2 className="text-sm font-bold">
            {isId ? 'Antrian & Perhatian (Action Required)' : 'Queues & Alerts (Action Required)'}
          </h2>
          <div className="space-y-2.5">
            {[
              {
                label: isId ? 'Verifikasi Pengguna (KYC / Profile)' : 'User & Org Verification (KYC / KYB)',
                count: `${pendingVer + 245} ${isId ? 'antrian' : 'queued'}`,
                color: '#027F86',
                target: 'verification',
              },
              {
                label: isId ? 'Moderasi Listing (Project & Service)' : 'Listing Moderation (Project & Service)',
                count: `${pendingMod + 109} ${isId ? 'antrian' : 'queued'}`,
                color: '#FC840E',
                target: 'moderation',
              },
              {
                label: isId ? 'Review Media & QA (Private Storage)' : 'Media & QA Review (Private Storage)',
                count: `327 ${isId ? 'antrian' : 'queued'}`,
                color: '#2563A6',
                target: 'media_qa',
              },
              {
                label: isId ? 'Disputes / Sengketa Aktif' : 'Active Disputes & Escalations',
                count: `${openDisputes + 15} ${isId ? 'kasus' : 'cases'}`,
                color: '#C43D3D',
                target: 'disputes',
              },
            ].map((item) => (
              <button
                key={item.target}
                type="button"
                onClick={() => onNavigateModule(item.target)}
                className="w-full flex items-center justify-between rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-4 py-3 text-xs hover:border-[#027F86] transition-colors"
              >
                <span className="font-semibold">{item.label}</span>
                <span className="font-bold tabular-nums" style={{ color: item.color }}>
                  {item.count} →
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">
              {isId ? 'Aktivitas Terbaru (Audit & Operasional)' : 'Recent Activity (Audit & Operations)'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigateModule('audit')}
              className="text-xs font-semibold text-[#027F86] hover:underline"
            >
              {isId ? 'Lihat Semua' : 'View All'}
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            {adminAuditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-xl bg-[var(--egvox-bg-canvas)] p-3"
              >
                <span className="font-mono font-bold tabular-nums text-[var(--egvox-text-muted)]">
                  {log.timestamp}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{log.activity}</p>
                  <p className="text-[11px] text-[var(--egvox-text-muted)]">
                    {log.actorCode} ({log.actorRole}) · {log.target}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 14 Core Modules Matrix + RBAC Guard Summary */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
          <h2 className="text-sm font-bold">
            {isId ? 'Modul Utama Control Plane (Master PRD v1.3)' : 'Control Plane Core Modules (Master PRD v1.3)'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-[11px]">
            {[
              { id: 'verification', label: 'User & Org Verification', icon: UserCheck },
              { id: 'moderation', label: isId ? 'Moderasi Listing' : 'Listing Moderation', icon: CheckCircle2 },
              { id: 'projects', label: isId ? 'Manajemen Proyek' : 'Project Management', icon: FolderKanban },
              { id: 'orders', label: isId ? 'Orders & Work Order' : 'Orders & Work Orders', icon: FileCheck2 },
              { id: 'ops_monitor', label: 'Data Ops Monitor', icon: Activity },
              { id: 'media_qa', label: 'Media & QA Review', icon: Eye },
              { id: 'annotation_oversight', label: 'Annotation Oversight', icon: Tag },
              { id: 'enterprise', label: 'Enterprise & CRM', icon: Building2 },
              { id: 'finance', label: isId ? 'Keuangan & Payout' : 'Finance & Payouts', icon: CreditCard },
              { id: 'rights', label: 'Rights & Compliance', icon: ShieldCheck },
              { id: 'disputes', label: 'Disputes & Cases', icon: Scale },
              { id: 'analytics', label: isId ? 'Laporan & Analitik' : 'Reports & Analytics', icon: Activity },
              { id: 'audit', label: 'Audit Log (Immutable)', icon: Lock },
              { id: 'config', label: isId ? 'Konfigurasi & RBAC' : 'Config & RBAC', icon: Settings },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onNavigateModule(m.id)}
                  className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-left hover:border-[#027F86] transition-colors space-y-1.5"
                >
                  <Icon className="h-4 w-4 text-[#027F86]" />
                  <p className="font-bold leading-snug">{m.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-2.5 text-xs">
          <h2 className="text-sm font-bold">
            {isId ? 'RBAC & Keamanan Control Plane' : 'RBAC & Control Plane Security'}
          </h2>
          {(isId
            ? [
                'Role-Based Access Control (RBAC)',
                'Organization Isolation (Multi-Org)',
                'MFA (Wajib 6-Digit) & Session Guard',
                'Dual Approval Finance Controls',
                'Break-Glass Access (Akses Darurat)',
                'Immutable Audit Trail & IP Allowlist',
              ]
            : [
                'Role-Based Access Control (RBAC)',
                'Organization Isolation (Multi-Org)',
                'Mandatory 6-Digit MFA & Session Guard',
                'Dual-Approval Finance Controls',
                'Time-Bound Break-Glass Access',
                'Immutable Audit Trail & IP Allowlist',
              ]
          ).map((rule) => (
            <div key={rule} className="flex items-center gap-2 text-[var(--egvox-text-secondary)]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#16835D] shrink-0" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
