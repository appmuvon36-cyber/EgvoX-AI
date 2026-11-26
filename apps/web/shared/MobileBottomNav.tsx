'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Compass,
  FolderKanban,
  Heart,
  LayoutDashboard,
} from 'lucide-react';
import { useAppState } from '@/lib/hooks/useAppState';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { savedSlugs, locale } = useAppState();

  const showBar =
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

  if (!showBar) return null;

  const tabs = [
    {
      href: '/marketplace',
      label: locale === 'id' ? 'Beranda' : 'Explore',
      icon: Compass,
      active: pathname === '/marketplace',
    },
    {
      href: '/marketplace/projects',
      label: locale === 'id' ? 'Project' : 'Projects',
      icon: FolderKanban,
      active:
        pathname.startsWith('/marketplace/projects') ||
        pathname.startsWith('/projects'),
    },
    {
      href: '/marketplace/services',
      label: locale === 'id' ? 'Layanan' : 'Services',
      icon: Briefcase,
      active:
        pathname.startsWith('/marketplace/services') ||
        pathname.startsWith('/services'),
    },
    {
      href: '/workspace?tab=saved',
      label: locale === 'id' ? 'Tersimpan' : 'Saved',
      icon: Heart,
      badge: savedSlugs.length,
      active: false,
    },
    {
      href: '/workspace',
      label: 'Workspace',
      icon: LayoutDashboard,
      active:
        pathname.startsWith('/workspace') ||
        pathname.startsWith('/freelancer/dashboard') ||
        pathname.startsWith('/vendor/dashboard') ||
        pathname.startsWith('/enterprise/dashboard'),
    },
  ];

  return (
    <nav
      aria-label={locale === 'id' ? 'Navigasi bawah mobile' : 'Mobile bottom navigation'}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="grid h-14 grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                tab.active
                  ? 'text-[#027F86] dark:text-[#04B8B4] font-semibold'
                  : 'text-[var(--egvox-text-muted)] hover:text-[var(--egvox-text-primary)]'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#FC840E] px-1 text-[9px] font-bold text-white tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
