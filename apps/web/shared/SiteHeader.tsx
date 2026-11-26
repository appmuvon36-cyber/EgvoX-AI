'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Globe,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { EgvoXLogo, PWAInstallButton } from '@/packages/design-system';
import { dictionaries } from '@/packages/localization/dictionaries';
import { useAppState } from '@/lib/hooks/useAppState';

export const SiteHeader: React.FC = () => {
  const pathname = usePathname();
  const {
    locale,
    setLocale,
    theme,
    toggleTheme,
    notifications,
    setNotificationsModalOpen,
  } = useAppState();
  const t = dictionaries[locale];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isMarketplaceArea =
    pathname.startsWith('/marketplace') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/providers') ||
    pathname.startsWith('/freelancers') ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/freelancer/dashboard') ||
    pathname.startsWith('/vendor/dashboard') ||
    pathname.startsWith('/enterprise/dashboard') ||
    pathname.startsWith('/workspace');

  const navLinks = isMarketplaceArea
    ? [
        { href: '/marketplace', label: t.nav.explore },
        { href: '/marketplace/projects', label: t.nav.projects },
        { href: '/marketplace/services', label: t.nav.services },
        { href: '/workspace', label: t.nav.openWorkspace },
        { href: '/resources', label: t.nav.resources },
      ]
    : [
        { href: '/#apa-itu-egvox', label: t.nav.platform },
        { href: '/#cara-kerja', label: t.nav.howItWorks },
        { href: '/marketplace', label: t.nav.marketplace },
        { href: '/enterprise/partnership', label: t.nav.enterprise },
        { href: '/resources', label: t.nav.resources },
      ];

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark only */}
        <Link
          href={isMarketplaceArea ? '/marketplace' : '/'}
          className="inline-flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04B8B4] rounded-md"
          aria-label="EgvoX Home"
        >
          <EgvoXLogo width={128} className="w-[96px] sm:w-[128px]" />
        </Link>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label={locale === 'id' ? 'Navigasi utama' : 'Main navigation'}
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[var(--egvox-text-secondary)]"
        >
          {navLinks.map((item) => {
            const isActive =
              item.href !== '/' &&
              !item.href.includes('#') &&
              (item.href === '/marketplace'
                ? pathname === '/marketplace'
                : pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#027F86] dark:hover:text-[#04B8B4] ${
                  isActive
                    ? 'font-semibold text-[#027F86] dark:text-[#04B8B4]'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Clean Action Controls + 1 Primary CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              aria-label={locale === 'id' ? 'Ganti bahasa' : 'Switch language'}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] px-2.5 text-xs font-semibold text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)] transition-colors whitespace-nowrap shrink-0"
            >
              <Globe className="h-3.5 w-3.5 text-[#027F86] dark:text-[#04B8B4]" />
              <span>{locale.toUpperCase()}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark'
                  ? locale === 'id'
                    ? 'Mode terang'
                    : 'Light mode'
                  : locale === 'id'
                  ? 'Mode gelap'
                  : 'Dark mode'
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--egvox-border-default)] text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)] transition-colors shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[#FDBA27]" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="hidden sm:block">
            <PWAInstallButton compact />
          </div>

          {isMarketplaceArea && (
            <button
              type="button"
              onClick={() => setNotificationsModalOpen(true)}
              aria-label={t.nav.notifications}
              className="relative inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-[var(--egvox-border-default)] text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)] transition-colors shrink-0"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C43D3D] px-1 text-[10px] font-bold text-white tabular-nums">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          )}

          <Link
            href="/login"
            className="hidden sm:inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-[var(--egvox-text-secondary)] hover:text-[#027F86] dark:hover:text-[#04B8B4] whitespace-nowrap shrink-0"
          >
            {t.nav.signIn}
          </Link>

          <Link
            href={isMarketplaceArea ? '/register' : '/marketplace'}
            className="inline-flex h-8 sm:h-9 items-center justify-center rounded-lg bg-[#027F86] px-2.5 sm:px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#039998] transition-colors whitespace-nowrap shrink-0"
          >
            {isMarketplaceArea ? t.nav.joinEgvox : t.nav.marketplace}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={locale === 'id' ? 'Menu navigasi' : 'Navigation menu'}
            className="inline-flex lg:hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)] shrink-0"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--egvox-text-primary)] hover:bg-[var(--egvox-bg-subtle)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]"
            >
              {t.nav.corporateSite}
            </Link>
          </nav>

          <div className="flex items-center justify-between gap-2 border-t border-[var(--egvox-border-default)] pt-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] px-3 text-xs font-semibold text-[var(--egvox-text-secondary)]"
              >
                <Globe className="h-4 w-4 text-[#027F86]" />
                <span>{locale === 'id' ? 'Bahasa: ID' : 'Language: EN'}</span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] px-3 text-xs font-semibold text-[var(--egvox-text-secondary)]"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 text-[#FDBA27]" />
                    <span>{locale === 'id' ? 'Terang' : 'Light'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>{locale === 'id' ? 'Gelap' : 'Dark'}</span>
                  </>
                )}
              </button>
            </div>
            <PWAInstallButton compact />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 items-center justify-center rounded-lg border border-[var(--egvox-border-default)] text-sm font-semibold text-[var(--egvox-text-primary)]"
            >
              {t.nav.signIn}
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 items-center justify-center rounded-lg bg-[#027F86] text-sm font-semibold text-white"
            >
              {t.nav.joinEgvox}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
