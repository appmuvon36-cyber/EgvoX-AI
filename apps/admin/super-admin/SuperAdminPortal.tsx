'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  Eye,
  FileCheck2,
  FolderKanban,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Moon,
  Scale,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Tag,
  UserCheck,
  X,
} from 'lucide-react';
import { EgvoXLogo } from '@/packages/design-system';
import { useAppState } from '@/lib/hooks/useAppState';
import { SuperAdminDashboardView } from './SuperAdminDashboardView';
import { BreakGlassAccessModal } from './SuperAdminModals';
import { egvoxAuth, egvoxApi } from '@/lib/egvox-api';
import {
  AdminModulePart1Id,
  SuperAdminModulesPart1,
} from './SuperAdminModulesPart1';
import {
  AdminModulePart2Id,
  SuperAdminModulesPart2,
} from './SuperAdminModulesPart2';

export type AdminModuleId = 'dashboard' | AdminModulePart1Id | AdminModulePart2Id;

const ADMIN_NAV_ITEMS: {
  id: AdminModuleId;
  labelId: string;
  labelEn: string;
  icon: React.ElementType;
}[] = [
  { id: 'dashboard', labelId: 'Dashboard', labelEn: 'Dashboard', icon: LayoutDashboard },
  { id: 'verification', labelId: 'Verifikasi Pengguna', labelEn: 'User Verification', icon: UserCheck },
  { id: 'moderation', labelId: 'Moderasi Listing', labelEn: 'Listing Moderation', icon: CheckCircle2 },
  { id: 'projects', labelId: 'Manajemen Proyek', labelEn: 'Project Management', icon: FolderKanban },
  { id: 'orders', labelId: 'Orders & Work Order', labelEn: 'Orders & Work Orders', icon: FileCheck2 },
  { id: 'ops_monitor', labelId: 'Data Operations (Monitor)', labelEn: 'Data Operations (Monitor)', icon: Activity },
  { id: 'media_qa', labelId: 'Media & QA Review', labelEn: 'Media & QA Review', icon: Eye },
  { id: 'annotation_oversight', labelId: 'Annotation Oversight', labelEn: 'Annotation Oversight', icon: Tag },
  { id: 'enterprise', labelId: 'Enterprise & CRM', labelEn: 'Enterprise & CRM', icon: Building2 },
  { id: 'finance', labelId: 'Keuangan (Finance)', labelEn: 'Finance & Payouts', icon: CreditCard },
  { id: 'rights', labelId: 'Rights & Compliance', labelEn: 'Rights & Compliance', icon: ShieldCheck },
  { id: 'disputes', labelId: 'Disputes & Cases', labelEn: 'Disputes & Cases', icon: Scale },
  { id: 'analytics', labelId: 'Laporan & Analitik', labelEn: 'Reports & Analytics', icon: BarChart3 },
  { id: 'audit', labelId: 'Audit Log', labelEn: 'Audit Log', icon: Lock },
  { id: 'config', labelId: 'Konfigurasi Sistem', labelEn: 'System Configuration', icon: Settings },
];

const PART1_IDS: AdminModulePart1Id[] = [
  'verification',
  'moderation',
  'projects',
  'orders',
  'ops_monitor',
  'media_qa',
  'annotation_oversight',
];

export const SuperAdminPortal: React.FC<{
  forceLoginScreen?: boolean;
}> = ({ forceLoginScreen = false }) => {
  const {
    locale,
    setLocale,
    theme,
    toggleTheme,
    notifications,
    setNotificationsModalOpen,
    showToast,
  } = useAppState();
  const isId = locale === 'id';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [factorId, setFactorId] = useState('');
  useEffect(() => { let active = true; (async () => { try { const session = await fetch('/api/auth/session', { cache: 'no-store' }).then(r => r.json()); if (!session.authenticated) return; const [roles, assurance] = await Promise.all([egvoxApi<{items:{id:string}[]}>('/me/roles'), egvoxApi<{aal:string;recent_mfa:boolean}>('/sessions')]); if (active && roles.items.some(r => r.id === 'super_admin') && assurance.aal === 'aal2' && assurance.recent_mfa) setIsAuthenticated(true); } catch { if (active) setIsAuthenticated(false); } })(); return () => { active = false; }; }, []);

  // 2-Step Provisioned Login + Mandatory 6-Digit MFA
  const [loginStep, setLoginStep] = useState<'credentials' | 'mfa'>('credentials');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const [activeModule, setActiveModule] = useState<AdminModuleId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [breakGlassOpen, setBreakGlassOpen] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthError('');
    try {
      await egvoxAuth('signin', { email: adminEmail, password: adminPassword });
      const roles = await egvoxApi<{items:{id:string}[]}>('/me/roles');
      if (!roles.items.some((role) => role.id === 'super_admin')) {
        await egvoxAuth('signout'); throw new Error('This account is not provisioned as Super Admin.');
      }
      const assurance = await egvoxApi<{aal:string;recent_mfa:boolean}>('/sessions');
      if (assurance.aal !== 'aal2' || !assurance.recent_mfa) {
        const factors = await fetch('/api/auth/mfa-list', { cache: 'no-store' }).then(r => r.json());
        const factor = [...(factors.totp || []), ...(factors.phone || [])].find((item:any) => item.status === 'verified');
        if (!factor) { window.location.assign('/account/security'); return; }
        setFactorId(factor.id); setLoginStep('mfa'); return;
      }
      setIsAuthenticated(true);
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Authentication failed'); }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthError('');
    if (!factorId || !/^\\d{6}$/.test(mfaCode)) { setAuthError('Enter a valid 6-digit authenticator code.'); return; }
    try {
      const challenge = await egvoxAuth('mfa-challenge', { factor_id: factorId });
      await egvoxAuth('mfa-verify', { factor_id: factorId, challenge_id: challenge.challenge.id, code: mfaCode });
      const assurance = await egvoxApi<{aal:string;recent_mfa:boolean}>('/sessions');
      if (assurance.aal !== 'aal2' || !assurance.recent_mfa) throw new Error('Recent MFA assurance was not established.');
      setIsAuthenticated(true);
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'MFA verification failed'); }
  };

  const handleAdminLogout = async () => {
    await egvoxAuth('signout'); setIsAuthenticated(false); setLoginStep('credentials');
    showToast(isId ? 'Sesi Super Admin ditutup.' : 'Super Admin session closed.');
  };

  if (!isAuthenticated || forceLoginScreen) {
    return (
      <div className="min-h-screen bg-[#102326] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-primary)] p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className="rounded-lg border border-[var(--egvox-border-default)] px-2.5 py-1 text-[11px] font-bold"
            >
              {locale.toUpperCase()}
            </button>
          </div>
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <EgvoXLogo width={132} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#FC840E]">
              Super Admin Control Plane — admin.egvox.ai
            </p>
            <h1 className="text-xl font-bold">
              {loginStep === 'credentials'
                ? isId
                  ? 'Login Internal Control Plane'
                  : 'Internal Control Plane Login'
                : isId
                ? 'Verifikasi MFA (Wajib 6-Digit)'
                : 'MFA Verification (6-Digit Required)'}
            </h1>
            <p className="text-xs text-[var(--egvox-text-secondary)]">
              {loginStep === 'credentials'
                ? isId
                  ? 'Akses hanya untuk akun yang telah diprovisioning oleh EgvoX. Tidak ada registrasi publik.'
                  : 'Access restricted to EgvoX-provisioned internal accounts. Public signup is disabled.'
                : isId
                ? 'Masukkan kode 6 digit dari authenticator yang sudah terdaftar.'
                : 'Enter the 6-digit code from your enrolled authenticator app.'}
            </p>
          </div>

          {authError && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-xs text-red-700">{authError}</p>}
          {loginStep === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">
                  {isId ? 'Email Terprovisioning' : 'Provisioned Email'}
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  {isId ? 'Kata Sandi' : 'Password'}
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5"
                />
              </div>
              <label className="flex items-center gap-2 font-semibold text-[#16835D]">
                <input type="checkbox" checked readOnly className="h-4 w-4 text-[#027F86]" />
                <span>
                  {isId
                    ? 'Gunakan MFA (Wajib untuk Super Admin)'
                    : 'Require MFA (Mandatory for Super Admin)'}
                </span>
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-3 font-bold text-white hover:bg-[#039998]"
              >
                {isId ? 'Lanjut ke Verifikasi MFA' : 'Continue to MFA Verification'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaVerify} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-center">
                  {isId ? 'Kode OTP 6-Digit' : '6-Digit OTP Code'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full rounded-xl border border-[#027F86] bg-[var(--egvox-bg-canvas)] px-4 py-3 text-center text-lg font-mono font-bold tracking-[0.5em]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLoginStep('credentials')}
                  className="rounded-xl border border-[var(--egvox-border-default)] py-2.5 font-semibold"
                >
                  {isId ? 'Kembali' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#027F86] py-2.5 font-bold text-white"
                >
                  {isId ? 'Verifikasi & Masuk' : 'Verify & Sign In'}
                </button>
              </div>
            </form>
          )}

          <div className="rounded-xl bg-[#C43D3D]/10 border border-[#C43D3D]/25 p-3 text-[11px] text-[var(--egvox-text-secondary)] flex items-start gap-2">
            <Lock className="h-4 w-4 text-[#C43D3D] shrink-0 mt-0.5" />
            <span>
              {isId
                ? 'Dilarang keras melakukan pendaftaran mandiri (Self-Signup) atau menggunakan akun Marketplace publik pada portal ini.'
                : 'Self-signup and public Marketplace accounts are strictly blocked on this internal control plane.'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <Link href="/" className="text-[#027F86] font-semibold hover:underline">
              ← {isId ? 'Beranda Publik' : 'Public Site'}
            </Link>
            <Link href="/ops" className="text-[var(--egvox-text-muted)] hover:underline">
              Data Ops (ops.egvox.ai) →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-primary)] pb-16 lg:pb-0">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* DARK #102326 SIDEBAR (Ref Image 4) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-[#102326] text-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <EgvoXLogo width={104} />
            <span className="rounded bg-[#FC840E] px-1.5 py-0.5 text-[10px] font-bold">
              ADMIN
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden rounded-lg p-1.5 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveModule(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-[#027F86] text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{isId ? item.labelId : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FC840E] text-xs font-bold text-white">
              SA
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">Super Admin</p>
              <p className="text-[10px] text-[#04B8B4] font-medium truncate">
                EgvoX Internal · MFA Verified
              </p>
            </div>
            <button
              type="button"
              onClick={handleAdminLogout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <Link
              href="/ops"
              className="rounded-lg border border-white/15 px-2 py-1.5 text-center font-semibold hover:bg-white/10"
            >
              ops.egvox.ai
            </Link>
            <Link
              href="/workspace"
              className="rounded-lg border border-white/15 px-2 py-1.5 text-center font-semibold hover:bg-white/10"
            >
              app.egvox.ai
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]/95 backdrop-blur px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden rounded-xl border border-[var(--egvox-border-default)] p-2"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--egvox-text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isId
                      ? 'Cari pengguna, proyek, order, atau ID...'
                      : 'Search users, projects, orders, or IDs...'
                  }
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] pl-9 pr-12 py-2 text-xs"
                />
                <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[var(--egvox-border-default)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--egvox-text-muted)]">
                  ⌘K
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setBreakGlassOpen(true)}
                aria-label="Break-Glass Access"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#C43D3D] px-2.5 sm:px-3 py-2 text-xs font-semibold text-white"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Break-Glass</span>
              </button>
              <button
                type="button"
                onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
                className="rounded-xl border border-[var(--egvox-border-default)] px-2.5 py-2 text-xs font-bold"
              >
                {locale.toUpperCase()}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-[var(--egvox-border-default)] p-2"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setNotificationsModalOpen(true)}
                className="relative rounded-xl border border-[var(--egvox-border-default)] p-2"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C43D3D] text-[10px] font-bold text-white tabular-nums">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#027F86]/8 border border-[#027F86]/20 px-3 py-1.5 text-[11px]">
            <span className="font-bold text-[#027F86] dark:text-[#04B8B4]">
              Super Admin Portal (Internal &amp; Provisioned Only) · admin.egvox.ai
            </span>
            <span className="text-[var(--egvox-text-secondary)]">
              {isId ? 'Perbedaan Portal:' : 'Portal Scope:'}{' '}
              <strong>admin.egvox.ai</strong> (Control Plane) ·{' '}
              <Link href="/ops" className="text-[#027F86] font-semibold underline">
                ops.egvox.ai
              </Link>{' '}
              (Data Operations &amp; QA)
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeModule === 'dashboard' ? (
            <SuperAdminDashboardView
              onNavigateModule={(m) => setActiveModule(m as AdminModuleId)}
              onOpenBreakGlass={() => setBreakGlassOpen(true)}
            />
          ) : PART1_IDS.includes(activeModule as AdminModulePart1Id) ? (
            <SuperAdminModulesPart1
              moduleId={activeModule as AdminModulePart1Id}
              searchQuery={searchQuery}
            />
          ) : (
            <SuperAdminModulesPart2
              moduleId={activeModule as AdminModulePart2Id}
              searchQuery={searchQuery}
              onOpenBreakGlass={() => setBreakGlassOpen(true)}
            />
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV (Ref Image 4 Mobile Screens) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]/95 backdrop-blur grid grid-cols-4 py-1.5 text-[10px]">
        <button
          type="button"
          onClick={() => setActiveModule('dashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 font-semibold ${
            activeModule === 'dashboard'
              ? 'text-[#027F86] dark:text-[#04B8B4]'
              : 'text-[var(--egvox-text-muted)]'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>{isId ? 'Beranda' : 'Home'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveModule('verification')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 font-semibold ${
            activeModule === 'verification'
              ? 'text-[#027F86] dark:text-[#04B8B4]'
              : 'text-[var(--egvox-text-muted)]'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>{isId ? 'Antrian' : 'Queue'}</span>
        </button>
        <button
          type="button"
          onClick={() => setNotificationsModalOpen(true)}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1 font-semibold text-[var(--egvox-text-muted)]"
        >
          <Bell className="h-4 w-4" />
          {unreadNotifCount > 0 && (
            <span className="absolute top-1 right-1/3 h-2 w-2 rounded-full bg-[#C43D3D]" />
          )}
          <span>{isId ? 'Notifikasi' : 'Alerts'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveModule('config')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 font-semibold ${
            activeModule === 'config'
              ? 'text-[#027F86] dark:text-[#04B8B4]'
              : 'text-[var(--egvox-text-muted)]'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>{isId ? 'Akun' : 'Account'}</span>
        </button>
      </nav>

      <BreakGlassAccessModal
        open={breakGlassOpen}
        onClose={() => setBreakGlassOpen(false)}
      />
    </div>
  );
};
