export interface ApiErrorEnvelope {
  error: { code: string; message: string; details?: Record<string, unknown> };
  request_id?: string;
}

export interface ProfileDTO {
  id: string;
  display_name: string | null;
  phone: string | null;
  country_code: string | null;
  city: string | null;
  bio: string | null;
  status: 'active' | 'suspended' | 'deleted';
  onboarding_completed_at: string | null;
  locale: 'id' | 'en';
  timezone: string;
  active_organization_id: string | null;
}

export interface MeDTO {
  user_id: string;
  email: string;
  profile: ProfileDTO;
}

export interface RoleDTO {
  id: string;
  display_name: string;
  scope: 'persona' | 'organization' | 'platform';
  organization_id: string | null;
  status: string;
}

export interface RoleListDTO {
  items: RoleDTO[];
}

export interface SessionDTO {
  authenticated: boolean;
  user_id: string;
  aal: 'aal1' | 'aal2';
  recent_mfa: boolean;
  expires_at: number | null;
}

export interface OrganizationDTO {
  id: string;
  kind: 'vendor' | 'enterprise';
  legal_name: string;
  verification_status: 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'rejected';
  role_id: string | null;
  membership_status: string | null;
  created_at: string;
}

export interface OrganizationListDTO {
  items: OrganizationDTO[];
}

export interface InvitationDTO {
  id: string;
  email: string;
  role_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'revoked' | 'expired';
  expires_at: string;
  created_at: string | null;
}

export interface VerificationCaseDTO {
  id: string;
  subject_type: 'freelancer' | 'organization';
  subject_id: string;
  case_type: string;
  status: 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'rejected';
  review_reason: string | null;
  created_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
}

export interface VerificationDocumentDTO {
  id: string;
  original_filename: string;
  mime_type: 'application/pdf' | 'image/jpeg' | 'image/png';
  size_bytes: number;
  created_at: string | null;
}
