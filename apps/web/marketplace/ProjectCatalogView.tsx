'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { DualPrice, Modal, egvoxFormatUSD } from '@/packages/design-system';
import { ACTIVITY_CATEGORIES, PROJECT_LISTINGS } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';
import { ActivityCategorySlug, DataModality } from '@/packages/shared-types';

export const ProjectCatalogView: React.FC<{
  initialQuery?: string;
  initialCategory?: ActivityCategorySlug;
}> = ({ initialQuery = '', initialCategory }) => {
  const { locale, savedSlugs, toggleSaved, openProposalModal, customProjects } =
    useAppState();
  const isId = locale === 'id';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<ActivityCategorySlug[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedModality, setSelectedModality] = useState<DataModality | 'Semua'>('Semua');
  const [minRate, setMinRate] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'volume_desc' | 'budget_desc'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleCategory = (slug: ActivityCategorySlug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSelectedModality('Semua');
    setMinRate(0);
  };

  const allProjects = useMemo(
    () => [...customProjects, ...PROJECT_LISTINGS],
    [customProjects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allProjects.filter((p) => {
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.titleEn.toLowerCase().includes(q) &&
        !p.summary.toLowerCase().includes(q) &&
        !p.summaryEn.toLowerCase().includes(q) &&
        !p.categoryLabel.toLowerCase().includes(q) &&
        !(p.categoryLabelEn || '').toLowerCase().includes(q) &&
        !p.location.toLowerCase().includes(q) &&
        !(p.locationEn || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(p.category)
      ) {
        return false;
      }
      if (selectedModality !== 'Semua' && p.dataType !== selectedModality) {
        return false;
      }
      if (minRate > 0 && (p.showBudgetDisclosure === false || p.ratePerUnit < minRate)) {
        return false;
      }
      return true;
    });

    if (sortBy === 'budget_desc') {
      return [...list].sort((a, b) => b.ratePerUnit - a.ratePerUnit);
    }
    if (sortBy === 'volume_desc') {
      return [...list].sort((a, b) => b.targetVolume - a.targetVolume);
    }
    return list;
  }, [allProjects, query, selectedCategories, selectedModality, minRate, sortBy]);

  const FilterControls = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--egvox-text-muted)]">
          {isId ? 'Aktivitas / Kategori' : 'Activity Categories'}
        </h3>
        <div className="mt-3 space-y-2">
          {ACTIVITY_CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="flex cursor-pointer items-center justify-between text-xs text-[var(--egvox-text-secondary)]"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="h-4 w-4 rounded border-[var(--egvox-border-default)] text-[#027F86]"
                />
                <span>{isId ? cat.nameId : cat.nameEn}</span>
              </span>
              <span className="text-[var(--egvox-text-muted)] tabular-nums">
                ({cat.projectCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--egvox-text-muted)]">
          {isId ? 'Tipe Data' : 'Data Modality'}
        </h3>
        <div className="mt-3 space-y-2">
          {(['Semua', 'Video', 'Gambar', 'Multimodal'] as const).map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2 text-xs text-[var(--egvox-text-secondary)]"
            >
              <input
                type="radio"
                name="modality"
                checked={selectedModality === type}
                onChange={() => setSelectedModality(type)}
                className="h-4 w-4 text-[#027F86]"
              />
              <span>
                {type === 'Semua'
                  ? isId
                    ? 'Semua'
                    : 'All'
                  : type === 'Gambar' && locale === 'en'
                  ? 'Image'
                  : type}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--egvox-text-muted)]">
          {isId ? 'Referensi Budget Proyek Vendor' : 'Vendor Project Budget Ref.'}
        </h3>
        <select
          value={minRate}
          onChange={(e) => setMinRate(Number(e.target.value))}
          className="mt-2 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
        >
          <option value={0}>
            {isId ? 'Semua Proyek (Termasuk Tertutup)' : 'All Projects (Incl. Private)'}
          </option>
          <option value={150000}>
            &ge; Rp 150.000 ({egvoxFormatUSD(150000)}) / {isId ? 'unit' : 'unit'}
          </option>
          <option value={200000}>
            &ge; Rp 200.000 ({egvoxFormatUSD(200000)}) / {isId ? 'unit' : 'unit'}
          </option>
          <option value={250000}>
            &ge; Rp 250.000 ({egvoxFormatUSD(250000)}) / {isId ? 'unit' : 'unit'}
          </option>
        </select>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full rounded-lg border border-[var(--egvox-border-default)] py-2 text-xs font-semibold text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]"
      >
        {isId ? 'Reset Filter' : 'Reset Filters'}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--egvox-border-default)] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--egvox-text-primary)]">
              {isId ? 'Katalog Project (Dataset)' : 'Project Catalog (Datasets)'}
            </h1>
            <p className="mt-1 text-sm text-[var(--egvox-text-secondary)]">
              {isId
                ? 'Proyek pengumpulan & anotasi data dari Dataset Vendor terverifikasi. Ajukan minat dan kualifikasi Anda secara profesional.'
                : 'Verified dataset collection & annotation briefs from KYB-checked Vendors. Express interest based on your qualifications.'}
            </p>
          </div>
          <Link
            href="/onboarding/vendor"
            className="rounded-xl bg-[#027F86] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#039998] whitespace-nowrap"
          >
            {isId ? '+ Publikasi Project' : '+ Publish Project'}
          </Link>
        </div>

        {/* Search & Quick Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--egvox-text-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isId
                  ? 'Cari project, aktivitas, atau lokasi...'
                  : 'Search projects, activities, or locations...'
              }
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] py-2.5 pl-10 pr-4 text-sm focus:border-[#027F86] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="inline-flex lg:hidden items-center gap-2 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-4 py-2.5 text-xs font-semibold"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#027F86]" />
              <span>{isId ? 'Filter' : 'Filters'}</span>
            </button>
            <select
              aria-label={isId ? 'Urutkan project' : 'Sort projects'}
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'newest' | 'volume_desc' | 'budget_desc')
              }
              className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2.5 text-xs font-semibold"
            >
              <option value="newest">
                {isId ? 'Urutkan: Terbaru' : 'Sort: Newest'}
              </option>
              <option value="volume_desc">
                {isId ? 'Volume Terbesar' : 'Largest Volume'}
              </option>
              <option value="budget_desc">
                {isId ? 'Budget Referensi Tertinggi' : 'Highest Budget Ref.'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-6 lg:gap-8 lg:grid-cols-12">
        <aside className="hidden lg:block lg:col-span-3 min-w-0">
          <div className="sticky top-20 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
            {FilterControls}
          </div>
        </aside>

        <div className="lg:col-span-9 min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--egvox-text-muted)]">
            <span className="font-semibold text-[var(--egvox-text-primary)] tabular-nums">
              {filtered.length}{' '}
              {isId ? 'Project Ditemukan' : 'Projects Found'}
            </span>
            <span>
              {isId
                ? 'Hanya listing berstatus Published/Active yang ditampilkan'
                : 'Showing only Published / Applications-Open listings'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-[var(--egvox-text-primary)]">
                {isId
                  ? 'Tidak ada project yang cocok dengan filter Anda.'
                  : 'No projects match your current filters.'}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
              >
                {isId ? 'Reset Semua Filter' : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {filtered.map((prj) => {
                const isSaved = savedSlugs.includes(prj.slug);
                const title = isId ? prj.title : prj.titleEn;
                const summary = isId ? prj.summary : prj.summaryEn;
                const unit = isId ? prj.unitLabel : prj.unitLabelEn || 'hour';
                const loc = isId ? prj.location : prj.locationEn || prj.location;
                return (
                  <article
                    key={prj.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]"
                  >
                    <div>
                      <div className="relative aspect-[16/9] bg-[#102326]">
                        <img
                          src={prj.previewImage}
                          alt={title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-2.5 left-2.5 rounded bg-black/75 px-2 py-0.5 text-[11px] font-mono text-white tabular-nums">
                          {prj.previewDuration}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSaved(prj.slug, title)}
                          aria-label={isId ? 'Simpan proyek' : 'Save project'}
                          className="absolute top-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#102326]"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isSaved ? 'fill-[#FC840E] text-[#FC840E]' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--egvox-text-muted)]">
                          <span>{isId ? prj.categoryLabel : prj.categoryLabelEn || prj.categoryLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{prj.captureType}</span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 text-[#16835D] font-medium">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {prj.vendorName}
                          </span>
                        </div>
                        <Link
                          href={`/marketplace/projects/${prj.slug}`}
                          className="mt-2 block text-base font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                        >
                          {title}
                        </Link>
                        <p className="mt-1.5 text-xs text-[var(--egvox-text-secondary)] line-clamp-2">
                          {summary}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--egvox-text-muted)] tabular-nums">
                          <span>
                            {isId ? 'Lokasi' : 'Location'}: {loc}
                          </span>
                          <span>
                            Target: {prj.targetVolume} {unit}
                          </span>
                          <span>
                            {isId ? 'Anotasi' : 'Annotation'}:{' '}
                            {prj.annotationRequired === 'optional'
                              ? isId
                                ? 'Opsional'
                                : 'Optional'
                              : prj.annotationRequired === 'required'
                              ? isId
                                ? 'Wajib'
                                : 'Required'
                              : isId
                              ? 'Tidak'
                              : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[var(--egvox-border-default)] px-4 sm:px-5 py-3.5">
                      {prj.showBudgetDisclosure !== false ? (
                        <div>
                          <span className="block text-[10px] text-[var(--egvox-text-muted)]">
                            {isId ? 'Info Budget Proyek (Opsional)' : 'Vendor Budget Reference'}
                          </span>
                          <DualPrice amountIDR={prj.ratePerUnit} unitLabel={unit} size="sm" />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-[#027F86]">
                          {isId ? 'Penawaran Privat via Rekrutmen' : 'Private Recruitment Offer'}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/marketplace/projects/${prj.slug}`}
                          className="rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold text-[var(--egvox-text-primary)] hover:bg-[var(--egvox-bg-subtle)]"
                        >
                          {isId ? 'Detail' : 'Details'}
                        </Link>
                        <button
                          type="button"
                          onClick={() => openProposalModal(prj)}
                          className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
                        >
                          {isId ? 'Ajukan Minat' : 'Express Interest'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title={isId ? 'Filter Project' : 'Filter Projects'}
      >
        {FilterControls}
        <button
          type="button"
          onClick={() => setMobileFilterOpen(false)}
          className="mt-5 w-full rounded-lg bg-[#027F86] py-2.5 text-sm font-semibold text-white"
        >
          {isId
            ? `Terapkan (${filtered.length} Project)`
            : `Apply (${filtered.length} Projects)`}
        </button>
      </Modal>
    </div>
  );
};
