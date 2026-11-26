'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  Camera,
  CheckCircle2,
  FileUp,
  Lock,
  ShieldCheck,
  Star,
  Tag,
  UploadCloud,
  UserPlus,
  X,
} from 'lucide-react';
import { egvoxFormatIDR, egvoxFormatUSD } from '@/packages/design-system';
import {
  ActiveWorkOrder,
  ActivityCategorySlug,
  CaptureSpecification,
  DataModality,
  FreelancerServiceListing,
  OpsDeliveryPackage,
  ProjectListing,
  RecruitmentOffer,
  SubmissionFileItem,
} from '@/packages/shared-types';
import { ACTIVITY_CATEGORIES } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';

export const CustomerModeSelectorModal: React.FC<{
  open: boolean;
  mode: 'contributor' | 'annotator' | 'qa_specialist';
  onSelect: (m: 'contributor' | 'annotator' | 'qa_specialist') => void;
  onClose: () => void;
}> = ({ open, mode, onSelect, onClose }) => {
  const { locale } = useAppState();
  const isId = locale === 'id';
  const [draft, setDraft] = useState<'contributor' | 'annotator' | 'qa_specialist'>(mode);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold">
              {isId ? 'Pilih Mode Talenta Freelancer' : 'Choose Freelancer Talent Mode'}
            </h3>
            <p className="text-xs text-[var(--egvox-text-muted)] mt-0.5">
              {isId
                ? 'Tentukan fokus spesialisasi Anda di Customer Workspace.'
                : 'Select your primary specialization focus inside Customer Workspace.'}
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

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setDraft('contributor')}
            className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
              draft === 'contributor'
                ? 'border-[#027F86] bg-[#027F86]/8'
                : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-canvas)]'
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#027F86] text-white">
              <Camera className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">Video Contributor</p>
              <p className="text-xs text-[var(--egvox-text-secondary)] mt-0.5">
                {isId
                  ? 'Pengambilan video egocentric (aktivitas, proses, lingkungan).'
                  : 'First-person egocentric video capture (activities, workflows, environments).'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDraft('annotator')}
            className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
              draft === 'annotator'
                ? 'border-[#FC840E] bg-[#FC840E]/8'
                : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-canvas)]'
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FC840E] text-white">
              <Tag className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">Data Annotator</p>
              <p className="text-xs text-[var(--egvox-text-secondary)] mt-0.5">
                {isId
                  ? 'Anotasi dan pelabelan data video sesuai skema proyek.'
                  : 'Video annotation and human labeling strictly per project schema.'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDraft('qa_specialist')}
            className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
              draft === 'qa_specialist'
                ? 'border-[#16835D] bg-[#16835D]/8'
                : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-canvas)]'
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16835D] text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">QA Specialist</p>
              <p className="text-xs text-[var(--egvox-text-secondary)] mt-0.5">
                {isId
                  ? 'Pemeriksaan kualitas video, anotasi, consent, & audit dataset independen.'
                  : 'Independent quality assurance for video capture, annotations, and dataset compliance.'}
              </p>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onSelect(draft);
            onClose();
          }}
          className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white hover:bg-[#039998]"
        >
          {isId ? 'Lanjutkan Mode Terpilih' : 'Continue with Selected Mode'}
        </button>
      </div>
    </div>
  );
};

export const PrivateUploadThreeStepModal: React.FC<{
  open: boolean;
  projectCode: string;
  onClose: () => void;
}> = ({ open, projectCode, onClose }) => {
  const { locale, workOrders, createOpsUploadSession } = useAppState();
  const isId = locale === 'id';
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [targetCode, setTargetCode] = useState(projectCode);
  const [selectedFile, setSelectedFile] = useState('cook_001.mp4');
  const [selectedSize, setSelectedSize] = useState('1.2 GB');
  const [consentChecked, setConsentChecked] = useState(true);

  if (!open) return null;

  const checksumPreview = `sha256_9d8f${selectedFile.length.toString(16)}a41b7c2e0f`;

  const handleConfirmUpload = () => {
    createOpsUploadSession(targetCode || projectCode, selectedFile, selectedSize);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold">
              {isId ? 'Upload Tugas (Private Raw Video)' : 'Upload Task (Private Raw Video)'}
            </h3>
            <p className="text-xs font-mono text-[#027F86] mt-0.5">{targetCode || projectCode}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Stepper */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          {[
            { num: 1, label: 'Upload' },
            { num: 2, label: isId ? 'Validasi' : 'Validate' },
            { num: 3, label: 'Review' },
          ].map((s) => (
            <div key={s.num}>
              <div
                className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full font-bold ${
                  step >= s.num
                    ? 'bg-[#027F86] text-white'
                    : 'bg-[var(--egvox-bg-subtle)] text-[var(--egvox-text-muted)]'
                }`}
              >
                {s.num}
              </div>
              <p className="mt-1 font-medium text-[var(--egvox-text-secondary)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold mb-1">
                {isId ? 'Target Work Order' : 'Target Work Order'}
              </label>
              <select
                value={targetCode}
                onChange={(e) => setTargetCode(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-mono"
              >
                {workOrders.map((wo) => (
                  <option key={wo.id} value={wo.code}>
                    {wo.code} — {isId ? wo.title : wo.titleEn || wo.title}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#027F86]/50 bg-[var(--egvox-bg-canvas)] p-5 text-center text-xs">
              <UploadCloud className="h-6 w-6 text-[#027F86]" />
              <span className="font-semibold">
                {isId ? 'Unggah File Video MP4 / MOV' : 'Upload MP4 / MOV Video File'}
              </span>
              <span className="text-[var(--egvox-text-muted)]">
                {isId ? 'Maks. 5 GB · Sesi Privat Terenkripsi' : 'Max 5 GB · Encrypted Private Session'}
              </span>
              <span className="mt-1 rounded-lg bg-[#027F86] px-3 py-1.5 text-[11px] font-semibold text-white">
                {isId ? 'Pilih File' : 'Choose File'}
              </span>
              <input
                type="file"
                accept="video/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file.name);
                    setSelectedSize(`${Math.max(120, Math.round(file.size / 1048576))} MB`);
                  }
                }}
              />
            </label>
            <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold">{selectedFile}</span>
                <span className="text-[var(--egvox-text-muted)] tabular-nums">{selectedSize}</span>
              </div>
              <p className="text-[11px] font-mono text-[#16835D]">
                Checksum: OK (SHA-256 · {checksumPreview})
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
            >
              {isId ? 'Lanjut ke Validasi Teknis' : 'Continue to Technical Validation'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 text-xs">
            <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 space-y-2">
              <p className="flex items-center justify-between">
                <span>{isId ? 'Validasi File (MP4 · 1080p60)' : 'File Format (MP4 · 1080p60)'}</span>
                <span className="text-[#16835D] font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                  {isId ? 'Format & ukuran OK' : 'Format & size OK'}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>Checksum SHA-256</span>
                <span className="text-[#16835D] font-bold inline-flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" /> OK (SHA-256)
                </span>
              </p>
              <p className="font-mono text-[10px] text-[var(--egvox-text-muted)] break-all">
                {checksumPreview}
              </p>
            </div>
            <label className="flex items-start gap-2 text-xs text-[var(--egvox-text-secondary)]">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#027F86]"
              />
              <span>
                {isId
                  ? 'Saya memastikan peserta & lokasi memiliki persetujuan sah serta bebas PII.'
                  : 'I confirm valid participant & location consent and zero unredacted PII.'}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-[var(--egvox-border-default)] py-2.5 font-semibold"
              >
                {isId ? 'Kembali' : 'Back'}
              </button>
              <button
                type="button"
                disabled={!consentChecked}
                onClick={() => setStep(3)}
                className="rounded-xl bg-[#027F86] py-2.5 font-semibold text-white disabled:opacity-50"
              >
                {isId ? 'Lanjut ke Review' : 'Continue to Review'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-[#16835D]/30 bg-[#16835D]/10 p-4 space-y-1.5">
              <p className="font-bold text-[#16835D]">
                {isId ? 'Siap Masuk Zona Karantina Data Ops' : 'Ready for Data Ops Quarantine Queue'}
              </p>
              <p className="text-[var(--egvox-text-secondary)]">
                {isId
                  ? `File ${selectedFile} akan dikunci di Private Storage (tidak pernah muncul di katalog publik) dan diperiksa oleh tim QA EgvoX.`
                  : `${selectedFile} will be locked in Private Storage (never publicly exposed) and queued for EgvoX QA inspection.`}
              </p>
            </div>
            <button
              type="button"
              onClick={handleConfirmUpload}
              className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
            >
              {isId ? 'Kirim ke Antrian Quarantine Ops' : 'Submit to Ops Quarantine Queue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const TeamInviteModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { locale, showToast } = useAppState();
  const isId = locale === 'id';
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Vendor Project Manager');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[#027F86]" />
            <h3 className="text-base font-bold">
              {isId ? 'Undang Anggota Tim Organisasi' : 'Invite Organization Member'}
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
            if (!email.trim()) return;
            showToast(
              isId
                ? `Undangan peran ${role} dikirim ke ${email}.`
                : `Invitation for ${role} sent to ${email}.`
            );
            setEmail('');
            onClose();
          }}
          className="space-y-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
          >
            <option value="Vendor Admin">Vendor Admin</option>
            <option value="Vendor Project Manager">Vendor Project Manager</option>
            <option value="Enterprise Member">Enterprise Member (Read-Only Deliveries)</option>
          </select>
          <button
            type="submit"
            className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
          >
            {isId ? 'Kirim Undangan Tim' : 'Send Team Invitation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export interface CustomerModalsBundleProps {
  contractOrder: ActiveWorkOrder | null;
  setContractOrder: (o: ActiveWorkOrder | null) => void;
  reworkTarget: SubmissionFileItem | null;
  setReworkTarget: (s: SubmissionFileItem | null) => void;
  counterTarget: RecruitmentOffer | null;
  setCounterTarget: (o: RecruitmentOffer | null) => void;
  payoutOpen: boolean;
  setPayoutOpen: (b: boolean) => void;
  payoutDest: string;
  reviewOpen: boolean;
  setReviewOpen: (b: boolean) => void;
  selectedOrderCode: string;
  persona: 'freelancer' | 'vendor' | 'enterprise';
  createProjectOpen: boolean;
  setCreateProjectOpen: (b: boolean) => void;
  createServiceOpen: boolean;
  setCreateServiceOpen: (b: boolean) => void;
  rfpOpen: boolean;
  setRfpOpen: (b: boolean) => void;
  kycOpen: boolean;
  setKycOpen: (b: boolean) => void;
  orgModalOpen: boolean;
  setOrgModalOpen: (b: boolean) => void;
  activeOrg: string;
  setActiveOrg: (org: string) => void;
}

export const CustomerModalsBundle: React.FC<CustomerModalsBundleProps> = ({
  contractOrder,
  setContractOrder,
  reworkTarget,
  setReworkTarget,
  counterTarget,
  setCounterTarget,
  payoutOpen,
  setPayoutOpen,
  payoutDest,
  reviewOpen,
  setReviewOpen,
  selectedOrderCode,
  persona,
  createProjectOpen,
  setCreateProjectOpen,
  createServiceOpen,
  setCreateServiceOpen,
  rfpOpen,
  setRfpOpen,
  kycOpen,
  setKycOpen,
  orgModalOpen,
  setOrgModalOpen,
  activeOrg,
  setActiveOrg,
}) => {
  const {
    locale,
    submitReworkOrDispute,
    respondRecruitmentOffer,
    availableBalance,
    requestPayout,
    submitOrderReview,
    createVendorProject,
    createFreelancerService,
    submitEnterpriseInquiry,
    submitKyc,
    showToast,
  } = useAppState();
  const isId = locale === 'id';

  const [reworkMode, setReworkMode] = useState<'rework' | 'appeal'>('rework');
  const [reworkNote, setReworkNote] = useState('');
  const [counterGrossFee, setCounterGrossFee] = useState('11000000');
  const [counterScopeDelta, setCounterScopeDelta] = useState(
    isId
      ? '50 video · detail sama + revisi SLA'
      : '50 videos · same scope + SLA revision'
  );
  const [counterNote, setCounterNote] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('1000000');
  const [payoutDestDraft, setPayoutDestDraft] = useState(payoutDest);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [newPrjTitle, setNewPrjTitle] = useState('');
  const [newPrjCat, setNewPrjCat] = useState<ActivityCategorySlug>('cooking');
  const [newPrjType, setNewPrjType] = useState<DataModality>('Video');
  const [newPrjHours, setNewPrjHours] = useState('50');
  const [newPrjRate, setNewPrjRate] = useState('175000');
  const [newPrjShowBudget, setNewPrjShowBudget] = useState(true);
  const [newPrjLocation, setNewPrjLocation] = useState('Indonesia (Jabodetabek, Bandung)');
  const [newPrjAppClose, setNewPrjAppClose] = useState('20 Des 2026');
  const [newPrjDeadline, setNewPrjDeadline] = useState('30 Des 2026');
  const [newPrjSummary, setNewPrjSummary] = useState('');
  const [newPrjPerspective, setNewPrjPerspective] =
    useState<CaptureSpecification['perspective']>('Egocentric (First-Person)');
  const [newPrjMounting, setNewPrjMounting] =
    useState<CaptureSpecification['mounting']>('Head-mounted');
  const [newPrjDeviceReq, setNewPrjDeviceReq] = useState(
    'Action Cam (GoPro/DJI) atau Wearable Camera 1080p60'
  );
  const [newPrjResolution, setNewPrjResolution] = useState('Minimum 1080p (1920x1080)');
  const [newPrjFps, setNewPrjFps] = useState('30–60 FPS');
  const [newPrjCodec, setNewPrjCodec] = useState('MP4 (H.264 / H.265)');
  const [newPrjOrientation, setNewPrjOrientation] =
    useState<CaptureSpecification['orientation']>('Landscape 16:9');
  const [newPrjClipDuration, setNewPrjClipDuration] = useState('15–45 menit per sesi');
  const [newPrjAudioPolicy, setNewPrjAudioPolicy] =
    useState<CaptureSpecification['audioPolicy']>('Optional');
  const [newPrjConsentPolicy, setNewPrjConsentPolicy] = useState(
    'Wajib persetujuan kontributor & bebas PII pihak ketiga'
  );
  const [newPrjAnnotation, setNewPrjAnnotation] =
    useState<ProjectListing['annotationRequired']>('none');
  const [newPrjAcceptanceText, setNewPrjAcceptanceText] = useState(
    'Kedua tangan dan objek utama terlihat jelas >= 85% durasi.\nUnggah melalui Private Upload Session EgvoX dengan checksum SHA-256.'
  );
  const [newPrjRightsSummary, setNewPrjRightsSummary] = useState(
    'Lisensi komersial riset terbatas sesuai Work Order EgvoX.'
  );

  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvRole, setNewSrvRole] =
    useState<FreelancerServiceListing['roleType']>('Video Contributor');
  const [newSrvCategories, setNewSrvCategories] = useState<ActivityCategorySlug[]>([
    'cooking',
    'household',
  ]);
  const [newSrvCapacity, setNewSrvCapacity] = useState(
    isId ? '± 20 jam / minggu' : '± 20 hours / week'
  );
  const [newSrvSla, setNewSrvSla] = useState(
    isId ? 'Sesuai Spesifikasi · 3–5 hari' : 'Per Spec · 3–5 business days'
  );
  const [newSrvPerspective, setNewSrvPerspective] = useState('Egocentric (First-Person)');
  const [newSrvEquipment, setNewSrvEquipment] = useState('Action Cam 4K (GoPro Hero 12) + Chest/Head Mount');
  const [newSrvResolutionFps, setNewSrvResolutionFps] = useState(
    '1080p – 4K · 30–60 FPS · MP4 H.264/H.265'
  );
  const [newSrvAnnotatorTools, setNewSrvAnnotatorTools] = useState<string[]>([
    'EgvoX Annotation Platform (v1)',
    'CVAT',
  ]);
  const [newSrvAnnotatorWorkstation, setNewSrvAnnotatorWorkstation] = useState(
    'Dual-Monitor Calibrated Workstation (32GB RAM)'
  );
  const [newSrvAnnotatorSchemas, setNewSrvAnnotatorSchemas] = useState<string[]>([
    'Bounding Box (2D/3D)',
    'Temporal Action Segmentation',
    'Hand-Object Interaction',
  ]);
  const [newSrvAnnotatorOutputFormat, setNewSrvAnnotatorOutputFormat] = useState(
    'Skema JSON, JSONL, COCO, CSV (Frame-Accurate)'
  );
  const [newSrvQaScopes, setNewSrvQaScopes] = useState<string[]>([
    'Technical Validation (FFmpeg/MediaInfo)',
    'Capture-Spec Compliance',
    'Privacy / PII & Blur Screening',
    'Consent & Rights Evidence Audit',
  ]);
  const [newSrvQaTools, setNewSrvQaTools] = useState<string[]>([
    'Standar QA EgvoX v1.3',
    'FFmpeg / MediaInfo Technical Inspector',
    'JSONL / COCO Schema Validator',
  ]);
  const [newSrvQaStandard, setNewSrvQaStandard] = useState(
    'Audit Teknis, Capture-Spec, Consent & Schema QA'
  );
  const [newSrvConflictDeclared, setNewSrvConflictDeclared] = useState(true);
  const [newSrvConflictText, setNewSrvConflictText] = useState(
    isId
      ? 'Independen penuh: Tidak pernah mengaudit rekaman atau anotasi milik sendiri maupun tim produksi afiliasi.'
      : 'Independent auditor: Never reviews own recordings, annotations, or affiliated capture teams.'
  );
  const [newSrvLocation, setNewSrvLocation] = useState('Jakarta & Jabodetabek');
  const [newSrvDesc, setNewSrvDesc] = useState('');
  const [newSrvExclusions, setNewSrvExclusions] = useState(
    isId
      ? 'Tidak mencakup perekaman di area terlarang tanpa izin lokasi tertulis.'
      : 'Excludes restricted facilities without written site permission.'
  );
  const [newSrvPortfolioTitle, setNewSrvPortfolioTitle] = useState(
    isId ? 'Sampel Video Aktivitas Dapur (POV Berizin)' : 'Consented Kitchen POV Sample'
  );
  const [newSrvPortfolioThumb, setNewSrvPortfolioThumb] = useState(
    '/images/capture_cooking_pov_1795676769816.jpg'
  );
  const [newSrvPortfolioConsent, setNewSrvPortfolioConsent] = useState(true);

  const handleSrvRoleChange = (nextRole: FreelancerServiceListing['roleType']) => {
    setNewSrvRole(nextRole);
    if (nextRole === 'Video Contributor') {
      setNewSrvCapacity(isId ? '± 20 jam / minggu' : '± 20 hours / week');
      setNewSrvSla(isId ? 'Sesuai Spesifikasi · 3–5 hari' : 'Per Spec · 3–5 business days');
      setNewSrvResolutionFps('1080p – 4K · 30–60 FPS · MP4 H.264/H.265');
      setNewSrvCategories(['cooking', 'household']);
      setNewSrvExclusions(
        isId
          ? 'Tidak mencakup perekaman di area terlarang tanpa izin lokasi tertulis.'
          : 'Excludes restricted facilities without written site permission.'
      );
      setNewSrvPortfolioTitle(
        isId ? 'Sampel Video Aktivitas Dapur (POV Berizin)' : 'Consented Kitchen POV Sample'
      );
      setNewSrvPortfolioThumb('/images/capture_cooking_pov_1795676769816.jpg');
    } else if (nextRole === 'Data Annotator') {
      setNewSrvCapacity(isId ? '± 40 jam video / minggu' : '± 40 video hours / week');
      setNewSrvSla(isId ? 'Akurasi tinggi · 2–4 hari' : 'High accuracy · 2–4 days');
      setNewSrvCategories(['cooking', 'manufacturing', 'warehouse']);
      setNewSrvExclusions(
        isId
          ? 'Hanya memproses media yang telah lolos tahap QA & Rights Gate di EgvoX.'
          : 'Processes only media cleared by EgvoX QA & Rights Gate.'
      );
      setNewSrvPortfolioTitle(
        isId
          ? 'Sampel Anotasi Bounding Box & Temporal Action (Anonim)'
          : 'Anonymized Bounding Box & Temporal Action Sample'
      );
      setNewSrvPortfolioThumb('/images/capture_manufacturing_pov_1795676770652.jpg');
    } else {
      setNewSrvCapacity(isId ? '25–35 batch / minggu' : '25–35 batches / week');
      setNewSrvSla(isId ? 'SLA Terjadwal (24–48 jam)' : 'Scheduled SLA (24–48h)');
      setNewSrvCategories(['manufacturing', 'warehouse', 'automotive']);
      setNewSrvExclusions(
        isId
          ? 'Wajib bebas konflik kepentingan — tidak menerima audit atas output produksi sendiri.'
          : 'Strict conflict-of-interest rule — never audits own capture or annotation deliverables.'
      );
      setNewSrvPortfolioTitle(
        isId
          ? 'Sampel Laporan Audit QA & Validasi Consent (Terredaksi)'
          : 'Redacted QA Audit & Consent Validation Sample'
      );
      setNewSrvPortfolioThumb('/images/capture_warehouse_pov_1795676771521.jpg');
    }
  };

  const toggleSrvCategory = (slug: ActivityCategorySlug) => {
    setNewSrvCategories((prev) =>
      prev.includes(slug) ? (prev.length > 1 ? prev.filter((c) => c !== slug) : prev) : [...prev, slug]
    );
  };

  const toggleStringItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    val: string
  ) => {
    setList((prev) =>
      prev.includes(val) ? (prev.length > 1 ? prev.filter((item) => item !== val) : prev) : [...prev, val]
    );
  };

  const [rfpCompany, setRfpCompany] = useState('PT Nusantara Riset Teknologi');
  const [rfpCountry, setRfpCountry] = useState('Indonesia');
  const [rfpWebsite, setRfpWebsite] = useState('https://nusantarariset.id');
  const [rfpPicName, setRfpPicName] = useState('Budi Santoso (Head of AI Data)');
  const [rfpPhone, setRfpPhone] = useState('+62 812-8890-1122');
  const [rfpEmail, setRfpEmail] = useState('procurement@company.com');
  const [rfpDomain, setRfpDomain] = useState('Manufacturing & Assembly');
  const [rfpDeliveryFormat, setRfpDeliveryFormat] = useState('MP4 + JSONL');
  const [rfpDeadline, setRfpDeadline] = useState('Q1 2027 (Jan–Mar)');
  const [rfpVolume, setRfpVolume] = useState('50 – 250 jam');
  const [rfpSummary, setRfpSummary] = useState('');
  const [rfpAttachmentName, setRfpAttachmentName] = useState('');
  const [rfpConsent, setRfpConsent] = useState(true);

  const [kycDocType, setKycDocType] = useState('KTP / National ID');

  return (
    <>
      {contractOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-mono text-[#027F86]">
                  {contractOrder.code} · {contractOrder.specVersion}
                </p>
                <h3 className="text-base font-bold mt-0.5">
                  {isId ? 'Spesifikasi Kontrak Work Order' : 'Work Order Contract Specification'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setContractOrder(null)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2.5">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Judul Tugas' : 'Assignment'}
                </span>
                <span className="font-semibold sm:text-right sm:max-w-[60%]">
                  {isId ? contractOrder.title : contractOrder.titleEn || contractOrder.title}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Pihak Terkait' : 'Counterparty'}
                </span>
                <span className="font-semibold">{contractOrder.counterparty}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Target Volume' : 'Committed Volume'}
                </span>
                <span className="font-semibold tabular-nums">
                  {contractOrder.totalUnits} {isId ? 'jam' : 'hours'}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Nilai Work Order' : 'Order Value'}
                </span>
                <span className="font-bold text-[#FC840E] tabular-nums">
                  {egvoxFormatIDR(contractOrder.amount)} ({egvoxFormatUSD(contractOrder.amount)} USD)
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Gerbang Hak Data' : 'Rights Gate'}
                </span>
                <span className="font-semibold text-[#16835D] inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {isId ? 'SHA-256 & Consent Terkunci' : 'SHA-256 & Consent Locked'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setContractOrder(null)}
              className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
            >
              {isId ? 'Tutup Ringkasan Kontrak' : 'Close Contract Summary'}
            </button>
          </div>
        </div>
      )}

      {reworkTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-bold">
                  {isId ? 'Tindak Lanjut File QA' : 'QA File Action & Rework'}
                </h3>
                <p className="text-xs font-mono text-[#027F86] mt-0.5 break-all">
                  {reworkTarget.fileName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReworkTarget(null)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitReworkOrDispute(
                  reworkTarget.id,
                  reworkNote.trim() ||
                    (isId ? 'Revisi kualitas & pencahayaan diunggah ulang.' : 'Lighting and focus rework uploaded.'),
                  reworkMode
                );
                setReworkTarget(null);
                setReworkNote('');
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReworkMode('rework')}
                  className={`rounded-xl py-2 text-xs font-semibold ${
                    reworkMode === 'rework'
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)]'
                  }`}
                >
                  {isId ? 'Unggah Rework' : 'Upload Rework'}
                </button>
                <button
                  type="button"
                  onClick={() => setReworkMode('appeal')}
                  className={`rounded-xl py-2 text-xs font-semibold ${
                    reworkMode === 'appeal'
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)]'
                  }`}
                >
                  {isId ? 'Ajukan Banding QA' : 'Submit QA Appeal'}
                </button>
              </div>
              <textarea
                rows={3}
                value={reworkNote}
                onChange={(e) => setReworkNote(e.target.value)}
                placeholder={
                  isId
                    ? 'Jelaskan perbaikan video atau alasan banding ke tim QA...'
                    : 'Describe your video rework or QA dispute rationale...'
                }
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {reworkMode === 'rework'
                  ? isId
                    ? 'Kirim Rework ke Karantina'
                    : 'Submit Rework to Quarantine'
                  : isId
                  ? 'Kirim Banding QA'
                  : 'Submit QA Appeal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {counterTarget && (() => {
        const parsedGross = Math.max(0, Number(counterGrossFee) || counterTarget.grossFeeIDR);
        const adminFee = Math.round(parsedGross * 0.08);
        const paymentFee = Math.round(parsedGross * 0.015);
        const netFreelancer = Math.max(0, parsedGross - adminFee - paymentFee);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-[#027F86]">
                    {counterTarget.code} · V{counterTarget.versions.length + 1} Counteroffer
                  </p>
                  <h3 className="text-base font-bold">
                    {isId ? 'Ajukan Counteroffer Terstruktur' : 'Submit Structured Counteroffer'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCounterTarget(null)}
                  className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  respondRecruitmentOffer(counterTarget.id, 'countered', {
                    grossFeeIDR: parsedGross,
                    scopeDelta:
                      counterScopeDelta.trim() ||
                      (isId
                        ? `${counterTarget.volumeHours} unit · detail sama`
                        : `${counterTarget.volumeHours} units · same scope`),
                    note:
                      counterNote.trim() ||
                      (isId
                        ? 'Penyesuaian kompensasi & SLA pengiriman.'
                        : 'Compensation and SLA adjustment.'),
                    actorRole: persona === 'freelancer' ? 'freelancer' : 'recruiter',
                  });
                  setCounterTarget(null);
                  setCounterNote('');
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {isId ? 'Total Penawaran Gross (IDR)' : 'Total Gross Offer (IDR)'}
                  </label>
                  <input
                    type="number"
                    min={500000}
                    step={50000}
                    required
                    value={counterGrossFee}
                    onChange={(e) => setCounterGrossFee(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-bold tabular-nums"
                  />
                </div>
                <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-[11px] space-y-1.5 tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-[var(--egvox-text-muted)]">
                      {isId ? 'Penawaran Fee (Gross)' : 'Gross Fee Offer'}
                    </span>
                    <span className="font-bold">{egvoxFormatIDR(parsedGross)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--egvox-text-muted)]">
                      {isId ? 'Biaya Admin EgvoX (8%)' : 'EgvoX Admin Fee (8%)'}
                    </span>
                    <span className="font-semibold text-[#C43D3D]">- {egvoxFormatIDR(adminFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--egvox-text-muted)]">
                      {isId ? 'Biaya Pembayaran (±1,5%)' : 'Payment Fee (±1.5%)'}
                    </span>
                    <span className="font-semibold text-[#C43D3D]">- {egvoxFormatIDR(paymentFee)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-[var(--egvox-border-default)]">
                    <span className="font-bold text-[#16835D]">
                      {isId ? 'Penerimaan Freelancer (Net)' : 'Freelancer Net Payout'}
                    </span>
                    <span className="font-bold text-[#16835D]">{egvoxFormatIDR(netFreelancer)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {isId ? 'Perubahan Ruang Lingkup / Deliverables *' : 'Scope / Deliverables Delta *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={counterScopeDelta}
                    onChange={(e) => setCounterScopeDelta(e.target.value)}
                    placeholder={
                      isId
                        ? 'Contoh: 50 video · detail sama + prioritas SLA'
                        : 'Example: 50 videos · same scope + priority SLA'
                    }
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {isId ? 'Catatan Resmi Negosiasi *' : 'Official Negotiation Note *'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={counterNote}
                    onChange={(e) => setCounterNote(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                    placeholder={isId ? 'Jelaskan alasan penyesuaian kompensasi atau SLA...' : 'Explain fee or SLA adjustment rationale...'}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
                >
                  {isId ? `Kirim Counteroffer V${counterTarget.versions.length + 1}` : `Submit Counteroffer V${counterTarget.versions.length + 1}`}
                </button>
              </form>
            </div>
          </div>
        );
      })()}

      {payoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Tarik Dana Layak Payout' : 'Withdraw Payout Balance'}
              </h3>
              <button
                type="button"
                onClick={() => setPayoutOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--egvox-text-secondary)] tabular-nums">
              {isId ? 'Saldo tersedia:' : 'Available balance:'}{' '}
              <strong className="text-[#027F86] dark:text-[#04B8B4]">
                {egvoxFormatIDR(availableBalance)} ({egvoxFormatUSD(availableBalance)} USD)
              </strong>
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const numeric = Number(payoutAmount);
                if (!numeric || numeric <= 0 || numeric > availableBalance) {
                  showToast(
                    isId
                      ? 'Nominal penarikan tidak valid atau melebihi saldo layak payout.'
                      : 'Invalid withdrawal amount or exceeds available balance.'
                  );
                  return;
                }
                requestPayout(numeric, payoutDestDraft);
                setPayoutOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {isId ? 'Nominal Penarikan (IDR)' : 'Withdrawal Amount (IDR)'}
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {isId ? 'Rekening / E-Wallet Tujuan' : 'Destination Bank / E-Wallet'}
                </label>
                <input
                  type="text"
                  value={payoutDestDraft}
                  onChange={(e) => setPayoutDestDraft(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Ajukan Penarikan Dana' : 'Confirm Withdrawal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Berikan Ulasan & Rating' : 'Rate & Review Collaboration'}
              </h3>
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitOrderReview(
                  persona === 'freelancer' ? 'PT Data Visual Indonesia' : 'Rizal Maulana',
                  selectedOrderCode,
                  reviewRating,
                  reviewComment.trim() ||
                    (isId ? 'Kolaborasi lancar dan hasil sesuai spesifikasi.' : 'Smooth collaboration matching spec.')
                );
                setReviewOpen(false);
                setReviewComment('');
              }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= reviewRating
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'text-[var(--egvox-text-muted)]'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={isId ? 'Tulis ulasan pengalaman kerja sama...' : 'Write your review...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Kirim Ulasan' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {createProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold">
                  {isId ? 'Buat Project Kebutuhan Dataset Baru' : 'Publish New Dataset Project'}
                </h3>
                <p className="text-[11px] text-[var(--egvox-text-muted)] mt-0.5">
                  {isId
                    ? 'Seluruh parameter teknis, acceptance criteria, dan kebijakan privasi tampil langsung di halaman Detail Project.'
                    : 'All capture specifications, acceptance criteria, and privacy rules sync directly to the public Project Detail page.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateProjectOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPrjTitle.trim() || !newPrjSummary.trim()) return;
                const parsedCriteria = newPrjAcceptanceText
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean);
                createVendorProject({
                  title: newPrjTitle.trim(),
                  category: newPrjCat,
                  dataType: newPrjType,
                  targetVolume: Math.max(10, Number(newPrjHours) || 50),
                  ratePerUnit: Math.max(50000, Number(newPrjRate) || 175000),
                  showBudgetDisclosure: newPrjShowBudget,
                  location: newPrjLocation.trim() || 'Indonesia',
                  summary: newPrjSummary.trim(),
                  deadline: newPrjDeadline.trim(),
                  applicationCloseDate: newPrjAppClose.trim(),
                  perspective: newPrjPerspective,
                  mounting: newPrjMounting,
                  deviceRequirement: newPrjDeviceReq.trim(),
                  resolution: newPrjResolution,
                  frameRate: newPrjFps,
                  codecFormat: newPrjCodec.trim(),
                  orientation: newPrjOrientation,
                  clipDuration: newPrjClipDuration.trim(),
                  audioPolicy: newPrjAudioPolicy,
                  consentPolicy: newPrjConsentPolicy.trim(),
                  annotationRequired: newPrjAnnotation,
                  acceptanceCriteria: parsedCriteria,
                  rightsSummary: newPrjRightsSummary.trim(),
                });
                setCreateProjectOpen(false);
                setNewPrjTitle('');
                setNewPrjSummary('');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  {isId ? 'Judul Project Dataset *' : 'Dataset Project Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={newPrjTitle}
                  onChange={(e) => setNewPrjTitle(e.target.value)}
                  placeholder={
                    isId
                      ? 'Mis. Dataset Aktivitas Gudang & Barcode Picking (POV)'
                      : 'e.g. Warehouse Picking & Barcode Scanning Dataset (POV)'
                  }
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Kategori Aktivitas *' : 'Activity Category *'}
                  </label>
                  <select
                    value={newPrjCat}
                    onChange={(e) => setNewPrjCat(e.target.value as ActivityCategorySlug)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  >
                    {ACTIVITY_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {isId ? cat.nameId : cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Modalitas Data *' : 'Data Modality *'}
                  </label>
                  <select
                    value={newPrjType}
                    onChange={(e) => setNewPrjType(e.target.value as DataModality)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  >
                    <option value="Video">Video</option>
                    <option value="Gambar">{isId ? 'Gambar' : 'Image'}</option>
                    <option value="Multimodal">Multimodal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Target Volume (Jam) *' : 'Target Volume (Hours) *'}
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={newPrjHours}
                    onChange={(e) => setNewPrjHours(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Ref. Budget / Jam (IDR)' : 'Budget Ref. / Hour (IDR)'}
                  </label>
                  <input
                    type="number"
                    min={50000}
                    step={5000}
                    value={newPrjRate}
                    onChange={(e) => setNewPrjRate(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-semibold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Batas Aplikasi *' : 'Application Close *'}
                  </label>
                  <input
                    type="text"
                    value={newPrjAppClose}
                    onChange={(e) => setNewPrjAppClose(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Batas Waktu Proyek *' : 'Project Deadline *'}
                  </label>
                  <input
                    type="text"
                    value={newPrjDeadline}
                    onChange={(e) => setNewPrjDeadline(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Capture Specification & Annotation Scope (PRD §5 & §28) */}
              <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 space-y-3">
                <p className="text-[11px] font-bold text-[#027F86]">
                  {isId ? 'Spesifikasi Capture Egocentric & Kebutuhan Anotasi' : 'Egocentric Capture Spec & Annotation Scope'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                      {isId ? 'Perspektif Kamera' : 'Perspective'}
                    </label>
                    <select
                      value={newPrjPerspective}
                      onChange={(e) =>
                        setNewPrjPerspective(e.target.value as CaptureSpecification['perspective'])
                      }
                      className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5"
                    >
                      <option value="Egocentric (First-Person)">Egocentric (First-Person)</option>
                      <option value="Multi-Angle + Egocentric">Multi-Angle + Egocentric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                      {isId ? 'Pemasangan Kamera' : 'Camera Mounting'}
                    </label>
                    <select
                      value={newPrjMounting}
                      onChange={(e) =>
                        setNewPrjMounting(e.target.value as CaptureSpecification['mounting'])
                      }
                      className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5"
                    >
                      <option value="Head-mounted">Head-mounted</option>
                      <option value="Chest-mounted">Chest-mounted</option>
                      <option value="Wearable Glasses">Wearable Glasses</option>
                      <option value="Handheld">Handheld</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                      {isId ? 'Resolusi Minimum' : 'Minimum Resolution'}
                    </label>
                    <select
                      value={newPrjResolution}
                      onChange={(e) => setNewPrjResolution(e.target.value)}
                      className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5"
                    >
                      <option value="Minimum 1080p (1920x1080)">1080p (1920x1080 min)</option>
                      <option value="4K UHD (3840x2160)">4K UHD (2160p)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                      Frame Rate
                    </label>
                    <select
                      value={newPrjFps}
                      onChange={(e) => setNewPrjFps(e.target.value)}
                      className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5"
                    >
                      <option value="30–60 FPS">30–60 FPS</option>
                      <option value="60 FPS Locked">60 FPS Locked</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                      Codec & Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={newPrjCodec}
                        onChange={(e) => setNewPrjCodec(e.target.value)}
                        className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2 py-1.5 text-[11px]"
                      />
                      <select
                        value={newPrjOrientation}
                        onChange={(e) =>
                          setNewPrjOrientation(e.target.value as CaptureSpecification['orientation'])
                        }
                        className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2 py-1.5 text-[11px]"
                      >
                        <option value="Landscape 16:9">16:9</option>
                        <option value="Portrait 9:16">9:16</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                      {isId ? 'Kebijakan Audio & Durasi Sesi' : 'Audio Policy & Session Duration'}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={newPrjAudioPolicy}
                        onChange={(e) =>
                          setNewPrjAudioPolicy(e.target.value as CaptureSpecification['audioPolicy'])
                        }
                        className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2 py-1.5 text-[11px]"
                      >
                        <option value="Optional">{isId ? 'Audio Opsional' : 'Audio Optional'}</option>
                        <option value="Required">{isId ? 'Audio Wajib' : 'Audio Required'}</option>
                        <option value="Forbidden">{isId ? 'Audio Dilarang' : 'Audio Forbidden'}</option>
                      </select>
                      <input
                        type="text"
                        value={newPrjClipDuration}
                        onChange={(e) => setNewPrjClipDuration(e.target.value)}
                        className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2 py-1.5 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                    {isId ? 'Kebutuhan Perangkat Minimal' : 'Minimum Device Requirement'}
                  </label>
                  <input
                    type="text"
                    value={newPrjDeviceReq}
                    onChange={(e) => setNewPrjDeviceReq(e.target.value)}
                    className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                    {isId ? 'Kebijakan Persetujuan & Privasi (Consent)' : 'Participant Consent & Privacy Policy'}
                  </label>
                  <input
                    type="text"
                    value={newPrjConsentPolicy}
                    onChange={(e) => setNewPrjConsentPolicy(e.target.value)}
                    className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                    {isId ? 'Kebutuhan Anotasi Proyek' : 'Project Annotation Requirement'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setNewPrjAnnotation('none')}
                      className={`rounded-lg border px-2.5 py-2 font-semibold text-left ${
                        newPrjAnnotation === 'none'
                          ? 'border-[#027F86] bg-[#027F86]/10 text-[#027F86]'
                          : 'border-[var(--egvox-border-default)]'
                      }`}
                    >
                      {isId ? 'Raw Video Only' : 'Raw Video Only'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPrjAnnotation('optional')}
                      className={`rounded-lg border px-2.5 py-2 font-semibold text-left ${
                        newPrjAnnotation === 'optional'
                          ? 'border-[#FC840E] bg-[#FC840E]/10 text-[#FC840E]'
                          : 'border-[var(--egvox-border-default)]'
                      }`}
                    >
                      {isId ? 'Anotasi Opsional' : 'Annotation Optional'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPrjAnnotation('required')}
                      className={`rounded-lg border px-2.5 py-2 font-semibold text-left ${
                        newPrjAnnotation === 'required'
                          ? 'border-[#16835D] bg-[#16835D]/10 text-[#16835D]'
                          : 'border-[var(--egvox-border-default)]'
                      }`}
                    >
                      {isId ? 'Wajib Anotasi' : 'Annotation Required'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#027F86]/25 bg-[#027F86]/8 px-3.5 py-2 text-[11px] font-semibold text-[#027F86] dark:text-[#04B8B4] flex justify-between tabular-nums">
                <span>{isId ? 'Estimasi Budget Proyek Vendor:' : 'Vendor Project Budget Estimate:'}</span>
                <span>
                  {egvoxFormatIDR((Number(newPrjRate) || 0) * (Number(newPrjHours) || 0))} (
                  {egvoxFormatUSD((Number(newPrjRate) || 0) * (Number(newPrjHours) || 0))} USD)
                </span>
              </div>
              <label className="flex items-start gap-2 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-[11px] text-[var(--egvox-text-secondary)]">
                <input
                  type="checkbox"
                  checked={newPrjShowBudget}
                  onChange={(e) => setNewPrjShowBudget(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-[#027F86]"
                />
                <span>
                  {isId
                    ? 'Tampilkan estimasi budget proyek Vendor di katalog publik (opsional; bukan tarif publik freelancer).'
                    : 'Show Vendor project budget disclosure in public catalog (optional; not a public freelancer rate).'}
                </span>
              </label>

              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  {isId ? 'Lokasi Pengambilan Data *' : 'Capture Location *'}
                </label>
                <input
                  type="text"
                  value={newPrjLocation}
                  onChange={(e) => setNewPrjLocation(e.target.value)}
                  placeholder={isId ? 'Contoh: Jabodetabek, Bandung, Surabaya' : 'e.g. Jakarta, Bandung'}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  {isId ? 'Ringkasan Kebutuhan & Panduan Capture *' : 'Project Summary & Capture Brief *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={newPrjSummary}
                  onChange={(e) => setNewPrjSummary(e.target.value)}
                  placeholder={isId ? 'Jelaskan skenario aktivitas, objek target, dan panduan pencahayaan...' : 'Describe activity scenarios, target objects, and capture guide...'}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Acceptance Criteria QA (1 baris per poin)' : 'QA Acceptance Criteria (1 line per item)'}
                  </label>
                  <textarea
                    rows={3}
                    value={newPrjAcceptanceText}
                    onChange={(e) => setNewPrjAcceptanceText(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Ringkasan Hak Data & Lisensi' : 'Data Rights & License Summary'}
                  </label>
                  <textarea
                    rows={3}
                    value={newPrjRightsSummary}
                    onChange={(e) => setNewPrjRightsSummary(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
              >
                <span>{isId ? 'Publikasikan ke Project Catalog' : 'Publish to Project Catalog'}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {createServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold">
                  {isId ? 'Buat Profil Kapabilitas Freelancer' : 'Create Freelancer Capability Profile'}
                </h3>
                <p className="text-[11px] text-[var(--egvox-text-muted)] mt-0.5">
                  {isId
                    ? 'Field form menyesuaikan kelas peran Anda (Video Contributor, Data Annotator, atau QA Specialist) dan selaras dengan tampilan Katalog Rekrutmen — tanpa tarif publik.'
                    : 'Form fields adapt dynamically to your talent class (Video Contributor, Data Annotator, or QA Specialist) and sync 1:1 with the public Talent Catalog — no public pricing.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateServiceOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSrvTitle.trim() || !newSrvDesc.trim()) return;
                if (!newSrvPortfolioConsent) {
                  showToast(
                    isId
                      ? 'Centang pernyataan hak & izin peserta untuk portfolio preview.'
                      : 'Please confirm participant consent for the portfolio preview.'
                  );
                  return;
                }

                const roleEquipment =
                  newSrvRole === 'Video Contributor'
                    ? [
                        newSrvEquipment.trim() || 'Action Cam 4K + Chest/Head Mount',
                        `${isId ? 'Perspektif:' : 'Perspective:'} ${newSrvPerspective}`,
                      ]
                    : newSrvRole === 'Data Annotator'
                    ? [
                        ...newSrvAnnotatorTools,
                        newSrvAnnotatorWorkstation.trim() || 'Dual-Monitor Workstation',
                      ]
                    : [
                        ...newSrvQaTools,
                        `${isId ? 'Cakupan:' : 'Scope:'} ${newSrvQaScopes.slice(0, 2).join(', ')}`,
                      ];

                const roleResolution =
                  newSrvRole === 'Video Contributor'
                    ? newSrvResolutionFps
                    : newSrvRole === 'Data Annotator'
                    ? newSrvAnnotatorOutputFormat
                    : newSrvQaStandard;

                const roleSchemas =
                  newSrvRole === 'Data Annotator'
                    ? newSrvAnnotatorSchemas
                    : newSrvRole === 'QA Specialist'
                    ? newSrvQaScopes
                    : undefined;

                const roleTools =
                  newSrvRole === 'Data Annotator'
                    ? newSrvAnnotatorTools
                    : newSrvRole === 'QA Specialist'
                    ? newSrvQaTools
                    : undefined;

                createFreelancerService({
                  title: newSrvTitle.trim(),
                  roleType: newSrvRole,
                  location: newSrvLocation.trim() || 'Indonesia',
                  description: newSrvDesc.trim(),
                  categories: newSrvCategories,
                  capacityLabel: newSrvCapacity.trim(),
                  deliverySla: newSrvSla.trim(),
                  equipment: roleEquipment,
                  resolutionFps: roleResolution.trim(),
                  annotationTools: roleTools,
                  supportedSchemas: roleSchemas,
                  exclusions: newSrvExclusions
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                  portfolioTitle: newSrvPortfolioTitle.trim(),
                  portfolioImage: newSrvPortfolioThumb,
                  conflictDisclosureDeclared:
                    newSrvRole === 'QA Specialist' ? newSrvConflictDeclared : undefined,
                  conflictDisclosureText:
                    newSrvRole === 'QA Specialist' ? newSrvConflictText.trim() : undefined,
                });
                setCreateServiceOpen(false);
                setNewSrvTitle('');
                setNewSrvDesc('');
              }}
              className="space-y-3.5 text-xs"
            >
              {/* Role Class Switcher */}
              <div>
                <label className="block text-[11px] font-semibold mb-1.5">
                  {isId ? 'Kelas Talenta Freelancer *' : 'Freelancer Role Class *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: 'Video Contributor' as const,
                        subId: 'Perekaman Egocentric POV',
                        subEn: 'Egocentric POV Capture',
                      },
                      {
                        id: 'Data Annotator' as const,
                        subId: 'Labeling, BBox & Temporal',
                        subEn: 'Labeling, BBox & Temporal',
                      },
                      {
                        id: 'QA Specialist' as const,
                        subId: 'Audit Independen & PII',
                        subEn: 'Independent QA & PII Audit',
                      },
                    ] as const
                  ).map((roleOption) => {
                    const active = newSrvRole === roleOption.id;
                    return (
                      <button
                        key={roleOption.id}
                        type="button"
                        onClick={() => handleSrvRoleChange(roleOption.id)}
                        className={`rounded-xl border p-2.5 text-left transition-colors ${
                          active
                            ? 'border-[#027F86] bg-[#027F86]/10 text-[#027F86] dark:text-[#04B8B4]'
                            : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-canvas)]'
                        }`}
                      >
                        <p className="font-bold text-xs">{roleOption.id}</p>
                        <p className="text-[10px] text-[var(--egvox-text-muted)] mt-0.5">
                          {isId ? roleOption.subId : roleOption.subEn}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  {newSrvRole === 'Video Contributor'
                    ? isId
                      ? 'Judul Layanan Perekaman Video *'
                      : 'Video Capture Capability Title *'
                    : newSrvRole === 'Data Annotator'
                    ? isId
                      ? 'Judul Layanan Data Annotation *'
                      : 'Data Annotation Capability Title *'
                    : isId
                    ? 'Judul Layanan Independent QA Review *'
                    : 'Independent QA Review Capability Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={newSrvTitle}
                  onChange={(e) => setNewSrvTitle(e.target.value)}
                  placeholder={
                    newSrvRole === 'Video Contributor'
                      ? isId
                        ? 'Contoh: Jasa Pengambilan Video Aktivitas Dapur & Rumah Tangga (4K POV)'
                        : 'e.g. Egocentric Kitchen & Household Video Capture (4K POV)'
                      : newSrvRole === 'Data Annotator'
                      ? isId
                        ? 'Contoh: Jasa Anotasi Bounding Box, Tracking & Temporal Action Segmentation'
                        : 'e.g. Bounding Box, Object Tracking & Temporal Action Labeling'
                      : isId
                      ? 'Contoh: Jasa Independent QA Review Video, Metadata & Audit Consent'
                      : 'e.g. Independent Video QA Review, Metadata & Consent Audit'
                  }
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>

              {/* Domain / Activity Categories (synced with Catalog & Detail badges) */}
              <div>
                <label className="block text-[11px] font-semibold mb-1.5">
                  {isId ? 'Cakupan Domain / Kategori Aktivitas *' : 'Activity Domain Coverage *'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ACTIVITY_CATEGORIES.map((cat) => {
                    const selected = newSrvCategories.includes(cat.slug);
                    return (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => toggleSrvCategory(cat.slug)}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          selected
                            ? 'border-[#027F86] bg-[#027F86]/12 text-[#027F86] dark:text-[#04B8B4] font-semibold'
                            : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-secondary)]'
                        }`}
                      >
                        {isId ? cat.nameId : cat.nameEn}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ROLE-SPECIFIC TECHNICAL FIELDS */}
              {newSrvRole === 'Video Contributor' && (
                <div className="rounded-xl border border-[#027F86]/30 bg-[#027F86]/5 p-3.5 space-y-3">
                  <p className="text-[11px] font-bold text-[#027F86] dark:text-[#04B8B4]">
                    {isId
                      ? 'Spesifikasi Perangkat & Perekaman Video Contributor'
                      : 'Video Contributor Camera Rig & Capture Specs'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">
                        {isId ? 'Perspektif Capture *' : 'Capture Perspective *'}
                      </label>
                      <select
                        value={newSrvPerspective}
                        onChange={(e) => setNewSrvPerspective(e.target.value)}
                        className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
                      >
                        <option value="Egocentric (First-Person)">Egocentric (First-Person)</option>
                        <option value="Multi-Angle + Egocentric">Multi-Angle + Egocentric</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">
                        {isId ? 'Standar Resolusi, FPS & Codec *' : 'Output Resolution, FPS & Codec *'}
                      </label>
                      <select
                        value={newSrvResolutionFps}
                        onChange={(e) => setNewSrvResolutionFps(e.target.value)}
                        className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
                      >
                        <option value="1080p – 4K · 30–60 FPS · MP4 H.264/H.265">
                          1080p – 4K · 30–60 FPS · MP4 H.264/H.265
                        </option>
                        <option value="4K UHD · 60 FPS Locked · MP4 H.265">
                          4K UHD · 60 FPS Locked · MP4 H.265
                        </option>
                        <option value="1080p · 60 FPS · Audio Muted Compliant">
                          1080p · 60 FPS · Audio Muted Compliant
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">
                      {isId ? 'Kamera, Mounting Rig & Pencahayaan *' : 'Camera Hardware, Mount & Lighting *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newSrvEquipment}
                      onChange={(e) => setNewSrvEquipment(e.target.value)}
                      placeholder={
                        isId
                          ? 'Contoh: GoPro Hero 12 Black + Chest Harness + Head Strap + Dual Softbox'
                          : 'e.g. GoPro Hero 12 Black + Chest Harness + Head Strap'
                      }
                      className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              )}

              {newSrvRole === 'Data Annotator' && (
                <div className="rounded-xl border border-[#FC840E]/35 bg-[#FC840E]/5 p-3.5 space-y-3">
                  <p className="text-[11px] font-bold text-[#FC840E]">
                    {isId
                      ? 'Spesifikasi Keahlian, Tools & Skema Data Annotator'
                      : 'Data Annotator Labeling Skills, Tools & Export Schemas'}
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1.5">
                      {isId ? 'Spesialisasi Pelabelan (Multi-Select) *' : 'Labeling Specializations *'}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Bounding Box (2D/3D)',
                        'Object Tracking IDs',
                        'Temporal Action Segmentation',
                        'Hand-Object Interaction',
                        'Pose / Keypoint Estimation',
                        'Video Captioning',
                      ].map((schema) => {
                        const active = newSrvAnnotatorSchemas.includes(schema);
                        return (
                          <button
                            key={schema}
                            type="button"
                            onClick={() =>
                              toggleStringItem(newSrvAnnotatorSchemas, setNewSrvAnnotatorSchemas, schema)
                            }
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                              active
                                ? 'border-[#FC840E] bg-[#FC840E]/15 text-[#b45a00] dark:text-[#FC840E] font-semibold'
                                : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                            }`}
                          >
                            {schema}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1.5">
                      {isId ? 'Platform & Tools Anotasi yang Dikuasai *' : 'Annotation Platforms & Tools *'}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'EgvoX Annotation Platform (v1)',
                        'CVAT',
                        'Label Studio',
                        'VGG Image Annotator',
                      ].map((tool) => {
                        const active = newSrvAnnotatorTools.includes(tool);
                        return (
                          <button
                            key={tool}
                            type="button"
                            onClick={() =>
                              toggleStringItem(newSrvAnnotatorTools, setNewSrvAnnotatorTools, tool)
                            }
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                              active
                                ? 'border-[#027F86] bg-[#027F86]/12 text-[#027F86] dark:text-[#04B8B4] font-semibold'
                                : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                            }`}
                          >
                            {tool}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">
                        {isId ? 'Format & Skema Ekspor *' : 'Supported Output Schema *'}
                      </label>
                      <select
                        value={newSrvAnnotatorOutputFormat}
                        onChange={(e) => setNewSrvAnnotatorOutputFormat(e.target.value)}
                        className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
                      >
                        <option value="Skema JSON, JSONL, COCO, CSV (Frame-Accurate)">
                          JSON, JSONL, COCO, CSV (Frame-Accurate)
                        </option>
                        <option value="Egocentric Temporal JSONL + Hand-Object BBox">
                          Egocentric Temporal JSONL + Hand-Object BBox
                        </option>
                        <option value="COCO Keypoints & Dense Segmentation Mask">
                          COCO Keypoints & Segmentation Mask
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">
                        {isId ? 'Spesifikasi Workstation Anotasi *' : 'Annotation Workstation Specs *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newSrvAnnotatorWorkstation}
                        onChange={(e) => setNewSrvAnnotatorWorkstation(e.target.value)}
                        className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {newSrvRole === 'QA Specialist' && (
                <div className="rounded-xl border border-[#2563A6]/35 bg-[#2563A6]/6 p-3.5 space-y-3">
                  <p className="text-[11px] font-bold text-[#2563A6]">
                    {isId
                      ? 'Cakupan Audit, Tools Inspeksi & Independensi QA Specialist'
                      : 'QA Audit Scope, Inspection Tools & Independence Policy'}
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1.5">
                      {isId ? 'Jenis Pemeriksaan QA yang Dikuasai *' : 'QA Inspection Types *'}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Technical Validation (FFmpeg/MediaInfo)',
                        'Capture-Spec Compliance',
                        'Privacy / PII & Blur Screening',
                        'Consent & Rights Evidence Audit',
                        'Annotation IoU & Schema Audit',
                        'Dataset Package Readiness QA',
                      ].map((scope) => {
                        const active = newSrvQaScopes.includes(scope);
                        return (
                          <button
                            key={scope}
                            type="button"
                            onClick={() =>
                              toggleStringItem(newSrvQaScopes, setNewSrvQaScopes, scope)
                            }
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                              active
                                ? 'border-[#2563A6] bg-[#2563A6]/15 text-[#2563A6] font-semibold'
                                : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                            }`}
                          >
                            {scope}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1.5">
                      {isId ? 'Tools & Checklist Validasi QA *' : 'QA Tools & Audit Checklists *'}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Standar QA EgvoX v1.3',
                        'FFmpeg / MediaInfo Technical Inspector',
                        'JSONL / COCO Schema Validator',
                        'EgvoX QA Workbench',
                      ].map((tool) => {
                        const active = newSrvQaTools.includes(tool);
                        return (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => toggleStringItem(newSrvQaTools, setNewSrvQaTools, tool)}
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                              active
                                ? 'border-[#027F86] bg-[#027F86]/12 text-[#027F86] dark:text-[#04B8B4] font-semibold'
                                : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                            }`}
                          >
                            {tool}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">
                      {isId ? 'Ringkasan Standar Audit QA *' : 'QA Audit Standard Summary *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newSrvQaStandard}
                      onChange={(e) => setNewSrvQaStandard(e.target.value)}
                      className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-2 rounded-xl border border-[#16835D]/30 bg-[#16835D]/8 p-3">
                    <label className="flex items-start gap-2 text-[11px] text-[var(--egvox-text-secondary)]">
                      <input
                        type="checkbox"
                        required
                        checked={newSrvConflictDeclared}
                        onChange={(e) => setNewSrvConflictDeclared(e.target.checked)}
                        className="mt-0.5 h-3.5 w-3.5 accent-[#16835D]"
                      />
                      <span>
                        <strong>{isId ? 'Deklarasi Anti-Konflik Kepentingan (Wajib):' : 'Mandatory Anti-Conflict Declaration:'}</strong>{' '}
                        {isId
                          ? 'Saya tidak akan mengaudit rekaman atau anotasi milik sendiri maupun tim produksi afiliasi.'
                          : 'I will never audit own recordings, annotations, or affiliated capture outputs.'}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={newSrvConflictText}
                      onChange={(e) => setNewSrvConflictText(e.target.value)}
                      placeholder={
                        isId
                          ? 'Catatan independensi QA yang ditampilkan di profil...'
                          : 'Public QA independence statement...'
                      }
                      className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5 text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* Shared Capacity, SLA & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {newSrvRole === 'Video Contributor'
                      ? isId
                        ? 'Kapasitas Rekam / Minggu *'
                        : 'Weekly Capture Capacity *'
                      : newSrvRole === 'Data Annotator'
                      ? isId
                        ? 'Kapasitas Anotasi / Minggu *'
                        : 'Weekly Annotation Capacity *'
                      : isId
                      ? 'Kapasitas Audit Batch / Minggu *'
                      : 'Weekly QA Batch Capacity *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newSrvCapacity}
                    onChange={(e) => setNewSrvCapacity(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Estimasi SLA Pengiriman *' : 'Delivery SLA *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newSrvSla}
                    onChange={(e) => setNewSrvSla(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {newSrvRole === 'Video Contributor'
                      ? isId
                        ? 'Kota / Area Perekaman *'
                        : 'Capture City / Region *'
                      : isId
                      ? 'Domisili / Mode Kerja *'
                      : 'Location / Remote Mode *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newSrvLocation}
                    onChange={(e) => setNewSrvLocation(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  {newSrvRole === 'Video Contributor'
                    ? isId
                      ? 'Deskripsi Keahlian Perekaman, Pencahayaan & Pengalaman *'
                      : 'Capture Experience, Lighting & Framing Summary *'
                    : newSrvRole === 'Data Annotator'
                    ? isId
                      ? 'Deskripsi Pengalaman Pelabelan, Akurasi IoU & Domain *'
                      : 'Annotation Experience, IoU Accuracy & Domain Knowledge *'
                    : isId
                    ? 'Deskripsi Metodologi Audit QA, Pengalaman & Rekam Jejak *'
                    : 'QA Inspection Methodology, Experience & Track Record *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={newSrvDesc}
                  onChange={(e) => setNewSrvDesc(e.target.value)}
                  placeholder={
                    newSrvRole === 'Video Contributor'
                      ? isId
                        ? 'Jelaskan pengalaman perekaman POV, kalibrasi mounting, kontrol pencahayaan, dan kepatuhan consent...'
                        : 'Describe your first-person capture workflow, stabilization, and consent rigor...'
                      : newSrvRole === 'Data Annotator'
                      ? isId
                        ? 'Jelaskan pengalaman anotasi frame-accurate, QA internal, dan skema JSONL/COCO yang pernah ditangani...'
                        : 'Describe frame-accurate labeling experience, IoU standards, and schema deliveries...'
                      : isId
                      ? 'Jelaskan prosedur pengecekan teknis FFmpeg, redaksi PII, validasi consent, dan pelaporan QA...'
                      : 'Describe technical FFmpeg inspection, PII screening, consent audit, and QA reporting...'
                  }
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  {isId ? 'Batasan Layanan & Pengecualian (Exclusions)' : 'Service Exclusions & Boundaries'}
                </label>
                <input
                  type="text"
                  value={newSrvExclusions}
                  onChange={(e) => setNewSrvExclusions(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>

              {/* Portfolio Preview (Matches Catalog & Detail UI) */}
              <div className="rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 space-y-2.5">
                <p className="text-[11px] font-bold text-[var(--egvox-text-primary)]">
                  {newSrvRole === 'Video Contributor'
                    ? isId
                      ? 'Portfolio Preview Video (30–60 detik, Berizin & Watermarked)'
                      : 'Consented Video Portfolio Preview (30–60s, Watermarked)'
                    : newSrvRole === 'Data Annotator'
                    ? isId
                      ? 'Sampel Output Anotasi Teranonimisasi (Berizin)'
                      : 'Consented Anonymized Annotation Sample'
                    : isId
                    ? 'Sampel Laporan Audit QA (Terredaksi)'
                    : 'Redacted QA Audit Report Sample'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={newSrvPortfolioTitle}
                    onChange={(e) => setNewSrvPortfolioTitle(e.target.value)}
                    placeholder={isId ? 'Judul sampel preview...' : 'Preview sample title...'}
                    className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5 text-xs"
                  />
                  <select
                    value={newSrvPortfolioThumb}
                    onChange={(e) => setNewSrvPortfolioThumb(e.target.value)}
                    className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5 text-xs"
                  >
                    <option value="/images/capture_cooking_pov_1795676769816.jpg">
                      {isId ? 'Thumbnail Domain Memasak / Dapur' : 'Cooking / Kitchen Domain Preview'}
                    </option>
                    <option value="/images/capture_manufacturing_pov_1795676770652.jpg">
                      {isId ? 'Thumbnail Domain Manufaktur / Perakitan' : 'Manufacturing / Assembly Preview'}
                    </option>
                    <option value="/images/capture_warehouse_pov_1795676771521.jpg">
                      {isId ? 'Thumbnail Domain Gudang / Logistik' : 'Warehouse / Logistics Preview'}
                    </option>
                    <option value="/images/capture_automotive_pov_1795676770764.jpg">
                      {isId ? 'Thumbnail Domain Otomotif' : 'Automotive POV Preview'}
                    </option>
                  </select>
                </div>
                <label className="flex items-start gap-2 text-[11px] text-[var(--egvox-text-secondary)]">
                  <input
                    type="checkbox"
                    checked={newSrvPortfolioConsent}
                    onChange={(e) => setNewSrvPortfolioConsent(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 accent-[#027F86]"
                  />
                  <span>
                    {isId
                      ? 'Sampel preview telah memiliki izin peserta, diberi watermark, dan bukan raw dataset komersial klien.'
                      : 'Sample preview has verified participant consent, watermark protection, and excludes private client raw data.'}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white hover:bg-[#039998] transition-colors"
              >
                {isId
                  ? `Terbitkan Profil ${newSrvRole} ke Katalog Rekrutmen`
                  : `Publish ${newSrvRole} Capability Profile`}
              </button>
            </form>
          </div>
        </div>
      )}

      {rfpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold">
                  {isId ? 'Permintaan RFP Enterprise Baru' : 'New Enterprise RFP Request'}
                </h3>
                <p className="text-[11px] text-[var(--egvox-text-muted)] mt-0.5">
                  {isId
                    ? 'Membuat permintaan resmi berstatus submitted untuk proses discovery dan proposal kontrak terkelola EgvoX.'
                    : 'Creates an official discovery request in submitted status for managed EgvoX contracting.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRfpOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!rfpCompany.trim() || !rfpSummary.trim() || rfpPhone.replace(/[^0-9+]/g, '').length < 8 || !rfpConsent) {
                  showToast(
                    isId
                      ? 'Mohon lengkapi nama perusahaan, nomor telepon PIC (min. 8 digit), ringkasan kebutuhan, dan persetujuan kontak.'
                      : 'Please complete company name, PIC phone (min. 8 digits), scope summary, and consent to contact.'
                  );
                  return;
                }
                submitEnterpriseInquiry({
                  companyName: rfpCompany.trim(),
                  country: rfpCountry,
                  website: rfpWebsite.trim() || undefined,
                  businessEmail: rfpEmail.trim(),
                  contactPerson: rfpPicName.trim() || activeOrg,
                  contactPhone: rfpPhone.trim(),
                  domainCategory: rfpDomain,
                  deliveryFormat: rfpDeliveryFormat,
                  targetDeadline: rfpDeadline.trim() || undefined,
                  estimatedVolume: rfpVolume,
                  requirementSummary: rfpSummary.trim(),
                  attachmentName: rfpAttachmentName || undefined,
                });
                setRfpOpen(false);
                setRfpSummary('');
                setRfpAttachmentName('');
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Nama Perusahaan *' : 'Company Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={rfpCompany}
                    onChange={(e) => setRfpCompany(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Negara *' : 'Country *'}
                  </label>
                  <select
                    value={rfpCountry}
                    onChange={(e) => setRfpCountry(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  >
                    <option value="Indonesia">Indonesia</option>
                    <option value="Singapore">{isId ? 'Singapura' : 'Singapore'}</option>
                    <option value="Japan">{isId ? 'Jepang' : 'Japan'}</option>
                    <option value="United States">{isId ? 'Amerika Serikat' : 'United States'}</option>
                    <option value="Germany">{isId ? 'Jerman' : 'Germany'}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Nama & Jabatan PIC *' : 'PIC Name & Role *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={rfpPicName}
                    onChange={(e) => setRfpPicName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Telepon / WhatsApp PIC *' : 'PIC Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={rfpPhone}
                    onChange={(e) => setRfpPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Email Bisnis *' : 'Business Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={rfpEmail}
                    onChange={(e) => setRfpEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Website Perusahaan' : 'Company Website'}
                  </label>
                  <input
                    type="text"
                    value={rfpWebsite}
                    onChange={(e) => setRfpWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Kategori Domain Data *' : 'Data Domain Category *'}
                  </label>
                  <select
                    value={rfpDomain}
                    onChange={(e) => setRfpDomain(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  >
                    {ACTIVITY_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.nameEn}>
                        {isId ? cat.nameId : cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Estimasi Volume (Jam Video) *' : 'Estimated Volume (Hours) *'}
                  </label>
                  <select
                    value={rfpVolume}
                    onChange={(e) => setRfpVolume(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  >
                    <option value="20 – 50 jam">{isId ? '20 – 50 jam' : '20 – 50 hours'}</option>
                    <option value="50 – 250 jam">{isId ? '50 – 250 jam' : '50 – 250 hours'}</option>
                    <option value="250 – 1.000 jam">{isId ? '250 – 1.000 jam' : '250 – 1,000 hours'}</option>
                    <option value="1.000+ jam">{isId ? '1.000+ jam' : '1,000+ hours'}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Format Delivery & Anotasi *' : 'Delivery & Annotation Format *'}
                  </label>
                  <select
                    value={rfpDeliveryFormat}
                    onChange={(e) => setRfpDeliveryFormat(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  >
                    <option value="MP4 + JSONL">MP4 + JSONL (Temporal & BBox)</option>
                    <option value="MP4 + COCO JSON">MP4 + COCO JSON</option>
                    <option value="MP4 + CSV">MP4 + CSV Manifest</option>
                    <option value="Raw MP4 + Rights Manifest">Raw MP4 + Rights Manifest Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Target Tenggat Waktu' : 'Target Timeline / Deadline'}
                  </label>
                  <input
                    type="text"
                    value={rfpDeadline}
                    onChange={(e) => setRfpDeadline(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  {isId ? 'Kebutuhan Data, Lokasi & Kepatuhan *' : 'Data, Location & Compliance Requirements *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={rfpSummary}
                  onChange={(e) => setRfpSummary(e.target.value)}
                  placeholder={isId ? 'Ringkasan spesifikasi kamera, lokasi perekaman, kebutuhan anotasi & keamanan...' : 'Specify capture specs, regions, annotation schema & security notes...'}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>
              <div className="rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
                    <FileUp className="h-3.5 w-3.5 text-[#027F86]" />
                    <span>
                      {isId
                        ? 'Upload Dokumen Penawaran / Brief (Opsional)'
                        : 'Upload Proposal / Brief Document (Optional)'}
                    </span>
                  </label>
                  {rfpAttachmentName && (
                    <button
                      type="button"
                      onClick={() => setRfpAttachmentName('')}
                      className="text-[10px] font-semibold text-[#C43D3D] hover:underline"
                    >
                      {isId ? 'Hapus' : 'Remove'}
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
                  onChange={(e) => setRfpAttachmentName(e.target.files?.[0]?.name || '')}
                  className="block w-full text-[11px] text-[var(--egvox-text-secondary)] file:mr-2.5 file:rounded-lg file:border-0 file:bg-[#027F86]/12 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-[#027F86]"
                />
                {rfpAttachmentName && (
                  <p className="text-[10px] font-mono text-[#027F86]">
                    {isId ? 'Terlampir:' : 'Attached:'} {rfpAttachmentName}
                  </p>
                )}
              </div>
              <label className="flex items-start gap-2 text-[11px] text-[var(--egvox-text-secondary)]">
                <input
                  type="checkbox"
                  checked={rfpConsent}
                  onChange={(e) => setRfpConsent(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-[#027F86]"
                />
                <span>
                  {isId
                    ? 'Saya menyetujui tim EgvoX menghubungi organisasi saya untuk proses kualifikasi RFP.'
                    : 'I consent to EgvoX contacting my organization to qualify this RFP request.'}
                </span>
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#FC840E] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Kirim Permintaan RFP' : 'Submit Enterprise RFP'}
              </button>
            </form>
          </div>
        </div>
      )}

      {kycOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Unggah Dokumen KYC' : 'Upload KYC Verification Document'}
              </h3>
              <button
                type="button"
                onClick={() => setKycOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitKyc(kycDocType);
                setKycOpen(false);
              }}
              className="space-y-3"
            >
              <select
                value={kycDocType}
                onChange={(e) => setKycDocType(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              >
                <option value="KTP / National ID">
                  {isId ? 'KTP / Identitas Nasional' : 'National ID / KTP'}
                </option>
                <option value="Passport">{isId ? 'Paspor' : 'Passport'}</option>
                <option value="NIB / Company Akta">
                  {isId ? 'NIB / Akta Perusahaan' : 'NIB / Company Registration'}
                </option>
              </select>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Kirim Dokumen Verifikasi' : 'Submit Verification Document'}
              </button>
            </form>
          </div>
        </div>
      )}

      {orgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Ganti Organisasi Aktif' : 'Switch Active Organization'}
              </h3>
              <button
                type="button"
                onClick={() => setOrgModalOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {['PT Data Visual Indonesia', 'PT Nusantara Riset Teknologi', 'EgvoX Enterprise Pilot'].map(
                (org) => (
                  <button
                    key={org}
                    type="button"
                    onClick={() => {
                      setActiveOrg(org);
                      setOrgModalOpen(false);
                      showToast(
                        isId ? `Beralih ke organisasi ${org}.` : `Switched active org to ${org}.`
                      );
                    }}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-semibold ${
                      activeOrg === org
                        ? 'border-[#027F86] bg-[#027F86]/10 text-[#027F86]'
                        : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-subtle)]'
                    }`}
                  >
                    <span>{org}</span>
                    {activeOrg === org && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MilestoneFundingChangeModal: React.FC<{
  order: ActiveWorkOrder | null;
  onClose: () => void;
}> = ({ order, onClose }) => {
  const { locale, recordMilestoneFunding } = useAppState();
  const isId = locale === 'id';
  const [actionMode, setActionMode] = useState<'milestone' | 'change'>('milestone');
  const [amount, setAmount] = useState('5250000');
  const [note, setNote] = useState(
    isId
      ? 'Pendanaan Milestone Tahap 2 (Batch Produksi Final)'
      : 'Milestone Phase 2 Funding (Final Production Batch)'
  );

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono text-[#027F86]">{order.code}</p>
            <h3 className="text-base font-bold">
              {isId ? 'Pendanaan Milestone & Change Request' : 'Milestone Funding & Change Request'}
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

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setActionMode('milestone');
              setNote(
                isId
                  ? 'Pendanaan Milestone Tahap 2 (Batch Produksi Final)'
                  : 'Milestone Phase 2 Funding (Final Production Batch)'
              );
            }}
            className={`rounded-xl py-2 font-semibold ${
              actionMode === 'milestone'
                ? 'bg-[#027F86] text-white'
                : 'border border-[var(--egvox-border-default)]'
            }`}
          >
            {isId ? 'Pendanaan Milestone' : 'Fund Milestone'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActionMode('change');
              setNote(
                isId
                  ? 'Change Request: Penambahan volume +15 jam & revisi spec v2.2'
                  : 'Change Request: +15 hours volume expansion & spec v2.2 update'
              );
            }}
            className={`rounded-xl py-2 font-semibold ${
              actionMode === 'change'
                ? 'bg-[#FC840E] text-white'
                : 'border border-[var(--egvox-border-default)]'
            }`}
          >
            Change Request
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            recordMilestoneFunding(order.code, note, Number(amount) || 5250000);
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Nominal Reservasi Dana Ledger Milestone (IDR)' : 'Milestone Ledger Fund Reservation (IDR)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 font-bold tabular-nums"
            />
            <p className="mt-1 text-[11px] text-[#027F86] font-semibold tabular-nums">
              {egvoxFormatIDR(Number(amount) || 0)} ({egvoxFormatUSD(Number(amount) || 0)} USD)
            </p>
          </div>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[#027F86] py-2.5 font-semibold text-white"
          >
            {actionMode === 'milestone'
              ? isId
                ? 'Konfirmasi Reservasi Dana Terotorisasi'
                : 'Confirm Authorized Fund Reservation'
              : isId
              ? 'Kirim Change Request Resmi'
              : 'Submit Scope Change Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const EnterpriseSampleInspectionModal: React.FC<{
  pkg: OpsDeliveryPackage | null;
  onClose: () => void;
}> = ({ pkg, onClose }) => {
  const { locale, acceptEnterpriseDelivery } = useAppState();
  const isId = locale === 'id';

  if (!pkg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono text-[#027F86]">
              {pkg.packageCode} · {pkg.version}
            </p>
            <h3 className="text-base font-bold">
              {isId ? 'Inspeksi Sampel & Penerimaan Enterprise' : 'Enterprise Sample Inspection & Acceptance'}
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

        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-black">
          <img
            src="/images/capture_warehouse_pov_1795676771521.jpg"
            alt={isId ? pkg.titleId : pkg.titleEn}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <span className="absolute top-2.5 left-2.5 rounded bg-black/75 px-2.5 py-1 text-[10px] font-mono font-bold text-white">
            {isId
              ? 'PRATINJAU SAMPEL BERIZIN ENTERPRISE · WATERMARK'
              : 'ENTERPRISE CONSENTED SAMPLE PREVIEW · WATERMARKED'}
          </span>
        </div>

        <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5 text-xs space-y-1.5 tabular-nums">
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">
              {isId ? 'Total File / Ukuran' : 'Total Files / Size'}
            </span>
            <span className="font-bold">
              {pkg.totalFiles.toLocaleString()} {isId ? 'file' : 'files'} · {pkg.totalSizeGb} GB
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">
              {isId ? 'Format & Gerbang QA' : 'Format & QA Gate'}
            </span>
            <span className="font-bold text-[#16835D]">
              {pkg.exportFormat} · {isId ? '7/7 QA Lulus' : '7/7 QA Passed'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">
              {isId ? 'Manifest Hak Data' : 'Rights Manifest'}
            </span>
            <span className="font-bold text-[#16835D]">
              {isId ? 'Lisensi Komersial Terkunci' : 'Commercial License Locked'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              acceptEnterpriseDelivery(pkg.id, 'revision');
              onClose();
            }}
            className="rounded-xl border border-[#FC840E] py-2.5 font-semibold text-[#FC840E]"
          >
            {isId ? 'Minta Revisi Sampel' : 'Request Sample Revision'}
          </button>
          <button
            type="button"
            onClick={() => {
              acceptEnterpriseDelivery(pkg.id, 'accepted');
              onClose();
            }}
            className="rounded-xl bg-[#16835D] py-2.5 font-semibold text-white"
          >
            {isId ? 'Terima Paket & Manifest' : 'Accept Package & Manifest'}
          </button>
        </div>
      </div>
    </div>
  );
};
