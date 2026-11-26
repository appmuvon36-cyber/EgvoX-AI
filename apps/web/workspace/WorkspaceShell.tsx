'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  FolderKanban,
  FolderPlus,
  Globe,
  Heart,
  Home,
  LayoutDashboard,
  Lock,
  Menu,
  Moon,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Tag,
  Undo2,
  UploadCloud,
  UserCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  DualPrice,
  EgvoXLogo,
  egvoxFormatIDR,
  egvoxFormatUSD,
} from '@/packages/design-system';
import { FREELANCER_SERVICES, PROJECT_LISTINGS } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';
import {
  ActiveWorkOrder,
  OpsDeliveryPackage,
  RecruitmentOffer,
  StructuredClarification,
  SubmissionFileItem,
} from '@/packages/shared-types';
import { AnnotationWorkspaceView } from './AnnotationWorkspaceView';
import {
  CustomerModalsBundle,
  CustomerModeSelectorModal,
  EnterpriseSampleInspectionModal,
  MilestoneFundingChangeModal,
  PrivateUploadThreeStepModal,
  TeamInviteModal,
} from './CustomerWorkspaceModals';
import { GoogleWorkspacePluginPanel } from './GoogleWorkspacePluginPanel';

type WorkspaceTab =
  | 'overview'
  | 'browse'
  | 'services'
  | 'proposals'
  | 'offers'
  | 'tracking'
  | 'uploads'
  | 'annotation'
  | 'delivery'
  | 'earnings'
  | 'billing'
  | 'team'
  | 'profile'
  | 'settings'
  | 'saved'
  | 'plugins'
  | 'reports';

type Persona = 'freelancer' | 'vendor' | 'enterprise';

function resolveInitialTab(tab?: string): WorkspaceTab {
  switch (tab) {
    case 'browse':
    case 'services':
    case 'proposals':
    case 'offers':
    case 'tracking':
    case 'uploads':
    case 'annotation':
    case 'delivery':
    case 'earnings':
    case 'billing':
    case 'team':
    case 'profile':
    case 'settings':
    case 'saved':
    case 'plugins':
    case 'reports':
      return tab;
    default:
      return 'overview';
  }
}

function resolveInitialPersona(role?: string): Persona {
  if (role === 'vendor' || role === 'enterprise' || role === 'freelancer') {
    return role;
  }
  return 'freelancer';
}

const WORKFLOW_11_STEPS = [
  { num: 1, id: 'Organisasi Terverifikasi & KYB', en: 'Verified Recruiter Org & KYB' },
  { num: 2, id: 'Cek Saldo Settled (Min. 5 Jt)', en: 'Settled Balance Check (Min. 5M)' },
  { num: 3, id: 'Ajukan Minat / Rekrut Talenta', en: 'Express Interest / Recruit' },
  { num: 4, id: 'Penawaran Privat & Negosiasi V1–V3', en: 'Private Offer & V1–V3 Negotiation' },
  { num: 5, id: 'Work Order & Reservasi Dana Ledger', en: 'Work Order & Ledger Reservation' },
  { num: 6, id: 'Upload Data (Private)', en: 'Upload Data (Private)' },
  { num: 7, id: 'Validasi Teknis (SHA-256)', en: 'Technical Check (SHA-256)' },
  { num: 8, id: 'Review QA Specialist Independen', en: 'Independent QA Specialist Review' },
  { num: 9, id: 'Keputusan (Accept / Rework)', en: 'Verdict (Accept / Rework)' },
  { num: 10, id: 'Delivery (Paket & Manifest)', en: 'Delivery (Package & Manifest)' },
  { num: 11, id: 'Pencairan Ke Freelancer (Milestone)', en: 'Milestone Settlement' },
];

export const WorkspaceShell: React.FC<{
  initialTab?: string;
  initialRole?: string;
}> = ({ initialTab, initialRole }) => {
  const {
    locale,
    setLocale,
    theme,
    toggleTheme,
    proposals,
    withdrawProposal,
    workOrders,
    acknowledgedOrderIds,
    acknowledgeOrderSpec,
    savedSlugs,
    inquiries,
    notifications,
    setNotificationsModalOpen,
    submissionFiles,
    recruiterWallet,
    setTopUpModalOpen,
    recruitmentOffers,
    respondRecruitmentOffer,
    clarifications,
    submitClarification,
    resolveClarification,
    availableBalance,
    payoutHistory,
    reviews,
    customProjects,
    customServices,
    pausedServiceIds,
    toggleServiceAvailability,
    kycStatus,
    opsAnnotationProjects,
    opsDeliveryPackages,
    acceptedEnterpriseDeliveries,
    adminEnterpriseDeals,
    openProposalModal,
    openRecruitModal,
    showToast,
  } = useAppState();

  const isId = locale === 'id';

  const [persona, setPersona] = useState<Persona>(() =>
    resolveInitialPersona(initialRole)
  );
  const [freelancerMode, setFreelancerMode] = useState<
    'contributor' | 'annotator' | 'qa_specialist'
  >(initialTab === 'annotation' ? 'annotator' : 'contributor');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(() =>
    resolveInitialTab(initialTab)
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    workOrders[0]?.id || 'wo-1'
  );
  const [proposalFilter, setProposalFilter] = useState<
    'all' | 'pending' | 'accepted' | 'rejected'
  >('all');
  const [selectedRecruitOfferId, setSelectedRecruitOfferId] = useState<string>(
    recruitmentOffers[0]?.id || 'rec-1'
  );
  const [offerInboxTab, setOfferInboxTab] = useState<'penawaran' | 'aktif'>('penawaran');
  const [clarifyTopic, setClarifyTopic] =
    useState<StructuredClarification['topic']>('spec');
  const [clarifyText, setClarifyText] = useState('');
  const [clarifyAnswerDrafts, setClarifyAnswerDrafts] = useState<Record<string, string>>({});
  const [activeOrg, setActiveOrg] = useState('PT Data Visual Indonesia');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(
    opsAnnotationProjects[0]?.id || 'an-1'
  );
  const [annotationSubMode, setAnnotationSubMode] = useState<'tasks' | 'studio'>(
    initialTab === 'annotation' ? 'studio' : 'tasks'
  );

  // Modal States
  const [modeSelectorOpen, setModeSelectorOpen] = useState(false);
  const [privateUploadOpen, setPrivateUploadOpen] = useState(false);
  const [teamInviteOpen, setTeamInviteOpen] = useState(false);

  const [contractOrder, setContractOrder] = useState<ActiveWorkOrder | null>(null);
  const [reworkTarget, setReworkTarget] = useState<SubmissionFileItem | null>(null);
  const [counterTarget, setCounterTarget] = useState<RecruitmentOffer | null>(null);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createServiceOpen, setCreateServiceOpen] = useState(false);
  const [rfpOpen, setRfpOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [milestoneModalOrder, setMilestoneModalOrder] = useState<ActiveWorkOrder | null>(null);
  const [inspectDeliveryPkg, setInspectDeliveryPkg] = useState<OpsDeliveryPackage | null>(null);

  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [teamMembers, setTeamMembers] = useState([
    { id: 'tm-1', name: 'Budi Santoso', email: 'budi@datavisual.co.id', role: 'Vendor Admin', status: 'Aktif' },
    { id: 'tm-2', name: 'Ratna Dewi', email: 'ratna@datavisual.co.id', role: 'Project Manager', status: 'Aktif' },
    { id: 'tm-3', name: 'Arif Wijaya', email: 'arif@nusantarariset.id', role: 'QA Observer (Read-Only)', status: 'Aktif' },
  ]);

  const selectedOrder =
    workOrders.find((w) => w.id === selectedOrderId) || workOrders[0];

  const allProjects = [...customProjects, ...PROJECT_LISTINGS];
  const allServices = [...customServices, ...FREELANCER_SERVICES];
  const savedProjects = allProjects.filter((p) => savedSlugs.includes(p.slug));
  const savedServices = allServices.filter((s) => savedSlugs.includes(s.slug));
  const totalSavedCount = savedProjects.length + savedServices.length;

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const pendingOffersCount = recruitmentOffers.filter(
    (o) => o.status === 'sent' || o.status === 'negotiating'
  ).length;
  const activeOffer =
    recruitmentOffers.find((o) => o.id === selectedRecruitOfferId) ||
    recruitmentOffers[0];

  const filteredProposals = proposals.filter((prop) => {
    if (proposalFilter === 'all') return true;
    if (proposalFilter === 'pending') {
      return (
        prop.status === 'submitted' ||
        prop.status === 'under_review' ||
        prop.status === 'countered'
      );
    }
    return prop.status === proposalFilter;
  });

  const handleSwitchPersona = (next: Persona) => {
    setPersona(next);
    if (next === 'enterprise' && (activeTab === 'services' || activeTab === 'uploads')) {
      setActiveTab('overview');
    }
  };

  const sidebarItems: {
    id: WorkspaceTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    action?: () => void;
  }[] =
    persona === 'freelancer'
      ? [
          { id: 'overview', label: isId ? 'Dasbor' : 'Dashboard', icon: LayoutDashboard },
          { id: 'browse', label: isId ? 'Jelajah Proyek' : 'Browse Projects', icon: Search },
          { id: 'services', label: isId ? 'Profil Kapabilitas' : 'Capability Profiles', icon: Briefcase },
          { id: 'proposals', label: isId ? 'Pengajuan Minat' : 'Applications', icon: FileText, badge: proposals.length },
          { id: 'offers', label: isId ? 'Penawaran Rekrutmen' : 'Recruitment Offers', icon: Tag, badge: pendingOffersCount || undefined },
          { id: 'tracking', label: isId ? 'Order / Penugasan' : 'Orders / Assignments', icon: FolderKanban, badge: workOrders.length },
          { id: 'uploads', label: isId ? 'Upload (Privat)' : 'Uploads (Private)', icon: UploadCloud },
          { id: 'annotation', label: isId ? 'Tugas Anotasi' : 'Annotation Jobs', icon: Sparkles, badge: opsAnnotationProjects.length },
          { id: 'delivery', label: isId ? 'Pengiriman Dataset' : 'Deliveries', icon: FileCheck2 },
          { id: 'earnings', label: isId ? 'Pendapatan / Payout' : 'Earnings / Payouts', icon: Wallet },
          { id: 'profile', label: isId ? 'Profil & Verifikasi' : 'Profile & Verification', icon: UserCheck },
          { id: 'settings', label: isId ? 'Pengaturan & Keamanan' : 'Settings & Security', icon: Settings },
          { id: 'plugins', label: 'Google Workspace', icon: Globe },
        ]
      : persona === 'vendor'
      ? [
          { id: 'overview', label: isId ? 'Dasbor' : 'Dashboard', icon: LayoutDashboard },
          { id: 'browse', label: isId ? 'Proyek & Talenta' : 'Projects & Talent', icon: FolderKanban },
          {
            id: 'services',
            label: isId ? 'Buat Project Baru' : 'Create Project',
            icon: FolderPlus,
            action: () => setCreateProjectOpen(true),
          },
          { id: 'proposals', label: isId ? 'Minat Masuk' : 'Incoming Interest', icon: FileText, badge: proposals.length },
          { id: 'offers', label: isId ? 'Rekrutmen & Dompet' : 'Recruitment & Wallet', icon: Tag, badge: recruitmentOffers.length },
          { id: 'tracking', label: isId ? 'Work Order' : 'Work Orders', icon: Briefcase, badge: workOrders.length },
          { id: 'uploads', label: isId ? 'Produksi & Monitoring' : 'Production & Monitoring', icon: Activity },
          { id: 'annotation', label: isId ? 'Anotasi (Opsional)' : 'Annotation (Optional)', icon: Sparkles },
          { id: 'delivery', label: isId ? 'Pengiriman & Manifest' : 'Deliveries & Manifest', icon: FileCheck2 },
          { id: 'billing', label: isId ? 'Billing & Transaksi' : 'Billing & Transactions', icon: CreditCard },
          { id: 'team', label: isId ? 'Tim & Organisasi' : 'Team & Organization', icon: Users },
          { id: 'settings', label: isId ? 'Pengaturan & Keamanan' : 'Settings & Security', icon: Settings },
          { id: 'plugins', label: 'Google Workspace', icon: Globe },
        ]
      : [
          { id: 'overview', label: isId ? 'Dasbor' : 'Dashboard', icon: LayoutDashboard },
          {
            id: 'proposals',
            label: isId ? 'Permintaan Data (RFP)' : 'Data Request (RFP)',
            icon: Building2,
            action: () => setRfpOpen(true),
          },
          { id: 'offers', label: isId ? 'Proposal & Penawaran' : 'Proposal & Quotes', icon: FileText },
          { id: 'tracking', label: isId ? 'Proyek Resmi (Managed)' : 'Official Projects (Managed)', icon: ShieldCheck, badge: adminEnterpriseDeals.length },
          { id: 'uploads', label: isId ? 'Produksi & Progress' : 'Production & Progress', icon: Activity },
          { id: 'annotation', label: isId ? 'Jaminan Kualitas (QA)' : 'Quality Assurance (QA)', icon: CheckCircle2 },
          { id: 'delivery', label: isId ? 'Pengiriman Dataset' : 'Dataset Deliveries', icon: FileCheck2 },
          { id: 'billing', label: isId ? 'Faktur & Penagihan' : 'Invoices & Billing', icon: CreditCard },
          { id: 'team', label: isId ? 'Manajemen Tim' : 'Team Management', icon: Users },
          { id: 'reports', label: isId ? 'Laporan & Analitik' : 'Reports & Analytics', icon: BarChart3 },
          { id: 'settings', label: isId ? 'Pengaturan & Keamanan' : 'Settings & Security', icon: Settings },
          { id: 'plugins', label: 'Google Workspace', icon: Globe },
        ];

  const activeProjectsFiltered = allProjects.filter(
    (p) =>
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categoryLabelEn || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeServicesFiltered = allServices.filter(
    (s) =>
      !searchQuery.trim() ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.freelancerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAnnotationProject =
    opsAnnotationProjects.find((a) => a.id === selectedAnnotationId) ||
    opsAnnotationProjects[0];

  return (
    <div className="min-h-screen flex bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-primary)] pb-16 lg:pb-0">
      {/* MOBILE SIDEBAR DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Desktop Fixed + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--egvox-border-default)]">
          <Link href="/" className="inline-flex items-center gap-2">
            <EgvoXLogo width={116} />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Workspace Persona Switcher */}
        <div className="p-3 border-b border-[var(--egvox-border-default)]">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--egvox-text-muted)] mb-1.5">
            {isId ? 'Peran Workspace' : 'Workspace Persona'}
          </label>
          <select
            value={persona}
            onChange={(e) => handleSwitchPersona(e.target.value as Persona)}
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-bold text-[var(--egvox-text-primary)]"
          >
            <option value="freelancer">Freelancer (Contributor / Annotator / QA)</option>
            <option value="vendor">
              {isId ? 'Dataset Vendor (Penyedia Data)' : 'Dataset Vendor (Data Provider)'}
            </option>
            <option value="enterprise">
              {isId ? 'Enterprise Buyer (Terkelola)' : 'Enterprise Buyer (Managed)'}
            </option>
          </select>
          {persona === 'freelancer' && (
            <button
              type="button"
              onClick={() => setModeSelectorOpen(true)}
              className="mt-2 w-full flex items-center justify-between rounded-lg bg-[#027F86]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#027F86] dark:text-[#04B8B4]"
            >
              <span>
                Mode:{' '}
                {freelancerMode === 'contributor'
                  ? 'Video Contributor'
                  : freelancerMode === 'annotator'
                  ? 'Data Annotator'
                  : 'QA Specialist'}
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id + item.label}
                type="button"
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#027F86] text-white'
                    : 'text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)] hover:text-[var(--egvox-text-primary)]'
                }`}
              >
                <span className="inline-flex items-center gap-2.5 truncate">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#027F86]/12 text-[#027F86] dark:text-[#04B8B4]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile & Portal Switcher */}
        <div className="p-3 border-t border-[var(--egvox-border-default)] space-y-2">
          <div className="flex items-center gap-2.5 rounded-xl bg-[var(--egvox-bg-canvas)] p-2.5">
            <img
              src={
                freelancerMode === 'annotator'
                  ? '/images/avatar_annotator_female_1795676773112.jpg'
                  : '/images/avatar_contributor_male_1795676771682.jpg'
              }
              alt="Workspace User"
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">
                {persona === 'freelancer'
                  ? freelancerMode === 'annotator'
                    ? 'Salsa Fitriani'
                    : freelancerMode === 'qa_specialist'
                    ? 'Dimas Prasetyo'
                    : 'Rizal Maulana'
                  : persona === 'vendor'
                  ? activeOrg
                  : 'PT Nusantara Riset'}
              </p>
              <p className="text-[10px] text-[#16835D] font-semibold">
                {kycStatus === 'verified'
                  ? isId
                    ? 'Terverifikasi · Online'
                    : 'Verified · Online'
                  : isId
                  ? 'KYC Menunggu Review'
                  : 'KYC Pending Review'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <Link
              href="/marketplace"
              className="rounded-lg border border-[var(--egvox-border-default)] px-2 py-1.5 text-center font-semibold hover:bg-[var(--egvox-bg-subtle)]"
            >
              Marketplace
            </Link>
            <Link
              href="/ops"
              className="rounded-lg border border-[var(--egvox-border-default)] px-2 py-1.5 text-center font-semibold hover:bg-[var(--egvox-bg-subtle)]"
            >
              {isId ? 'Portal Ops' : 'Ops Portal'}
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN PORTAL AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]/95 backdrop-blur px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden rounded-xl border border-[var(--egvox-border-default)] p-2 hover:bg-[var(--egvox-bg-subtle)]"
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
                      ? 'Cari proyek, work order, layanan, atau ID...'
                      : 'Search projects, work orders, services...'
                  }
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] pl-9 pr-14 py-2 text-xs"
                />
                <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[var(--egvox-border-default)] px-1.5 py-0.5 text-[10px] text-[var(--egvox-text-muted)] font-mono">
                  Ctrl+K
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {persona === 'freelancer' && (
                <button
                  type="button"
                  onClick={() => setPrivateUploadOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#027F86] px-3 py-2 text-xs font-semibold text-white hover:bg-[#039998]"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>{isId ? 'Upload Tugas' : 'Upload Task'}</span>
                </button>
              )}
              {persona === 'vendor' && (
                <button
                  type="button"
                  onClick={() => setCreateProjectOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#027F86] px-3 py-2 text-xs font-semibold text-white hover:bg-[#039998]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isId ? 'Buat Project' : 'Create Project'}</span>
                </button>
              )}
              {persona === 'enterprise' && (
                <button
                  type="button"
                  onClick={() => setRfpOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#FC840E] px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isId ? 'Ajukan Permintaan' : 'Submit Request'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
                className="rounded-xl border border-[var(--egvox-border-default)] px-2.5 py-2 text-xs font-bold hover:bg-[var(--egvox-bg-subtle)]"
              >
                {locale.toUpperCase()}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-[var(--egvox-border-default)] p-2 hover:bg-[var(--egvox-bg-subtle)]"
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
                className="relative rounded-xl border border-[var(--egvox-border-default)] p-2 hover:bg-[var(--egvox-bg-subtle)]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C43D3D] text-[10px] font-bold text-white tabular-nums">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
              {persona === 'vendor' && (
                <button
                  type="button"
                  onClick={() => setTopUpModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#027F86]/35 bg-[#027F86]/10 px-3 py-2 text-xs font-bold text-[#027F86] dark:text-[#04B8B4] hover:bg-[#027F86]/15 tabular-nums"
                >
                  <Wallet className="h-3.5 w-3.5" />
                  <span>{egvoxFormatIDR(recruiterWallet.availableBalanceIDR)}</span>
                </button>
              )}
              {persona === 'freelancer' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('offers')}
                  className="relative rounded-xl border border-[var(--egvox-border-default)] p-2 hover:bg-[var(--egvox-bg-subtle)]"
                  aria-label="Recruitment Offers"
                  title={isId ? 'Penawaran Rekrutmen' : 'Recruitment Offers'}
                >
                  <Tag className="h-4 w-4" />
                  {pendingOffersCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#027F86] text-[10px] font-bold text-white tabular-nums">
                      {pendingOffersCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sub-banner showing active domain app.egvox.ai & privacy guard */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--egvox-text-secondary)]">
            <span className="inline-flex items-center gap-2 font-medium">
              <span className="font-bold text-[#027F86] dark:text-[#04B8B4]">
                app.egvox.ai
              </span>
              <span>·</span>
              <span>
                {persona === 'freelancer'
                  ? 'Freelancer Workspace'
                  : persona === 'vendor'
                  ? 'Dataset Vendor Workspace'
                  : 'Enterprise Managed Workspace'}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#16835D] font-medium">
              <Lock className="h-3.5 w-3.5" />
              {isId
                ? 'Raw Video Bersifat Privat · Portofolio Hanya Preview Berizin'
                : 'Raw Video Strictly Private · Consented Previews Only'}
            </span>
          </div>
        </header>

        {/* WORKSPACE MAIN BODY */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* ================= OVERVIEW DASHBOARD ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* FREELANCER OVERVIEW */}
              {persona === 'freelancer' && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
                    <div>
                      <p className="text-xs font-semibold text-[#027F86] dark:text-[#04B8B4]">
                        {isId ? 'Mode Aktif: ' : 'Active Mode: '}
                        {freelancerMode === 'contributor'
                          ? isId
                            ? 'Video Contributor (Capture Egocentric)'
                            : 'Video Contributor (First-Person Capture)'
                          : freelancerMode === 'annotator'
                          ? 'Data Annotator (Schema v1.2)'
                          : isId
                          ? 'QA Specialist (Audit Kualitas Independen)'
                          : 'QA Specialist (Independent Quality Audit)'}
                      </p>
                      <h1 className="text-xl sm:text-2xl font-bold mt-0.5">
                        {isId
                          ? `Selamat Datang, ${
                              freelancerMode === 'annotator'
                                ? 'Salsa Fitriani'
                                : freelancerMode === 'qa_specialist'
                                ? 'Dimas Prasetyo'
                                : 'Rizal Maulana'
                            }`
                          : `Welcome back, ${
                              freelancerMode === 'annotator'
                                ? 'Salsa Fitriani'
                                : freelancerMode === 'qa_specialist'
                                ? 'Dimas Prasetyo'
                                : 'Rizal Maulana'
                            }`}
                      </h1>
                      <p className="text-xs text-[var(--egvox-text-secondary)] mt-1">
                        {isId
                          ? 'Kelola tugas capture, sesi upload privat SHA-256, anotasi skema, dan penarikan dana.'
                          : 'Manage capture tasks, encrypted private uploads, schema annotations, and payouts.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setModeSelectorOpen(true)}
                        className="rounded-xl border border-[var(--egvox-border-default)] px-3.5 py-2 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
                      >
                        {isId ? 'Ganti Mode Layanan' : 'Switch Role Mode'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('annotation');
                          setAnnotationSubMode('studio');
                        }}
                        className="rounded-xl bg-[#FC840E] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90"
                      >
                        {isId ? 'Buka Annotation Workspace' : 'Open Annotation Studio'}
                      </button>
                    </div>
                  </div>

                  {/* 4 KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4">
                      <p className="text-xs text-[var(--egvox-text-muted)]">
                        {isId ? 'Tugas Aktif' : 'Active Tasks'}
                      </p>
                      <p className="mt-1 text-2xl font-bold tabular-nums">3</p>
                      <p className="mt-1 text-[11px] text-[#027F86] font-medium">
                        {isId ? '2 dalam produksi · 1 review' : '2 in progress · 1 review'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4">
                      <p className="text-xs text-[var(--egvox-text-muted)]">
                        {isId ? 'Aplikasi Terkirim' : 'Submitted Applications'}
                      </p>
                      <p className="mt-1 text-2xl font-bold tabular-nums">{proposals.length + 4}</p>
                      <p className="mt-1 text-[11px] text-[#16835D] font-medium">
                        {isId ? '1 disetujui minggu ini' : '1 approved this week'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4">
                      <p className="text-xs text-[var(--egvox-text-muted)]">
                        {isId ? 'Deadline Terdekat' : 'Nearest Deadline'}
                      </p>
                      <p className="mt-1 text-2xl font-bold tabular-nums">30 Nov</p>
                      <p className="mt-1 text-[11px] text-[#B7791F] font-medium">
                        EGX-0256 · Cooking POV
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4">
                      <p className="text-xs text-[var(--egvox-text-muted)]">
                        {isId ? 'Pendapatan Layak Payout' : 'Payout Eligible'}
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#027F86] dark:text-[#04B8B4] tabular-nums">
                        {egvoxFormatIDR(availableBalance)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--egvox-text-muted)] tabular-nums">
                        {egvoxFormatUSD(availableBalance)} USD
                      </p>
                    </div>
                  </div>

                  {/* Tugas & Deadline + Progress Mingguan 72% + Aktivitas Terbaru */}
                  <div className="grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-6 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold">
                          {isId ? 'Tugas & Deadline Terbaru' : 'Active Tasks & Deadlines'}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setActiveTab('tracking')}
                          className="text-xs font-semibold text-[#027F86] hover:underline"
                        >
                          {isId ? 'Lihat Semua' : 'View All'}
                        </button>
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            code: 'EGX-0241',
                            title: isId ? 'Capture: Memasak Egocentric' : 'Capture: Cooking Egocentric',
                            img: '/images/capture_cooking_pov_1795676769816.jpg',
                            status: isId ? 'Dikerjakan' : 'In Progress',
                            statusColor: 'text-[#027F86] bg-[#027F86]/10',
                            due: isId ? '30 Nov 2026' : 'Nov 30, 2026',
                          },
                          {
                            code: 'EGX-0217',
                            title: isId ? 'Anotasi: Otomotif Driving' : 'Annotation: Automotive Driving',
                            img: '/images/capture_automotive_pov_1795676770764.jpg',
                            status: isId ? 'Review QA' : 'QA Review',
                            statusColor: 'text-[#B7791F] bg-[#F59E0B]/12',
                            due: isId ? '28 Nov 2026' : 'Nov 28, 2026',
                          },
                          {
                            code: 'EGX-0239',
                            title: isId ? 'Capture: Aktivitas Gudang & Rak' : 'Capture: Warehouse & Shelf Ops',
                            img: '/images/capture_warehouse_pov_1795676771521.jpg',
                            status: isId ? 'Menunggu Upload' : 'Awaiting Upload',
                            statusColor: 'text-[#2563A6] bg-[#2563A6]/10',
                            due: isId ? '2 Des 2026' : 'Dec 2, 2026',
                          },
                        ].map((task) => (
                          <div
                            key={task.code}
                            className="flex items-center gap-3 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3"
                          >
                            <img
                              src={task.img}
                              alt={task.title}
                              referrerPolicy="no-referrer"
                              className="h-12 w-16 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold truncate">{task.title}</p>
                              <p className="text-[11px] font-mono text-[var(--egvox-text-muted)]">
                                {task.code} · Deadline: {task.due}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${task.statusColor}`}
                            >
                              {task.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Progress Ring + Recent Activity */}
                    <div className="lg:col-span-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 flex flex-col items-center justify-center text-center">
                        <h3 className="text-sm font-bold mb-3">
                          {isId ? 'Progress Mingguan' : 'Weekly Progress'}
                        </h3>
                        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-[var(--egvox-border-default)]"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#027F86"
                            strokeWidth="10"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 * (1 - 0.72)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <p className="-mt-18 mb-10 text-xl font-bold tabular-nums">72%</p>
                        <div className="text-xs text-[var(--egvox-text-secondary)] space-y-0.5 tabular-nums">
                          <p>{isId ? 'Target: 10 tugas' : 'Target: 10 tasks'}</p>
                          <p className="font-semibold text-[#16835D]">
                            {isId ? 'Selesai: 7 tugas' : 'Completed: 7 tasks'}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
                        <h3 className="text-sm font-bold">
                          {isId ? 'Aktivitas Terbaru' : 'Recent Activity'}
                        </h3>
                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#16835D] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold">
                                {isId ? 'Proposal disetujui' : 'Application approved'}
                              </p>
                              <p className="text-[11px] text-[var(--egvox-text-muted)]">
                                PT Data Visual · EGX-0241
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-[#B7791F] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold">
                                {isId ? 'Permintaan revisi QA' : 'QA revision requested'}
                              </p>
                              <p className="text-[11px] text-[var(--egvox-text-muted)]">
                                {isId
                                  ? 'cook_batch_03.mp4 (pencahayaan)'
                                  : 'cook_batch_03.mp4 (lighting check)'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Wallet className="h-4 w-4 text-[#027F86] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold">
                                {isId ? 'Pembayaran diterima' : 'Milestone payout settled'}
                              </p>
                              <p className="text-[11px] text-[var(--egvox-text-muted)] tabular-nums">
                                Rp 1.250.000 · WO-EGX-0239
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* DATASET VENDOR OVERVIEW */}
              {persona === 'vendor' && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#027F86] text-white">
                        <Building2 className="h-6 w-6" />
                      </span>
                      <div>
                        <h1 className="text-xl font-bold">{activeOrg}</h1>
                        <p className="text-xs text-[#16835D] font-semibold">
                          {isId
                            ? 'Dataset Vendor (Terverifikasi) · Catatan: Anotasi Bersifat Opsional'
                            : 'Verified Dataset Vendor · Note: Annotation is Optional'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setOrgModalOpen(true)}
                        className="rounded-xl border border-[var(--egvox-border-default)] px-3.5 py-2 text-xs font-semibold"
                      >
                        {isId ? 'Ganti Organisasi' : 'Switch Org'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreateProjectOpen(true)}
                        className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{isId ? 'Buat Project' : 'Create Project'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: isId ? 'Proyek Aktif' : 'Active Projects',
                        value: allProjects.length,
                        sub: isId ? 'Dipublikasikan' : 'Published',
                      },
                      {
                        label: isId ? 'Order Berjalan' : 'Active Work Orders',
                        value: 12,
                        sub: isId ? 'Work Order aktif' : 'In production',
                      },
                      {
                        label: isId ? 'Dalam Review QA' : 'In QA Review',
                        value: 5,
                        sub: isId ? 'Antrian Karantina' : 'Quarantine queue',
                      },
                      {
                        label: isId ? 'Selesai & Delivered' : 'Completed & Delivered',
                        value: 28,
                        sub: isId ? 'Manifest Terkunci' : 'Manifest Locked',
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4"
                      >
                        <p className="text-xs text-[var(--egvox-text-muted)]">{stat.label}</p>
                        <p className="mt-1 text-2xl font-bold tabular-nums">{stat.value}</p>
                        <p className="mt-1 text-[11px] text-[#027F86] font-medium">{stat.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold">
                        {isId ? 'Manajemen & Progress Produksi Proyek' : 'Project Production Progress'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('browse')}
                        className="text-xs font-semibold text-[#027F86] hover:underline"
                      >
                        {isId ? 'Kelola Semua' : 'Manage All'}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          name: isId ? 'Dataset Memasak (Cooking)' : 'Cooking Dataset (Egocentric)',
                          progress: 65,
                          status: isId ? 'Produksi' : 'In Production',
                          badge: 'text-[#027F86] bg-[#027F86]/10',
                        },
                        {
                          name: isId ? 'Manufaktur Assembly Line' : 'Manufacturing Assembly Line',
                          progress: 40,
                          status: isId ? 'Produksi' : 'In Production',
                          badge: 'text-[#027F86] bg-[#027F86]/10',
                        },
                        {
                          name: isId ? 'Otomotif (Driving & Interior)' : 'Automotive (Driving & Interior)',
                          progress: 100,
                          status: isId ? 'Review QA' : 'QA Review',
                          badge: 'text-[#B7791F] bg-[#F59E0B]/12',
                        },
                        {
                          name: isId ? 'Aktivitas Gudang (Logistik)' : 'Warehouse Logistics Ops',
                          progress: 15,
                          status: 'Setup',
                          badge: 'text-[#2563A6] bg-[#2563A6]/10',
                        },
                      ].map((row) => (
                        <div
                          key={row.name}
                          className="grid sm:grid-cols-12 items-center gap-3 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-4 py-3"
                        >
                          <p className="sm:col-span-5 text-xs font-bold">{row.name}</p>
                          <div className="sm:col-span-5 flex items-center gap-2">
                            <div className="h-2 flex-1 rounded-full bg-[var(--egvox-border-default)] overflow-hidden">
                              <div
                                className="h-full bg-[#027F86] rounded-full"
                                style={{ width: `${row.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold tabular-nums w-10 text-right">
                              {row.progress}%
                            </span>
                          </div>
                          <div className="sm:col-span-2 sm:text-right">
                            <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${row.badge}`}>
                              {row.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ENTERPRISE BUYER OVERVIEW */}
              {persona === 'enterprise' && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FC840E] text-white">
                        <ShieldCheck className="h-6 w-6" />
                      </span>
                      <div>
                        <h1 className="text-xl font-bold">PT Nusantara Riset Teknologi</h1>
                        <p className="text-xs text-[#16835D] font-semibold">
                          {isId
                            ? 'Enterprise Buyer (Proyek Resmi Terkelola · Privat)'
                            : 'Enterprise Buyer (Managed Official Projects · Private)'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRfpOpen(true)}
                      className="rounded-xl bg-[#FC840E] px-4 py-2.5 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{isId ? 'Ajukan Permintaan (RFP)' : 'Submit Data Request (RFP)'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: isId ? 'Permintaan RFP' : 'RFP Requests',
                        value: adminEnterpriseDeals.length + inquiries.length,
                        sub: isId ? 'Aktif di pipeline' : 'Active in pipeline',
                      },
                      {
                        label: isId ? 'Proyek Resmi' : 'Official Projects',
                        value: 6,
                        sub: isId ? 'Dikelola oleh EgvoX' : 'Managed by EgvoX',
                      },
                      {
                        label: isId ? 'Progress Rata-rata' : 'Average Progress',
                        value: '68%',
                        sub: isId ? 'Sesuai SLA 96%' : '96% on-SLA',
                      },
                      {
                        label: isId ? 'Menunggu Review' : 'Awaiting Review',
                        value: 3,
                        sub: isId ? 'Siap inspeksi sampel' : 'Ready for sample QA',
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4"
                      >
                        <p className="text-xs text-[var(--egvox-text-muted)]">{stat.label}</p>
                        <p className="mt-1 text-2xl font-bold tabular-nums">{stat.value}</p>
                        <p className="mt-1 text-[11px] text-[#FC840E] font-medium">{stat.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
                    <h2 className="text-sm font-bold">
                      {isId ? 'Proyek Resmi (Managed Official Projects)' : 'Managed Official Projects'}
                    </h2>
                    <div className="space-y-3">
                      {[
                        {
                          code: 'ENT-202611-0012',
                          name: isId ? 'Dataset Aktivitas Retail & Kasir' : 'Retail & POS Activity Dataset',
                          img: '/images/capture_warehouse_pov_1795676771521.jpg',
                          stage: isId ? 'Produksi' : 'Production',
                          progress: 68,
                        },
                        {
                          code: 'ENT-202611-0015',
                          name: isId ? 'Dataset Manufaktur & K3 Perakitan' : 'Manufacturing & Safety Assembly Dataset',
                          img: '/images/capture_manufacturing_pov_1795676770652.jpg',
                          stage: isId ? 'Review QA' : 'QA Review',
                          progress: 40,
                        },
                        {
                          code: 'ENT-202610-0008',
                          name: isId ? 'Dataset Otomotif Interior & Kokpit' : 'Automotive Interior & Cockpit Dataset',
                          img: '/images/capture_automotive_pov_1795676770764.jpg',
                          stage: isId ? 'Delivery Siap' : 'Delivery Ready',
                          progress: 100,
                        },
                      ].map((proj) => (
                        <div
                          key={proj.code}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3"
                        >
                          <img
                            src={proj.img}
                            alt={proj.name}
                            referrerPolicy="no-referrer"
                            className="h-14 w-24 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-mono text-[#027F86]">{proj.code}</p>
                            <p className="text-sm font-bold truncate">{proj.name}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="h-2 flex-1 rounded-full bg-[var(--egvox-border-default)] overflow-hidden">
                                <div className="h-full bg-[#027F86]" style={{ width: `${proj.progress}%` }} />
                              </div>
                              <span className="text-xs font-bold tabular-nums">{proj.progress}%</span>
                            </div>
                          </div>
                          <span className="rounded-lg bg-[#027F86]/10 px-2.5 py-1 text-xs font-bold text-[#027F86] shrink-0">
                            {proj.stage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 11-STEP END-TO-END WORKFLOW STRIP */}
              <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold">
                      {isId ? 'Alur Kerja End-to-End (11 Tahap · Semua Peran)' : 'End-to-End Workflow (11 Stages · All Roles)'}
                    </h2>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {isId
                        ? 'Dari kebutuhan dataset hingga delivery & pembayaran milestone yang teraudit.'
                        : 'From dataset requirements through private upload, QA, delivery, and milestone settlement.'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {WORKFLOW_11_STEPS.map((st) => (
                    <div
                      key={st.num}
                      className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3"
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#027F86] text-[10px] font-bold text-white tabular-nums">
                        {st.num}
                      </span>
                      <p className="mt-1.5 text-[11px] font-bold leading-snug">
                        {isId ? st.id : st.en}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Status Legend (Master PRD v1.3) */}
                <div className="border-t border-[var(--egvox-border-default)] pt-4 grid gap-4 md:grid-cols-2 text-[11px]">
                  <div>
                    <p className="font-bold text-[var(--egvox-text-secondary)] mb-2">
                      {isId ? 'Status Penugasan / Work Order' : 'Assignment / Work Order Status'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(isId
                        ? ['Draft', 'Menunggu', 'Negosiasi', 'Aktif', 'Review', 'Rework', 'Diterima', 'Ditolak', 'Selesai']
                        : ['Draft', 'Pending', 'Negotiating', 'Active', 'In Review', 'Rework', 'Accepted', 'Rejected', 'Completed']
                      ).map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-2 py-0.5 font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--egvox-text-secondary)] mb-2">
                      {isId ? 'Status Upload & QA Dataset' : 'Upload & Dataset QA Status'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(isId
                        ? ['Mengunggah', 'Validasi', 'Karantina', 'Dalam Review', 'Diterima Parsial', 'Diterima', 'Ditolak']
                        : ['Uploading', 'Validating', 'Quarantine', 'In Review', 'Partial Accept', 'Accepted', 'Rejected']
                      ).map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-2 py-0.5 font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= BROWSE PROJECTS / VENDOR PROJECT & TALENT RECRUITMENT ================= */}
          {activeTab === 'browse' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold">
                    {persona === 'vendor'
                      ? isId
                        ? 'Manajemen Project & Rekrutmen Talenta'
                        : 'Vendor Project & Talent Recruitment'
                      : isId
                      ? 'Jelajahi Project & Talenta Terverifikasi'
                      : 'Browse Verified Projects & Talent'}
                  </h1>
                  <p className="text-xs text-[var(--egvox-text-secondary)]">
                    {isId
                      ? 'Kompensasi dan ketentuan kerja dibicarakan secara privat melalui penawaran rekrutmen terstruktur.'
                      : 'Compensation and work terms are negotiated privately via structured recruitment offers.'}
                  </p>
                </div>
                {persona === 'vendor' && (
                  <button
                    type="button"
                    onClick={() => setCreateProjectOpen(true)}
                    className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isId ? 'Buat Project Baru' : 'New Project'}</span>
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeProjectsFiltered.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[16/9] bg-black">
                      <img
                        src={proj.previewImage}
                        alt={isId ? proj.title : proj.titleEn}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white">
                        {proj.dataType} · {proj.previewDuration}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold text-[#027F86]">{proj.vendorName}</p>
                        <h3 className="text-sm font-bold mt-0.5">{isId ? proj.title : proj.titleEn}</h3>
                        <p className="text-xs text-[var(--egvox-text-secondary)] mt-1 line-clamp-2">
                          {isId ? proj.summary : proj.summaryEn}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[var(--egvox-border-default)] flex items-center justify-between gap-2">
                        {proj.showBudgetDisclosure !== false ? (
                          <div>
                            <p className="text-[10px] font-medium text-[var(--egvox-text-muted)]">
                              {isId ? 'Info Budget Vendor' : 'Vendor Budget Info'}
                            </p>
                            <DualPrice amountIDR={proj.ratePerUnit} unitLabel={isId ? 'jam' : 'hour'} size="sm" />
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#027F86]">
                            {isId ? 'Negosiasi Privat' : 'Private Offer'}
                          </span>
                        )}
                        {persona === 'freelancer' ? (
                          <button
                            type="button"
                            onClick={() => openProposalModal(proj)}
                            className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white shrink-0"
                          >
                            {isId ? 'Ajukan Minat' : 'Express Interest'}
                          </button>
                        ) : (
                          <Link
                            href={`/marketplace/projects/${proj.slug}`}
                            className="rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold shrink-0"
                          >
                            {isId ? 'Kelola / Detail' : 'Details'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {persona === 'vendor' && (
                <div className="pt-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-bold">
                      {isId
                        ? 'Rekrut Talenta Freelancer (Video Contributor, Data Annotator & QA Specialist)'
                        : 'Recruit Verified Freelancer Talent'}
                    </h2>
                    <Link
                      href="/marketplace/services"
                      className="text-xs font-semibold text-[#027F86] hover:underline"
                    >
                      {isId ? 'Jelajahi Direktori Talenta →' : 'Browse Talent Directory →'}
                    </Link>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeServicesFiltered.slice(0, 6).map((srv) => (
                      <div
                        key={srv.id}
                        className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={srv.avatar}
                            alt={srv.freelancerName}
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{srv.freelancerName}</p>
                            <p className="text-[11px] text-[#027F86] font-semibold">{srv.roleType}</p>
                          </div>
                        </div>
                        <p className="text-xs font-semibold line-clamp-2">
                          {isId ? srv.title : srv.titleEn}
                        </p>
                        <div className="text-[11px] text-[var(--egvox-text-muted)] space-y-1">
                          <p className="truncate">
                            <strong>{isId ? 'Kapasitas:' : 'Capacity:'}</strong>{' '}
                            {isId ? srv.capacityLabel : srv.capacityLabelEn}
                          </p>
                          <p className="truncate">
                            <strong>{isId ? 'Tingkat Penerimaan:' : 'Acceptance:'}</strong>{' '}
                            {srv.acceptanceRatePercent ?? srv.slaPercent}% · ★ {srv.rating.toFixed(1)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--egvox-border-default)]">
                          <Link
                            href={`/marketplace/services/${srv.slug}`}
                            className="text-[11px] font-semibold text-[var(--egvox-text-secondary)] hover:text-[#027F86]"
                          >
                            {isId ? 'Profil Lengkap' : 'Full Profile'}
                          </Link>
                          <button
                            type="button"
                            onClick={() => openRecruitModal(srv)}
                            className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
                          >
                            {isId ? 'Rekrut' : 'Recruit'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= PROFIL KAPABILITAS FREELANCER ================= */}
          {activeTab === 'services' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold">
                    {isId ? 'Profil Kapabilitas Saya' : 'My Capability Profiles'}
                  </h1>
                  <p className="text-xs text-[var(--egvox-text-secondary)]">
                    {isId
                      ? 'Menampilkan spesialisasi, perangkat, kapasitas, SLA, & portfolio preview berizin 30–60 detik. Kompensasi dibahas privat via penawaran rekrutmen.'
                      : 'Displays specialization, equipment, capacity, SLA, and consented 30–60s portfolio previews. Compensation is negotiated privately.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateServiceOpen(true)}
                  className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isId ? 'Tambah Profil Kapabilitas' : 'Add Capability Profile'}</span>
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {activeServicesFiltered.slice(0, 4).map((srv) => {
                  const isPaused = pausedServiceIds.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-[#027F86]">{srv.roleType}</span>
                          <h3 className="text-sm font-bold mt-0.5">
                            {isId ? srv.title : srv.titleEn}
                          </h3>
                        </div>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isPaused
                              ? 'bg-[#F59E0B]/15 text-[#B7791F]'
                              : 'bg-[#16835D]/12 text-[#16835D]'
                          }`}
                        >
                          {isPaused
                            ? isId
                              ? 'Dijeda'
                              : 'Paused'
                            : isId
                            ? 'Siap Direkrut'
                            : 'Ready to Recruit'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--egvox-text-secondary)]">
                        {isId ? srv.description : srv.descriptionEn}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--egvox-border-default)]">
                        <div className="text-[11px] text-[var(--egvox-text-muted)]">
                          <span className="font-semibold text-[var(--egvox-text-primary)]">
                            {isId ? srv.capacityLabel : srv.capacityLabelEn}
                          </span>
                          {' · '}
                          <span>{isId ? srv.deliverySla : srv.deliverySlaEn}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              toggleServiceAvailability(srv.id, isId ? srv.title : srv.titleEn)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-[var(--egvox-border-default)] px-2.5 py-1 text-[11px] font-semibold hover:bg-[var(--egvox-bg-subtle)]"
                          >
                            {isPaused ? (
                              <>
                                <PlayCircle className="h-3.5 w-3.5 text-[#16835D]" />
                                <span>{isId ? 'Aktifkan' : 'Activate'}</span>
                              </>
                            ) : (
                              <>
                                <PauseCircle className="h-3.5 w-3.5 text-[#B7791F]" />
                                <span>{isId ? 'Jeda' : 'Pause'}</span>
                              </>
                            )}
                          </button>
                          <Link
                            href={`/marketplace/services/${srv.slug}`}
                            className="text-xs font-semibold text-[#027F86] hover:underline inline-flex items-center gap-1"
                          >
                            <span>{isId ? 'Pratinjau' : 'Preview'}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= PROPOSALS / PENGAJUAN MINAT ================= */}
          {activeTab === 'proposals' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-bold">
                  {isId ? 'Pengajuan Minat & Kualifikasi Proyek' : 'Project Interest & Qualification Applications'}
                </h1>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'pending', 'accepted', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setProposalFilter(st)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        proposalFilter === st
                          ? 'bg-[#027F86] text-white'
                          : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                      }`}
                    >
                      {st === 'all'
                        ? isId
                          ? 'Semua'
                          : 'All'
                        : st === 'pending'
                        ? isId
                          ? 'Dalam Review'
                          : 'Under Review'
                        : st === 'accepted'
                        ? isId
                          ? 'Disetujui'
                          : 'Accepted'
                        : isId
                        ? 'Ditolak'
                        : 'Rejected'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {filteredProposals.length === 0 ? (
                  <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 text-center text-xs text-[var(--egvox-text-muted)]">
                    {isId ? 'Belum ada pengajuan minat pada filter ini.' : 'No applications found in this filter.'}
                  </div>
                ) : (
                  filteredProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs font-mono text-[#027F86]">
                          {prop.vendorName} · {prop.createdAt}
                        </p>
                        <h3 className="text-sm font-bold mt-0.5">{prop.projectTitle}</h3>
                        <p className="text-xs text-[var(--egvox-text-secondary)] mt-1">{prop.note}</p>
                        {prop.deviceSummary && (
                          <p className="text-[11px] text-[var(--egvox-text-muted)] mt-1">
                            {isId ? 'Perangkat:' : 'Equipment:'} <strong>{prop.deviceSummary}</strong>
                          </p>
                        )}
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <p className="text-xs font-bold text-[#027F86] tabular-nums">
                          {prop.weeklyCapacityHours
                            ? `${prop.weeklyCapacityHours} ${isId ? 'jam/minggu' : 'hrs/week'}`
                            : `${prop.volume} ${isId ? 'unit' : 'units'}`}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="inline-block rounded-md bg-[#027F86]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#027F86]">
                            {prop.status}
                          </span>
                          {(prop.status === 'submitted' || prop.status === 'under_review') && (
                            <button
                              type="button"
                              onClick={() => withdrawProposal(prop.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#C43D3D]/40 px-2.5 py-1 text-[11px] font-semibold text-[#C43D3D] hover:bg-[#C43D3D]/8"
                            >
                              <Undo2 className="h-3 w-3" />
                              <span>{isId ? 'Tarik' : 'Withdraw'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= RECRUITMENT INBOX, VERSIONED OFFERS & WALLET LEDGER (v1.3) ================= */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold">
                    {persona === 'vendor'
                      ? isId
                        ? 'Rekrutmen Privat & Dompet Ledger Rekruter'
                        : 'Private Recruitment & Recruiter Wallet Ledger'
                      : isId
                      ? 'Tawaran Rekrutmen Privat & Negosiasi Versi'
                      : 'Private Recruitment Offers & Versioned Negotiation'}
                  </h1>
                  <p className="text-xs text-[var(--egvox-text-secondary)]">
                    {isId
                      ? 'Komunikasi dilakukan melalui versi penawaran terstruktur (V1–V3) dan klarifikasi terikat proyek — tanpa chat bebas.'
                      : 'All negotiations run through versioned offers and project-bound clarifications — zero free-form chat.'}
                  </p>
                </div>
                {persona === 'vendor' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('browse')}
                    className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isId ? 'Rekrut Talenta Baru' : 'Recruit New Talent'}</span>
                  </button>
                )}
              </div>

              {/* Saldo & Rekruter Card (for Vendor & Enterprise) */}
              {persona !== 'freelancer' && (
                <div className="grid gap-4 lg:grid-cols-12">
                  <div className="lg:col-span-7 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#027F86]">
                          {isId ? 'Saldo & Rekruter (Dompet Organisasi)' : 'Recruiter Organization Wallet Ledger'}
                        </p>
                        <p className="mt-1 text-2xl sm:text-3xl font-bold tabular-nums">
                          {egvoxFormatIDR(recruiterWallet.availableBalanceIDR)}
                        </p>
                        <p className="text-[11px] text-[var(--egvox-text-muted)] tabular-nums">
                          {isId ? 'Saldo Settled:' : 'Settled Balance:'}{' '}
                          {egvoxFormatIDR(recruiterWallet.settledBalanceIDR)} ·{' '}
                          {egvoxFormatUSD(recruiterWallet.availableBalanceIDR)} USD
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTopUpModalOpen(true)}
                        className="rounded-xl bg-[#027F86] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#039998] inline-flex items-center gap-1.5"
                      >
                        <Wallet className="h-4 w-4" />
                        <span>{isId ? 'Top Up Saldo' : 'Top Up Balance'}</span>
                      </button>
                    </div>
                    <div
                      className={`rounded-xl border px-3.5 py-2 text-xs font-semibold flex items-center gap-2 ${
                        recruiterWallet.settledBalanceIDR >= recruiterWallet.minPolicyIDR &&
                        recruiterWallet.vendorKybVerified
                          ? 'border-[#16835D]/30 bg-[#16835D]/10 text-[#16835D]'
                          : 'border-[#C43D3D]/30 bg-[#C43D3D]/10 text-[#C43D3D]'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        {recruiterWallet.settledBalanceIDR >= recruiterWallet.minPolicyIDR
                          ? isId
                            ? 'Organisasi Terverifikasi KYB & Memenuhi Minimum Saldo Rekrutmen (Min. Rp 5.000.000)'
                            : 'KYB Verified & Meets Minimum Recruitment Balance Policy (Min. Rp 5,000,000)'
                          : isId
                          ? 'Saldo settled belum memenuhi minimum Rp 5.000.000'
                          : 'Settled balance below Rp 5,000,000 policy'}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-2.5 text-xs tabular-nums">
                      <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3">
                        <p className="text-[11px] text-[var(--egvox-text-muted)]">
                          {isId ? 'Dana Direservasi (Penawaran)' : 'Reserved (Active Offers)'}
                        </p>
                        <p className="font-bold mt-0.5">{egvoxFormatIDR(recruiterWallet.reservedBalanceIDR)}</p>
                      </div>
                      <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3">
                        <p className="text-[11px] text-[var(--egvox-text-muted)]">
                          {isId ? 'Dana Terkomitmen (Work Order)' : 'Committed (Work Orders)'}
                        </p>
                        <p className="font-bold mt-0.5">{egvoxFormatIDR(recruiterWallet.committedBalanceIDR)}</p>
                      </div>
                      <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3">
                        <p className="text-[11px] text-[var(--egvox-text-muted)]">
                          {isId ? 'Pending Settlement PSP' : 'Pending PSP Settlement'}
                        </p>
                        <p className="font-bold mt-0.5 text-[#B7791F]">{egvoxFormatIDR(recruiterWallet.pendingTopUpIDR)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
                    <h2 className="text-sm font-bold">
                      {isId ? 'Status Rekrutmen Organisasi' : 'Recruitment Pipeline Status'}
                    </h2>
                    <div className="space-y-2 text-xs tabular-nums">
                      <div className="flex items-center justify-between rounded-xl bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5">
                        <span>{isId ? 'Penawaran Diajukan' : 'Offers Sent'}</span>
                        <span className="font-bold">
                          {recruitmentOffers.filter((o) => o.status === 'sent').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5">
                        <span>{isId ? 'Dalam Negosiasi (V2+)' : 'In Negotiation (V2+)'}</span>
                        <span className="font-bold text-[#FC840E]">
                          {recruitmentOffers.filter((o) => o.status === 'negotiating').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5">
                        <span>{isId ? 'Disepakati / Work Order' : 'Agreed / Work Order'}</span>
                        <span className="font-bold text-[#16835D]">
                          {recruitmentOffers.filter((o) => o.status === 'accepted').length}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--egvox-text-muted)]">
                      {isId
                        ? 'Catatan: Reservasi dana dilakukan terotorisasi melalui Payment Provider setelah saldo settled tervalidasi.'
                        : 'Note: Fund reservations are authorized through the Payment Provider against settled ledger funds.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Recruitment Inbox + Versioned Offer Detail */}
              <div className="grid gap-5 lg:grid-cols-12">
                {/* Left Column: Inbox List */}
                <div className="lg:col-span-5 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold">
                      {isId ? 'Tawaran Rekrutmen (Inbox)' : 'Recruitment Offers (Inbox)'}
                    </h2>
                    <div className="inline-flex rounded-lg border border-[var(--egvox-border-default)] p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setOfferInboxTab('penawaran')}
                        className={`rounded-md px-2.5 py-1 font-semibold ${
                          offerInboxTab === 'penawaran' ? 'bg-[#027F86] text-white' : ''
                        }`}
                      >
                        {isId ? 'Penawaran' : 'Offers'} ({recruitmentOffers.filter((o) => o.status !== 'accepted').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfferInboxTab('aktif')}
                        className={`rounded-md px-2.5 py-1 font-semibold ${
                          offerInboxTab === 'aktif' ? 'bg-[#027F86] text-white' : ''
                        }`}
                      >
                        {isId ? 'Aktif' : 'Active'} ({recruitmentOffers.filter((o) => o.status === 'accepted').length})
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {recruitmentOffers
                      .filter((o) =>
                        offerInboxTab === 'aktif'
                          ? o.status === 'accepted'
                          : o.status !== 'accepted'
                      )
                      .map((off) => {
                        const isSelected = activeOffer?.id === off.id;
                        return (
                          <button
                            key={off.id}
                            type="button"
                            onClick={() => setSelectedRecruitOfferId(off.id)}
                            className={`w-full text-left rounded-xl border p-3.5 transition-colors space-y-1.5 ${
                              isSelected
                                ? 'border-[#027F86] bg-[#027F86]/8'
                                : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] hover:border-[#027F86]/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-mono font-bold text-[#027F86]">
                                {off.code} · {off.workType}
                              </span>
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                                  off.status === 'accepted'
                                    ? 'bg-[#16835D]/15 text-[#16835D]'
                                    : off.status === 'negotiating'
                                    ? 'bg-[#FC840E]/15 text-[#FC840E]'
                                    : off.status === 'rejected' || off.status === 'withdrawn'
                                    ? 'bg-[#C43D3D]/15 text-[#C43D3D]'
                                    : 'bg-[#027F86]/15 text-[#027F86]'
                                }`}
                              >
                                {off.status}
                              </span>
                            </div>
                            <p className="text-xs font-bold leading-snug">{off.projectTitle}</p>
                            <div className="flex items-center justify-between text-[11px] text-[var(--egvox-text-muted)] tabular-nums">
                              <span>
                                {persona === 'freelancer' ? off.recruiterOrg : off.freelancerName}
                              </span>
                              <span className="font-bold text-[var(--egvox-text-primary)]">
                                {egvoxFormatIDR(off.grossFeeIDR)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Right Column: Detail Penawaran, Waterfall Biaya, Kesepakatan & Klarifikasi */}
                <div className="lg:col-span-7 space-y-4">
                  {activeOffer && (
                    <>
                      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#027F86]">
                                {activeOffer.code}
                              </span>
                              <span className="rounded-md bg-[var(--egvox-bg-canvas)] border border-[var(--egvox-border-default)] px-2 py-0.5 text-[10px] font-semibold">
                                {activeOffer.workType}
                              </span>
                              <span className="rounded-md bg-[#027F86]/10 px-2 py-0.5 text-[10px] font-bold text-[#027F86]">
                                {activeOffer.bindingType === 'binding'
                                  ? isId
                                    ? 'Penawaran Mengikat'
                                    : 'Binding Offer'
                                  : isId
                                  ? 'Undangan Screening'
                                  : 'Screening Invite'}
                              </span>
                            </div>
                            <h2 className="text-base font-bold mt-1">{activeOffer.projectTitle}</h2>
                            <p className="text-xs text-[var(--egvox-text-muted)]">
                              {isId ? 'Rekruter:' : 'Recruiter:'} <strong>{activeOffer.recruiterOrg}</strong> ·{' '}
                              {isId ? 'Talenta:' : 'Talent:'} <strong>{activeOffer.freelancerName}</strong> · Spec{' '}
                              <span className="font-mono">{activeOffer.specVersion}</span>
                            </p>
                          </div>
                          <span className="rounded-lg bg-[#027F86]/12 px-2.5 py-1 text-xs font-bold text-[#027F86] uppercase">
                            {activeOffer.status}
                          </span>
                        </div>

                        {activeOffer.workType === 'QA Specialist' && (
                          <div className="rounded-xl border border-[#16835D]/30 bg-[#16835D]/8 px-3.5 py-2 text-[11px] font-semibold text-[#16835D] flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 shrink-0" />
                            <span>
                              {isId
                                ? 'Pemeriksaan Anti-Konflik Lolos: QA Specialist independen (tidak mengaudit output produksi sendiri).'
                                : 'Anti-Conflict Check Passed: Independent QA Specialist (does not audit own production output).'}
                            </span>
                          </div>
                        )}

                        {/* Timeline Versi Penawaran */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-[var(--egvox-text-muted)]">
                            {isId
                              ? `Riwayat Versi Penawaran (${activeOffer.versions.length} Versi)`
                              : `Offer Version History (${activeOffer.versions.length} Versions)`}
                          </p>
                          <div className="space-y-2">
                            {activeOffer.versions.map((ver) => (
                              <div
                                key={ver.version}
                                className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-xs space-y-1"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="font-bold text-[#027F86]">
                                    V{ver.version} ·{' '}
                                    {ver.actorRole === 'recruiter'
                                      ? isId
                                        ? 'Penawaran Rekruter'
                                        : 'Recruiter Offer'
                                      : isId
                                      ? 'Counteroffer Freelancer'
                                      : 'Freelancer Counteroffer'}{' '}
                                    ({ver.actorName})
                                  </span>
                                  <span className="font-mono text-[10px] text-[var(--egvox-text-muted)]">
                                    {ver.timestamp}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 tabular-nums">
                                  <span className="font-bold">{egvoxFormatIDR(ver.grossFeeIDR)} (Gross)</span>
                                  {ver.scopeDelta && (
                                    <span className="text-[11px] text-[var(--egvox-text-muted)]">
                                      {ver.scopeDelta}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[var(--egvox-text-secondary)]">{ver.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rincian Biaya Transparan */}
                        <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-1.5 tabular-nums">
                          <p className="font-bold mb-1">
                            {isId ? 'Rincian Biaya & Kompensasi Transparan' : 'Transparent Fee & Net Compensation Breakdown'}
                          </p>
                          <div className="flex justify-between">
                            <span className="text-[var(--egvox-text-muted)]">
                              {isId ? 'Total Pembayaran (Gross)' : 'Total Payment (Gross)'}
                            </span>
                            <span className="font-bold">{egvoxFormatIDR(activeOffer.grossFeeIDR)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--egvox-text-muted)]">
                              {isId ? 'Biaya Admin EgvoX (8%)' : 'EgvoX Admin Fee (8%)'}
                            </span>
                            <span className="font-semibold text-[#C43D3D]">- {egvoxFormatIDR(activeOffer.adminFeeIDR)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--egvox-text-muted)]">
                              {isId ? 'Biaya Pembayaran (±1,5%)' : 'Payment Fee (±1.5%)'}
                            </span>
                            <span className="font-semibold text-[#C43D3D]">- {egvoxFormatIDR(activeOffer.paymentFeeIDR)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-[var(--egvox-border-default)] text-sm">
                            <span className="font-bold text-[#16835D]">
                              {isId ? 'Penerimaan Freelancer (Net)' : 'Freelancer Net Payout'}
                            </span>
                            <span className="font-bold text-[#16835D]">
                              {egvoxFormatIDR(activeOffer.freelancerNetIDR)}
                            </span>
                          </div>
                        </div>

                        {/* Kesepakatan & Work Order OR Action Buttons */}
                        {activeOffer.status === 'accepted' ? (
                          <div className="rounded-xl border border-[#16835D]/35 bg-[#16835D]/10 p-4 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="text-xs font-bold text-[#16835D] inline-flex items-center gap-1.5">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>
                                    {isId
                                      ? 'Kesepakatan Tercapai & Work Order Aktif'
                                      : 'Agreement Reached & Work Order Active'}
                                  </span>
                                </p>
                                <p className="text-[11px] font-mono text-[var(--egvox-text-secondary)] mt-0.5">
                                  Work Order: {activeOffer.code.replace(/^(VO|AN|QA)-/, 'WO-')} ·{' '}
                                  {isId
                                    ? 'Status Dana: Reservasi Dana Terotorisasi Ledger'
                                    : 'Funding Status: Ledger Authorized Fund Reservation'}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveTab('tracking')}
                                className="rounded-xl border border-[#16835D] bg-[var(--egvox-bg-surface)] px-3.5 py-2 text-xs font-semibold text-[#16835D]"
                              >
                                {isId ? 'Lihat Work Order' : 'View Work Order'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setPrivateUploadOpen(true)}
                                className="rounded-xl bg-[#027F86] px-3.5 py-2 text-xs font-semibold text-white"
                              >
                                {isId ? 'Mulai Pekerjaan' : 'Start Work'}
                              </button>
                            </div>
                          </div>
                        ) : (activeOffer.status === 'sent' ||
                            activeOffer.status === 'negotiating' ||
                            activeOffer.status === 'draft') && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => respondRecruitmentOffer(activeOffer.id, 'accepted')}
                              className="rounded-xl bg-[#16835D] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                            >
                              {isId ? 'Terima Penawaran' : 'Accept Offer'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setCounterTarget(activeOffer)}
                              className="rounded-xl border border-[#027F86] px-4 py-2 text-xs font-semibold text-[#027F86] hover:bg-[#027F86]/8"
                            >
                              {isId ? 'Ajukan Counteroffer' : 'Counteroffer'}
                            </button>
                            <button
                              type="button"
                              onClick={() => respondRecruitmentOffer(activeOffer.id, 'rejected')}
                              className="rounded-xl border border-[#C43D3D]/50 px-4 py-2 text-xs font-semibold text-[#C43D3D] hover:bg-[#C43D3D]/8"
                            >
                              {isId ? 'Tolak' : 'Decline'}
                            </button>
                            {persona === 'vendor' && (
                              <button
                                type="button"
                                onClick={() => respondRecruitmentOffer(activeOffer.id, 'withdrawn')}
                                className="rounded-xl border border-[var(--egvox-border-default)] px-3 py-2 text-xs font-semibold text-[var(--egvox-text-muted)]"
                              >
                                {isId ? 'Tarik Penawaran' : 'Withdraw'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Structured Clarifications Bound to Active Offer (Zero Free-Form Chat) */}
                      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
                        <div>
                          <h3 className="text-sm font-bold">
                            {isId
                              ? `Klarifikasi Terstruktur (${activeOffer.code})`
                              : `Structured Clarifications (${activeOffer.code})`}
                          </h3>
                          <p className="text-[11px] text-[var(--egvox-text-muted)]">
                            {isId
                              ? 'Pertanyaan berbasis topik proyek yang tercatat resmi. Tidak tersedia chat bebas antar pengguna.'
                              : 'Topic-tagged official project clarifications. No free-form user chat.'}
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          {clarifications.filter((c) => c.offerCode === activeOffer.code).length === 0 ? (
                            <p className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3 text-xs text-[var(--egvox-text-muted)]">
                              {isId ? 'Belum ada catatan klarifikasi pada penawaran ini.' : 'No structured clarifications yet.'}
                            </p>
                          ) : (
                            clarifications
                              .filter((c) => c.offerCode === activeOffer.code)
                              .map((clr) => (
                                <div
                                  key={clr.id}
                                  className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-xs space-y-2"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="font-bold text-[#027F86] uppercase text-[10px]">
                                      {isId ? 'Topik:' : 'Topic:'} {clr.topic} · {clr.senderName}
                                    </span>
                                    <span
                                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                        clr.status === 'resolved'
                                          ? 'bg-[#16835D]/12 text-[#16835D]'
                                          : 'bg-[#F59E0B]/15 text-[#B7791F]'
                                      }`}
                                    >
                                      {clr.status === 'resolved'
                                        ? isId
                                          ? 'Terjawab'
                                          : 'Resolved'
                                        : isId
                                        ? 'Menunggu Jawaban'
                                        : 'Awaiting Reply'}
                                    </span>
                                  </div>
                                  <p className="font-medium">{clr.question}</p>
                                  {clr.answer ? (
                                    <p className="rounded-lg bg-[var(--egvox-bg-surface)] border border-[var(--egvox-border-default)] px-3 py-2 text-[var(--egvox-text-secondary)]">
                                      <strong>{isId ? 'Jawaban:' : 'Answer:'}</strong> {clr.answer}
                                    </p>
                                  ) : (
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={clarifyAnswerDrafts[clr.id] || ''}
                                        onChange={(e) =>
                                          setClarifyAnswerDrafts((prev) => ({
                                            ...prev,
                                            [clr.id]: e.target.value,
                                          }))
                                        }
                                        placeholder={isId ? 'Tulis jawaban resmi...' : 'Write official answer...'}
                                        className="flex-1 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5 text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const draft = clarifyAnswerDrafts[clr.id] || '';
                                          if (!draft.trim()) return;
                                          resolveClarification(clr.id, draft);
                                          setClarifyAnswerDrafts((prev) => ({
                                            ...prev,
                                            [clr.id]: '',
                                          }));
                                        }}
                                        className="rounded-lg bg-[#027F86] px-3 py-1.5 text-[11px] font-semibold text-white"
                                      >
                                        {isId ? 'Jawab' : 'Resolve'}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))
                          )}
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!clarifyText.trim()) return;
                            submitClarification(
                              activeOffer.code,
                              activeOffer.projectTitle,
                              clarifyTopic,
                              clarifyText,
                              persona === 'freelancer' ? 'freelancer' : 'recruiter'
                            );
                            setClarifyText('');
                          }}
                          className="grid sm:grid-cols-12 gap-2 pt-2 border-t border-[var(--egvox-border-default)]"
                        >
                          <select
                            value={clarifyTopic}
                            onChange={(e) =>
                              setClarifyTopic(e.target.value as StructuredClarification['topic'])
                            }
                            className="sm:col-span-4 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                          >
                            <option value="spec">{isId ? 'Topik: Capture Spec' : 'Topic: Capture Spec'}</option>
                            <option value="deliverables">{isId ? 'Topik: Deliverables & SLA' : 'Topic: Deliverables & SLA'}</option>
                            <option value="schedule">{isId ? 'Topik: Jadwal & Milestone' : 'Topic: Schedule & Milestone'}</option>
                            <option value="conflict_check">{isId ? 'Topik: Anti-Konflik QA' : 'Topic: QA Anti-Conflict'}</option>
                          </select>
                          <input
                            type="text"
                            value={clarifyText}
                            onChange={(e) => setClarifyText(e.target.value)}
                            placeholder={
                              isId
                                ? 'Ajukan pertanyaan terstruktur terkait spec...'
                                : 'Submit spec clarification question...'
                            }
                            className="sm:col-span-6 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                          />
                          <button
                            type="submit"
                            className="sm:col-span-2 rounded-xl bg-[#027F86] px-3 py-2 text-xs font-semibold text-white"
                          >
                            {isId ? 'Kirim' : 'Submit'}
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= WORK ORDERS & TRACKING ================= */}
          {activeTab === 'tracking' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-bold">
                  {persona === 'enterprise'
                    ? isId
                      ? 'Proyek Resmi & Kontrak (Managed)'
                      : 'Official Projects & Contracts (Managed)'
                    : isId
                    ? 'Work Order & Pipeline Produksi'
                    : 'Work Orders & Production Pipeline'}
                </h1>
                <button
                  type="button"
                  onClick={() => setPrivateUploadOpen(true)}
                  className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>{isId ? 'Upload Video Privat' : 'Private Video Upload'}</span>
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {workOrders.map((wo) => (
                  <button
                    key={wo.id}
                    type="button"
                    onClick={() => setSelectedOrderId(wo.id)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      selectedOrder?.id === wo.id
                        ? 'border-[#027F86] bg-[#027F86]/8'
                        : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
                    }`}
                  >
                    <p className="text-xs font-mono text-[#027F86]">{wo.code}</p>
                    <p className="text-sm font-bold mt-0.5">
                      {isId ? wo.title : wo.titleEn || wo.title}
                    </p>
                    <p className="text-xs text-[var(--egvox-text-muted)] mt-1">
                      {wo.counterparty} · {wo.progressPercent}%
                    </p>
                  </button>
                ))}
              </div>

              {selectedOrder && (
                <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-mono text-[#027F86]">
                        {selectedOrder.code} · {selectedOrder.specVersion}
                      </p>
                      <h2 className="text-base font-bold">
                        {isId ? selectedOrder.title : selectedOrder.titleEn || selectedOrder.title}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setContractOrder(selectedOrder)}
                        className="rounded-xl border border-[var(--egvox-border-default)] px-3 py-2 text-xs font-semibold"
                      >
                        {isId ? 'Lihat Spesifikasi Kontrak' : 'View Contract Spec'}
                      </button>
                      {persona === 'freelancer' && (
                        <button
                          type="button"
                          onClick={() => acknowledgeOrderSpec(selectedOrder.id)}
                          disabled={acknowledgedOrderIds.includes(selectedOrder.id)}
                          className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                            acknowledgedOrderIds.includes(selectedOrder.id)
                              ? 'bg-[#16835D]/12 text-[#16835D]'
                              : 'bg-[#027F86] text-white'
                          }`}
                        >
                          {acknowledgedOrderIds.includes(selectedOrder.id)
                            ? isId
                              ? 'Spec Disetujui ✓'
                              : 'Spec Acknowledged ✓'
                            : isId
                            ? `Setujui ${selectedOrder.specVersion}`
                            : `Acknowledge ${selectedOrder.specVersion}`}
                        </button>
                      )}
                      {persona === 'vendor' && (
                        <button
                          type="button"
                          onClick={() => setMilestoneModalOrder(selectedOrder)}
                          className="rounded-xl bg-[#FC840E] px-3 py-2 text-xs font-semibold text-white"
                        >
                          {isId ? 'Milestone / Change Request' : 'Milestone / Change'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setReviewOpen(true)}
                        className="rounded-xl border border-[#027F86] px-3 py-2 text-xs font-semibold text-[#027F86]"
                      >
                        {isId ? 'Beri Ulasan' : 'Rate Order'}
                      </button>
                    </div>
                  </div>

                  {/* File-Level Submission QA Verdicts */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--egvox-text-muted)]">
                      {isId ? 'Status Validasi File & Karantina QA' : 'File Validation & QA Verdicts'}
                    </h3>
                    {submissionFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-mono font-bold">{file.fileName}</p>
                          <p className="text-[11px] text-[var(--egvox-text-muted)] tabular-nums">
                            {file.durationLabel} · {file.sizeLabel} · SHA-256: {file.checksumSha256.slice(0, 14)}…
                          </p>
                          {(file.qaReasonId || file.qaReasonEn) && (
                            <p className="text-[11px] text-[#B7791F] mt-1">
                              {isId ? file.qaReasonId : file.qaReasonEn || file.qaReasonId}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${
                              file.status === 'accepted'
                                ? 'bg-[#16835D]/12 text-[#16835D]'
                                : file.status === 'rework_required'
                                ? 'bg-[#C43D3D]/12 text-[#C43D3D]'
                                : 'bg-[#F59E0B]/15 text-[#B7791F]'
                            }`}
                          >
                            {file.status}
                          </span>
                          {file.status === 'rework_required' && (
                            <button
                              type="button"
                              onClick={() => setReworkTarget(file)}
                              className="rounded-lg bg-[#027F86] px-3 py-1.5 text-[11px] font-semibold text-white"
                            >
                              {isId ? 'Rework / Banding' : 'Rework / Appeal'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= PRIVATE UPLOADS (3-STEP + HISTORY) ================= */}
          {activeTab === 'uploads' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold">
                    {isId ? 'Upload Tugas & Zona Karantina Privat' : 'Private Video Uploads & Quarantine'}
                  </h1>
                  <p className="text-xs text-[var(--egvox-text-secondary)]">
                    {isId
                      ? 'Seluruh file raw video masuk sesi upload terenkripsi SHA-256 dan tidak pernah dipublikasikan.'
                      : 'All raw videos enter SHA-256 encrypted upload sessions and are never publicly listed.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivateUploadOpen(true)}
                  className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>{isId ? 'Mulai Sesi Upload (3 Langkah)' : 'Start 3-Step Upload'}</span>
                </button>
              </div>
              <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-muted)]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">File</th>
                      <th className="px-4 py-3 font-semibold">
                        {isId ? 'Ukuran & Durasi' : 'Size & Duration'}
                      </th>
                      <th className="px-4 py-3 font-semibold">Checksum SHA-256</th>
                      <th className="px-4 py-3 font-semibold">{isId ? 'Status QA' : 'QA Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--egvox-border-default)] tabular-nums">
                    {submissionFiles.map((f) => (
                      <tr key={f.id}>
                        <td className="px-4 py-3 font-mono font-bold">{f.fileName}</td>
                        <td className="px-4 py-3">{f.sizeLabel} · {f.durationLabel}</td>
                        <td className="px-4 py-3 font-mono text-[var(--egvox-text-muted)]">
                          {f.checksumSha256.slice(0, 20)}…
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-[#027F86]/10 px-2 py-0.5 font-bold text-[#027F86]">
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= ANNOTATION JOBS & INTERACTIVE STUDIO ================= */}
          {activeTab === 'annotation' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold">
                    {persona === 'enterprise'
                      ? isId
                        ? 'Jaminan Kualitas & Audit Skema (QA)'
                        : 'Quality Assurance & Schema Audit'
                      : isId
                      ? 'Tugas Anotasi & Workspace (Skema v1.2)'
                      : 'Annotation Jobs & Workspace (Schema v1.2)'}
                  </h1>
                  <p className="text-xs text-[var(--egvox-text-secondary)]">
                    {isId
                      ? 'Pelabelan manusia terstruktur: Bounding Box, Object Tracking, Keypoints, & Temporal Action Segments.'
                      : 'Human-in-the-loop labeling: Bounding Box, Object Tracking, Keypoints, and Temporal Action Segments.'}
                  </p>
                </div>
                <div className="inline-flex rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-1">
                  <button
                    type="button"
                    onClick={() => setAnnotationSubMode('tasks')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      annotationSubMode === 'tasks' ? 'bg-[#027F86] text-white' : ''
                    }`}
                  >
                    {isId ? 'Daftar Tugas' : 'Task Queue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnotationSubMode('studio')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      annotationSubMode === 'studio' ? 'bg-[#027F86] text-white' : ''
                    }`}
                  >
                    {isId ? 'Workspace Anotasi' : 'Annotation Workspace'}
                  </button>
                </div>
              </div>

              {annotationSubMode === 'tasks' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {opsAnnotationProjects.map((ap) => (
                    <div
                      key={ap.id}
                      className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 flex gap-4 items-center"
                    >
                      <img
                        src={ap.previewImage}
                        alt={isId ? ap.titleId : ap.titleEn}
                        referrerPolicy="no-referrer"
                        className="h-20 w-28 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-mono text-[#027F86]">
                          {ap.code} · {ap.schemaVersion}
                        </p>
                        <h3 className="text-sm font-bold truncate">
                          {isId ? ap.titleId : ap.titleEn}
                        </h3>
                        <p className="text-xs text-[var(--egvox-text-muted)] tabular-nums mt-0.5">
                          {ap.completedTasks} / {ap.taskCount} {isId ? 'tugas' : 'tasks'} ({ap.progressPercent}%)
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAnnotationId(ap.id);
                            setAnnotationSubMode('studio');
                          }}
                          className="mt-2 rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          {isId ? 'Buka Studio Anotasi' : 'Open Annotation Studio'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <AnnotationWorkspaceView
                  project={selectedAnnotationProject}
                  onCompleteSubmit={() => setAnnotationSubMode('tasks')}
                />
              )}
            </div>
          )}

          {/* ================= DELIVERIES & RIGHTS MANIFEST ================= */}
          {activeTab === 'delivery' && (
            <div className="space-y-5">
              <h1 className="text-xl font-bold">
                {isId ? 'Pengiriman Dataset & Rights Manifest' : 'Dataset Deliveries & Rights Manifest'}
              </h1>
              <div className="grid gap-4 md:grid-cols-2">
                {opsDeliveryPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-mono text-[#027F86]">
                          {pkg.packageCode} · {pkg.version}
                        </p>
                        <h3 className="text-base font-bold mt-0.5">
                          {isId ? pkg.titleId : pkg.titleEn}
                        </h3>
                        <p className="text-xs text-[var(--egvox-text-muted)]">
                          {isId ? 'Pembeli:' : 'Buyer:'} {pkg.buyerName}
                        </p>
                      </div>
                      <span className="rounded-md bg-[#16835D]/12 px-2.5 py-1 text-[11px] font-bold text-[#16835D]">
                        {pkg.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-[var(--egvox-bg-canvas)] p-3 text-xs tabular-nums">
                      <div>
                        <p className="text-[var(--egvox-text-muted)]">
                          {isId ? 'Total File' : 'Total Files'}
                        </p>
                        <p className="font-bold">{pkg.totalFiles.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[var(--egvox-text-muted)]">
                          {isId ? 'Ukuran' : 'Size'}
                        </p>
                        <p className="font-bold">{pkg.totalSizeGb} GB</p>
                      </div>
                      <div>
                        <p className="text-[var(--egvox-text-muted)]">Format</p>
                        <p className="font-bold">{pkg.exportFormat}</p>
                      </div>
                    </div>
                      <div className="flex flex-wrap gap-2">
                        {persona === 'enterprise' && (
                          <button
                            type="button"
                            onClick={() => setInspectDeliveryPkg(pkg)}
                            className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                              acceptedEnterpriseDeliveries.includes(pkg.id)
                                ? 'bg-[#16835D]/12 text-[#16835D]'
                                : 'border border-[#FC840E] text-[#FC840E]'
                            }`}
                          >
                            {acceptedEnterpriseDeliveries.includes(pkg.id)
                              ? isId
                                ? 'Diterima Enterprise ✓'
                                : 'Enterprise Accepted ✓'
                              : isId
                              ? 'Inspeksi Sampel & Terima'
                              : 'Inspect Sample & Accept'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            showToast(
                              isId
                                ? `Mengunduh paket terenkripsi ${pkg.packageCode} & Rights Manifest PDF.`
                                : `Downloading encrypted ${pkg.packageCode} & Rights Manifest.`
                            )
                          }
                          className="flex-1 rounded-xl bg-[#027F86] px-3 py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
                        >
                          <Download className="h-4 w-4" />
                          <span>{isId ? 'Unduh Paket & Manifest' : 'Download Package & Manifest'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* ================= EARNINGS / BILLING ================= */}
          {(activeTab === 'earnings' || activeTab === 'billing') && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
                <div>
                  <p className="text-xs text-[var(--egvox-text-muted)]">
                    {persona === 'freelancer'
                      ? isId
                        ? 'Saldo Layak Payout (Setelah QA Acceptance)'
                        : 'Payout Eligible Balance (Post-QA Acceptance)'
                      : isId
                      ? 'Ringkasan Invoice & Saldo Work Order Organisasi'
                      : 'Organization Work Order Billing Summary'}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[#027F86] dark:text-[#04B8B4] tabular-nums">
                    {egvoxFormatIDR(availableBalance)}
                  </p>
                  <p className="text-xs text-[var(--egvox-text-muted)] tabular-nums">
                    {egvoxFormatUSD(availableBalance)} USD
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewOpen(true)}
                    className="rounded-xl border border-[#027F86] px-4 py-2.5 text-xs font-semibold text-[#027F86] hover:bg-[#027F86]/8"
                  >
                    {isId ? 'Beri Ulasan & Rating' : 'Rate & Review Order'}
                  </button>
                  {persona === 'freelancer' && (
                    <button
                      type="button"
                      onClick={() => setPayoutOpen(true)}
                      className="rounded-xl bg-[#027F86] px-5 py-2.5 text-xs font-semibold text-white"
                    >
                      {isId ? 'Tarik Dana (Request Payout)' : 'Withdraw Payout'}
                    </button>
                  )}
                </div>
              </div>

              {/* Status Pembayaran & Pencairan 6-Tahap (Master PRD §10) */}
              <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-bold">
                    {isId
                      ? 'Alur Status Pembayaran & Pencairan (WO-EGX-0256)'
                      : 'Payment & Payout Settlement Progress'}
                  </h2>
                  <span className="rounded-md bg-[#16835D]/12 px-2.5 py-0.5 text-[11px] font-bold text-[#16835D]">
                    {isId ? 'QA Diterima · Siap Cair' : 'QA Accepted · Ready'}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6 text-xs">
                  {(
                    [
                      { labelId: 'Penawaran Disepakati', labelEn: 'Offer Agreed', state: 'done' },
                      { labelId: 'Work Order Aktif', labelEn: 'Work Order Active', state: 'done' },
                      { labelId: 'Tugas Disubmit', labelEn: 'Work Submitted', state: 'done' },
                      { labelId: 'QA Diterima (50/50)', labelEn: 'QA Accepted', state: 'done' },
                      { labelId: 'Pembayaran Diproses', labelEn: 'Settlement Processing', state: 'active' },
                      { labelId: 'Pencairan Ke Freelancer', labelEn: 'Released to Freelancer', state: 'next' },
                    ] as const
                  ).map((st) => (
                    <div
                      key={st.labelId}
                      className={`rounded-xl border px-3 py-2.5 flex items-center gap-2 ${
                        st.state === 'done'
                          ? 'border-[#16835D]/35 bg-[#16835D]/10 text-[#16835D]'
                          : st.state === 'active'
                          ? 'border-[#FC840E]/45 bg-[#FC840E]/10 text-[#FC840E]'
                          : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-muted)]'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-semibold leading-tight">
                        {isId ? st.labelId : st.labelEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
                <h2 className="text-sm font-bold">
                  {isId ? 'Riwayat Payout & Transaksi Selesai' : 'Payout & Completed Transaction Ledger'}
                </h2>
                {payoutHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-4 py-3 text-xs"
                  >
                    <div>
                      <p className="font-bold">{item.destination}</p>
                      <p className="text-[11px] text-[var(--egvox-text-muted)]">{item.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-3 tabular-nums">
                      <div className="text-right">
                        <p className="font-bold">{egvoxFormatIDR(item.amount)}</p>
                        <span className="text-[11px] font-semibold text-[#16835D]">{item.status}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReviewOpen(true)}
                        className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5 text-[11px] font-semibold hover:border-[#027F86] hover:text-[#027F86]"
                      >
                        {isId ? 'Ulasan & Rating' : 'Leave Review'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Free-form chat messaging removed per Master PRD v1.3; replaced with versioned offers & structured clarifications in Offers tab. */}

          {/* ================= TEAM & ORGANIZATION ================= */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold">
                    {isId ? 'Tim & Manajemen Organisasi' : 'Team & Organization Management'}
                  </h1>
                  <p className="text-xs text-[var(--egvox-text-secondary)]">
                    {isId ? 'Organisasi aktif:' : 'Active organization:'} <strong>{activeOrg}</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrgModalOpen(true)}
                    className="rounded-xl border border-[var(--egvox-border-default)] px-3.5 py-2 text-xs font-semibold"
                  >
                    {isId ? 'Ganti Organisasi' : 'Switch Org'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeamInviteOpen(true)}
                    className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isId ? 'Undang Anggota' : 'Invite Member'}</span>
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] divide-y divide-[var(--egvox-border-default)]">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold">{member.name}</p>
                      <p className="text-[var(--egvox-text-muted)]">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#027F86]/10 px-2.5 py-1 font-semibold text-[#027F86]">
                        {member.role}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTeamMembers((prev) =>
                            prev.filter((m) => m.id !== member.id)
                          );
                          showToast(
                            isId
                              ? `Akses ${member.name} diperbarui.`
                              : `Access updated for ${member.name}.`
                          );
                        }}
                        className="rounded-lg border border-[var(--egvox-border-default)] px-2.5 py-1 text-[11px] hover:bg-[var(--egvox-bg-subtle)]"
                      >
                        {isId ? 'Cabut' : 'Revoke'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= PROFILE, PORTFOLIO & KYC ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold">
                      {isId ? 'Verifikasi Identitas (KYC & Consent)' : 'Identity & Consent Verification'}
                    </h2>
                    <span className="rounded-md bg-[#16835D]/12 px-2.5 py-1 text-xs font-bold text-[#16835D]">
                      {kycStatus === 'verified' ? 'Verified' : 'Pending Review'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--egvox-text-secondary)]">
                    {isId
                      ? 'Verifikasi KYC diperlukan untuk kelayakan payout serta penerimaan Work Order bernilai tinggi.'
                      : 'KYC verification unlocks payout withdrawals and high-value Work Orders.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setKycOpen(true)}
                    className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
                  >
                    {isId ? 'Perbarui Dokumen KYC' : 'Upload KYC Document'}
                  </button>
                </div>

                <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-bold">{isId ? 'Ulasan & Reputasi' : 'Reviews & Reputation'}</h2>
                    <button
                      type="button"
                      onClick={() => setReviewOpen(true)}
                      className="rounded-lg border border-[#027F86] px-2.5 py-1 text-[11px] font-semibold text-[#027F86]"
                    >
                      {isId ? '+ Tulis Ulasan' : '+ Write Review'}
                    </button>
                  </div>
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{rev.targetName}</span>
                        <span className="inline-flex items-center gap-1 text-[#F59E0B] font-bold">
                          <Star className="h-3.5 w-3.5 fill-[#F59E0B]" /> {rev.rating}.0
                        </span>
                      </div>
                      <p className="text-[var(--egvox-text-secondary)]">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Profile & Consented Previews */}
              <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold">
                      {isId ? 'Portofolio & Profil Publik Talenta' : 'Talent Portfolio & Public Profile'}
                    </h2>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {isId
                        ? 'Menampilkan keahlian, perangkat, kapasitas, dan cuplikan berizin ber-watermark untuk kebutuhan rekrutmen.'
                        : 'Displays verified skills, gear, capacity, and consented watermarked previews for recruitment.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateServiceOpen(true)}
                      className="rounded-xl border border-[var(--egvox-border-default)] px-3.5 py-2 text-xs font-semibold"
                    >
                      {isId ? '+ Tambah Kapabilitas' : '+ Add Capability'}
                    </button>
                    <Link
                      href="/freelancers/rizal-maulana"
                      className="rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                    >
                      <span>{isId ? 'Lihat Profil Portofolio Publik' : 'View Public Portfolio Profile'}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeServicesFiltered
                    .flatMap((srv) => srv.portfolioPreviews)
                    .slice(0, 3)
                    .map((pf) => (
                      <div
                        key={pf.id}
                        className="overflow-hidden rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)]"
                      >
                        <div className="relative aspect-[16/9] bg-[#102326]">
                          <img
                            src={pf.thumbnail}
                            alt={isId ? pf.title : pf.titleEn || pf.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-mono text-white">
                            {pf.duration} · Watermarked
                          </span>
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-bold">{isId ? pf.title : pf.titleEn || pf.title}</p>
                          <p className="mt-0.5 text-[11px] text-[#16835D]">
                            {isId ? 'Sampel portofolio berizin' : 'Consented portfolio sample'}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= SETTINGS & SECURITY ================= */}
          {activeTab === 'settings' && (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4 max-w-2xl">
              <h1 className="text-xl font-bold">
                {isId ? 'Pengaturan Keamanan & MFA Workspace' : 'Workspace Security & MFA Settings'}
              </h1>
              <div className="flex items-center justify-between rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4">
                <div>
                  <p className="text-sm font-bold">Two-Factor Authentication (MFA)</p>
                  <p className="text-xs text-[var(--egvox-text-muted)]">
                    {isId
                      ? 'Wajib untuk persetujuan payout dan unduhan manifest dataset.'
                      : 'Required for payout approvals and dataset manifest downloads.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMfaEnabled((v) => !v);
                    showToast(
                      isId ? 'Pengaturan MFA diperbarui.' : 'MFA security setting updated.'
                    );
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-bold ${
                    mfaEnabled
                      ? 'bg-[#16835D] text-white'
                      : 'border border-[var(--egvox-border-default)]'
                  }`}
                >
                  {mfaEnabled
                    ? isId
                      ? 'MFA Aktif'
                      : 'MFA Enabled'
                    : isId
                    ? 'Aktifkan MFA'
                    : 'Enable MFA'}
                </button>
              </div>
              <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2">
                <p className="font-bold">{isId ? 'Sesi Aktif & Perangkat' : 'Active Sessions & Devices'}</p>
                <p className="text-[var(--egvox-text-secondary)]">
                  {isId
                    ? 'Browser Desktop (Chrome · Jakarta, Indonesia) · Terakhir aktif sekarang'
                    : 'Desktop Browser (Chrome · Jakarta, Indonesia) · Active now'}
                </p>
              </div>
            </div>
          )}

          {/* ================= REPORTS (ENTERPRISE) ================= */}
          {activeTab === 'reports' && (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 space-y-4">
              <h1 className="text-xl font-bold">
                {isId ? 'Analitik Delivery & QA Enterprise' : 'Enterprise Delivery & QA Analytics'}
              </h1>
              <div className="grid gap-4 sm:grid-cols-3 text-xs tabular-nums">
                <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4">
                  <p className="text-[var(--egvox-text-muted)]">
                    {isId ? 'Total Jam Terkirim' : 'Total Hours Delivered'}
                  </p>
                  <p className="text-2xl font-bold mt-1 text-[#027F86]">
                    {isId ? '1.420 Jam' : '1,420 Hours'}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4">
                  <p className="text-[var(--egvox-text-muted)]">
                    {isId ? 'Tingkat Lolos QA Awal' : 'First-Pass QA Rate'}
                  </p>
                  <p className="text-2xl font-bold mt-1 text-[#16835D]">94,6%</p>
                </div>
                <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4">
                  <p className="text-[var(--egvox-text-muted)]">
                    {isId ? 'SLA Lead Time Rata-rata' : 'Average SLA Lead Time'}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {isId ? '4,8 Hari' : '4.8 Days'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= SAVED ITEMS ================= */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <h1 className="text-xl font-bold">
                {isId ? 'Item Tersimpan' : 'Saved Items'} ({totalSavedCount})
              </h1>
              <div className="grid gap-3 md:grid-cols-2">
                {savedProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/marketplace/projects/${p.slug}`}
                    className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 flex items-center gap-3"
                  >
                    <Heart className="h-4 w-4 text-[#C43D3D] shrink-0" />
                    <span className="text-sm font-bold">{isId ? p.title : p.titleEn}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ================= GOOGLE WORKSPACE PLUGINS ================= */}
          {activeTab === 'plugins' && <GoogleWorkspacePluginPanel />}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION (Persona-aware per Ref Image 2) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]/95 backdrop-blur grid grid-cols-5 py-1.5 text-[10px]">
        {(persona === 'freelancer'
          ? [
              { id: 'overview' as WorkspaceTab, label: isId ? 'Beranda' : 'Home', icon: Home },
              { id: 'browse' as WorkspaceTab, label: isId ? 'Proyek' : 'Projects', icon: FolderKanban },
              { id: 'offers' as WorkspaceTab, label: isId ? 'Penawaran' : 'Offers', icon: Tag },
              { id: 'tracking' as WorkspaceTab, label: isId ? 'Tugas' : 'Tasks', icon: Briefcase },
              { id: 'profile' as WorkspaceTab, label: isId ? 'Akun' : 'Account', icon: UserCheck },
            ]
          : persona === 'vendor'
          ? [
              { id: 'overview' as WorkspaceTab, label: isId ? 'Beranda' : 'Home', icon: Home },
              { id: 'browse' as WorkspaceTab, label: isId ? 'Proyek' : 'Projects', icon: FolderKanban },
              { id: 'offers' as WorkspaceTab, label: isId ? 'Rekrut' : 'Recruit', icon: Tag },
              { id: 'tracking' as WorkspaceTab, label: isId ? 'Order' : 'Orders', icon: Briefcase },
              { id: 'settings' as WorkspaceTab, label: isId ? 'Akun' : 'Account', icon: Settings },
            ]
          : [
              { id: 'overview' as WorkspaceTab, label: isId ? 'Beranda' : 'Home', icon: Home },
              { id: 'tracking' as WorkspaceTab, label: isId ? 'Proyek' : 'Projects', icon: ShieldCheck },
              { id: 'offers' as WorkspaceTab, label: isId ? 'Permintaan' : 'Requests', icon: FileText },
              { id: 'reports' as WorkspaceTab, label: isId ? 'Laporan' : 'Reports', icon: BarChart3 },
              { id: 'team' as WorkspaceTab, label: isId ? 'Akun' : 'Account', icon: Users },
            ]
        ).map((nav) => {
          const Icon = nav.icon;
          const active = activeTab === nav.id;
          return (
            <button
              key={nav.id + nav.label}
              type="button"
              onClick={() => setActiveTab(nav.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 font-semibold ${
                active ? 'text-[#027F86] dark:text-[#04B8B4]' : 'text-[var(--egvox-text-muted)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{nav.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ALL CUSTOMER WORKSPACE MODALS */}
      <CustomerModeSelectorModal
        open={modeSelectorOpen}
        mode={freelancerMode}
        onSelect={(m) => {
          setFreelancerMode(m);
          if (m === 'annotator') {
            setActiveTab('annotation');
          }
          showToast(
            isId
              ? `Mode Freelancer dialihkan ke ${
                  m === 'contributor'
                    ? 'Video Contributor'
                    : m === 'annotator'
                    ? 'Data Annotator'
                    : 'QA Specialist'
                }.`
              : `Freelancer mode switched to ${m}.`
          );
        }}
        onClose={() => setModeSelectorOpen(false)}
      />

      <PrivateUploadThreeStepModal
        open={privateUploadOpen}
        projectCode={selectedOrder?.code || 'WO-EGX-0256'}
        onClose={() => setPrivateUploadOpen(false)}
      />

      <TeamInviteModal
        open={teamInviteOpen}
        onClose={() => setTeamInviteOpen(false)}
      />

      <MilestoneFundingChangeModal
        order={milestoneModalOrder}
        onClose={() => setMilestoneModalOrder(null)}
      />

      <EnterpriseSampleInspectionModal
        pkg={inspectDeliveryPkg}
        onClose={() => setInspectDeliveryPkg(null)}
      />

      <CustomerModalsBundle
        contractOrder={contractOrder}
        setContractOrder={setContractOrder}
        reworkTarget={reworkTarget}
        setReworkTarget={setReworkTarget}
        counterTarget={counterTarget}
        setCounterTarget={setCounterTarget}
        payoutOpen={payoutOpen}
        setPayoutOpen={setPayoutOpen}
        payoutDest="BCA Virtual / Rekening •••• 8821"
        reviewOpen={reviewOpen}
        setReviewOpen={setReviewOpen}
        selectedOrderCode={selectedOrder?.code || 'WO-EGX-0256'}
        persona={persona}
        createProjectOpen={createProjectOpen}
        setCreateProjectOpen={setCreateProjectOpen}
        createServiceOpen={createServiceOpen}
        setCreateServiceOpen={setCreateServiceOpen}
        rfpOpen={rfpOpen}
        setRfpOpen={setRfpOpen}
        kycOpen={kycOpen}
        setKycOpen={setKycOpen}
        orgModalOpen={orgModalOpen}
        setOrgModalOpen={setOrgModalOpen}
        activeOrg={activeOrg}
        setActiveOrg={setActiveOrg}
      />
    </div>
  );
};
