'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { egvoxFormatIDR } from '@/packages/design-system';
import {
  ActiveWorkOrder,
  AdminModerationListing,
  AdminVerificationCase,
  OpsAnnotationProject,
} from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';
import {
  AdminModerationModal,
  AdminOrderDetailModal,
  AdminSchemaAuditModal,
  AdminVerificationModal,
} from './SuperAdminModals';

export type AdminModulePart1Id =
  | 'verification'
  | 'moderation'
  | 'projects'
  | 'orders'
  | 'ops_monitor'
  | 'media_qa'
  | 'annotation_oversight';

export const SuperAdminModulesPart1: React.FC<{
  moduleId: AdminModulePart1Id;
  searchQuery: string;
}> = ({ moduleId, searchQuery }) => {
  const {
    locale,
    adminVerifications,
    adminModerations,
    decideModeration,
    opsProjects,
    workOrders,
    opsQuarantineItems,
    opsAnnotationProjects,
    updateQuarantineDecision,
    appendAuditLog,
  } = useAppState();
  const isId = locale === 'id';

  const [verRoleTab, setVerRoleTab] = useState<'Semua' | 'Freelancer' | 'Vendor' | 'Enterprise'>('Semua');
  const [modTab, setModTab] = useState<'Semua' | 'project' | 'service'>('Semua');
  const [projFilter, setProjFilter] = useState<'all' | 'collection' | 'review' | 'qa' | 'completed'>('all');
  const [orderTab, setOrderTab] = useState<'orders' | 'work_orders'>('orders');
  const [mediaTab, setMediaTab] = useState<'video' | 'image' | 'dataset'>('video');

  const [inspectVer, setInspectVer] = useState<AdminVerificationCase | null>(null);
  const [inspectMod, setInspectMod] = useState<AdminModerationListing | null>(null);
  const [inspectOrder, setInspectOrder] = useState<ActiveWorkOrder | null>(null);
  const [auditSchemaProject, setAuditSchemaProject] = useState<OpsAnnotationProject | null>(null);

  const q = searchQuery.trim().toLowerCase();

  return (
    <div className="space-y-5">
      {/* ================= VERIFIKASI PENGGUNA & ORGANISASI ================= */}
      {moduleId === 'verification' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">
                {isId ? 'Verifikasi Pengguna & Organisasi (KYC / KYB)' : 'User & Organization Verification (KYC / KYB)'}
              </h1>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Review identitas Freelancer, dokumen legalitas Dataset Vendor, dan signatory Enterprise.'
                  : 'Review Freelancer identity, Dataset Vendor business documents, and Enterprise signatories.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['Semua', 'Freelancer', 'Vendor', 'Enterprise'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setVerRoleTab(r)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    verRoleTab === r
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                  }`}
                >
                  {r === 'Semua' ? (isId ? 'Semua' : 'All') : r}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Pengguna / Organisasi' : 'User / Organization'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Peran' : 'Role'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Dokumen' : 'Documents'}</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">{isId ? 'Aksi' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--egvox-border-default)]">
                {adminVerifications
                  .filter(
                    (v) =>
                      (verRoleTab === 'Semua' || v.roleType === verRoleTab) &&
                      (!q ||
                        v.entityName.toLowerCase().includes(q) ||
                        v.email.toLowerCase().includes(q))
                  )
                  .map((v) => (
                    <tr key={v.id}>
                      <td className="px-4 py-3.5">
                        <p className="font-bold">{v.entityName}</p>
                        <p className="text-[11px] font-mono text-[var(--egvox-text-muted)]">{v.email}</p>
                      </td>
                      <td className="px-4 py-3.5 font-semibold">{v.roleType}</td>
                      <td className="px-4 py-3.5 text-[var(--egvox-text-secondary)]">
                        {v.documentType}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-md px-2.5 py-1 font-bold ${
                            v.status === 'verified'
                              ? 'bg-[#16835D]/12 text-[#16835D]'
                              : v.status === 'rejected'
                              ? 'bg-[#C43D3D]/12 text-[#C43D3D]'
                              : 'bg-[#F59E0B]/15 text-[#B7791F]'
                          }`}
                        >
                          {v.status === 'verified'
                            ? isId
                              ? 'Terverifikasi'
                              : 'Verified'
                            : v.status === 'rejected'
                            ? isId
                              ? 'Ditolak'
                              : 'Rejected'
                            : v.status === 'revision_requested'
                            ? isId
                              ? 'Perlu Revisi'
                              : 'Revision'
                            : isId
                            ? 'Menunggu'
                            : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectVer(v)}
                          className="rounded-lg bg-[#027F86] px-3 py-1.5 font-semibold text-white"
                        >
                          {isId ? 'Tinjau' : 'Review'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODERASI LISTING (PROJECT & SERVICE) ================= */}
      {moduleId === 'moderation' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">
                {isId ? 'Moderasi Listing (Project & Service Catalog)' : 'Listing Moderation (Project & Service Catalog)'}
              </h1>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Pastikan bukti consent preview tervalidasi dan tidak ada eksposur data raw publik.'
                  : 'Ensure preview consent evidence is verified with zero public raw data exposure.'}
              </p>
            </div>
            <div className="flex gap-1.5">
              {(['Semua', 'project', 'service'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setModTab(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    modTab === t
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                  }`}
                >
                  {t === 'Semua'
                    ? isId
                      ? 'Semua'
                      : 'All'
                    : t === 'project'
                    ? 'Project'
                    : isId
                    ? 'Layanan'
                    : 'Services'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {adminModerations
              .filter(
                (m) =>
                  (modTab === 'Semua' || m.listingType === modTab) &&
                  (!q ||
                    m.titleId.toLowerCase().includes(q) ||
                    m.titleEn.toLowerCase().includes(q) ||
                    m.code.toLowerCase().includes(q))
              )
              .map((m) => {
                const title = isId ? m.titleId : m.titleEn || m.titleId;
                return (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-hidden flex flex-col"
                  >
                    <img
                      src={m.thumbnail}
                      alt={title}
                      referrerPolicy="no-referrer"
                      className="h-36 w-full object-cover"
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#027F86]">{m.code}</span>
                          <span className="rounded bg-[#F59E0B]/15 px-2 py-0.5 text-[10px] font-bold text-[#B7791F]">
                            {m.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold mt-1">{title}</h3>
                        <p className="text-[var(--egvox-text-muted)]">
                          {m.ownerName} · {egvoxFormatIDR(m.rateIDR)}/{isId ? 'jam' : 'hr'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectMod(m)}
                          className="flex-1 rounded-xl bg-[#027F86] py-2 font-semibold text-white"
                        >
                          {isId ? 'Moderasi & Keputusan' : 'Moderate & Decide'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            decideModeration(
                              m.id,
                              'approved',
                              isId ? 'Quick-approve Super Admin' : 'Super Admin quick-approved'
                            )
                          }
                          title={isId ? 'Setujui Listing' : 'Approve Listing'}
                          aria-label={isId ? 'Setujui Listing' : 'Approve Listing'}
                          className="rounded-xl bg-[#16835D]/12 p-2 text-[#16835D] hover:bg-[#16835D] hover:text-white transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            decideModeration(
                              m.id,
                              'rejected',
                              isId ? 'Quick-reject Super Admin' : 'Super Admin quick-rejected'
                            )
                          }
                          title={isId ? 'Tolak Listing' : 'Reject Listing'}
                          aria-label={isId ? 'Tolak Listing' : 'Reject Listing'}
                          className="rounded-xl bg-[#C43D3D]/12 p-2 text-[#C43D3D] hover:bg-[#C43D3D] hover:text-white transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ================= MANAJEMEN PROYEK (OVERSIGHT) ================= */}
      {moduleId === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold">
              {isId ? 'Manajemen Proyek (Global Oversight)' : 'Project Management (Global Oversight)'}
            </h1>
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'collection', 'review', 'qa', 'completed'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setProjFilter(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    projFilter === s
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                  }`}
                >
                  {s === 'all' ? (isId ? 'Semua' : 'All') : s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isId ? 'ID Proyek' : 'Project ID'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Nama Proyek' : 'Project Name'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Klien / Vendor' : 'Client / Vendor'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Progress' : 'Progress'}</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--egvox-border-default)] tabular-nums">
                {opsProjects
                  .filter((p) => projFilter === 'all' || p.stage === projFilter)
                  .map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-mono font-bold text-[#027F86]">{p.projectCode}</td>
                      <td className="px-4 py-3 font-bold">{isId ? p.nameId : p.nameEn || p.nameId}</td>
                      <td className="px-4 py-3">{p.clientName}</td>
                      <td className="px-4 py-3 font-bold">{p.progressPercent}%</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-[#027F86]/10 px-2.5 py-0.5 font-bold text-[#027F86]">
                          {p.stage}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ORDERS & WORK ORDER ================= */}
      {moduleId === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold">
              {isId ? 'Orders & Work Order Governance' : 'Orders & Work Order Governance'}
            </h1>
            <div className="inline-flex rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-1">
              <button
                type="button"
                onClick={() => setOrderTab('orders')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  orderTab === 'orders' ? 'bg-[#027F86] text-white' : ''
                }`}
              >
                {isId ? 'Order (3.917)' : 'Orders (3,917)'}
              </button>
              <button
                type="button"
                onClick={() => setOrderTab('work_orders')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  orderTab === 'work_orders' ? 'bg-[#027F86] text-white' : ''
                }`}
              >
                {isId ? 'Work Order (1.204)' : 'Work Orders (1,204)'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isId ? 'No. Order' : 'Order No.'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Proyek / Kontrak' : 'Project / Contract'}</th>
                  <th className="px-4 py-3 font-semibold">Counterparty</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Nilai' : 'Value'}</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">{isId ? 'Aksi' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--egvox-border-default)] tabular-nums">
                {workOrders.map((wo) => (
                  <tr key={wo.id}>
                    <td className="px-4 py-3 font-mono font-bold text-[#027F86]">{wo.code}</td>
                    <td className="px-4 py-3 font-bold">{isId ? wo.title : wo.titleEn || wo.title}</td>
                    <td className="px-4 py-3">{wo.counterparty}</td>
                    <td className="px-4 py-3 font-bold">{egvoxFormatIDR(wo.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-[#16835D]/12 px-2.5 py-0.5 font-bold text-[#16835D]">
                        {wo.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setInspectOrder(wo)}
                        className="rounded-lg border border-[#027F86] px-2.5 py-1 font-semibold text-[#027F86] hover:bg-[#027F86] hover:text-white transition-colors"
                      >
                        {isId ? 'Inspeksi' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= DATA OPERATIONS MONITOR ================= */}
      {moduleId === 'ops_monitor' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">
                {isId ? 'Monitoring Data Operations (Sync ke ops.egvox.ai)' : 'Data Operations Monitor (Synced to ops.egvox.ai)'}
              </h1>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Status real-time pipeline produksi data, karantina privat, QA, dan readiness delivery.'
                  : 'Real-time status of data production pipelines, private quarantine, QA, and delivery readiness.'}
              </p>
            </div>
            <Link
              href="/ops"
              className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
            >
              <span>{isId ? 'Buka Data Ops Workspace' : 'Open Data Ops Workspace'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
            {[
              { label: 'Ingest (Quarantine)', value: '1.520', color: '#027F86' },
              { label: isId ? 'Processing & Validasi' : 'Processing & Validation', value: '842', color: '#2563A6' },
              { label: 'QA Gate Review', value: '327', color: '#FC840E' },
              { label: isId ? 'Siap Delivery' : 'Ready for Delivery', value: '896', color: '#16835D' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4"
              >
                <p className="text-xs text-[var(--egvox-text-muted)]">{s.label}</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: s.color }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MEDIA & QA REVIEW ================= */}
      {moduleId === 'media_qa' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold">
              {isId ? 'Antrian Review Media & QA (Private Watermark)' : 'Media & QA Review Queue (Private Watermark)'}
            </h1>
            <div className="flex gap-1.5">
              {(['video', 'image', 'dataset'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMediaTab(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    mediaTab === t
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                  }`}
                >
                  {t === 'video'
                    ? 'Video (182)'
                    : t === 'image'
                    ? isId
                      ? 'Gambar (64)'
                      : 'Images (64)'
                    : 'Dataset (81)'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {opsQuarantineItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={item.thumbnail}
                  alt={item.fileName}
                  referrerPolicy="no-referrer"
                  className="h-28 w-full sm:w-40 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between space-y-2 text-xs">
                  <div>
                    <p className="font-mono font-bold text-sm">{item.fileName}</p>
                    <p className="text-[var(--egvox-text-muted)] tabular-nums">
                      {item.projectCode} · {item.resolution} · {item.duration}
                    </p>
                    <p className="mt-1 font-semibold text-[#027F86]">Status: {item.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateQuarantineDecision(item.id, 'accepted');
                        appendAuditLog(
                          `${isId ? 'Media QA Setujui' : 'Media QA Approved'} ${item.fileName}`,
                          item.projectCode
                        );
                      }}
                      className="rounded-lg bg-[#16835D] px-3 py-1.5 font-semibold text-white"
                    >
                      {isId ? 'Setujui' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateQuarantineDecision(item.id, 'rework_required', 'QA-ADMIN-01');
                        appendAuditLog(
                          `${isId ? 'Media QA Revisi' : 'Media QA Rework'} ${item.fileName}`,
                          item.projectCode
                        );
                      }}
                      className="rounded-lg bg-[#FC840E] px-3 py-1.5 font-semibold text-white"
                    >
                      {isId ? 'Revisi' : 'Rework'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateQuarantineDecision(item.id, 'rejected', 'QA-ADMIN-REJECT');
                        appendAuditLog(
                          `${isId ? 'Media QA Tolak' : 'Media QA Rejected'} ${item.fileName}`,
                          item.projectCode
                        );
                      }}
                      className="rounded-lg border border-[#C43D3D] px-3 py-1.5 font-semibold text-[#C43D3D]"
                    >
                      {isId ? 'Tolak' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ANNOTATION OVERSIGHT ================= */}
      {moduleId === 'annotation_oversight' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold">
              {isId ? 'Monitoring Annotation Oversight' : 'Annotation Oversight Monitoring'}
            </h1>
            <Link
              href="/ops/annotation"
              className="rounded-xl border border-[#027F86] px-3.5 py-2 text-xs font-semibold text-[#027F86]"
            >
              {isId ? 'Buka Ops Annotation Studio →' : 'Open Ops Annotation Studio →'}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
            {[
              { label: isId ? 'Tugas Total' : 'Total Tasks', val: '12.540' },
              { label: isId ? 'Dalam Proses' : 'In Progress', val: '4.812' },
              { label: 'Review QA', val: '1.327' },
              { label: isId ? 'Selesai' : 'Completed', val: '6.401' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4"
              >
                <p className="text-xs text-[var(--egvox-text-muted)]">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
            {opsAnnotationProjects.map((ap) => (
              <div
                key={ap.id}
                className="grid sm:grid-cols-12 items-center gap-3 rounded-xl bg-[var(--egvox-bg-canvas)] px-4 py-3 text-xs tabular-nums"
              >
                <span className="sm:col-span-2 font-mono font-bold text-[#027F86]">{ap.code}</span>
                <span className="sm:col-span-5 font-bold">{isId ? ap.titleId : ap.titleEn || ap.titleId}</span>
                <div className="sm:col-span-3 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[var(--egvox-border-default)] overflow-hidden">
                    <div className="h-full bg-[#027F86]" style={{ width: `${ap.progressPercent}%` }} />
                  </div>
                  <span className="font-bold">{ap.progressPercent}%</span>
                </div>
                <div className="sm:col-span-2 sm:text-right">
                  <button
                    type="button"
                    onClick={() => setAuditSchemaProject(ap)}
                    className="font-semibold text-[#027F86] hover:underline"
                  >
                    {isId ? 'Audit Skema' : 'Audit Schema'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      <AdminVerificationModal item={inspectVer} onClose={() => setInspectVer(null)} />
      <AdminModerationModal item={inspectMod} onClose={() => setInspectMod(null)} />
      <AdminOrderDetailModal order={inspectOrder} onClose={() => setInspectOrder(null)} />
      <AdminSchemaAuditModal
        project={auditSchemaProject}
        onClose={() => setAuditSchemaProject(null)}
      />
    </div>
  );
};
