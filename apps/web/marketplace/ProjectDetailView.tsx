'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Flag,
  Heart,
  MapPin,
  MessageSquare,
  Play,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { DualPrice, Modal, egvoxFormatIDR, egvoxFormatUSD } from '@/packages/design-system';
import { ProjectListing } from '@/packages/shared-types';
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
    showToast,
  } = useAppState();
  const [activeTab, setActiveTab] = useState<'summary' | 'spec' | 'terms' | 'faq'>('summary');
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [askMessage, setAskMessage] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const isSaved = savedSlugs.includes(project.slug);
  const title = locale === 'id' ? project.title : project.titleEn;
  const summary = locale === 'id' ? project.summary : project.summaryEn;
  const unit = locale === 'id' ? project.unitLabel : project.unitLabelEn || 'hour';
  const loc = locale === 'id' ? project.location : project.locationEn || project.location;
  const deadline = locale === 'id' ? project.deadline : project.deadlineEn || project.deadline;
  const appClose =
    locale === 'id'
      ? project.applicationCloseDate
      : project.applicationCloseDateEn || project.applicationCloseDate;
  const criteria = locale === 'id' ? project.acceptanceCriteria : project.acceptanceCriteriaEn;
  const rightsSummary = locale === 'id' ? project.rightsSummary : project.rightsSummaryEn;
  const faqList =
    locale === 'id' ? project.faq : project.faqEn || project.faq;

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askMessage.trim()) return;
    setAskModalOpen(false);
    setAskMessage('');
    showToast(
      locale === 'id'
        ? `Pertanyaan Anda telah dikirim ke ${project.vendorName} via EgvoX Messaging.`
        : `Your question was sent to ${project.vendorName} via EgvoX Messaging.`
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/marketplace/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--egvox-text-secondary)] hover:text-[#027F86]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            {locale === 'id' ? 'Kembali ke Katalog Project' : 'Back to Project Catalog'}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              openReportModal({ type: 'project', slug: project.slug, title })
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--egvox-text-secondary)] hover:text-[#C43D3D]"
          >
            <Flag className="h-3.5 w-3.5" />
            <span>{locale === 'id' ? 'Laporkan' : 'Report'}</span>
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
              {isSaved
                ? locale === 'id'
                  ? 'Tersimpan'
                  : 'Saved'
                : locale === 'id'
                ? 'Simpan'
                : 'Save'}
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
              aria-label={locale === 'id' ? 'Putar ilustrasi preview' : 'Play preview illustration'}
              className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition-colors"
            >
              <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/95 text-[#027F86] shadow-lg">
                <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current ml-0.5" />
              </span>
            </button>
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-1.5 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs text-white">
              <span className="font-mono tabular-nums">
                {isPlayingPreview
                  ? locale === 'id'
                    ? 'Memutar Preview Ilustrasi...'
                    : 'Playing Sample Preview...'
                  : `0:00 / ${project.previewDuration}`}
              </span>
              <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] sm:text-[11px] leading-tight">
                {locale === 'id'
                  ? 'Preview Ilustrasi · Raw Video Privat'
                  : 'Illustrative Preview · Private Raw Video'}
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--egvox-text-muted)]">
              <span>{locale === 'id' ? project.categoryLabel : project.categoryLabelEn || project.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{project.captureType}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-[#16835D] font-semibold">
                <ShieldCheck className="h-4 w-4" />
                {locale === 'id' ? 'Vendor Terverifikasi' : 'Verified Vendor'}
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
                { id: 'summary', label: locale === 'id' ? 'Ringkasan' : 'Overview' },
                {
                  id: 'spec',
                  label:
                    locale === 'id'
                      ? `Spesifikasi (${project.captureSpec.version})`
                      : `Specifications (${project.captureSpec.version})`,
                },
                {
                  id: 'terms',
                  label: locale === 'id' ? 'Ketentuan & Milestones' : 'Terms & Milestones',
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
                  {locale === 'id' ? 'Ringkasan Project' : 'Project Summary'}
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
                      {locale === 'id' ? 'Lokasi' : 'Location'}
                    </p>
                    <p className="font-semibold text-[var(--egvox-text-primary)]">{loc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-[#027F86]" />
                  <div>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {locale === 'id' ? 'Batas Waktu' : 'Deadline'}
                    </p>
                    <p className="font-semibold text-[var(--egvox-text-primary)] tabular-nums">
                      {deadline}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--egvox-border-default)] pt-5">
                <h3 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                  {locale === 'id'
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
                  {locale === 'id'
                    ? 'Spesifikasi Capture Egocentric'
                    : 'Egocentric Capture Specification'}
                </h2>
                <span className="font-mono text-xs font-semibold text-[#027F86] dark:text-[#04B8B4]">
                  {project.captureSpec.version}
                </span>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                {[
                  [
                    locale === 'id' ? 'Perspektif' : 'Perspective',
                    locale === 'id'
                      ? project.captureSpec.perspective === 'Egocentric (First-Person)'
                        ? 'Egocentric (Sudut Pandang Pertama)'
                        : 'Multi-Sudut + Egocentric'
                      : project.captureSpec.perspective,
                  ],
                  [
                    locale === 'id' ? 'Pemasangan Kamera' : 'Camera Mounting',
                    locale === 'id'
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
                    locale === 'id' ? 'Kebutuhan Perangkat' : 'Device Requirement',
                    locale === 'id'
                      ? project.captureSpec.deviceRequirement
                      : project.captureSpec.deviceRequirementEn ||
                        project.captureSpec.deviceRequirement,
                  ],
                  [
                    locale === 'id' ? 'Resolusi' : 'Resolution',
                    locale === 'id'
                      ? project.captureSpec.resolution
                      : project.captureSpec.resolutionEn || project.captureSpec.resolution,
                  ],
                  [
                    'Frame Rate',
                    locale === 'id'
                      ? project.captureSpec.frameRate
                      : project.captureSpec.frameRateEn ||
                        project.captureSpec.frameRate,
                  ],
                  ['Codec / Format', project.captureSpec.codecFormat],
                  [
                    locale === 'id' ? 'Durasi Sesi' : 'Session Duration',
                    locale === 'id'
                      ? project.captureSpec.clipDuration
                      : project.captureSpec.clipDurationEn ||
                        project.captureSpec.clipDuration,
                  ],
                  [
                    locale === 'id' ? 'Kebijakan Audio' : 'Audio Policy',
                    locale === 'id'
                      ? project.captureSpec.audioPolicy === 'Forbidden'
                        ? 'Dilarang'
                        : project.captureSpec.audioPolicy === 'Required'
                        ? 'Wajib'
                        : 'Opsional'
                      : project.captureSpec.audioPolicy,
                  ],
                  [
                    locale === 'id' ? 'Stabilisasi' : 'Stabilization',
                    locale === 'id'
                      ? project.captureSpec.stabilization
                      : project.captureSpec.stabilizationEn ||
                        project.captureSpec.stabilization,
                  ],
                  [
                    locale === 'id' ? 'Kebijakan GPS / Lokasi' : 'GPS / Location Policy',
                    locale === 'id'
                      ? project.captureSpec.gpsPolicy
                      : project.captureSpec.gpsPolicyEn ||
                        project.captureSpec.gpsPolicy,
                  ],
                  [
                    locale === 'id' ? 'Persetujuan Peserta' : 'Participant Consent',
                    locale === 'id'
                      ? project.captureSpec.consentPolicy
                      : project.captureSpec.consentPolicyEn ||
                        project.captureSpec.consentPolicy,
                  ],
                  [
                    locale === 'id' ? 'Redaksi Privasi' : 'Privacy Redaction',
                    locale === 'id'
                      ? project.captureSpec.privacyRedaction
                      : project.captureSpec.privacyRedactionEn ||
                        project.captureSpec.privacyRedaction,
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
                  {locale === 'id'
                    ? 'Jadwal Milestone Work Order'
                    : 'Work Order Milestone Schedule'}
                </h2>
                <div className="mt-3 space-y-3">
                  {project.milestones.map((ms) => (
                    <div
                      key={ms.step}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-4 py-3 text-sm"
                    >
                      <div>
                        <span className="font-semibold text-[var(--egvox-text-primary)]">
                          {locale === 'id' ? `Tahap ${ms.step}:` : `Milestone ${ms.step}:`}{' '}
                          {locale === 'id' ? ms.titleId : ms.titleEn}
                        </span>
                        <p className="text-xs text-[var(--egvox-text-muted)]">
                          Target: {locale === 'id' ? ms.dueLabel : ms.dueLabelEn || ms.dueLabel}
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
                  {locale === 'id' ? 'Hak Data & Izin Penggunaan' : 'Data Rights & Permitted Use'}
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
            <div>
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {locale === 'id'
                  ? 'Tarif per jam diterima QA (IDR & USD)'
                  : 'Rate per QA-accepted hour (IDR & USD)'}
              </p>
              <div className="mt-1.5">
                <DualPrice amountIDR={project.ratePerUnit} unitLabel={unit} size="lg" />
              </div>
              <p className="mt-2 text-xs text-[var(--egvox-text-secondary)] tabular-nums">
                {locale === 'id' ? 'Estimasi total proyek:' : 'Est. total budget:'}{' '}
                <strong>{egvoxFormatIDR(project.ratePerUnit * project.targetVolume)}</strong>{' '}
                ({egvoxFormatUSD(project.ratePerUnit * project.targetVolume)} USD)
              </p>
            </div>

            <div className="space-y-2.5 border-y border-[var(--egvox-border-default)] py-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {locale === 'id' ? 'Target Volume' : 'Target Volume'}
                </span>
                <span className="font-semibold tabular-nums">
                  {project.targetVolume} {unit}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {locale === 'id' ? 'Batas Aplikasi' : 'Application Close'}
                </span>
                <span className="font-semibold tabular-nums">{appClose}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {locale === 'id' ? 'Anotasi' : 'Annotation'}
                </span>
                <span className="font-semibold sm:text-right">
                  {project.annotationRequired === 'optional'
                    ? locale === 'id'
                      ? 'Opsional (Vendor punya tim internal)'
                      : 'Optional (Vendor has internal annotators)'
                    : project.annotationRequired === 'required'
                    ? locale === 'id'
                      ? 'Termasuk dalam lingkup'
                      : 'Included in scope'
                    : locale === 'id'
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
                {locale === 'id' ? 'Ajukan Proposal' : 'Submit Proposal'}
              </button>
              <button
                type="button"
                onClick={() => setAskModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--egvox-border-default)] py-2.5 text-sm font-semibold text-[var(--egvox-text-primary)] hover:bg-[var(--egvox-bg-subtle)]"
              >
                <MessageSquare className="h-4 w-4 text-[#027F86]" />
                <span>
                  {locale === 'id' ? 'Tanyakan ke Vendor' : 'Ask Vendor'}
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
                {locale === 'id'
                  ? `Dataset Vendor Terverifikasi · ${project.country}`
                  : `Verified Dataset Vendor · ${project.country}`}
              </p>
              <Link
                href={`/providers/${project.vendorSlug}`}
                className="mt-2.5 inline-block text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
              >
                {locale === 'id' ? 'Lihat Profil Provider →' : 'View Provider Profile →'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ask Vendor Modal */}
      <Modal
        open={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        title={
          locale === 'id'
            ? `Tanyakan ke ${project.vendorName}`
            : `Message ${project.vendorName}`
        }
        subtitle={
          locale === 'id'
            ? 'Komunikasi berlangsung aman melalui sistem pesan EgvoX'
            : 'Communication is logged securely via EgvoX Messaging'
        }
      >
        <form onSubmit={handleSendQuestion} className="space-y-4">
          <textarea
            rows={4}
            required
            value={askMessage}
            onChange={(e) => setAskMessage(e.target.value)}
            placeholder={
              locale === 'id'
                ? 'Tanyakan detail spesifikasi kamera, format nama file, atau jadwal batch jam...'
                : 'Ask about camera rig requirements, file naming, or hourly batch milestones...'
            }
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-sm focus:border-[#027F86] focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAskModalOpen(false)}
              className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm"
            >
              {locale === 'id' ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#027F86] px-4 py-2 text-sm font-semibold text-white"
            >
              {locale === 'id' ? 'Kirim Pesan' : 'Send Message'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
