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
    cart: string;
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
      cart: 'Keranjang Order',
    },
    landing: {
      kicker: 'Jaringan Data Pengalaman Manusia & Operasi Terkelola',
      heroTitle: 'Platform Kolaborasi Produksi Data Berkualitas untuk',
      heroHighlight: 'Kebutuhan AI & Teknologi',
      heroSubtitle:
        'EgvoX menghubungkan kontributor video egocentric, data annotator, penyedia data, dan tim enterprise untuk mengumpulkan, memvalidasi, dan mengirimkan dataset terstruktur secara aman.',
      ctaExploreMarketplace: 'Jelajahi Marketplace',
      ctaStartNow: 'Mulai Sekarang',
      ctaBecomeContributor: 'Jadi Kontributor',
      ctaBecomeVendor: 'Daftar Data Provider',
      ctaEnterpriseQuote: 'Ajukan Kemitraan Enterprise',
      whatIsTitle: 'Apa itu EgvoX?',
      whatIsSubtitle:
        'Platform marketplace dan operasi produksi data terkelola untuk perekaman video sudut pandang pertama (egocentric), anotasi manusia terstandar, dan pengiriman dataset siap pakai.',
      benefitsTitle: 'Manfaat & Keunggulan Ekosistem',
      howItWorksTitle: 'Bagaimana Cara Kerja EgvoX?',
      howItWorksSubtitle:
        'Tiga alur transaksi transparan: Vendor Project Marketplace, Freelancer Service Order, dan Enterprise Managed Data Project.',
      systemTitle: 'Enam Pilar Sistem EgvoX',
      catalogPreviewTitle: 'Katalog Marketplace EgvoX',
      catalogPreviewSubtitle:
        'Jelajahi proyek pengumpulan dataset aktif dan layanan kontributor serta annotator terverifikasi.',
      moreProjects: 'Lihat Semua Proyek',
      moreFreelancers: 'Lihat Semua Freelancer',
      annotationShowcaseTitle: 'Contoh Data Annotation per Kategori Platform',
      annotationShowcaseSubtitle:
        'Berbagai standar perekaman egocentric dan jenis anotasi manusia untuk membangun dataset berkualitas di tiap industri.',
      supportedAnnotationTitle: 'Jenis Anotasi yang Didukung',
      ecosystemTitle: 'Ekosistem EgvoX',
      industriesTitle: 'Solusi untuk Berbagai Industri',
      trustTitle: 'Kepercayaan, Hak Data & Kualitas Terverifikasi',
      enterpriseFormTitle: 'Permintaan Kemitraan Enterprise',
      enterpriseFormSubtitle:
        'Formulir ini membuat permintaan resmi berstatus submitted untuk proses discovery dan proposal tim EgvoX — bukan kontrak atau order otomatis.',
      faqTitle: 'Pertanyaan yang Sering Diajukan',
    },
    marketplace: {
      kicker: 'Marketplace Resmi EgvoX',
      heroTitle: 'Marketplace Data & Layanan untuk Berbagai Industri',
      heroSubtitle:
        'Temukan proyek pengumpulan dataset, rekrut kontributor video egocentric dan annotator terverifikasi, atau kelola alur kerja data dalam satu workspace.',
      searchPlaceholder: 'Cari project, layanan, kamera, atau kategori aktivitas...',
      searchButton: 'Cari',
      projectCatalogTitle: 'Project Catalog',
      projectCatalogDesc: 'Ratusan project pengumpulan dataset dari vendor terverifikasi',
      serviceCatalogTitle: 'Freelancer Service Catalog',
      serviceCatalogDesc: 'Talenta video capture, anotasi, dan QA siap berkolaborasi',
      browseCategories: 'Jelajahi Kategori Aktivitas',
      allCategories: 'Semua Kategori',
      featuredProjects: 'Project Unggulan',
      featuredFreelancers: 'Freelancer Unggulan',
      viewAll: 'Lihat Semua',
      applyProposal: 'Ajukan Proposal',
      requestOrder: 'Pesan Layanan',
      askVendor: 'Tanyakan ke Vendor',
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
      cart: 'Order Cart',
    },
    landing: {
      kicker: 'Human-Experience Data Network & Managed Operations',
      heroTitle: 'The Human Experience Data Network for',
      heroHighlight: 'AI & Robotics',
      heroSubtitle:
        'Connect with verified egocentric video contributors, data annotators, dataset providers, and managed operations to collect, validate, and deliver structured human-experience datasets.',
      ctaExploreMarketplace: 'Explore Marketplace',
      ctaStartNow: 'Get Started',
      ctaBecomeContributor: 'Become a Contributor',
      ctaBecomeVendor: 'Become a Data Provider',
      ctaEnterpriseQuote: 'Partner with EgvoX',
      whatIsTitle: 'What is EgvoX?',
      whatIsSubtitle:
        'A B2B marketplace and managed data operations platform built specifically for first-person egocentric video capture, human annotation, QA verification, and rights-governed dataset delivery.',
      benefitsTitle: 'Benefits Across Every Persona',
      howItWorksTitle: 'How EgvoX Works',
      howItWorksSubtitle:
        'Three structured workflows: Vendor Project Marketplace, Freelancer Service Orders, and Enterprise Managed Data Projects.',
      systemTitle: 'The Six-Part EgvoX System',
      catalogPreviewTitle: 'EgvoX Marketplace Preview',
      catalogPreviewSubtitle:
        'Browse active vendor collection projects alongside verified contributor and annotator services.',
      moreProjects: 'More Projects',
      moreFreelancers: 'More Freelancers',
      annotationShowcaseTitle: 'Data Annotation Examples by Platform Category',
      annotationShowcaseSubtitle:
        'Human-verified annotation schemas paired with versioned egocentric capture standards across every category.',
      supportedAnnotationTitle: 'Supported Annotation Types',
      ecosystemTitle: 'EgvoX Ecosystem',
      industriesTitle: 'Industry Solutions',
      trustTitle: 'Trust, Rights Governance & Quality Assurance',
      enterpriseFormTitle: 'Enterprise Partnership Request',
      enterpriseFormSubtitle:
        'Submitting this form creates an official discovery request in submitted status — it is not an automated contract or instant order.',
      faqTitle: 'Frequently Asked Questions',
    },
    marketplace: {
      kicker: 'EgvoX Official Marketplace',
      heroTitle: 'Data Collection & Annotation Marketplace Across Industries',
      heroSubtitle:
        'Discover active dataset collection projects, hire verified egocentric video contributors and annotators, and manage compliant delivery workflows.',
      searchPlaceholder: 'Search projects, services, cameras, or activity domains...',
      searchButton: 'Search',
      projectCatalogTitle: 'Project Catalog',
      projectCatalogDesc: 'Verified vendor dataset collection projects open for proposals',
      serviceCatalogTitle: 'Freelancer Service Catalog',
      serviceCatalogDesc: 'Verified video capture, annotation, and QA specialists',
      browseCategories: 'Browse Activity Categories',
      allCategories: 'All Categories',
      featuredProjects: 'Featured Projects',
      featuredFreelancers: 'Featured Freelancers',
      viewAll: 'View All',
      applyProposal: 'Submit Proposal',
      requestOrder: 'Request Order',
      askVendor: 'Message Vendor',
      filters: 'Filters',
      resetFilters: 'Reset',
      applyFilters: 'Apply Filters',
    },
  },
};
