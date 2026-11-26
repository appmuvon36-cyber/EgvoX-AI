'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EgvoXLogo } from '@/packages/design-system';
import { useAppState } from '@/lib/hooks/useAppState';

export const SiteFooter: React.FC = () => {
  const pathname = usePathname();
  const { locale } = useAppState();

  const isDedicatedPortal =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/ops') ||
    pathname.startsWith('/workspace') ||
    pathname.startsWith('/freelancer/dashboard') ||
    pathname.startsWith('/vendor/dashboard') ||
    pathname.startsWith('/enterprise/dashboard');

  if (isDedicatedPortal) {
    return null;
  }

  return (
    <footer className="border-t border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] pb-20 lg:pb-10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <EgvoXLogo width={132} />
            <p className="text-sm leading-relaxed text-[var(--egvox-text-secondary)]">
              {locale === 'id'
                ? 'Marketplace dan managed data operations platform untuk pengumpulan video egocentric, anotasi manusia, dan pengiriman dataset terstruktur.'
                : 'Marketplace and managed data operations platform for egocentric video capture, human annotation, and structured dataset delivery.'}
            </p>
            <p className="text-xs text-[var(--egvox-text-muted)]">
              {locale === 'id'
                ? 'Platform Jaringan Data Pengalaman Manusia'
                : 'Human-Experience Data Network Platform'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--egvox-text-primary)]">
              {locale === 'id' ? 'Katalog & Ekosistem' : 'Catalog & Ecosystem'}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--egvox-text-secondary)]">
              <li>
                <Link href="/marketplace" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Beranda Marketplace' : 'Marketplace Home'}
                </Link>
              </li>
              <li>
                <Link href="/marketplace/projects" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Katalog Project' : 'Project Catalog'}
                </Link>
              </li>
              <li>
                <Link href="/marketplace/services" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Katalog Layanan Freelancer' : 'Freelancer Service Catalog'}
                </Link>
              </li>
              <li>
                <Link href="/workspace" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Customer Workspace (app)' : 'Customer Workspace (app)'}
                </Link>
              </li>
              <li>
                <Link href="/ops" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Data Operations (ops)' : 'Data Operations (ops)'}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Super Admin Control Plane' : 'Super Admin Control Plane'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--egvox-text-primary)]">
              {locale === 'id' ? 'Onboarding Peran' : 'Role Onboarding'}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--egvox-text-secondary)]">
              <li>
                <Link href="/onboarding/freelancer" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Gabung Video Contributor & Annotator' : 'Join as Contributor & Annotator'}
                </Link>
              </li>
              <li>
                <Link href="/onboarding/vendor" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Daftar Dataset Vendor' : 'Register Dataset Vendor'}
                </Link>
              </li>
              <li>
                <Link href="/enterprise/partnership" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Permintaan Enterprise (RFP)' : 'Enterprise Partnership Request'}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Buat Akun EgvoX' : 'Create EgvoX Account'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--egvox-text-primary)]">
              {locale === 'id' ? 'Tata Kelola & Bantuan' : 'Governance & Support'}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--egvox-text-secondary)]">
              <li>
                <Link href="/resources" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Pusat Bantuan & FAQ' : 'Help Center & FAQ'}
                </Link>
              </li>
              <li>
                <Link href="/resources#rights" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Kebijakan Hak Data & Consent' : 'Data Rights & Consent Policy'}
                </Link>
              </li>
              <li>
                <Link href="/resources#privacy" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Kebijakan Privasi & Ketentuan' : 'Privacy Policy & Terms'}
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-[#027F86] dark:hover:text-[#04B8B4]">
                  {locale === 'id' ? 'Status Layanan' : 'Service Status'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[var(--egvox-border-default)] pt-6 text-xs text-[var(--egvox-text-muted)]">
          <p>
            {locale === 'id'
              ? '© 2026 EgvoX. Seluruh hak cipta dilindungi.'
              : '© 2026 EgvoX. All rights reserved.'}
          </p>
          <p>
            {locale === 'id'
              ? 'Raw video diproses melalui penyimpanan privat terenkripsi dan kendali izin eksplisit.'
              : 'Raw video assets are handled exclusively through private storage and explicit rights consent.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
