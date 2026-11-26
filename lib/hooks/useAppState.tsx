'use client';

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import {
  ActiveWorkOrder,
  CartOrderItem,
  FreelancerServiceListing,
  Locale,
  NegotiationOffer,
  OrderReviewRecord,
  PayoutRequestRecord,
  ProjectListing,
  PublicUserRole,
  SavedProposal,
  SubmissionFileItem,
  WorkspaceConversation,
  WorkspaceNotification,
} from '@/packages/shared-types';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OFFERS,
  INITIAL_PAYOUT_HISTORY,
  INITIAL_REVIEWS,
  INITIAL_SUBMISSION_FILES,
  INITIAL_WORK_ORDERS,
} from '@/lib/catalog-data';

interface EnterpriseInquiryRecord {
  id: string;
  companyName: string;
  country: string;
  businessEmail: string;
  contactPerson: string;
  estimatedVolume: string;
  requirementSummary: string;
  status: 'submitted';
  createdAt: string;
}

export interface ReportListingTarget {
  type: 'project' | 'service';
  slug: string;
  title: string;
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
  cartItems: CartOrderItem[];
  addToCart: (item: CartOrderItem) => void;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  proposals: SavedProposal[];
  submitProposal: (p: Omit<SavedProposal, 'id' | 'status' | 'createdAt'>) => void;
  inquiries: EnterpriseInquiryRecord[];
  submitEnterpriseInquiry: (
    inq: Omit<EnterpriseInquiryRecord, 'id' | 'status' | 'createdAt'>
  ) => void;
  workOrders: ActiveWorkOrder[];
  notifications: WorkspaceNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  notificationsModalOpen: boolean;
  setNotificationsModalOpen: (open: boolean) => void;
  conversations: WorkspaceConversation[];
  sendMessage: (conversationId: string, text: string) => void;
  submissionFiles: SubmissionFileItem[];
  submitReworkOrDispute: (fileId: string, note: string, mode: 'rework' | 'appeal') => void;
  offers: NegotiationOffer[];
  respondOffer: (
    offerId: string,
    decision: 'accepted' | 'rejected' | 'countered',
    counterRate?: number,
    note?: string
  ) => void;
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
    location: string;
    summary: string;
  }) => void;
  customServices: FreelancerServiceListing[];
  createFreelancerService: (input: {
    title: string;
    roleType: FreelancerServiceListing['roleType'];
    pricePerUnit: number;
    location: string;
    description: string;
  }) => void;
  kycStatus: 'verified' | 'pending_review';
  submitKyc: (docType: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  proposalModalProject: ProjectListing | null;
  openProposalModal: (project: ProjectListing | null) => void;
  serviceOrderModal: FreelancerServiceListing | null;
  openServiceOrderModal: (service: FreelancerServiceListing | null) => void;
  reportListingModal: ReportListingTarget | null;
  openReportModal: (target: ReportListingTarget | null) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
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
  const [cartItems, setCartItems] = useState<CartOrderItem[]>([
    {
      id: 'srv-001',
      kind: 'service_order',
      title: 'Jasa Pengambilan Video Aktivitas Memasak & Dapur (Egocentric)',
      titleEn: 'Egocentric Cooking & Kitchen Video Capture Service',
      subtitle: 'Rizal Maulana · 5 jam awal',
      subtitleEn: 'Rizal Maulana · 5 initial hours',
      unitPrice: 150000,
      quantity: 5,
      unitLabel: 'jam',
      unitLabelEn: 'hour',
      thumbnail: '/images/capture_cooking_pov_1795676769816.jpg',
    },
    {
      id: 'srv-002',
      kind: 'annotation_addon',
      title: 'Opsional: Anotasi Bounding Box & Temporal Action',
      titleEn: 'Optional: Bounding Box & Temporal Action Annotation',
      subtitle: 'Salsa Fitriani · 3 jam teranotasi',
      subtitleEn: 'Salsa Fitriani · 3 annotated hours',
      unitPrice: 180000,
      quantity: 3,
      unitLabel: 'jam',
      unitLabelEn: 'hour',
      thumbnail: '/images/capture_manufacturing_pov_1795676770652.jpg',
    },
  ]);
  const [proposals, setProposals] = useState<SavedProposal[]>([
    {
      id: 'prop-101',
      projectSlug: 'dataset-memasak-egocentric-cooking',
      projectTitle: 'Dataset Memasak (Egocentric Cooking)',
      projectTitleEn: 'Egocentric Cooking & Kitchen Activity Dataset',
      vendorName: 'PT Data Visual Indonesia',
      volume: 25,
      estimatedTotal: 3750000,
      note: 'Siap mengerjakan dengan GoPro Hero 12 head-mounted 1080p60 sesuai SPEC-COOK-v2.1.',
      noteEn: 'Ready to deliver with head-mounted GoPro Hero 12 at 1080p60 per SPEC-COOK-v2.1.',
      attachmentName: 'Portofolio_Dapur_Rizal.pdf',
      status: 'under_review',
      createdAt: '20 Nov 2026',
      createdAtEn: '20 Nov 2026',
    },
  ]);
  const [inquiries, setInquiries] = useState<EnterpriseInquiryRecord[]>([]);
  const [workOrders] = useState<ActiveWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [conversations, setConversations] = useState<WorkspaceConversation[]>(
    INITIAL_CONVERSATIONS
  );
  const [submissionFiles, setSubmissionFiles] = useState<SubmissionFileItem[]>(
    INITIAL_SUBMISSION_FILES
  );
  const [offers, setOffers] = useState<NegotiationOffer[]>(INITIAL_OFFERS);
  const [availableBalance, setAvailableBalance] = useState<number>(2450000);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRequestRecord[]>(
    INITIAL_PAYOUT_HISTORY
  );
  const [reviews, setReviews] = useState<OrderReviewRecord[]>(INITIAL_REVIEWS);
  const [customProjects, setCustomProjects] = useState<ProjectListing[]>([]);
  const [customServices, setCustomServices] = useState<FreelancerServiceListing[]>([]);
  const [kycStatus, setKycStatus] = useState<'verified' | 'pending_review'>('verified');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [proposalModalProject, setProposalModalProject] =
    useState<ProjectListing | null>(null);
  const [serviceOrderModal, setServiceOrderModal] =
    useState<FreelancerServiceListing | null>(null);
  const [reportListingModal, setReportListingModal] =
    useState<ReportListingTarget | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

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

  const addToCart = (item: CartOrderItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
    showToast(
      locale === 'id'
        ? `${item.title} ditambahkan ke keranjang Work Order.`
        : `${item.titleEn || item.title} added to Work Order cart.`
    );
  };

  const updateCartQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

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
        ? 'Proposal berhasil dikirim dan berstatus Submitted.'
        : 'Proposal submitted successfully (status: submitted).'
    );
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
    setInquiries((prev) => [next, ...prev]);
    showToast(
      locale === 'id'
        ? 'Permintaan kemitraan Enterprise tercatat (status: submitted). Tim kami akan menghubungi Anda.'
        : 'Enterprise partnership inquiry recorded (status: submitted). Our team will reach out.'
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

  const sendMessage = (conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          unread: 0,
          messages: [
            ...conv.messages,
            {
              id: `msg-${Date.now()}`,
              sender: locale === 'id' ? 'Anda' : 'You',
              senderRole: 'freelancer',
              text: trimmed,
              timestamp: locale === 'id' ? 'Baru saja' : 'Just now',
              isOwn: true,
            },
          ],
        };
      })
    );
    showToast(
      locale === 'id'
        ? 'Pesan terkirim melalui sistem messaging aman EgvoX.'
        : 'Message sent securely via EgvoX Messaging.'
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
    setPayoutHistory((prev) => [
      {
        id: `pay-${Date.now().toString().slice(-4)}`,
        amount,
        destination,
        status: 'pending_review',
        createdAt: locale === 'id' ? 'Hari ini' : 'Today',
      },
      ...prev,
    ]);
    showToast(
      locale === 'id'
        ? 'Permintaan penarikan dana berhasil dibuat dan sedang diproses.'
        : 'Payout withdrawal request submitted and queued for settlement.'
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
    location: string;
    summary: string;
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
    const nextProject: ProjectListing = {
      id: `prj-cust-${Date.now().toString().slice(-4)}`,
      slug,
      title: input.title,
      titleEn: input.title,
      summary: input.summary,
      summaryEn: input.summary,
      category: input.category,
      categoryLabel: input.category.charAt(0).toUpperCase() + input.category.slice(1),
      categoryLabelEn: input.category.charAt(0).toUpperCase() + input.category.slice(1),
      dataType: input.dataType,
      captureType: 'Video Capture',
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
      currency: 'IDR',
      deadline: '30 Des 2026',
      deadlineEn: '30 Dec 2026',
      applicationCloseDate: '20 Des 2026',
      applicationCloseDateEn: '20 Dec 2026',
      annotationRequired: 'optional',
      status: 'published',
      previewImage: imageMap[input.category],
      previewDuration: '0:30',
      captureSpec: {
        version: 'SPEC-CUSTOM-v1.0',
        perspective: 'Egocentric (First-Person)',
        mounting: 'Head-mounted',
        deviceRequirement: 'Action Cam 1080p60 / Wearable Camera',
        deviceRequirementEn: 'Action Cam 1080p60 / Wearable Camera',
        resolution: 'Minimum 1080p',
        frameRate: '30–60 FPS',
        frameRateEn: '30–60 FPS',
        codecFormat: 'MP4 (H.264)',
        orientation: 'Landscape 16:9',
        clipDuration: '15–45 menit per sesi',
        clipDurationEn: '15–45 min per session',
        audioPolicy: 'Optional',
        stabilization: 'EIS Aktif',
        stabilizationEn: 'Active EIS',
        gpsPolicy: 'Kota saja',
        gpsPolicyEn: 'City level only',
        consentPolicy: 'Wajib persetujuan kontributor',
        consentPolicyEn: 'Contributor consent required',
        privacyRedaction: 'Bebas PII',
        privacyRedactionEn: 'PII-free frame policy',
      },
      acceptanceCriteria: [
        'Tangan & objek utama terlihat jelas 85%+ durasi.',
        'Unggah melalui sesi privat EgvoX.',
      ],
      acceptanceCriteriaEn: [
        'Hands and target objects clearly visible 85%+ of duration.',
        'Submitted via private EgvoX upload session.',
      ],
      rightsSummary: 'Lisensi komersial riset sesuai Work Order EgvoX.',
      rightsSummaryEn: 'Commercial R&D license per EgvoX Work Order.',
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
        ? `Project "${input.title}" berhasil dibuat dan dipublikasikan ke Project Catalog.`
        : `Project "${input.title}" published to Project Catalog.`
    );
  };

  const createFreelancerService = (input: {
    title: string;
    roleType: FreelancerServiceListing['roleType'];
    pricePerUnit: number;
    location: string;
    description: string;
  }) => {
    const nextService: FreelancerServiceListing = {
      id: `srv-cust-${Date.now().toString().slice(-4)}`,
      slug: `service-${Date.now().toString().slice(-4)}`,
      username: 'rizal-maulana',
      freelancerName: 'Rizal Maulana',
      avatar: '/images/avatar_contributor_male_1795676771682.jpg',
      verified: true,
      kycStatus: 'verified',
      available: true,
      roleType: input.roleType,
      levelBadge: 'Level Expert',
      rating: 4.9,
      reviewCount: 128,
      completedOrders: 128,
      slaPercent: 98,
      title: input.title,
      titleEn: input.title,
      description: input.description,
      descriptionEn: input.description,
      categories: ['cooking', 'household'],
      tags: [input.roleType, 'Per Jam'],
      location: input.location,
      locationEn: input.location,
      country: 'Indonesia',
      capacityLabel: '20–30 jam / minggu',
      capacityLabelEn: '20–30 hours / week',
      deliverySla: '3–5 hari kerja',
      deliverySlaEn: '3–5 business days',
      pricePerUnit: input.pricePerUnit,
      unitLabel: 'jam',
      unitLabelEn: 'hour',
      currency: 'IDR',
      equipment: ['Action Camera 1080p60 + Chest/Head Mount'],
      equipmentEn: ['Action Camera 1080p60 + Chest/Head Mount'],
      resolutionFps: '1080p – 4K · 60 FPS',
      portfolioPreviews: [
        {
          id: 'pf-custom',
          title: 'Sampel Berizin',
          titleEn: 'Consented Preview',
          duration: '0:35',
          thumbnail: '/images/capture_cooking_pov_1795676769816.jpg',
          consentVerified: true,
          watermarked: true,
        },
      ],
      exclusions: ['Tidak mencakup perekaman di area terlarang tanpa izin.'],
      exclusionsEn: ['Excludes restricted venues without written permission.'],
      terms: ['Upload melalui sesi privat SHA-256.'],
      termsEn: ['Delivered via private SHA-256 upload session.'],
      reviews: [],
    };
    setCustomServices((prev) => [nextService, ...prev]);
    showToast(
      locale === 'id'
        ? `Listing jasa "${input.title}" dikirim dan aktif di katalog.`
        : `Service listing "${input.title}" is now live in the catalog.`
    );
  };

  const submitKyc = (docType: string) => {
    setKycStatus('pending_review');
    showToast(
      locale === 'id'
        ? `Dokumen KYC (${docType}) diunggah untuk verifikasi Trust & Safety.`
        : `KYC document (${docType}) uploaded for Trust & Safety verification.`
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
        cartItems,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        proposals,
        submitProposal,
        inquiries,
        submitEnterpriseInquiry,
        workOrders,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        notificationsModalOpen,
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
        toastMessage,
        showToast,
        proposalModalProject,
        openProposalModal: setProposalModalProject,
        serviceOrderModal,
        openServiceOrderModal: setServiceOrderModal,
        reportListingModal,
        openReportModal: setReportListingModal,
        cartDrawerOpen,
        setCartDrawerOpen,
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
