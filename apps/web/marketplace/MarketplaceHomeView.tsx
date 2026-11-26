'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Car,
  ChefHat,
  Factory,
  FolderKanban,
  Heart,
  HeartPulse,
  Home,
  Search,
  ShieldCheck,
  Star,
  Store,
  Truck,
  Users,
} from 'lucide-react';
import { DualPrice } from '@/packages/design-system';
import { dictionaries } from '@/packages/localization/dictionaries';
import {
  ACTIVITY_CATEGORIES,
  FREELANCER_SERVICES,
  PROJECT_LISTINGS,
} from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';
import { ActivityCategorySlug } from '@/packages/shared-types';

const CATEGORY_ICONS: Record<ActivityCategorySlug, React.ElementType> = {
  cooking: ChefHat,
  manufacturing: Factory,
  automotive: Car,
  warehouse: Truck,
  household: Home,
  retail: Store,
  office: Briefcase,
  healthcare: HeartPulse,
};

export const MarketplaceHomeView: React.FC = () => {
  const router = useRouter();
  const {
    locale,
    savedSlugs,
    toggleSaved,
    openProposalModal,
    openServiceOrderModal,
    customProjects,
    customServices,
  } = useAppState();
  const t = dictionaries[locale];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTarget, setSearchTarget] = useState<'projects' | 'services'>('projects');

  const allProjects = [...customProjects, ...PROJECT_LISTINGS];
  const allServices = [...customServices, ...FREELANCER_SERVICES];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const base =
      searchTarget === 'projects'
        ? '/marketplace/projects'
        : '/marketplace/services';
    router.push(
      searchQuery.trim()
        ? `${base}?q=${encodeURIComponent(searchQuery.trim())}`
        : base
    );
  };

  return (
    <div className="bg-[var(--egvox-bg-canvas)]">
      {/* Hero Discovery Banner */}
      <section className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 min-w-0 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#027F86] dark:text-[#04B8B4]">
                {t.marketplace.kicker}
              </p>
              <h1 className="text-balance text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--egvox-text-primary)]">
                {t.marketplace.heroTitle}
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-[var(--egvox-text-secondary)]">
                {t.marketplace.heroSubtitle}
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-2 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-2"
              >
                <div className="flex flex-1 items-center gap-2 px-2">
                  <Search className="h-4 w-4 shrink-0 text-[var(--egvox-text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.marketplace.searchPlaceholder}
                    className="w-full bg-transparent py-2 text-sm text-[var(--egvox-text-primary)] placeholder:text-[var(--egvox-text-muted)] focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <select
                    aria-label={locale === 'id' ? 'Target pencarian' : 'Search target'}
                    value={searchTarget}
                    onChange={(e) =>
                      setSearchTarget(e.target.value as 'projects' | 'services')
                    }
                    className="h-10 flex-1 sm:flex-none rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 text-xs font-semibold text-[var(--egvox-text-primary)]"
                  >
                    <option value="projects">{locale === 'id' ? 'Project' : 'Projects'}</option>
                    <option value="services">Freelancer</option>
                  </select>
                  <button
                    type="submit"
                    className="inline-flex h-10 flex-1 sm:flex-none items-center justify-center rounded-xl bg-[#027F86] px-5 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
                  >
                    {t.marketplace.searchButton}
                  </button>
                </div>
              </form>

              {/* Two Prominent Catalog Entry Cards */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <Link
                  href="/marketplace/projects"
                  className="group flex items-center justify-between gap-4 rounded-2xl bg-[#027F86] p-5 text-white hover:bg-[#039998] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5" />
                      <h2 className="text-base font-bold">
                        {t.marketplace.projectCatalogTitle}
                      </h2>
                    </div>
                    <p className="text-xs text-white/85">
                      {t.marketplace.projectCatalogDesc}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>

                <Link
                  href="/marketplace/services"
                  className="group flex items-center justify-between gap-4 rounded-2xl bg-[#FC840E] p-5 text-white hover:bg-[#e57407] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <h2 className="text-base font-bold">
                        {t.marketplace.serviceCatalogTitle}
                      </h2>
                    </div>
                    <p className="text-xs text-white/95">
                      {t.marketplace.serviceCatalogDesc}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Showcase Collage */}
            <div className="lg:col-span-5 min-w-0 grid grid-cols-2 gap-3">
              <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--egvox-border-default)]">
                <img
                  src="/images/capture_cooking_pov_1795676769816.jpg"
                  alt="Egocentric Cooking Capture"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white">
                  {locale === 'id'
                    ? 'Memasak · Sudut Pandang Egocentric'
                    : 'Cooking · Egocentric POV'}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--egvox-border-default)]">
                <img
                  src="/images/capture_automotive_pov_1795676770764.jpg"
                  alt="Automotive POV"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--egvox-border-default)]">
                <img
                  src="/images/capture_manufacturing_pov_1795676770652.jpg"
                  alt="Manufacturing Assembly POV"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Trust Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--egvox-border-default)] pt-5 text-xs font-medium text-[var(--egvox-text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#16835D]" />{' '}
              {locale === 'id' ? 'Proyek Terverifikasi' : 'Verified Projects'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#027F86]" />{' '}
              {locale === 'id' ? 'Talenta Berkualitas (KYC)' : 'KYC-Verified Talent'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-[#2563A6]" />{' '}
              {locale === 'id' ? 'Penanganan Raw Video Privat' : 'Private Raw Video Handling'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 text-[#FC840E]" />{' '}
              {locale === 'id' ? 'SLA & Jaminan Kualitas' : 'SLA & Quality Assurance'}
            </span>
          </div>
        </div>
      </section>

      {/* Kategori Aktivitas */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--egvox-text-primary)]">
            {t.marketplace.browseCategories}
          </h2>
          <Link
            href="/marketplace/projects"
            className="text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
          >
            {t.marketplace.allCategories}
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {ACTIVITY_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 text-center hover:border-[#027F86] transition-colors"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#027F86]/10 text-[#027F86] dark:text-[#04B8B4]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-[var(--egvox-text-primary)] line-clamp-1">
                  {locale === 'id'
                    ? cat.nameId.split('&')[0].trim()
                    : cat.nameEn.split('&')[0].trim()}
                </span>
                <span className="text-[11px] text-[var(--egvox-text-muted)] tabular-nums">
                  {cat.projectCount} {locale === 'id' ? 'proyek' : 'projects'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Project Unggulan */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--egvox-text-primary)]">
              {t.marketplace.featuredProjects}
            </h2>
            <p className="text-xs text-[var(--egvox-text-muted)]">
              {locale === 'id'
                ? 'Listing proyek pengumpulan dataset aktif yang siap menerima proposal'
                : 'Active verified dataset collection projects open for contributor proposals'}
            </p>
          </div>
          <Link
            href="/marketplace/projects"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
          >
            <span>{t.marketplace.viewAll}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {allProjects.slice(0, 4).map((prj) => {
            const isSaved = savedSlugs.includes(prj.slug);
            const title = locale === 'id' ? prj.title : prj.titleEn;
            const unit = locale === 'id' ? prj.unitLabel : prj.unitLabelEn || 'hour';
            return (
              <article
                key={prj.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-[#102326]">
                    <img
                      src={prj.previewImage}
                      alt={title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[11px] font-mono text-white tabular-nums">
                      {prj.previewDuration}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSaved(prj.slug, title)}
                      aria-label={locale === 'id' ? 'Simpan' : 'Save'}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#102326]"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isSaved ? 'fill-[#FC840E] text-[#FC840E]' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] text-[var(--egvox-text-muted)]">
                      {locale === 'id' ? prj.categoryLabel : prj.categoryLabelEn || prj.categoryLabel} · {prj.dataType} · {prj.country}
                    </p>
                    <Link
                      href={`/marketplace/projects/${prj.slug}`}
                      className="mt-1.5 block text-sm font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86] line-clamp-2"
                    >
                      {title}
                    </Link>
                    <p className="mt-2 text-xs text-[var(--egvox-text-muted)] tabular-nums">
                      Target {prj.targetVolume} {unit} ·{' '}
                      {locale === 'id' ? prj.deadline : prj.deadlineEn || prj.deadline}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--egvox-border-default)] px-4 py-3">
                  <DualPrice amountIDR={prj.ratePerUnit} unitLabel={unit} size="sm" />
                  <button
                    type="button"
                    onClick={() => openProposalModal(prj)}
                    className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
                  >
                    {locale === 'id' ? 'Proposal' : 'Apply'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Freelancer Unggulan */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--egvox-text-primary)]">
              {t.marketplace.featuredFreelancers}
            </h2>
            <p className="text-xs text-[var(--egvox-text-muted)]">
              {locale === 'id'
                ? 'Kontributor video egocentric & data annotator siap di-order per jam'
                : 'Egocentric video contributors & annotators available for hourly orders'}
            </p>
          </div>
          <Link
            href="/marketplace/services"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
          >
            <span>{t.marketplace.viewAll}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {allServices.slice(0, 3).map((srv) => {
            const title = locale === 'id' ? srv.title : srv.titleEn;
            const unit = locale === 'id' ? srv.unitLabel : srv.unitLabelEn || 'hour';
            const sla = locale === 'id' ? srv.deliverySla : srv.deliverySlaEn || srv.deliverySla;
            const cap =
              locale === 'id' ? srv.capacityLabel : srv.capacityLabelEn || srv.capacityLabel;
            return (
              <article
                key={srv.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={srv.avatar}
                        alt={srv.freelancerName}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <Link
                          href={`/freelancers/${srv.username}`}
                          className="text-sm font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                        >
                          {srv.freelancerName}
                        </Link>
                        <p className="text-xs text-[var(--egvox-text-muted)]">
                          {srv.roleType} · {locale === 'id' ? srv.location : srv.locationEn || srv.location}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
                      <Star className="h-3.5 w-3.5 fill-[#FDBA27] text-[#FDBA27]" />
                      {srv.rating}
                    </span>
                  </div>
                  <Link
                    href={`/marketplace/services/${srv.slug}`}
                    className="mt-3 block text-sm font-semibold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                  >
                    {title}
                  </Link>
                  <p className="mt-1.5 text-xs text-[var(--egvox-text-muted)]">
                    SLA {sla} · {locale === 'id' ? 'Kapasitas' : 'Capacity'} {cap}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--egvox-border-default)] pt-3">
                  <DualPrice amountIDR={srv.pricePerUnit} unitLabel={unit} size="sm" />
                  <button
                    type="button"
                    onClick={() => openServiceOrderModal(srv)}
                    className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
                  >
                    {t.marketplace.requestOrder}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
