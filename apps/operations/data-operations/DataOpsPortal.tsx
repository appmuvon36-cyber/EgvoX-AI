'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Bell,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FolderKanban,
  HelpCircle,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Moon,
  PackageCheck,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Tag,
  UploadCloud,
  UserCheck,
  X,
} from 'lucide-react';
import { EgvoXLogo } from '@/packages/design-system';
import { OpsStaffRole } from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';
import { AnnotationWorkspaceView } from '@/apps/web/workspace/AnnotationWorkspaceView';
import { DataOpsDashboardView } from './DataOpsDashboardView';
import { OpsHelpSopModal } from './DataOpsModals';
import { DataOpsPipelineModules, OpsModuleId } from './DataOpsPipelineModules';
import { egvoxAuth, egvoxApi } from '@/lib/egvox-api';

const OPS_NAV_ITEMS: {
  id: OpsModuleId;
  labelId: string;
  labelEn: string;
  icon: React.ElementType;
  badge?: string;
}[] = [
  { id: 'dashboard', labelId: 'Dashboard', labelEn: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', labelId: 'Work Order & Proyek', labelEn: 'Work Orders & Projects', icon: FolderKanban, badge: '24' },
  { id: 'capture', labelId: 'Capture & Collection', labelEn: 'Capture & Collection', icon: Camera },
  { id: 'uploads', labelId: 'Media & Upload', labelEn: 'Media & Upload', icon: UploadCloud },
  { id: 'quarantine', labelId: 'Quarantine', labelEn: 'Quarantine Queue', icon: ShieldAlert, badge: '8' },
  { id: 'technical', labelId: 'Validasi Teknis', labelEn: 'Technical Validation', icon: CheckCircle2 },
  { id: 'review', labelId: 'Review & Consent', labelEn: 'Content & Consent Review', icon: FileCheck2, badge: '17' },
  { id: 'annotation', labelId: 'Annotation Workspace', labelEn: 'Annotation Workspace', icon: Tag, badge: '56' },
  { id: 'qa', labelId: 'Quality Assurance', labelEn: 'Quality Assurance', icon: ClipboardCheck, badge: '12' },
  { id: 'packaging', labelId: 'Packaging & Delivery', labelEn: 'Packaging & Delivery', icon: PackageCheck },
  { id: 'sla', labelId: 'Monitoring & SLA', labelEn: 'Monitoring & SLA', icon: BarChart3 },
  { id: 'audit', labelId: 'Audit & Aktivitas', labelEn: 'Audit & Activity', icon: Activity },
  { id: 'settings', labelId: 'Pengaturan Operasional', labelEn: 'Ops Settings', icon: Settings },
];

export const DataOpsPortal: React.FC<{
  initialModule?: OpsModuleId;
  forceLoginScreen?: boolean;
}> = ({ initialModule = 'dashboard', forceLoginScreen = false }) => {
  const {
    locale,
    setLocale,
    theme,
    toggleTheme,
    opsAnnotationProjects,
    notifications,
    setNotificationsModalOpen,
    showToast,
  } = useAppState();
  const isId = locale === 'id';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [operatorEmail, setOperatorEmail] = useState('');

  const [activeModule, setActiveModule] = useState<OpsModuleId>(initialModule);
  const [opsRole, setOpsRole] = useState<OpsStaffRole>('data_operations');
  useEffect(() => { let active = true; (async () => { try { const session = await fetch('/api/auth/session', { cache: 'no-store' }).then(r => r.json()); if (!session.authenticated) return; const [roles, assurance] = await Promise.all([egvoxApi<{items:{id:string}[]}>('/me/roles'), egvoxApi<{aal:string}>('/sessions')]); const role = roles.items.find(r => ['data_operations','qa_reviewer','platform_project_manager','super_admin'].includes(r.id)); if (active && role && assurance.aal === 'aal2') { setOpsRole(role.id === 'platform_project_manager' ? 'project_manager' : role.id as OpsStaffRole); setOperatorEmail(session.user?.email || ''); setIsAuthenticated(true); } } catch { if (active) setIsAuthenticated(false); } })(); return () => { active = false; }; }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [helpSopOpen, setHelpSopOpen] = useState(false);
  const [annotationQueueTab, setAnnotationQueueTab] = useState<'mine' | 'queue'>('mine');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(
    opsAnnotationProjects[0]?.id || 'an-1'
  );

  // Login Gate state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleOpsLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthError('');
    try {
      await egvoxAuth('signin', { email: loginEmail, password: loginPassword });
      const roles = await egvoxApi<{items:{id:string}[]}>('/me/roles');
      const role = roles.items.find(r => ['data_operations','qa_reviewer','platform_project_manager','super_admin'].includes(r.id));
      if (!role) { await egvoxAuth('signout'); throw new Error('This account has no provisioned Data Operations role.'); }
      const assurance = await egvoxApi<{aal:string}>('/sessions');
      if (assurance.aal !== 'aal2') { window.location.assign('/account/security'); return; }
      setOpsRole(role.id === 'platform_project_manager' ? 'project_manager' : role.id as OpsStaffRole);
      setOperatorEmail(loginEmail); setIsAuthenticated(true);
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Authentication failed'); }
  };

  const handleOpsLogout = async () => {
    await egvoxAuth('signout'); setIsAuthenticated(false);
    showToast(isId ? 'Sesi Ops Workspace ditutup.' : 'Ops session signed out.');
  };

  // INTERNAL LOGIN GATE (Ref Image 1 Mobile Login Card)
  if (!isAuthenticated || forceLoginScreen) {
    return (
      <div className="min-h-screen bg-[#102326] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-primary)] p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className="rounded-lg border border-[var(--egvox-border-default)] px-2.5 py-1 text-[11px] font-bold hover:bg-[var(--egvox-bg-subtle)]"
            >
              {locale.toUpperCase()}
            </button>
          </div>
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <EgvoXLogo width={132} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#027F86]">
              Ops Workspace — ops.egvox.ai
            </p>
            <h1 className="text-xl font-bold">
              {isId ? 'Login Internal Data Operations' : 'Internal Data Operations Login'}
            </h1>
            <p className="text-xs text-[var(--egvox-text-secondary)]">
              {isId
                ? 'Platform Operasional Internal EgvoX (Non-Public). Akses khusus tim operasional dataset & QA.'
                : 'Internal EgvoX Operations Platform (Non-Public). Provisioned dataset & QA team access only.'}
            </p>
          </div>

          <form onSubmit={handleOpsLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold mb-1">
                {isId ? 'Email Internal' : 'Internal Email'}
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
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
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#027F86] py-3 text-xs font-bold text-white hover:bg-[#039998] transition-colors"
            >
              {isId ? 'Masuk ke Ops Workspace' : 'Sign In to Ops Workspace'}
            </button>
          </form>

          {authError && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-xs text-red-700">{authError}</p>}
          <div className="rounded-xl bg-[#027F86]/10 border border-[#027F86]/25 p-3 text-[11px] text-[var(--egvox-text-secondary)] flex items-start gap-2">
            <Lock className="h-4 w-4 text-[#027F86] shrink-0 mt-0.5" />
            <span>
              {isId
                ? 'Role-Based Access Control (RBAC) & Least-Privilege aktif. Seluruh data mentah bersifat privat dan teraudit.'
                : 'Least-privilege RBAC enforced. All raw media remains private and fully audited.'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <Link href="/" className="text-[#027F86] font-semibold hover:underline">
              ← {isId ? 'Kembali ke Beranda Publik' : 'Public Site'}
            </Link>
            <Link href="/admin" className="text-[var(--egvox-text-muted)] hover:underline">
              Super Admin →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const selectedAnnotationProject =
    opsAnnotationProjects.find((a) => a.id === selectedAnnotationId) ||
    opsAnnotationProjects[0];

  return (
    <div className="min-h-screen flex bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-primary)] pb-16 lg:pb-0">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* DARK #102326 SIDEBAR (Ref Image 1) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-[#102326] text-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <EgvoXLogo width={108} />
            <span className="rounded bg-[#027F86] px-1.5 py-0.5 text-[10px] font-bold">
              OPS
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

        <div className="border-b border-white/10 p-3 text-xs text-white/70">
          {isId ? 'Peran tervalidasi oleh server' : 'Server-verified role'}
          <p className="mt-1 font-semibold text-white">{opsRole.replace('_',' ')}</p>
        </div>

        {/* Nav List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {OPS_NAV_ITEMS.map((item) => {
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
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-[#027F86] text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="inline-flex items-center gap-2.5 truncate">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{isId ? item.labelId : item.labelEn}</span>
                </span>
                {item.badge && (
                  <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Operator Info */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5">
            <img
              src="/images/avatar_contributor_male_1795676771682.jpg"
              alt="Rizal Ops"
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">{operatorEmail || (isId ? "Operator terautentikasi" : "Authenticated operator")}</p>
              <p className="text-[10px] text-[#04B8B4] font-medium truncate">
                {opsRole.replace('_', ' ')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpsLogout}
              title={isId ? 'Keluar' : 'Sign Out'}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <Link
              href="/workspace"
              className="rounded-lg border border-white/15 px-2 py-1.5 text-center font-semibold hover:bg-white/10"
            >
              Customer App
            </Link>
            <Link
              href="/admin"
              className="rounded-lg border border-white/15 px-2 py-1.5 text-center font-semibold hover:bg-white/10"
            >
              Super Admin
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
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
                      ? 'Cari proyek, work order, file, atau ID...'
                      : 'Search project, work order, file, or ID...'
                  }
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] pl-9 pr-14 py-2 text-xs"
                />
                <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[var(--egvox-border-default)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--egvox-text-muted)]">
                  Ctrl+K
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
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
              <button
                type="button"
                onClick={() => setHelpSopOpen(true)}
                className="rounded-xl border border-[var(--egvox-border-default)] p-2 hover:bg-[var(--egvox-bg-subtle)]"
                aria-label="Ops SOP Guide"
                title="SOP & QA Reason Codes"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              <span className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#027F86] text-xs font-bold text-white">
                RO
              </span>
            </div>
          </div>

          {/* Non-Public Operations Guard Banner (Ref Image 1 Top Header) */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#027F86]/8 border border-[#027F86]/20 px-3 py-1.5 text-[11px]">
            <span className="font-bold text-[#027F86] dark:text-[#04B8B4]">
              {isId
                ? 'Platform Operasional Internal EgvoX (Non-Public) · ops.egvox.ai'
                : 'Internal EgvoX Operations Platform (Non-Public) · ops.egvox.ai'}
            </span>
            <div className="flex flex-wrap items-center gap-3 font-medium text-[var(--egvox-text-secondary)]">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#16835D]" />{' '}
                {isId ? 'Akses Internal (RBAC)' : 'Internal Access (RBAC)'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-[#16835D]" />{' '}
                {isId ? 'Data Private (Tidak Publik)' : 'Private Data (Non-Public)'}
              </span>
            </div>
          </div>
        </header>

        {/* WORKSPACE BODY */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          {activeModule === 'dashboard' ? (
            <DataOpsDashboardView
              onNavigateModule={(mod) => setActiveModule(mod as OpsModuleId)}
            />
          ) : activeModule === 'annotation' ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold">
                    {isId
                      ? '5. Operasi Anotasi & Studio (Schema v1.2)'
                      : '5. Annotation Operations & Studio (Schema v1.2)'}
                  </h1>
                  <p className="text-xs text-[var(--egvox-text-secondary)]">
                    {isId
                      ? 'Pilih tugas dari Tugas Saya / Antrian untuk meninjau, mengedit bounding box & segmen temporal, serta validasi schema.'
                      : 'Select a task from My Tasks / Queue to inspect, edit bounding boxes & temporal segments, and validate schema.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setAnnotationQueueTab('mine')}
                      className={`rounded-lg px-3 py-1 font-semibold tabular-nums ${
                        annotationQueueTab === 'mine' ? 'bg-[#027F86] text-white' : ''
                      }`}
                    >
                      {isId ? 'Tugas Saya (12)' : 'My Tasks (12)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnnotationQueueTab('queue')}
                      className={`rounded-lg px-3 py-1 font-semibold tabular-nums ${
                        annotationQueueTab === 'queue' ? 'bg-[#027F86] text-white' : ''
                      }`}
                    >
                      {isId ? 'Antrian (56)' : 'Queue (56)'}
                    </button>
                  </div>
                  <select
                    value={selectedAnnotationId}
                    onChange={(e) => setSelectedAnnotationId(e.target.value)}
                    className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs font-bold"
                  >
                    {opsAnnotationProjects.map((ap) => (
                      <option key={ap.id} value={ap.id}>
                        {ap.code} — {isId ? ap.titleId : ap.titleEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tugas Anotasi Queue Cards (Ref Image 1 Mobile & Desktop Strip) */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {opsAnnotationProjects
                  .filter((ap) =>
                    annotationQueueTab === 'mine'
                      ? ap.status === 'in_progress' || ap.status === 'review' || ap.id === selectedAnnotationId
                      : true
                  )
                  .map((ap) => {
                    const active = ap.id === selectedAnnotationId;
                    return (
                      <button
                        key={ap.id}
                        type="button"
                        onClick={() => setSelectedAnnotationId(ap.id)}
                        className={`rounded-2xl border p-3 text-left flex items-center gap-3 transition-colors ${
                          active
                            ? 'border-[#027F86] bg-[#027F86]/8'
                            : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] hover:border-[#027F86]/40'
                        }`}
                      >
                        <img
                          src={ap.previewImage}
                          alt={isId ? ap.titleId : ap.titleEn}
                          referrerPolicy="no-referrer"
                          className="h-12 w-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-mono font-bold text-[#027F86]">{ap.code}</p>
                          <p className="text-xs font-bold truncate">{isId ? ap.titleId : ap.titleEn}</p>
                          <p className="text-[10px] text-[var(--egvox-text-muted)] tabular-nums">
                            {ap.completedTasks}/{ap.taskCount} · {ap.progressPercent}%
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>

              <AnnotationWorkspaceView
                project={selectedAnnotationProject}
                isOpsMode
                onCompleteSubmit={() => setActiveModule('qa')}
              />
            </div>
          ) : (
            <DataOpsPipelineModules
              moduleId={activeModule}
              searchQuery={searchQuery}
            />
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV (Ref Image 1 Mobile Screens: Beranda / Proyek / Tugas / Notifikasi / Akun) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]/95 backdrop-blur grid grid-cols-5 py-1.5 text-[10px]">
        {[
          { id: 'dashboard', label: isId ? 'Beranda' : 'Home', icon: Home, onClick: () => setActiveModule('dashboard') },
          { id: 'projects', label: isId ? 'Proyek' : 'Projects', icon: FolderKanban, onClick: () => setActiveModule('projects') },
          { id: 'annotation', label: isId ? 'Tugas' : 'Tasks', icon: Tag, onClick: () => setActiveModule('annotation') },
          { id: 'notifications', label: isId ? 'Notifikasi' : 'Alerts', icon: Bell, onClick: () => setNotificationsModalOpen(true) },
          { id: 'settings', label: isId ? 'Akun' : 'Account', icon: UserCheck, onClick: () => setActiveModule('settings') },
        ].map((nav) => {
          const Icon = nav.icon;
          const active = activeModule === nav.id;
          return (
            <button
              key={nav.id}
              type="button"
              onClick={nav.onClick}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1 font-semibold ${
                active ? 'text-[#027F86] dark:text-[#04B8B4]' : 'text-[var(--egvox-text-muted)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{nav.label}</span>
              {nav.id === 'notifications' && unreadNotifCount > 0 && (
                <span className="absolute top-0.5 right-4 h-2 w-2 rounded-full bg-[#C43D3D]" />
              )}
            </button>
          );
        })}
      </nav>

      <OpsHelpSopModal open={helpSopOpen} onClose={() => setHelpSopOpen(false)} />
    </div>
  );
};
