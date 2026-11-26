'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Download,
  Inbox,
  Loader2,
  Pencil,
  Plus,
} from 'lucide-react';
import { egvoxFormatIDR } from '@/packages/design-system';
import {
  AdminDisputeCase,
  AdminEnterpriseDeal,
  AdminFinanceRecord,
  AdminRbacRole,
  AdminRightsRecord,
} from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';
import {
  AdminDisputeResolveModal,
  AdminEnterpriseDealModal,
  AdminFinanceApprovalModal,
  AdminProvisionUserModal,
  AdminRbacEditModal,
  AdminRightsInspectorModal,
  AdminSystemConfigModal,
} from './SuperAdminModals';

export type AdminModulePart2Id =
  | 'enterprise'
  | 'finance'
  | 'rights'
  | 'disputes'
  | 'analytics'
  | 'audit'
  | 'config';

export const SuperAdminModulesPart2: React.FC<{
  moduleId: AdminModulePart2Id;
  searchQuery: string;
  onOpenBreakGlass: () => void;
}> = ({ moduleId, searchQuery, onOpenBreakGlass }) => {
  const {
    locale,
    adminEnterpriseDeals,
    adminFinanceRecords,
    adminRightsRecords,
    updateRightsStatus,
    adminDisputes,
    adminAuditLogs,
    appendAuditLog,
    adminRbacRoles,
    showToast,
  } = useAppState();
  const isId = locale === 'id';

  const [dealModal, setDealModal] = useState<AdminEnterpriseDeal | null>(null);
  const [finTab, setFinTab] = useState<'all' | 'invoice' | 'payout' | 'reconciliation'>('all');
  const [finModal, setFinModal] = useState<AdminFinanceRecord | null>(null);
  const [rightsTab, setRightsTab] = useState<'all' | 'consent' | 'license' | 'permitted_use'>('all');
  const [rightsModal, setRightsModal] = useState<AdminRightsRecord | null>(null);
  const [disputeModal, setDisputeModal] = useState<AdminDisputeCase | null>(null);
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [auditFilter, setAuditFilter] = useState<'7d' | 'all' | 'break_glass'>('7d');
  const [activeConfigTitle, setActiveConfigTitle] = useState<string | null>(null);
  const [editRbacRole, setEditRbacRole] = useState<AdminRbacRole | null>(null);

  // Interactive UI States Showcase
  const [uiDemoState, setUiDemoState] = useState<'populated' | 'loading' | 'empty' | 'error'>('populated');

  const q = searchQuery.trim().toLowerCase();

  return (
    <div className="space-y-5">
      {/* ================= ENTERPRISE & CRM ================= */}
      {moduleId === 'enterprise' && (
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold">Enterprise &amp; CRM (Managed Official Projects)</h1>
            <p className="text-xs text-[var(--egvox-text-secondary)]">
              {isId
                ? 'Konversi RFP Enterprise menjadi Negosiasi Kontrak hingga Official Project terkelola di Data Ops.'
                : 'Convert Enterprise RFPs into contract negotiations and managed Official Projects in Data Ops.'}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {adminEnterpriseDeals.map((deal) => (
              <div
                key={deal.id}
                className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#FC840E]/15 px-2 py-0.5 text-[10px] font-bold text-[#FC840E] uppercase">
                      {deal.stage}
                    </span>
                    {deal.officialProjectCode && (
                      <span className="font-mono text-[11px] font-bold text-[#027F86]">
                        {deal.officialProjectCode}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold">{deal.companyName}</h3>
                  <p className="text-xs text-[var(--egvox-text-secondary)]">{deal.briefSummary}</p>
                  <p className="text-[11px] text-[var(--egvox-text-muted)]">
                    PIC: {deal.picName || deal.picEmail}
                    {deal.picPhone ? ` · ${deal.picPhone}` : ''}
                  </p>
                  {deal.attachmentName && (
                    <p className="inline-block rounded-md border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-2 py-0.5 text-[10px] font-mono text-[#027F86]">
                      {isId ? 'Dokumen:' : 'Document:'} {deal.attachmentName}
                    </p>
                  )}
                  <p className="text-xs font-bold text-[#027F86] tabular-nums pt-1">
                    {egvoxFormatIDR(deal.contractValueIDR)} · {deal.estimatedHours} {isId ? 'jam' : 'hrs'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDealModal(deal)}
                  className="w-full rounded-xl bg-[#027F86] py-2 text-xs font-semibold text-white"
                >
                  {isId ? 'Kelola Pipeline Deal' : 'Manage Deal Pipeline'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= KEUANGAN & TRANSAKSI (DUAL APPROVAL) ================= */}
      {moduleId === 'finance' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">
                {isId ? 'Keuangan & Transaksi (Dual-Approval Control)' : 'Finance & Transactions (Dual-Approval Control)'}
              </h1>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId ? 'Total Transaksi:' : 'Total Volume:'} <strong>Rp 2.450.000.000</strong> ·{' '}
                {isId ? 'Payout Menunggu:' : 'Pending Payouts:'}{' '}
                <strong className="text-[#FC840E]">Rp 125.000.000</strong>
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'invoice', 'payout', 'reconciliation'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFinTab(k)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    finTab === k
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                  }`}
                >
                  {k === 'all' ? (isId ? 'Semua' : 'All') : k.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Kode' : 'Code'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Jenis' : 'Type'}</th>
                  <th className="px-4 py-3 font-semibold">Counterparty</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Nominal' : 'Amount'}</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">{isId ? 'Aksi' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--egvox-border-default)] tabular-nums">
                {adminFinanceRecords
                  .filter((f) => finTab === 'all' || f.kind === finTab)
                  .map((rec) => (
                    <tr key={rec.id}>
                      <td className="px-4 py-3 font-mono font-bold text-[#027F86]">{rec.code}</td>
                      <td className="px-4 py-3 uppercase font-semibold">{rec.kind}</td>
                      <td className="px-4 py-3">{rec.counterparty}</td>
                      <td className="px-4 py-3 font-bold">{egvoxFormatIDR(rec.amountIDR)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 font-bold ${
                            rec.status === 'pending_dual_approval'
                              ? 'bg-[#F59E0B]/15 text-[#B7791F]'
                              : 'bg-[#16835D]/12 text-[#16835D]'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {rec.status === 'pending_dual_approval' ? (
                          <button
                            type="button"
                            onClick={() => setFinModal(rec)}
                            className="rounded-lg bg-[#027F86] px-3 py-1.5 font-semibold text-white"
                          >
                            Dual-Approve
                          </button>
                        ) : (
                          <span className="text-[#16835D] font-bold">Posted</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= RIGHTS & COMPLIANCE ================= */}
      {moduleId === 'rights' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold">
              {isId ? 'Rights, Consent & Compliance Governance' : 'Rights, Consent & Compliance Governance'}
            </h1>
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'consent', 'license', 'permitted_use'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setRightsTab(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    rightsTab === t
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                  }`}
                >
                  {t === 'all' ? (isId ? 'Semua' : 'All') : t.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] divide-y divide-[var(--egvox-border-default)]">
            {adminRightsRecords
              .filter((r) => rightsTab === 'all' || r.kind === rightsTab)
              .map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-mono font-bold text-[#027F86]">
                      {rec.code} · {rec.projectCode}
                    </p>
                    <p className="text-sm font-bold mt-0.5">{rec.subjectTitle}</p>
                    <p className="text-[var(--egvox-text-muted)]">
                      {isId ? 'Teritori:' : 'Territory:'} {rec.territory} · {isId ? 'Retensi:' : 'Retention:'}{' '}
                      {rec.retentionLabel}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className="rounded bg-[#16835D]/12 px-2.5 py-1 font-bold text-[#16835D]">
                      {rec.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRightsModal(rec)}
                      className="rounded-lg bg-[#027F86] px-3 py-1.5 font-semibold text-white"
                    >
                      {isId ? 'Inspeksi Manifest' : 'Inspect Manifest'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateRightsStatus(
                          rec.id,
                          rec.status === 'valid' ? 'review' : 'valid'
                        )
                      }
                      className="rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 font-semibold"
                    >
                      Toggle Review
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= DISPUTES & CASES ================= */}
      {moduleId === 'disputes' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">
            {isId ? 'Manajemen Sengketa (Disputes & Cases)' : 'Disputes & Case Resolution'}
          </h1>
          <div className="grid gap-4 md:grid-cols-2">
            {adminDisputes.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#C43D3D]">
                    {d.code} · {d.workOrderCode}
                  </span>
                  <span className="rounded bg-[#FC840E]/15 px-2.5 py-0.5 font-bold text-[#FC840E]">
                    {d.status} ({d.severity})
                  </span>
                </div>
                <h3 className="text-sm font-bold">{isId ? d.titleId : d.titleEn || d.titleId}</h3>
                <p className="text-[var(--egvox-text-secondary)]">{d.rationale}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--egvox-border-default)] tabular-nums">
                  <span className="font-bold">
                    {isId ? 'Nilai Sengketa:' : 'Amount at Risk:'} {egvoxFormatIDR(d.amountAtRiskIDR)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDisputeModal(d)}
                    className="rounded-xl bg-[#027F86] px-3.5 py-1.5 font-semibold text-white"
                  >
                    {isId ? 'Tinjau & Putuskan' : 'Review & Resolve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= LAPORAN & ANALITIK ================= */}
      {moduleId === 'analytics' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">
            {isId ? 'Laporan & Analitik Performa Produksi Platform' : 'Platform Production Reports & Analytics'}
          </h1>
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
              <h2 className="text-sm font-bold">
                {isId ? 'Performa Delivery & Kualitas QA (Bulanan)' : 'Monthly Delivery & QA Acceptance Performance'}
              </h2>
              <svg viewBox="0 0 560 180" className="w-full h-44">
                {[30, 70, 110, 150].map((y) => (
                  <line key={y} x1="20" y1={y} x2="540" y2={y} stroke="currentColor" strokeDasharray="3 3" className="text-[var(--egvox-border-default)]" />
                ))}
                {[
                  { x: 40, h: 72, lbl: 'Jun' },
                  { x: 120, h: 86, lbl: 'Jul' },
                  { x: 200, h: 98, lbl: isId ? 'Agu' : 'Aug' },
                  { x: 280, h: 112, lbl: 'Sep' },
                  { x: 360, h: 125, lbl: isId ? 'Okt' : 'Oct' },
                  { x: 440, h: 140, lbl: 'Nov' },
                ].map((bar) => (
                  <g key={bar.lbl}>
                    <rect
                      x={bar.x}
                      y={160 - bar.h}
                      width="44"
                      height={bar.h}
                      rx="6"
                      fill="#027F86"
                    />
                    <text x={bar.x + 12} y="175" fontSize="11" fill="currentColor" className="text-[var(--egvox-text-muted)]">
                      {bar.lbl}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="lg:col-span-4 space-y-3 tabular-nums">
              {[
                {
                  label: isId ? 'Dataset Terkumpul' : 'Collected Datasets',
                  val: isId ? '896 Paket' : '896 Packages',
                  color: '#027F86',
                },
                {
                  label: isId ? 'Tingkat Penerimaan QA' : 'QA Acceptance Rate',
                  val: '94.2%',
                  color: '#16835D',
                },
                {
                  label: isId ? 'Rerata Lead Time' : 'Avg. Lead Time',
                  val: isId ? '5,3 Hari' : '5.3 Days',
                  color: '#FC840E',
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4"
                >
                  <p className="text-xs text-[var(--egvox-text-muted)]">{m.label}</p>
                  <p className="mt-1 text-2xl font-bold" style={{ color: m.color }}>
                    {m.val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= AUDIT LOG (IMMUTABLE) ================= */}
      {moduleId === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">
                {isId ? 'Immutable Audit Log (Penuh & Tidak Dapat Diubah)' : 'Immutable Audit Log (Append-Only)'}
              </h1>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Mencatat setiap aksi Super Admin, Dual Approval Keuangan, serta sesi darurat Break-Glass.'
                  : 'Records all Super Admin actions, dual financial approvals, and emergency Break-Glass sessions.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value as '7d' | 'all' | 'break_glass')}
                className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs font-semibold"
              >
                <option value="7d">{isId ? '7 Hari Terakhir' : 'Last 7 Days'}</option>
                <option value="all">{isId ? 'Semua Riwayat' : 'All History'}</option>
                <option value="break_glass">Break-Glass Only</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  const header = isId
                    ? 'Waktu,Actor,Role,Aktivitas,Target,IP,BreakGlass\n'
                    : 'Time,Actor,Role,Activity,Target,IP,BreakGlass\n';
                  const rows = adminAuditLogs
                    .map(
                      (l) =>
                        `"${l.timestamp}","${l.actorCode}","${l.actorRole}","${l.activity.replace(/"/g, '""')}","${l.target}","${l.ipAddress}",${Boolean(l.isBreakGlass)}`
                    )
                    .join('\n');
                  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'egvox-immutable-audit-log.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                  appendAuditLog(
                    isId ? 'Ekspor Immutable Audit Log (CSV)' : 'Exported Immutable Audit Log (CSV)',
                    'Audit Trail Export'
                  );
                  showToast(isId ? 'Audit Log berhasil diekspor ke CSV.' : 'Audit Log exported to CSV.');
                }}
                className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isId ? 'Ekspor CSV' : 'Export CSV'}</span>
              </button>
              <button
                type="button"
                onClick={onOpenBreakGlass}
                className="rounded-xl bg-[#C43D3D] px-4 py-2 text-xs font-semibold text-white"
              >
                {isId ? 'Catat Break-Glass Access' : 'Log Break-Glass Access'}
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Waktu' : 'Time'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Pengguna' : 'Actor'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Aktivitas' : 'Activity'}</th>
                  <th className="px-4 py-3 font-semibold">Target</th>
                  <th className="px-4 py-3 font-semibold">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--egvox-border-default)] tabular-nums">
                {adminAuditLogs
                  .filter(
                    (l) =>
                      (auditFilter !== 'break_glass' || Boolean(l.isBreakGlass)) &&
                      (!q ||
                        l.activity.toLowerCase().includes(q) ||
                        l.target.toLowerCase().includes(q))
                  )
                  .map((log) => (
                    <tr
                      key={log.id}
                      className={log.isBreakGlass ? 'bg-[#C43D3D]/8' : undefined}
                    >
                      <td className="px-4 py-3 font-mono">{log.timestamp}</td>
                      <td className="px-4 py-3 font-mono font-bold">
                        {log.actorCode} ({log.actorRole})
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {log.isBreakGlass && (
                          <span className="mr-1.5 rounded bg-[#C43D3D] px-1.5 py-0.5 text-[10px] font-bold text-white">
                            BREAK-GLASS
                          </span>
                        )}
                        {log.activity}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#027F86]">{log.target}</td>
                      <td className="px-4 py-3 font-mono text-[var(--egvox-text-muted)]">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= KONFIGURASI SISTEM & RBAC + UI STATES ================= */}
      {moduleId === 'config' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">
                {isId ? 'Konfigurasi Sistem, RBAC & UI States' : 'System Configuration, RBAC & UI States'}
              </h1>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Kelola peran internal terisolasi, batas SLA, dan pratinjau UI states (Loading / Empty / Error).'
                  : 'Manage isolated internal roles, SLA thresholds, and preview system UI states (Loading / Empty / Error).'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setProvisionOpen(true)}
              className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>{isId ? 'Provision Admin Internal' : 'Provision Internal Admin'}</span>
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: isId ? 'Pengaturan Platform' : 'Platform Settings',
                desc: isId
                  ? 'Umum, Branding, Bilingual & Dual Currency'
                  : 'General, Branding, Bilingual & Dual Currency',
              },
              {
                title: isId ? 'Modal Data & Kategori' : 'Data Modalities & Taxonomy',
                desc: isId
                  ? 'Taksonomi Egocentric Cooking, Manufaktur, Otomotif'
                  : 'Egocentric Cooking, Manufacturing & Automotive taxonomy',
              },
              {
                title: 'Workflow & SLA',
                desc: isId
                  ? 'Batas waktu QA, Karantina & Eskalasi'
                  : 'QA, Quarantine & Escalation turnaround targets',
              },
              {
                title: isId ? 'Integrasi Pembayaran' : 'Payment Integration',
                desc: isId
                  ? 'Ledger Reservasi Dana, Dual-Approval & Payout Gate'
                  : 'Authorized Fund Reservations, Dual-Approval & Payout Gate',
              },
              {
                title: isId ? 'Kebijakan & Terms' : 'Policies & Terms',
                desc: isId
                  ? 'Consent Standard, Privacy PII & Data Rights'
                  : 'Consent Standards, PII Redaction & Data Rights',
              },
              {
                title: 'Backup & Maintenance',
                desc: isId
                  ? 'Audit Snapshot & IP Allowlist Control Plane'
                  : 'Audit Snapshots & Control Plane IP Allowlist',
              },
            ].map((cfg) => (
              <button
                key={cfg.title}
                type="button"
                onClick={() => setActiveConfigTitle(cfg.title)}
                className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 text-left hover:border-[#027F86] transition-colors"
              >
                <p className="text-sm font-bold">{cfg.title}</p>
                <p className="text-xs text-[var(--egvox-text-muted)] mt-1">{cfg.desc}</p>
              </button>
            ))}
          </div>

          {/* RBAC Matrix */}
          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
            <h2 className="text-sm font-bold">
              {isId ? 'Manajemen Akses & RBAC Matrix' : 'Access Management & RBAC Matrix'}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[var(--egvox-border-default)] text-[var(--egvox-text-muted)]">
                  <tr>
                    <th className="py-2 pr-4 font-semibold">Role</th>
                    <th className="py-2 pr-4 font-semibold">{isId ? 'Deskripsi' : 'Description'}</th>
                    <th className="py-2 pr-4 font-semibold">{isId ? 'Pengguna' : 'Users'}</th>
                    <th className="py-2 pr-4 font-semibold">Permissions</th>
                    <th className="py-2 font-semibold text-right">{isId ? 'Aksi' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--egvox-border-default)] tabular-nums">
                  {adminRbacRoles.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 pr-4 font-bold text-[#027F86]">{r.name}</td>
                      <td className="py-3 pr-4">{isId ? r.descriptionId : r.descriptionEn}</td>
                      <td className="py-3 pr-4 font-bold">{r.userCount}</td>
                      <td className="py-3 pr-4 font-mono text-[11px] text-[var(--egvox-text-muted)]">
                        {r.permissions.join(', ')}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setEditRbacRole(r)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#027F86] px-2.5 py-1 font-semibold text-[#027F86] hover:bg-[#027F86] hover:text-white transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive UI States Preview (Populated / Loading / Empty / Error) */}
          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold">
                {isId ? 'Status & UI States System Check' : 'Status & UI States System Check'}
              </h2>
              <div className="flex gap-1.5 text-xs">
                {(['populated', 'loading', 'empty', 'error'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setUiDemoState(st)}
                    className={`rounded-lg px-3 py-1 font-semibold capitalize ${
                      uiDemoState === st
                        ? 'bg-[#027F86] text-white'
                        : 'border border-[var(--egvox-border-default)]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            {uiDemoState === 'loading' && (
              <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-8 text-center text-xs space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-[#027F86] mx-auto" />
                <p className="font-bold">
                  {isId ? 'Memuat data sistem...' : 'Loading system data...'}
                </p>
              </div>
            )}
            {uiDemoState === 'empty' && (
              <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-8 text-center text-xs space-y-2">
                <Inbox className="h-6 w-6 text-[var(--egvox-text-muted)] mx-auto" />
                <p className="font-bold">
                  {isId
                    ? 'Empty State — Tidak ada data antrian pada filter ini.'
                    : 'Empty State — No queue items match this filter.'}
                </p>
              </div>
            )}
            {uiDemoState === 'error' && (
              <div className="rounded-xl border border-[#C43D3D]/30 bg-[#C43D3D]/10 p-8 text-center text-xs space-y-2 text-[#C43D3D]">
                <AlertTriangle className="h-6 w-6 mx-auto" />
                <p className="font-bold">
                  {isId
                    ? 'Error State — Gagal memuat data telemetry, coba lagi.'
                    : 'Error State — Failed to load telemetry data, please retry.'}
                </p>
              </div>
            )}
            {uiDemoState === 'populated' && (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-[#F59E0B]/15 px-3 py-1 font-bold text-[#B7791F]">
                  {isId ? 'Menunggu' : 'Pending'}
                </span>
                <span className="rounded-md bg-[#16835D]/12 px-3 py-1 font-bold text-[#16835D]">
                  {isId ? 'Disetujui' : 'Approved'}
                </span>
                <span className="rounded-md bg-[#FC840E]/15 px-3 py-1 font-bold text-[#FC840E]">
                  {isId ? 'Revisi' : 'Rework'}
                </span>
                <span className="rounded-md bg-[#C43D3D]/12 px-3 py-1 font-bold text-[#C43D3D]">
                  {isId ? 'Ditolak' : 'Rejected'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      <AdminEnterpriseDealModal deal={dealModal} onClose={() => setDealModal(null)} />
      <AdminFinanceApprovalModal record={finModal} onClose={() => setFinModal(null)} />
      <AdminDisputeResolveModal dispute={disputeModal} onClose={() => setDisputeModal(null)} />
      <AdminProvisionUserModal open={provisionOpen} onClose={() => setProvisionOpen(false)} />
      <AdminRightsInspectorModal record={rightsModal} onClose={() => setRightsModal(null)} />
      <AdminSystemConfigModal
        configTitle={activeConfigTitle}
        onClose={() => setActiveConfigTitle(null)}
      />
      <AdminRbacEditModal
        key={editRbacRole?.id || 'rbac-none'}
        role={editRbacRole}
        onClose={() => setEditRbacRole(null)}
      />
    </div>
  );
};
