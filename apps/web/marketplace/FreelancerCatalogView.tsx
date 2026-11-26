'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, MapPin, Search, ShieldCheck, Star, Wrench } from 'lucide-react';
import { FREELANCER_SERVICES } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';

type RoleFilter = 'Semua' | 'Video Contributor' | 'Data Annotator' | 'QA Specialist';

export const FreelancerCatalogView: React.FC<{
  initialRoleFilter?: RoleFilter;
}> = ({ initialRoleFilter = 'Semua' }) => {
  const { locale, openRecruitModal, customServices } = useAppState();
  const isId = locale === 'id';
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(initialRoleFilter);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'orders' | 'sla'>('rating');

  const allServices = useMemo(
    () => [...customServices, ...FREELANCER_SERVICES],
    [customServices]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allServices.filter((srv) => {
      if (roleFilter !== 'Semua' && srv.roleType !== roleFilter) return false;
      if (
        q &&
        !srv.freelancerName.toLowerCase().includes(q) &&
        !srv.title.toLowerCase().includes(q) &&
        !srv.titleEn.toLowerCase().includes(q) &&
        !srv.tags.some((t) => t.toLowerCase().includes(q)) &&
        !srv.equipment.some((e) => e.toLowerCase().includes(q)) &&
        !(srv.equipmentEn || []).some((e) => e.toLowerCase().includes(q)) &&
        !srv.location.toLowerCase().includes(q) &&
        !(srv.locationEn || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    if (sortBy === 'orders') {
      return [...list].sort((a, b) => b.completedOrders - a.completedOrders);
    }
    if (sortBy === 'sla') {
      return [...list].sort(
        (a, b) => (b.acceptanceRatePercent ?? b.slaPercent) - (a.acceptanceRatePercent ?? a.slaPercent)
      );
    }
    return [...list].sort((a, b) => b.rating - a.rating);
  }, [allServices, roleFilter, query, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-[var(--egvox-border-default)] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#027F86] dark:text-[#04B8B4]">
              {isId
                ? 'Sistem Rekrutmen Talenta Terstruktur'
                : 'Structured Talent Recruitment Marketplace'}
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--egvox-text-primary)]">
              {isId
                ? 'Katalog Freelancer & Talenta EgvoX'
                : 'EgvoX Freelancer Talent Catalog'}
            </h1>
            <p className="mt-1 text-sm text-[var(--egvox-text-secondary)]">
              {isId
                ? 'Temukan Video Contributor, Data Annotator, dan QA Specialist berdasarkan spesialisasi, perangkat, kapasitas, dan rekam jejak QA. Negosiasi biaya berjalan privat setelah rekrutmen diajukan.'
                : 'Discover Video Contributors, Data Annotators, and QA Specialists by specialization, equipment, capacity, and QA track record. Commercial terms are negotiated privately via recruitment offers.'}
            </p>
          </div>
          <Link
            href="/onboarding/freelancer"
            className="rounded-xl bg-[#FC840E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#e57407] whitespace-nowrap"
          >
            {isId ? '+ Daftarkan Profil Talenta' : '+ Register Talent Profile'}
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(
              ['Semua', 'Video Contributor', 'Data Annotator', 'QA Specialist'] as const
            ).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  roleFilter === role
                    ? 'bg-[#027F86] text-white'
                    : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]'
                }`}
              >
                {role === 'Semua' ? (isId ? 'Semua' : 'All') : role}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--egvox-text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isId
                    ? 'Cari freelancer, keahlian, perangkat, atau kota...'
                    : 'Search freelancer, skills, gear, or city...'
                }
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] py-2 pl-9 pr-3 text-xs focus:border-[#027F86] focus:outline-none"
              />
            </div>
            <select
              aria-label={isId ? 'Urutkan freelancer' : 'Sort freelancers'}
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'rating' | 'orders' | 'sla')
              }
              className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs font-semibold"
            >
              <option value="rating">
                {isId ? 'Rating Tertinggi' : 'Highest Rating'}
              </option>
              <option value="orders">
                {isId ? 'Paling Banyak Pekerjaan Selesai' : 'Most Completed Jobs'}
              </option>
              <option value="sla">
                {isId ? 'Acceptance Rate & SLA Tertinggi' : 'Highest Acceptance & SLA'}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--egvox-text-muted)] tabular-nums">
        <span>
          {isId
            ? `Menampilkan ${filtered.length} talenta terverifikasi siap rekrut`
            : `Showing ${filtered.length} verified talent profiles ready for recruitment`}
        </span>
        <span className="font-medium text-[#16835D]">
          {isId
            ? 'Penawaran biaya hanya terlihat privat antara Rekruter & Freelancer'
            : 'Offer pricing is strictly private between Recruiter & Freelancer'}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-10 text-center space-y-3">
          <p className="text-sm font-semibold">
            {isId
              ? 'Tidak ada talenta freelancer pada filter ini.'
              : 'No freelancer talent matches this filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setRoleFilter('Semua');
              setQuery('');
            }}
            className="rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
          >
            {isId ? 'Tampilkan Semua Talenta' : 'Show All Talent'}
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((srv) => {
            const title = isId ? srv.title : srv.titleEn;
            const desc = isId ? srv.description : srv.descriptionEn;
            const sla = isId ? srv.deliverySla : srv.deliverySlaEn || srv.deliverySla;
            const cap = isId ? srv.capacityLabel : srv.capacityLabelEn || srv.capacityLabel;
            const loc = isId ? srv.location : srv.locationEn || srv.location;
            const equip = (isId ? srv.equipment : srv.equipmentEn || srv.equipment).slice(0, 2);
            const accRate = srv.acceptanceRatePercent ?? srv.slaPercent;
            return (
              <article
                key={srv.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={srv.avatar}
                        alt={srv.freelancerName}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-full object-cover border border-[var(--egvox-border-default)]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/freelancers/${srv.username}`}
                            className="text-sm font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                          >
                            {srv.freelancerName}
                          </Link>
                          {srv.verified && (
                            <ShieldCheck className="h-4 w-4 text-[#16835D]" />
                          )}
                        </div>
                        <p className="text-xs font-medium text-[#027F86] dark:text-[#04B8B4]">
                          {srv.roleType} · {srv.levelBadge}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
                      <Star className="h-3.5 w-3.5 fill-[#FDBA27] text-[#FDBA27]" />
                      {srv.rating} ({srv.completedOrders})
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/marketplace/services/${srv.slug}`}
                      className="block text-base font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                    >
                      {title}
                    </Link>
                    <p className="mt-1.5 text-xs text-[var(--egvox-text-secondary)] line-clamp-2">
                      {desc}
                    </p>
                  </div>

                  {/* Portfolio Preview Strip (Watermarked Samples) */}
                  {srv.portfolioPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {srv.portfolioPreviews.slice(0, 2).map((pf) => (
                        <div
                          key={pf.id}
                          className="relative aspect-[16/10] overflow-hidden rounded-lg border border-[var(--egvox-border-default)]"
                        >
                          <img
                            src={pf.thumbnail}
                            alt={isId ? pf.title : pf.titleEn || pf.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-mono text-white tabular-nums">
                            {pf.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Capability, Equipment & QA Metrics (No Public Prices) */}
                  <div className="space-y-1.5 rounded-xl bg-[var(--egvox-bg-canvas)] p-3 text-xs">
                    <div className="flex items-start gap-1.5 text-[var(--egvox-text-secondary)]">
                      <Wrench className="h-3.5 w-3.5 shrink-0 text-[#027F86] mt-0.5" />
                      <span className="line-clamp-1">{equip.join(' · ')}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--egvox-text-muted)] tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#027F86]" />
                        {loc}
                      </span>
                      <span className="font-semibold text-[#16835D]">
                        {accRate}% {isId ? 'Penerimaan' : 'Acceptance'} · SLA {sla}
                      </span>
                    </div>
                    {srv.roleType === 'QA Specialist' && srv.conflictDisclosureDeclared && (
                      <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563A6]">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        <span>
                          {isId
                            ? 'Deklarasi Anti-Konflik Kepentingan QA Aktif'
                            : 'QA Anti-Conflict Declaration Active'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--egvox-border-default)] pt-3.5">
                  <div className="text-xs">
                    <span className="block text-[11px] text-[var(--egvox-text-muted)]">
                      {isId ? 'Kapasitas & Ketersediaan' : 'Capacity & Availability'}
                    </span>
                    <span className="font-semibold text-[var(--egvox-text-primary)] tabular-nums">
                      {cap} ·{' '}
                      <span className="text-[#16835D]">
                        {srv.available ? (isId ? 'Tersedia' : 'Available') : isId ? 'Terjadwal' : 'Scheduled'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/freelancers/${srv.username}`}
                      className="rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
                    >
                      {isId ? 'Profil' : 'Profile'}
                    </Link>
                    <button
                      type="button"
                      onClick={() => openRecruitModal(srv)}
                      className="rounded-lg bg-[#027F86] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
                    >
                      {isId ? 'Rekrut' : 'Recruit'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
