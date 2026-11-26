import { Locale } from '@/packages/shared-types';

export interface EgvoXDictionary {
  nav: {
    platform: string;
    howItWorks: string;
    marketplace: string;
    forContributors: string;
    forVendors: string;
    enterprise: string;
    resources: string;
    signIn: string;
    joinEgvox: string;
    openWorkspace: string;
    projects: string;
    services: string;
    explore: string;
    corporateSite: string;
    notifications: string;
    wallet: string;
  };
  landing: {
    kicker: string;
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    ctaExploreMarketplace: string;
    ctaStartNow: string;
    ctaBecomeContributor: string;
    ctaBecomeVendor: string;
    ctaEnterpriseQuote: string;
    whatIsTitle: string;
    whatIsSubtitle: string;
    benefitsTitle: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    systemTitle: string;
    catalogPreviewTitle: string;
    catalogPreviewSubtitle: string;
    moreProjects: string;
    moreFreelancers: string;
    annotationShowcaseTitle: string;
    annotationShowcaseSubtitle: string;
    supportedAnnotationTitle: string;
    ecosystemTitle: string;
    industriesTitle: string;
    privacyCaptureTitle: string;
    privacyCaptureSubtitle: string;
    trustTitle: string;
    enterpriseFormTitle: string;
    enterpriseFormSubtitle: string;
    faqTitle: string;
  };
  marketplace: {
    kicker: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    projectCatalogTitle: string;
    projectCatalogDesc: string;
    serviceCatalogTitle: string;
    serviceCatalogDesc: string;
    browseCategories: string;
    allCategories: string;
    featuredProjects: string;
    featuredFreelancers: string;
    viewAll: string;
    applyProposal: string;
    requestOrder: string;
    askVendor: string;
    filters: string;
    resetFilters: string;
    applyFilters: string;
  };
}

export const dictionaries: Record<Locale, EgvoXDictionary> = {
  id: {
    nav: {
      platform: 'Platform',
      howItWorks: 'Cara Kerja',
      marketplace: 'Marketplace',
      forContributors: 'Kontributor',
      forVendors: 'Vendor',
      enterprise: 'Enterprise',
      resources: 'Bantuan',
      signIn: 'Masuk',
      joinEgvox: 'Daftar',
      openWorkspace: 'Workspace',
      projects: 'Katalog Project',
      services: 'Katalog Freelancer',
      explore: 'Beranda',
      corporateSite: 'Halaman Corporate',
      notifications: 'Notifikasi',
      wallet: 'Dompet Rekruter',
    },
    landing: {
      kicker: 'Jaringan Data Pengalaman Manusia & Operasi Dataset Terkelola',
      heroTitle: 'Jaringan Data Video Egocentric & Operasi Dataset Terkelola untuk',
      heroHighlight: 'Pengembangan AI & Robotika',
      heroSubtitle:
        'EgvoX menghubungkan kontributor video sudut pandang pertama (egocentric), data annotator, spesialis QA independen, penyedia data, dan tim enterprise untuk mengumpulkan, memvalidasi, serta mengirimkan dataset terstruktur siap pakai.',
      ctaExploreMarketplace: 'Jelajahi Marketplace',
      ctaStartNow: 'Mulai Sekarang',
      ctaBecomeContributor: 'Jadi Kontributor',
      ctaBecomeVendor: 'Daftar Data Provider',
      ctaEnterpriseQuote: 'Ajukan Kemitraan Enterprise',
      whatIsTitle: 'Apa itu EgvoX?',
      whatIsSubtitle:
        'Platform marketplace rekrutmen talenta data dan operasi produksi terkelola untuk perekaman video sudut pandang pertama (egocentric), anotasi manusia terstandar, QA independen, dan pengiriman dataset siap pakai.',
      benefitsTitle: 'Manfaat & Keunggulan Ekosistem',
      howItWorksTitle: 'Bagaimana Cara Kerja EgvoX?',
      howItWorksSubtitle:
        'Tiga alur rekrutmen dan produksi terstruktur: Vendor Project Catalog, Rekrutmen Freelancer Privat, dan Enterprise Managed Data Project.',
      systemTitle: 'Enam Pilar Sistem EgvoX',
      catalogPreviewTitle: 'Katalog Marketplace EgvoX',
      catalogPreviewSubtitle:
        'Jelajahi proyek pengumpulan dataset aktif dan profil kapabilitas kontributor, annotator, serta QA specialist terverifikasi.',
      moreProjects: 'Lihat Semua Proyek',
      moreFreelancers: 'Lihat Semua Freelancer',
      annotationShowcaseTitle: 'Contoh Data Annotation per Kategori Platform',
      annotationShowcaseSubtitle:
        'Berbagai standar perekaman egocentric dan jenis anotasi manusia untuk membangun dataset berkualitas di tiap industri.',
      supportedAnnotationTitle: 'Jenis Anotasi yang Didukung',
      ecosystemTitle: 'Ekosistem EgvoX',
      industriesTitle: 'Solusi untuk Berbagai Industri',
      privacyCaptureTitle: 'Standar Perekaman Video & Perlindungan Data Pribadi',
      privacyCaptureSubtitle:
        'Setiap video mentah melewati penyaringan privasi ketat, pemotongan segmen non-relevan, dan verifikasi durasi aktif oleh tim EgvoX sesuai standar industri AI global.',
      trustTitle: 'Kepercayaan, Hak Data & Kualitas Terverifikasi',
      enterpriseFormTitle: 'Permintaan Kemitraan Enterprise',
      enterpriseFormSubtitle:
        'Formulir ini membuat permintaan resmi berstatus submitted untuk proses discovery dan proposal tim EgvoX — bukan kontrak atau order otomatis.',
      faqTitle: 'Pertanyaan yang Sering Diajukan',
    },
    marketplace: {
      kicker: 'Marketplace Resmi EgvoX',
      heroTitle: 'Marketplace Data & Rekrutmen Talenta Terstruktur',
      heroSubtitle:
        'Temukan proyek pengumpulan dataset, rekrut Video Contributor, Data Annotator, dan QA Specialist terverifikasi melalui penawaran privat, atau kelola Work Order dalam satu workspace.',
      searchPlaceholder: 'Cari project, keahlian, kamera, tools QA, atau kategori aktivitas...',
      searchButton: 'Cari',
      projectCatalogTitle: 'Project Catalog',
      projectCatalogDesc: 'Proyek pengumpulan dataset dari vendor terverifikasi untuk pengajuan minat kualifikasi',
      serviceCatalogTitle: 'Katalog Freelancer',
      serviceCatalogDesc: 'Video Contributor, Data Annotator & QA Specialist — rekrutmen privat terstruktur',
      browseCategories: 'Jelajahi Kategori Aktivitas',
      allCategories: 'Semua Kategori',
      featuredProjects: 'Project Unggulan',
      featuredFreelancers: 'Talenta Freelancer Unggulan',
      viewAll: 'Lihat Semua',
      applyProposal: 'Ajukan Minat',
      requestOrder: 'Rekrut',
      askVendor: 'Klarifikasi Proyek',
      filters: 'Filter',
      resetFilters: 'Reset',
      applyFilters: 'Terapkan',
    },
  },
  en: {
    nav: {
      platform: 'Platform',
      howItWorks: 'How It Works',
      marketplace: 'Marketplace',
      forContributors: 'Contributors',
      forVendors: 'Providers',
      enterprise: 'Enterprise',
      resources: 'Resources',
      signIn: 'Sign In',
      joinEgvox: 'Join EgvoX',
      openWorkspace: 'Workspace',
      projects: 'Project Catalog',
      services: 'Freelancer Catalog',
      explore: 'Explore',
      corporateSite: 'Corporate Site',
      notifications: 'Notifications',
      wallet: 'Recruiter Wallet',
    },
    landing: {
      kicker: 'Human-Experience Data Network & Managed Operations',
      heroTitle: 'The Human Experience Data Network for',
      heroHighlight: 'AI & Robotics',
      heroSubtitle:
        'Connect with verified egocentric video contributors, data annotators, QA specialists, dataset providers, and managed operations to collect, validate, and deliver structured human-experience datasets.',
      ctaExploreMarketplace: 'Explore Marketplace',
      ctaStartNow: 'Get Started',
      ctaBecomeContributor: 'Become a Contributor',
      ctaBecomeVendor: 'Become a Data Provider',
      ctaEnterpriseQuote: 'Partner with EgvoX',
      whatIsTitle: 'What is EgvoX?',
      whatIsSubtitle:
        'A recruitment-based B2B marketplace and managed data operations platform built for first-person egocentric video capture, human annotation, independent QA, and rights-governed dataset delivery.',
      benefitsTitle: 'Benefits Across Every Persona',
      howItWorksTitle: 'How EgvoX Works',
      howItWorksSubtitle:
        'Three structured recruitment & production workflows: Vendor Project Catalog, Private Freelancer Recruitment, and Enterprise Managed Data Projects.',
      systemTitle: 'The Six-Part EgvoX System',
      catalogPreviewTitle: 'EgvoX Marketplace Preview',
      catalogPreviewSubtitle:
        'Browse active vendor collection projects alongside verified video contributor, annotator, and QA specialist capability profiles.',
      moreProjects: 'More Projects',
      moreFreelancers: 'More Freelancers',
      annotationShowcaseTitle: 'Data Annotation Examples by Platform Category',
      annotationShowcaseSubtitle:
        'Human-verified annotation schemas paired with versioned egocentric capture standards across every category.',
      supportedAnnotationTitle: 'Supported Annotation Types',
      ecosystemTitle: 'EgvoX Ecosystem',
      industriesTitle: 'Industry Solutions',
      privacyCaptureTitle: 'Capture Guidelines & Personal Data Protection',
      privacyCaptureSubtitle:
        'Every raw recording undergoes strict privacy sanitization, face-frame trimming, and objective active-hour verification by EgvoX Operations in line with global AI industry standards.',
      trustTitle: 'Trust, Rights Governance & Quality Assurance',
      enterpriseFormTitle: 'Enterprise Partnership Request',
      enterpriseFormSubtitle:
        'Submitting this form creates an official discovery request in submitted status — it is not an automated contract or instant order.',
      faqTitle: 'Frequently Asked Questions',
    },
    marketplace: {
      kicker: 'EgvoX Official Marketplace',
      heroTitle: 'Structured Data Collection & Talent Recruitment Marketplace',
      heroSubtitle:
        'Discover active dataset collection projects, recruit verified Video Contributors, Data Annotators, and QA Specialists via private offers, and govern delivery inside one workspace.',
      searchPlaceholder: 'Search projects, capabilities, cameras, QA tools, or domains...',
      searchButton: 'Search',
      projectCatalogTitle: 'Project Catalog',
      projectCatalogDesc: 'Verified vendor dataset collection briefs open for qualification applications',
      serviceCatalogTitle: 'Freelancer Catalog',
      serviceCatalogDesc: 'Video Contributors, Data Annotators & QA Specialists via private recruitment',
      browseCategories: 'Browse Activity Categories',
      allCategories: 'All Categories',
      featuredProjects: 'Featured Projects',
      featuredFreelancers: 'Featured Freelancers',
      viewAll: 'View All',
      applyProposal: 'Express Interest',
      requestOrder: 'Recruit Freelancer',
      askVendor: 'Project Clarification',
      filters: 'Filters',
      resetFilters: 'Reset',
      applyFilters: 'Apply Filters',
    },
  },
};
