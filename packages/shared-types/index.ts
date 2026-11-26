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
  showBudgetDisclosure?: boolean;
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
  roleType: 'Video Contributor' | 'Data Annotator' | 'QA Specialist';
  levelBadge: 'Level Expert' | 'Level Pro' | 'Verified Talent';
  rating: number;
  reviewCount: number;
  completedOrders: number;
  slaPercent: number;
  acceptanceRatePercent?: number;
  conflictDisclosureDeclared?: boolean;
  conflictDisclosureText?: string;
  conflictDisclosureTextEn?: string;
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
  weeklyCapacityHours?: number;
  deviceSummary?: string;
  estimatedTotal?: number;
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

export interface RecruiterWalletBalance {
  settledBalanceIDR: number;
  availableBalanceIDR: number;
  reservedBalanceIDR: number;
  committedBalanceIDR: number;
  paidOutIDR: number;
  pendingTopUpIDR: number;
  minPolicyIDR: number;
  vendorKybVerified: boolean;
}

export interface TopUpRecord {
  id: string;
  code: string;
  amountIDR: number;
  method: 'va' | 'qris' | 'ewallet' | 'card';
  status: 'pending_settlement' | 'settled';
  createdAt: string;
  settledAt?: string;
}

export interface RecruitmentOfferVersion {
  version: number;
  actorRole: 'recruiter' | 'freelancer';
  actorName: string;
  grossFeeIDR: number;
  adminFeeIDR: number;
  paymentFeeIDR: number;
  netFreelancerIDR: number;
  recruiterTotalIDR: number;
  volumeHours: number;
  note: string;
  noteEn?: string;
  scopeDelta?: string;
  timestamp: string;
}

export interface RecruitmentOffer {
  id: string;
  code: string;
  workType: 'Video Capture' | 'Data Annotation' | 'QA Specialist';
  projectTitle: string;
  projectTitleEn?: string;
  projectSlug?: string;
  recruiterOrg: string;
  freelancerUsername: string;
  freelancerName: string;
  bindingType: 'binding' | 'screening';
  status: 'draft' | 'sent' | 'negotiating' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
  grossFeeIDR: number;
  adminFeeIDR: number;
  paymentFeeIDR: number;
  feePayer: 'shared_transparent';
  recruiterTotalIDR: number;
  freelancerNetIDR: number;
  volumeHours: number;
  specVersion: string;
  deadline: string;
  milestonesSummary: string;
  revisionsCount: number;
  acceptanceSummary: string;
  expiresAt: string;
  conflictCheckPassed?: boolean;
  reservedAmountIDR: number;
  versions: RecruitmentOfferVersion[];
  updatedAt: string;
}

export interface StructuredClarification {
  id: string;
  offerCode: string;
  projectTitle: string;
  senderName: string;
  senderRole: 'recruiter' | 'freelancer';
  topic: 'spec' | 'schedule' | 'deliverables' | 'conflict_check';
  question: string;
  answer?: string;
  status: 'open' | 'resolved';
  createdAt: string;
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

// ================= DATA OPERATIONS WORKSPACE (ops.egvox.ai) =================

export type OpsStaffRole =
  | 'data_operations'
  | 'qa_reviewer'
  | 'project_manager'
  | 'annotation_ops';

export interface OpsProjectPackage {
  id: string;
  projectCode: string;
  nameId: string;
  nameEn: string;
  clientName: string;
  specVersion: string;
  totalPackages: number;
  completedPackages: number;
  progressPercent: number;
  stage: 'collection' | 'review' | 'qa' | 'packaging' | 'completed';
  slaPercent: number;
  deadline: string;
}

export interface OpsUploadSession {
  id: string;
  sessionCode: string;
  projectCode: string;
  uploaderName: string;
  uploadedFiles: number;
  totalFiles: number;
  uploadedSizeGb: number;
  totalSizeGb: number;
  progressPercent: number;
  status: 'uploading' | 'quarantine' | 'validating' | 'completed';
  startedAt: string;
}

export interface OpsQuarantineItem {
  id: string;
  fileName: string;
  projectCode: string;
  sessionCode: string;
  resolution: string;
  duration: string;
  codec: string;
  fps: number;
  sizeLabel: string;
  sha256: string;
  uploader: string;
  status:
    | 'quarantine'
    | 'technical_validation'
    | 'human_review'
    | 'accepted'
    | 'rework_required'
    | 'rejected';
  techChecks: {
    formatOk: boolean;
    resolutionOk: boolean;
    fpsOk: boolean;
    durationOk: boolean;
    codecOk: boolean;
    checksumOk: boolean;
  };
  contentChecks: {
    matchesSpec: boolean;
    piiFree: boolean;
    consentValid: boolean;
  };
  reasonCode?: string;
  thumbnail: string;
}

export interface AnnotationBoundingBox {
  id: string;
  trackId: string;
  label: string;
  category: 'object' | 'ingredient' | 'hand';
  color: string;
  confidence: number;
  top: number;
  left: number;
  width: number;
  height: number;
  note?: string;
}

export interface AnnotationTemporalSegment {
  id: string;
  code: string;
  label: string;
  startSec: number;
  endSec: number;
  color: string;
  trackType: 'segment' | 'hand' | 'knife' | 'object';
}

export interface OpsAnnotationProject {
  id: string;
  code: string;
  titleId: string;
  titleEn: string;
  projectCode: string;
  schemaVersion: string;
  annotatorName: string;
  reviewerName: string;
  taskCount: number;
  completedTasks: number;
  progressPercent: number;
  status: 'in_progress' | 'assigned' | 'review' | 'finalized';
  videoDurationSec: number;
  previewImage: string;
}

export interface OpsDeliveryPackage {
  id: string;
  packageCode: string;
  titleId: string;
  titleEn: string;
  buyerName: string;
  version: string;
  totalFiles: number;
  totalSizeGb: number;
  status: 'ready_for_delivery' | 'packaging' | 'delivered';
  manifestReady: boolean;
  annotationExportReady: boolean;
  rightsManifestReady: boolean;
  qaValidated: boolean;
  exportFormat: 'MP4 + JSONL' | 'MP4 + COCO JSON' | 'MP4 + CSV';
}

// ================= SUPER ADMIN CONTROL PLANE (admin.egvox.ai) =================

export interface AdminVerificationCase {
  id: string;
  entityName: string;
  email: string;
  roleType: 'Freelancer' | 'Vendor' | 'Enterprise';
  documentType: string;
  submittedAt: string;
  country: string;
  status: 'pending' | 'verified' | 'revision_requested' | 'rejected';
  riskTier: 'Low' | 'Standard' | 'Elevated';
}

export interface AdminModerationListing {
  id: string;
  code: string;
  titleId: string;
  titleEn: string;
  listingType: 'project' | 'service';
  ownerName: string;
  category: string;
  rateIDR: number;
  status: 'pending' | 'review' | 'approved' | 'revision_requested' | 'rejected';
  thumbnail: string;
  hasConsentEvidence: boolean;
}

export interface AdminEnterpriseDeal {
  id: string;
  companyName: string;
  briefSummary: string;
  estimatedHours: number;
  stage: 'request' | 'negotiation' | 'managed';
  contractValueIDR: number;
  picEmail: string;
  picName?: string;
  picPhone?: string;
  attachmentName?: string;
  officialProjectCode?: string;
}

export interface AdminFinanceRecord {
  id: string;
  code: string;
  kind: 'invoice' | 'payout' | 'reconciliation';
  counterparty: string;
  amountIDR: number;
  status: 'pending_dual_approval' | 'approved' | 'settled' | 'flagged';
  dateLabel: string;
  requiresDualApproval?: boolean;
}

export interface AdminRightsRecord {
  id: string;
  code: string;
  kind: 'consent' | 'license' | 'permitted_use';
  subjectTitle: string;
  projectCode: string;
  territory: string;
  retentionLabel: string;
  status: 'valid' | 'review' | 'revoked';
}

export interface AdminDisputeCase {
  id: string;
  code: string;
  workOrderCode: string;
  titleId: string;
  titleEn: string;
  claimant: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  amountAtRiskIDR: number;
  rationale: string;
}

export interface AdminAuditLogEntry {
  id: string;
  timestamp: string;
  actorCode: string;
  actorRole: string;
  activity: string;
  target: string;
  ipAddress: string;
  isBreakGlass?: boolean;
}

export interface AdminRbacRole {
  id: string;
  name: string;
  descriptionId: string;
  descriptionEn: string;
  userCount: number;
  permissions: string[];
}

