'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, ShieldCheck, Star } from 'lucide-react';
import { DualPrice } from '@/packages/design-system';
import { FREELANCER_SERVICES } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';

export const FreelancerCatalogView: React.FC<{
  initialRoleFilter?: 'Semua' | 'Video Contributor' | 'Data Annotator' | 'QA Reviewer';
}> = ({ initialRoleFilter = 'Semua' }) => {
  const { locale, openServiceOrderModal, customServices } = useAppState();
  const [roleFilter, setRoleFilter] = useState<
    'Semua' | 'Video Contributor' | 'Data Annotator' | 'QA Reviewer'
  >(initialRoleFilter);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'orders' | 'price'>('rating');

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
        !srv.location.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    if (sortBy === 'orders') {
      return [...list].sort((a, b) => b.completedOrders - a.completedOrders);
    }
    if (sortBy === 'price') {
      return [...list].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    }
    return [...list].sort((a, b) => b.rating - a.rating);
  }, [allServices, roleFilter, query, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-[var(--egvox-border-default)] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--egvox-text-primary)]">
              {locale === 'id'
                ? 'Katalog Freelancer & Layanan Data'
                : 'Freelancer Service Catalog'}
            </h1>
            <p className="mt-1 text-sm text-[var(--egvox-text-secondary)]">
              {locale === 'id'
                ? 'Temukan kontributor video egocentric dan data annotator terverifikasi dengan tarif per jam transparan.'
                : 'Hire verified egocentric video contributors and data annotators with transparent hourly rates.'}
            </p>
          </div>
          <Link
            href="/onboarding/freelancer"
            className="rounded-xl bg-[#FC840E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#e57407] whitespace-nowrap"
          >
            {locale === 'id' ? '+ Buat Listing Jasa' : '+ Create Service Listing'}
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(
              ['Semua', 'Video Contributor', 'Data Annotator', 'QA Reviewer'] as const
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
                {role === 'Semua' ? (locale === 'id' ? 'Semua' : 'All') : role}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--egvox-text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  locale === 'id'
                    ? 'Cari talenta atau layanan...'
                    : 'Search talent or services...'
                }
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] py-2 pl-9 pr-3 text-xs focus:border-[#027F86] focus:outline-none"
              />
            </div>
            <select
              aria-label={locale === 'id' ? 'Urutkan freelancer' : 'Sort freelancers'}
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'rating' | 'orders' | 'price')
              }
              className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs font-semibold"
            >
              <option value="rating">
                {locale === 'id' ? 'Rating Tertinggi' : 'Highest Rating'}
              </option>
              <option value="orders">
                {locale === 'id' ? 'Paling Banyak Selesai' : 'Most Completed'}
              </option>
              <option value="price">
                {locale === 'id' ? 'Tarif Terendah' : 'Lowest Rate'}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-[var(--egvox-text-muted)] tabular-nums">
        {locale === 'id'
          ? `Menampilkan ${filtered.length} layanan talenta terverifikasi`
          : `Showing ${filtered.length} verified talent services`}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-10 text-center space-y-3">
          <p className="text-sm font-semibold">
            {locale === 'id'
              ? 'Tidak ada layanan freelancer pada filter ini.'
              : 'No freelancer services match this filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setRoleFilter('Semua');
              setQuery('');
            }}
            className="rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
          >
            {locale === 'id' ? 'Tampilkan Semua Talenta' : 'Show All Talent'}
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((srv) => {
            const title = locale === 'id' ? srv.title : srv.titleEn;
            const desc = locale === 'id' ? srv.description : srv.descriptionEn;
            const unit = locale === 'id' ? srv.unitLabel : srv.unitLabelEn || 'hour';
            const sla = locale === 'id' ? srv.deliverySla : srv.deliverySlaEn || srv.deliverySla;
            const loc = locale === 'id' ? srv.location : srv.locationEn || srv.location;
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
                            <ShieldCheck className="h-4 w-4 text-[#2563A6]" />
                          )}
                        </div>
                        <p className="text-xs text-[var(--egvox-text-muted)]">
                          {srv.roleType} · {srv.levelBadge}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
                      <Star className="h-3.5 w-3.5 fill-[#FDBA27] text-[#FDBA27]" />
                      {srv.rating} ({srv.reviewCount})
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

                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--egvox-text-muted)]">
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#027F86]" />
                      {loc}
                    </span>
                    <span className="tabular-nums text-right">SLA: {sla}</span>
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
                            alt={locale === 'id' ? pf.title : pf.titleEn || pf.title}
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
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 border-t border-[var(--egvox-border-default)] pt-4">
                  <div>
                    <span className="block text-[11px] text-[var(--egvox-text-muted)]">
                      {locale === 'id' ? 'Mulai dari' : 'From'}
                    </span>
                    <DualPrice amountIDR={srv.pricePerUnit} unitLabel={unit} size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/freelancers/${srv.username}`}
                      className="rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
                    >
                      {locale === 'id' ? 'Profil' : 'Profile'}
                    </Link>
                    <button
                      type="button"
                      onClick={() => openServiceOrderModal(srv)}
                      className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
                    >
                      {locale === 'id' ? 'Pesan Layanan' : 'Request Order'}
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
