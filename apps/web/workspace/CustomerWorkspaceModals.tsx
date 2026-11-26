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
  const [newPrjLocation, setNewPrjLocation] = useState('Indonesia');
  const [newPrjSummary, setNewPrjSummary] = useState('');
  const [newPrjPerspective, setNewPrjPerspective] =
    useState<CaptureSpecification['perspective']>('Egocentric (First-Person)');
  const [newPrjMounting, setNewPrjMounting] =
    useState<CaptureSpecification['mounting']>('Head-mounted');
  const [newPrjResolution, setNewPrjResolution] = useState('Minimum 1080p');
  const [newPrjFps, setNewPrjFps] = useState('30–60 FPS');
  const [newPrjAnnotation, setNewPrjAnnotation] =
    useState<ProjectListing['annotationRequired']>('none');

  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvRole, setNewSrvRole] =
    useState<FreelancerServiceListing['roleType']>('Video Contributor');
  const [newSrvCapacity, setNewSrvCapacity] = useState(
    isId ? '± 20 jam / minggu' : '± 20 hours / week'
  );
  const [newSrvEquipment, setNewSrvEquipment] = useState('Action Cam 4K + Chest/Head Mount');
  const [newSrvConflictDeclared, setNewSrvConflictDeclared] = useState(true);
  const [newSrvLocation, setNewSrvLocation] = useState('Jakarta, Indonesia');
  const [newSrvDesc, setNewSrvDesc] = useState('');

  const [rfpCompany, setRfpCompany] = useState('PT Nusantara Riset Teknologi');
  const [rfpPicName, setRfpPicName] = useState('Budi Santoso (Head of AI Data)');
  const [rfpPhone, setRfpPhone] = useState('+62 812-8890-1122');
  const [rfpEmail, setRfpEmail] = useState('procurement@company.com');
  const [rfpVolume, setRfpVolume] = useState('50 – 250 jam');
  const [rfpSummary, setRfpSummary] = useState('');
  const [rfpAttachmentName, setRfpAttachmentName] = useState('');

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
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Buat Project Kebutuhan Dataset Baru' : 'Publish New Dataset Project'}
              </h3>
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
                createVendorProject({
                  title: newPrjTitle.trim(),
                  category: newPrjCat,
                  dataType: newPrjType,
                  targetVolume: Math.max(10, Number(newPrjHours) || 50),
                  ratePerUnit: Math.max(50000, Number(newPrjRate) || 175000),
                  showBudgetDisclosure: newPrjShowBudget,
                  location: newPrjLocation.trim() || 'Indonesia',
                  summary: newPrjSummary.trim(),
                  perspective: newPrjPerspective,
                  mounting: newPrjMounting,
                  resolution: newPrjResolution,
                  frameRate: newPrjFps,
                  annotationRequired: newPrjAnnotation,
                });
                setCreateProjectOpen(false);
                setNewPrjTitle('');
                setNewPrjSummary('');
              }}
              className="space-y-3"
            >
              <input
                type="text"
                required
                value={newPrjTitle}
                onChange={(e) => setNewPrjTitle(e.target.value)}
                placeholder={isId ? 'Judul Project Dataset...' : 'Dataset Project Title...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newPrjCat}
                  onChange={(e) => setNewPrjCat(e.target.value as ActivityCategorySlug)}
                  className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                >
                  <option value="cooking">{isId ? 'Memasak & Dapur' : 'Cooking'}</option>
                  <option value="manufacturing">{isId ? 'Manufaktur' : 'Manufacturing'}</option>
                  <option value="automotive">{isId ? 'Otomotif' : 'Automotive'}</option>
                  <option value="warehouse">{isId ? 'Gudang & Logistik' : 'Warehouse'}</option>
                </select>
                <select
                  value={newPrjType}
                  onChange={(e) => setNewPrjType(e.target.value as DataModality)}
                  className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                >
                  <option value="Video">Video</option>
                  <option value="Gambar">{isId ? 'Gambar' : 'Image'}</option>
                  <option value="Multimodal">Multimodal</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="number"
                  value={newPrjHours}
                  onChange={(e) => setNewPrjHours(e.target.value)}
                  placeholder={isId ? 'Target Volume (jam)' : 'Target Volume (hours)'}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs tabular-nums"
                />
                <input
                  type="number"
                  value={newPrjRate}
                  onChange={(e) => setNewPrjRate(e.target.value)}
                  placeholder={isId ? 'Tarif per jam (IDR)' : 'Hourly rate (IDR)'}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-semibold tabular-nums"
                />
              </div>

              {/* Capture Specification & Optional Annotation Selector (PRD §5 & §28) */}
              <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 space-y-2.5">
                <p className="text-[11px] font-bold text-[#027F86]">
                  {isId ? 'Spesifikasi Pengambilan & Opsi Anotasi' : 'Capture Specification & Annotation Option'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <select
                    value={newPrjPerspective}
                    onChange={(e) =>
                      setNewPrjPerspective(e.target.value as CaptureSpecification['perspective'])
                    }
                    className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5"
                  >
                    <option value="Egocentric (First-Person)">Egocentric (First-Person)</option>
                    <option value="Multi-Angle + Egocentric">Multi-Angle + Egocentric</option>
                  </select>
                  <select
                    value={newPrjMounting}
                    onChange={(e) =>
                      setNewPrjMounting(e.target.value as CaptureSpecification['mounting'])
                    }
                    className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5"
                  >
                    <option value="Head-mounted">Head-mounted</option>
                    <option value="Chest-mounted">Chest-mounted</option>
                    <option value="Wearable Glasses">Wearable Glasses</option>
                    <option value="Handheld">Handheld</option>
                  </select>
                  <select
                    value={newPrjResolution}
                    onChange={(e) => setNewPrjResolution(e.target.value)}
                    className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5"
                  >
                    <option value="Minimum 1080p">1080p (min)</option>
                    <option value="4K UHD">4K UHD (2160p)</option>
                  </select>
                  <select
                    value={newPrjFps}
                    onChange={(e) => setNewPrjFps(e.target.value)}
                    className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5"
                  >
                    <option value="30–60 FPS">30–60 FPS</option>
                    <option value="60 FPS Locked">60 FPS Locked</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setNewPrjAnnotation('none')}
                    className={`rounded-lg border px-2.5 py-2 font-semibold text-left ${
                      newPrjAnnotation === 'none'
                        ? 'border-[#027F86] bg-[#027F86]/10 text-[#027F86]'
                        : 'border-[var(--egvox-border-default)]'
                    }`}
                  >
                    {isId ? 'Raw Video Only (Tanpa Anotasi)' : 'Raw Video Only (No Annotation)'}
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
                    {isId ? '+ Anotasi Freelancer (Opsional)' : '+ Freelancer Annotation (Optional)'}
                  </button>
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
              <input
                type="text"
                value={newPrjLocation}
                onChange={(e) => setNewPrjLocation(e.target.value)}
                placeholder={isId ? 'Lokasi pengambilan data' : 'Capture location'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <textarea
                rows={3}
                required
                value={newPrjSummary}
                onChange={(e) => setNewPrjSummary(e.target.value)}
                placeholder={isId ? 'Ringkasan kebutuhan dan panduan capture...' : 'Project summary and capture brief...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
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
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {isId ? 'Buat Profil Kapabilitas Freelancer' : 'Create Freelancer Capability Profile'}
                </h3>
                <p className="text-[11px] text-[var(--egvox-text-muted)] mt-0.5">
                  {isId
                    ? 'Tampilkan spesialisasi, perangkat, kapasitas & portfolio — kompensasi dibahas privat via penawaran rekrutmen.'
                    : 'Showcase skills, gear, capacity & portfolio — compensation is negotiated privately via recruitment offers.'}
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
                createFreelancerService({
                  title: newSrvTitle.trim(),
                  roleType: newSrvRole,
                  location: newSrvLocation.trim() || 'Indonesia',
                  description: newSrvDesc.trim(),
                  capacityLabel:
                    newSrvCapacity.trim() ||
                    (isId ? '± 20 jam / minggu' : '± 20 hours / week'),
                  equipmentSummary: newSrvEquipment.trim(),
                  conflictDisclosureDeclared:
                    newSrvRole === 'QA Specialist' ? newSrvConflictDeclared : undefined,
                });
                setCreateServiceOpen(false);
                setNewSrvTitle('');
                setNewSrvDesc('');
              }}
              className="space-y-3"
            >
              <input
                type="text"
                required
                value={newSrvTitle}
                onChange={(e) => setNewSrvTitle(e.target.value)}
                placeholder={isId ? 'Judul Spesialisasi / Kapabilitas...' : 'Capability / Specialization Title...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newSrvRole}
                  onChange={(e) =>
                    setNewSrvRole(e.target.value as FreelancerServiceListing['roleType'])
                  }
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                >
                  <option value="Video Contributor">Video Contributor</option>
                  <option value="Data Annotator">Data Annotator</option>
                  <option value="QA Specialist">QA Specialist</option>
                </select>
                <input
                  type="text"
                  value={newSrvCapacity}
                  onChange={(e) => setNewSrvCapacity(e.target.value)}
                  placeholder={isId ? 'Kapasitas (mis. ± 20 jam / minggu)' : 'Capacity (e.g. ± 20 hours / week)'}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-semibold"
                />
              </div>
              <input
                type="text"
                value={newSrvEquipment}
                onChange={(e) => setNewSrvEquipment(e.target.value)}
                placeholder={isId ? 'Perangkat & Setup (Action Cam / Tools Anotasi)' : 'Equipment & Tools'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              {newSrvRole === 'QA Specialist' && (
                <label className="flex items-start gap-2 rounded-xl border border-[#16835D]/30 bg-[#16835D]/8 px-3 py-2.5 text-[11px] text-[var(--egvox-text-secondary)]">
                  <input
                    type="checkbox"
                    required
                    checked={newSrvConflictDeclared}
                    onChange={(e) => setNewSrvConflictDeclared(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 accent-[#16835D]"
                  />
                  <span>
                    {isId
                      ? 'Deklarasi Anti-Konflik Kepentingan: Saya tidak akan mengaudit rekaman atau anotasi milik sendiri maupun tim produksi afiliasi.'
                      : 'Anti-Conflict Declaration: I will never audit own recordings, annotations, or affiliated capture outputs.'}
                  </span>
                </label>
              )}
              <input
                type="text"
                value={newSrvLocation}
                onChange={(e) => setNewSrvLocation(e.target.value)}
                placeholder={isId ? 'Kota / Area Operasional' : 'City / Operating Region'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <textarea
                rows={3}
                required
                value={newSrvDesc}
                onChange={(e) => setNewSrvDesc(e.target.value)}
                placeholder={isId ? 'Deskripsi keahlian teknis, perangkat, pengalaman, dan SLA...' : 'Describe technical skills, equipment, and SLA...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Terbitkan Profil Kapabilitas ke Katalog Rekrutmen' : 'Publish Capability Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      {rfpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Permintaan RFP Enterprise Baru' : 'New Enterprise RFP Request'}
              </h3>
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
                if (!rfpCompany.trim() || !rfpSummary.trim() || rfpPhone.replace(/[^0-9+]/g, '').length < 8) {
                  showToast(
                    isId
                      ? 'Mohon lengkapi nama perusahaan, nomor telepon PIC (min. 8 digit), dan ringkasan kebutuhan.'
                      : 'Please complete company name, PIC phone (min. 8 digits), and scope summary.'
                  );
                  return;
                }
                submitEnterpriseInquiry({
                  companyName: rfpCompany.trim(),
                  country: 'Indonesia',
                  businessEmail: rfpEmail.trim(),
                  contactPerson: rfpPicName.trim() || activeOrg,
                  contactPhone: rfpPhone.trim(),
                  estimatedVolume: rfpVolume,
                  requirementSummary: rfpSummary.trim(),
                  attachmentName: rfpAttachmentName || undefined,
                });
                setRfpOpen(false);
                setRfpSummary('');
                setRfpAttachmentName('');
              }}
              className="space-y-3"
            >
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
              <select
                value={rfpVolume}
                onChange={(e) => setRfpVolume(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              >
                <option value="50 – 250 jam">{isId ? '50 – 250 jam' : '50 – 250 hours'}</option>
                <option value="250 – 1.000 jam">{isId ? '250 – 1.000 jam' : '250 – 1,000 hours'}</option>
                <option value="1.000+ jam">{isId ? '1.000+ jam' : '1,000+ hours'}</option>
              </select>
              <textarea
                rows={3}
                required
                value={rfpSummary}
                onChange={(e) => setRfpSummary(e.target.value)}
                placeholder={isId ? 'Ringkasan kebutuhan dataset enterprise...' : 'Enterprise dataset scope summary...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
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
