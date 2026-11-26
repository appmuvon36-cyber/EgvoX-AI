'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Building2,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  FolderPlus,
  Heart,
  Lock,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  ShoppingBag,
  Star,
  UploadCloud,
  UserCheck,
  Wallet,
  X,
} from 'lucide-react';
import {
  DualPrice,
  egvoxFormatIDR,
  egvoxFormatUSD,
} from '@/packages/design-system';
import { FREELANCER_SERVICES, PROJECT_LISTINGS } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';
import {
  ActiveWorkOrder,
  ActivityCategorySlug,
  DataModality,
  FreelancerServiceListing,
  NegotiationOffer,
  SubmissionFileItem,
} from '@/packages/shared-types';
import { GoogleWorkspacePluginPanel } from './GoogleWorkspacePluginPanel';

type WorkspaceTab =
  | 'overview'
  | 'tracking'
  | 'offers'
  | 'proposals'
  | 'messages'
  | 'delivery'
  | 'profile'
  | 'saved'
  | 'plugins';

type Persona = 'freelancer' | 'vendor' | 'enterprise';

function resolveInitialTab(tab?: string): WorkspaceTab {
  switch (tab) {
    case 'tracking':
    case 'offers':
    case 'proposals':
    case 'messages':
    case 'delivery':
    case 'profile':
    case 'saved':
    case 'plugins':
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

export const WorkspaceShell: React.FC<{
  initialTab?: string;
  initialRole?: string;
}> = ({ initialTab, initialRole }) => {
  const {
    locale,
    proposals,
    workOrders,
    savedSlugs,
    inquiries,
    setCartDrawerOpen,
    notifications,
    setNotificationsModalOpen,
    conversations,
    sendMessage,
    submissionFiles,
    submitReworkOrDispute,
    offers,
    respondOffer,
    availableBalance,
    payoutHistory,
    requestPayout,
    reviews,
    submitOrderReview,
    customProjects,
    createVendorProject,
    customServices,
    createFreelancerService,
    kycStatus,
    submitKyc,
    submitEnterpriseInquiry,
    showToast,
  } = useAppState();

  const isId = locale === 'id';

  const [persona, setPersona] = useState<Persona>(() =>
    resolveInitialPersona(initialRole)
  );
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(() =>
    resolveInitialTab(initialTab)
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    workOrders[0]?.id || 'wo-1'
  );
  const [proposalFilter, setProposalFilter] = useState<
    'all' | 'pending' | 'accepted' | 'rejected'
  >('all');
  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || 'conv-1'
  );
  const [messageDraft, setMessageDraft] = useState('');
  const [activeOrg, setActiveOrg] = useState('PT Data Visual Indonesia');

  // Workspace Modal States
  const [contractOrder, setContractOrder] = useState<ActiveWorkOrder | null>(null);
  const [reworkTarget, setReworkTarget] = useState<SubmissionFileItem | null>(null);
  const [reworkMode, setReworkMode] = useState<'rework' | 'appeal'>('rework');
  const [reworkNote, setReworkNote] = useState('');

  const [counterTarget, setCounterTarget] = useState<NegotiationOffer | null>(null);
  const [counterRate, setCounterRate] = useState('175000');
  const [counterNote, setCounterNote] = useState('');

  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('1000000');
  const [payoutDest, setPayoutDest] = useState('BCA Virtual / Rekening •••• 8821');

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [newPrjTitle, setNewPrjTitle] = useState('');
  const [newPrjCat, setNewPrjCat] = useState<ActivityCategorySlug>('cooking');
  const [newPrjType, setNewPrjType] = useState<DataModality>('Video');
  const [newPrjHours, setNewPrjHours] = useState('50');
  const [newPrjRate, setNewPrjRate] = useState('175000');
  const [newPrjLocation, setNewPrjLocation] = useState('Indonesia');
  const [newPrjSummary, setNewPrjSummary] = useState('');

  const [createServiceOpen, setCreateServiceOpen] = useState(false);
  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvRole, setNewSrvRole] =
    useState<FreelancerServiceListing['roleType']>('Video Contributor');
  const [newSrvRate, setNewSrvRate] = useState('160000');
  const [newSrvLocation, setNewSrvLocation] = useState('Jakarta, Indonesia');
  const [newSrvDesc, setNewSrvDesc] = useState('');

  const [rfpOpen, setRfpOpen] = useState(false);
  const [rfpCompany, setRfpCompany] = useState('PT Contoh Teknologi');
  const [rfpEmail, setRfpEmail] = useState('procurement@company.com');
  const [rfpVolume, setRfpVolume] = useState('50 – 250 jam');
  const [rfpSummary, setRfpSummary] = useState('');

  const [kycOpen, setKycOpen] = useState(false);
  const [kycDocType, setKycDocType] = useState('KTP / National ID');
  const [orgModalOpen, setOrgModalOpen] = useState(false);

  const selectedOrder =
    workOrders.find((w) => w.id === selectedOrderId) || workOrders[0];

  const allProjects = [...customProjects, ...PROJECT_LISTINGS];
  const allServices = [...customServices, ...FREELANCER_SERVICES];
  const savedProjects = allProjects.filter((p) => savedSlugs.includes(p.slug));
  const savedServices = allServices.filter((s) => savedSlugs.includes(s.slug));
  const totalSavedCount = savedProjects.length + savedServices.length;

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unread, 0);

  const activeConv =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !messageDraft.trim()) return;
    sendMessage(activeConv.id, messageDraft);
    setMessageDraft('');
  };

  const handleSubmitRework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reworkTarget) return;
    submitReworkOrDispute(
      reworkTarget.id,
      reworkNote.trim() ||
        (isId ? 'Revisi kualitas & pencahayaan diunggah ulang.' : 'Lighting and focus rework uploaded.'),
      reworkMode
    );
    setReworkTarget(null);
    setReworkNote('');
  };

  const handleSubmitCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterTarget) return;
    respondOffer(
      counterTarget.id,
      'countered',
      Number(counterRate) || counterTarget.proposedRatePerHour,
      counterNote.trim() || counterTarget.note
    );
    setCounterTarget(null);
    setCounterNote('');
  };

  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(payoutAmount);
    if (!numeric || numeric <= 0 || numeric > availableBalance) {
      showToast(
        isId
          ? 'Nominal penarikan tidak valid atau melebihi saldo layak payout.'
          : 'Invalid withdrawal amount or exceeds available balance.'
      );
      return;
    }
    requestPayout(numeric, payoutDest);
    setPayoutOpen(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    submitOrderReview(
      persona === 'freelancer' ? 'PT Data Visual Indonesia' : 'Rizal Maulana',
      selectedOrder?.code || 'PRJ-202611-0045',
      reviewRating,
      reviewComment.trim() ||
        (isId
          ? 'Kolaborasi lancar, hasil video jernih dan sesuai spesifikasi.'
          : 'Smooth collaboration, clean footage matching specification.')
    );
    setReviewOpen(false);
    setReviewComment('');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrjTitle.trim() || !newPrjSummary.trim()) return;
    createVendorProject({
      title: newPrjTitle.trim(),
      category: newPrjCat,
      dataType: newPrjType,
      targetVolume: Math.max(10, Number(newPrjHours) || 50),
      ratePerUnit: Math.max(50000, Number(newPrjRate) || 175000),
      location: newPrjLocation.trim() || 'Indonesia',
      summary: newPrjSummary.trim(),
    });
    setCreateProjectOpen(false);
    setNewPrjTitle('');
    setNewPrjSummary('');
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvTitle.trim() || !newSrvDesc.trim()) return;
    createFreelancerService({
      title: newSrvTitle.trim(),
      roleType: newSrvRole,
      pricePerUnit: Math.max(50000, Number(newSrvRate) || 160000),
      location: newSrvLocation.trim() || 'Indonesia',
      description: newSrvDesc.trim(),
    });
    setCreateServiceOpen(false);
    setNewSrvTitle('');
    setNewSrvDesc('');
  };

  const handleSubmitRfp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfpCompany.trim() || !rfpSummary.trim()) return;
    submitEnterpriseInquiry({
      companyName: rfpCompany.trim(),
      country: 'Indonesia',
      businessEmail: rfpEmail.trim(),
      contactPerson: activeOrg,
      estimatedVolume: rfpVolume,
      requirementSummary: rfpSummary.trim(),
    });
    setRfpOpen(false);
    setRfpSummary('');
  };

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    submitKyc(kycDocType);
    setKycOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Workspace Banner with Role Switcher (Freelancer / Vendor / Enterprise) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#027F86] dark:text-[#04B8B4]">
              {isId ? 'EgvoX · Workspace Pelanggan' : 'EgvoX · Customer Workspace'}
            </span>
            {persona !== 'freelancer' && (
              <button
                type="button"
                onClick={() => setOrgModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-2 py-0.5 text-[11px] font-medium text-[var(--egvox-text-secondary)] hover:border-[#027F86]"
              >
                <Building2 className="h-3 w-3 text-[#027F86]" />
                <span>{activeOrg}</span>
              </button>
            )}
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl font-bold text-[var(--egvox-text-primary)]">
            {persona === 'freelancer'
              ? isId
                ? 'Workspace Freelancer (Contributor & Annotator)'
                : 'Freelancer Workspace (Contributor & Annotator)'
              : persona === 'vendor'
              ? isId
                ? 'Workspace Dataset Vendor / Provider'
                : 'Dataset Vendor / Provider Workspace'
              : isId
              ? 'Workspace Enterprise Managed Operations'
              : 'Enterprise Managed Operations Workspace'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex max-w-full overflow-x-auto rounded-xl bg-[var(--egvox-bg-subtle)] p-1">
            {(
              [
                { id: 'freelancer', label: 'Freelancer' },
                { id: 'vendor', label: 'Vendor' },
                { id: 'enterprise', label: 'Enterprise' },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setPersona(r.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  persona === r.id
                    ? 'bg-[var(--egvox-bg-surface)] text-[#027F86] dark:text-[#04B8B4] shadow-xs'
                    : 'text-[var(--egvox-text-secondary)]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {persona === 'freelancer' && (
            <>
              <button
                type="button"
                onClick={() => setPayoutOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#027F86]/40 bg-[#027F86]/10 px-3.5 py-2 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:bg-[#027F86]/20"
              >
                <Wallet className="h-3.5 w-3.5" />
                <span>{isId ? 'Tarik Dana' : 'Withdraw Funds'}</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateServiceOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--egvox-border-default)] px-3.5 py-2 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
              >
                <Plus className="h-3.5 w-3.5 text-[#027F86]" />
                <span>{isId ? 'Buat Listing Jasa' : 'Create Service'}</span>
              </button>
            </>
          )}

          {persona === 'vendor' && (
            <button
              type="button"
              onClick={() => setCreateProjectOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FC840E] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#e57609]"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>{isId ? 'Buat Project Baru' : 'Create New Project'}</span>
            </button>
          )}

          {persona === 'enterprise' && (
            <button
              type="button"
              onClick={() => setRfpOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FC840E] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#e57609]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isId ? 'Buat Permintaan RFP' : 'New RFP Request'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setNotificationsModalOpen(true)}
            className="relative inline-flex items-center justify-center rounded-xl border border-[var(--egvox-border-default)] p-2 text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]"
            aria-label={isId ? 'Notifikasi Workspace' : 'Workspace Notifications'}
          >
            <Bell className="h-4 w-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FC840E] text-[10px] font-bold text-white">
                {unreadNotifCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white hover:bg-[#039998]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{isId ? 'Keranjang Order' : 'Order Cart'}</span>
          </button>
        </div>
      </div>

      {/* Workspace Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: 'overview', label: isId ? 'Ringkasan' : 'Overview' },
            {
              id: 'tracking',
              label: isId ? 'Pelacakan Produksi & QA' : 'Production & QA Tracking',
            },
            {
              id: 'offers',
              label: isId
                ? `Negosiasi (${offers.length})`
                : `Offers & Counter (${offers.length})`,
            },
            {
              id: 'proposals',
              label: isId
                ? `Proposal Saya (${proposals.length})`
                : `Proposals (${proposals.length})`,
            },
            {
              id: 'messages',
              label: isId
                ? `Pesan${unreadMessagesCount > 0 ? ` (${unreadMessagesCount})` : ''}`
                : `Messages${unreadMessagesCount > 0 ? ` (${unreadMessagesCount})` : ''}`,
            },
            {
              id: 'delivery',
              label: isId ? 'Delivery & Ulasan' : 'Delivery & Reviews',
            },
            {
              id: 'profile',
              label: isId ? 'Profil, KYC & Organisasi' : 'Profile, KYC & Org',
            },
            {
              id: 'saved',
              label: isId
                ? `Tersimpan (${totalSavedCount})`
                : `Saved (${totalSavedCount})`,
            },
            {
              id: 'plugins',
              label: isId ? 'Plugin Google Workspace' : 'Google Workspace Plugins',
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === tab.id
                ? 'bg-[#027F86] text-white'
                : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-[#027F86] p-5 text-white">
              <p className="text-xs text-white/80">
                {persona === 'freelancer'
                  ? isId
                    ? 'Saldo Layak Payout'
                    : 'Available Payout Balance'
                  : persona === 'vendor'
                  ? isId
                    ? 'Project Aktif'
                    : 'Active Projects'
                  : isId
                  ? 'Official Project Aktif'
                  : 'Active Official Projects'}
              </p>
              <div className="mt-1">
                {persona === 'freelancer' ? (
                  <div>
                    <p className="text-2xl font-bold tabular-nums">
                      {egvoxFormatIDR(availableBalance)}
                    </p>
                    <p className="text-xs font-semibold text-white/90 tabular-nums mt-0.5">
                      &asymp; {egvoxFormatUSD(availableBalance)} USD (1 USD = Rp 16.000)
                    </p>
                  </div>
                ) : persona === 'vendor' ? (
                  <p className="text-2xl font-bold tabular-nums">
                    {4 + customProjects.length} {isId ? 'Proyek' : 'Projects'}
                  </p>
                ) : (
                  <p className="text-2xl font-bold tabular-nums">
                    {2 + inquiries.length} {isId ? 'Proyek' : 'Projects'}
                  </p>
                )}
              </div>
              <p className="mt-2 text-[11px] text-white/80">
                {isId
                  ? 'Berdasarkan jam video yang lolos QA Acceptance Criteria'
                  : 'Based on video hours passing QA Acceptance Criteria'}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {isId ? 'Work Order Aktif' : 'Active Work Orders'}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{workOrders.length}</p>
              <p className="mt-2 text-xs text-[#16835D]">
                {isId ? 'Semua memiliki versi spec terkunci' : 'All carry immutable spec versions'}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {isId ? 'Proposal & Negosiasi' : 'Proposals & Offers'}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {proposals.length + offers.length}
              </p>
              <p className="mt-2 text-xs text-[var(--egvox-text-secondary)]">
                {isId ? 'Pantau status review & counter-offer' : 'Track review status & counter-offers'}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {isId ? 'Permintaan Enterprise (RFP)' : 'Enterprise Inquiries (RFP)'}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{inquiries.length}</p>
              <p className="mt-2 text-xs text-[var(--egvox-text-secondary)]">
                {isId ? 'Pipeline kemitraan & kontrak' : 'Partnership & contract pipeline'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold">
                {isId ? 'Work Order & Tugas Terbaru' : 'Recent Work Orders & Assignments'}
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('tracking')}
                className="text-xs font-semibold text-[#027F86] hover:underline"
              >
                {isId ? 'Lihat Detail Produksi →' : 'View Production Details →'}
              </button>
            </div>
            <div className="divide-y divide-[var(--egvox-border-default)]">
              {workOrders.map((wo) => (
                <div
                  key={wo.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-[#027F86]">
                      {wo.code} · {wo.specVersion}
                    </p>
                    <p className="text-sm font-bold text-[var(--egvox-text-primary)]">
                      {isId ? wo.title : wo.titleEn || wo.title}
                    </p>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {wo.counterparty} · {isId ? 'Batas Waktu' : 'Deadline'}{' '}
                      {isId ? wo.deadline : wo.deadlineEn || wo.deadline}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold tabular-nums">
                        {wo.acceptedUnits}/{wo.totalUnits}{' '}
                        {isId ? wo.unitLabel : wo.unitLabelEn || 'hour'} ({wo.progressPercent}%)
                      </p>
                      <p className="text-xs text-[#FC840E] font-semibold tabular-nums">
                        {egvoxFormatIDR(wo.amount)}{' '}
                        <span className="text-[#027F86] dark:text-[#04B8B4]">
                          ({egvoxFormatUSD(wo.amount)} USD)
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContractOrder(wo)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#027F86]" />
                      <span>{isId ? 'Detail Kontrak' : 'Contract Spec'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrderId(wo.id);
                        setActiveTab('tracking');
                      }}
                      className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
                    >
                      {isId ? 'Lacak' : 'Track'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRACKING & FILE-LEVEL QA REWORK / APPEAL */}
      {activeTab === 'tracking' && selectedOrder && (
        <div className="space-y-6">
          {/* Work Order Selector Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {workOrders.map((wo) => (
              <button
                key={wo.id}
                type="button"
                onClick={() => setSelectedOrderId(wo.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                  selectedOrder.id === wo.id
                    ? 'bg-[#027F86] text-white'
                    : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-secondary)]'
                }`}
              >
                {wo.code} · {wo.progressPercent}%
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-mono text-[#027F86]">{selectedOrder.code}</p>
                  <h2 className="mt-1 text-lg font-bold">
                    {isId ? selectedOrder.title : selectedOrder.titleEn || selectedOrder.title}
                  </h2>
                  <p className="text-xs text-[var(--egvox-text-muted)]">
                    {isId ? 'Spesifikasi Terkunci' : 'Locked Spec'}: {selectedOrder.specVersion}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setContractOrder(selectedOrder)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
                >
                  <FileText className="h-3.5 w-3.5 text-[#027F86]" />
                  <span>{isId ? 'Lihat Kontrak' : 'View Contract'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: 'order_confirmed',
                    label: isId
                      ? 'Order Diterima & Capture Spec Disetujui'
                      : 'Order Confirmed & Capture Spec Agreed',
                    done: true,
                  },
                  {
                    key: 'in_production',
                    label: isId
                      ? `Produksi Data & Private Raw Upload (${selectedOrder.progressPercent}%)`
                      : `Data Production & Private Raw Upload (${selectedOrder.progressPercent}%)`,
                    done: selectedOrder.progressPercent >= 50,
                  },
                  {
                    key: 'qa_review',
                    label: isId
                      ? 'Verifikasi Quality Assurance & Gerbang Hak Data'
                      : 'Quality Assurance & Rights Gate Verification',
                    done:
                      selectedOrder.stage === 'qa_review' ||
                      selectedOrder.stage === 'delivered',
                  },
                  {
                    key: 'delivered',
                    label: isId
                      ? 'Dataset Packaging & Delivery Selesai'
                      : 'Dataset Packaging & Final Delivery',
                    done: selectedOrder.stage === 'delivered',
                  },
                ].map((step) => (
                  <div key={step.key} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        step.done
                          ? 'bg-[#16835D] text-white'
                          : 'border border-[var(--egvox-border-default)] text-[var(--egvox-text-muted)]'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="h-4 w-4" /> : '•'}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--egvox-text-primary)]">
                        {step.label}
                      </p>
                      <p className="text-xs text-[var(--egvox-text-muted)]">
                        {step.done
                          ? isId
                            ? 'Terverifikasi oleh sistem QA'
                            : 'Verified by QA pipeline'
                          : isId
                          ? 'Menunggu penyelesaian batch'
                          : 'Awaiting batch completion'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <UploadCloud className="h-5 w-5 text-[#027F86]" />
                <span>
                  {isId
                    ? 'Sesi Upload Video Mentah Privat'
                    : 'Private Raw Video Upload Session'}
                </span>
              </div>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Unggah video langsung ke zona karantina privat. Sistem menghitung checksum SHA-256 otomatis dan mencegah akses publik.'
                  : 'Upload footage directly to private quarantine. Checksum SHA-256 is verified automatically with zero public exposure.'}
              </p>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#027F86]/40 bg-[var(--egvox-bg-canvas)] p-6 text-center text-xs">
                <Lock className="h-5 w-5 text-[#027F86]" />
                <span className="font-semibold">
                  {isId
                    ? 'Pilih Video MP4 untuk Upload Privat'
                    : 'Select MP4 Video for Private Upload'}
                </span>
                <span className="text-[var(--egvox-text-muted)]">
                  {isId
                    ? 'Maks 4GB per file · Resumable Session'
                    : 'Max 4GB per file · Resumable Session'}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      showToast(
                        isId
                          ? `Sesi upload dibuat untuk ${file.name} (status: quarantine -> technical_validation).`
                          : `Upload session created for ${file.name} (status: quarantine -> technical_validation).`
                      );
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* File-level Submission & QA Verdict Table */}
          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold">
                {isId
                  ? 'Status QA per File & Banding / Rework'
                  : 'File-Level QA Verdicts & Rework / Appeal'}
              </h3>
              <span className="text-xs text-[var(--egvox-text-muted)]">
                {isId ? 'Pipeline Karantina SHA-256' : 'SHA-256 Quarantine Pipeline'}
              </span>
            </div>
            <div className="divide-y divide-[var(--egvox-border-default)]">
              {submissionFiles.map((sf) => (
                <div
                  key={sf.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold break-all">{sf.fileName}</span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                          sf.status === 'accepted'
                            ? 'bg-[#16835D]/15 text-[#16835D]'
                            : sf.status === 'rework_required'
                            ? 'bg-[#E11D48]/15 text-[#E11D48]'
                            : 'bg-[#FC840E]/15 text-[#FC840E]'
                        }`}
                      >
                        {sf.status === 'accepted'
                          ? isId
                            ? 'Diterima'
                            : 'Accepted'
                          : sf.status === 'rework_required'
                          ? isId
                            ? 'Perlu Revisi'
                            : 'Rework Required'
                          : sf.status === 'technical_review'
                          ? isId
                            ? 'Review Teknis'
                            : 'Technical Review'
                          : sf.status === 'quarantine'
                          ? isId
                            ? 'Karantina'
                            : 'Quarantine'
                          : sf.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {isId ? sf.durationLabel : sf.durationLabelEn || sf.durationLabel} · {sf.sizeLabel} · SHA-256: {sf.checksumSha256.slice(0, 12)}...
                    </p>
                    {(sf.qaReasonId || sf.qaReasonEn) && (
                      <p className="inline-flex items-center gap-1 text-xs font-medium text-[#E11D48]">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        {isId ? sf.qaReasonId : sf.qaReasonEn}
                      </p>
                    )}
                  </div>

                  {sf.status !== 'accepted' && (
                    <button
                      type="button"
                      onClick={() => {
                        setReworkTarget(sf);
                        setReworkMode('rework');
                      }}
                      className="shrink-0 self-start sm:self-center rounded-xl border border-[#027F86]/40 px-3.5 py-2 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:bg-[#027F86]/10"
                    >
                      {isId ? 'Rework / Banding QA' : 'Rework / QA Appeal'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OFFERS & COUNTER-OFFER NEGOTIATION */}
      {activeTab === 'offers' && (
        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] divide-y divide-[var(--egvox-border-default)]">
          {offers.map((off) => (
            <div
              key={off.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold">
                    {isId ? off.projectTitle : off.projectTitleEn || off.projectTitle}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      off.status === 'accepted'
                        ? 'bg-[#16835D]/15 text-[#16835D]'
                        : off.status === 'rejected'
                        ? 'bg-[#E11D48]/15 text-[#E11D48]'
                        : 'bg-[#FC840E]/15 text-[#FC840E]'
                    }`}
                  >
                    {off.status === 'accepted'
                      ? isId
                        ? 'Diterima'
                        : 'Accepted'
                      : off.status === 'rejected'
                      ? isId
                        ? 'Ditolak'
                        : 'Rejected'
                      : off.status === 'countered'
                      ? 'Counter-Offer'
                      : isId
                      ? 'Terkirim'
                      : 'Sent'}
                  </span>
                </div>
                <p className="text-xs text-[var(--egvox-text-muted)]">
                  {off.counterparty} · {off.proposedVolumeHours}{' '}
                  {isId ? 'jam' : 'hours'} ·{' '}
                  {isId ? off.updatedAt : off.updatedAtEn || off.updatedAt}
                </p>
                <p className="text-xs text-[var(--egvox-text-secondary)]">
                  {isId ? off.note : off.noteEn || off.note}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <DualPrice
                  amountIDR={off.proposedRatePerHour}
                  unitLabel={isId ? 'jam' : 'hour'}
                  size="sm"
                  layout="inline"
                />
                {off.status !== 'accepted' && off.status !== 'rejected' && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => respondOffer(off.id, 'accepted')}
                      className="rounded-lg bg-[#16835D] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                    >
                      {isId ? 'Terima' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCounterTarget(off);
                        setCounterRate(String(off.proposedRatePerHour));
                      }}
                      className="rounded-lg border border-[#027F86] px-3 py-1.5 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4]"
                    >
                      {isId ? 'Counter-Offer' : 'Counter-Offer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => respondOffer(off.id, 'rejected')}
                      className="rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold text-[#E11D48]"
                    >
                      {isId ? 'Tolak' : 'Decline'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: PROPOSALS */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: isId ? 'Semua' : 'All' },
                { id: 'pending', label: isId ? 'Menunggu Review' : 'Pending Review' },
                { id: 'accepted', label: isId ? 'Diterima' : 'Accepted' },
                { id: 'rejected', label: isId ? 'Ditolak' : 'Rejected' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setProposalFilter(f.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold ${
                  proposalFilter === f.id
                    ? 'bg-[#027F86] text-white'
                    : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-secondary)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] divide-y divide-[var(--egvox-border-default)]">
            {filteredProposals.length === 0 ? (
              <p className="p-8 text-center text-xs text-[var(--egvox-text-muted)]">
                {isId
                  ? 'Belum ada proposal pada filter status ini.'
                  : 'No proposals match this status filter.'}
              </p>
            ) : (
              filteredProposals.map((prop) => (
                <div
                  key={prop.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5"
                >
                  <div>
                    <p className="text-sm font-bold text-[var(--egvox-text-primary)]">
                      {isId ? prop.projectTitle : prop.projectTitleEn || prop.projectTitle}
                    </p>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {prop.vendorName} · {prop.volume} {isId ? 'jam' : 'hours'} ·{' '}
                      {isId ? 'Dikirim' : 'Submitted'}{' '}
                      {isId ? prop.createdAt : prop.createdAtEn || prop.createdAt}
                    </p>
                    <p className="mt-1 text-xs text-[var(--egvox-text-secondary)]">
                      {isId ? prop.note : prop.noteEn || prop.note}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <p className="text-sm font-bold text-[#FC840E] tabular-nums">
                      {egvoxFormatIDR(prop.estimatedTotal)}{' '}
                      <span className="text-xs text-[#027F86] dark:text-[#04B8B4]">
                        ({egvoxFormatUSD(prop.estimatedTotal)} USD)
                      </span>
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#027F86]">
                      Status:{' '}
                      {prop.status === 'accepted'
                        ? isId
                          ? 'Diterima'
                          : 'Accepted'
                        : prop.status === 'rejected'
                        ? isId
                          ? 'Ditolak'
                          : 'Rejected'
                        : prop.status === 'countered'
                        ? 'Counter-Offer'
                        : prop.status === 'under_review'
                        ? isId
                          ? 'Ditinjau'
                          : 'Under Review'
                        : isId
                        ? 'Terkirim'
                        : 'Submitted'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SECURE MESSAGING CENTER */}
      {activeTab === 'messages' && (
        <div className="grid gap-4 lg:grid-cols-12 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-hidden">
          <div className="min-w-0 lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[var(--egvox-border-default)] divide-y divide-[var(--egvox-border-default)]">
            <div className="p-4 font-bold text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#027F86]" />
              <span>{isId ? 'Kotak Masuk Workspace' : 'Workspace Inbox'}</span>
            </div>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full text-left p-4 transition-colors ${
                  activeConv?.id === conv.id
                    ? 'bg-[#027F86]/10'
                    : 'hover:bg-[var(--egvox-bg-subtle)]'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold">{conv.partnerName}</span>
                  {conv.unread > 0 && (
                    <span className="rounded-full bg-[#FC840E] px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {conv.unread}
                    </span>
                  )}
                </span>
                <span className="block text-[11px] text-[#027F86] mt-0.5">
                  {isId ? conv.partnerRoleLabelId : conv.partnerRoleLabelEn}
                </span>
                <span className="block text-[11px] text-[var(--egvox-text-muted)] truncate mt-1">
                  {conv.contextTitle}
                </span>
              </button>
            ))}
          </div>

          <div className="min-w-0 lg:col-span-8 flex flex-col min-h-[380px]">
            {activeConv && (
              <>
                <div className="border-b border-[var(--egvox-border-default)] px-4 sm:px-5 py-3.5">
                  <p className="text-sm font-bold">{activeConv.partnerName}</p>
                  <p className="text-xs text-[var(--egvox-text-muted)]">
                    {activeConv.contextTitle}
                  </p>
                </div>
                <div className="flex-1 space-y-3 p-4 sm:p-5 overflow-y-auto max-h-80">
                  {activeConv.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                        m.isOwn
                          ? 'ml-auto bg-[#027F86] text-white'
                          : 'bg-[var(--egvox-bg-canvas)] border border-[var(--egvox-border-default)]'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-semibold mb-1 ${
                          m.isOwn ? 'text-white/80' : 'text-[var(--egvox-text-muted)]'
                        }`}
                      >
                        {isId ? m.sender : m.senderEn || m.sender} ·{' '}
                        {isId ? m.timestamp : m.timestampEn || m.timestamp}
                      </span>
                      <span className="leading-relaxed">
                        {isId ? m.text : m.textEn || m.text}
                      </span>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 border-t border-[var(--egvox-border-default)] p-3.5"
                >
                  <input
                    type="text"
                    value={messageDraft}
                    onChange={(e) => setMessageDraft(e.target.value)}
                    placeholder={
                      isId
                        ? 'Tulis pesan terkait spesifikasi atau revisi Work Order...'
                        : 'Write a message regarding Work Order spec or delivery...'
                    }
                    className="min-w-0 flex-1 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#027F86] px-4 py-2 text-xs font-semibold text-white hover:bg-[#039998]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isId ? 'Kirim' : 'Send'}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: DELIVERY DATASET, PAYOUT HISTORY & 5-STAR REVIEWS */}
      {activeTab === 'delivery' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16835D]">
                  <CheckCircle2 className="h-4 w-4" />
                  {isId ? 'Selesai & Terverifikasi QA' : 'Completed & QA Verified'}
                </span>
                <h2 className="mt-1 text-lg font-bold">
                  {isId
                    ? 'Dataset Memasak (Egocentric Cooking) — Paket Final'
                    : 'Egocentric Cooking Dataset — Final Delivery Package'}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setReviewOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#FC840E] px-4 py-2.5 text-xs font-semibold text-[#FC840E] hover:bg-[#FC840E]/10"
                >
                  <Star className="h-4 w-4" />
                  <span>{isId ? 'Berikan Ulasan' : 'Leave Review'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      isId
                        ? 'Signed download link (bermasa aktif singkat) dibuat untuk paket dataset.'
                        : 'Short-lived signed download link generated for dataset package.'
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#027F86] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#039998]"
                >
                  <Download className="h-4 w-4" />
                  <span>{isId ? 'Unduh Dataset' : 'Download Dataset'}</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm">
              <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5">
                <p className="text-xs text-[var(--egvox-text-muted)]">
                  {isId ? 'Total Volume' : 'Total Volume'}
                </p>
                <p className="mt-1 font-bold tabular-nums">
                  {isId ? '50 Jam Video' : '50 Video Hours'}
                </p>
              </div>
              <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5">
                <p className="text-xs text-[var(--egvox-text-muted)]">
                  {isId ? 'Ukuran Paket' : 'Package Size'}
                </p>
                <p className="mt-1 font-bold tabular-nums">120 GB</p>
              </div>
              <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5">
                <p className="text-xs text-[var(--egvox-text-muted)]">Format</p>
                <p className="mt-1 font-bold">MP4 + JSONL</p>
              </div>
              <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5">
                <p className="text-xs text-[var(--egvox-text-muted)]">
                  {isId ? 'Manifest Hak Data' : 'Data Rights Manifest'}
                </p>
                <p className="mt-1 font-bold text-[#16835D] inline-flex items-center gap-1">
                  <FileCheck2 className="h-4 w-4" /> Valid
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Payout History */}
            <div className="min-w-0 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold">
                  {isId ? 'Riwayat Penarikan Dana (Payout)' : 'Payout Settlement History'}
                </h3>
                <button
                  type="button"
                  onClick={() => setPayoutOpen(true)}
                  className="text-xs font-semibold text-[#027F86] hover:underline"
                >
                  {isId ? 'Tarik Dana Baru' : 'New Withdrawal'}
                </button>
              </div>
              <div className="divide-y divide-[var(--egvox-border-default)]">
                {payoutHistory.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs">
                    <div>
                      <p className="font-bold">
                        {isId ? p.destination : p.destinationEn || p.destination}
                      </p>
                      <p className="text-[var(--egvox-text-muted)]">
                        {isId ? p.createdAt : p.createdAtEn || p.createdAt}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-bold tabular-nums text-[#FC840E]">
                        {egvoxFormatIDR(p.amount)}{' '}
                        <span className="text-[#027F86] dark:text-[#04B8B4]">
                          ({egvoxFormatUSD(p.amount)} USD)
                        </span>
                      </p>
                      <p className="text-[#16835D] font-semibold">
                        {p.status === 'settled'
                          ? isId
                            ? 'Lunas / Cair'
                            : 'Settled'
                          : isId
                          ? 'Menunggu Review'
                          : 'Pending Review'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Order Reviews */}
            <div className="min-w-0 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold">
                  {isId ? 'Ulasan & Rating Selesai' : 'Completed Order Reviews'}
                </h3>
                <button
                  type="button"
                  onClick={() => setReviewOpen(true)}
                  className="text-xs font-semibold text-[#027F86] hover:underline"
                >
                  {isId ? '+ Tulis Ulasan' : '+ Write Review'}
                </button>
              </div>
              <div className="divide-y divide-[var(--egvox-border-default)]">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{rev.targetName}</span>
                      <span className="inline-flex items-center gap-0.5 text-[#F59E0B] font-bold">
                        <Star className="h-3.5 w-3.5 fill-current" /> {rev.rating}.0
                      </span>
                    </div>
                    <p className="text-[var(--egvox-text-muted)]">
                      {rev.workOrderCode} · {isId ? rev.createdAt : rev.createdAtEn || rev.createdAt}
                    </p>
                    <p className="text-[var(--egvox-text-secondary)]">
                      {isId ? rev.comment : rev.commentEn || rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PROFILE, KYC & ORGANIZATION SWITCHER */}
      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#027F86]" />
                <h2 className="text-base font-bold">
                  {isId ? 'Verifikasi Identitas (KYC)' : 'Identity Verification (KYC)'}
                </h2>
              </div>
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  kycStatus === 'verified'
                    ? 'bg-[#16835D]/15 text-[#16835D]'
                    : 'bg-[#FC840E]/15 text-[#FC840E]'
                }`}
              >
                {kycStatus === 'verified'
                  ? isId
                    ? 'Terverifikasi'
                    : 'Verified'
                  : isId
                  ? 'Dalam Peninjauan'
                  : 'Pending Review'}
              </span>
            </div>
            <p className="text-xs text-[var(--egvox-text-secondary)] leading-relaxed">
              {isId
                ? 'Verifikasi identitas wajib sebelum pencairan payout dan akses proyek dengan kepatuhan khusus.'
                : 'Identity verification is required prior to payout withdrawals and policy-gated projects.'}
            </p>
            <button
              type="button"
              onClick={() => setKycOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#027F86] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#039998]"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>
                {isId ? 'Verifikasi / Unggah Ulang KYC' : 'Verify / Upload KYC Document'}
              </span>
            </button>
          </div>

          <div className="min-w-0 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#027F86]" />
              <h2 className="text-base font-bold">
                {isId
                  ? 'Organisasi Aktif & Akun Payout'
                  : 'Active Organization & Payout Account'}
              </h2>
            </div>
            <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-1">
              <p className="text-[var(--egvox-text-muted)]">
                {isId ? 'Organisasi Terpilih' : 'Selected Organization'}
              </p>
              <p className="text-sm font-bold">{activeOrg}</p>
              <p className="text-[var(--egvox-text-secondary)] pt-1">
                {isId ? 'Rekening Payout Utama' : 'Primary Payout Account'}: {payoutDest}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOrgModalOpen(true)}
              className="rounded-xl border border-[var(--egvox-border-default)] px-4 py-2.5 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
            >
              {isId ? 'Ganti Organisasi' : 'Switch Organization'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: SAVED ITEMS */}
      {activeTab === 'saved' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {totalSavedCount === 0 ? (
            <div className="sm:col-span-2 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-8 text-center">
              <Heart className="mx-auto h-6 w-6 text-[var(--egvox-text-muted)]" />
              <p className="mt-2 text-sm">
                {isId ? 'Belum ada listing tersimpan.' : 'No saved listings yet.'}
              </p>
            </div>
          ) : (
            <>
              {savedProjects.map((prj) => (
                <Link
                  key={prj.id}
                  href={`/marketplace/projects/${prj.slug}`}
                  className="flex gap-3 sm:gap-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 hover:border-[#027F86]"
                >
                  <img
                    src={prj.previewImage}
                    alt={isId ? prj.title : prj.titleEn}
                    referrerPolicy="no-referrer"
                    className="h-16 w-24 sm:h-20 sm:w-28 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      {isId ? prj.title : prj.titleEn}
                    </p>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {prj.vendorName}
                    </p>
                    <div className="mt-2">
                      <DualPrice
                        amountIDR={prj.ratePerUnit}
                        unitLabel={isId ? 'jam' : 'hour'}
                        size="sm"
                        layout="inline"
                      />
                    </div>
                  </div>
                </Link>
              ))}
              {savedServices.map((srv) => (
                <Link
                  key={srv.id}
                  href={`/marketplace/services/${srv.slug}`}
                  className="flex gap-3 sm:gap-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 hover:border-[#027F86]"
                >
                  <img
                    src={srv.avatar}
                    alt={srv.freelancerName}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      {isId ? srv.title : srv.titleEn}
                    </p>
                    <p className="text-xs text-[var(--egvox-text-muted)]">
                      {srv.freelancerName} · {srv.roleType}
                    </p>
                    <div className="mt-2">
                      <DualPrice
                        amountIDR={srv.pricePerUnit}
                        unitLabel={isId ? 'jam' : 'hour'}
                        size="sm"
                        layout="inline"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      )}

      {/* TAB 9: GOOGLE WORKSPACE PLUGINS */}
      {activeTab === 'plugins' && <GoogleWorkspacePluginPanel />}

      {/* ================= WORKSPACE MODAL CARDS ================= */}

      {/* 1. Work Order Contract Spec Modal */}
      {contractOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-mono text-[#027F86]">
                  {contractOrder.code} · {contractOrder.specVersion}
                </p>
                <h3 className="text-base font-bold mt-0.5">
                  {isId ? 'Spesifikasi Kontrak Work Order' : 'Work Order Contract Specification'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setContractOrder(null)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2.5">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Judul Tugas' : 'Assignment'}
                </span>
                <span className="font-semibold sm:text-right sm:max-w-[60%]">
                  {isId ? contractOrder.title : contractOrder.titleEn || contractOrder.title}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Pihak Terkait' : 'Counterparty'}
                </span>
                <span className="font-semibold">{contractOrder.counterparty}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Target Volume' : 'Committed Volume'}
                </span>
                <span className="font-semibold">
                  {contractOrder.totalUnits} {isId ? 'jam' : 'hours'}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Nilai Work Order' : 'Order Value'}
                </span>
                <span className="font-bold text-[#FC840E] tabular-nums">
                  {egvoxFormatIDR(contractOrder.amount)} ({egvoxFormatUSD(contractOrder.amount)} USD)
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {isId ? 'Gerbang Hak Data' : 'Rights Gate'}
                </span>
                <span className="font-semibold text-[#16835D]">
                  {isId ? 'SHA-256 & Consent Terkunci' : 'SHA-256 & Consent Locked'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setContractOrder(null)}
              className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
            >
              {isId ? 'Tutup Ringkasan Kontrak' : 'Close Contract Summary'}
            </button>
          </div>
        </div>
      )}

      {/* 2. Rework / Banding QA Modal */}
      {reworkTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-bold">
                  {isId ? 'Tindak Lanjut File QA' : 'QA File Action & Rework'}
                </h3>
                <p className="text-xs font-mono text-[#027F86] mt-0.5 break-all">
                  {reworkTarget.fileName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReworkTarget(null)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitRework} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReworkMode('rework')}
                  className={`rounded-xl py-2 text-xs font-semibold ${
                    reworkMode === 'rework'
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)]'
                  }`}
                >
                  {isId ? 'Unggah Rework' : 'Upload Rework'}
                </button>
                <button
                  type="button"
                  onClick={() => setReworkMode('appeal')}
                  className={`rounded-xl py-2 text-xs font-semibold ${
                    reworkMode === 'appeal'
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)]'
                  }`}
                >
                  {isId ? 'Ajukan Banding QA' : 'Submit QA Appeal'}
                </button>
              </div>
              <textarea
                rows={3}
                value={reworkNote}
                onChange={(e) => setReworkNote(e.target.value)}
                placeholder={
                  isId
                    ? 'Jelaskan perbaikan video atau alasan banding ke tim QA...'
                    : 'Describe your video rework or QA dispute rationale...'
                }
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {reworkMode === 'rework'
                  ? isId
                    ? 'Kirim Rework ke Karantina'
                    : 'Submit Rework to Quarantine'
                  : isId
                  ? 'Kirim Banding QA'
                  : 'Submit QA Appeal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Counter-Offer Modal */}
      {counterTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Kirim Counter-Offer' : 'Send Rate Counter-Offer'}
              </h3>
              <button
                type="button"
                onClick={() => setCounterTarget(null)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitCounter} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {isId ? 'Usulan Tarif per Jam (IDR)' : 'Proposed Hourly Rate (IDR)'}
                </label>
                <input
                  type="number"
                  value={counterRate}
                  onChange={(e) => setCounterRate(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-bold tabular-nums"
                />
                <p className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5 rounded-lg bg-[#027F86]/8 px-3 py-1.5 text-[11px] font-semibold text-[#027F86] dark:text-[#04B8B4] tabular-nums">
                  <span>
                    {isId ? 'Otomatis di Katalog (USD):' : 'Auto-converted Catalog Price (USD):'}
                  </span>
                  <span>
                    {egvoxFormatUSD(Number(counterRate) || 0)} USD / {isId ? 'jam' : 'hour'}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {isId ? 'Catatan Penyesuaian' : 'Negotiation Note'}
                </label>
                <textarea
                  rows={3}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  placeholder={isId ? 'Alasan perubahan tarif per jam...' : 'Rationale for hourly rate adjustment...'}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Kirim Counter-Offer' : 'Submit Counter-Offer'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Payout Withdrawal Modal */}
      {payoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Tarik Dana Layak Payout' : 'Withdraw Payout Balance'}
              </h3>
              <button
                type="button"
                onClick={() => setPayoutOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--egvox-text-secondary)] tabular-nums">
              {isId ? 'Saldo tersedia:' : 'Available balance:'}{' '}
              <strong className="text-[#027F86] dark:text-[#04B8B4]">
                {egvoxFormatIDR(availableBalance)} ({egvoxFormatUSD(availableBalance)} USD)
              </strong>
            </p>
            <form onSubmit={handleSubmitPayout} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {isId ? 'Nominal Penarikan (IDR)' : 'Withdrawal Amount (IDR)'}
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-bold tabular-nums"
                />
                <p className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5 rounded-lg bg-[#027F86]/8 px-3 py-1.5 text-[11px] font-semibold text-[#027F86] dark:text-[#04B8B4] tabular-nums">
                  <span>{isId ? 'Nilai setara USD:' : 'Equivalent USD Value:'}</span>
                  <span>{egvoxFormatUSD(Number(payoutAmount) || 0)} USD</span>
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {isId ? 'Rekening / E-Wallet Tujuan' : 'Destination Bank / E-Wallet'}
                </label>
                <input
                  type="text"
                  value={payoutDest}
                  onChange={(e) => setPayoutDest(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Ajukan Penarikan Dana' : 'Confirm Withdrawal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Leave 5-Star Order Review Modal */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Berikan Ulasan & Rating' : 'Rate & Review Collaboration'}
              </h3>
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= reviewRating
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'text-[var(--egvox-text-muted)]'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={
                  isId
                    ? 'Tulis pengalaman kerja sama, ketepatan waktu, dan kualitas hasil...'
                    : 'Share your experience on delivery speed and quality...'
                }
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Kirim Ulasan' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Create Vendor Project Modal */}
      {createProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Buat Project Kebutuhan Dataset Baru' : 'Publish New Dataset Project'}
              </h3>
              <button
                type="button"
                onClick={() => setCreateProjectOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <input
                type="text"
                required
                value={newPrjTitle}
                onChange={(e) => setNewPrjTitle(e.target.value)}
                placeholder={isId ? 'Judul Project Dataset...' : 'Dataset Project Title...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newPrjCat}
                  onChange={(e) => setNewPrjCat(e.target.value as ActivityCategorySlug)}
                  className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                >
                  <option value="cooking">{isId ? 'Memasak & Dapur' : 'Cooking'}</option>
                  <option value="manufacturing">{isId ? 'Manufaktur' : 'Manufacturing'}</option>
                  <option value="automotive">{isId ? 'Otomotif' : 'Automotive'}</option>
                  <option value="warehouse">{isId ? 'Gudang & Logistik' : 'Warehouse'}</option>
                </select>
                <select
                  value={newPrjType}
                  onChange={(e) => setNewPrjType(e.target.value as DataModality)}
                  className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                >
                  <option value="Video">Video</option>
                  <option value="Gambar">{isId ? 'Gambar' : 'Image'}</option>
                  <option value="Multimodal">Multimodal</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                    {isId ? 'Target Volume (jam)' : 'Target Volume (hours)'}
                  </label>
                  <input
                    type="number"
                    value={newPrjHours}
                    onChange={(e) => setNewPrjHours(e.target.value)}
                    placeholder={isId ? 'Target Volume (jam)' : 'Target Volume (hours)'}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                    {isId ? 'Tarif per Jam (IDR)' : 'Hourly Rate (IDR)'}
                  </label>
                  <input
                    type="number"
                    value={newPrjRate}
                    onChange={(e) => setNewPrjRate(e.target.value)}
                    placeholder={isId ? 'Rate per jam (IDR)' : 'Rate per hour (IDR)'}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-semibold tabular-nums"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-[#027F86]/25 bg-[#027F86]/8 px-3.5 py-2.5 text-[11px] space-y-1 tabular-nums">
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[#027F86] dark:text-[#04B8B4] font-semibold">
                  <span>
                    {isId
                      ? 'Auto-Konversi Tarif Katalog (IDR -> USD):'
                      : 'Auto-Converted Catalog Rate (IDR -> USD):'}
                  </span>
                  <span>
                    {egvoxFormatIDR(Number(newPrjRate) || 0)} &harr;{' '}
                    {egvoxFormatUSD(Number(newPrjRate) || 0)} USD / {isId ? 'jam' : 'hour'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[var(--egvox-text-secondary)]">
                  <span>{isId ? 'Estimasi Total Anggaran:' : 'Estimated Total Budget:'}</span>
                  <span className="font-bold">
                    {egvoxFormatIDR((Number(newPrjRate) || 0) * (Number(newPrjHours) || 0))}{' '}
                    ({egvoxFormatUSD((Number(newPrjRate) || 0) * (Number(newPrjHours) || 0))} USD)
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={newPrjLocation}
                onChange={(e) => setNewPrjLocation(e.target.value)}
                placeholder={isId ? 'Lokasi pengambilan data' : 'Capture location'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <textarea
                rows={3}
                required
                value={newPrjSummary}
                onChange={(e) => setNewPrjSummary(e.target.value)}
                placeholder={isId ? 'Ringkasan kebutuhan dan panduan capture...' : 'Project summary and capture brief...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
              >
                <span>{isId ? 'Publikasikan ke Project Catalog' : 'Publish to Project Catalog'}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Create Freelancer Service Modal */}
      {createServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Buat Listing Jasa Freelancer' : 'Create Freelancer Service Listing'}
              </h3>
              <button
                type="button"
                onClick={() => setCreateServiceOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateService} className="space-y-3">
              <input
                type="text"
                required
                value={newSrvTitle}
                onChange={(e) => setNewSrvTitle(e.target.value)}
                placeholder={isId ? 'Judul Layanan (misal: Jasa Rekam Video Dapur 4K)' : 'Service Title...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                    {isId ? 'Peran Layanan' : 'Service Role'}
                  </label>
                  <select
                    value={newSrvRole}
                    onChange={(e) =>
                      setNewSrvRole(e.target.value as FreelancerServiceListing['roleType'])
                    }
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  >
                    <option value="Video Contributor">
                      {isId ? 'Kontributor Video (Video Contributor)' : 'Video Contributor'}
                    </option>
                    <option value="Data Annotator">
                      {isId ? 'Anotator Data (Data Annotator)' : 'Data Annotator'}
                    </option>
                    <option value="QA Reviewer">
                      {isId ? 'Peninjau QA (QA Reviewer)' : 'QA Reviewer'}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--egvox-text-muted)] mb-1">
                    {isId ? 'Isi Harga Rupiah / Jam (IDR)' : 'Enter Rupiah Price / Hour (IDR)'}
                  </label>
                  <input
                    type="number"
                    value={newSrvRate}
                    onChange={(e) => setNewSrvRate(e.target.value)}
                    placeholder={isId ? 'Tarif per jam (IDR)' : 'Rate per hour (IDR)'}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs font-semibold tabular-nums"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-[#027F86]/25 bg-[#027F86]/8 px-3.5 py-2.5 text-[11px] space-y-1 tabular-nums">
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[#027F86] dark:text-[#04B8B4] font-semibold">
                  <span>
                    {isId
                      ? 'Auto-Generate Harga Pembeli di Katalog:'
                      : 'Auto-Generated Catalog Dual Price:'}
                  </span>
                  <span>
                    {egvoxFormatIDR(Number(newSrvRate) || 0)} &harr;{' '}
                    {egvoxFormatUSD(Number(newSrvRate) || 0)} USD / {isId ? 'jam' : 'hour'}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--egvox-text-muted)]">
                  {isId
                    ? 'Pembeli internasional melihat kurs Dollar (USD) otomatis bernilai setara (1 USD = Rp 16.000).'
                    : 'Buyers in the catalog see both Rupiah (IDR) and equivalent Dollar (USD) automatically (1 USD = Rp 16,000).'}
                </p>
              </div>
              <input
                type="text"
                value={newSrvLocation}
                onChange={(e) => setNewSrvLocation(e.target.value)}
                placeholder={isId ? 'Kota / Area Operasional' : 'City / Operating Region'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <textarea
                rows={3}
                required
                value={newSrvDesc}
                onChange={(e) => setNewSrvDesc(e.target.value)}
                placeholder={isId ? 'Deskripsi keahlian, perangkat, dan SLA per jam...' : 'Describe equipment, capabilities, and hourly SLA...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Terbitkan Layanan ke Marketplace' : 'Publish Service to Marketplace'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. Enterprise RFP Modal */}
      {rfpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Permintaan RFP Enterprise Baru' : 'New Enterprise RFP Request'}
              </h3>
              <button
                type="button"
                onClick={() => setRfpOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitRfp} className="space-y-3">
              <input
                type="text"
                required
                value={rfpCompany}
                onChange={(e) => setRfpCompany(e.target.value)}
                placeholder={isId ? 'Nama Perusahaan' : 'Company Name'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <input
                type="email"
                required
                value={rfpEmail}
                onChange={(e) => setRfpEmail(e.target.value)}
                placeholder="procurement@company.com"
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <select
                value={rfpVolume}
                onChange={(e) => setRfpVolume(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              >
                <option value="50 – 250 jam">{isId ? '50 – 250 jam' : '50 – 250 hours'}</option>
                <option value="250 – 1.000 jam">{isId ? '250 – 1.000 jam' : '250 – 1,000 hours'}</option>
                <option value="1.000+ jam">{isId ? '1.000+ jam' : '1,000+ hours'}</option>
              </select>
              <textarea
                rows={3}
                required
                value={rfpSummary}
                onChange={(e) => setRfpSummary(e.target.value)}
                placeholder={isId ? 'Ringkasan kebutuhan dataset enterprise...' : 'Enterprise dataset scope summary...'}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#FC840E] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Kirim Permintaan RFP' : 'Submit Enterprise RFP'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 9. KYC Upload Modal */}
      {kycOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Unggah Dokumen KYC' : 'Upload KYC Verification Document'}
              </h3>
              <button
                type="button"
                onClick={() => setKycOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitKyc} className="space-y-3">
              <select
                value={kycDocType}
                onChange={(e) => setKycDocType(e.target.value)}
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
              >
                <option value="KTP / National ID">
                  {isId ? 'KTP / Identitas Nasional' : 'National ID / KTP'}
                </option>
                <option value="Passport">{isId ? 'Paspor' : 'Passport'}</option>
                <option value="NIB / Company Akta">
                  {isId ? 'NIB / Akta Perusahaan' : 'NIB / Company Registration'}
                </option>
              </select>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Kirim Dokumen Verifikasi' : 'Submit Verification Document'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 10. Switch Organization Modal */}
      {orgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Ganti Organisasi Aktif' : 'Switch Active Organization'}
              </h3>
              <button
                type="button"
                onClick={() => setOrgModalOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {['PT Data Visual Indonesia', 'Nusantara Robotics Data', 'EgvoX Enterprise Pilot'].map(
                (org) => (
                  <button
                    key={org}
                    type="button"
                    onClick={() => {
                      setActiveOrg(org);
                      setOrgModalOpen(false);
                      showToast(
                        isId ? `Beralih ke organisasi ${org}.` : `Switched active org to ${org}.`
                      );
                    }}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-semibold ${
                      activeOrg === org
                        ? 'border-[#027F86] bg-[#027F86]/10 text-[#027F86]'
                        : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-subtle)]'
                    }`}
                  >
                    <span>{org}</span>
                    {activeOrg === org && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
