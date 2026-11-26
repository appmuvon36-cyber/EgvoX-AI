'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Camera,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  EyeOff,
  Factory,
  FileCheck2,
  FileUp,
  FolderKanban,
  GraduationCap,
  Heart,
  HeartPulse,
  Image as ImageIcon,
  Layers,
  Lock,
  Mic,
  Scan,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Tag,
  Truck,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';
import { DualPrice } from '@/packages/design-system';
import { dictionaries } from '@/packages/localization/dictionaries';
import { validateEnterpriseInquiry } from '@/packages/validation-schemas';
import { ACTIVITY_CATEGORIES, FREELANCER_SERVICES, PROJECT_LISTINGS } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';

const ANNOTATION_EXAMPLES = [
  {
    id: 'cooking',
    labelId: 'Cooking',
    labelEn: 'Cooking',
    shortCaptionId: 'Hand & Utensil',
    shortCaptionEn: 'Hand & Utensil',
    titleId: 'Cooking · Hand & Utensil Detection',
    titleEn: 'Cooking · Hand & Utensil Detection',
    descId:
      'Deteksi objek tangan kiri/kanan, pisau dapur, talenan, dan bahan makanan dengan segmentasi aksi temporal.',
    descEn:
      'Detection of left/right hands, kitchen knives, cutting boards, and ingredients paired with temporal action segmentation.',
    image: '/images/capture_cooking_pov_1795676769816.jpg',
    duration: '0:15',
    annotationTagId: 'Bounding Box & Temporal Action',
    annotationTagEn: 'Bounding Box & Temporal Action',
    boxes: [
      { label: 'hand', color: '#16835D', top: '26%', left: '19%', width: '32%', height: '30%' },
      { label: 'knife', color: '#7C3AED', top: '42%', left: '46%', width: '31%', height: '16%' },
      { label: 'tomato', color: '#FC840E', top: '53%', left: '30%', width: '22%', height: '24%' },
    ],
  },
  {
    id: 'manufacture',
    labelId: 'Manufacture',
    labelEn: 'Manufacturing',
    shortCaptionId: 'Worker & Tools',
    shortCaptionEn: 'Worker & Tools',
    titleId: 'Manufacture · Worker, Tools & Assembly',
    titleEn: 'Manufacturing · Worker, Tools & Assembly',
    descId:
      'Pelacakan gerakan perakitan komponen mekanik, sarung tangan keselamatan, dan perkakas presisi di meja kerja.',
    descEn:
      'Tracking mechanical component assembly sequences, safety gloves, and precision tools at industrial workbenches.',
    image: '/images/capture_manufacturing_pov_1795676770652.jpg',
    duration: '0:18',
    annotationTagId: 'Keypoint & Tool Tracking',
    annotationTagEn: 'Keypoint & Tool Tracking',
    boxes: [
      { label: 'gloved_hand', color: '#027F86', top: '16%', left: '50%', width: '25%', height: '26%' },
      { label: 'screwdriver', color: '#FC840E', top: '22%', left: '54%', width: '10%', height: '30%' },
      { label: 'motor_unit', color: '#2563A6', top: '42%', left: '42%', width: '25%', height: '30%' },
    ],
  },
  {
    id: 'automotive',
    labelId: 'Otomotif',
    labelEn: 'Automotive',
    shortCaptionId: 'Vehicle & Lane',
    shortCaptionEn: 'Vehicle & Lane',
    titleId: 'Otomotif · Steering, Vehicle & Lane',
    titleEn: 'Automotive · Steering, Vehicle & Lane',
    descId:
      'Deteksi posisi tangan pada kemudi, marka jalur lalu lintas, dan kendaraan di sekitar dari kokpit pengemudi.',
    descEn:
      'Detection of driver steering grip, lane markings, and surrounding vehicles from first-person cockpit perspective.',
    image: '/images/capture_automotive_pov_1795676770764.jpg',
    duration: '0:16',
    annotationTagId: 'Object Tracking & Lane Mask',
    annotationTagEn: 'Object Tracking & Lane Mask',
    boxes: [
      { label: 'steering_hand', color: '#027F86', top: '65%', left: '19%', width: '16%', height: '22%' },
      { label: 'vehicle', color: '#16835D', top: '43%', left: '57%', width: '14%', height: '16%' },
      { label: 'lane_center', color: '#FC840E', top: '54%', left: '42%', width: '28%', height: '12%' },
    ],
  },
  {
    id: 'warehouse',
    labelId: 'Warehouse',
    labelEn: 'Warehouse',
    shortCaptionId: 'Barcode & Picking',
    shortCaptionEn: 'Barcode & Picking',
    titleId: 'Warehouse · Barcode Scan & Shelf Picking',
    titleEn: 'Warehouse · Barcode Scan & Shelf Picking',
    descId:
      'Segmentasi urutan pengambilan paket dari rak, pemindaian barcode, dan penempatan kotak ekspedisi.',
    descEn:
      'Segmentation of shelf picking steps, handheld barcode scanning, and parcel placement operations.',
    image: '/images/capture_warehouse_pov_1795676771521.jpg',
    duration: '0:14',
    annotationTagId: 'Segmentation & Box Track',
    annotationTagEn: 'Segmentation & Box Track',
    boxes: [
      { label: 'parcel_box', color: '#FC840E', top: '38%', left: '42%', width: '20%', height: '24%' },
      { label: 'scanner', color: '#027F86', top: '45%', left: '58%', width: '14%', height: '24%' },
    ],
  },
];

const ANNOTATION_TYPES = [
  {
    id: 'bbox',
    icon: Scan,
    name: 'Bounding Box',
    descId: 'Deteksi & klasifikasi posisi objek di tiap frame',
    descEn: 'Object detection & class localization per frame',
    image: '/images/capture_cooking_pov_1795676769816.jpg',
  },
  {
    id: 'pose',
    icon: UserCheck,
    name: 'Keypoint / Pose',
    descId: 'Titik sendi tangan, jari, dan postur kerja',
    descEn: 'Hand joints, finger keypoints & worker posture',
    image: '/images/capture_manufacturing_pov_1795676770652.jpg',
  },
  {
    id: 'seg',
    icon: Layers,
    name: 'Segmentation',
    descId: 'Masking piksel objek & segmentasi aksi temporal',
    descEn: 'Pixel-level masks & temporal action segments',
    image: '/images/capture_warehouse_pov_1795676771521.jpg',
  },
  {
    id: 'track',
    icon: Sparkles,
    name: 'Object Tracking',
    descId: 'Pelacakan ID konsisten kendaraan & objek antar frame',
    descEn: 'Consistent multi-frame vehicle & object ID tracking',
    image: '/images/capture_automotive_pov_1795676770764.jpg',
  },
] as const;

const FAQ_ITEMS = [
  {
    qId: 'Apa perbedaan antara Dataset Vendor dan Enterprise Buyer di EgvoX?',
    qEn: 'What is the difference between a Dataset Vendor and an Enterprise Buyer on EgvoX?',
    aId: 'Dataset Vendor dapat mempublikasikan Project Catalog dan merekrut kontributor atau memesan layanan freelancer melalui marketplace. Enterprise Buyer tidak mempublikasikan job publik, melainkan mengajukan Enterprise Data Request untuk berkontrak resmi dengan EgvoX sebagai proyek terkelola (Official Project).',
    aEn: 'Dataset Vendors publish public Project Catalog jobs and hire freelancers directly in the marketplace. Enterprise Buyers do not post public jobs; instead they submit an Enterprise Data Request to contract directly with EgvoX for a managed Official Project.',
  },
  {
    qId: 'Apakah full raw video milik kontributor ditampilkan secara publik?',
    qEn: 'Is a contributor’s full raw video ever exposed publicly?',
    aId: 'Tidak pernah. Listing freelancer hanya menampilkan portfolio preview berdurasi terbatas (30–60 detik) dengan persetujuan dan watermark. Full raw video hanya diserahkan melalui sesi upload privat setelah Work Order disetujui.',
    aEn: 'Never. Freelancer profiles show only 30–60s consented watermarked portfolio previews. Full raw video is transferred solely via encrypted private upload sessions tied to an active Work Order.',
  },
  {
    qId: 'Apakah Vendor wajib memesan layanan anotasi dari freelancer?',
    qEn: 'Are Vendors required to order annotation services from freelancers?',
    aId: 'Tidak wajib. Vendor yang sudah memiliki tim anotator internal dapat memesan pengumpulan raw video saja (collection-only), atau menambahkan freelance annotator secara opsional.',
    aEn: 'No. Vendors with internal annotation teams can order raw video collection only, or optionally attach freelance annotator capacity.',
  },
  {
    qId: 'Bagaimana mekanisme tarif per jam dan kelayakan payout bekerja?',
    qEn: 'How do hourly rates and QA payout eligibility work?',
    aId: 'Seluruh tarif proyek dan jasa dihitung per jam video tervalidasi dengan rincian biaya platform transparan sebelum persetujuan. Kelayakan payout dihitung berdasarkan jam/unit yang lolos QA Acceptance Criteria (mendukung partial acceptance per file/batch).',
    aEn: 'All project budgets and service rates are priced transparently per verified hour. Payout eligibility is calculated directly from hours/files passing QA Acceptance Criteria (including partial batch acceptance).',
  },
];

const CAPTURE_STANDARDS_RULES = [
  {
    num: '01',
    titleId: 'Pemasangan Kamera & Sudut Pandang (POV)',
    titleEn: 'First-Person Rigging & Framing',
    descId:
      'Gunakan head-mount atau chest-mount stabil dengan orientasi sesuai brief (16:9 / 9:16). Pastikan kedua tangan dan objek kerja selalu berada di tengah frame.',
    descEn:
      'Use a stable head-mount or chest-mount matching brief orientation (16:9 / 9:16). Keep both hands and active task objects centered in frame.',
  },
  {
    num: '02',
    titleId: 'Dilarang Merekam Wajah & Identitas Orang Lain',
    titleEn: 'Zero Bystander Face & Identity Capture',
    descId:
      'Sesuai kebijakan kepatuhan industri AI global, dilarang mengarahkan kamera ke wajah pihak ketiga, anak di bawah umur, cermin, atau rekan kerja tanpa consent tertulis.',
    descEn:
      'Following global AI compliance policies, never point the camera toward bystander faces, minors, mirrors, or unconsented third parties.',
  },
  {
    num: '03',
    titleId: 'Bersihkan Area dari Informasi Sensitif (PII)',
    titleEn: 'Clear Workspace of Sensitive PII',
    descId:
      'Singkirkan kartu identitas, layar ponsel/monitor dengan data pribadi, dokumen rahasia, pelat nomor kendaraan, maupun label alamat sebelum mulai merekam.',
    descEn:
      'Remove ID cards, unlocked screens showing personal data, confidential paperwork, vehicle plates, and address labels before recording.',
  },
  {
    num: '04',
    titleId: 'Pencahayaan, Audio & Konsistensi FPS',
    titleEn: 'Lighting, Audio & Frame-Rate Stability',
    descId:
      'Rekam pada resolusi minimum 1080p60 dengan pencahayaan merata tanpa motion blur berlebih, dan patuhi kebijakan audio (bisu atau suara natural lingkungan) di Work Order.',
    descEn:
      'Capture at minimum 1080p60 under even lighting without severe motion blur, and follow the Work Order audio policy (muted or ambient only).',
  },
];

const RAW_PIPELINE_STAGES = [
  {
    id: 'quarantine',
    step: '01',
    titleId: 'Upload Terenkripsi ke Zona Karantina',
    titleEn: 'Encrypted Upload to Quarantine',
    shortId: 'Signed Session',
    shortEn: 'Signed Session',
    descId:
      'Video mentah dari kontributor diunggah melalui jalur privat terenkripsi menuju ruang karantina terisolasi—tidak pernah tampil di katalog publik.',
    descEn:
      'Raw footage from contributors uploads via private encrypted sessions into isolated quarantine storage—never exposed on public catalogs.',
    outcomeId:
      'Hasil Tahap 01: Berkas raw terkunci di ruang karantina terenkripsi dengan checksum SHA-256 dan pembersihan koordinat GPS/EXIF awal.',
    outcomeEn:
      'Stage 01 Outcome: Raw files remain locked inside encrypted quarantine with SHA-256 verification and initial GPS/EXIF metadata stripping.',
  },
  {
    id: 'trim',
    step: '02',
    titleId: 'Pemotongan & Penghapusan Frame Wajah / PII',
    titleEn: 'Hard-Cut & Removal of Face / PII Frames',
    shortId: 'Sanitasi & Cut',
    shortEn: 'Sanitize & Cut',
    descId:
      'Tim Data Operations melakukan inspeksi dan memotong permanen segmen yang menangkap wajah orang lain, jeda kosong, atau objek pribadi sebelum diproses lebih lanjut.',
    descEn:
      'Data Operations inspects footage and permanently cuts and purges any segment capturing unintended faces, idle gaps, or personal identifiers.',
    outcomeId:
      'Hasil Tahap 02: Segmen yang memuat wajah orang lain, dokumen pribadi, atau layar sensitif dipotong & dihapus permanen (hard-cut & purge) dari klip.',
    outcomeEn:
      'Stage 02 Outcome: Any frames containing bystander faces, IDs, or sensitive screens are permanently hard-cut and purged from the working clip.',
  },
  {
    id: 'meter',
    step: '03',
    titleId: 'Seleksi Segmen Aksi & Kalkulasi Jam Valid',
    titleEn: 'Action Curation & Verified Hour Metering',
    shortId: 'Kalkulasi / Jam',
    shortEn: 'Hourly Metering',
    descId:
      'Hanya rentang pergerakan tangan dan aktivitas sesuai brief yang diseleksi untuk diekstrak, lalu dihitung durasi jam tervalidasinya secara transparan oleh Tim EgvoX.',
    descEn:
      'Only hand-object interaction segments matching the brief are retained and accurately metered into verified billable hours by the EgvoX team.',
    outcomeId:
      'Hasil Tahap 03: Tim EgvoX menyeleksi klip pergerakan yang dibutuhkan saja dan mengkalkulasi akumulasi jam tervalidasi sebagai dasar payout kontributor & paket buyer.',
    outcomeEn:
      'Stage 03 Outcome: EgvoX curates only target movement clips and meters verified active hours transparently for contributor payouts and buyer delivery.',
  },
];

const INDUSTRY_SECURITY_CONTROLS = [
  {
    titleId: 'Pembersihan Metadata & Geotag GPS',
    titleEn: 'EXIF & GPS Geotag Stripping',
    descId:
      'Koordinat GPS presisi, serial perangkat pribadi, dan metadata sensitif otomatis dibersihkan sebelum paket video diteruskan ke tahap anotasi atau buyer.',
    descEn:
      'Precise GPS coordinates, personal device serials, and sensitive EXIF attributes are automatically stripped prior to annotation or delivery.',
  },
  {
    titleId: 'Isolasi Full Raw vs Pratinjau Berizin',
    titleEn: 'Raw Isolation vs Consented Previews',
    descId:
      'Profil talenta hanya memuat klip pratinjau 30–60 detik ber-watermark dengan izin eksplisit; berkas produksi penuh dikunci di penyimpanan privat Work Order.',
    descEn:
      'Talent profiles show only 30–60s watermarked consented previews; full production assets remain locked inside Work Order storage.',
  },
  {
    titleId: 'Manifest Hak Data & Batas Retensi',
    titleEn: 'Rights Manifest & Retention Bounds',
    descId:
      'Setiap pengiriman menyertakan catatan persetujuan kontributor/lokasi, ruang lingkup lisensi pelatihan AI, serta jadwal penghapusan data sesuai kontrak.',
    descEn:
      'Every dataset package carries signed contributor/site consent records, AI training license scope, and contract-bound retention schedules.',
  },
  {
    titleId: 'Kontrol Akses RBAC & Audit Log Menyeluruh',
    titleEn: 'Zero-Trust RBAC & Immutable Audit Trail',
    descId:
      'Akses ke berkas karantina dibatasi khusus QA independen dan operator berwenang, dengan pencatatan lengkap atas setiap tinjauan dan pengunduhan.',
    descEn:
      'Quarantine access is restricted to independent QA reviewers and authorized operators, logging every inspection and dataset export event.',
  },
];

export const CorporateLandingView: React.FC = () => {
  const {
    locale,
    savedSlugs,
    toggleSaved,
    openProposalModal,
    openRecruitModal,
    submitEnterpriseInquiry,
    customProjects,
    customServices,
  } = useAppState();
  const t = dictionaries[locale];

  const [benefitPersona, setBenefitPersona] = useState<'contributor' | 'vendor' | 'enterprise'>('contributor');
  const [catalogTab, setCatalogTab] = useState<'projects' | 'freelancers'>('projects');
  const [modalityFilter, setModalityFilter] = useState<'Semua' | 'Video' | 'Gambar' | 'Multimodal'>('Semua');
  const [freelancerRoleTab, setFreelancerRoleTab] = useState<'Semua' | 'Video Contributor' | 'Data Annotator' | 'QA Specialist'>('Semua');
  const [activeAnnotationId, setActiveAnnotationId] = useState<string>('cooking');
  const [showOverlayBoxes, setShowOverlayBoxes] = useState<boolean>(true);
  const [activePipelineStageId, setActivePipelineStageId] = useState<string>('trim');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Enterprise inquiry quick form state
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [website, setWebsite] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [domainCategory, setDomainCategory] = useState<string>(ACTIVITY_CATEGORIES[0].nameEn);
  const [deliveryFormat, setDeliveryFormat] = useState('MP4 + JSONL');
  const [targetDeadline, setTargetDeadline] = useState('');
  const [estimatedVolume, setEstimatedVolume] = useState('50 – 250 jam');
  const [requirementSummary, setRequirementSummary] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [consentToContact, setConsentToContact] = useState(false);
  const [inquiryErrors, setInquiryErrors] = useState<Record<string, string>>({});
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const allProjects = [...customProjects, ...PROJECT_LISTINGS];
  const allServices = [...customServices, ...FREELANCER_SERVICES];

  const filteredProjects = allProjects
    .filter((p) => modalityFilter === 'Semua' || p.dataType === modalityFilter)
    .slice(0, 3);

  const filteredFreelancers = allServices
    .filter((s) => freelancerRoleTab === 'Semua' || s.roleType === freelancerRoleTab)
    .slice(0, 3);

  const activeAnnotation =
    ANNOTATION_EXAMPLES.find((a) => a.id === activeAnnotationId) ||
    ANNOTATION_EXAMPLES[0];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateEnterpriseInquiry(
      {
        companyName,
        businessEmail,
        contactPerson,
        contactPhone,
        country,
        estimatedVolume,
        requirementSummary,
        consentToContact,
      },
      locale
    );
    if (!res.valid) {
      setInquiryErrors(res.errors);
      return;
    }
    setInquiryErrors({});
    submitEnterpriseInquiry({
      companyName,
      country,
      website: website.trim() || undefined,
      businessEmail,
      contactPerson,
      contactPhone: contactPhone.trim(),
      domainCategory,
      deliveryFormat,
      targetDeadline: targetDeadline.trim() || undefined,
      estimatedVolume,
      requirementSummary,
      attachmentName: attachmentName || undefined,
    });
    setInquirySubmitted(true);
    setCompanyName('');
    setWebsite('');
    setBusinessEmail('');
    setContactPerson('');
    setContactPhone('');
    setTargetDeadline('');
    setRequirementSummary('');
    setAttachmentName('');
    setConsentToContact(false);
  };

  return (
    <div className="bg-[var(--egvox-bg-canvas)]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center lg:col-span-6 min-w-0">
              <p className="text-sm font-semibold text-[#027F86] dark:text-[#04B8B4]">
                {t.landing.kicker}
              </p>
              <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-[var(--egvox-text-primary)] sm:text-4xl lg:text-[2.85rem] lg:leading-[1.15]">
                {t.landing.heroTitle}{' '}
                <span className="text-[#027F86] dark:text-[#04B8B4]">
                  {t.landing.heroHighlight}
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--egvox-text-secondary)]">
                {t.landing.heroSubtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/marketplace"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#027F86] px-6 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
                >
                  <span>{t.landing.ctaExploreMarketplace}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-6 text-sm font-semibold text-[var(--egvox-text-primary)] hover:bg-[var(--egvox-bg-subtle)] transition-colors"
                >
                  {t.landing.ctaStartNow}
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[var(--egvox-text-muted)]">
                <Link
                  href="/register?type=freelancer"
                  className="hover:text-[#027F86] dark:hover:text-[#04B8B4] underline-offset-4 hover:underline"
                >
                  {t.landing.ctaBecomeContributor}
                </Link>
                <span aria-hidden="true">·</span>
                <Link
                  href="/register?type=vendor"
                  className="hover:text-[#027F86] dark:hover:text-[#04B8B4] underline-offset-4 hover:underline"
                >
                  {t.landing.ctaBecomeVendor}
                </Link>
                <span aria-hidden="true">·</span>
                <Link
                  href="/enterprise/partnership"
                  className="hover:text-[#FC840E] underline-offset-4 hover:underline"
                >
                  {t.landing.ctaEnterpriseQuote}
                </Link>
              </div>
            </div>

            {/* Right Visual Anchor */}
            <div className="lg:col-span-6 min-w-0 flex flex-col justify-between gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-[var(--egvox-border-default)] bg-[#102326] aspect-[16/10]">
                <img
                  src="/images/capture_cooking_pov_1795676769816.jpg"
                  alt="Egocentric cooking video capture sample with human annotation overlay"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                {showOverlayBoxes && (
                  <div className="pointer-events-none absolute inset-0">
                    <div
                      className="absolute border-2 border-[#16835D] rounded-sm"
                      style={{ top: '26%', left: '19%', width: '32%', height: '30%' }}
                    >
                      <span className="inline-block bg-[#16835D] px-1.5 py-0.5 text-[10px] font-mono font-semibold text-white">
                        hand
                      </span>
                    </div>
                    <div
                      className="absolute border-2 border-[#7C3AED] rounded-sm"
                      style={{ top: '42%', left: '46%', width: '31%', height: '16%' }}
                    >
                      <span className="inline-block bg-[#7C3AED] px-1.5 py-0.5 text-[10px] font-mono font-semibold text-white">
                        knife
                      </span>
                    </div>
                    <div
                      className="absolute border-2 border-[#FC840E] rounded-sm"
                      style={{ top: '53%', left: '30%', width: '22%', height: '24%' }}
                    >
                      <span className="inline-block bg-[#FC840E] px-1.5 py-0.5 text-[10px] font-mono font-semibold text-white">
                        tomato
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs text-white">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 shrink-0 text-[#04B8B4]" />
                    <span className="font-mono tabular-nums">
                      0:15 · Egocentric 1080p60 · SPEC-COOK-v2.1
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOverlayBoxes((v) => !v)}
                    className="rounded-md bg-white/15 px-2.5 py-1 text-[11px] font-medium hover:bg-white/25 transition-colors"
                  >
                    {showOverlayBoxes
                      ? locale === 'id'
                        ? 'Sembunyikan Box'
                        : 'Hide Boxes'
                      : locale === 'id'
                      ? 'Tampilkan Box'
                      : 'Show Boxes'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { icon: Camera, title: locale === 'id' ? 'Perekaman' : 'Capture', sub: locale === 'id' ? 'Sudut Pandang POV' : 'Egocentric POV' },
                  { icon: Tag, title: locale === 'id' ? 'Anotasi' : 'Annotation', sub: locale === 'id' ? 'Pelabelan Manusia' : 'Human Labeling' },
                  { icon: ShieldCheck, title: locale === 'id' ? 'Uji Kualitas' : 'Quality Check', sub: locale === 'id' ? 'QA & Hak Data' : 'QA & Rights Gate' },
                  { icon: Database, title: locale === 'id' ? 'Pengiriman Dataset' : 'Dataset Delivery', sub: locale === 'id' ? 'Paket Terstruktur' : 'Structured Package' },
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="flex items-center gap-2.5 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#027F86]/10 text-[#027F86] dark:text-[#04B8B4]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--egvox-text-primary)] truncate">
                          {step.title}
                        </p>
                        <p className="text-[11px] text-[var(--egvox-text-muted)] truncate">
                          {step.sub}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4-Column KPI Strip */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-[var(--egvox-border-default)] pt-8 lg:grid-cols-4">
            {[
              { value: '50K+', label: locale === 'id' ? 'Kontributor Global' : 'Global Contributors' },
              { value: '10K+', label: locale === 'id' ? 'Proyek Data' : 'Data Projects' },
              { value: '500+', label: locale === 'id' ? 'Perusahaan & Riset' : 'Enterprise & Research' },
              { value: '100M+', label: locale === 'id' ? 'Frame & Jam Video Terproses' : 'Processed Frames & Video Hours' },
            ].map((kpi) => (
              <div key={kpi.label} className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#027F86] dark:text-[#04B8B4] tabular-nums">
                  {kpi.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[var(--egvox-text-secondary)]">
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. APA ITU EGVOX & MANFAAT KEUNGGULAN */}
      <section id="apa-itu-egvox" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 min-w-0 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--egvox-text-primary)]">
              {t.landing.whatIsTitle}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--egvox-text-secondary)]">
              {t.landing.whatIsSubtitle}
            </p>
            <div className="space-y-3 pt-2">
              {(locale === 'id'
                ? [
                    'Perekaman video egocentric terstruktur dengan versi Capture Specification baku.',
                    'Layanan anotasi manusia opsional oleh annotator terverifikasi (Vendor tetap dapat memakai tim internal).',
                    'Private raw video submission & Data Rights Manifest untuk kepatuhan privasi dan lisensi.',
                  ]
                : [
                    'Structured first-person egocentric video capture under versioned Capture Specifications.',
                    'Optional human annotation services by verified annotators (Vendors may keep internal annotators).',
                    'Private raw video submission & Data Rights Manifest ensuring privacy and licensing compliance.',
                  ]
              ).map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-sm text-[var(--egvox-text-primary)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16835D]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--egvox-border-default)] pb-4">
                <h3 className="text-lg font-bold text-[var(--egvox-text-primary)]">
                  {t.landing.benefitsTitle}
                </h3>
                <div className="inline-flex max-w-full overflow-x-auto rounded-lg bg-[var(--egvox-bg-subtle)] p-1">
                  {(
                    [
                      { id: 'contributor', label: locale === 'id' ? 'Kontributor' : 'Contributors' },
                      { id: 'vendor', label: 'Vendor' },
                      { id: 'enterprise', label: 'Enterprise' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setBenefitPersona(tab.id)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        benefitPersona === tab.id
                          ? 'bg-[var(--egvox-bg-surface)] text-[#027F86] dark:text-[#04B8B4] shadow-xs'
                          : 'text-[var(--egvox-text-secondary)] hover:text-[var(--egvox-text-primary)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {benefitPersona === 'contributor' &&
                  (locale === 'id'
                    ? [
                        { title: 'Akses Project & Listing Jasa', desc: 'Terbitkan layanan perekaman atau anotasi per jam di Freelancer Service Catalog dan ajukan proposal ke proyek vendor.' },
                        { title: 'Work Order & Milestone Jelas', desc: 'Setiap kesepakatan memiliki acceptance criteria objektif, versi spesifikasi tetap, dan negosiasi transparan.' },
                        { title: 'Private Raw Video Upload', desc: 'Video penuh tidak pernah dijual bebas di katalog publik dan hanya diunggah ke sesi kerja privat.' },
                        { title: 'Pelacakan QA & Reputasi', desc: 'Pantau status review teknis, partial acceptance per batch, serta histori performa selesai.' },
                      ]
                    : [
                        { title: 'Project Access & Service Listings', desc: 'Publish hourly video capture or annotation services in the Freelancer Catalog and submit project proposals.' },
                        { title: 'Clear Work Orders & Milestones', desc: 'Every contract locks objective acceptance criteria, specification version, and transparent rate negotiation.' },
                        { title: 'Private Raw Video Uploads', desc: 'Full raw video is never sold openly in public listings and transfers exclusively via private upload sessions.' },
                        { title: 'QA Tracking & Reputation', desc: 'Monitor file-level QA checks, partial batch approvals, and verified delivery reputation.' },
                      ]
                  ).map((item) => (
                    <div key={item.title} className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4">
                      <h4 className="text-sm font-semibold text-[var(--egvox-text-primary)]">{item.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--egvox-text-secondary)]">{item.desc}</p>
                    </div>
                  ))}

                {benefitPersona === 'vendor' &&
                  (locale === 'id'
                    ? [
                        { title: 'Publikasi Project Catalog', desc: 'Buat listing proyek lengkap dengan target jam video, perangkat kamera, wilayah, dan acceptance criteria.' },
                        { title: 'Rekrutmen Talenta Terverifikasi', desc: 'Cari kontributor dan annotator berdasarkan resolusi, FPS, lokasi, kapasitas per jam, dan rating selesai.' },
                        { title: 'Anotasi Opsional Fleksibel', desc: 'Pesan collection-only jika memakai annotator internal, atau tambah layanan anotasi freelance saat dibutuhkan.' },
                        { title: 'QA Gate & Delivery Terstruktur', desc: 'Terima raw video tervalidasi checksum SHA-256 lengkap dengan manifest izin dan riwayat transaksi.' },
                      ]
                    : [
                        { title: 'Publish Project Catalog', desc: 'Launch project listings detailing target video hours, camera mounts, regions, and QA criteria.' },
                        { title: 'Hire Verified Specialists', desc: 'Filter contributors and annotators by camera gear, FPS, weekly hour capacity, and completion SLA.' },
                        { title: 'Optional Flexible Annotation', desc: 'Order collection-only when using internal annotators, or add freelance annotation hours anytime.' },
                        { title: 'QA Gate & Structured Delivery', desc: 'Receive SHA-256 verified raw assets bundled with rights manifests and full ledger auditability.' },
                      ]
                  ).map((item) => (
                    <div key={item.title} className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4">
                      <h4 className="text-sm font-semibold text-[var(--egvox-text-primary)]">{item.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--egvox-text-secondary)]">{item.desc}</p>
                    </div>
                  ))}

                {benefitPersona === 'enterprise' &&
                  (locale === 'id'
                    ? [
                        { title: 'Satu Kontrak Resmi Platform', desc: 'Ajukan Enterprise Data Request dan berkontrak langsung dengan EgvoX tanpa repot merekrut freelancer satu per satu.' },
                        { title: 'Managed Official Project', desc: 'Tim Project Manager dan Data Operations mengalokasikan kontributor, annotator, dan QA reviewer.' },
                        { title: 'SLA & Pelaporan Real-Time', desc: 'Pantau progres pengumpulan per jam, tingkat penerimaan QA, jadwal milestone, dan delivery package dari workspace.' },
                        { title: 'Kepatuhan Rights & Privasi', desc: 'Data Rights Manifest mencatat kepemilikan, consent peserta, lokasi, retensi, dan izin penggunaan komersial.' },
                      ]
                    : [
                        { title: 'Single Official Platform Contract', desc: 'Submit an Enterprise Data Request and contract directly with EgvoX without managing individual freelancers.' },
                        { title: 'Managed Official Projects', desc: 'EgvoX Operations & Project Managers allocate vetted capture crews, annotators, and QA engineers.' },
                        { title: 'Real-Time SLA & Reporting', desc: 'Track collected hours, QA pass rates, milestone schedules, and delivery manifests inside your workspace.' },
                        { title: 'Rights & Privacy Compliance', desc: 'Data Rights Manifest records ownership, participant consent, venue clearance, and license bounds.' },
                      ]
                  ).map((item) => (
                    <div key={item.title} className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4">
                      <h4 className="text-sm font-semibold text-[var(--egvox-text-primary)]">{item.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--egvox-text-secondary)]">{item.desc}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BAGAIMANA CARA KERJA & ENAM SISTEM EGVOX */}
      <section id="cara-kerja" className="border-y border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--egvox-text-primary)]">
              {t.landing.howItWorksTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[var(--egvox-text-secondary)]">
              {t.landing.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                num: '01.',
                title: 'Vendor Project Marketplace',
                steps:
                  locale === 'id'
                    ? [
                        'Vendor mempublikasikan Project Catalog dengan Capture Specification & tarif per jam.',
                        'Freelancer mengajukan proposal sesuai kapasitas jam & perangkat.',
                        'Negosiasi membentuk Work Order berversi tetap.',
                        'Upload raw video privat, QA review, lalu delivery ke Vendor.',
                      ]
                    : [
                        'Vendors publish Project Catalog briefs with versioned Capture Specs & hourly rates.',
                        'Freelancers submit proposals tailored to weekly hourly capacity & camera rig.',
                        'Negotiation locks an immutable Work Order.',
                        'Private raw upload, QA verification, and structured dataset delivery.',
                      ],
                ctaHref: '/marketplace/projects',
                ctaLabel: locale === 'id' ? 'Lihat Project Catalog' : 'Browse Project Catalog',
              },
              {
                num: '02.',
                title: locale === 'id' ? 'Rekrutmen Freelancer Privat' : 'Private Freelancer Recruitment',
                steps:
                  locale === 'id'
                    ? [
                        'Contributor, Annotator & QA Specialist menampilkan keahlian, perangkat & portfolio terverifikasi.',
                        'Vendor terverifikasi KYB (min. saldo Rp 5 jt) mengirim penawaran rekrutmen privat.',
                        'Negosiasi berversi membentuk Work Order & reservasi dana terotorisasi di ledger.',
                        'Payout diproses bertahap sesuai unit yang lolos QA Acceptance Criteria.',
                      ]
                    : [
                        'Contributors, Annotators & QA Specialists showcase verified skills, equipment & consented portfolios.',
                        'KYB-verified Vendors (min. Rp 5M settled balance) send private recruitment offers.',
                        'Versioned negotiation locks the Work Order & authorized ledger fund reservation.',
                        'Payouts settle per unit passing objective QA Acceptance Criteria.',
                      ],
                ctaHref: '/marketplace/services',
                ctaLabel: locale === 'id' ? 'Jelajahi Katalog Freelancer' : 'Browse Freelancer Catalog',
              },
              {
                num: '03.',
                title: 'Enterprise Managed Data Project',
                steps:
                  locale === 'id'
                    ? [
                        'Enterprise mengirim RFP melalui Enterprise Data Request.',
                        'EgvoX menyusun proposal, SLA, dan kontrak resmi.',
                        'Platform membentuk Official Project & mengalokasikan tenaga kerja.',
                        'Collection, annotation, QA, packaging, dan delivery terkelola.',
                      ]
                    : [
                        'Enterprise submits requirements via Enterprise Data Request.',
                        'EgvoX prepares tailored SLA scope, pricing, and formal contract.',
                        'Platform provisions Official Project and allocates vetted talent.',
                        'Managed capture, annotation, QA, packaging, and delivery.',
                      ],
                ctaHref: '/enterprise/partnership',
                ctaLabel: locale === 'id' ? 'Ajukan Enterprise Request' : 'Submit Enterprise Request',
              },
            ].map((flow) => (
              <div
                key={flow.num}
                className="flex flex-col justify-between rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-6"
              >
                <div>
                  <span className="text-xs font-mono font-semibold text-[#FC840E]">
                    {flow.num}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-[var(--egvox-text-primary)]">
                    {flow.title}
                  </h3>
                  <ol className="mt-4 space-y-2.5 text-sm text-[var(--egvox-text-secondary)]">
                    {flow.steps.map((s, idx) => (
                      <li key={s} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#027F86]/12 text-[11px] font-bold text-[#027F86] dark:text-[#04B8B4] tabular-nums">
                          {idx + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <Link
                  href={flow.ctaHref}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
                >
                  <span>{flow.ctaLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* 6 Pillars System */}
          <div className="border-t border-[var(--egvox-border-default)] pt-10">
            <h3 className="text-lg font-bold text-[var(--egvox-text-primary)]">
              {t.landing.systemTitle}
            </h3>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                {
                  name: 'Freelancer Network',
                  desc: locale === 'id' ? 'Contributor & Annotator terverifikasi' : 'Verified Contributors & Annotators',
                  href: '/workspace?role=freelancer',
                },
                {
                  name: 'Project Catalog',
                  desc: locale === 'id' ? 'Listing kebutuhan dataset Vendor' : 'Vendor dataset collection briefs',
                  href: '/marketplace/projects',
                },
                {
                  name: 'Service Catalog',
                  desc: locale === 'id' ? 'Jasa perekaman & anotasi per jam' : 'Hourly capture & annotation services',
                  href: '/marketplace/services',
                },
                {
                  name: 'Data Operations',
                  desc: locale === 'id' ? 'Validasi media, QA & packaging' : 'Media validation, QA & packaging',
                  href: '/ops',
                },
                {
                  name: 'Enterprise Hub',
                  desc: locale === 'id' ? 'RFP, kontrak & Official Project' : 'RFP, contracts & Official Projects',
                  href: '/workspace?role=enterprise',
                },
                {
                  name: 'Control Plane',
                  desc: locale === 'id' ? 'Moderasi, rights, ledger & audit' : 'Moderation, rights, ledger & audit',
                  href: '/admin',
                },
              ].map((sys) => (
                <Link
                  key={sys.name}
                  href={sys.href}
                  className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 hover:border-[#027F86] transition-colors block"
                >
                  <p className="text-xs font-bold text-[#027F86] dark:text-[#04B8B4]">
                    {sys.name}
                  </p>
                  <p className="mt-1 text-xs text-[var(--egvox-text-secondary)]">
                    {sys.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. KATALOG MARKETPLACE EGVOX PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--egvox-text-primary)]">
              {t.landing.catalogPreviewTitle}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--egvox-text-secondary)]">
              {t.landing.catalogPreviewSubtitle}
            </p>
          </div>
          <div className="inline-flex max-w-full overflow-x-auto rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-1 self-start">
            <button
              type="button"
              onClick={() => setCatalogTab('projects')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                catalogTab === 'projects'
                  ? 'bg-[#027F86] text-white'
                  : 'text-[var(--egvox-text-secondary)] hover:text-[var(--egvox-text-primary)]'
              }`}
            >
              <FolderKanban className="h-4 w-4" />
              <span>{locale === 'id' ? 'Katalog Proyek' : 'Project Catalog'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCatalogTab('freelancers')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                catalogTab === 'freelancers'
                  ? 'bg-[#027F86] text-white'
                  : 'text-[var(--egvox-text-secondary)] hover:text-[var(--egvox-text-primary)]'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>{locale === 'id' ? 'Katalog Freelancer' : 'Freelancer Catalog'}</span>
            </button>
          </div>
        </div>

        {/* Sub-bar filters + Explicit More Projects / More Freelancers Link */}
        {catalogTab === 'projects' ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['Semua', 'Video', 'Gambar', 'Multimodal'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModalityFilter(m)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    modalityFilter === m
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]'
                  }`}
                >
                  {m === 'Semua'
                    ? locale === 'id'
                      ? 'Semua'
                      : 'All'
                    : m === 'Gambar' && locale === 'en'
                    ? 'Image'
                    : m}
                </button>
              ))}
            </div>
            <Link
              href="/marketplace/projects"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
            >
              <span>{t.landing.moreProjects}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['Semua', 'Video Contributor', 'Data Annotator', 'QA Specialist'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFreelancerRoleTab(r)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    freelancerRoleTab === r
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]'
                  }`}
                >
                  {r === 'Semua' ? (locale === 'id' ? 'Semua' : 'All') : r}
                </button>
              ))}
            </div>
            <Link
              href="/marketplace/services"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
            >
              <span>{t.landing.moreFreelancers}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {catalogTab === 'projects'
            ? (filteredProjects.length > 0 ? filteredProjects : allProjects.slice(0, 3)).map((prj) => {
                const isSaved = savedSlugs.includes(prj.slug);
                const title = locale === 'id' ? prj.title : prj.titleEn;
                const summary = locale === 'id' ? prj.summary : prj.summaryEn;
                const unit = locale === 'id' ? prj.unitLabel : prj.unitLabelEn || 'hour';
                return (
                  <article
                    key={prj.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-[#102326] overflow-hidden">
                        <img
                          src={prj.previewImage}
                          alt={title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="absolute bottom-2.5 left-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-mono text-white tabular-nums">
                          {prj.previewDuration}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSaved(prj.slug, title)}
                          aria-label={locale === 'id' ? 'Simpan proyek' : 'Save project'}
                          className="absolute top-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#102326] hover:bg-white transition-colors"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isSaved ? 'fill-[#FC840E] text-[#FC840E]' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-[var(--egvox-text-muted)]">
                          <span>{locale === 'id' ? prj.categoryLabel : prj.categoryLabelEn || prj.categoryLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{prj.captureType}</span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 text-[#16835D] font-medium">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {locale === 'id' ? 'Vendor Terverifikasi' : 'Verified Vendor'}
                          </span>
                        </div>
                        <Link
                          href={`/marketplace/projects/${prj.slug}`}
                          className="mt-2 block text-base font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86] dark:hover:text-[#04B8B4]"
                        >
                          {title}
                        </Link>
                        <p className="mt-1.5 text-xs text-[var(--egvox-text-secondary)] line-clamp-2">
                          {summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--egvox-border-default)] px-4 sm:px-5 py-3.5">
                      {prj.showBudgetDisclosure !== false ? (
                        <div>
                          <span className="block text-[10px] text-[var(--egvox-text-muted)]">
                            {locale === 'id' ? 'Ref. Budget Vendor' : 'Vendor Budget Ref.'}
                          </span>
                          <DualPrice amountIDR={prj.ratePerUnit} unitLabel={unit} size="sm" />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-[#027F86]">
                          {locale === 'id' ? 'Penawaran Privat' : 'Private Offer'}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openProposalModal(prj)}
                          className="rounded-lg bg-[#027F86] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#039998] transition-colors"
                        >
                          {t.marketplace.applyProposal}
                        </button>
                        <Link
                          href={`/marketplace/projects/${prj.slug}`}
                          aria-label={`Detail ${title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--egvox-border-default)] text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            : filteredFreelancers.map((srv) => {
                const title = locale === 'id' ? srv.title : srv.titleEn;
                const desc = locale === 'id' ? srv.description : srv.descriptionEn;
                const cap = locale === 'id' ? srv.capacityLabel : srv.capacityLabelEn || srv.capacityLabel;
                const accRate = srv.acceptanceRatePercent ?? srv.slaPercent;
                return (
                  <article
                    key={srv.id}
                    className="flex flex-col justify-between rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={srv.avatar}
                            alt={srv.freelancerName}
                            referrerPolicy="no-referrer"
                            className="h-12 w-12 rounded-full object-cover border border-[var(--egvox-border-default)]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/freelancers/${srv.username}`}
                                className="text-sm font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                              >
                                {srv.freelancerName}
                              </Link>
                              {srv.verified && (
                                <ShieldCheck className="h-4 w-4 text-[#16835D]" />
                              )}
                            </div>
                            <p className="text-xs font-medium text-[#027F86]">
                              {srv.roleType} · {srv.levelBadge}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--egvox-text-primary)] tabular-nums">
                          <Star className="h-3.5 w-3.5 fill-[#FDBA27] text-[#FDBA27]" />
                          {srv.rating} ({srv.completedOrders})
                        </span>
                      </div>

                      <Link
                        href={`/marketplace/services/${srv.slug}`}
                        className="mt-4 block text-sm font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                      >
                        {title}
                      </Link>
                      <p className="mt-1.5 text-xs text-[var(--egvox-text-secondary)] line-clamp-2">
                        {desc}
                      </p>
                      <p className="mt-3 text-xs text-[var(--egvox-text-muted)]">
                        {srv.tags.join(' · ')}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--egvox-border-default)] pt-3.5">
                      <div className="text-xs tabular-nums">
                        <span className="block font-semibold text-[#16835D]">
                          {accRate}% {locale === 'id' ? 'Penerimaan' : 'Acceptance'}
                        </span>
                        <span className="text-[11px] text-[var(--egvox-text-muted)]">{cap}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/marketplace/services/${srv.slug}`}
                          className="rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
                        >
                          {locale === 'id' ? 'Detail' : 'Details'}
                        </Link>
                        <button
                          type="button"
                          onClick={() => openRecruitModal(srv)}
                          className="rounded-lg bg-[#027F86] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
                        >
                          {locale === 'id' ? 'Rekrut' : 'Recruit'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>

        {/* Bottom More Freelancer / More Projects CTA Button */}
        <div className="mt-7 flex justify-center">
          {catalogTab === 'freelancers' ? (
            <Link
              href="/marketplace/services"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#027F86] bg-[var(--egvox-bg-surface)] px-6 text-sm font-semibold text-[#027F86] dark:text-[#04B8B4] hover:bg-[#027F86] hover:text-white transition-colors"
            >
              <span>
                {locale === 'id'
                  ? 'Lihat Semua Freelancer di Marketplace'
                  : 'More Freelancers — View Full Marketplace Catalog'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/marketplace/projects"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#027F86] bg-[var(--egvox-bg-surface)] px-6 text-sm font-semibold text-[#027F86] dark:text-[#04B8B4] hover:bg-[#027F86] hover:text-white transition-colors"
            >
              <span>
                {locale === 'id'
                  ? 'Lihat Semua Proyek di Marketplace'
                  : 'More Projects — View Full Project Catalog'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Vendor CTA Banner */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-[#027F86] px-6 py-6 text-white">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Database className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold">
                {locale === 'id'
                  ? 'Punya Kebutuhan Dataset Khusus?'
                  : 'Have Custom Dataset Requirements?'}
              </h3>
              <p className="mt-0.5 text-sm text-white/85">
                {locale === 'id'
                  ? 'Publikasikan Project Catalog sebagai Dataset Vendor atau ajukan Enterprise Managed Project sesuai spesifikasi bisnis Anda.'
                  : 'Publish a Project Catalog brief as a Dataset Vendor or initiate an Enterprise Managed Project tailored to your specs.'}
              </p>
            </div>
          </div>
          <Link
            href="/onboarding/vendor"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#027F86] hover:bg-[#F4F8F8] transition-colors"
          >
            <span>{locale === 'id' ? 'Buat Proyek Sekarang' : 'Create Project Now'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5. CONTOH DATA ANNOTATION & KATEGORI PLATFORM DENGAN CONTOH GAMBAR */}
      <section className="border-y border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--egvox-text-primary)]">
                {t.landing.annotationShowcaseTitle}
              </h2>
              <p className="mt-1.5 text-sm text-[var(--egvox-text-secondary)]">
                {t.landing.annotationShowcaseSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ANNOTATION_EXAMPLES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveAnnotationId(item.id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    activeAnnotationId === item.id
                      ? 'bg-[#027F86] text-white'
                      : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]'
                  }`}
                >
                  {locale === 'id' ? item.labelId : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Card Category Visual Strip with Annotation Overlays (Cooking, Manufacture, Otomotif, Warehouse) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ANNOTATION_EXAMPLES.map((catEx) => {
              const isSelected = activeAnnotationId === catEx.id;
              return (
                <button
                  key={catEx.id}
                  type="button"
                  onClick={() => setActiveAnnotationId(catEx.id)}
                  className={`group text-left overflow-hidden rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-[#027F86] ring-2 ring-[#027F86]/25 bg-[var(--egvox-bg-canvas)]'
                      : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] hover:border-[#027F86]/60'
                  }`}
                >
                  <span className="relative block aspect-[16/10] bg-[#102326] overflow-hidden">
                    <img
                      src={catEx.image}
                      alt={locale === 'id' ? catEx.titleId : catEx.titleEn}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    {catEx.boxes.map((box) => (
                      <span
                        key={box.label}
                        className="pointer-events-none absolute block border rounded-xs"
                        style={{
                          borderColor: box.color,
                          top: box.top,
                          left: box.left,
                          width: box.width,
                          height: box.height,
                        }}
                      >
                        <span
                          className="inline-block px-1 py-0.2 text-[8px] font-mono font-bold text-white leading-tight"
                          style={{ backgroundColor: box.color }}
                        >
                          {box.label}
                        </span>
                      </span>
                    ))}
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-mono text-white">
                      {catEx.duration}
                    </span>
                  </span>
                  <span className="block p-3">
                    <span className="block text-xs font-bold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? catEx.labelId : catEx.labelEn}
                    </span>
                    <span className="block text-[11px] text-[var(--egvox-text-muted)]">
                      {locale === 'id' ? catEx.shortCaptionId : catEx.shortCaptionEn}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Detail Stage + Supported Annotation Type Visual Cards */}
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 min-w-0">
              <div className="relative overflow-hidden rounded-2xl border border-[var(--egvox-border-default)] bg-[#102326] aspect-[16/9]">
                <img
                  src={activeAnnotation.image}
                  alt={locale === 'id' ? activeAnnotation.titleId : activeAnnotation.titleEn}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                {activeAnnotation.boxes.map((box) => (
                  <div
                    key={box.label}
                    className="absolute border-2 rounded-sm"
                    style={{
                      borderColor: box.color,
                      top: box.top,
                      left: box.left,
                      width: box.width,
                      height: box.height,
                    }}
                  >
                    <span
                      className="inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-white"
                      style={{ backgroundColor: box.color }}
                    >
                      {box.label}
                    </span>
                  </div>
                ))}
                <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex flex-wrap items-center justify-between gap-1.5">
                  <span className="rounded-md bg-black/75 px-2.5 py-1 text-[11px] sm:text-xs font-mono text-white tabular-nums">
                    {activeAnnotation.duration} ·{' '}
                    {locale === 'id' ? 'Skema Ditinjau Manusia' : 'Human Reviewed Schema'}
                  </span>
                  <span className="rounded-md bg-[#027F86] px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-white">
                    {locale === 'id'
                      ? activeAnnotation.annotationTagId
                      : activeAnnotation.annotationTagEn}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 min-w-0 space-y-5">
              <div>
                <h3 className="text-xl font-bold text-[var(--egvox-text-primary)]">
                  {locale === 'id' ? activeAnnotation.titleId : activeAnnotation.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--egvox-text-secondary)]">
                  {locale === 'id' ? activeAnnotation.descId : activeAnnotation.descEn}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--egvox-text-muted)] mb-2.5">
                  {t.landing.supportedAnnotationTitle}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {ANNOTATION_TYPES.map((ann) => {
                    const Icon = ann.icon;
                    return (
                      <div
                        key={ann.id}
                        className="overflow-hidden rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)]"
                      >
                        <div className="relative h-20 bg-[#102326] overflow-hidden">
                          <img
                            src={ann.image}
                            alt={ann.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover opacity-85"
                          />
                          {/* Visual schema overlay per annotation type */}
                          {ann.id === 'bbox' && (
                            <div className="pointer-events-none absolute inset-0">
                              <div className="absolute top-3 left-4 h-10 w-14 border-2 border-[#16835D]">
                                <span className="bg-[#16835D] px-1 text-[8px] font-mono text-white">
                                  hand
                                </span>
                              </div>
                              <div className="absolute top-6 right-5 h-8 w-12 border-2 border-[#FC840E]">
                                <span className="bg-[#FC840E] px-1 text-[8px] font-mono text-white">
                                  obj
                                </span>
                              </div>
                            </div>
                          )}
                          {ann.id === 'pose' && (
                            <svg
                              viewBox="0 0 120 60"
                              className="pointer-events-none absolute inset-0 h-full w-full"
                            >
                              <polyline
                                points="42,16 58,28 74,24 88,36"
                                fill="none"
                                stroke="#04B8B4"
                                strokeWidth="2.5"
                              />
                              <circle cx="42" cy="16" r="3" fill="#FDBA27" />
                              <circle cx="58" cy="28" r="3" fill="#FDBA27" />
                              <circle cx="74" cy="24" r="3" fill="#FDBA27" />
                              <circle cx="88" cy="36" r="3" fill="#FDBA27" />
                            </svg>
                          )}
                          {ann.id === 'seg' && (
                            <svg
                              viewBox="0 0 120 60"
                              className="pointer-events-none absolute inset-0 h-full w-full"
                            >
                              <polygon
                                points="45,14 82,18 90,46 40,44"
                                fill="#04B8B4"
                                fillOpacity="0.45"
                                stroke="#04B8B4"
                                strokeWidth="2"
                              />
                            </svg>
                          )}
                          {ann.id === 'track' && (
                            <div className="pointer-events-none absolute inset-0">
                              <div className="absolute top-3 left-6 h-9 w-14 border-2 border-dashed border-[#FC840E]">
                                <span className="bg-[#FC840E] px-1 text-[8px] font-mono text-white">
                                  ID#04
                                </span>
                              </div>
                              <div className="absolute bottom-2 right-5 h-7 w-12 border-2 border-dashed border-[#16835D]">
                                <span className="bg-[#16835D] px-1 text-[8px] font-mono text-white">
                                  ID#09
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-[#027F86] dark:text-[#04B8B4]" />
                            <p className="text-xs font-bold text-[var(--egvox-text-primary)]">
                              {ann.name}
                            </p>
                          </div>
                          <p className="mt-0.5 text-[11px] text-[var(--egvox-text-muted)] line-clamp-2">
                            {locale === 'id' ? ann.descId : ann.descEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {[
                  { icon: Video, label: 'Video' },
                  { icon: ImageIcon, label: locale === 'id' ? 'Gambar' : 'Images' },
                  { icon: Mic, label: 'Audio' },
                  { icon: Layers, label: 'Multimodal' },
                ].map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.label}
                      className="flex items-center gap-2 rounded-lg border border-[var(--egvox-border-default)] px-3 py-2 text-xs font-semibold text-[var(--egvox-text-primary)]"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#FC840E]" />
                      <span>{mod.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5B. PANDUAN PEMBUATAN VIDEO EGOCENTRIC & KEAMANAN DATA PRIBADI */}
      <section
        id="video-privacy-standards"
        className="border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] py-14 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-[#027F86] dark:text-[#04B8B4]">
              {locale === 'id'
                ? 'Protokol Produksi & Kepatuhan Privasi Industri AI'
                : 'AI Industry Privacy Compliance & Capture Protocol'}
            </p>
            <h2 className="mt-1.5 text-balance text-2xl sm:text-3xl font-bold tracking-tight text-[var(--egvox-text-primary)]">
              {t.landing.privacyCaptureTitle}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[var(--egvox-text-secondary)]">
              {t.landing.privacyCaptureSubtitle}
            </p>
          </div>

          {/* Interactive Raw Video Sanitization & Verified Hour Calculation Strip */}
          <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--egvox-border-default)] pb-5">
              <div>
                <h3 className="text-lg font-bold text-[var(--egvox-text-primary)]">
                  {locale === 'id'
                    ? 'Alur Pengolahan Video Mentah, Penghapusan Wajah & Kalkulasi Jam Valid'
                    : 'Raw Footage Sanitization, Face Removal & Verified Hour Metering'}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[var(--egvox-text-secondary)]">
                  {locale === 'id'
                    ? 'Setiap setor video mentah diseleksi secara objektif: hanya segmen gerakan yang dibutuhkan yang diambil, frame berisi wajah dipotong permanen, dan durasi valid dihitung per jam oleh Tim EgvoX.'
                    : 'Every raw submission is objectively curated: only required task movements are extracted, accidental face frames are permanently cut, and verified active hours are metered by EgvoX.'}
                </p>
              </div>
              <div className="inline-flex flex-wrap gap-1.5 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-1 shrink-0">
                {RAW_PIPELINE_STAGES.map((stage) => {
                  const active = activePipelineStageId === stage.id;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setActivePipelineStageId(stage.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#027F86] text-white'
                          : 'text-[var(--egvox-text-secondary)] hover:text-[var(--egvox-text-primary)]'
                      }`}
                    >
                      {stage.step}. {locale === 'id' ? stage.shortId : stage.shortEn}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {RAW_PIPELINE_STAGES.map((stage) => {
                const isSelected = activePipelineStageId === stage.id;
                const Icon =
                  stage.id === 'quarantine'
                    ? Lock
                    : stage.id === 'trim'
                    ? Scissors
                    : Clock;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActivePipelineStageId(stage.id)}
                    className={`text-left rounded-xl border p-5 transition-colors ${
                      isSelected
                        ? 'border-[#027F86] bg-[#027F86]/6'
                        : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] hover:border-[#027F86]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-[#027F86] dark:text-[#04B8B4] tabular-nums">
                        {stage.step} · {locale === 'id' ? stage.shortId : stage.shortEn}
                      </span>
                      <Icon className="h-4 w-4 text-[#027F86] dark:text-[#04B8B4]" />
                    </div>
                    <h4 className="mt-2.5 text-sm font-bold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? stage.titleId : stage.titleEn}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--egvox-text-secondary)]">
                      {locale === 'id' ? stage.descId : stage.descEn}
                    </p>
                  </button>
                );
              })}
            </div>

            {(() => {
              const activeStage =
                RAW_PIPELINE_STAGES.find((s) => s.id === activePipelineStageId) ||
                RAW_PIPELINE_STAGES[1];
              return (
                <div className="flex items-start gap-2.5 rounded-xl border border-[#027F86]/25 bg-[#027F86]/6 px-4 py-3 text-xs text-[var(--egvox-text-primary)]">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#027F86] dark:text-[#04B8B4] mt-0.5" />
                  <p className="leading-relaxed">
                    {locale === 'id' ? activeStage.outcomeId : activeStage.outcomeEn}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Two-Column Split: Cara Membuat Video Egocentric (Left) & Keamanan Data Industri (Right) */}
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Left: Capture Protocol for Contributors */}
            <div className="lg:col-span-6 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <Camera className="h-5 w-5 text-[#027F86] dark:text-[#04B8B4]" />
                  <h3 className="text-lg font-bold text-[var(--egvox-text-primary)]">
                    {locale === 'id'
                      ? 'Cara Membuat Video Sesuai Standar Industri AI'
                      : 'How to Record Compliant Egocentric Video'}
                  </h3>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-[var(--egvox-text-secondary)]">
                  {locale === 'id'
                    ? 'Ikuti empat aturan perekaman berikut agar video Anda lolos seleksi kualitas, bebas pelanggaran privasi, dan dihitung penuh oleh Tim QA EgvoX.'
                    : 'Follow these four recording rules so your footage passes quality selection, avoids privacy rejections, and earns full verified hours.'}
                </p>

                <div className="mt-5 divide-y divide-[var(--egvox-border-default)]">
                  {CAPTURE_STANDARDS_RULES.map((rule) => (
                    <div key={rule.num} className="py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-xs font-mono font-bold text-[#027F86] dark:text-[#04B8B4] tabular-nums shrink-0">
                          {rule.num}.
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                            {locale === 'id' ? rule.titleId : rule.titleEn}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--egvox-text-secondary)]">
                            {locale === 'id' ? rule.descId : rule.descEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--egvox-border-default)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[var(--egvox-text-muted)]">
                  {locale === 'id'
                    ? 'Hanya durasi aktivitas valid & bebas wajah yang dihitung ke payout'
                    : 'Only face-free, task-relevant duration counts toward payout'}
                </span>
                <Link
                  href="/onboarding/freelancer"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline whitespace-nowrap shrink-0"
                >
                  <span>{locale === 'id' ? 'Daftar Sebagai Kontributor' : 'Apply as Contributor'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Data Security Architecture for Egocentric Video */}
            <div className="lg:col-span-6 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <EyeOff className="h-5 w-5 text-[#027F86] dark:text-[#04B8B4]" />
                  <h3 className="text-lg font-bold text-[var(--egvox-text-primary)]">
                    {locale === 'id'
                      ? 'Lapisan Keamanan Data Pribadi Egocentric Video'
                      : 'Personal Data Security in Egocentric Video Ops'}
                  </h3>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-[var(--egvox-text-secondary)]">
                  {locale === 'id'
                    ? 'Perlindungan berlapis bagi kontributor dan pihak ketiga sekaligus menjamin keabsahan lisensi dataset bagi perusahaan AI dan robotika.'
                    : 'Multi-layered protection for contributors and bystanders while guaranteeing clean commercial dataset provenance for AI teams.'}
                </p>

                <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
                  {INDUSTRY_SECURITY_CONTROLS.map((ctrl) => (
                    <div
                      key={ctrl.titleEn}
                      className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4"
                    >
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--egvox-text-primary)]">
                        {locale === 'id' ? ctrl.titleId : ctrl.titleEn}
                      </h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--egvox-text-secondary)]">
                        {locale === 'id' ? ctrl.descId : ctrl.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--egvox-border-default)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[var(--egvox-text-muted)]">
                  {locale === 'id'
                    ? 'Audit log terverifikasi · Isolasi RBAC · Kepatuhan UU PDP & GDPR'
                    : 'Verified audit logs · RBAC isolation · GDPR-aligned consent'}
                </span>
                <Link
                  href="/enterprise/partnership"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#FC840E] hover:underline whitespace-nowrap shrink-0"
                >
                  <span>{locale === 'id' ? 'Ajukan Brief Enterprise' : 'Submit Enterprise Brief'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EKOSISTEM EGVOX, INDUSTRI & TRUST */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: locale === 'id' ? 'Kontributor / Freelancer' : 'Contributors / Freelancers',
              desc:
                locale === 'id'
                  ? 'Ambil proyek video egocentric, tawarkan jasa perekaman atau anotasi per jam, dan pantau pembayaran milestone.'
                  : 'Take egocentric capture briefs, publish hourly capture/annotation gigs, and track milestone payouts.',
              href: '/onboarding/freelancer',
              cta: locale === 'id' ? 'Daftar Freelancer' : 'Join as Freelancer',
              icon: Camera,
            },
            {
              title: 'Dataset Vendor / Provider',
              desc:
                locale === 'id'
                  ? 'Publikasikan Project Catalog, rekrut kontributor terverifikasi, dan kelola pengumpulan dataset dengan QA.'
                  : 'Publish Project Catalog briefs, hire vetted contributors, and oversee QA-backed collection.',
              href: '/onboarding/vendor',
              cta: locale === 'id' ? 'Daftar Dataset Vendor' : 'Register Dataset Vendor',
              icon: Building2,
            },
            {
              title: locale === 'id' ? 'Perusahaan / Enterprise' : 'Enterprise Buyers',
              desc:
                locale === 'id'
                  ? 'Kontrak proyek terkelola resmi dengan EgvoX untuk collection, annotation, QA, hingga delivery dataset.'
                  : 'Contract directly with EgvoX for managed capture, annotation, QA, and dataset packaging.',
              href: '/enterprise/partnership',
              cta: locale === 'id' ? 'Ajukan Enterprise Request' : 'Submit Enterprise Request',
              icon: FileCheck2,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 hover:border-[#027F86] transition-colors"
              >
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#027F86]/10 text-[#027F86] dark:text-[#04B8B4]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-[var(--egvox-text-primary)]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--egvox-text-secondary)]">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#027F86] dark:text-[#04B8B4] group-hover:underline">
                  <span>{card.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Solusi Industri */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--egvox-text-primary)]">
            {t.landing.industriesTitle}
          </h2>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Car, name: locale === 'id' ? 'Otomotif' : 'Automotive', slug: 'automotive' },
              { icon: Factory, name: locale === 'id' ? 'Manufaktur' : 'Manufacturing', slug: 'manufacturing' },
              { icon: Store, name: locale === 'id' ? 'Ritel' : 'Retail', slug: 'retail' },
              { icon: Truck, name: locale === 'id' ? 'Gudang' : 'Warehouse', slug: 'warehouse' },
              { icon: HeartPulse, name: locale === 'id' ? 'Kesehatan' : 'Healthcare', slug: 'healthcare' },
              { icon: GraduationCap, name: locale === 'id' ? 'Riset & Edukasi' : 'Research & Edu', slug: 'office' },
            ].map((ind) => {
              const Icon = ind.icon;
              return (
                <Link
                  key={ind.name}
                  href={`/categories/${ind.slug}`}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 text-center hover:border-[#027F86] transition-colors"
                >
                  <Icon className="h-5 w-5 text-[#027F86] dark:text-[#04B8B4]" />
                  <span className="text-xs font-semibold text-[var(--egvox-text-primary)]">
                    {ind.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Trust, Rights & Quality */}
        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Lock className="h-6 w-6 shrink-0 text-[#027F86] dark:text-[#04B8B4] mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-[var(--egvox-text-primary)]">
                {t.landing.trustTitle}
              </h2>
              <p className="mt-1 text-sm text-[var(--egvox-text-secondary)]">
                {locale === 'id'
                  ? 'Setiap aset video melewati tata kelola privasi, consent, dan QA berlapis sebelum dikirimkan ke buyer.'
                  : 'Every media asset passes privacy screening, explicit participant consent, and multi-stage QA prior to delivery.'}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(locale === 'id'
              ? [
                  { title: 'Private Raw Video Handling', desc: 'Video mentah hanya diunggah melalui signed upload session menuju zona karantina privat.' },
                  { title: 'Data Rights & Consent', desc: 'Mencatat izin kontributor, pihak ketiga, lokasi kerja, retensi, dan batasan lisensi.' },
                  { title: 'Acceptance Criteria Objektif', desc: 'Penolakan wajib disertai kode alasan dan bukti; mendukung partial acceptance.' },
                  { title: 'Audit & RBAC Isolasi', desc: 'Setiap perubahan peran, kontrak, lisensi, dan unduhan media tercatat di audit log.' },
                ]
              : [
                  { title: 'Private Raw Video Handling', desc: 'Raw footage uploads exclusively through signed sessions into isolated quarantine storage.' },
                  { title: 'Data Rights & Consent', desc: 'Tracks contributor, bystander, and workplace site consent alongside retention bounds.' },
                  { title: 'Objective Acceptance Criteria', desc: 'Rejections require structured QA reason codes and support partial batch approvals.' },
                  { title: 'Audit & RBAC Isolation', desc: 'Every role change, contract snapshot, and media download event is logged.' },
                ]
            ).map((tr) => (
              <div key={tr.title} className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4">
                <p className="text-xs font-bold text-[var(--egvox-text-primary)]">{tr.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--egvox-text-secondary)]">{tr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ENTERPRISE PARTNERSHIP REQUEST FORM & FAQ */}
      <section className="border-t border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6 min-w-0">
            <h2 className="text-2xl font-bold text-[var(--egvox-text-primary)]">
              {t.landing.enterpriseFormTitle}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--egvox-text-secondary)]">
              {t.landing.enterpriseFormSubtitle}
            </p>

            {inquirySubmitted ? (
              <div className="mt-6 rounded-2xl border border-[#16835D]/30 bg-[#16835D]/8 p-6 space-y-3">
                <div className="flex items-center gap-2 text-[#16835D] font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>
                    {locale === 'id'
                      ? 'Permintaan Enterprise Tercatat (Status: submitted)'
                      : 'Enterprise Inquiry Recorded (Status: submitted)'}
                  </span>
                </div>
                <p className="text-sm text-[var(--egvox-text-secondary)]">
                  {locale === 'id'
                    ? 'Tim Partnership EgvoX akan menghubungi Anda untuk sesi discovery, penentuan spesifikasi teknis, dan penyusunan proposal resmi.'
                    : 'EgvoX Partnership Team will reach out for discovery, technical capture specification alignment, and official proposal drafting.'}
                </p>
                <button
                  type="button"
                  onClick={() => setInquirySubmitted(false)}
                  className="rounded-lg border border-[#027F86] px-4 py-2 text-xs font-semibold text-[#027F86]"
                >
                  {locale === 'id' ? 'Kirim Permintaan Lain' : 'Submit Another Request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Nama Perusahaan *' : 'Company Name *'}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={locale === 'id' ? 'PT Contoh Teknologi' : 'Acme Robotics Inc.'}
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                    />
                    {inquiryErrors.companyName && (
                      <p className="mt-1 text-xs text-[#C43D3D]">{inquiryErrors.companyName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Negara *' : 'Country *'}
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                    >
                      <option value="Indonesia">Indonesia</option>
                      <option value="Singapore">{locale === 'id' ? 'Singapura' : 'Singapore'}</option>
                      <option value="Japan">{locale === 'id' ? 'Jepang' : 'Japan'}</option>
                      <option value="United States">{locale === 'id' ? 'Amerika Serikat' : 'United States'}</option>
                      <option value="Germany">{locale === 'id' ? 'Jerman' : 'Germany'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Email Bisnis *' : 'Business Email *'}
                    </label>
                    <input
                      type="email"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                    />
                    {inquiryErrors.businessEmail && (
                      <p className="mt-1 text-xs text-[#C43D3D]">{inquiryErrors.businessEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Website Perusahaan (Opsional)' : 'Company Website (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Kontak Penanggung Jawab *' : 'Contact Person *'}
                    </label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder={locale === 'id' ? 'Nama & Jabatan' : 'Full Name & Role'}
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                    />
                    {inquiryErrors.contactPerson && (
                      <p className="mt-1 text-xs text-[#C43D3D]">{inquiryErrors.contactPerson}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Nomor Telepon / WhatsApp PIC *' : 'PIC Phone / WhatsApp Number *'}
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder={locale === 'id' ? 'Contoh: +62 812-3456-7890' : 'e.g. +62 812-3456-7890'}
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm tabular-nums focus:border-[#027F86] focus:outline-none"
                    />
                    {inquiryErrors.contactPhone && (
                      <p className="mt-1 text-xs text-[#C43D3D]">{inquiryErrors.contactPhone}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Kategori Domain Data *' : 'Data Domain Category *'}
                    </label>
                    <select
                      value={domainCategory}
                      onChange={(e) => setDomainCategory(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                    >
                      {ACTIVITY_CATEGORIES.map((cat) => (
                        <option key={cat.slug} value={cat.nameEn}>
                          {locale === 'id' ? cat.nameId : cat.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Estimasi Volume / Durasi (Per Jam) *' : 'Estimated Volume (Hours) *'}
                    </label>
                    <select
                      value={estimatedVolume}
                      onChange={(e) => setEstimatedVolume(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                    >
                      <option value="20 – 50 jam">
                        {locale === 'id' ? '20 – 50 jam video tervalidasi' : '20 – 50 verified video hours'}
                      </option>
                      <option value="50 – 250 jam">
                        {locale === 'id' ? '50 – 250 jam video tervalidasi' : '50 – 250 verified video hours'}
                      </option>
                      <option value="250 – 1.000 jam">
                        {locale === 'id' ? '250 – 1.000 jam (Skala Enterprise)' : '250 – 1,000 hours (Enterprise Scale)'}
                      </option>
                      <option value="1.000+ jam">
                        {locale === 'id' ? '1.000+ jam (Kustom Multi-Lokasi)' : '1,000+ hours (Multi-Region Custom)'}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Format Delivery & Anotasi *' : 'Delivery & Annotation Format *'}
                    </label>
                    <select
                      value={deliveryFormat}
                      onChange={(e) => setDeliveryFormat(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                    >
                      <option value="MP4 + JSONL">MP4 + JSONL (Temporal & BBox)</option>
                      <option value="MP4 + COCO JSON">MP4 + COCO JSON</option>
                      <option value="MP4 + CSV">MP4 + CSV Manifest</option>
                      <option value="Raw MP4 + Rights Manifest">Raw MP4 + Rights Manifest Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                      {locale === 'id' ? 'Target Tenggat Waktu' : 'Target Timeline / Deadline'}
                    </label>
                    <input
                      type="text"
                      value={targetDeadline}
                      onChange={(e) => setTargetDeadline(e.target.value)}
                      placeholder="Q2 2026 / 8 minggu"
                      className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
                    {locale === 'id' ? 'Kebutuhan Data & Spesifikasi *' : 'Data Requirements & Specs *'}
                  </label>
                  <textarea
                    rows={3}
                    value={requirementSummary}
                    onChange={(e) => setRequirementSummary(e.target.value)}
                    placeholder={
                      locale === 'id'
                        ? 'Jelaskan kategori aktivitas, format anotasi, lokasi perekaman, dan target waktu...'
                        : 'Describe target activities, annotation schemas, regions, and timeline...'
                    }
                    className="mt-1 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
                  />
                  {inquiryErrors.requirementSummary && (
                    <p className="mt-1 text-xs text-[#C43D3D]">{inquiryErrors.requirementSummary}</p>
                  )}
                </div>

                <div className="rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--egvox-text-primary)]">
                      <FileUp className="h-4 w-4 text-[#027F86]" />
                      <span>
                        {locale === 'id'
                          ? 'Upload Dokumen Penawaran / Brief Teknis (Opsional)'
                          : 'Upload Proposal / Technical Brief Document (Optional)'}
                      </span>
                    </label>
                    {attachmentName && (
                      <button
                        type="button"
                        onClick={() => setAttachmentName('')}
                        className="text-[11px] font-semibold text-[#C43D3D] hover:underline"
                      >
                        {locale === 'id' ? 'Hapus' : 'Remove'}
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
                    onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '')}
                    className="block w-full text-xs text-[var(--egvox-text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[#027F86]/12 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#027F86] hover:file:bg-[#027F86]/20"
                  />
                  <p className="text-[11px] text-[var(--egvox-text-muted)]">
                    {attachmentName
                      ? `${locale === 'id' ? 'Dokumen terpilih:' : 'Selected file:'} ${attachmentName}`
                      : locale === 'id'
                      ? 'Opsional (tidak wajib). Format: PDF, DOCX, XLSX, PPTX, atau ZIP.'
                      : 'Optional (not mandatory). Formats: PDF, DOCX, XLSX, PPTX, or ZIP.'}
                  </p>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[var(--egvox-text-secondary)]">
                  <input
                    type="checkbox"
                    checked={consentToContact}
                    onChange={(e) => setConsentToContact(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-[#027F86]"
                  />
                  <span>
                    {locale === 'id'
                      ? 'Saya menyetujui tim EgvoX menghubungi saya untuk proses kualifikasi kebutuhan enterprise.'
                      : 'I consent to EgvoX contacting me to scope this enterprise dataset request.'}
                  </span>
                </label>
                {inquiryErrors.consentToContact && (
                  <p className="text-xs text-[#C43D3D]">{inquiryErrors.consentToContact}</p>
                )}

                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#027F86] px-6 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
                >
                  <span>
                    {locale === 'id' ? 'Kirim Permintaan Kemitraan' : 'Submit Partnership Request'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="lg:col-span-6 min-w-0">
            <h2 className="text-2xl font-bold text-[var(--egvox-text-primary)]">
              {t.landing.faqTitle}
            </h2>
            <div className="mt-6 space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                const q = locale === 'id' ? item.qId : item.qEn;
                const a = locale === 'id' ? item.aId : item.aEn;
                return (
                  <div
                    key={q}
                    className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[var(--egvox-text-primary)]"
                    >
                      <span>{q}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[var(--egvox-text-muted)] transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[var(--egvox-border-default)] px-5 py-3.5 text-sm leading-relaxed text-[var(--egvox-text-secondary)]">
                        {a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
