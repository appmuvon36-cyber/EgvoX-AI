'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flag,
  Lock,
  MapPin,
  Play,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { FreelancerServiceListing } from '@/packages/shared-types';
import { ACTIVITY_CATEGORIES } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';

export const ServiceDetailView: React.FC<{
  service: FreelancerServiceListing;
}> = ({ service }) => {
  const { locale, openRecruitModal, openReportModal } = useAppState();
  const isId = locale === 'id';
  const [tab, setTab] = useState<'about' | 'portfolio' | 'specs' | 'reviews'>('about');

  const title = isId ? service.title : service.titleEn;
  const desc = isId ? service.description : service.descriptionEn;
  const cap = isId ? service.capacityLabel : service.capacityLabelEn || service.capacityLabel;
  const sla = isId ? service.deliverySla : service.deliverySlaEn || service.deliverySla;
  const loc = isId ? service.location : service.locationEn || service.location;
  const terms = isId ? service.terms : service.termsEn || service.terms;
  const exclusions = isId ? service.exclusions : service.exclusionsEn || service.exclusions;
  const equipment = isId ? service.equipment : service.equipmentEn || service.equipment;
  const accRate = service.acceptanceRatePercent ?? service.slaPercent;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/marketplace/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--egvox-text-secondary)] hover:text-[#027F86]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            {isId ? 'Kembali ke Katalog Freelancer' : 'Back to Freelancer Catalog'}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => openReportModal({ type: 'service', slug: service.slug, title })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--egvox-text-secondary)] hover:text-[#C43D3D]"
        >
          <Flag className="h-3.5 w-3.5" />
          <span>{isId ? 'Laporkan' : 'Report'}</span>
        </button>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 min-w-0 space-y-6">
          {/* Freelancer Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
            <div className="flex items-center gap-4">
              <img
                src={service.avatar}
                alt={service.freelancerName}
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-full object-cover border border-[var(--egvox-border-default)]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/freelancers/${service.username}`}
                    className="text-base font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                  >
                    {service.freelancerName}
                  </Link>
                  {service.verified && (
                    <ShieldCheck className="h-4 w-4 text-[#16835D]" />
                  )}
                </div>
                <p className="text-xs text-[var(--egvox-text-muted)]">
                  {service.roleType} · {service.levelBadge} · {service.completedOrders}{' '}
                  {isId ? 'pekerjaan selesai' : 'completed jobs'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1 font-bold tabular-nums">
                <Star className="h-4 w-4 fill-[#FDBA27] text-[#FDBA27]" />
                {service.rating} ({service.reviewCount}{' '}
                {isId ? 'ulasan' : 'reviews'})
              </span>
            </div>
          </div>

          {/* Portfolio Preview Player (Watermarked, Consent Verified) */}
          {service.portfolioPreviews[0] && (
            <div className="relative overflow-hidden rounded-2xl border border-[var(--egvox-border-default)] bg-[#102326] aspect-[16/9]">
              <img
                src={service.portfolioPreviews[0].thumbnail}
                alt={
                  isId
                    ? service.portfolioPreviews[0].title
                    : service.portfolioPreviews[0].titleEn ||
                      service.portfolioPreviews[0].title
                }
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#027F86]">
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-1.5 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs text-white">
                <span className="font-mono tabular-nums">
                  {service.portfolioPreviews[0].duration} ·{' '}
                  {isId
                    ? service.portfolioPreviews[0].title
                    : service.portfolioPreviews[0].titleEn ||
                      service.portfolioPreviews[0].title}
                </span>
                <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] sm:text-[11px]">
                  {isId
                    ? 'Portfolio Preview Berizin · Watermarked'
                    : 'Consented Preview · Watermarked'}
                </span>
              </div>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-[var(--egvox-text-primary)]">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[var(--egvox-text-secondary)]">
              {desc}
            </p>
            {service.categories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {service.categories.map((catSlug) => {
                  const cat = ACTIVITY_CATEGORIES.find((c) => c.slug === catSlug);
                  return (
                    <span
                      key={catSlug}
                      className="rounded-md bg-[#027F86]/10 px-2.5 py-1 text-[11px] font-semibold text-[#027F86] dark:text-[#04B8B4]"
                    >
                      {isId ? cat?.nameId || catSlug : cat?.nameEn || catSlug}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* QA Anti-Conflict Disclosure Banner */}
          {service.roleType === 'QA Specialist' && (
            <div className="rounded-2xl border border-[#2563A6]/30 bg-[#2563A6]/8 p-4 text-xs space-y-1">
              <p className="font-bold text-[#2563A6] inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {isId
                    ? 'Deklarasi Independensi QA Specialist (Anti-Konflik Kepentingan)'
                    : 'QA Specialist Independence & Anti-Conflict Policy'}
                </span>
              </p>
              <p className="text-[var(--egvox-text-secondary)]">
                {isId
                  ? service.conflictDisclosureText ||
                    'QA Specialist tidak boleh memeriksa hasil rekaman atau anotasi miliknya sendiri pada Work Order yang sama.'
                  : service.conflictDisclosureTextEn ||
                    'QA Specialists cannot audit footage or annotations they captured or labeled within the same Work Order.'}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-[var(--egvox-border-default)] flex gap-5 sm:gap-6 overflow-x-auto">
            {(
              [
                {
                  id: 'about',
                  label: isId ? 'Profil & Ketentuan' : 'Profile & Terms',
                },
                {
                  id: 'portfolio',
                  label: `Portfolio (${service.portfolioPreviews.length})`,
                },
                {
                  id: 'specs',
                  label: isId ? 'Keahlian & Perangkat' : 'Skills & Equipment',
                },
                {
                  id: 'reviews',
                  label: isId
                    ? `Ulasan (${service.reviews.length})`
                    : `Reviews (${service.reviews.length})`,
                },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`border-b-2 pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  tab === item.id
                    ? 'border-[#027F86] text-[#027F86] dark:text-[#04B8B4]'
                    : 'border-transparent text-[var(--egvox-text-muted)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'about' && (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 space-y-5">
              <div>
                <h2 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                  {isId ? 'Ketentuan Kerja & Kualitas' : 'Work Standards & Quality'}
                </h2>
                <ul className="mt-2 space-y-2 text-sm text-[var(--egvox-text-secondary)]">
                  {terms.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16835D]" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-[var(--egvox-border-default)] pt-4">
                <h2 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                  {isId ? 'Batasan & Pengecualian (Exclusions)' : 'Exclusions & Boundaries'}
                </h2>
                <ul className="mt-2 space-y-1.5 text-sm text-[var(--egvox-text-secondary)]">
                  {exclusions.map((ex) => (
                    <li key={ex}>• {ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'portfolio' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {service.portfolioPreviews.map((pf) => (
                <div
                  key={pf.id}
                  className="overflow-hidden rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]"
                >
                  <div className="relative aspect-[16/10] bg-[#102326]">
                    <img
                      src={pf.thumbnail}
                      alt={isId ? pf.title : pf.titleEn || pf.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[11px] font-mono text-white">
                      {pf.duration} · {isId ? 'Ber-watermark' : 'Watermarked'}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold">{isId ? pf.title : pf.titleEn || pf.title}</p>
                    <p className="mt-1 text-xs text-[#16835D]">
                      {isId
                        ? 'Sampel berizin (bukan raw dataset komersial)'
                        : 'Consented preview only (not public raw dataset)'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'specs' && (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 space-y-5">
              <div>
                <h2 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                  {service.roleType === 'Data Annotator'
                    ? isId
                      ? 'Tools Anotasi, Skema & Spesifikasi Output'
                      : 'Annotation Tools, Schemas & Output Format'
                    : service.roleType === 'QA Specialist'
                    ? isId
                      ? 'Cakupan Audit QA, Tools & Standar Pemeriksaan'
                      : 'QA Audit Scope, Inspector Tools & Standards'
                    : isId
                    ? 'Kamera, Mounting Rig & Standar Capture'
                    : 'Camera Rig, Mounting & Capture Standards'}
                </h2>
                <p className="mt-2 text-sm text-[var(--egvox-text-secondary)]">
                  {service.roleType === 'Data Annotator'
                    ? isId
                      ? 'Format & Skema Ekspor:'
                      : 'Supported Export Format:'
                    : service.roleType === 'QA Specialist'
                    ? isId
                      ? 'Standar Audit QA:'
                      : 'QA Audit Standard:'
                    : isId
                    ? 'Standar Resolusi & FPS:'
                    : 'Capture Output Standard:'}{' '}
                  <strong>
                    {isId ? service.resolutionFps : service.resolutionFpsEn || service.resolutionFps}
                  </strong>
                </p>
              </div>

              {service.supportedSchemas && service.supportedSchemas.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--egvox-text-muted)] mb-2">
                    {service.roleType === 'QA Specialist'
                      ? isId
                        ? 'Cakupan Pemeriksaan QA'
                        : 'QA Audit Scope'
                      : isId
                      ? 'Spesialisasi & Skema Anotasi'
                      : 'Annotation Specializations & Schemas'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.supportedSchemas.map((schema) => (
                      <span
                        key={schema}
                        className="rounded-md border border-[#027F86]/30 bg-[#027F86]/10 px-2.5 py-1 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4]"
                      >
                        {schema}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {service.annotationTools && service.annotationTools.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--egvox-text-muted)] mb-2">
                    {service.roleType === 'QA Specialist'
                      ? isId
                        ? 'Perangkat & Validator Audit'
                        : 'QA Inspection Tools'
                      : isId
                      ? 'Platform & Tools Anotasi'
                      : 'Annotation Platforms & Tools'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.annotationTools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-md border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-2.5 py-1 text-xs font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-2.5 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--egvox-text-muted)] mb-2">
                  {service.roleType === 'Video Contributor'
                    ? isId
                      ? 'Perangkat Kamera & Rigging'
                      : 'Camera Hardware & Mounting Rig'
                    : service.roleType === 'Data Annotator'
                    ? isId
                      ? 'Workstation & Lingkungan Anotasi'
                      : 'Workstation & Labeling Environment'
                    : isId
                    ? 'Checklist & Peralatan Audit QA'
                    : 'QA Checklists & Inspection Equipment'}
                </p>
                <ul className="space-y-2 text-sm text-[var(--egvox-text-secondary)]">
                  {equipment.map((eq) => (
                    <li key={eq} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#027F86]" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {service.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[var(--egvox-text-primary)]">
                        {rev.buyerName} · {rev.buyerOrg}
                      </p>
                      <p className="text-xs text-[var(--egvox-text-muted)]">
                        {isId
                          ? rev.orderScope
                          : rev.orderScopeEn || rev.orderScope}{' '}
                        · {rev.date}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums">
                      <Star className="h-3.5 w-3.5 fill-[#FDBA27] text-[#FDBA27]" />
                      {rev.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--egvox-text-secondary)]">
                    {isId ? rev.comment : rev.commentEn || rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Recruitment Sidebar */}
        <div className="lg:col-span-4 min-w-0">
          <div className="sticky top-20 space-y-5 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#027F86]/10 px-2.5 py-1 text-[11px] font-bold text-[#027F86] dark:text-[#04B8B4]">
                <Lock className="h-3 w-3" />
                {isId ? 'Rekrutmen Privat Terstruktur' : 'Structured Private Recruitment'}
              </span>
              <h2 className="mt-2.5 text-base font-bold text-[var(--egvox-text-primary)]">
                {isId ? 'Kapasitas & Ketersediaan' : 'Capacity & Availability'}
              </h2>
              <p className="mt-1 text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Penawaran biaya diajukan secara privat ke talenta ini setelah memilih detail pekerjaan.'
                  : 'Compensation offers are sent privately after defining project specifications.'}
              </p>
            </div>

            <div className="space-y-2.5 border-y border-[var(--egvox-border-default)] py-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Kapasitas' : 'Capacity'}
                </span>
                <span className="font-semibold tabular-nums">{cap}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Ketersediaan' : 'Availability'}
                </span>
                <span className="font-semibold text-[#16835D]">
                  {service.available ? (isId ? 'Tersedia' : 'Available') : isId ? 'Terjadwal' : 'Scheduled'}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">SLA</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Clock className="h-3.5 w-3.5 text-[#027F86]" />
                  {sla}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Tingkat Penerimaan' : 'Acceptance Rate'}
                </span>
                <span className="font-bold text-[#16835D] tabular-nums">{accRate}%</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Lokasi' : 'Location'}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold sm:text-right">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#027F86]" />
                  <span>{loc}</span>
                </span>
              </div>
            </div>

            {/* 4-Point Verification Checklist (Reference Board) */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--egvox-text-primary)]">
                {isId ? 'Verifikasi EgvoX' : 'EgvoX Verification'}
              </p>
              <div className="grid grid-cols-1 gap-1.5 text-xs text-[var(--egvox-text-secondary)]">
                {(isId
                  ? [
                      'Identitas Terverifikasi (KYC)',
                      'Perangkat & Tools Tervalidasi',
                      'Persetujuan & Consent',
                      'Kepatuhan Kebijakan EgvoX',
                    ]
                  : [
                      'Identity Verified (KYC)',
                      'Validated Equipment & Tools',
                      'Participant Consent Verified',
                      'EgvoX Policy Compliance',
                    ]
                ).map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#16835D]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => openRecruitModal(service)}
                className="w-full rounded-xl bg-[#027F86] py-3 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
              >
                {isId ? 'Rekrut Freelancer' : 'Recruit Freelancer'}
              </button>
              <Link
                href={`/freelancers/${service.username}`}
                className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--egvox-border-default)] py-2.5 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
              >
                {isId ? 'Lihat Profil Lengkap Talenta' : 'View Full Talent Profile'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
