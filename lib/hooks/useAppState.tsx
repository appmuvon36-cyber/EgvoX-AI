'use client';

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import {
  ActiveWorkOrder,
  ActivityCategorySlug,
  AdminAuditLogEntry,
  AdminDisputeCase,
  AdminEnterpriseDeal,
  AdminFinanceRecord,
  AdminModerationListing,
  AdminRbacRole,
  AdminRightsRecord,
  AdminVerificationCase,
  CaptureSpecification,
  FreelancerServiceListing,
  Locale,
  NegotiationOffer,
  OpsAnnotationProject,
  OpsDeliveryPackage,
  OpsProjectPackage,
  OpsQuarantineItem,
  OpsUploadSession,
  OrderReviewRecord,
  PayoutRequestRecord,
  ProjectListing,
  PublicUserRole,
  RecruiterWalletBalance,
  RecruitmentOffer,
  SavedProposal,
  StructuredClarification,
  SubmissionFileItem,
  TopUpRecord,
  WorkspaceNotification,
} from '@/packages/shared-types';
import {
  ACTIVITY_CATEGORIES,
  INITIAL_CLARIFICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OFFERS,
  INITIAL_PAYOUT_HISTORY,
  INITIAL_RECRUITER_WALLET,
  INITIAL_RECRUITMENT_OFFERS,
  INITIAL_REVIEWS,
  INITIAL_SUBMISSION_FILES,
  INITIAL_TOPUP_HISTORY,
  INITIAL_WORK_ORDERS,
} from '@/lib/catalog-data';
import {
  INITIAL_ADMIN_AUDIT_LOGS,
  INITIAL_ADMIN_DISPUTES,
  INITIAL_ADMIN_ENTERPRISE_DEALS,
  INITIAL_ADMIN_FINANCE,
  INITIAL_ADMIN_MODERATION,
  INITIAL_ADMIN_RBAC_ROLES,
  INITIAL_ADMIN_RIGHTS,
  INITIAL_ADMIN_VERIFICATIONS,
  INITIAL_OPS_ANNOTATION_PROJECTS,
  INITIAL_OPS_DELIVERY_PACKAGES,
  INITIAL_OPS_PROJECTS,
  INITIAL_OPS_QUARANTINE_ITEMS,
  INITIAL_OPS_UPLOAD_SESSIONS,
} from '@/lib/ops-admin-data';

interface EnterpriseInquiryRecord {
  id: string;
  companyName: string;
  country: string;
  website?: string;
  businessEmail: string;
  contactPerson: string;
  contactPhone?: string;
  domainCategory?: string;
  deliveryFormat?: string;
  targetDeadline?: string;
  estimatedVolume: string;
  requirementSummary: string;
  attachmentName?: string;
  status: 'submitted';
  createdAt: string;
}

export interface ReportListingTarget {
  type: 'project' | 'service';
  slug: string;
  title: string;
}

export interface CreateRecruitmentOfferInput {
  freelancer: FreelancerServiceListing;
  workType: RecruitmentOffer['workType'];
  projectTitle: string;
  projectSlug?: string;
  volumeHours: number;
  specVersion: string;
  deadline: string;
  grossFeeIDR: number;
  bindingType: 'binding' | 'screening';
  milestonesSummary: string;
  revisionsCount: number;
  acceptanceSummary: string;
  expiresAt: string;
  saveAsDraft?: boolean;
  conflictCheckPassed?: boolean;
  note?: string;
}

interface AppStateContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeRole: PublicUserRole;
  setActiveRole: (r: PublicUserRole) => void;
  savedSlugs: string[];
  toggleSaved: (slug: string, label?: string) => void;
  proposals: SavedProposal[];
  submitProposal: (p: Omit<SavedProposal, 'id' | 'status' | 'createdAt'>) => void;
  withdrawProposal: (proposalId: string) => void;
  inquiries: EnterpriseInquiryRecord[];
  submitEnterpriseInquiry: (
    inq: Omit<EnterpriseInquiryRecord, 'id' | 'status' | 'createdAt'>
  ) => void;
  workOrders: ActiveWorkOrder[];
  acknowledgedOrderIds: string[];
  acknowledgeOrderSpec: (orderId: string) => void;
  recordMilestoneFunding: (orderCode: string, note: string, amountIDR: number) => void;
  notifications: WorkspaceNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  notificationsModalOpen: boolean;
  setNotificationsModalOpen: (open: boolean) => void;
  submissionFiles: SubmissionFileItem[];
  submitReworkOrDispute: (fileId: string, note: string, mode: 'rework' | 'appeal') => void;
  offers: NegotiationOffer[];
  respondOffer: (
    offerId: string,
    decision: 'accepted' | 'rejected' | 'countered',
    counterRate?: number,
    note?: string
  ) => void;
  // v1.3 Recruitment & Recruiter Wallet Ledger
  recruiterWallet: RecruiterWalletBalance;
  topUpHistory: TopUpRecord[];
  submitWalletTopUp: (
    amountIDR: number,
    method: TopUpRecord['method'],
    immediateSettle?: boolean
  ) => void;
  settlePendingTopUp: (topUpId: string) => void;
  topUpModalOpen: boolean;
  setTopUpModalOpen: (open: boolean) => void;
  recruitmentOffers: RecruitmentOffer[];
  createRecruitmentOffer: (input: CreateRecruitmentOfferInput) => {
    ok: boolean;
    error?: string;
    offerCode?: string;
  };
  respondRecruitmentOffer: (
    offerId: string,
    decision: 'accepted' | 'rejected' | 'withdrawn' | 'countered',
    counterPayload?: {
      grossFeeIDR: number;
      scopeDelta: string;
      note: string;
      actorRole: 'recruiter' | 'freelancer';
    }
  ) => void;
  clarifications: StructuredClarification[];
  submitClarification: (
    offerCode: string,
    projectTitle: string,
    topic: StructuredClarification['topic'],
    question: string,
    senderRole?: 'recruiter' | 'freelancer'
  ) => void;
  resolveClarification: (clarificationId: string, answer: string) => void;
  recruitModalTarget: FreelancerServiceListing | null;
  openRecruitModal: (service: FreelancerServiceListing | null) => void;
  availableBalance: number;
  payoutHistory: PayoutRequestRecord[];
  requestPayout: (amount: number, destination: string) => void;
  reviews: OrderReviewRecord[];
  submitOrderReview: (
    targetName: string,
    workOrderCode: string,
    rating: number,
    comment: string
  ) => void;
  customProjects: ProjectListing[];
  createVendorProject: (input: {
    title: string;
    category: ProjectListing['category'];
    dataType: ProjectListing['dataType'];
    targetVolume: number;
    ratePerUnit: number;
    showBudgetDisclosure?: boolean;
    location: string;
    summary: string;
    deadline?: string;
    applicationCloseDate?: string;
    perspective?: CaptureSpecification['perspective'];
    mounting?: CaptureSpecification['mounting'];
    deviceRequirement?: string;
    resolution?: string;
    frameRate?: string;
    codecFormat?: string;
    orientation?: CaptureSpecification['orientation'];
    clipDuration?: string;
    audioPolicy?: CaptureSpecification['audioPolicy'];
    consentPolicy?: string;
    annotationRequired?: ProjectListing['annotationRequired'];
    acceptanceCriteria?: string[];
    rightsSummary?: string;
  }) => void;
  customServices: FreelancerServiceListing[];
  pausedServiceIds: string[];
  toggleServiceAvailability: (serviceId: string, title?: string) => void;
  createFreelancerService: (input: {
    title: string;
    roleType: FreelancerServiceListing['roleType'];
    location: string;
    description: string;
    categories?: ActivityCategorySlug[];
    capacityLabel?: string;
    deliverySla?: string;
    equipment?: string[];
    equipmentSummary?: string;
    resolutionFps?: string;
    annotationTools?: string[];
    supportedSchemas?: string[];
    tags?: string[];
    exclusions?: string[];
    terms?: string[];
    portfolioTitle?: string;
    portfolioImage?: string;
    conflictDisclosureDeclared?: boolean;
    conflictDisclosureText?: string;
  }) => void;
  kycStatus: 'verified' | 'pending_review';
  submitKyc: (docType: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  proposalModalProject: ProjectListing | null;
  openProposalModal: (project: ProjectListing | null) => void;
  reportListingModal: ReportListingTarget | null;
  openReportModal: (target: ReportListingTarget | null) => void;
  // Data Operations Workspace State
  opsProjects: OpsProjectPackage[];
  createOpsWorkPackage: (input: {
    nameId: string;
    clientName: string;
    totalPackages: number;
    specVersion: string;
    deadline: string;
  }) => void;
  opsUploadSessions: OpsUploadSession[];
  opsQuarantineItems: OpsQuarantineItem[];
  opsAnnotationProjects: OpsAnnotationProject[];
  opsDeliveryPackages: OpsDeliveryPackage[];
  acceptedEnterpriseDeliveries: string[];
  acceptEnterpriseDelivery: (pkgId: string, decision?: 'accepted' | 'revision') => void;
  createOpsUploadSession: (projectCode: string, fileName: string, sizeLabel: string) => void;
  updateQuarantineDecision: (
    itemId: string,
    nextStatus: OpsQuarantineItem['status'],
    reasonCode?: string
  ) => void;
  updateAnnotationProjectStatus: (
    projectId: string,
    status: OpsAnnotationProject['status'],
    progressPercent?: number
  ) => void;
  dispatchDeliveryPackage: (pkgId: string) => void;
  // Super Admin Control Plane State
  adminVerifications: AdminVerificationCase[];
  decideVerification: (
    id: string,
    status: AdminVerificationCase['status']
  ) => void;
  adminModerations: AdminModerationListing[];
  decideModeration: (
    id: string,
    status: AdminModerationListing['status'],
    note?: string
  ) => void;
  adminEnterpriseDeals: AdminEnterpriseDeal[];
  advanceEnterpriseDeal: (
    id: string,
    stage: AdminEnterpriseDeal['stage']
  ) => void;
  adminFinanceRecords: AdminFinanceRecord[];
  approveFinanceRecord: (id: string) => void;
  adminRightsRecords: AdminRightsRecord[];
  updateRightsStatus: (id: string, status: AdminRightsRecord['status']) => void;
  adminDisputes: AdminDisputeCase[];
  resolveDisputeCase: (
    id: string,
    status: AdminDisputeCase['status'],
    rationale: string
  ) => void;
  adminAuditLogs: AdminAuditLogEntry[];
  appendAuditLog: (
    activity: string,
    target: string,
    actorCode?: string,
    actorRole?: string,
    isBreakGlass?: boolean
  ) => void;
  adminRbacRoles: AdminRbacRole[];
  updateRbacRolePermissions: (roleId: string, permissions: string[]) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

let memoryLocale: Locale = 'id';
let memoryTheme: 'light' | 'dark' = 'light';

function subscribeClientPrefs(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('egvox-prefs', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('egvox-prefs', callback);
  };
}

function getLocaleClient(): Locale {
  try {
    const saved = window.localStorage.getItem('egvox_locale');
    if (saved === 'id' || saved === 'en') {
      memoryLocale = saved;
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return memoryLocale;
}

function getThemeClient(): 'light' | 'dark' {
  try {
    const saved = window.localStorage.getItem('egvox_theme');
    if (saved === 'light' || saved === 'dark') {
      memoryTheme = saved;
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return memoryTheme;
}

const getLocaleServer = (): Locale => 'id';
const getThemeServer = (): 'light' | 'dark' => 'light';

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const locale = useSyncExternalStore(
    subscribeClientPrefs,
    getLocaleClient,
    getLocaleServer
  );
  const theme = useSyncExternalStore(
    subscribeClientPrefs,
    getThemeClient,
    getThemeServer
  );
  const [activeRole, setActiveRole] = useState<PublicUserRole>('guest');
  const [savedSlugs, setSavedSlugs] = useState<string[]>([
    'dataset-memasak-egocentric-cooking',
    'jasa-pengambilan-video-aktivitas-memasak-egocentric',
  ]);
  const [proposals, setProposals] = useState<SavedProposal[]>([
    {
      id: 'prop-101',
      projectSlug: 'dataset-memasak-egocentric-cooking',
      projectTitle: 'Dataset Memasak (Egocentric Cooking)',
      projectTitleEn: 'Egocentric Cooking & Kitchen Activity Dataset',
      vendorName: 'PT Data Visual Indonesia',
      volume: 25,
      weeklyCapacityHours: 20,
      deviceSummary: 'GoPro Hero 12 Black + Chest/Head Mount',
      note: 'Siap mengerjakan dengan GoPro Hero 12 head-mounted 1080p60 sesuai SPEC-COOK-v2.1.',
      noteEn: 'Ready to deliver with head-mounted GoPro Hero 12 at 1080p60 per SPEC-COOK-v2.1.',
      attachmentName: 'Portofolio_Dapur_Rizal.pdf',
      status: 'under_review',
      createdAt: '20 Nov 2026',
      createdAtEn: '20 Nov 2026',
    },
  ]);
  const [inquiries, setInquiries] = useState<EnterpriseInquiryRecord[]>([]);
  const [workOrders, setWorkOrders] = useState<ActiveWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [submissionFiles, setSubmissionFiles] = useState<SubmissionFileItem[]>(
    INITIAL_SUBMISSION_FILES
  );
  const [offers, setOffers] = useState<NegotiationOffer[]>(INITIAL_OFFERS);
  const [recruiterWallet, setRecruiterWallet] = useState<RecruiterWalletBalance>(
    INITIAL_RECRUITER_WALLET
  );
  const [topUpHistory, setTopUpHistory] = useState<TopUpRecord[]>(INITIAL_TOPUP_HISTORY);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [recruitmentOffers, setRecruitmentOffers] = useState<RecruitmentOffer[]>(
    INITIAL_RECRUITMENT_OFFERS
  );
  const [clarifications, setClarifications] = useState<StructuredClarification[]>(
    INITIAL_CLARIFICATIONS
  );
  const [availableBalance, setAvailableBalance] = useState<number>(2450000);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRequestRecord[]>(
    INITIAL_PAYOUT_HISTORY
  );
  const [reviews, setReviews] = useState<OrderReviewRecord[]>(INITIAL_REVIEWS);
  const [customProjects, setCustomProjects] = useState<ProjectListing[]>([]);
  const [customServices, setCustomServices] = useState<FreelancerServiceListing[]>([]);
  const [pausedServiceIds, setPausedServiceIds] = useState<string[]>([]);
  const [acknowledgedOrderIds, setAcknowledgedOrderIds] = useState<string[]>([]);
  const [acceptedEnterpriseDeliveries, setAcceptedEnterpriseDeliveries] = useState<string[]>([]);
  const [kycStatus, setKycStatus] = useState<'verified' | 'pending_review'>('pending_review');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [proposalModalProject, setProposalModalProject] =
    useState<ProjectListing | null>(null);
  const [recruitModalTarget, setRecruitModalTarget] =
    useState<FreelancerServiceListing | null>(null);
  const [reportListingModal, setReportListingModal] =
    useState<ReportListingTarget | null>(null);

  // Data Operations Shared State
  const [opsProjects, setOpsProjects] =
    useState<OpsProjectPackage[]>(INITIAL_OPS_PROJECTS);
  const [opsUploadSessions, setOpsUploadSessions] = useState<OpsUploadSession[]>(
    INITIAL_OPS_UPLOAD_SESSIONS
  );
  const [opsQuarantineItems, setOpsQuarantineItems] = useState<
    OpsQuarantineItem[]
  >(INITIAL_OPS_QUARANTINE_ITEMS);
  const [opsAnnotationProjects, setOpsAnnotationProjects] = useState<
    OpsAnnotationProject[]
  >(INITIAL_OPS_ANNOTATION_PROJECTS);
  const [opsDeliveryPackages, setOpsDeliveryPackages] = useState<
    OpsDeliveryPackage[]
  >(INITIAL_OPS_DELIVERY_PACKAGES);

  // Super Admin Control Plane Shared State
  const [adminVerifications, setAdminVerifications] = useState<
    AdminVerificationCase[]
  >(INITIAL_ADMIN_VERIFICATIONS);
  const [adminModerations, setAdminModerations] = useState<
    AdminModerationListing[]
  >(INITIAL_ADMIN_MODERATION);
  const [adminEnterpriseDeals, setAdminEnterpriseDeals] = useState<
    AdminEnterpriseDeal[]
  >(INITIAL_ADMIN_ENTERPRISE_DEALS);
  const [adminFinanceRecords, setAdminFinanceRecords] = useState<
    AdminFinanceRecord[]
  >(INITIAL_ADMIN_FINANCE);
  const [adminRightsRecords, setAdminRightsRecords] = useState<
    AdminRightsRecord[]
  >(INITIAL_ADMIN_RIGHTS);
  const [adminDisputes, setAdminDisputes] = useState<AdminDisputeCase[]>(
    INITIAL_ADMIN_DISPUTES
  );
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLogEntry[]>(
    INITIAL_ADMIN_AUDIT_LOGS
  );
  const [adminRbacRoles, setAdminRbacRoles] = useState<AdminRbacRole[]>(INITIAL_ADMIN_RBAC_ROLES);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.lang = locale;
  }, [theme, locale]);

  const setLocale = (nextLocale: Locale) => {
    memoryLocale = nextLocale;
    try {
      window.localStorage.setItem('egvox_locale', nextLocale);
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new Event('egvox-prefs'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    memoryTheme = next;
    try {
      window.localStorage.setItem('egvox_theme', next);
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new Event('egvox-prefs'));
  };

  const toggleSaved = (slug: string, label?: string) => {
    setSavedSlugs((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      showToast(
        locale === 'id'
          ? exists
            ? `${label || 'Item'} dihapus dari daftar tersimpan.`
            : `${label || 'Item'} disimpan ke daftar Anda.`
          : exists
          ? `${label || 'Item'} removed from saved items.`
          : `${label || 'Item'} saved to your list.`
      );
      return next;
    });
  };

  const submitProposal = (
    p: Omit<SavedProposal, 'id' | 'status' | 'createdAt'>
  ) => {
    const next: SavedProposal = {
      ...p,
      id: `prop-${Date.now().toString().slice(-4)}`,
      status: 'submitted',
      createdAt: locale === 'id' ? 'Hari ini' : 'Today',
    };
    setProposals((prev) => [next, ...prev]);
    showToast(
      locale === 'id'
        ? 'Pengajuan minat & kualifikasi berhasil dikirim ke Vendor.'
        : 'Qualification application submitted to Vendor.'
    );
  };

  const withdrawProposal = (proposalId: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposalId));
    showToast(
      locale === 'id'
        ? 'Pengajuan minat berhasil ditarik (Withdrawn) dari peninjauan vendor.'
        : 'Application withdrawn from vendor review.'
    );
  };

  const acknowledgeOrderSpec = (orderId: string) => {
    setAcknowledgedOrderIds((prev) =>
      prev.includes(orderId) ? prev : [...prev, orderId]
    );
    showToast(
      locale === 'id'
        ? 'Capture Specification Work Order telah dikonfirmasi & disetujui.'
        : 'Work Order Capture Specification acknowledged & confirmed.'
    );
  };

  const recordMilestoneFunding = (
    orderCode: string,
    note: string,
    amountIDR: number
  ) => {
    const recId = `fin-ms-${Date.now().toString().slice(-4)}`;
    setAdminFinanceRecords((prev) => [
      {
        id: recId,
        code: `RES-${Date.now().toString().slice(-4)}`,
        kind: 'invoice',
        counterparty: `${orderCode} · ${note}`,
        amountIDR,
        status: 'approved',
        dateLabel: locale === 'id' ? 'Hari ini' : 'Today',
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? `Reservasi Dana Terotorisasi Ledger Work Order ${orderCode} berhasil dicatat.`
        : `Authorized Work Order Ledger reservation for ${orderCode} recorded.`
    );
  };

  const acceptEnterpriseDelivery = (
    pkgId: string,
    decision: 'accepted' | 'revision' = 'accepted'
  ) => {
    if (decision === 'accepted') {
      setAcceptedEnterpriseDeliveries((prev) =>
        prev.includes(pkgId) ? prev : [...prev, pkgId]
      );
      showToast(
        locale === 'id'
          ? 'Paket dataset & Rights Manifest resmi diterima (Enterprise Acceptance Confirmed).'
          : 'Dataset delivery & Rights Manifest formally accepted.'
      );
    } else {
      showToast(
        locale === 'id'
          ? 'Permintaan revisi sampel dikirim ke tim Data Operations.'
          : 'Sample revision request sent to Data Operations.'
      );
    }
  };

  const submitEnterpriseInquiry = (
    inq: Omit<EnterpriseInquiryRecord, 'id' | 'status' | 'createdAt'>
  ) => {
    const next: EnterpriseInquiryRecord = {
      ...inq,
      id: `ent-${Date.now().toString().slice(-4)}`,
      status: 'submitted',
      createdAt: locale === 'id' ? 'Hari ini' : 'Today',
    };
    const volumeStr = inq.estimatedVolume.toLowerCase();
    const parsedHours = volumeStr.includes('1.000') || volumeStr.includes('1,000')
      ? 1000
      : volumeStr.includes('250+')
      ? 350
      : volumeStr.includes('250') && volumeStr.includes('50')
      ? 150
      : volumeStr.includes('250')
      ? 500
      : 40;
    const summaryParts = [
      inq.domainCategory ? `[${inq.domainCategory}]` : null,
      inq.deliveryFormat ? `Format: ${inq.deliveryFormat}` : null,
      inq.targetDeadline ? `Target: ${inq.targetDeadline}` : null,
      inq.website ? `Web: ${inq.website}` : null,
    ].filter(Boolean);
    const enrichedBrief =
      summaryParts.length > 0
        ? `${summaryParts.join(' · ')} — ${inq.requirementSummary}`
        : inq.requirementSummary;

    setInquiries((prev) => [next, ...prev]);
    setAdminEnterpriseDeals((prev) => [
      {
        id: next.id,
        companyName: inq.companyName,
        briefSummary: enrichedBrief,
        estimatedHours: parsedHours,
        stage: 'request',
        contractValueIDR: parsedHours * 960000,
        picEmail: inq.businessEmail,
        picName: inq.contactPerson,
        picPhone: inq.contactPhone,
        attachmentName: inq.attachmentName,
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? `Permintaan kemitraan Enterprise tercatat${
            inq.attachmentName ? ` (lampiran: ${inq.attachmentName})` : ''
          }. Tim kami akan menghubungi PIC Anda.`
        : `Enterprise partnership inquiry recorded${
            inq.attachmentName ? ` (attachment: ${inq.attachmentName})` : ''
          }. Our team will reach out.`
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const submitWalletTopUp = (
    amountIDR: number,
    method: TopUpRecord['method'],
    immediateSettle = true
  ) => {
    if (!Number.isFinite(amountIDR) || amountIDR < 500000) return;
    const code = `TOP-2026-${Date.now().toString().slice(-4)}`;
    const record: TopUpRecord = {
      id: `top-${Date.now()}`,
      code,
      amountIDR,
      method,
      status: immediateSettle ? 'settled' : 'pending_settlement',
      createdAt: locale === 'id' ? 'Hari ini' : 'Today',
      settledAt: immediateSettle ? (locale === 'id' ? 'Hari ini' : 'Today') : undefined,
    };
    setTopUpHistory((prev) => [record, ...prev]);
    setRecruiterWallet((prev) =>
      immediateSettle
        ? {
            ...prev,
            settledBalanceIDR: prev.settledBalanceIDR + amountIDR,
            availableBalanceIDR: prev.availableBalanceIDR + amountIDR,
          }
        : {
            ...prev,
            pendingTopUpIDR: prev.pendingTopUpIDR + amountIDR,
          }
    );
    showToast(
      immediateSettle
        ? locale === 'id'
          ? `Top-up ${code} berhasil settled ke Saldo Tersedia Rekruter.`
          : `Top-up ${code} settled into Available Recruiter Balance.`
        : locale === 'id'
        ? `Top-up ${code} berstatus Pending Settlement (tidak dihitung sebagai dana tersedia hingga settled).`
        : `Top-up ${code} pending settlement (excluded from available balance until cleared).`
    );
  };

  const settlePendingTopUp = (topUpId: string) => {
    const target = topUpHistory.find((t) => t.id === topUpId && t.status === 'pending_settlement');
    if (!target) return;
    setTopUpHistory((prev) =>
      prev.map((t) =>
        t.id === topUpId
          ? { ...t, status: 'settled', settledAt: locale === 'id' ? 'Baru saja' : 'Just now' }
          : t
      )
    );
    setRecruiterWallet((prev) => ({
      ...prev,
      pendingTopUpIDR: Math.max(0, prev.pendingTopUpIDR - target.amountIDR),
      settledBalanceIDR: prev.settledBalanceIDR + target.amountIDR,
      availableBalanceIDR: prev.availableBalanceIDR + target.amountIDR,
    }));
    showToast(
      locale === 'id'
        ? `Settlement ${target.code} dikonfirmasi Payment Provider.`
        : `Settlement ${target.code} confirmed by Payment Provider.`
    );
  };

  const createRecruitmentOffer = (input: CreateRecruitmentOfferInput) => {
    const isDraft = Boolean(input.saveAsDraft);
    const isBinding = input.bindingType === 'binding';
    const gross = input.grossFeeIDR;
    const adminFee = Math.round(gross * 0.08);
    const paymentFee = Math.round(gross * 0.015);
    const netFreelancer = Math.max(0, gross - adminFee - paymentFee);

    if (!isDraft && isBinding) {
      if (!recruiterWallet.vendorKybVerified) {
        return {
          ok: false,
          error:
            locale === 'id'
              ? 'Organisasi perekrut harus melewati verifikasi KYB sebelum mengirim penawaran mengikat.'
              : 'Recruiter organization must pass KYB verification before sending binding offers.',
        };
      }
      if (recruiterWallet.settledBalanceIDR < recruiterWallet.minPolicyIDR) {
        return {
          ok: false,
          error:
            locale === 'id'
              ? 'Saldo settled belum memenuhi kebijakan minimum saldo rekrutmen (Rp 5.000.000).'
              : 'Settled balance is below the minimum recruitment balance policy (Rp 5,000,000).',
        };
      }
      if (recruiterWallet.availableBalanceIDR < gross) {
        return {
          ok: false,
          error:
            locale === 'id'
              ? 'Saldo Tersedia (Cleared) tidak mencukupi untuk mereservasi komitmen penawaran ini. Lakukan Top Up Saldo terlebih dahulu.'
              : 'Insufficient Available Balance to reserve this binding offer. Please Top Up first.',
        };
      }
    }

    const prefix =
      input.workType === 'Data Annotation'
        ? 'AN'
        : input.workType === 'QA Specialist'
        ? 'QA'
        : 'VO';
    const offerCode = `${prefix}-2026-${Date.now().toString().slice(-3)}`;
    const reserveAmount = !isDraft && isBinding ? gross : 0;

    const newOffer: RecruitmentOffer = {
      id: `rec-${Date.now()}`,
      code: offerCode,
      workType: input.workType,
      projectTitle: input.projectTitle,
      projectTitleEn: input.projectTitle,
      projectSlug: input.projectSlug,
      recruiterOrg: 'PT Data Visual Indonesia',
      freelancerUsername: input.freelancer.username,
      freelancerName: input.freelancer.freelancerName,
      bindingType: input.bindingType,
      status: isDraft ? 'draft' : 'sent',
      grossFeeIDR: gross,
      adminFeeIDR: adminFee,
      paymentFeeIDR: paymentFee,
      feePayer: 'shared_transparent',
      recruiterTotalIDR: gross,
      freelancerNetIDR: netFreelancer,
      volumeHours: input.volumeHours,
      specVersion: input.specVersion,
      deadline: input.deadline,
      milestonesSummary: input.milestonesSummary,
      revisionsCount: input.revisionsCount,
      acceptanceSummary: input.acceptanceSummary,
      expiresAt: input.expiresAt,
      conflictCheckPassed:
        input.workType === 'QA Specialist' ? Boolean(input.conflictCheckPassed) : undefined,
      reservedAmountIDR: reserveAmount,
      updatedAt: locale === 'id' ? 'Baru saja' : 'Just now',
      versions: [
        {
          version: 1,
          actorRole: 'recruiter',
          actorName: 'PT Data Visual Indonesia',
          grossFeeIDR: gross,
          adminFeeIDR: adminFee,
          paymentFeeIDR: paymentFee,
          netFreelancerIDR: netFreelancer,
          recruiterTotalIDR: gross,
          volumeHours: input.volumeHours,
          note:
            input.note ||
            (input.bindingType === 'binding'
              ? `Penawaran rekrutmen privat ${offerCode} (${input.volumeHours} unit).`
              : `Undangan screening non-binding ${offerCode}.`),
          timestamp: locale === 'id' ? 'Baru saja' : 'Just now',
        },
      ],
    };

    setRecruitmentOffers((prev) => [newOffer, ...prev]);

    if (reserveAmount > 0) {
      setRecruiterWallet((prev) => ({
        ...prev,
        availableBalanceIDR: Math.max(0, prev.availableBalanceIDR - reserveAmount),
        reservedBalanceIDR: prev.reservedBalanceIDR + reserveAmount,
      }));
    }

    showToast(
      isDraft
        ? locale === 'id'
          ? `Draft penawaran ${offerCode} disimpan tanpa menahan saldo.`
          : `Offer draft ${offerCode} saved without fund reservation.`
        : locale === 'id'
        ? `Penawaran privat ${offerCode} dikirim ke ${input.freelancer.freelancerName}.`
        : `Private offer ${offerCode} sent to ${input.freelancer.freelancerName}.`
    );

    return { ok: true, offerCode };
  };

  const respondRecruitmentOffer = (
    offerId: string,
    decision: 'accepted' | 'rejected' | 'withdrawn' | 'countered',
    counterPayload?: {
      grossFeeIDR: number;
      scopeDelta: string;
      note: string;
      actorRole: 'recruiter' | 'freelancer';
    }
  ) => {
    const target = recruitmentOffers.find((o) => o.id === offerId);
    if (!target) return;

    if (decision === 'countered' && counterPayload) {
      const nextGross = counterPayload.grossFeeIDR;
      const nextAdmin = Math.round(nextGross * 0.08);
      const nextPayment = Math.round(nextGross * 0.015);
      const nextNet = Math.max(0, nextGross - nextAdmin - nextPayment);
      const nextVerNumber = target.versions.length + 1;
      const deltaReserve =
        target.bindingType === 'binding' && target.status !== 'draft'
          ? nextGross - target.reservedAmountIDR
          : 0;

      if (deltaReserve > 0 && recruiterWallet.availableBalanceIDR < deltaReserve && counterPayload.actorRole === 'recruiter') {
        showToast(
          locale === 'id'
            ? 'Saldo Tersedia tidak mencukupi untuk menaikkan reservasi counteroffer.'
            : 'Insufficient Available Balance to increase offer reservation.'
        );
        return;
      }

      setRecruitmentOffers((prev) =>
        prev.map((off) =>
          off.id === offerId
            ? {
                ...off,
                status: 'negotiating',
                grossFeeIDR: nextGross,
                adminFeeIDR: nextAdmin,
                paymentFeeIDR: nextPayment,
                recruiterTotalIDR: nextGross,
                freelancerNetIDR: nextNet,
                reservedAmountIDR:
                  counterPayload.actorRole === 'recruiter' && target.bindingType === 'binding'
                    ? nextGross
                    : off.reservedAmountIDR,
                updatedAt: locale === 'id' ? 'Baru saja' : 'Just now',
                versions: [
                  ...off.versions,
                  {
                    version: nextVerNumber,
                    actorRole: counterPayload.actorRole,
                    actorName:
                      counterPayload.actorRole === 'recruiter'
                        ? off.recruiterOrg
                        : off.freelancerName,
                    grossFeeIDR: nextGross,
                    adminFeeIDR: nextAdmin,
                    paymentFeeIDR: nextPayment,
                    netFreelancerIDR: nextNet,
                    recruiterTotalIDR: nextGross,
                    volumeHours: off.volumeHours,
                    scopeDelta: counterPayload.scopeDelta,
                    note: counterPayload.note,
                    timestamp: locale === 'id' ? 'Baru saja' : 'Just now',
                  },
                ],
              }
            : off
        )
      );

      if (counterPayload.actorRole === 'recruiter' && deltaReserve !== 0 && target.bindingType === 'binding') {
        setRecruiterWallet((prev) => ({
          ...prev,
          availableBalanceIDR: Math.max(0, prev.availableBalanceIDR - deltaReserve),
          reservedBalanceIDR: Math.max(0, prev.reservedBalanceIDR + deltaReserve),
        }));
      }

      showToast(
        locale === 'id'
          ? `Versi V${nextVerNumber} Counteroffer tercatat pada ${target.code}.`
          : `Counteroffer V${nextVerNumber} recorded on ${target.code}.`
      );
      return;
    }

    if (decision === 'accepted') {
      const committedAmt = target.grossFeeIDR;
      const releasedDiff = Math.max(0, target.reservedAmountIDR - committedAmt);
      setRecruitmentOffers((prev) =>
        prev.map((off) =>
          off.id === offerId
            ? {
                ...off,
                status: 'accepted',
                reservedAmountIDR: 0,
                updatedAt: locale === 'id' ? 'Baru saja' : 'Just now',
              }
            : off
        )
      );
      if (target.reservedAmountIDR > 0) {
        setRecruiterWallet((prev) => ({
          ...prev,
          reservedBalanceIDR: Math.max(0, prev.reservedBalanceIDR - target.reservedAmountIDR),
          committedBalanceIDR: prev.committedBalanceIDR + committedAmt,
          availableBalanceIDR: prev.availableBalanceIDR + releasedDiff,
        }));
      }
      const woCode = target.code.replace(/^(VO|AN|QA)-/, 'WO-');
      setWorkOrders((prev) => [
        {
          id: `wo-${Date.now()}`,
          code: woCode,
          title: target.projectTitle,
          titleEn: target.projectTitleEn || target.projectTitle,
          counterparty: target.recruiterOrg,
          rolePerspective: 'freelancer',
          specVersion: target.specVersion,
          stage: 'order_confirmed',
          progressPercent: 10,
          acceptedUnits: 0,
          totalUnits: target.volumeHours,
          unitLabel: 'unit',
          unitLabelEn: 'units',
          amount: target.grossFeeIDR,
          deadline: target.deadline,
          deadlineEn: target.deadline,
        },
        ...prev,
      ]);
      showToast(
        locale === 'id'
          ? `Kesepakatan tercapai! Work Order ${woCode} aktif dengan reservasi dana terotorisasi.`
          : `Agreement signed! Work Order ${woCode} active.`
      );
      return;
    }

    if (decision === 'countered') return;
    const finalStatus: 'rejected' | 'withdrawn' =
      decision === 'withdrawn' ? 'withdrawn' : 'rejected';

    // rejected or withdrawn -> release reserved balance
    setRecruitmentOffers((prev) =>
      prev.map((off) =>
        off.id === offerId
          ? {
              ...off,
              status: finalStatus,
              reservedAmountIDR: 0,
              updatedAt: locale === 'id' ? 'Baru saja' : 'Just now',
            }
          : off
      )
    );
    if (target.reservedAmountIDR > 0) {
      setRecruiterWallet((prev) => ({
        ...prev,
        reservedBalanceIDR: Math.max(0, prev.reservedBalanceIDR - target.reservedAmountIDR),
        availableBalanceIDR: prev.availableBalanceIDR + target.reservedAmountIDR,
      }));
    }
    showToast(
      locale === 'id'
        ? decision === 'rejected'
          ? `Penawaran ${target.code} ditolak dan reservasi dana dilepaskan.`
          : `Penawaran ${target.code} ditarik dan reservasi dana dikembalikan ke saldo tersedia.`
        : `Offer ${target.code} ${decision} and reserved funds released.`
    );
  };

  const submitClarification = (
    offerCode: string,
    projectTitle: string,
    topic: StructuredClarification['topic'],
    question: string,
    senderRole: 'recruiter' | 'freelancer' = 'freelancer'
  ) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setClarifications((prev) => [
      {
        id: `clr-${Date.now()}`,
        offerCode,
        projectTitle,
        senderName:
          senderRole === 'recruiter' ? 'PT Data Visual Indonesia' : 'Rizal Maulana',
        senderRole,
        topic,
        question: trimmed,
        status: 'open',
        createdAt: locale === 'id' ? 'Baru saja' : 'Just now',
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? `Klarifikasi terstruktur dicatat untuk ${offerCode}.`
        : `Structured clarification recorded for ${offerCode}.`
    );
  };

  const resolveClarification = (clarificationId: string, answer: string) => {
    const trimmed = answer.trim();
    if (!trimmed) return;
    setClarifications((prev) =>
      prev.map((c) =>
        c.id === clarificationId ? { ...c, answer: trimmed, status: 'resolved' } : c
      )
    );
    showToast(
      locale === 'id'
        ? 'Jawaban klarifikasi terstruktur berhasil diterbitkan.'
        : 'Structured clarification answer published.'
    );
  };

  const submitReworkOrDispute = (
    fileId: string,
    note: string,
    mode: 'rework' | 'appeal'
  ) => {
    setSubmissionFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              status: 'technical_review',
              qaReasonId:
                mode === 'rework'
                  ? `Rework diunggah: ${note}`
                  : `Banding QA diajukan: ${note}`,
              qaReasonEn:
                mode === 'rework'
                  ? `Rework uploaded: ${note}`
                  : `QA Appeal submitted: ${note}`,
            }
          : f
      )
    );
    showToast(
      locale === 'id'
        ? mode === 'rework'
          ? 'Revisi file diunggah ke zona karantina untuk review ulang.'
          : 'Pengajuan banding QA dikirim ke tim moderasi & reviewer.'
        : mode === 'rework'
        ? 'Revised file queued in private quarantine for re-validation.'
        : 'QA dispute appeal submitted to operations reviewers.'
    );
  };

  const respondOffer = (
    offerId: string,
    decision: 'accepted' | 'rejected' | 'countered',
    counterRate?: number,
    note?: string
  ) => {
    setOffers((prev) =>
      prev.map((off) =>
        off.id === offerId
          ? {
              ...off,
              status: decision,
              proposedRatePerHour: counterRate || off.proposedRatePerHour,
              note: note || off.note,
              updatedAt: locale === 'id' ? 'Baru saja' : 'Just now',
            }
          : off
      )
    );
    showToast(
      locale === 'id'
        ? decision === 'accepted'
          ? 'Penawaran disetujui dan Work Order terkunci.'
          : decision === 'countered'
          ? 'Counter-offer berhasil dikirim ke pihak lawan.'
          : 'Penawaran ditolak.'
        : decision === 'accepted'
        ? 'Offer accepted and Work Order terms locked.'
        : decision === 'countered'
        ? 'Counter-offer sent successfully.'
        : 'Offer declined.'
    );
  };

  const requestPayout = (amount: number, destination: string) => {
    if (amount <= 0 || amount > availableBalance) return;
    setAvailableBalance((prev) => prev - amount);
    const payId = `pay-${Date.now().toString().slice(-4)}`;
    const code = `PO-${Date.now().toString().slice(-4)}`;
    setPayoutHistory((prev) => [
      {
        id: payId,
        amount,
        destination,
        status: 'pending_review',
        createdAt: locale === 'id' ? 'Hari ini' : 'Today',
      },
      ...prev,
    ]);
    setAdminFinanceRecords((prev) => [
      {
        id: payId,
        code,
        kind: 'payout',
        counterparty: destination,
        amountIDR: amount,
        status: 'pending_dual_approval',
        dateLabel: locale === 'id' ? 'Hari ini' : 'Today',
        requiresDualApproval: true,
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? 'Permintaan penarikan dana berhasil dibuat dan masuk antrian dual-approval Finance.'
        : 'Payout withdrawal request submitted and queued for Finance dual approval.'
    );
  };

  const submitOrderReview = (
    targetName: string,
    workOrderCode: string,
    rating: number,
    comment: string
  ) => {
    setReviews((prev) => [
      {
        id: `orv-${Date.now().toString().slice(-4)}`,
        targetName,
        workOrderCode,
        rating,
        comment,
        createdAt: locale === 'id' ? 'Hari ini' : 'Today',
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? 'Ulasan dan rating berhasil dipublikasikan ke profil.'
        : 'Review and rating published to profile.'
    );
  };

  const createVendorProject = (input: {
    title: string;
    category: ProjectListing['category'];
    dataType: ProjectListing['dataType'];
    targetVolume: number;
    ratePerUnit: number;
    showBudgetDisclosure?: boolean;
    location: string;
    summary: string;
    deadline?: string;
    applicationCloseDate?: string;
    perspective?: CaptureSpecification['perspective'];
    mounting?: CaptureSpecification['mounting'];
    deviceRequirement?: string;
    resolution?: string;
    frameRate?: string;
    codecFormat?: string;
    orientation?: CaptureSpecification['orientation'];
    clipDuration?: string;
    audioPolicy?: CaptureSpecification['audioPolicy'];
    consentPolicy?: string;
    annotationRequired?: ProjectListing['annotationRequired'];
    acceptanceCriteria?: string[];
    rightsSummary?: string;
  }) => {
    const slug = `${input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const imageMap: Record<ProjectListing['category'], string> = {
      cooking: '/images/capture_cooking_pov_1795676769816.jpg',
      manufacturing: '/images/capture_manufacturing_pov_1795676770652.jpg',
      automotive: '/images/capture_automotive_pov_1795676770764.jpg',
      warehouse: '/images/capture_warehouse_pov_1795676771521.jpg',
      household: '/images/capture_cooking_pov_1795676769816.jpg',
      retail: '/images/capture_warehouse_pov_1795676771521.jpg',
      healthcare: '/images/capture_manufacturing_pov_1795676770652.jpg',
      office: '/images/capture_automotive_pov_1795676770764.jpg',
    };
    const catMeta = ACTIVITY_CATEGORIES.find((c) => c.slug === input.category);
    const annReq = input.annotationRequired ?? 'none';
    const criteriaList =
      input.acceptanceCriteria && input.acceptanceCriteria.length > 0
        ? input.acceptanceCriteria
        : [
            'Tangan & objek utama terlihat jelas 85%+ durasi.',
            'Unggah melalui sesi privat EgvoX.',
          ];
    const nextProject: ProjectListing = {
      id: `prj-cust-${Date.now().toString().slice(-4)}`,
      slug,
      title: input.title,
      titleEn: input.title,
      summary: input.summary,
      summaryEn: input.summary,
      category: input.category,
      categoryLabel: catMeta?.nameId || input.category,
      categoryLabelEn: catMeta?.nameEn || input.category,
      dataType: input.dataType,
      captureType:
        annReq === 'required'
          ? 'Video Capture + Annotation'
          : annReq === 'optional'
          ? 'Video Capture + Optional Annotation'
          : 'Video Capture',
      vendorSlug: 'pt-data-visual-indonesia',
      vendorName: 'PT Data Visual Indonesia',
      vendorVerified: true,
      vendorRating: 4.9,
      vendorReviewCount: 48,
      country: 'Indonesia',
      location: input.location,
      locationEn: input.location,
      targetVolume: input.targetVolume,
      unitLabel: 'jam',
      unitLabelEn: 'hour',
      ratePerUnit: input.ratePerUnit,
      showBudgetDisclosure: input.showBudgetDisclosure ?? true,
      currency: 'IDR',
      deadline: input.deadline?.trim() || '30 Des 2026',
      deadlineEn: input.deadline?.trim() || '30 Dec 2026',
      applicationCloseDate: input.applicationCloseDate?.trim() || '20 Des 2026',
      applicationCloseDateEn: input.applicationCloseDate?.trim() || '20 Dec 2026',
      annotationRequired: annReq,
      status: 'published',
      previewImage: imageMap[input.category],
      previewDuration: '0:30',
      captureSpec: {
        version: 'SPEC-CUSTOM-v1.0',
        perspective: input.perspective ?? 'Egocentric (First-Person)',
        mounting: input.mounting ?? 'Head-mounted',
        deviceRequirement:
          input.deviceRequirement?.trim() || 'Action Cam 1080p60 / Wearable Camera',
        deviceRequirementEn:
          input.deviceRequirement?.trim() || 'Action Cam 1080p60 / Wearable Camera',
        resolution: input.resolution ?? 'Minimum 1080p',
        frameRate: input.frameRate ?? '30–60 FPS',
        frameRateEn: input.frameRate ?? '30–60 FPS',
        codecFormat: input.codecFormat?.trim() || 'MP4 (H.264)',
        orientation: input.orientation ?? 'Landscape 16:9',
        clipDuration: input.clipDuration?.trim() || '15–45 menit per sesi',
        clipDurationEn: input.clipDuration?.trim() || '15–45 min per session',
        audioPolicy: input.audioPolicy ?? 'Optional',
        stabilization: 'EIS Aktif',
        stabilizationEn: 'Active EIS',
        gpsPolicy: 'Kota saja',
        gpsPolicyEn: 'City level only',
        consentPolicy:
          input.consentPolicy?.trim() || 'Wajib persetujuan kontributor & bebas PII',
        consentPolicyEn:
          input.consentPolicy?.trim() || 'Contributor consent mandatory & PII-free',
        privacyRedaction: 'Bebas PII',
        privacyRedactionEn: 'PII-free frame policy',
      },
      acceptanceCriteria: criteriaList,
      acceptanceCriteriaEn: criteriaList,
      rightsSummary:
        input.rightsSummary?.trim() || 'Lisensi komersial riset sesuai Work Order EgvoX.',
      rightsSummaryEn:
        input.rightsSummary?.trim() || 'Commercial R&D license per EgvoX Work Order.',
      milestones: [
        { step: 1, titleId: 'Uji Batch Awal', titleEn: 'Initial Pilot Batch', sharePercent: 30, dueLabel: 'Minggu 1', dueLabelEn: 'Week 1' },
        { step: 2, titleId: 'Penyelesaian Final & QA', titleEn: 'Final Delivery & QA', sharePercent: 70, dueLabel: 'Minggu 4', dueLabelEn: 'Week 4' },
      ],
      faq: [],
      faqEn: [],
    };
    setCustomProjects((prev) => [nextProject, ...prev]);
    showToast(
      locale === 'id'
        ? `Project "${input.title}" berhasil dipublikasikan (${
            annReq === 'required'
              ? 'Termasuk Wajib Anotasi'
              : annReq === 'optional'
              ? 'Raw + Anotasi Opsional'
              : 'Raw Video Only'
          }).`
        : `Project "${input.title}" published to Project Catalog.`
    );
  };

  const toggleServiceAvailability = (serviceId: string, title?: string) => {
    setPausedServiceIds((prev) => {
      const isPaused = prev.includes(serviceId);
      const next = isPaused
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];
      showToast(
        locale === 'id'
          ? isPaused
            ? `Profil kapabilitas "${title || serviceId}" diaktifkan kembali.`
            : `Profil kapabilitas "${title || serviceId}" dijeda sementara (Paused).`
          : isPaused
          ? `Capability profile "${title || serviceId}" re-activated.`
          : `Capability profile "${title || serviceId}" paused.`
      );
      return next;
    });
  };

  const createFreelancerService = (input: {
    title: string;
    roleType: FreelancerServiceListing['roleType'];
    location: string;
    description: string;
    categories?: ActivityCategorySlug[];
    capacityLabel?: string;
    deliverySla?: string;
    equipment?: string[];
    equipmentSummary?: string;
    resolutionFps?: string;
    annotationTools?: string[];
    supportedSchemas?: string[];
    tags?: string[];
    exclusions?: string[];
    terms?: string[];
    portfolioTitle?: string;
    portfolioImage?: string;
    conflictDisclosureDeclared?: boolean;
    conflictDisclosureText?: string;
  }) => {
    const categories: ActivityCategorySlug[] =
      input.categories && input.categories.length > 0
        ? input.categories
        : input.roleType === 'Data Annotator'
        ? ['cooking', 'manufacturing']
        : input.roleType === 'QA Specialist'
        ? ['manufacturing', 'warehouse']
        : ['cooking', 'household'];

    const equipmentList =
      input.equipment && input.equipment.length > 0
        ? input.equipment
        : input.equipmentSummary?.trim()
        ? [input.equipmentSummary.trim()]
        : input.roleType === 'Data Annotator'
        ? ['EgvoX Annotation Platform (v1)', 'CVAT & Dual-Monitor Workstation']
        : input.roleType === 'QA Specialist'
        ? ['Standar QA EgvoX v1.3 & Checklist Audit', 'FFmpeg / MediaInfo Inspector']
        : ['Action Cam 4K + Chest/Head Mount'];

    const defaultResolution =
      input.roleType === 'Data Annotator'
        ? 'Skema JSON, JSONL, COCO, CSV (Frame-Accurate)'
        : input.roleType === 'QA Specialist'
        ? 'Audit Teknis, Capture-Spec, Consent & Schema QA'
        : '1080p – 4K · 30–60 FPS · MP4 H.264/H.265';

    const defaultUnitLabel =
      input.roleType === 'Data Annotator'
        ? { id: 'jam teranotasi', en: 'annotated hour' }
        : input.roleType === 'QA Specialist'
        ? { id: 'batch', en: 'batch' }
        : { id: 'jam', en: 'hour' };

    const defaultCapacity =
      input.roleType === 'Data Annotator'
        ? locale === 'id'
          ? '± 40 jam video / minggu'
          : '± 40 video hours / week'
        : input.roleType === 'QA Specialist'
        ? locale === 'id'
          ? '25–35 batch / minggu'
          : '25–35 batches / week'
        : locale === 'id'
        ? '± 20 jam / minggu'
        : '± 20 hours / week';

    const defaultSla =
      input.roleType === 'Data Annotator'
        ? locale === 'id'
          ? 'Akurasi tinggi · 2–4 hari'
          : 'High accuracy · 2–4 days'
        : input.roleType === 'QA Specialist'
        ? locale === 'id'
          ? 'SLA Terjadwal (24–48 jam)'
          : 'Scheduled SLA (24–48h)'
        : locale === 'id'
        ? 'Sesuai Spesifikasi · 3–5 hari'
        : 'Per Spec · 3–5 business days';

    const defaultThumbnail =
      categories.includes('manufacturing')
        ? '/images/capture_manufacturing_pov_1795676770652.jpg'
        : categories.includes('warehouse')
        ? '/images/capture_warehouse_pov_1795676771521.jpg'
        : categories.includes('automotive')
        ? '/images/capture_automotive_pov_1795676770764.jpg'
        : '/images/capture_cooking_pov_1795676769816.jpg';

    const derivedTags =
      input.tags && input.tags.length > 0
        ? input.tags
        : Array.from(
            new Set([
              input.roleType,
              ...(input.supportedSchemas || []).slice(0, 2),
              ...categories
                .slice(0, 2)
                .map((c) => ACTIVITY_CATEGORIES.find((m) => m.slug === c)?.nameEn || c),
            ])
          );

    const exclusionsList =
      input.exclusions && input.exclusions.length > 0
        ? input.exclusions
        : input.roleType === 'Data Annotator'
        ? ['Hanya memproses media yang telah lolos tahap QA & Rights Gate di EgvoX.']
        : input.roleType === 'QA Specialist'
        ? ['Wajib bebas konflik kepentingan — tidak mengaudit output produksi sendiri.']
        : ['Tidak mencakup perekaman di area terlarang tanpa izin lokasi tertulis.'];

    const termsList =
      input.terms && input.terms.length > 0
        ? input.terms
        : input.roleType === 'Data Annotator'
        ? [
            'Konsistensi label >= 98% sesuai skema sebelum submission.',
            'Revisi minor skema tersedia dalam 48 jam.',
          ]
        : input.roleType === 'QA Specialist'
        ? [
            'Setiap penolakan disertai kode alasan terstruktur dan timestamp bukti.',
            'Mendukung partial acceptance per klip/batch.',
          ]
        : ['Semua file diunggah melalui Private Upload Session dengan checksum SHA-256.'];

    const nextService: FreelancerServiceListing = {
      id: `srv-cust-${Date.now().toString().slice(-4)}`,
      slug: `service-${Date.now().toString().slice(-4)}`,
      username: 'rizal-maulana',
      freelancerName: 'Rizal Maulana',
      avatar: '/images/avatar_contributor_male_1795676771682.jpg',
      verified: false,
      kycStatus: 'pending',
      available: true,
      roleType: input.roleType,
      levelBadge: 'Level Expert',
      rating: 4.9,
      reviewCount: 128,
      completedOrders: 128,
      slaPercent: 98,
      acceptanceRatePercent: 98,
      conflictDisclosureDeclared:
        input.roleType === 'QA Specialist' ? Boolean(input.conflictDisclosureDeclared ?? true) : undefined,
      conflictDisclosureText:
        input.roleType === 'QA Specialist'
          ? input.conflictDisclosureText?.trim() ||
            'Independen penuh: Tidak pernah mengaudit rekaman atau anotasi milik sendiri maupun tim produksi afiliasi.'
          : undefined,
      conflictDisclosureTextEn:
        input.roleType === 'QA Specialist'
          ? input.conflictDisclosureText?.trim() ||
            'Independent auditor: Never reviews own recordings, annotations, or affiliated capture teams.'
          : undefined,
      title: input.title,
      titleEn: input.title,
      description: input.description,
      descriptionEn: input.description,
      categories,
      tags: derivedTags,
      location: input.location,
      locationEn: input.location,
      country: 'Indonesia',
      capacityLabel: input.capacityLabel?.trim() || defaultCapacity,
      capacityLabelEn: input.capacityLabel?.trim() || defaultCapacity,
      deliverySla: input.deliverySla?.trim() || defaultSla,
      deliverySlaEn: input.deliverySla?.trim() || defaultSla,
      pricePerUnit: 0,
      unitLabel: defaultUnitLabel.id,
      unitLabelEn: defaultUnitLabel.en,
      currency: 'IDR',
      equipment: equipmentList,
      equipmentEn: equipmentList,
      resolutionFps: input.resolutionFps?.trim() || defaultResolution,
      resolutionFpsEn: input.resolutionFps?.trim() || defaultResolution,
      annotationTools: input.annotationTools,
      supportedSchemas: input.supportedSchemas,
      portfolioPreviews: [
        {
          id: `pf-custom-${Date.now().toString().slice(-3)}`,
          title:
            input.portfolioTitle?.trim() ||
            (input.roleType === 'Data Annotator'
              ? 'Sampel Anotasi Teranonimisasi (Berizin)'
              : input.roleType === 'QA Specialist'
              ? 'Sampel Laporan Audit QA (Terredaksi)'
              : 'Sampel Video Preview Berizin'),
          titleEn:
            input.portfolioTitle?.trim() ||
            (input.roleType === 'Data Annotator'
              ? 'Consented Anonymized Annotation Sample'
              : input.roleType === 'QA Specialist'
              ? 'Redacted QA Audit Report Sample'
              : 'Consented Preview Sample'),
          duration: '0:35',
          thumbnail: input.portfolioImage || defaultThumbnail,
          consentVerified: false,
          watermarked: true,
        },
      ],
      exclusions: exclusionsList,
      exclusionsEn: exclusionsList,
      terms: termsList,
      termsEn: termsList,
      reviews: [],
    };
    setCustomServices((prev) => [nextService, ...prev]);
    setAdminModerations((prev) => [
      {
        id: `mod-${Date.now().toString().slice(-4)}`,
        code: `SVC-${Date.now().toString().slice(-4)}`,
        titleId: input.title,
        titleEn: input.title,
        listingType: 'service',
        ownerName: 'Rizal Maulana',
        category: input.roleType,
        rateIDR: 0,
        status: 'pending',
        thumbnail: input.portfolioImage || defaultThumbnail,
        hasConsentEvidence: true,
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? `Profil kapabilitas ${input.roleType} "${input.title}" dikirim ke moderasi & katalog rekrutmen.`
        : `${input.roleType} capability profile "${input.title}" submitted to moderation & recruitment catalog.`
    );
  };

  const submitKyc = (docType: string) => {
    setKycStatus('pending_review');
    setAdminVerifications((prev) => [
      {
        id: `ver-${Date.now().toString().slice(-4)}`,
        entityName: 'Rizal Maulana',
        email: 'rizal@egvox.ai',
        roleType: 'Freelancer',
        documentType: docType,
        submittedAt: locale === 'id' ? 'Baru saja' : 'Just now',
        country: 'Indonesia',
        status: 'pending',
        riskTier: 'Standard',
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? `Dokumen KYC (${docType}) diunggah untuk verifikasi Trust & Safety.`
        : `KYC document (${docType}) uploaded for Trust & Safety verification.`
    );
  };

  // ================= DATA OPERATIONS HANDLERS =================
  const createOpsWorkPackage = (input: {
    nameId: string;
    clientName: string;
    totalPackages: number;
    specVersion: string;
    deadline: string;
  }) => {
    const code = `EGX-${Date.now().toString().slice(-4)}`;
    setOpsProjects((prev) => [
      {
        id: `op-${Date.now()}`,
        projectCode: code,
        nameId: input.nameId,
        nameEn: input.nameId,
        clientName: input.clientName,
        specVersion: input.specVersion,
        totalPackages: input.totalPackages,
        completedPackages: 0,
        progressPercent: 0,
        stage: 'collection',
        slaPercent: 100,
        deadline: input.deadline,
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? `Work Package ${code} (${input.nameId}) berhasil dibuat.`
        : `Work Package ${code} (${input.nameId}) created.`
    );
  };

  const createOpsUploadSession = (
    projectCode: string,
    fileName: string,
    sizeLabel: string
  ) => {
    const sessionCode = `UP-2026-${Date.now().toString().slice(-4)}`;
    const newSession: OpsUploadSession = {
      id: `ups-${Date.now()}`,
      sessionCode,
      projectCode,
      uploaderName: 'Rizal Maulana',
      uploadedFiles: 1,
      totalFiles: 1,
      uploadedSizeGb: 0.4,
      totalSizeGb: 0.4,
      progressPercent: 100,
      status: 'quarantine',
      startedAt: locale === 'id' ? 'Baru saja' : 'Just now',
    };
    setOpsUploadSessions((prev) => [newSession, ...prev]);
    const newQ: OpsQuarantineItem = {
      id: `qr-${Date.now()}`,
      fileName,
      projectCode,
      sessionCode,
      resolution: '1080p',
      duration: '00:42',
      codec: 'H.264',
      fps: 60,
      sizeLabel,
      sha256: `sha256_${Date.now().toString(16)}a89f02b4c1`,
      uploader: 'Rizal Maulana',
      status: 'quarantine',
      techChecks: {
        formatOk: true,
        resolutionOk: true,
        fpsOk: true,
        durationOk: true,
        codecOk: true,
        checksumOk: true,
      },
      contentChecks: {
        matchesSpec: true,
        piiFree: true,
        consentValid: true,
      },
      thumbnail: '/images/capture_cooking_pov_1795676769816.jpg',
    };
    setOpsQuarantineItems((prev) => [newQ, ...prev]);
    setSubmissionFiles((prev) => [
      {
        id: `sub-${Date.now()}`,
        workOrderId: 'wo-1',
        fileName,
        durationLabel: '00:42',
        durationLabelEn: '00:42',
        sizeLabel,
        checksumSha256: newQ.sha256,
        status: 'quarantine',
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? `File ${fileName} masuk karantina privat (${sessionCode}) dengan checksum SHA-256.`
        : `File ${fileName} entered private quarantine (${sessionCode}) with SHA-256 checksum.`
    );
  };

  const updateQuarantineDecision = (
    itemId: string,
    nextStatus: OpsQuarantineItem['status'],
    reasonCode?: string
  ) => {
    setOpsQuarantineItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: nextStatus,
              reasonCode: reasonCode ?? item.reasonCode,
            }
          : item
      )
    );
    showToast(
      locale === 'id'
        ? `Status media diperbarui menjadi: ${nextStatus}.`
        : `Media item status updated to: ${nextStatus}.`
    );
  };

  const updateAnnotationProjectStatus = (
    projectId: string,
    status: OpsAnnotationProject['status'],
    progressPercent?: number
  ) => {
    setOpsAnnotationProjects((prev) =>
      prev.map((ap) =>
        ap.id === projectId
          ? {
              ...ap,
              status,
              progressPercent: progressPercent ?? ap.progressPercent,
              completedTasks:
                status === 'finalized' ? ap.taskCount : ap.completedTasks,
            }
          : ap
      )
    );
  };

  const dispatchDeliveryPackage = (pkgId: string) => {
    setOpsDeliveryPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === pkgId ? { ...pkg, status: 'delivered', qaValidated: true } : pkg
      )
    );
    showToast(
      locale === 'id'
        ? 'Paket dataset terenkripsi & Rights Manifest berhasil dikirim ke pembeli.'
        : 'Encrypted dataset package & Rights Manifest delivered to buyer.'
    );
  };

  // ================= SUPER ADMIN HANDLERS =================
  const appendAuditLog = (
    activity: string,
    target: string,
    actorCode = 'SA-001',
    actorRole = 'Super Admin',
    isBreakGlass = false
  ) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setAdminAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `${hh}:${mm}`,
        actorCode,
        actorRole,
        activity,
        target,
        ipAddress: '103.24.***.12',
        isBreakGlass,
      },
      ...prev,
    ]);
  };

  const decideVerification = (
    id: string,
    status: AdminVerificationCase['status']
  ) => {
    const target = adminVerifications.find((v) => v.id === id);
    setAdminVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
    appendAuditLog(
      locale === 'id'
        ? `Verifikasi ${target?.entityName || id} -> ${status}`
        : `Verification ${target?.entityName || id} -> ${status}`,
      target?.email || id,
      'SA-001',
      'Trust & Safety'
    );
    showToast(
      locale === 'id'
        ? `Status verifikasi ${target?.entityName || ''} diperbarui ke ${status}.`
        : `Verification status updated to ${status}.`
    );
  };

  const decideModeration = (
    id: string,
    status: AdminModerationListing['status'],
    note?: string
  ) => {
    const target = adminModerations.find((m) => m.id === id);
    setAdminModerations((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    appendAuditLog(
      locale === 'id'
        ? `Moderasi listing ${target?.code || id}: ${status}${note ? ` (${note})` : ''}`
        : `Listing moderation ${target?.code || id}: ${status}${note ? ` (${note})` : ''}`,
      target?.code || id,
      'SA-001',
      locale === 'id' ? 'Admin Operasional' : 'Ops Admin'
    );
    showToast(
      locale === 'id'
        ? `Listing ${target?.code || ''} berstatus ${status}.`
        : `Listing ${target?.code || ''} marked as ${status}.`
    );
  };

  const advanceEnterpriseDeal = (
    id: string,
    stage: AdminEnterpriseDeal['stage']
  ) => {
    const deal = adminEnterpriseDeals.find((d) => d.id === id);
    const officialProjectCode =
      stage === 'managed' && !deal?.officialProjectCode
        ? `ENT-202611-${Date.now().toString().slice(-4)}`
        : deal?.officialProjectCode;
    setAdminEnterpriseDeals((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, stage, officialProjectCode } : d
      )
    );
    if (stage === 'managed' && deal) {
      setOpsProjects((prev) => [
        {
          id: `op-${Date.now()}`,
          projectCode: officialProjectCode || 'ENT-NEW',
          nameId: `${deal.companyName} (Managed)`,
          nameEn: `${deal.companyName} (Managed)`,
          clientName: deal.companyName,
          specVersion: 'ENT-SPEC-v1.0',
          totalPackages: 24,
          completedPackages: 0,
          progressPercent: 10,
          stage: 'collection',
          slaPercent: 100,
          deadline: locale === 'id' ? '28 Des 2026' : 'Dec 28, 2026',
        },
        ...prev,
      ]);
    }
    appendAuditLog(
      `Enterprise deal ${deal?.companyName || id} -> ${stage}`,
      officialProjectCode || id,
      'SA-001',
      'Enterprise CRM'
    );
    showToast(
      locale === 'id'
        ? `Pipeline Enterprise ${deal?.companyName || ''} berlanjut ke tahap ${stage}.`
        : `Enterprise deal moved to ${stage}.`
    );
  };

  const approveFinanceRecord = (id: string) => {
    const rec = adminFinanceRecords.find((f) => f.id === id);
    setAdminFinanceRecords((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'approved' } : f))
    );
    setPayoutHistory((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'settled' } : p))
    );
    appendAuditLog(
      locale === 'id'
        ? `Dual-approval keuangan ${rec?.code || id} disetujui`
        : `Finance dual-approval ${rec?.code || id} approved`,
      rec?.code || id,
      'FIN-001',
      'Finance Operator'
    );
    showToast(
      locale === 'id'
        ? `${rec?.code || 'Transaksi'} disetujui dan diposting ke ledger.`
        : `${rec?.code || 'Record'} approved and posted to ledger.`
    );
  };

  const updateRightsStatus = (
    id: string,
    status: AdminRightsRecord['status']
  ) => {
    const rec = adminRightsRecords.find((r) => r.id === id);
    setAdminRightsRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    appendAuditLog(
      locale === 'id'
        ? `Status Data Rights ${rec?.code || id} -> ${status}`
        : `Data Rights status ${rec?.code || id} -> ${status}`,
      rec?.code || id,
      'CMP-001',
      'Compliance Officer'
    );
    showToast(
      locale === 'id'
        ? `Hak data ${rec?.code || ''} diperbarui ke ${status}.`
        : `Rights record ${rec?.code || ''} updated to ${status}.`
    );
  };

  const resolveDisputeCase = (
    id: string,
    status: AdminDisputeCase['status'],
    rationale: string
  ) => {
    const dis = adminDisputes.find((d) => d.id === id);
    setAdminDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, rationale } : d))
    );
    appendAuditLog(
      locale === 'id'
        ? `Sengketa ${dis?.code || id} -> ${status}`
        : `Dispute ${dis?.code || id} -> ${status}`,
      dis?.workOrderCode || id,
      'SA-001',
      'Trust & Safety'
    );
    showToast(
      locale === 'id'
        ? `Sengketa ${dis?.code || ''} diperbarui ke status ${status}.`
        : `Dispute ${dis?.code || ''} updated to ${status}.`
    );
  };

  const updateRbacRolePermissions = (roleId: string, permissions: string[]) => {
    const target = adminRbacRoles.find((r) => r.id === roleId);
    setAdminRbacRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
    );
    appendAuditLog(
      locale === 'id'
        ? `RBAC permissions diperbarui untuk ${target?.name || roleId}`
        : `RBAC permissions updated for ${target?.name || roleId}`,
      roleId,
      'SA-001',
      'Super Admin'
    );
    showToast(
      locale === 'id'
        ? `Hak akses RBAC untuk ${target?.name || roleId} berhasil diperbarui.`
        : `RBAC permissions updated for ${target?.name || roleId}.`
    );
  };

  return (
    <AppStateContext.Provider
      value={{
        locale,
        setLocale,
        theme,
        toggleTheme,
        activeRole,
        setActiveRole,
        savedSlugs,
        toggleSaved,
        proposals,
        submitProposal,
        withdrawProposal,
        inquiries,
        submitEnterpriseInquiry,
        workOrders,
        acknowledgedOrderIds,
        acknowledgeOrderSpec,
        recordMilestoneFunding,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        notificationsModalOpen,
        setNotificationsModalOpen,
        submissionFiles,
        submitReworkOrDispute,
        offers,
        respondOffer,
        recruiterWallet,
        topUpHistory,
        submitWalletTopUp,
        settlePendingTopUp,
        topUpModalOpen,
        setTopUpModalOpen,
        recruitmentOffers,
        createRecruitmentOffer,
        respondRecruitmentOffer,
        clarifications,
        submitClarification,
        resolveClarification,
        recruitModalTarget,
        openRecruitModal: setRecruitModalTarget,
        availableBalance,
        payoutHistory,
        requestPayout,
        reviews,
        submitOrderReview,
        customProjects,
        createVendorProject,
        customServices,
        pausedServiceIds,
        toggleServiceAvailability,
        createFreelancerService,
        kycStatus,
        submitKyc,
        toastMessage,
        showToast,
        proposalModalProject,
        openProposalModal: setProposalModalProject,
        reportListingModal,
        openReportModal: setReportListingModal,
        opsProjects,
        createOpsWorkPackage,
        opsUploadSessions,
        opsQuarantineItems,
        opsAnnotationProjects,
        opsDeliveryPackages,
        acceptedEnterpriseDeliveries,
        acceptEnterpriseDelivery,
        createOpsUploadSession,
        updateQuarantineDecision,
        updateAnnotationProjectStatus,
        dispatchDeliveryPackage,
        adminVerifications,
        decideVerification,
        adminModerations,
        decideModeration,
        adminEnterpriseDeals,
        advanceEnterpriseDeal,
        adminFinanceRecords,
        approveFinanceRecord,
        adminRightsRecords,
        updateRightsStatus,
        adminDisputes,
        resolveDisputeCase,
        adminAuditLogs,
        appendAuditLog,
        adminRbacRoles,
        updateRbacRolePermissions,
      }}
    >
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-5 right-4 z-[60] max-w-sm rounded-xl border border-[#027F86]/30 bg-[#102326] px-4 py-3 text-xs font-medium text-white shadow-xl"
        >
          {toastMessage}
        </div>
      )}
    </AppStateContext.Provider>
  );
};

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return ctx;
}
