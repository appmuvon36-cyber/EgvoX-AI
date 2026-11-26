'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CreditCard,
  FileUp,
  Flag,
  Lock,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import {
  Modal,
  egvoxFormatIDR,
  egvoxFormatUSD,
} from '@/packages/design-system';
import {
  validateProposalForm,
  validateRecruitmentOfferForm,
} from '@/packages/validation-schemas';
import { PROJECT_LISTINGS } from '@/lib/catalog-data';
import { ReportListingTarget, useAppState } from '@/lib/hooks/useAppState';
import type {
  FreelancerServiceListing,
  Locale,
  ProjectListing,
  RecruitmentOffer,
  TopUpRecord,
} from '@/packages/shared-types';

const ProposalFormContent: React.FC<{
  project: ProjectListing;
  locale: Locale;
  onCancel: () => void;
  onSubmitProposal: (payload: {
    projectSlug: string;
    projectTitle: string;
    vendorName: string;
    volume: number;
    weeklyCapacityHours?: number;
    deviceSummary?: string;
    note: string;
    attachmentName?: string;
  }) => void;
}> = ({ project, locale, onCancel, onSubmitProposal }) => {
  const [volume, setVolume] = useState(Math.min(20, project.targetVolume));
  const [deviceSummary, setDeviceSummary] = useState(
    locale === 'id'
      ? project.captureSpec.deviceRequirement
      : project.captureSpec.deviceRequirementEn || project.captureSpec.deviceRequirement
  );
  const [note, setNote] = useState(
    project.annotationRequired === 'required'
      ? locale === 'id'
        ? 'Saya memiliki perangkat capture sesuai spesifikasi terbaru serta pengalaman anotasi terstandar dan siap memenuhi kriteria penerimaan.'
        : 'I operate compliant capture hardware and annotation workflows meeting all project acceptance criteria.'
      : locale === 'id'
      ? 'Saya memiliki perangkat sesuai spesifikasi capture terbaru dan siap memenuhi kriteria penerimaan.'
      : 'I operate compliant capture hardware and meet all project acceptance criteria.'
  );
  const [attachmentName, setAttachmentName] = useState('');
  const [specAck, setSpecAck] = useState(true);
  const [proposalError, setProposalError] = useState<string | null>(null);

  const unit =
    locale === 'id' ? project.unitLabel : project.unitLabelEn || 'hour';

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specAck) {
      setProposalError(
        locale === 'id'
          ? 'Anda wajib menyetujui versi Capture Specification proyek ini.'
          : 'You must acknowledge the Capture Specification version for this project.'
      );
      return;
    }
    const validation = validateProposalForm({ volume, deviceSummary, note }, locale);
    if (!validation.valid) {
      setProposalError(Object.values(validation.errors)[0]);
      return;
    }
    onSubmitProposal({
      projectSlug: project.slug,
      projectTitle: locale === 'id' ? project.title : project.titleEn,
      vendorName: project.vendorName,
      volume,
      weeklyCapacityHours: volume,
      deviceSummary,
      note,
      attachmentName: attachmentName || undefined,
    });
    onCancel();
  };

  return (
    <form onSubmit={handleProposalSubmit} className="space-y-4">
      <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 text-xs text-[var(--egvox-text-secondary)] space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{locale === 'id' ? 'Spesifikasi Acuan' : 'Specification Version'}</span>
          <span className="font-mono font-semibold text-[#027F86] dark:text-[#04B8B4]">
            {project.captureSpec.version} · {project.captureSpec.mounting} · {project.captureSpec.resolution}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{locale === 'id' ? 'Kebijakan Audio & Anotasi' : 'Audio & Annotation Scope'}</span>
          <span className="font-semibold text-[var(--egvox-text-primary)]">
            Audio: {project.captureSpec.audioPolicy} ·{' '}
            {project.annotationRequired === 'required'
              ? locale === 'id'
                ? 'Wajib Anotasi'
                : 'Annotation Included'
              : project.annotationRequired === 'optional'
              ? locale === 'id'
                ? 'Anotasi Opsional'
                : 'Annotation Optional'
              : locale === 'id'
              ? 'Raw Video Only'
              : 'Raw Video Only'}
          </span>
        </div>
        {project.showBudgetDisclosure && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              {locale === 'id'
                ? 'Info Budget Proyek Vendor (Referensi)'
                : 'Vendor Project Budget Info (Reference)'}
            </span>
            <span className="font-semibold text-[var(--egvox-text-primary)] tabular-nums">
              {egvoxFormatIDR(project.ratePerUnit)} ({egvoxFormatUSD(project.ratePerUnit)} USD) / {unit}
            </span>
          </div>
        )}
        <p className="text-[11px] text-[var(--egvox-text-muted)]">
          {locale === 'id'
            ? 'Pengajuan minat menilai kualifikasi teknis, kapasitas, dan perangkat Anda — tanpa public price bidding. Penawaran fee dikirim privat oleh Vendor.'
            : 'Applications are evaluated on technical qualification, capacity, and gear — without public price bidding.'}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="proposal-volume"
            className="block text-xs font-semibold text-[var(--egvox-text-primary)]"
          >
            {locale === 'id'
              ? `Kapasitas Kesiapan (${unit} / minggu)`
              : `Weekly Capacity (${unit} / week)`}
          </label>
          <input
            id="proposal-volume"
            type="number"
            min={1}
            max={project.targetVolume}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value) || 0)}
            className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2.5 text-sm tabular-nums focus:border-[#027F86] focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="proposal-device"
            className="block text-xs font-semibold text-[var(--egvox-text-primary)]"
          >
            {project.annotationRequired === 'required'
              ? locale === 'id'
                ? 'Perangkat Kamera & Tools Anotasi'
                : 'Camera Gear & Annotation Tools'
              : locale === 'id'
              ? 'Perangkat Kamera & Mounting'
              : 'Camera Gear & Mounting Rig'}
          </label>
          <input
            id="proposal-device"
            type="text"
            value={deviceSummary}
            onChange={(e) => setDeviceSummary(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="proposal-note"
          className="block text-xs font-semibold text-[var(--egvox-text-primary)]"
        >
          {locale === 'id'
            ? 'Ringkasan Kualifikasi & Kesiapan Acceptance Criteria'
            : 'Qualification & Acceptance Criteria Readiness'}
        </label>
        <textarea
          id="proposal-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            locale === 'id'
              ? 'Jelaskan pengalaman capture, mounting, pencahayaan, atau kesiapan acceptance criteria...'
              : 'Describe your capture setup, mounting, lighting, or QA acceptance readiness...'
          }
          className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
          {locale === 'id'
            ? 'Lampiran Sampel Berizin / Izin Lokasi (Opsional)'
            : 'Consented Sample / Site Permission (Optional)'}
        </label>
        <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-4 py-3 text-xs font-medium text-[var(--egvox-text-secondary)] hover:border-[#027F86]">
          <FileUp className="h-4 w-4 text-[#027F86]" />
          <span>
            {attachmentName ||
              (locale === 'id'
                ? 'Unggah File (PDF, DOC, JPG · Maks 10MB)'
                : 'Upload File (PDF, DOC, JPG · Max 10MB)')}
          </span>
          <input
            type="file"
            className="sr-only"
            onChange={(e) =>
              setAttachmentName(e.target.files?.[0]?.name || '')
            }
          />
        </label>
      </div>

      <label className="flex items-start gap-2.5 text-xs text-[var(--egvox-text-secondary)]">
        <input
          type="checkbox"
          checked={specAck}
          onChange={(e) => setSpecAck(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-[var(--egvox-border-default)] text-[#027F86]"
        />
        <span>
          {locale === 'id' ? (
            <>
              Saya telah membaca dan menyanggupi versi spesifikasi{' '}
              <strong>{project.captureSpec.version}</strong> serta ketentuan
              privasi/consent EgvoX.
            </>
          ) : (
            <>
              I have reviewed and commit to specification version{' '}
              <strong>{project.captureSpec.version}</strong> and EgvoX privacy/consent terms.
            </>
          )}
        </span>
      </label>

      {proposalError && (
        <p className="text-xs font-medium text-[#C43D3D]">{proposalError}</p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2.5 text-sm font-medium text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]"
        >
          {locale === 'id' ? 'Batal' : 'Cancel'}
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[#027F86] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
        >
          {locale === 'id' ? 'Ajukan Minat' : 'Express Interest'}
        </button>
      </div>
    </form>
  );
};

const RecruitFreelancerModalContent: React.FC<{
  freelancer: FreelancerServiceListing;
  locale: Locale;
  onClose: () => void;
  onOpenTopUp: () => void;
}> = ({ freelancer, locale, onClose, onOpenTopUp }) => {
  const {
    recruiterWallet,
    createRecruitmentOffer,
    customProjects,
  } = useAppState();
  const isId = locale === 'id';

  const defaultWorkType: RecruitmentOffer['workType'] =
    freelancer.roleType === 'Data Annotator'
      ? 'Data Annotation'
      : freelancer.roleType === 'QA Specialist'
      ? 'QA Specialist'
      : 'Video Capture';

  const allProjects = [...customProjects, ...PROJECT_LISTINGS];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(
    allProjects[0]?.slug || ''
  );
  const [workType, setWorkType] =
    useState<RecruitmentOffer['workType']>(defaultWorkType);
  const [volumeHours, setVolumeHours] = useState(50);
  const [deadline, setDeadline] = useState(isId ? '15 Des 2026' : 'Dec 15, 2026');
  const [acceptanceSummary, setAcceptanceSummary] = useState(
    workType === 'QA Specialist'
      ? isId
        ? 'Audit teknis, capture-spec, consent & redaksi PII 100% terdokumentasi.'
        : '100% documented technical, capture-spec, consent & PII redaction audit.'
      : isId
      ? 'Sesuai spesifikasi capture terbaru, checksum SHA-256 valid & bebas PII.'
      : 'Per latest capture specification, valid SHA-256 checksum & PII-free.'
  );
  const [conflictChecked, setConflictChecked] = useState(
    workType !== 'QA Specialist'
  );

  // Step 2
  const [bindingType, setBindingType] = useState<'binding' | 'screening'>(
    'binding'
  );
  const [grossFeeIDR, setGrossFeeIDR] = useState(10000000);

  // Step 3
  const [milestonesSummary, setMilestonesSummary] = useState(
    isId
      ? 'Milestone 1 (30% Pilot Batch) · Milestone 2 (70% Final QA Diterima)'
      : 'Milestone 1 (30% Pilot Batch) · Milestone 2 (70% Final QA Accepted)'
  );
  const [revisionsCount, setRevisionsCount] = useState(2);
  const [expiresAt, setExpiresAt] = useState(isId ? '30 Nov 2026' : 'Nov 30, 2026');
  const [offerNote, setOfferNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const selectedProject =
    allProjects.find((p) => p.slug === selectedProjectSlug) || allProjects[0];

  const adminFee = Math.round(grossFeeIDR * 0.08);
  const paymentFee = Math.round(grossFeeIDR * 0.015);
  const netFreelancer = Math.max(0, grossFeeIDR - adminFee - paymentFee);
  const isBinding = bindingType === 'binding';
  const needsConflictCheck =
    workType === 'QA Specialist' || freelancer.roleType === 'QA Specialist';

  const hasMinPolicy =
    recruiterWallet.settledBalanceIDR >= recruiterWallet.minPolicyIDR;
  const hasAvailableFunds =
    !isBinding || recruiterWallet.availableBalanceIDR >= grossFeeIDR;
  const canSendBinding =
    recruiterWallet.vendorKybVerified && hasMinPolicy && hasAvailableFunds;

  const handleNextStep1 = () => {
    setFormError(null);
    if (needsConflictCheck && !conflictChecked) {
      setFormError(
        isId
          ? 'Centang verifikasi anti konflik kepentingan untuk QA Specialist.'
          : 'Confirm the QA Specialist conflict-of-interest independence check.'
      );
      return;
    }
    if (volumeHours < 1 || !deadline.trim()) {
      setFormError(
        isId
          ? 'Lengkapi volume dan tenggat waktu pekerjaan.'
          : 'Please complete volume and target deadline.'
      );
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setFormError(null);
    if (isBinding && grossFeeIDR < 100000) {
      setFormError(
        isId
          ? 'Penawaran Fee (Gross) minimal Rp 100.000.'
          : 'Gross offer fee must be at least Rp 100,000.'
      );
      return;
    }
    setStep(3);
  };

  const handleSubmitOffer = (saveAsDraft: boolean) => {
    setFormError(null);
    const projectTitle = selectedProject
      ? isId
        ? selectedProject.title
        : selectedProject.titleEn
      : freelancer.title;

    const validation = validateRecruitmentOfferForm(
      {
        projectTitle,
        volumeHours,
        grossFeeIDR,
        bindingType,
        requiresConflictCheck: needsConflictCheck,
        conflictChecked,
        deadline,
      },
      locale
    );
    if (!validation.valid) {
      setFormError(Object.values(validation.errors)[0]);
      return;
    }

    const res = createRecruitmentOffer({
      freelancer,
      workType,
      projectTitle,
      projectSlug: selectedProject?.slug,
      volumeHours,
      specVersion: selectedProject?.captureSpec.version || 'SPEC-EGV-v1.3',
      deadline,
      grossFeeIDR: isBinding ? grossFeeIDR : 0,
      bindingType,
      milestonesSummary,
      revisionsCount,
      acceptanceSummary,
      expiresAt,
      saveAsDraft,
      conflictCheckPassed: needsConflictCheck ? conflictChecked : undefined,
      note: offerNote,
    });

    if (!res.ok) {
      setFormError(
        res.error || (isId ? 'Gagal mengirim penawaran.' : 'Failed to send offer.')
      );
      return;
    }
    setSubmittedCode(res.offerCode || 'VO-2026-NEW');
  };

  if (submittedCode) {
    return (
      <div className="py-4 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#16835D]/12 text-[#16835D]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <p className="text-xs font-mono font-bold text-[#027F86]">{submittedCode}</p>
          <h3 className="mt-1 text-lg font-bold text-[var(--egvox-text-primary)]">
            {isId ? 'Penawaran Rekrutmen Privat Tercatat' : 'Private Recruitment Offer Recorded'}
          </h3>
          <p className="mt-1 text-xs text-[var(--egvox-text-secondary)]">
            {isId
              ? `Penawaran hanya dapat dilihat oleh ${freelancer.freelancerName}. Pantau status dan versi negosiasi di Workspace.`
              : `This private offer is visible solely to ${freelancer.freelancerName}. Track negotiation versions inside Workspace.`}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5 pt-2">
          <Link
            href="/workspace?tab=offers"
            onClick={onClose}
            className="rounded-xl bg-[#027F86] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#039998]"
          >
            {isId ? 'Buka Recruitment Hub' : 'Open Recruitment Hub'}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--egvox-border-default)] px-4 py-2.5 text-xs font-semibold"
          >
            {isId ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stepper */}
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-2">
        {[
          { num: 1 as const, label: isId ? '1. Detail Pekerjaan' : '1. Job Scope' },
          { num: 2 as const, label: isId ? '2. Penawaran' : '2. Private Offer' },
          { num: 3 as const, label: isId ? '3. Kesepakatan' : '3. Agreement' },
        ].map((st) => (
          <button
            key={st.num}
            type="button"
            onClick={() => {
              if (st.num < step) setStep(st.num);
            }}
            className={`rounded-lg px-2.5 py-2 text-xs font-bold transition-colors ${
              step === st.num
                ? 'bg-[#027F86] text-white'
                : step > st.num
                ? 'bg-[#16835D]/12 text-[#16835D]'
                : 'text-[var(--egvox-text-muted)]'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Candidate header */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={freelancer.avatar}
            alt={freelancer.freelancerName}
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-full object-cover shrink-0 border border-[var(--egvox-border-default)]"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--egvox-text-primary)] truncate">
              {freelancer.freelancerName}
            </p>
            <p className="text-[11px] text-[#027F86] font-semibold">
              {freelancer.roleType} · {freelancer.rating.toFixed(1)} ({freelancer.completedOrders}{' '}
              {isId ? 'pekerjaan' : 'jobs'})
            </p>
          </div>
        </div>
        <span className="rounded-md bg-[#16835D]/12 px-2 py-1 text-[10px] font-bold text-[#16835D] shrink-0">
          {isId ? 'Penawaran Privat' : 'Private Offer'}
        </span>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-[var(--egvox-text-primary)]">
              {isId ? 'Pilih Proyek Terkait' : 'Select Linked Project'}
            </label>
            <select
              value={selectedProjectSlug}
              onChange={(e) => setSelectedProjectSlug(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
            >
              {allProjects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {isId ? p.title : p.titleEn} ({p.captureSpec.version})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[var(--egvox-text-primary)]">
                {isId ? 'Jenis Pekerjaan' : 'Work Type'}
              </label>
              <select
                value={workType}
                onChange={(e) =>
                  setWorkType(e.target.value as RecruitmentOffer['workType'])
                }
                className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
              >
                <option value="Video Capture">Video Capture</option>
                <option value="Data Annotation">Data Annotation</option>
                <option value="QA Specialist">QA Specialist</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[var(--egvox-text-primary)]">
                {isId ? 'Target Volume (Video / Jam)' : 'Target Volume (Units)'}
              </label>
              <input
                type="number"
                min={1}
                value={volumeHours}
                onChange={(e) => setVolumeHours(Number(e.target.value) || 1)}
                className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--egvox-text-primary)]">
                {isId ? 'Tenggat Waktu' : 'Deadline'}
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[var(--egvox-text-primary)]">
              {isId ? 'Kriteria Penerimaan (Acceptance Criteria)' : 'Objective Acceptance Criteria'}
            </label>
            <textarea
              rows={2}
              value={acceptanceSummary}
              onChange={(e) => setAcceptanceSummary(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
            />
          </div>

          {needsConflictCheck && (
            <label className="flex items-start gap-2.5 rounded-xl border border-[#FC840E]/40 bg-[#FC840E]/8 p-3 text-xs">
              <input
                type="checkbox"
                checked={conflictChecked}
                onChange={(e) => setConflictChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#027F86]"
              />
              <span>
                <strong>{isId ? 'Deklarasi Independensi QA Specialist:' : 'QA Independence Check:'}</strong>{' '}
                {isId
                  ? 'Kandidat tidak terlibat dalam perekaman atau anotasi batch yang akan diperiksa (bebas konflik kepentingan).'
                  : 'Candidate did not capture or annotate the assigned batch (zero conflict of interest).'}
              </span>
            </label>
          )}

          {formError && <p className="text-xs font-medium text-[#C43D3D]">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 font-semibold"
            >
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleNextStep1}
              className="rounded-lg bg-[#027F86] px-5 py-2 font-semibold text-white hover:bg-[#039998]"
            >
              {isId ? 'Lanjut Penawaran' : 'Next: Private Offer'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 space-y-2">
            <p className="font-bold text-[var(--egvox-text-primary)]">
              {isId
                ? 'Penawaran Rekrutmen (Private Offer)'
                : 'Private Recruitment Offer'}
            </p>
            <p className="text-[11px] text-[var(--egvox-text-muted)]">
              {isId
                ? 'Ajukan penawaran kepada freelancer terpilih. Penawaran ini bersifat privat dan hanya dapat dilihat oleh freelancer tersebut.'
                : 'Send a private offer directly to the selected freelancer. Pricing is never exposed publicly.'}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setBindingType('binding')}
                className={`rounded-lg border px-3 py-2 text-left font-semibold ${
                  bindingType === 'binding'
                    ? 'border-[#027F86] bg-[#027F86]/10 text-[#027F86] dark:text-[#04B8B4]'
                    : 'border-[var(--egvox-border-default)]'
                }`}
              >
                {isId ? 'Penawaran Mengikat (Reservasi)' : 'Binding Offer (Reserved)'}
              </button>
              <button
                type="button"
                onClick={() => setBindingType('screening')}
                className={`rounded-lg border px-3 py-2 text-left font-semibold ${
                  bindingType === 'screening'
                    ? 'border-[#027F86] bg-[#027F86]/10 text-[#027F86] dark:text-[#04B8B4]'
                    : 'border-[var(--egvox-border-default)]'
                }`}
              >
                {isId ? 'Undangan Screening (Non-Binding)' : 'Screening Invite (Non-Binding)'}
              </button>
            </div>
          </div>

          {isBinding && (
            <>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <label className="font-semibold text-[var(--egvox-text-primary)]">
                    {isId ? 'Penawaran Fee (Gross IDR)' : 'Gross Fee Offer (IDR)'}
                  </label>
                  <span className="text-[11px] text-[#027F86] font-mono tabular-nums">
                    ≈ {egvoxFormatUSD(grossFeeIDR)} USD
                  </span>
                </div>
                <input
                  type="number"
                  min={100000}
                  step={100000}
                  value={grossFeeIDR}
                  onChange={(e) => setGrossFeeIDR(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2.5 text-sm font-bold tabular-nums"
                />
              </div>

              {/* Fee Waterfall */}
              <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 space-y-2 tabular-nums">
                <div className="flex justify-between">
                  <span className="text-[var(--egvox-text-secondary)]">
                    {isId ? 'Penawaran Fee (Gross)' : 'Gross Fee Offer'}
                  </span>
                  <span className="font-semibold">{egvoxFormatIDR(grossFeeIDR)}</span>
                </div>
                <div className="flex justify-between text-[#C43D3D]">
                  <span>{isId ? 'Biaya Admin EgvoX (8%)' : 'EgvoX Admin Fee (8%)'}</span>
                  <span>- {egvoxFormatIDR(adminFee)}</span>
                </div>
                <div className="flex justify-between text-[#C43D3D]">
                  <span>{isId ? 'Biaya Pembayaran (±1,5%)' : 'Payment Fee (±1.5%)'}</span>
                  <span>- {egvoxFormatIDR(paymentFee)}</span>
                </div>
                <div className="border-t border-[var(--egvox-border-default)] pt-2 flex justify-between font-bold text-[#FC840E]">
                  <span>{isId ? 'Total Komitmen Rekruter' : 'Recruiter Commitment Total'}</span>
                  <span>{egvoxFormatIDR(grossFeeIDR)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#16835D]">
                  <span>
                    {isId ? 'Estimasi Pendapatan Bersih Freelancer' : 'Estimated Freelancer Net'}
                  </span>
                  <span>{egvoxFormatIDR(netFreelancer)}</span>
                </div>
              </div>

              {/* Recruiter Wallet & KYB Guard */}
              <div
                className={`rounded-xl border p-3.5 space-y-2 ${
                  canSendBinding
                    ? 'border-[#16835D]/35 bg-[#16835D]/8'
                    : 'border-[#C43D3D]/35 bg-[#C43D3D]/8'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold inline-flex items-center gap-1.5 text-[var(--egvox-text-primary)]">
                    <Wallet className="h-4 w-4 text-[#027F86]" />
                    {isId
                      ? 'Saldo Tersedia Rekruter (Settled Cleared)'
                      : 'Available Recruiter Balance (Settled)'}
                  </span>
                  <span className="font-bold tabular-nums text-sm">
                    {egvoxFormatIDR(recruiterWallet.availableBalanceIDR)}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--egvox-text-secondary)]">
                  {isId
                    ? 'Dana akan dicatat sebagai Reservasi Dana Terotorisasi Payment Provider setelah penawaran dikirim. Pencairan ke freelancer dilakukan bertahap sesuai milestone QA.'
                    : 'Funds are placed under Authorized Payment Provider Reservation once sent and disbursed per QA milestone.'}
                </p>
                {!canSendBinding && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-[#C43D3D] inline-flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {!hasMinPolicy
                        ? isId
                          ? 'Min. saldo Rp 5.000.000 belum terpenuhi.'
                          : 'Below Rp 5,000,000 policy minimum.'
                        : isId
                        ? 'Saldo tersedia kurang dari total komitmen.'
                        : 'Available balance below commitment total.'}
                    </span>
                    <button
                      type="button"
                      onClick={onOpenTopUp}
                      className="rounded-lg bg-[#027F86] px-3 py-1.5 text-[11px] font-semibold text-white"
                    >
                      {isId ? 'Top Up Saldo' : 'Top Up Balance'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {formError && <p className="text-xs font-medium text-[#C43D3D]">{formError}</p>}

          <div className="flex justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 font-semibold"
            >
              {isId ? 'Kembali' : 'Back'}
            </button>
            <button
              type="button"
              onClick={handleNextStep2}
              className="rounded-lg bg-[#027F86] px-5 py-2 font-semibold text-white hover:bg-[#039998]"
            >
              {isId ? 'Lanjut Kesepakatan' : 'Next: Agreement'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-[var(--egvox-text-primary)]">
              {isId ? 'Skema Milestone & Pembayaran' : 'Milestones & Disbursement'}
            </label>
            <input
              type="text"
              value={milestonesSummary}
              onChange={(e) => setMilestonesSummary(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[var(--egvox-text-primary)]">
                {isId ? 'Batas Revisi Maksimal' : 'Max Revisions'}
              </label>
              <input
                type="number"
                min={0}
                max={5}
                value={revisionsCount}
                onChange={(e) => setRevisionsCount(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--egvox-text-primary)]">
                {isId ? 'Batas Berlaku Penawaran' : 'Offer Expiry'}
              </label>
              <input
                type="text"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[var(--egvox-text-primary)]">
              {isId ? 'Catatan Terstruktur (Opsional)' : 'Structured Scope Note (Optional)'}
            </label>
            <textarea
              rows={2}
              value={offerNote}
              onChange={(e) => setOfferNote(e.target.value)}
              placeholder={
                isId
                  ? 'Tambahkan catatan SLA, hak lisensi, atau ketentuan pembatalan...'
                  : 'Add SLA notes, rights summary, or cancellation terms...'
              }
              className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
            />
          </div>

          <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-[11px] text-[var(--egvox-text-secondary)]">
            <p className="font-bold text-[var(--egvox-text-primary)]">
              {isId ? 'Ringkasan Hak, Privasi & Pembatalan' : 'Rights, Privacy & Cancellation Summary'}
            </p>
            <p className="mt-1">
              {isId
                ? 'Raw video dikirim eksklusif via sesi private upload SHA-256. Pembatalan sebelum submission melepaskan reservasi dana kembali ke Saldo Tersedia Rekruter.'
                : 'Raw footage uploads exclusively via private SHA-256 sessions. Pre-submission cancellation releases reserved funds back to Recruiter Available Balance.'}
            </p>
          </div>

          {formError && (
            <div className="rounded-lg bg-[#C43D3D]/10 px-3 py-2 text-xs font-medium text-[#C43D3D] flex items-center justify-between gap-2">
              <span>{formError}</span>
              {!canSendBinding && isBinding && (
                <button
                  type="button"
                  onClick={onOpenTopUp}
                  className="rounded bg-[#027F86] px-2.5 py-1 text-[11px] font-semibold text-white shrink-0"
                >
                  Top Up
                </button>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 font-semibold"
            >
              {isId ? 'Kembali' : 'Back'}
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSubmitOffer(true)}
                className="rounded-lg border border-[#027F86] px-4 py-2 font-semibold text-[#027F86] dark:text-[#04B8B4]"
              >
                {isId ? 'Simpan Draft' : 'Save Draft'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmitOffer(false)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#027F86] px-5 py-2 font-semibold text-white hover:bg-[#039998]"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>
                  {isBinding
                    ? isId
                      ? 'Kirim Penawaran & Reservasi'
                      : 'Send Offer & Reserve'
                    : isId
                    ? 'Kirim Undangan Screening'
                    : 'Send Screening Invite'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TopUpWalletModalContent: React.FC<{
  locale: Locale;
  onClose: () => void;
}> = ({ locale, onClose }) => {
  const { recruiterWallet, submitWalletTopUp } = useAppState();
  const isId = locale === 'id';
  const [amountIDR, setAmountIDR] = useState(10000000);
  const [method, setMethod] = useState<TopUpRecord['method']>('va');
  const [immediateSettle, setImmediateSettle] = useState(true);

  return (
    <div className="space-y-4 text-xs">
      <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[var(--egvox-text-muted)]">
            {isId ? 'Saldo Tersedia Saat Ini (Settled)' : 'Current Available Balance (Settled)'}
          </p>
          <p className="text-lg font-bold tabular-nums text-[#027F86] dark:text-[#04B8B4]">
            {egvoxFormatIDR(recruiterWallet.availableBalanceIDR)}
          </p>
        </div>
        <span className="rounded-md bg-[#16835D]/12 px-2.5 py-1 text-[10px] font-bold text-[#16835D]">
          {isId ? 'Min. Saldo Rp 5.000.000' : 'Min. Balance Rp 5,000,000'}
        </span>
      </div>

      <div>
        <label className="block font-semibold text-[var(--egvox-text-primary)] mb-1.5">
          {isId ? 'Nominal Top Up Saldo Rekruter (IDR)' : 'Top-Up Amount (IDR)'}
        </label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[5000000, 10000000, 25000000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmountIDR(preset)}
              className={`rounded-lg border py-2 font-bold tabular-nums ${
                amountIDR === preset
                  ? 'border-[#027F86] bg-[#027F86]/10 text-[#027F86] dark:text-[#04B8B4]'
                  : 'border-[var(--egvox-border-default)]'
              }`}
            >
              {egvoxFormatIDR(preset)}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={500000}
          step={500000}
          value={amountIDR}
          onChange={(e) => setAmountIDR(Number(e.target.value) || 0)}
          className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2.5 text-sm font-bold tabular-nums"
        />
      </div>

      <div className="space-y-1.5">
        <p className="font-semibold text-[var(--egvox-text-primary)]">
          {isId ? 'Channel Payment Provider (PSP Adapter)' : 'Payment Provider Channel'}
        </p>
        {(
          [
            {
              id: 'va',
              label: isId
                ? 'Virtual Account Korporat (BCA / Mandiri / BNI)'
                : 'Corporate Virtual Account (BCA / Mandiri / BNI)',
            },
            { id: 'qris', label: isId ? 'QRIS Instan' : 'Instant QRIS' },
            {
              id: 'ewallet',
              label: isId
                ? 'Transfer Bank / Corporate E-Wallet'
                : 'Bank Transfer / Corporate E-Wallet',
            },
            {
              id: 'card',
              label: isId
                ? 'Kartu Kredit / Debit Korporat'
                : 'Corporate Credit / Debit Card',
            },
          ] as const
        ).map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setMethod(ch.id)}
            className={`w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left font-medium ${
              method === ch.id
                ? 'border-[#027F86] bg-[#027F86]/8 text-[#027F86] dark:text-[#04B8B4]'
                : 'border-[var(--egvox-border-default)]'
            }`}
          >
            <span>{ch.label}</span>
            <CreditCard className="h-4 w-4" />
          </button>
        ))}
      </div>

      <label className="flex items-start gap-2 rounded-lg bg-[var(--egvox-bg-canvas)] p-2.5 text-[11px] text-[var(--egvox-text-secondary)]">
        <input
          type="checkbox"
          checked={immediateSettle}
          onChange={(e) => setImmediateSettle(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded text-[#027F86]"
        />
        <span>
          {isId
            ? 'Konfirmasi Webhook Settlement Instan (nonaktifkan untuk menguji status Pending Settlement yang belum dihitung sebagai dana tersedia).'
            : 'Simulate instant PSP webhook settlement (uncheck to test Pending Settlement exclusion).'}
        </span>
      </label>

      <div className="flex items-start gap-2 rounded-xl bg-[#027F86]/8 p-3 text-[11px] text-[var(--egvox-text-secondary)]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#027F86] mt-0.5" />
        <span>
          {isId
            ? 'Saldo Ledger Rekruter mencerminkan kapasitas pendanaan terotorisasi Payment Provider — bukan produk uang elektronik terpisah.'
            : 'Recruiter Ledger Balance tracks Payment Provider authorized funding capacity.'}
        </span>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 font-semibold"
        >
          {isId ? 'Batal' : 'Cancel'}
        </button>
        <button
          type="button"
          onClick={() => {
            submitWalletTopUp(amountIDR, method, immediateSettle);
            onClose();
          }}
          className="rounded-lg bg-[#027F86] px-5 py-2 font-semibold text-white hover:bg-[#039998]"
        >
          {isId ? 'Konfirmasi Top Up' : 'Confirm Top Up'}
        </button>
      </div>
    </div>
  );
};

const ReportListingFormContent: React.FC<{
  target: ReportListingTarget;
  locale: Locale;
  onCancel: () => void;
  onSubmitted: (reason: string) => void;
}> = ({ target, locale, onCancel, onSubmitted }) => {
  const [reason, setReason] = useState(
    locale === 'id'
      ? 'Indikasi pelanggaran privasi / PII'
      : 'Suspected privacy / PII violation'
  );
  const [detail, setDetail] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitted(reason);
        onCancel();
      }}
      className="space-y-4"
    >
      <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-xs">
        <p className="font-semibold text-[var(--egvox-text-primary)]">{target.title}</p>
        <p className="text-[var(--egvox-text-muted)]">
          {locale === 'id'
            ? 'Laporan dikirim langsung ke Trust & Safety Governance Queue.'
            : 'Reports are routed directly to the Trust & Safety Governance Queue.'}
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
          {locale === 'id' ? 'Alasan Pelaporan' : 'Report Reason'}
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
        >
          <option>
            {locale === 'id'
              ? 'Indikasi pelanggaran privasi / PII'
              : 'Suspected privacy / PII violation'}
          </option>
          <option>
            {locale === 'id'
              ? 'Pencantuman harga atau kontak di luar platform'
              : 'Prohibited public pricing or off-platform contact'}
          </option>
          <option>
            {locale === 'id'
              ? 'Aktivitas berisiko tinggi / tanpa izin lokasi'
              : 'High-risk activity / missing site consent'}
          </option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
          {locale === 'id' ? 'Detail Tambahan' : 'Additional Details'}
        </label>
        <textarea
          rows={3}
          required
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder={
            locale === 'id'
              ? 'Jelaskan bagian listing yang perlu ditinjau moderator...'
              : 'Describe the specific issue for moderator review...'
          }
          className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm"
        >
          {locale === 'id' ? 'Batal' : 'Cancel'}
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#C43D3D] px-4 py-2 text-sm font-semibold text-white"
        >
          <Flag className="h-4 w-4" />
          <span>{locale === 'id' ? 'Kirim Laporan' : 'Submit Report'}</span>
        </button>
      </div>
    </form>
  );
};

export const GlobalActionModals: React.FC = () => {
  const {
    locale,
    proposalModalProject,
    openProposalModal,
    submitProposal,
    recruitModalTarget,
    openRecruitModal,
    topUpModalOpen,
    setTopUpModalOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    notificationsModalOpen,
    setNotificationsModalOpen,
    reportListingModal,
    openReportModal,
    showToast,
  } = useAppState();

  return (
    <>
      {/* Modal 1: Ajukan Minat / Kualifikasi (Project Catalog - Tanpa Bidding Harga) */}
      <Modal
        open={!!proposalModalProject}
        onClose={() => openProposalModal(null)}
        title={
          locale === 'id'
            ? 'Ajukan Minat & Kualifikasi Proyek'
            : 'Express Interest & Qualification'
        }
        subtitle={
          proposalModalProject
            ? `${locale === 'id' ? proposalModalProject.title : proposalModalProject.titleEn} · ${proposalModalProject.captureSpec.version}`
            : undefined
        }
      >
        {proposalModalProject && (
          <ProposalFormContent
            key={`${proposalModalProject.slug}-${locale}`}
            project={proposalModalProject}
            locale={locale}
            onCancel={() => openProposalModal(null)}
            onSubmitProposal={submitProposal}
          />
        )}
      </Modal>

      {/* Modal 2: 3-Step Recruit Freelancer Modal */}
      <Modal
        open={!!recruitModalTarget}
        onClose={() => openRecruitModal(null)}
        title={
          locale === 'id'
            ? 'Rekrutmen Freelancer Terstruktur (Private Offer)'
            : 'Structured Freelancer Recruitment (Private Offer)'
        }
        subtitle={
          recruitModalTarget
            ? `${recruitModalTarget.freelancerName} · ${recruitModalTarget.roleType}`
            : undefined
        }
        maxWidthClass="max-w-xl"
      >
        {recruitModalTarget && (
          <RecruitFreelancerModalContent
            key={`${recruitModalTarget.id}-${locale}`}
            freelancer={recruitModalTarget}
            locale={locale}
            onClose={() => openRecruitModal(null)}
            onOpenTopUp={() => setTopUpModalOpen(true)}
          />
        )}
      </Modal>

      {/* Modal 3: Top Up Dompet Rekruter */}
      <Modal
        open={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        title={
          locale === 'id'
            ? 'Top Up Saldo Ledger Rekruter'
            : 'Top Up Recruiter Ledger Balance'
        }
        subtitle={
          locale === 'id'
            ? 'Pembayaran terotorisasi Payment Provider · Minimum kebijakan saldo Rp 5.000.000'
            : 'Payment Provider authorized settlement · Minimum balance policy Rp 5,000,000'
        }
        maxWidthClass="max-w-md"
      >
        <TopUpWalletModalContent
          locale={locale}
          onClose={() => setTopUpModalOpen(false)}
        />
      </Modal>

      {/* Modal 4: Notifications Center */}
      <Modal
        open={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        title={locale === 'id' ? 'Pusat Notifikasi EgvoX' : 'EgvoX Notification Center'}
        subtitle={
          locale === 'id'
            ? 'Pembaruan QA, penawaran rekrutmen privat, dan status delivery paket'
            : 'QA updates, private recruitment offers, and dataset package deliveries'
        }
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--egvox-text-muted)] inline-flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-[#027F86]" />
              {notifications.filter((n) => !n.read).length}{' '}
              {locale === 'id' ? 'belum dibaca' : 'unread'}
            </span>
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="font-semibold text-[#027F86] hover:underline"
            >
              {locale === 'id' ? 'Tandai Semua Dibaca' : 'Mark All Read'}
            </button>
          </div>

          <div className="divide-y divide-[var(--egvox-border-default)] rounded-xl border border-[var(--egvox-border-default)]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 transition-colors ${
                  n.read ? 'bg-transparent' : 'bg-[#027F86]/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={n.href}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setNotificationsModalOpen(false);
                    }}
                    className="text-sm font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                  >
                    {locale === 'id' ? n.titleId : n.titleEn}
                  </Link>
                  <span className="text-[11px] text-[var(--egvox-text-muted)] shrink-0">
                    {locale === 'id' ? n.timeLabel : n.timeLabelEn || n.timeLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--egvox-text-secondary)]">
                  {locale === 'id' ? n.bodyId : n.bodyEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal 5: Report Listing */}
      <Modal
        open={!!reportListingModal}
        onClose={() => openReportModal(null)}
        title={locale === 'id' ? 'Laporkan Listing' : 'Report Listing'}
        maxWidthClass="max-w-md"
      >
        {reportListingModal && (
          <ReportListingFormContent
            key={`${reportListingModal.slug}-${locale}`}
            target={reportListingModal}
            locale={locale}
            onCancel={() => openReportModal(null)}
            onSubmitted={(reason) =>
              showToast(
                locale === 'id'
                  ? `Laporan (${reason}) dikirim ke tim Trust & Safety.`
                  : `Report (${reason}) sent to Trust & Safety team.`
              )
            }
          />
        )}
      </Modal>
    </>
  );
};
