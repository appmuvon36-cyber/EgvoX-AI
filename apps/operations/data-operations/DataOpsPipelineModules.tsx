'use client';

import React, { useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import {
  OpsDeliveryPackage,
  OpsProjectPackage,
  OpsQuarantineItem,
} from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';
import {
  CreateWorkPackageModal,
  DeliveryDispatchModal,
  NewUploadSessionModal,
  QuarantineTriageModal,
  WorkPackageAllocationModal,
} from './DataOpsModals';

export type OpsModuleId =
  | 'dashboard'
  | 'projects'
  | 'capture'
  | 'uploads'
  | 'quarantine'
  | 'technical'
  | 'review'
  | 'annotation'
  | 'qa'
  | 'packaging'
  | 'sla'
  | 'audit'
  | 'settings';

export const DataOpsPipelineModules: React.FC<{
  moduleId: Exclude<OpsModuleId, 'dashboard' | 'annotation'>;
  searchQuery: string;
}> = ({ moduleId, searchQuery }) => {
  const {
    locale,
    opsProjects,
    opsUploadSessions,
    opsQuarantineItems,
    opsDeliveryPackages,
    updateQuarantineDecision,
    adminAuditLogs,
    showToast,
  } = useAppState();
  const isId = locale === 'id';

  const [stageFilter, setStageFilter] = useState<string>('all');
  const [newUploadOpen, setNewUploadOpen] = useState(false);
  const [createPackageOpen, setCreatePackageOpen] = useState(false);
  const [triageItem, setTriageItem] = useState<OpsQuarantineItem | null>(null);
  const [allocProject, setAllocProject] = useState<OpsProjectPackage | null>(null);
  const [dispatchPkg, setDispatchPkg] = useState<OpsDeliveryPackage | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState(
    opsQuarantineItems[0]?.id || 'qr-1'
  );
  const [qaThresholdFps, setQaThresholdFps] = useState('30');
  const [retentionDays, setRetentionDays] = useState('1095');

  const q = searchQuery.trim().toLowerCase();

  const filteredProjects = opsProjects.filter(
    (p) =>
      (stageFilter === 'all' || p.stage === stageFilter) &&
      (!q ||
        p.projectCode.toLowerCase().includes(q) ||
        p.nameId.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q))
  );

  const filteredQuarantine = opsQuarantineItems.filter(
    (item) =>
      !q ||
      item.fileName.toLowerCase().includes(q) ||
      item.projectCode.toLowerCase().includes(q) ||
      item.uploader.toLowerCase().includes(q)
  );

  const activeReviewItem =
    opsQuarantineItems.find((i) => i.id === selectedReviewId) ||
    opsQuarantineItems[0];

  return (
    <div className="space-y-5">
      {/* ================= 1. PROJECT & WORK PACKAGE ================= */}
      {moduleId === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">1. Project & Work Package</h1>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Monitoring batch work package lintas proyek aktif (Cooking, Manufaktur, Otomotif, Logistik).'
                  : 'Cross-project work package orchestration and team allocation.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'collection', 'review', 'qa', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStageFilter(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    stageFilter === st
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                  }`}
                >
                  {st === 'all' ? (isId ? 'Semua' : 'All') : st.toUpperCase()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCreatePackageOpen(true)}
                className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white inline-flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isId ? 'Buat Work Package' : 'New Package'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isId ? 'ID Proyek' : 'Project ID'}</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Nama Proyek & Klien' : 'Project Name & Client'}</th>
                  <th className="px-4 py-3 font-semibold">Spec</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Progress Paket' : 'Package Progress'}</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">{isId ? 'Aksi' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--egvox-border-default)] tabular-nums">
                {filteredProjects.map((prj) => (
                  <tr key={prj.id}>
                    <td className="px-4 py-3.5 font-mono font-bold text-[#027F86]">
                      {prj.projectCode}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold">{isId ? prj.nameId : prj.nameEn}</p>
                      <p className="text-[11px] text-[var(--egvox-text-muted)]">
                        {prj.clientName} · {isId ? 'Deadline' : 'Due'} {prj.deadline}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 font-mono">{prj.specVersion}</td>
                    <td className="px-4 py-3.5 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-[var(--egvox-border-default)] overflow-hidden">
                          <div
                            className="h-full bg-[#027F86]"
                            style={{ width: `${prj.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-bold">{prj.progressPercent}%</span>
                      </div>
                      <p className="text-[10px] text-[var(--egvox-text-muted)] mt-0.5">
                        {prj.completedPackages} / {prj.totalPackages} {isId ? 'paket' : 'packages'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-[#027F86]/10 px-2.5 py-1 font-bold text-[#027F86]">
                        {prj.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setAllocProject(prj)}
                        className="rounded-lg border border-[#027F86] px-3 py-1.5 font-semibold text-[#027F86] hover:bg-[#027F86] hover:text-white transition-colors"
                      >
                        {isId ? 'Alokasikan' : 'Allocate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= CAPTURE SPECIFICATION & COLLECTION ================= */}
      {moduleId === 'capture' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Capture Specification & Collection Matrix</h1>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                code: 'SPEC-COOK-v2.1',
                title: 'Egocentric Cooking & Kitchen Interaction',
                mount: isId
                  ? 'Head-mounted Action Cam · 1080p60 · EIS Aktif'
                  : 'Head-mounted Action Cam · 1080p60 · EIS Enabled',
                consent: isId
                  ? 'Wajib signed participant consent + bebas wajah orang ketiga'
                  : 'Signed participant consent + third-party face clearance required',
                coverage: isId ? '65% target lokasi terpenuhi' : '65% location target fulfilled',
              },
              {
                code: 'SPEC-MFG-v1.4',
                title: 'Industrial Assembly & Safety Protocol',
                mount: 'Chest/Head Mount · 1080p60 · Dual Audio Optional',
                consent: isId
                  ? 'Izin lokasi pabrik + sensor badge karyawan'
                  : 'Factory floor permit + employee badge redaction required',
                coverage: isId ? '44% target batch terpenuhi' : '44% batch target fulfilled',
              },
              {
                code: 'SPEC-AUTO-v1.8',
                title: 'Automotive Driving & Cockpit Interaction',
                mount: 'Headband Mount · 1080p30/60 · Landscape 16:9',
                consent: isId
                  ? 'Sensor pelat nomor & wajah di jalur publik'
                  : 'Public road license plate & pedestrian face redaction',
                coverage: isId ? '94% target jam terpenuhi' : '94% hour target fulfilled',
              },
              {
                code: 'ENT-SPEC-v1.0',
                title: 'Warehouse Picking & Barcode Scanning',
                mount: 'Wearable Glasses / Chest · 4K60 · Low-Light Verified',
                consent: 'Managed Official Project NDA & Corporate Sign-off',
                coverage: isId ? '100% target selesai' : '100% target completed',
              },
            ].map((spec) => (
              <div
                key={spec.code}
                className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#027F86]">{spec.code}</span>
                  <span className="rounded-md bg-[#16835D]/12 px-2 py-0.5 text-[10px] font-bold text-[#16835D]">
                    {isId ? 'SOP Aktif' : 'SOP Active'}
                  </span>
                </div>
                <h3 className="text-sm font-bold">{spec.title}</h3>
                <p className="text-xs text-[var(--egvox-text-secondary)]">{spec.mount}</p>
                <p className="text-xs text-[#B7791F]">{spec.consent}</p>
                <p className="text-[11px] font-semibold text-[var(--egvox-text-muted)] pt-1 border-t border-[var(--egvox-border-default)]">
                  {spec.coverage}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 2. MEDIA & UPLOAD SESSIONS ================= */}
      {moduleId === 'uploads' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">2. Media & Upload Sessions (Private Ingest)</h1>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Seluruh sesi upload langsung dikunci di penyimpanan privat non-publik sebelum masuk Validasi Teknis.'
                  : 'All upload sessions lock media into private non-public storage prior to validation.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewUploadOpen(true)}
              className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>{isId ? 'Sesi Upload Baru' : 'New Upload Session'}</span>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {opsUploadSessions.map((ses) => (
              <div
                key={ses.id}
                className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-mono font-bold text-[#027F86]">
                      {isId ? 'Sesi Upload:' : 'Upload Session:'} {ses.sessionCode}
                    </p>
                    <p className="text-sm font-bold mt-0.5">
                      {ses.projectCode} · {ses.uploaderName}
                    </p>
                  </div>
                  <span className="rounded-md bg-[#027F86]/10 px-2.5 py-1 text-[11px] font-bold text-[#027F86]">
                    {ses.status}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold tabular-nums mb-1.5">
                    <span>
                      {ses.uploadedFiles.toLocaleString()} / {ses.totalFiles.toLocaleString()}{' '}
                      {isId ? 'file' : 'files'} · {ses.uploadedSizeGb} GB / {ses.totalSizeGb} GB
                    </span>
                    <span className="text-[#027F86]">{ses.progressPercent}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[var(--egvox-border-default)] overflow-hidden">
                    <div
                      className="h-full bg-[#027F86] rounded-full"
                      style={{ width: `${ses.progressPercent}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[var(--egvox-text-muted)]">
                  {isId ? 'Mulai:' : 'Started:'} {ses.startedAt} ·{' '}
                  {isId ? 'Enkripsi AES-256 + Checksum SHA-256' : 'AES-256 Encryption + SHA-256 Checksum'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ANTRIAN QUARANTINE ================= */}
      {moduleId === 'quarantine' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">
                {isId
                  ? `Antrian Quarantine (${filteredQuarantine.length})`
                  : `Quarantine Queue (${filteredQuarantine.length})`}
              </h1>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Media hasil ingest wajib ditinjau di zona karantina sebelum dipromosikan ke pipeline produksi.'
                  : 'Ingested files remain in private quarantine until promoted by operations.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewUploadOpen(true)}
              className="rounded-xl border border-[#027F86] px-3.5 py-2 text-xs font-semibold text-[#027F86]"
            >
              {isId ? '+ Simulasi Ingest File' : '+ Simulate File Ingest'}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredQuarantine.map((item) => (
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
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold truncate">
                        {item.fileName}
                      </span>
                      <span className="rounded-md bg-[#FC840E]/15 px-2 py-0.5 text-[10px] font-bold text-[#FC840E] shrink-0">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--egvox-text-muted)] tabular-nums mt-0.5">
                      {item.resolution} · {item.duration} · {item.codec} · {item.fps} FPS
                    </p>
                    <p className="text-[11px] font-mono text-[var(--egvox-text-muted)] mt-1">
                      {item.projectCode} · {item.uploader}
                    </p>
                    {item.reasonCode && (
                      <p className="text-[11px] text-[#C43D3D] mt-1">{item.reasonCode}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setTriageItem(item)}
                      className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {isId ? 'Periksa & Triage' : 'Inspect & Triage'}
                    </button>
                    {item.status === 'quarantine' && (
                      <button
                        type="button"
                        onClick={() =>
                          updateQuarantineDecision(item.id, 'technical_validation')
                        }
                        className="rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold"
                      >
                        {isId ? 'Kirim ke Validasi Teknis' : 'Promote to Tech Check'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 3. VALIDASI TEKNIS (6-POINT CHECKLIST) ================= */}
      {moduleId === 'technical' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">
            {isId ? '3. Validasi Teknis Otomatis (6-Point Gate)' : '3. Automated Technical Validation (6-Point Gate)'}
          </h1>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredQuarantine.map((item) => {
              const checks = [
                { label: isId ? 'Format File (MP4/MOV)' : 'File Format (MP4/MOV)', ok: item.techChecks.formatOk },
                { label: isId ? 'Resolusi (≥ 1080p)' : 'Resolution (≥ 1080p)', ok: item.techChecks.resolutionOk },
                { label: 'Frame Rate (≥ 30 fps)', ok: item.techChecks.fpsOk },
                { label: isId ? 'Durasi (10 – 60 detik)' : 'Duration (10 – 60 sec)', ok: item.techChecks.durationOk },
                { label: 'Codec (H.264 / H.265)', ok: item.techChecks.codecOk },
                { label: 'Checksum (SHA-256 Verified)', ok: item.techChecks.checksumOk },
              ];
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm font-bold">{item.fileName}</p>
                      <p className="text-[11px] text-[var(--egvox-text-muted)]">
                        {item.projectCode} · {item.sizeLabel}
                      </p>
                    </div>
                    <span className="rounded-md bg-[#16835D]/12 px-2.5 py-1 text-[11px] font-bold text-[#16835D]">
                      {isId ? '6/6 Lolos' : '6/6 Passed'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {checks.map((c) => (
                      <div
                        key={c.label}
                        className="flex items-center justify-between rounded-lg bg-[var(--egvox-bg-canvas)] px-3 py-2"
                      >
                        <span>{c.label}</span>
                        <CheckCircle2 className="h-4 w-4 text-[#16835D] shrink-0" />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateQuarantineDecision(item.id, 'human_review')}
                    className="w-full rounded-xl bg-[#027F86] py-2 text-xs font-semibold text-white"
                  >
                    {isId ? 'Promosikan ke Review Konten & Consent' : 'Promote to Content & Consent Review'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 4. REVIEW KONTEN & CONSENT ================= */}
      {moduleId === 'review' && activeReviewItem && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">
            {isId ? '4. Review Konten & Consent (Human Reviewer)' : '4. Content & Consent Review (Human Reviewer)'}
          </h1>
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-2">
              {filteredQuarantine.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedReviewId(item.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    activeReviewItem.id === item.id
                      ? 'border-[#027F86] bg-[#027F86]/8'
                      : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                  }`}
                >
                  <p className="font-mono text-xs font-bold">{item.fileName}</p>
                  <p className="text-[11px] text-[var(--egvox-text-muted)]">
                    {item.projectCode} · {item.status}
                  </p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-black">
                <img
                  src={activeReviewItem.thumbnail}
                  alt={activeReviewItem.fileName}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2.5 py-1 text-xs font-mono text-white">
                  {activeReviewItem.duration} · PRIVATE REVIEW
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 text-xs">
                <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16835D] shrink-0" />
                  <span className="font-semibold">
                    {isId ? 'Konten sesuai spesifikasi' : 'Content matches capture spec'}
                  </span>
                </div>
                <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3 flex items-center gap-2">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${
                      activeReviewItem.contentChecks.piiFree ? 'text-[#16835D]' : 'text-[#FC840E]'
                    }`}
                  />
                  <span className="font-semibold">
                    {isId ? 'Bebas informasi sensitif (PII)' : 'Free of sensitive PII'}
                  </span>
                </div>
                <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16835D] shrink-0" />
                  <span className="font-semibold">
                    {isId ? 'Consent & rights valid' : 'Valid consent & rights'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => updateQuarantineDecision(activeReviewItem.id, 'accepted')}
                  className="flex-1 rounded-xl bg-[#16835D] py-2.5 text-xs font-semibold text-white"
                >
                  {isId ? 'Setujui & Masuk Pipeline Anotasi' : 'Approve & Send to Annotation'}
                </button>
                <button
                  type="button"
                  onClick={() => setTriageItem(activeReviewItem)}
                  className="flex-1 rounded-xl bg-[#FC840E] py-2.5 text-xs font-semibold text-white"
                >
                  {isId ? 'Minta Revisi (Reason Code)' : 'Request Rework (Reason Code)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. QUALITY ASSURANCE (7-LAYER GATE) ================= */}
      {moduleId === 'qa' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">6. Quality Assurance (7-Layer Multi-Gate)</h1>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">
                  {isId ? 'Checklist QA Paket EGX-0256 (Cooking v1.2)' : 'QA Checklist Package EGX-0256 (Cooking v1.2)'}
                </h2>
                <span className="text-xs font-bold text-[#16835D]">
                  {isId ? '6 / 7 Lulus' : '6 / 7 Passed'}
                </span>
              </div>
              {[
                { name: isId ? '1. QA Teknis (Format, FPS, SHA-256)' : '1. Technical QA (Format, FPS, SHA-256)', passed: true },
                { name: isId ? '2. QA Capture Spec (POV & Mounting)' : '2. Capture Spec QA (POV & Mounting)', passed: true },
                { name: isId ? '3. QA Konten / Aktivitas (Zero Idle)' : '3. Content / Activity QA (Zero Idle)', passed: true },
                { name: isId ? '4. QA Privacy & Consent (Zero PII)' : '4. Privacy & Consent QA (Zero PII)', passed: true },
                { name: isId ? '5. QA Metadata & Taxonomy' : '5. Metadata & Taxonomy QA', passed: true },
                { name: isId ? '6. QA Kualitas Anotasi (IoU & Track ID)' : '6. Annotation Quality QA (IoU & Track ID)', passed: true },
                { name: isId ? '7. Validasi Paket Dataset Final' : '7. Final Dataset Package Validation', passed: false },
              ].map((gate) => (
                <div
                  key={gate.name}
                  className="flex items-center justify-between rounded-xl bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-xs"
                >
                  <span className="font-medium">{gate.name}</span>
                  <span
                    className={`font-bold ${
                      gate.passed ? 'text-[#16835D]' : 'text-[#FC840E]'
                    }`}
                  >
                    {gate.passed ? (isId ? 'Lulus' : 'Passed') : (isId ? 'Proses' : 'In Review')}
                  </span>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  showToast(
                    isId
                      ? 'Validasi paket dataset EGX-0256 disahkan lulus 7/7 layer QA.'
                      : 'Dataset package EGX-0256 approved across all 7 QA layers.'
                  )
                }
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Sahkan Gate #7 & Siapkan Packaging' : 'Approve Gate #7 & Prepare Packaging'}
              </button>
            </div>

            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
              <h2 className="text-sm font-bold">Partial Acceptance &amp; Batch Disposition</h2>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Sesuai Master PRD, file yang lolos QA dapat diterima parsial (Partial Accept) untuk perhitungan payout dan packaging awal.'
                  : 'Passed files support partial batch acceptance for milestone payouts and early packaging.'}
              </p>
              <div className="space-y-2 text-xs tabular-nums">
                <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3 flex justify-between">
                  <span>Batch EGX-0256-B1 (420 {isId ? 'klip' : 'clips'})</span>
                  <span className="font-bold text-[#16835D]">98% Accepted (412/420)</span>
                </div>
                <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3 flex justify-between">
                  <span>Batch EGX-0257-B2 (310 {isId ? 'klip' : 'clips'})</span>
                  <span className="font-bold text-[#FC840E]">Partial Accept (294/310)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 7. PACKAGING & DELIVERY ================= */}
      {moduleId === 'packaging' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">7. Packaging &amp; Delivery (Signed Manifest)</h1>
          <div className="grid gap-4 md:grid-cols-2">
            {opsDeliveryPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs font-bold text-[#027F86]">
                      {pkg.packageCode} · {pkg.version}
                    </p>
                    <h2 className="text-base font-bold mt-0.5">{isId ? pkg.titleId : pkg.titleEn}</h2>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {pkg.totalFiles.toLocaleString()} {isId ? 'file' : 'files'} · {pkg.totalSizeGb} GB · {pkg.exportFormat}
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${
                      pkg.status === 'delivered'
                        ? 'bg-[#16835D]/12 text-[#16835D]'
                        : 'bg-[#027F86]/12 text-[#027F86]'
                    }`}
                  >
                    {pkg.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16835D]" /> Manifest &amp; Metadata
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16835D]" /> Annotation Export
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16835D]" /> Rights Manifest
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16835D]" /> QA Gate Validated
                  </div>
                </div>
                <button
                  type="button"
                  disabled={pkg.status === 'delivered'}
                  onClick={() => setDispatchPkg(pkg)}
                  className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {pkg.status === 'delivered'
                    ? isId
                      ? 'Sudah Terkirim ke Pembeli'
                      : 'Delivered to Buyer'
                    : isId
                    ? 'Kirim ke Pembeli'
                    : 'Dispatch to Buyer'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 8. MONITORING & SLA ================= */}
      {moduleId === 'sla' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">
            {isId ? '8. Monitoring & SLA Operasional' : '8. Operational Monitoring & SLA'}
          </h1>
          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 flex flex-col items-center justify-center text-center">
              <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
                <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="12" className="text-[var(--egvox-border-default)]" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#027F86" strokeWidth="12" strokeDasharray="289" strokeDashoffset={289 * 0.04} strokeLinecap="round" />
              </svg>
              <p className="-mt-20 mb-12 text-2xl font-bold tabular-nums">96%</p>
              <div className="grid grid-cols-3 gap-3 w-full text-xs tabular-nums">
                <div>
                  <p className="font-bold text-[#16835D]">92</p>
                  <p className="text-[10px] text-[var(--egvox-text-muted)]">On Time</p>
                </div>
                <div>
                  <p className="font-bold text-[#FC840E]">4</p>
                  <p className="text-[10px] text-[var(--egvox-text-muted)]">Delay</p>
                </div>
                <div>
                  <p className="font-bold text-[#C43D3D]">1</p>
                  <p className="text-[10px] text-[var(--egvox-text-muted)]">Breach</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-8 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
              <h2 className="text-sm font-bold">
                {isId ? 'SLA Performance per Proyek' : 'SLA Performance by Project'}
              </h2>
              {opsProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-[var(--egvox-bg-canvas)] px-4 py-3 text-xs tabular-nums"
                >
                  <div>
                    <span className="font-mono font-bold text-[#027F86] mr-2">
                      {p.projectCode}
                    </span>
                    <span className="font-semibold">{isId ? p.nameId : p.nameEn}</span>
                  </div>
                  <span className="font-bold text-[#16835D]">{p.slaPercent}% SLA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= AUDIT & AKTIVITAS ================= */}
      {moduleId === 'audit' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">
            {isId ? 'Audit & Aktivitas Operasional (Immutable Log)' : 'Operational Audit & Activity (Immutable Log)'}
          </h1>
          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Waktu' : 'Time'}</th>
                  <th className="px-4 py-3 font-semibold">Operator</th>
                  <th className="px-4 py-3 font-semibold">{isId ? 'Aktivitas' : 'Activity'}</th>
                  <th className="px-4 py-3 font-semibold">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--egvox-border-default)]">
                {adminAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 font-mono tabular-nums">{log.timestamp}</td>
                    <td className="px-4 py-3 font-mono font-bold">{log.actorCode} ({log.actorRole})</td>
                    <td className="px-4 py-3">{log.activity}</td>
                    <td className="px-4 py-3 font-mono text-[#027F86]">{log.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PENGATURAN OPERASIONAL ================= */}
      {moduleId === 'settings' && (
        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4 max-w-2xl">
          <h1 className="text-xl font-bold">
            {isId
              ? 'Pengaturan Operasional & Kebijakan Least-Privilege'
              : 'Operational Settings & Least-Privilege Policy'}
          </h1>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">Minimum Frame Rate Gate (FPS)</label>
              <input
                type="number"
                value={qaThresholdFps}
                onChange={(e) => setQaThresholdFps(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 tabular-nums font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                {isId ? 'Retensi Media Karantina (Hari)' : 'Quarantine Media Retention (Days)'}
              </label>
              <input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 tabular-nums font-bold"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                showToast(
                  isId
                    ? 'Konfigurasi operasional Data Ops disimpan.'
                    : 'Data Ops configuration saved.'
                )
              }
              className="rounded-xl bg-[#027F86] px-4 py-2.5 font-semibold text-white"
            >
              {isId ? 'Simpan Kebijakan Operasional' : 'Save Operational Policy'}
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <CreateWorkPackageModal open={createPackageOpen} onClose={() => setCreatePackageOpen(false)} />
      <NewUploadSessionModal open={newUploadOpen} onClose={() => setNewUploadOpen(false)} />
      <QuarantineTriageModal item={triageItem} onClose={() => setTriageItem(null)} />
      <WorkPackageAllocationModal project={allocProject} onClose={() => setAllocProject(null)} />
      <DeliveryDispatchModal pkg={dispatchPkg} onClose={() => setDispatchPkg(null)} />
    </div>
  );
};
