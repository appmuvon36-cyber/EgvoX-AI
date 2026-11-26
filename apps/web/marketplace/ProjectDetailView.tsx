'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Flag,
  Heart,
  HelpCircle,
  Lock,
  MapPin,
  Play,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { DualPrice, Modal, egvoxFormatIDR, egvoxFormatUSD } from '@/packages/design-system';
import { ProjectListing, StructuredClarification } from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';

export const ProjectDetailView: React.FC<{ project: ProjectListing }> = ({
  project,
}) => {
  const {
    locale,
    savedSlugs,
    toggleSaved,
    openProposalModal,
    openReportModal,
    submitClarification,
  } = useAppState();
  const isId = locale === 'id';
  const [activeTab, setActiveTab] = useState<'summary' | 'spec' | 'terms' | 'faq'>('summary');
  const [clarifyModalOpen, setClarifyModalOpen] = useState(false);
  const [clarifyTopic, setClarifyTopic] = useState<StructuredClarification['topic']>('spec');
  const [clarifyQuestion, setClarifyQuestion] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const isSaved = savedSlugs.includes(project.slug);
  const title = isId ? project.title : project.titleEn;
  const summary = isId ? project.summary : project.summaryEn;
  const unit = isId ? project.unitLabel : project.unitLabelEn || 'hour';
  const loc = isId ? project.location : project.locationEn || project.location;
  const deadline = isId ? project.deadline : project.deadlineEn || project.deadline;
  const appClose = isId
    ? project.applicationCloseDate
    : project.applicationCloseDateEn || project.applicationCloseDate;
  const criteria = isId ? project.acceptanceCriteria : project.acceptanceCriteriaEn;
  const rightsSummary = isId ? project.rightsSummary : project.rightsSummaryEn;
  const faqList = isId ? project.faq : project.faqEn || project.faq;

  const handleSendClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarifyQuestion.trim()) return;
    submitClarification(
      `PRJ-${project.id.toUpperCase()}`,
      title,
      clarifyTopic,
      clarifyQuestion.trim(),
      'freelancer'
    );
    setClarifyModalOpen(false);
    setClarifyQuestion('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/marketplace/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--egvox-text-secondary)] hover:text-[#027F86]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isId ? 'Kembali ke Katalog Project' : 'Back to Project Catalog'}</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openReportModal({ type: 'project', slug: project.slug, title })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--egvox-text-secondary)] hover:text-[#C43D3D]"
          >
            <Flag className="h-3.5 w-3.5" />
            <span>{isId ? 'Laporkan' : 'Report'}</span>
          </button>
          <button
            type="button"
            onClick={() => toggleSaved(project.slug, title)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-1.5 text-xs font-semibold"
          >
            <Heart
              className={`h-4 w-4 ${
                isSaved ? 'fill-[#FC840E] text-[#FC840E]' : ''
              }`}
            />
            <span>
              {isSaved ? (isId ? 'Tersimpan' : 'Saved') : isId ? 'Simpan' : 'Save'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
        {/* Left Main Detail */}
        <div className="lg:col-span-8 min-w-0 space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--egvox-border-default)] bg-[#102326] aspect-[16/9]">
            <img
              src={project.previewImage}
              alt={title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setIsPlayingPreview((v) => !v)}
              aria-label={isId ? 'Putar ilustrasi preview' : 'Play preview illustration'}
              className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition-colors"
            >
              <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/95 text-[#027F86] shadow-lg">
                <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current ml-0.5" />
              </span>
            </button>
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-1.5 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs text-white">
              <span className="font-mono tabular-nums">
                {isPlayingPreview
                  ? isId
                    ? 'Memutar Preview Ilustrasi...'
                    : 'Playing Sample Preview...'
                  : `0:00 / ${project.previewDuration}`}
              </span>
              <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] sm:text-[11px] leading-tight">
                {isId
                  ? 'Preview Ilustrasi · Raw Video Privat'
                  : 'Illustrative Preview · Private Raw Video'}
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--egvox-text-muted)]">
              <span>{isId ? project.categoryLabel : project.categoryLabelEn || project.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{project.captureType}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-[#16835D] font-semibold">
                <ShieldCheck className="h-4 w-4" />
                {isId ? 'Vendor Terverifikasi KYB' : 'KYB Verified Vendor'}
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--egvox-text-primary)]">
              {title}
            </h1>
          </div>

          {/* Detail Tabs */}
          <div className="border-b border-[var(--egvox-border-default)] flex gap-5 sm:gap-6 overflow-x-auto">
            {(
              [
                { id: 'summary', label: isId ? 'Ringkasan' : 'Overview' },
                {
                  id: 'spec',
                  label: isId
                    ? `Spesifikasi (${project.captureSpec.version})`
                    : `Specifications (${project.captureSpec.version})`,
                },
                {
                  id: 'terms',
                  label: isId ? 'Ketentuan & Milestones' : 'Terms & Milestones',
                },
                { id: 'faq', label: 'FAQ' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#027F86] text-[#027F86] dark:text-[#04B8B4]'
                    : 'border-transparent text-[var(--egvox-text-muted)] hover:text-[var(--egvox-text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'summary' && (
            <div className="space-y-6 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6">
              <div>
                <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
                  {isId ? 'Ringkasan Project' : 'Project Summary'}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--egvox-text-secondary)]">
                  {summary}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 border-t border-[var(--egvox-border-default)] pt-5 text-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#027F86]" />
                  <div>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {isId ? 'Lokasi' : 'Location'}
                    </p>
                    <p className="font-semibold text-[var(--egvox-text-primary)]">{loc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-[#027F86]" />
                  <div>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {isId ? 'Batas Waktu' : 'Deadline'}
                    </p>
                    <p className="font-semibold text-[var(--egvox-text-primary)] tabular-nums">
                      {deadline}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--egvox-border-default)] pt-5">
                <h3 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                  {isId
                    ? 'Acceptance Criteria (Syarat Penerimaan QA)'
                    : 'Acceptance Criteria (QA Pass Requirements)'}
                </h3>
                <ul className="mt-3 space-y-2">
                  {criteria.map((ac) => (
                    <li
                      key={ac}
                      className="flex items-start gap-2.5 text-sm text-[var(--egvox-text-secondary)]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16835D]" />
                      <span>{ac}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'spec' && (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
                  {isId ? 'Spesifikasi Capture Egocentric' : 'Egocentric Capture Specification'}
                </h2>
                <span className="font-mono text-xs font-semibold text-[#027F86] dark:text-[#04B8B4]">
                  {project.captureSpec.version}
                </span>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                {[
                  [
                    isId ? 'Perspektif' : 'Perspective',
                    isId
                      ? project.captureSpec.perspective === 'Egocentric (First-Person)'
                        ? 'Egocentric (Sudut Pandang Pertama)'
                        : 'Multi-Sudut + Egocentric'
                      : project.captureSpec.perspective,
                  ],
                  [
                    isId ? 'Pemasangan Kamera' : 'Camera Mounting',
                    isId
                      ? project.captureSpec.mounting === 'Head-mounted'
                        ? 'Dipasang di Kepala'
                        : project.captureSpec.mounting === 'Chest-mounted'
                        ? 'Dipasang di Dada'
                        : project.captureSpec.mounting === 'Wearable Glasses'
                        ? 'Kacamata Kamera'
                        : 'Genggam (Handheld)'
                      : project.captureSpec.mounting,
                  ],
                  [
                    isId ? 'Kebutuhan Perangkat' : 'Device Requirement',
                    isId
                      ? project.captureSpec.deviceRequirement
                      : project.captureSpec.deviceRequirementEn ||
                        project.captureSpec.deviceRequirement,
                  ],
                  [
                    isId ? 'Resolusi' : 'Resolution',
                    isId
                      ? project.captureSpec.resolution
                      : project.captureSpec.resolutionEn || project.captureSpec.resolution,
                  ],
                  [
                    'Frame Rate',
                    isId
                      ? project.captureSpec.frameRate
                      : project.captureSpec.frameRateEn || project.captureSpec.frameRate,
                  ],
                  ['Codec / Format', project.captureSpec.codecFormat],
                  [
                    isId ? 'Durasi Sesi' : 'Session Duration',
                    isId
                      ? project.captureSpec.clipDuration
                      : project.captureSpec.clipDurationEn || project.captureSpec.clipDuration,
                  ],
                  [
                    isId ? 'Kebijakan Audio' : 'Audio Policy',
                    isId
                      ? project.captureSpec.audioPolicy === 'Forbidden'
                        ? 'Dilarang'
                        : project.captureSpec.audioPolicy === 'Required'
                        ? 'Wajib'
                        : 'Opsional'
                      : project.captureSpec.audioPolicy,
                  ],
                  [
                    isId ? 'Stabilisasi' : 'Stabilization',
                    isId
                      ? project.captureSpec.stabilization
                      : project.captureSpec.stabilizationEn || project.captureSpec.stabilization,
                  ],
                  [
                    isId ? 'Kebijakan GPS / Lokasi' : 'GPS / Location Policy',
                    isId
                      ? project.captureSpec.gpsPolicy
                      : project.captureSpec.gpsPolicyEn || project.captureSpec.gpsPolicy,
                  ],
                  [
                    isId ? 'Persetujuan Peserta' : 'Participant Consent',
                    isId
                      ? project.captureSpec.consentPolicy
                      : project.captureSpec.consentPolicyEn || project.captureSpec.consentPolicy,
                  ],
                  [
                    isId ? 'Redaksi Privasi' : 'Privacy Redaction',
                    isId
                      ? project.captureSpec.privacyRedaction
                      : project.captureSpec.privacyRedactionEn || project.captureSpec.privacyRedaction,
                  ],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5"
                  >
                    <dt className="text-xs text-[var(--egvox-text-muted)]">{label}</dt>
                    <dd className="mt-1 font-medium text-[var(--egvox-text-primary)]">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
                  {isId ? 'Jadwal Milestone Work Order' : 'Work Order Milestone Schedule'}
                </h2>
                <div className="mt-3 space-y-3">
                  {project.milestones.map((ms) => (
                    <div
                      key={ms.step}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-4 py-3 text-sm"
                    >
                      <div>
                        <span className="font-semibold text-[var(--egvox-text-primary)]">
                          {isId ? `Tahap ${ms.step}:` : `Milestone ${ms.step}:`}{' '}
                          {isId ? ms.titleId : ms.titleEn}
                        </span>
                        <p className="text-xs text-[var(--egvox-text-muted)]">
                          Target: {isId ? ms.dueLabel : ms.dueLabelEn || ms.dueLabel}
                        </p>
                      </div>
                      <span className="font-bold text-[#027F86] tabular-nums">
                        {ms.sharePercent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[var(--egvox-border-default)] pt-4">
                <h3 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                  {isId ? 'Hak Data & Izin Penggunaan' : 'Data Rights & Permitted Use'}
                </h3>
                <p className="mt-1.5 text-sm text-[var(--egvox-text-secondary)]">
                  {rightsSummary}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
              {faqList.map((f) => (
                <div key={f.q} className="border-b border-[var(--egvox-border-default)] pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-bold text-[var(--egvox-text-primary)]">{f.q}</p>
                  <p className="mt-1 text-sm text-[var(--egvox-text-secondary)]">{f.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sticky Action Module */}
        <div className="lg:col-span-4 min-w-0">
          <div className="sticky top-20 space-y-5 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6">
            {project.showBudgetDisclosure !== false ? (
              <div>
                <p className="text-xs font-semibold text-[var(--egvox-text-muted)]">
                  {isId
                    ? 'Informasi Budget Proyek Vendor (Referensi Proyek — Bukan Tarif Publik Freelancer)'
                    : 'Vendor Project Budget Reference (Not Public Freelancer Pricing)'}
                </p>
                <div className="mt-1.5">
                  <DualPrice amountIDR={project.ratePerUnit} unitLabel={unit} size="lg" />
                </div>
                <p className="mt-2 text-xs text-[var(--egvox-text-secondary)] tabular-nums">
                  {isId ? 'Estimasi pagu proyek:' : 'Est. total project cap:'}{' '}
                  <strong>{egvoxFormatIDR(project.ratePerUnit * project.targetVolume)}</strong>{' '}
                  ({egvoxFormatUSD(project.ratePerUnit * project.targetVolume)} USD)
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-[#027F86]/8 p-3.5 text-xs space-y-1">
                <p className="font-bold text-[#027F86] inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  <span>
                    {isId ? 'Kompensasi via Penawaran Privat' : 'Compensation via Private Offer'}
                  </span>
                </p>
                <p className="text-[var(--egvox-text-secondary)]">
                  {isId
                    ? 'Vendor mengirimkan penawaran biaya secara privat setelah meninjau aplikasi kualifikasi Anda.'
                    : 'Vendor sends a private recruitment offer after reviewing your qualifications.'}
                </p>
              </div>
            )}

            <div className="space-y-2.5 border-y border-[var(--egvox-border-default)] py-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Target Volume' : 'Target Volume'}
                </span>
                <span className="font-semibold tabular-nums">
                  {project.targetVolume} {unit}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Batas Aplikasi' : 'Application Close'}
                </span>
                <span className="font-semibold tabular-nums">{appClose}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Anotasi' : 'Annotation'}
                </span>
                <span className="font-semibold sm:text-right">
                  {project.annotationRequired === 'optional'
                    ? isId
                      ? 'Opsional (Vendor punya tim internal)'
                      : 'Optional (Vendor has internal annotators)'
                    : project.annotationRequired === 'required'
                    ? isId
                      ? 'Termasuk dalam lingkup'
                      : 'Included in scope'
                    : isId
                    ? 'Hanya Video Mentah'
                    : 'Raw Video Only'}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => openProposalModal(project)}
                className="w-full rounded-xl bg-[#027F86] py-3 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
              >
                {isId ? 'Ajukan Minat & Kualifikasi' : 'Express Interest & Qualifications'}
              </button>
              <button
                type="button"
                onClick={() => setClarifyModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--egvox-border-default)] py-2.5 text-sm font-semibold text-[var(--egvox-text-primary)] hover:bg-[var(--egvox-bg-subtle)]"
              >
                <HelpCircle className="h-4 w-4 text-[#027F86]" />
                <span>
                  {isId ? 'Klarifikasi Spesifikasi Proyek' : 'Structured Project Clarification'}
                </span>
              </button>
            </div>

            {/* Vendor Card */}
            <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link
                  href={`/providers/${project.vendorSlug}`}
                  className="text-sm font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                >
                  {project.vendorName}
                </Link>
                <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
                  <Star className="h-3.5 w-3.5 fill-[#FDBA27] text-[#FDBA27]" />
                  {project.vendorRating} ({project.vendorReviewCount})
                </span>
              </div>
              <p className="mt-1 text-xs text-[var(--egvox-text-muted)]">
                {isId
                  ? `Dataset Vendor Terverifikasi KYB · ${project.country}`
                  : `KYB Verified Dataset Vendor · ${project.country}`}
              </p>
              <Link
                href={`/providers/${project.vendorSlug}`}
                className="mt-2.5 inline-block text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
              >
                {isId ? 'Lihat Profil Provider →' : 'View Provider Profile →'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Clarification Modal (Replaces Free Chat) */}
      <Modal
        open={clarifyModalOpen}
        onClose={() => setClarifyModalOpen(false)}
        title={
          isId
            ? `Klarifikasi Spesifikasi · ${project.vendorName}`
            : `Structured Clarification · ${project.vendorName}`
        }
        subtitle={
          isId
            ? 'Platform tidak menyediakan chat bebas. Pilih topik terstruktur terkait spesifikasi proyek.'
            : 'No free-form messaging. Submit a structured clarification tied to this project.'
        }
      >
        <form onSubmit={handleSendClarification} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              {isId ? 'Topik Klarifikasi' : 'Clarification Topic'}
            </label>
            <select
              value={clarifyTopic}
              onChange={(e) =>
                setClarifyTopic(e.target.value as StructuredClarification['topic'])
              }
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-semibold"
            >
              <option value="spec">
                {isId ? 'Spesifikasi Kamera, FPS & Resolusi' : 'Camera Rig, FPS & Resolution Spec'}
              </option>
              <option value="schedule">
                {isId ? 'Jadwal Pengambilan & Deadline Batch' : 'Capture Schedule & Batch Deadline'}
              </option>
              <option value="deliverables">
                {isId ? 'Acceptance Criteria & Format Output' : 'Acceptance Criteria & Deliverables'}
              </option>
            </select>
          </div>
          <textarea
            rows={4}
            required
            value={clarifyQuestion}
            onChange={(e) => setClarifyQuestion(e.target.value)}
            placeholder={
              isId
                ? 'Tulis pertanyaan teknis singkat mengenai spesifikasi proyek (tanpa negosiasi harga di luar sistem penawaran)...'
                : 'Ask a concise technical question on capture specs or deliverables...'
            }
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-sm focus:border-[#027F86] focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setClarifyModalOpen(false)}
              className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm"
            >
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#027F86] px-4 py-2 text-sm font-semibold text-white"
            >
              {isId ? 'Kirim Klarifikasi Terstruktur' : 'Submit Structured Clarification'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
