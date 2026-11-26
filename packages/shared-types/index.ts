export type Locale = 'id' | 'en';

export type PublicUserRole =
  | 'guest'
  | 'freelancer'
  | 'vendor'
  | 'enterprise';

export type DataModality = 'Video' | 'Gambar' | 'Multimodal';

export type AnnotationRequirement = 'none' | 'optional' | 'required';

export type ActivityCategorySlug =
  | 'cooking'
  | 'manufacturing'
  | 'automotive'
  | 'warehouse'
  | 'household'
  | 'retail'
  | 'healthcare'
  | 'office';

export interface CategoryInfo {
  slug: ActivityCategorySlug;
  nameId: string;
  nameEn: string;
  projectCount: number;
  serviceCount: number;
  descriptionId: string;
  descriptionEn: string;
  requiresComplianceGate?: boolean;
}

export interface CaptureSpecification {
  version: string;
  perspective: 'Egocentric (First-Person)' | 'Multi-Angle + Egocentric';
  mounting: 'Head-mounted' | 'Chest-mounted' | 'Wearable Glasses' | 'Handheld';
  deviceRequirement: string;
  deviceRequirementEn?: string;
  resolution: string;
  resolutionEn?: string;
  frameRate: string;
  frameRateEn?: string;
  codecFormat: string;
  orientation: 'Landscape 16:9' | 'Portrait 9:16';
  clipDuration: string;
  clipDurationEn?: string;
  audioPolicy: 'Required' | 'Optional' | 'Forbidden';
  stabilization: string;
  stabilizationEn?: string;
  gpsPolicy: string;
  gpsPolicyEn?: string;
  consentPolicy: string;
  consentPolicyEn?: string;
  privacyRedaction: string;
  privacyRedactionEn?: string;
}

export interface ProjectMilestone {
  step: number;
  titleId: string;
  titleEn: string;
  sharePercent: number;
  dueLabel: string;
  dueLabelEn?: string;
}

export interface ProjectListing {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  category: ActivityCategorySlug;
  categoryLabel: string;
  categoryLabelEn?: string;
  dataType: DataModality;
  captureType: string;
  vendorSlug: string;
  vendorName: string;
  vendorVerified: boolean;
  vendorRating: number;
  vendorReviewCount: number;
  country: string;
  location: string;
  locationEn?: string;
  targetVolume: number;
  unitLabel: string;
  unitLabelEn?: string;
  ratePerUnit: number;
  currency: 'IDR' | 'USD';
  deadline: string;
  deadlineEn?: string;
  applicationCloseDate: string;
  applicationCloseDateEn?: string;
  annotationRequired: AnnotationRequirement;
  status: 'published' | 'applications_open';
  previewImage: string;
  previewDuration: string;
  captureSpec: CaptureSpecification;
  acceptanceCriteria: string[];
  acceptanceCriteriaEn: string[];
  rightsSummary: string;
  rightsSummaryEn: string;
  milestones: ProjectMilestone[];
  faq: { q: string; a: string }[];
  faqEn?: { q: string; a: string }[];
}

export interface PortfolioPreview {
  id: string;
  title: string;
  titleEn?: string;
  duration: string;
  thumbnail: string;
  consentVerified: boolean;
  watermarked: boolean;
}

export interface FreelancerReview {
  id: string;
  buyerName: string;
  buyerOrg: string;
  rating: number;
  date: string;
  comment: string;
  commentEn?: string;
  orderScope: string;
  orderScopeEn?: string;
}

export interface FreelancerServiceListing {
  id: string;
  slug: string;
  username: string;
  freelancerName: string;
  avatar: string;
  verified: boolean;
  kycStatus: 'verified' | 'pending';
  available: boolean;
  roleType: 'Video Contributor' | 'Data Annotator' | 'QA Reviewer';
  levelBadge: 'Level Expert' | 'Level Pro' | 'Verified Talent';
  rating: number;
  reviewCount: number;
  completedOrders: number;
  slaPercent: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  categories: ActivityCategorySlug[];
  tags: string[];
  location: string;
  locationEn?: string;
  country: string;
  capacityLabel: string;
  capacityLabelEn?: string;
  deliverySla: string;
  deliverySlaEn?: string;
  pricePerUnit: number;
  unitLabel: string;
  unitLabelEn?: string;
  currency: 'IDR' | 'USD';
  equipment: string[];
  equipmentEn?: string[];
  resolutionFps: string;
  resolutionFpsEn?: string;
  annotationTools?: string[];
  supportedSchemas?: string[];
  portfolioPreviews: PortfolioPreview[];
  exclusions: string[];
  exclusionsEn?: string[];
  terms: string[];
  termsEn?: string[];
  reviews: FreelancerReview[];
}

export interface VendorOrganization {
  slug: string;
  name: string;
  legalName: string;
  country: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  activeProjects: number;
  completedProjects: number;
  industry: string;
  summary: string;
  summaryEn: string;
  website: string;
}

export interface CartOrderItem {
  id: string;
  kind: 'project_package' | 'service_order' | 'annotation_addon';
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  unitPrice: number;
  quantity: number;
  unitLabel: string;
  unitLabelEn?: string;
  thumbnail: string;
}

export interface SavedProposal {
  id: string;
  projectSlug: string;
  projectTitle: string;
  projectTitleEn?: string;
  vendorName: string;
  volume: number;
  estimatedTotal: number;
  note: string;
  noteEn?: string;
  attachmentName?: string;
  status: 'submitted' | 'accepted' | 'countered' | 'under_review' | 'rejected';
  createdAt: string;
  createdAtEn?: string;
}

export interface ActiveWorkOrder {
  id: string;
  code: string;
  title: string;
  titleEn?: string;
  counterparty: string;
  rolePerspective: 'freelancer' | 'vendor' | 'enterprise';
  specVersion: string;
  stage: 'order_confirmed' | 'in_production' | 'qa_review' | 'delivered';
  progressPercent: number;
  acceptedUnits: number;
  totalUnits: number;
  unitLabel: string;
  unitLabelEn?: string;
  amount: number;
  deadline: string;
  deadlineEn?: string;
}

export interface WorkspaceNotification {
  id: string;
  titleId: string;
  titleEn: string;
  bodyId: string;
  bodyEn: string;
  timeLabel: string;
  timeLabelEn?: string;
  read: boolean;
  href: string;
}

export interface WorkspaceMessageItem {
  id: string;
  sender: string;
  senderEn?: string;
  senderRole: 'freelancer' | 'vendor' | 'operations';
  text: string;
  textEn?: string;
  timestamp: string;
  timestampEn?: string;
  isOwn?: boolean;
}

export interface WorkspaceConversation {
  id: string;
  partnerName: string;
  partnerRoleLabelId: string;
  partnerRoleLabelEn: string;
  contextTitle: string;
  unread: number;
  messages: WorkspaceMessageItem[];
}

export interface SubmissionFileItem {
  id: string;
  workOrderId: string;
  fileName: string;
  durationLabel: string;
  durationLabelEn?: string;
  sizeLabel: string;
  checksumSha256: string;
  status: 'accepted' | 'rework_required' | 'technical_review' | 'quarantine';
  qaReasonId?: string;
  qaReasonEn?: string;
}

export interface NegotiationOffer {
  id: string;
  projectTitle: string;
  projectTitleEn?: string;
  counterparty: string;
  proposedRatePerHour: number;
  proposedVolumeHours: number;
  status: 'sent' | 'countered' | 'accepted' | 'rejected';
  note: string;
  noteEn?: string;
  updatedAt: string;
  updatedAtEn?: string;
}

export interface PayoutRequestRecord {
  id: string;
  amount: number;
  destination: string;
  destinationEn?: string;
  status: 'pending_review' | 'settled';
  createdAt: string;
  createdAtEn?: string;
}

export interface OrderReviewRecord {
  id: string;
  targetName: string;
  workOrderCode: string;
  rating: number;
  comment: string;
  commentEn?: string;
  createdAt: string;
  createdAtEn?: string;
}

export type GoogleWorkspaceServiceId =
  | 'drive'
  | 'sheets'
  | 'gmail'
  | 'calendar'
  | 'docs'
  | 'tasks';

export interface WorkspaceDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface WorkspaceCalendarEvent {
  id: string;
  summary: string;
  start?: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export interface WorkspaceGmailMessage {
  id: string;
  snippet?: string;
  subject?: string;
  from?: string;
}

export interface WorkspaceTaskListItem {
  id: string;
  title: string;
  status?: string;
  due?: string;
}
