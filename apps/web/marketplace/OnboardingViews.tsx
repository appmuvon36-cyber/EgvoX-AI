'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, FileUp, ShieldCheck } from 'lucide-react';
import { validateEnterpriseInquiry } from '@/packages/validation-schemas';
import { useAppState } from '@/lib/hooks/useAppState';

export const FreelancerOnboardingView: React.FC = () => {
  const router = useRouter();
  const { locale, setActiveRole, showToast } = useAppState();
  const [step, setStep] = useState(1);
  const [isContributor, setIsContributor] = useState(true);
  const [isAnnotator, setIsAnnotator] = useState(false);
  const [cameraSpec, setCameraSpec] = useState('GoPro Hero 12 (Head/Chest Rig)');
  const [city, setCity] = useState('Jabodetabek');
  const [portfolioConsent, setPortfolioConsent] = useState(true);

  const steps =
    locale === 'id'
      ? ['Profil', 'Keahlian', 'Portfolio', 'Verifikasi']
      : ['Profile', 'Skills', 'Portfolio', 'Verification'];

  const finish = () => {
    setActiveRole('freelancer');
    showToast(
      locale === 'id'
        ? 'Profil Freelancer dikirim untuk moderasi listing.'
        : 'Freelancer profile submitted for listing moderation.'
    );
    router.push('/workspace');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {locale === 'id' ? 'Onboarding Freelancer' : 'Freelancer Onboarding'}
          </h1>
          <p className="mt-1 text-xs text-[var(--egvox-text-muted)]">
            {locale === 'id'
              ? 'Lengkapi kapabilitas per jam agar jasa Anda tampil di Freelancer Service Catalog setelah moderasi.'
              : 'Complete your hourly capabilities to publish your services in the Freelancer Catalog.'}
          </p>
        </div>

        {/* 4 Step Indicator */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((label, idx) => {
            const num = idx + 1;
            const active = step >= num;
            return (
              <div key={label} className="text-center">
                <div
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tabular-nums ${
                    active
                      ? 'bg-[#027F86] text-white'
                      : 'bg-[var(--egvox-bg-subtle)] text-[var(--egvox-text-muted)]'
                  }`}
                >
                  {num}
                </div>
                <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-[var(--egvox-text-secondary)] truncate">
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">
              {locale === 'id' ? 'Pilih Jenis Layanan Anda' : 'Select Your Service Types'}
            </p>
            <label className="flex items-start gap-3 rounded-xl border border-[var(--egvox-border-default)] p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isContributor}
                onChange={(e) => setIsContributor(e.target.checked)}
                className="mt-1 h-4 w-4 text-[#027F86]"
              />
              <div>
                <p className="text-sm font-bold">Video Contributor</p>
                <p className="text-xs text-[var(--egvox-text-secondary)]">
                  {locale === 'id'
                    ? 'Pengambilan data video sudut pandang pertama (egocentric) untuk aktivitas harian atau industri.'
                    : 'First-person egocentric video capture for daily or industrial workflows.'}
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 rounded-xl border border-[var(--egvox-border-default)] p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnnotator}
                onChange={(e) => setIsAnnotator(e.target.checked)}
                className="mt-1 h-4 w-4 text-[#027F86]"
              />
              <div>
                <p className="text-sm font-bold">Data Annotator</p>
                <p className="text-xs text-[var(--egvox-text-secondary)]">
                  {locale === 'id'
                    ? 'Pelabelan data manusia: bounding box, pose estimation, segmentasi temporal, dan tracking.'
                    : 'Human labeling: bounding boxes, pose estimation, temporal segmentation, and tracking.'}
                </p>
              </div>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold">
                {locale === 'id'
                  ? 'Perangkat Kamera / Workstation'
                  : 'Camera Rig / Annotation Workstation'}
              </label>
              <input
                type="text"
                value={cameraSpec}
                onChange={(e) => setCameraSpec(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold">
                {locale === 'id' ? 'Lokasi Cakupan Area' : 'Coverage Area / City'}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold">
              {locale === 'id'
                ? 'Upload Portfolio Preview (30–60 detik, Berizin)'
                : 'Upload Portfolio Preview (30–60s, Consented)'}
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-6 text-center text-xs text-[var(--egvox-text-secondary)]">
              <FileUp className="h-6 w-6 text-[#027F86]" />
              <span>
                {locale === 'id'
                  ? 'Pilih sampel preview ter-watermark (bukan full raw video)'
                  : 'Choose a watermarked preview sample (never upload full raw client video)'}
              </span>
              <input type="file" className="sr-only" />
            </label>
            <label className="flex items-start gap-2.5 text-xs text-[var(--egvox-text-secondary)]">
              <input
                type="checkbox"
                checked={portfolioConsent}
                onChange={(e) => setPortfolioConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#027F86]"
              />
              <span>
                {locale === 'id'
                  ? 'Saya menyatakan memiliki hak dan izin peserta atas portfolio preview ini (tidak mengandung data rahasia klien).'
                  : 'I confirm I hold full rights and participant consent for this preview sample.'}
              </span>
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-xl border border-[#16835D]/30 bg-[#16835D]/8 p-5 space-y-2 text-sm">
            <div className="flex items-center gap-2 font-bold text-[#16835D]">
              <ShieldCheck className="h-5 w-5" />
              <span>
                {locale === 'id'
                  ? 'Siap untuk Verifikasi Identitas (KYC) & Moderasi'
                  : 'Ready for KYC & Listing Moderation'}
              </span>
            </div>
            <p className="text-xs text-[var(--egvox-text-secondary)]">
              {locale === 'id'
                ? 'Setelah disubmit, tim Trust & Safety meninjau profil dan sampel Anda sebelum listing dipublikasikan.'
                : 'Once submitted, Trust & Safety reviews your identity and preview sample prior to public listing.'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
            className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm font-medium"
          >
            {locale === 'id' ? 'Kembali' : 'Back'}
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="rounded-lg bg-[#027F86] px-5 py-2 text-sm font-semibold text-white"
            >
              {locale === 'id' ? 'Lanjutkan' : 'Continue'}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="rounded-lg bg-[#027F86] px-5 py-2 text-sm font-semibold text-white"
            >
              {locale === 'id'
                ? 'Simpan & Masuk Workspace'
                : 'Save & Open Workspace'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const VendorOnboardingView: React.FC = () => {
  const router = useRouter();
  const { locale, setActiveRole, showToast } = useAppState();
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('PT Contoh Data Nusantara');
  const [orgType, setOrgType] = useState('Perusahaan (PT)');
  const [country, setCountry] = useState('Indonesia');

  const steps =
    locale === 'id'
      ? ['Organisasi', 'Legal', 'Representatif', 'Ketentuan']
      : ['Organization', 'Legal', 'Representative', 'Terms'];

  const finish = () => {
    setActiveRole('vendor');
    showToast(
      locale === 'id'
        ? 'Profil organisasi Dataset Vendor dikirim untuk verifikasi.'
        : 'Dataset Vendor organization submitted for verification.'
    );
    router.push('/workspace?role=vendor');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {locale === 'id'
              ? 'Onboarding Dataset Vendor / Data Provider'
              : 'Dataset Vendor / Provider Onboarding'}
          </h1>
          <p className="mt-1 text-xs text-[var(--egvox-text-muted)]">
            {locale === 'id'
              ? 'Organisasi Vendor terverifikasi dapat mempublikasikan Project Catalog dan merekrut kontributor.'
              : 'Verified Vendor organizations can publish Project Catalog briefs and hire contributors.'}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {steps.map((label, idx) => (
            <div key={label} className="text-center">
              <div
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  step >= idx + 1
                    ? 'bg-[#027F86] text-white'
                    : 'bg-[var(--egvox-bg-subtle)] text-[var(--egvox-text-muted)]'
                }`}
              >
                {idx + 1}
              </div>
              <p className="mt-1 text-[10px] sm:text-[11px] truncate">{label}</p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold">
                {locale === 'id'
                  ? 'Nama Perusahaan / Organisasi *'
                  : 'Company / Organization Name *'}
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold">
                {locale === 'id' ? 'Jenis Organisasi *' : 'Organization Type *'}
              </label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              >
                <option value="Perusahaan (PT)">
                  {locale === 'id' ? 'Perusahaan (PT)' : 'Corporation / LLC'}
                </option>
                <option value="Lembaga Riset / Universitas">
                  {locale === 'id'
                    ? 'Lembaga Riset / Universitas'
                    : 'Research Lab / University'}
                </option>
                <option value="Data Collection Studio">
                  Data Collection Studio
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold">
                {locale === 'id' ? 'Negara *' : 'Country *'}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              >
                <option value="Indonesia">Indonesia</option>
                <option value="Singapore">{locale === 'id' ? 'Singapura' : 'Singapore'}</option>
                <option value="United States">{locale === 'id' ? 'Amerika Serikat' : 'United States'}</option>
              </select>
            </div>
          </div>
        )}

        {step > 1 && (
          <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-5 text-sm text-[var(--egvox-text-secondary)]">
            {locale === 'id'
              ? `Langkah ${step} (${steps[step - 1]}): Unggah dokumen registrasi organisasi / NPWP, data kontak representatif berwenang, serta persetujuan Vendor Terms & Data Protection Schedule.`
              : `Step ${step} (${steps[step - 1]}): Attach business registration documents, authorized representative contact details, and Vendor Data Protection Schedule agreement.`}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
            className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm"
          >
            {locale === 'id' ? 'Kembali' : 'Back'}
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="rounded-lg bg-[#027F86] px-5 py-2 text-sm font-semibold text-white"
            >
              {locale === 'id' ? 'Lanjutkan' : 'Continue'}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="rounded-lg bg-[#027F86] px-5 py-2 text-sm font-semibold text-white"
            >
              {locale === 'id'
                ? 'Selesaikan Onboarding Vendor'
                : 'Complete Vendor Onboarding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const EnterprisePartnershipView: React.FC = () => {
  const { locale, submitEnterpriseInquiry } = useAppState();
  const [companyName, setCompanyName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [estimatedVolume, setEstimatedVolume] = useState('50 – 250 jam');
  const [requirementSummary, setRequirementSummary] = useState('');
  const [consentToContact, setConsentToContact] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateEnterpriseInquiry(
      {
        companyName,
        businessEmail,
        contactPerson,
        country,
        estimatedVolume,
        requirementSummary,
        consentToContact,
      },
      locale
    );
    if (!res.valid) {
      setErrors(res.errors);
      return;
    }
    setErrors({});
    submitEnterpriseInquiry({
      companyName,
      country,
      businessEmail,
      contactPerson,
      estimatedVolume,
      requirementSummary,
    });
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#FC840E]">
            {locale === 'id' ? 'Operasi Terkelola Enterprise' : 'Enterprise Managed Operations'}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-[var(--egvox-text-primary)]">
            {locale === 'id'
              ? 'Permintaan Kemitraan Enterprise (Inquiry)'
              : 'Enterprise Partnership Request (RFP)'}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--egvox-text-secondary)]">
            {locale === 'id' ? (
              <>
                Ini adalah formulir permintaan kerja sama berstatus{' '}
                <strong>submitted</strong>, bukan kontrak atau pemesanan otomatis. Enterprise berkontrak langsung dengan EgvoX untuk membuat Official Project.
              </>
            ) : (
              <>
                Submitting this form opens a partnership inquiry in{' '}
                <strong>submitted</strong> status — not an automated contract. Enterprise Buyers contract directly with EgvoX to provision an Official Project.
              </>
            )}
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-[#16835D]/30 bg-[#16835D]/8 p-6 space-y-3">
            <p className="flex items-center gap-2 text-base font-bold text-[#16835D]">
              <CheckCircle2 className="h-5 w-5" />
              {locale === 'id'
                ? 'Permintaan Kemitraan Berhasil Dikirim'
                : 'Partnership Request Submitted'}
            </p>
            <p className="text-sm text-[var(--egvox-text-secondary)]">
              {locale === 'id'
                ? 'Anda dapat memantau status pipeline RFP dan meninjau dokumen melalui Workspace Pelanggan.'
                : 'You can track RFP status and review onboarding documents inside Customer Workspace.'}
            </p>
            <Link
              href="/workspace?role=enterprise"
              className="inline-flex rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
            >
              {locale === 'id'
                ? 'Buka Enterprise Workspace'
                : 'Open Enterprise Workspace'}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {locale === 'id' ? 'Nama Perusahaan *' : 'Company Name *'}
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={locale === 'id' ? 'PT Contoh Teknologi' : 'Acme Robotics Inc.'}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-[#C43D3D]">{errors.companyName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {locale === 'id' ? 'Email Bisnis *' : 'Business Email *'}
                </label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="data-ops@enterprise.com"
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
                {errors.businessEmail && (
                  <p className="mt-1 text-xs text-[#C43D3D]">{errors.businessEmail}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold">
                  {locale === 'id' ? 'Kontak PIC *' : 'Contact Person *'}
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder={locale === 'id' ? 'Nama & Jabatan' : 'Name & Title'}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-xs text-[#C43D3D]">{errors.contactPerson}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {locale === 'id' ? 'Negara *' : 'Country *'}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                >
                  <option value="Indonesia">Indonesia</option>
                  <option value="Singapore">{locale === 'id' ? 'Singapura' : 'Singapore'}</option>
                  <option value="Japan">{locale === 'id' ? 'Jepang' : 'Japan'}</option>
                  <option value="United States">{locale === 'id' ? 'Amerika Serikat' : 'United States'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {locale === 'id' ? 'Estimasi Volume (Jam) *' : 'Estimated Hours *'}
                </label>
                <select
                  value={estimatedVolume}
                  onChange={(e) => setEstimatedVolume(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                >
                  <option value="20 – 50 jam">
                    {locale === 'id' ? '20 – 50 jam' : '20 – 50 hours'}
                  </option>
                  <option value="50 – 250 jam">
                    {locale === 'id' ? '50 – 250 jam' : '50 – 250 hours'}
                  </option>
                  <option value="250+ jam">
                    {locale === 'id' ? '250+ jam' : '250+ hours'}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold">
                {locale === 'id'
                  ? 'Kebutuhan Data & Anotasi *'
                  : 'Data & Annotation Requirements *'}
              </label>
              <textarea
                rows={4}
                value={requirementSummary}
                onChange={(e) => setRequirementSummary(e.target.value)}
                placeholder={
                  locale === 'id'
                    ? 'Pengumpulan video aktivitas manufaktur dan quality check + format JSONL...'
                    : 'Egocentric manufacturing assembly footage + JSONL temporal annotations...'
                }
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
              {errors.requirementSummary && (
                <p className="mt-1 text-xs text-[#C43D3D]">{errors.requirementSummary}</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[var(--egvox-text-secondary)]">
              <input
                type="checkbox"
                checked={consentToContact}
                onChange={(e) => setConsentToContact(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#027F86]"
              />
              <span>
                {locale === 'id'
                  ? 'Saya menyetujui tim EgvoX menghubungi organisasi saya untuk proses kualifikasi.'
                  : 'I consent to EgvoX contacting my organization to qualify this partnership request.'}
              </span>
            </label>
            {errors.consentToContact && (
              <p className="text-xs text-[#C43D3D]">{errors.consentToContact}</p>
            )}

            <button
              type="submit"
              className="h-11 rounded-xl bg-[#027F86] px-6 text-sm font-semibold text-white hover:bg-[#039998]"
            >
              {locale === 'id' ? 'Kirim Permintaan' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
