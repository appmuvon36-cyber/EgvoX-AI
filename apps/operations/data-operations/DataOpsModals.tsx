'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  FolderPlus,
  HelpCircle,
  Lock,
  PackageCheck,
  ShieldCheck,
  UploadCloud,
  Users,
  X,
} from 'lucide-react';
import {
  OpsDeliveryPackage,
  OpsProjectPackage,
  OpsQuarantineItem,
} from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';

const QA_REASON_CODES = [
  {
    code: 'QA-BLUR-01',
    labelId: 'QA-BLUR-01 · Fokus kabur / resolusi di bawah batas',
    labelEn: 'QA-BLUR-01 · Out-of-focus / below minimum resolution',
  },
  {
    code: 'QA-MOTION-02',
    labelId: 'QA-MOTION-02 · Motion blur / guncangan berlebih',
    labelEn: 'QA-MOTION-02 · Excessive motion blur / camera shake',
  },
  {
    code: 'PII-FACE-01',
    labelId: 'PII-FACE-01 · Wajah / identitas tanpa sensor atau consent',
    labelEn: 'PII-FACE-01 · Unblurred face / missing identity redaction',
  },
  {
    code: 'CONSENT-MISSING',
    labelId: 'CONSENT-MISSING · Bukti persetujuan peserta tidak lengkap',
    labelEn: 'CONSENT-MISSING · Incomplete participant consent record',
  },
  {
    code: 'SPEC-ANGLE-03',
    labelId: 'SPEC-ANGLE-03 · Sudut kamera bukan egocentric first-person',
    labelEn: 'SPEC-ANGLE-03 · Camera angle is not egocentric first-person',
  },
];

export const NewUploadSessionModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { locale, opsProjects, createOpsUploadSession } = useAppState();
  const isId = locale === 'id';
  const [projectCode, setProjectCode] = useState(
    opsProjects[0]?.projectCode || 'EGX-0256'
  );
  const [fileName, setFileName] = useState('COOK_BATCH_094.mp4');
  const [sizeLabel, setSizeLabel] = useState('240 MB');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold">
              {isId ? 'Buat Sesi Upload Privat Baru' : 'Start New Private Upload Session'}
            </h3>
            <p className="text-xs text-[var(--egvox-text-muted)] mt-0.5">
              {isId
                ? 'Setiap upload otomatis masuk Zona Karantina dengan checksum SHA-256.'
                : 'Uploads automatically enter Private Quarantine with SHA-256 verification.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!fileName.trim()) return;
            createOpsUploadSession(projectCode, fileName.trim(), sizeLabel);
            onClose();
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-xs font-semibold mb-1">Project Code</label>
            <select
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-mono"
            >
              {opsProjects.map((p) => (
                <option key={p.id} value={p.projectCode}>
                  {p.projectCode} — {isId ? p.nameId : p.nameEn}
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#027F86]/50 bg-[var(--egvox-bg-canvas)] p-4 text-center text-xs">
            <UploadCloud className="h-5 w-5 text-[#027F86]" />
            <span className="font-semibold">
              {isId ? 'Pilih atau seret file video MP4 / MOV (Maks. 20 GB)' : 'Select MP4 / MOV video file (Max 20 GB)'}
            </span>
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileName(file.name);
                  setSizeLabel(`${Math.max(85, Math.round(file.size / 1048576))} MB`);
                }
              }}
            />
          </label>

          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-mono"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white hover:bg-[#039998]"
          >
            {isId ? 'Mulai Ingest ke Karantina' : 'Start Quarantine Ingest'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const QuarantineTriageModal: React.FC<{
  item: OpsQuarantineItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const { locale, updateQuarantineDecision } = useAppState();
  const isId = locale === 'id';
  const [reasonCode, setReasonCode] = useState(QA_REASON_CODES[0].code);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-mono text-[#027F86]">
              {item.sessionCode} · {item.projectCode}
            </p>
            <h3 className="text-base font-bold font-mono">{item.fileName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-black">
          <img
            src={item.thumbnail}
            alt={item.fileName}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <span className="absolute top-2.5 left-2.5 rounded bg-black/75 px-2 py-0.5 text-[10px] font-mono font-bold text-white">
            PRIVATE QUARANTINE WATERMARK · {item.resolution} · {item.fps} FPS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl bg-[var(--egvox-bg-canvas)] p-3 text-xs tabular-nums">
          <div>
            <p className="text-[10px] text-[var(--egvox-text-muted)]">Codec</p>
            <p className="font-bold">{item.codec}</p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--egvox-text-muted)]">
              {isId ? 'Durasi / Ukuran' : 'Duration / Size'}
            </p>
            <p className="font-bold">{item.duration} · {item.sizeLabel}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] text-[var(--egvox-text-muted)]">Uploader</p>
            <p className="font-bold truncate">{item.uploader}</p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--egvox-border-default)] p-3 text-xs space-y-1.5">
          <p className="font-bold flex items-center gap-1.5 text-[#16835D]">
            <Lock className="h-3.5 w-3.5" />
            <span>SHA-256: {item.sha256.slice(0, 28)}…</span>
          </p>
          <p className="text-[11px] text-[var(--egvox-text-secondary)]">
            {isId
              ? 'File terisolasi dari katalog publik. Pilih keputusan QA atau lanjutkan ke Validasi Teknis.'
              : 'Isolated from public inventory. Choose triage decision or promote to Technical Validation.'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">
            {isId ? 'Reason Code (Jika Revisi / Tolak)' : 'Mandatory QA Reason Code (If Rework / Reject)'}
          </label>
          <select
            value={reasonCode}
            onChange={(e) => setReasonCode(e.target.value)}
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
          >
            {QA_REASON_CODES.map((rc) => (
              <option key={rc.code} value={rc.code}>
                {isId ? rc.labelId : rc.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              updateQuarantineDecision(item.id, 'accepted');
              onClose();
            }}
            className="rounded-xl bg-[#16835D] py-2.5 text-xs font-semibold text-white"
          >
            {isId ? 'Setujui (Accept)' : 'Approve (Accept)'}
          </button>
          <button
            type="button"
            onClick={() => {
              updateQuarantineDecision(item.id, 'rework_required', reasonCode);
              onClose();
            }}
            className="rounded-xl bg-[#FC840E] py-2.5 text-xs font-semibold text-white"
          >
            {isId ? 'Minta Revisi' : 'Request Rework'}
          </button>
          <button
            type="button"
            onClick={() => {
              updateQuarantineDecision(item.id, 'rejected', reasonCode);
              onClose();
            }}
            className="rounded-xl border border-[#C43D3D] py-2.5 text-xs font-semibold text-[#C43D3D]"
          >
            {isId ? 'Tolak File' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const WorkPackageAllocationModal: React.FC<{
  project: OpsProjectPackage | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const { locale, showToast } = useAppState();
  const isId = locale === 'id';
  const [annotator, setAnnotator] = useState('Salsa Fitriani');
  const [qaLead, setQaLead] = useState('Nadia QA');
  const [batchTarget, setBatchTarget] = useState('12');

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono text-[#027F86]">{project.projectCode}</p>
            <h3 className="text-base font-bold">
              {isId ? 'Alokasi Work Package & Tim Ops' : 'Allocate Work Package & Ops Team'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast(
              isId
                ? `${batchTarget} paket ${project.projectCode} dialokasikan ke ${annotator} & QA ${qaLead}.`
                : `${batchTarget} packages on ${project.projectCode} allocated to ${annotator}.`
            );
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-semibold mb-1">Annotator Lead</label>
            <select
              value={annotator}
              onChange={(e) => setAnnotator(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
            >
              <option value="Salsa Fitriani">Salsa Fitriani (Schema v1.2 Expert)</option>
              <option value="Raka Pratama">Raka Pratama (Automotive &amp; Tracking)</option>
              <option value="Tim Anotasi Internal #2">
                {isId ? 'Tim Anotasi Internal #2' : 'Internal Annotation Team #2'}
              </option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">QA Specialist / QA Lead</label>
            <select
              value={qaLead}
              onChange={(e) => setQaLead(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
            >
              <option value="Nadia QA">Nadia QA (Lead Reviewer)</option>
              <option value="Budi Reviewer">Budi Reviewer (Technical & PII)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Jumlah Paket Batch' : 'Batch Package Count'}
            </label>
            <input
              type="number"
              value={batchTarget}
              onChange={(e) => setBatchTarget(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 tabular-nums font-bold"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-[#027F86] py-2.5 font-semibold text-white inline-flex items-center justify-center gap-1.5"
          >
            <Users className="h-4 w-4" />
            <span>{isId ? 'Konfirmasi Alokasi Paket' : 'Confirm Package Allocation'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export const DeliveryDispatchModal: React.FC<{
  pkg: OpsDeliveryPackage | null;
  onClose: () => void;
}> = ({ pkg, onClose }) => {
  const { locale, dispatchDeliveryPackage } = useAppState();
  const isId = locale === 'id';
  const [signedVerified, setSignedVerified] = useState(true);

  if (!pkg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono text-[#027F86]">
              {pkg.packageCode} · {pkg.version}
            </p>
            <h3 className="text-base font-bold">
              {isId ? 'Finalisasi & Kirim Paket ke Pembeli' : 'Finalize & Dispatch Delivery Package'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2 tabular-nums">
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">{isId ? 'Pembeli' : 'Buyer'}</span>
            <span className="font-bold">{pkg.buyerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">
              {isId ? 'Volume Dataset' : 'Dataset Volume'}
            </span>
            <span className="font-bold">
              {pkg.totalFiles.toLocaleString()} {isId ? 'file' : 'files'} · {pkg.totalSizeGb} GB
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">
              {isId ? 'Format Export' : 'Export Format'}
            </span>
            <span className="font-bold">{pkg.exportFormat}</span>
          </div>
          <div className="flex justify-between text-[#16835D] font-semibold">
            <span>Manifest & Rights Manifest</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Signed
            </span>
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-[var(--egvox-text-secondary)]">
          <input
            type="checkbox"
            checked={signedVerified}
            onChange={(e) => setSignedVerified(e.target.checked)}
            className="mt-0.5 h-4 w-4 text-[#027F86]"
          />
          <span>
            {isId
              ? 'Konfirmasi seluruh 7 lapis QA gate lulus dan Rights Manifest terlampir dalam arsip terenkripsi.'
              : 'Confirm all 7 QA gates passed and Rights Manifest is bundled in encrypted archive.'}
          </span>
        </label>

        <button
          type="button"
          disabled={!signedVerified}
          onClick={() => {
            dispatchDeliveryPackage(pkg.id);
            onClose();
          }}
          className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
        >
          <PackageCheck className="h-4 w-4" />
          <span>{isId ? 'Kirim ke Pembeli Sekarang' : 'Dispatch to Buyer Now'}</span>
        </button>
      </div>
    </div>
  );
};

export const CreateWorkPackageModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { locale, createOpsWorkPackage } = useAppState();
  const isId = locale === 'id';
  const [nameId, setNameId] = useState('');
  const [clientName, setClientName] = useState('PT Data Visual Indonesia');
  const [specVersion, setSpecVersion] = useState('SPEC-COOK-v2.1');
  const [totalPackages, setTotalPackages] = useState('20');
  const [deadline, setDeadline] = useState(isId ? '30 Des 2026' : '30 Dec 2026');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4 text-[#027F86]" />
            <h3 className="text-base font-bold">
              {isId ? 'Buat Work Package Produksi Baru' : 'Create Production Work Package'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!nameId.trim()) return;
            createOpsWorkPackage({
              nameId: nameId.trim(),
              clientName: clientName.trim() || 'PT Data Visual Indonesia',
              totalPackages: Math.max(5, Number(totalPackages) || 20),
              specVersion,
              deadline,
            });
            setNameId('');
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Nama Batch / Proyek Dataset' : 'Dataset Batch / Project Name'}
            </label>
            <input
              type="text"
              required
              value={nameId}
              onChange={(e) => setNameId(e.target.value)}
              placeholder={isId ? 'Mis. Gudang E-Commerce Picking Batch #4' : 'e.g. Warehouse Picking Batch #4'}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Klien / Vendor' : 'Client / Vendor'}
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold mb-1">Spec Version</label>
              <select
                value={specVersion}
                onChange={(e) => setSpecVersion(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 font-mono"
              >
                <option value="SPEC-COOK-v2.1">SPEC-COOK-v2.1</option>
                <option value="SPEC-MFG-v1.4">SPEC-MFG-v1.4</option>
                <option value="SPEC-AUTO-v1.8">SPEC-AUTO-v1.8</option>
                <option value="ENT-SPEC-v1.0">ENT-SPEC-v1.0</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">
                {isId ? 'Target Paket' : 'Target Packages'}
              </label>
              <input
                type="number"
                value={totalPackages}
                onChange={(e) => setTotalPackages(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 tabular-nums font-bold"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Deadline Batch' : 'Batch Deadline'}
            </label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-[#027F86] py-2.5 font-semibold text-white"
          >
            {isId ? 'Buat & Publikasikan ke Antrian Ops' : 'Create Work Package'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const OpsHelpSopModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { locale } = useAppState();
  const isId = locale === 'id';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#027F86]" />
            <h3 className="text-base font-bold">
              {isId ? 'Panduan SOP & Pipeline Data Operations (v1.2)' : 'Data Operations SOP & Pipeline Guide'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5 text-xs space-y-1.5">
          <p className="font-bold text-[#027F86]">
            {isId
              ? 'Workflow 9 Tahap Produksi Dataset (End-to-End)'
              : '9-Stage End-to-End Dataset Production Workflow'}
          </p>
          <p className="text-[var(--egvox-text-secondary)] leading-relaxed">
            {isId
              ? 'Work Order (Authorized) → Upload (Scoped) → Quarantine (Tinjau Awal) → Validasi Teknis (SHA-256) → Review Konten & Consent → Annotation (Opsional / Schema v1.2) → QA 7-Layer → Packaging & Rights Manifest → Delivery ke Pembeli.'
              : 'Work Order (Authorized) → Upload (Scoped) → Quarantine (Initial Triage) → Technical Validation (SHA-256) → Content & Consent Review → Annotation (Optional / Schema v1.2) → 7-Layer QA → Packaging & Rights Manifest → Buyer Delivery.'}
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <p className="font-bold">Mandatory QA Reason Codes:</p>
          <div className="grid gap-1.5">
            {QA_REASON_CODES.map((rc) => (
              <div
                key={rc.code}
                className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 font-mono text-[11px]"
              >
                {isId ? rc.labelId : rc.labelEn}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#16835D]/30 bg-[#16835D]/10 p-3 text-xs flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-[#16835D] shrink-0 mt-0.5" />
          <span>
            {isId
              ? 'Least-Privilege RBAC aktif: Operator hanya dapat melihat proyek yang dialokasikan dan seluruh akses media raw tercatat dalam Audit Trail penuh.'
              : 'Least-Privilege RBAC enforced: Operators only view allocated projects and all raw media access is recorded in the full Audit Trail.'}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
        >
          {isId ? 'Tutup Panduan SOP' : 'Close SOP Guide'}
        </button>
      </div>
    </div>
  );
};
