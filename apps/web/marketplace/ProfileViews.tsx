'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { DualPrice } from '@/packages/design-system';
import { FreelancerServiceListing, VendorOrganization } from '@/packages/shared-types';
import { FREELANCER_SERVICES, PROJECT_LISTINGS } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';

export const ProviderProfileView: React.FC<{ provider: VendorOrganization }> = ({
  provider,
}) => {
  const { locale } = useAppState();
  const isId = locale === 'id';
  const [tab, setTab] = useState<'about' | 'projects' | 'reviews'>('projects');
  const vendorProjects = PROJECT_LISTINGS.filter(
    (p) => p.vendorSlug === provider.slug
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/marketplace/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--egvox-text-secondary)] hover:text-[#027F86]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{isId ? 'Kembali ke Katalog' : 'Back to Catalog'}</span>
      </Link>

      {/* Header Card */}
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#027F86]/12 text-xl font-bold text-[#027F86]">
              {provider.name
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--egvox-text-primary)]">
                  {provider.name}
                </h1>
                {provider.verified && (
                  <ShieldCheck className="h-5 w-5 text-[#2563A6]" />
                )}
              </div>
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {isId ? 'Penyedia Dataset (Vendor)' : 'Dataset Vendor'} · {provider.industry} · {provider.country}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-[var(--egvox-border-default)] text-center">
            <div>
              <p className="text-lg font-bold text-[var(--egvox-text-primary)] tabular-nums">
                {provider.activeProjects}
              </p>
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {isId ? 'Proyek Aktif' : 'Active Projects'}
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--egvox-text-primary)] tabular-nums">
                {provider.completedProjects}
              </p>
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {isId ? 'Selesai' : 'Completed'}
              </p>
            </div>
            <div>
              <p className="inline-flex items-center gap-1 text-lg font-bold text-[var(--egvox-text-primary)] tabular-nums">
                <Star className="h-4 w-4 fill-[#FDBA27] text-[#FDBA27]" />
                {provider.rating}
              </p>
              <p className="text-xs text-[var(--egvox-text-muted)]">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--egvox-border-default)] flex gap-5 sm:gap-6 overflow-x-auto">
        {(
          [
            {
              id: 'projects',
              label: isId
                ? `Project Aktif (${vendorProjects.length})`
                : `Active Projects (${vendorProjects.length})`,
            },
            { id: 'about', label: isId ? 'Tentang Kami' : 'About' },
            {
              id: 'reviews',
              label: isId ? 'Ulasan & Reputasi' : 'Reviews & Reputation',
            },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 pb-3 text-sm font-semibold whitespace-nowrap ${
              tab === t.id
                ? 'border-[#027F86] text-[#027F86] dark:text-[#04B8B4]'
                : 'border-transparent text-[var(--egvox-text-muted)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'projects' && (
        <div className="grid gap-5 md:grid-cols-2">
          {vendorProjects.map((prj) => {
            const unit = isId ? prj.unitLabel : prj.unitLabelEn || 'hour';
            return (
              <Link
                key={prj.id}
                href={`/marketplace/projects/${prj.slug}`}
                className="flex gap-3 sm:gap-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-3.5 sm:p-4 hover:border-[#027F86] transition-colors"
              >
                <img
                  src={prj.previewImage}
                  alt={isId ? prj.title : prj.titleEn}
                  referrerPolicy="no-referrer"
                  className="h-20 w-24 sm:h-24 sm:w-32 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--egvox-text-muted)]">
                    {isId ? prj.categoryLabel : prj.categoryLabelEn || prj.categoryLabel} · {prj.targetVolume} {unit}
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-[var(--egvox-text-primary)] line-clamp-1">
                    {isId ? prj.title : prj.titleEn}
                  </h3>
                  <div className="mt-2">
                    {prj.showBudgetDisclosure !== false ? (
                      <div>
                        <span className="block text-[10px] text-[var(--egvox-text-muted)]">
                          {isId ? 'Info Budget Proyek (Opsional)' : 'Project Budget Reference'}
                        </span>
                        <DualPrice amountIDR={prj.ratePerUnit} unitLabel={unit} size="sm" />
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-[#027F86]">
                        {isId ? 'Penawaran Privat via Rekrutmen' : 'Private Recruitment Offer'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {tab === 'about' && (
        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 space-y-4">
          <p className="text-sm leading-relaxed text-[var(--egvox-text-secondary)]">
            {isId ? provider.summary : provider.summaryEn}
          </p>
          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5">
              <p className="text-[var(--egvox-text-muted)]">
                {isId ? 'Entitas Legal' : 'Legal Entity'}
              </p>
              <p className="mt-1 font-semibold">{provider.legalName}</p>
            </div>
            <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5">
              <p className="text-[var(--egvox-text-muted)]">
                {isId ? 'Verifikasi Organisasi' : 'Organization Status'}
              </p>
              <p className="mt-1 font-semibold text-[#16835D] inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                {isId ? 'Terverifikasi KYB' : 'KYB Verified'}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5">
              <p className="text-[var(--egvox-text-muted)]">
                {isId ? 'Website Resmi' : 'Official Website'}
              </p>
              <a
                href={provider.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-semibold text-[#027F86] break-all"
              >
                <span>{provider.website}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 text-sm text-[var(--egvox-text-secondary)]">
          {isId ? (
            <>
              Rating rata-rata <strong className="tabular-nums">{provider.rating}/5.0</strong> berdasarkan {provider.reviewCount} Work Order selesai dengan pembayaran tepat waktu dan acceptance criteria yang transparan.
            </>
          ) : (
            <>
              Average rating <strong className="tabular-nums">{provider.rating}/5.0</strong> across {provider.reviewCount} completed Work Orders with timely payouts and clear acceptance criteria.
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const FreelancerProfileView: React.FC<{
  primaryService: FreelancerServiceListing;
}> = ({ primaryService }) => {
  const { locale, openRecruitModal } = useAppState();
  const isId = locale === 'id';
  const [tab, setTab] = useState<'services' | 'portfolio' | 'reviews'>('services');
  const services = FREELANCER_SERVICES.filter(
    (s) => s.username === primaryService.username
  );
  const accRate = primaryService.acceptanceRatePercent ?? primaryService.slaPercent;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/marketplace/services"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--egvox-text-secondary)] hover:text-[#027F86]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>
          {isId ? 'Kembali ke Katalog Freelancer' : 'Back to Freelancer Catalog'}
        </span>
      </Link>

      {/* Profile Header */}
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={primaryService.avatar}
              alt={primaryService.freelancerName}
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-full object-cover border border-[var(--egvox-border-default)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--egvox-text-primary)]">
                  {primaryService.freelancerName}
                </h1>
                {primaryService.verified && (
                  <ShieldCheck className="h-5 w-5 text-[#16835D]" />
                )}
              </div>
              <p className="text-xs font-medium text-[#027F86] dark:text-[#04B8B4]">
                {primaryService.roleType} · {primaryService.levelBadge}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--egvox-text-secondary)]">
                <MapPin className="h-3.5 w-3.5 text-[#027F86]" />
                {isId
                  ? primaryService.location
                  : primaryService.locationEn || primaryService.location}{' '}
                · {isId ? 'KYC Terverifikasi' : 'KYC Verified'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-lg font-bold tabular-nums">{primaryService.completedOrders}</p>
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {isId ? 'Pekerjaan' : 'Jobs'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#16835D] tabular-nums">{accRate}%</p>
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {isId ? 'Penerimaan' : 'Acceptance'}
              </p>
            </div>
            <div className="text-center">
              <p className="inline-flex items-center gap-1 text-lg font-bold tabular-nums">
                <Star className="h-4 w-4 fill-[#FDBA27] text-[#FDBA27]" />
                {primaryService.rating}
              </p>
              <p className="text-xs text-[var(--egvox-text-muted)]">Rating</p>
            </div>
            <button
              type="button"
              onClick={() => openRecruitModal(primaryService)}
              className="rounded-xl bg-[#027F86] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
            >
              {isId ? 'Rekrut' : 'Recruit Freelancer'}
            </button>
          </div>
        </div>
      </div>

      {/* QA Conflict Disclosure if QA Specialist */}
      {primaryService.roleType === 'QA Specialist' && (
        <div className="rounded-2xl border border-[#2563A6]/30 bg-[#2563A6]/8 p-4 text-xs">
          <p className="font-bold text-[#2563A6]">
            {isId
              ? 'Kebijakan Independensi QA Specialist'
              : 'QA Specialist Independence Policy'}
          </p>
          <p className="mt-1 text-[var(--egvox-text-secondary)]">
            {isId
              ? primaryService.conflictDisclosureText ||
                'QA Specialist independen tidak diperbolehkan mereview output capture atau anotasi miliknya sendiri.'
              : primaryService.conflictDisclosureTextEn ||
                'Independent QA Specialists may not audit their own capture or annotation deliverables.'}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[var(--egvox-border-default)] flex gap-5 sm:gap-6 overflow-x-auto">
        {(
          [
            {
              id: 'services',
              label: isId
                ? `Kapabilitas & Layanan (${services.length})`
                : `Capabilities & Services (${services.length})`,
            },
            {
              id: 'portfolio',
              label: `${isId ? 'Preview Portofolio' : 'Portfolio Preview'} (${primaryService.portfolioPreviews.length})`,
            },
            {
              id: 'reviews',
              label: isId
                ? `Ulasan (${primaryService.reviews.length})`
                : `Reviews (${primaryService.reviews.length})`,
            },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 pb-3 text-sm font-semibold whitespace-nowrap ${
              tab === t.id
                ? 'border-[#027F86] text-[#027F86] dark:text-[#04B8B4]'
                : 'border-transparent text-[var(--egvox-text-muted)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'services' && (
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((srv) => {
            const cap = isId ? srv.capacityLabel : srv.capacityLabelEn || srv.capacityLabel;
            const sla = isId ? srv.deliverySla : srv.deliverySlaEn || srv.deliverySla;
            const equip = isId ? srv.equipment : srv.equipmentEn || srv.equipment;
            return (
              <div
                key={srv.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5"
              >
                <div>
                  <Link
                    href={`/marketplace/services/${srv.slug}`}
                    className="text-base font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                  >
                    {isId ? srv.title : srv.titleEn}
                  </Link>
                  <p className="mt-1.5 text-xs text-[var(--egvox-text-secondary)]">
                    {isId ? srv.description : srv.descriptionEn}
                  </p>
                  <p className="mt-3 text-xs text-[var(--egvox-text-muted)]">
                    {isId ? srv.resolutionFps : srv.resolutionFpsEn || srv.resolutionFps}
                  </p>
                  <p className="mt-1.5 text-xs text-[var(--egvox-text-secondary)]">
                    <strong>{isId ? 'Perangkat/Tools:' : 'Gear/Tools:'}</strong>{' '}
                    {equip.slice(0, 2).join(' · ')}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-[var(--egvox-border-default)] pt-3">
                  <div className="text-xs text-[var(--egvox-text-muted)] tabular-nums">
                    <span>
                      {isId ? 'Kapasitas' : 'Capacity'}: <strong>{cap}</strong> · SLA {sla}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openRecruitModal(srv)}
                    className="rounded-lg bg-[#027F86] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
                  >
                    {isId ? 'Rekrut' : 'Recruit'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'portfolio' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {primaryService.portfolioPreviews.map((pf) => (
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
                <p className="text-sm font-bold text-[var(--egvox-text-primary)]">
                  {isId ? pf.title : pf.titleEn || pf.title}
                </p>
                <p className="mt-1 text-xs text-[#16835D]">
                  {isId
                    ? 'Sampel berizin (bukan inventory raw video komersial)'
                    : 'Consented preview only (not public raw video inventory)'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-3">
          {primaryService.reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <p className="text-sm font-bold">
                  {rev.buyerName} · {rev.buyerOrg}
                </p>
                <span className="text-xs font-bold tabular-nums">★ {rev.rating}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--egvox-text-muted)]">
                {isId ? rev.orderScope : rev.orderScopeEn || rev.orderScope} · {rev.date}
              </p>
              <p className="mt-2 text-sm text-[var(--egvox-text-secondary)]">
                {isId ? rev.comment : rev.commentEn || rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
