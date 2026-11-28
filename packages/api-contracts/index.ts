export type ApiErrorEnvelope = { error: { code: string; message: string; details?: Record<string, unknown>; request_id?: string } };
export type ApiEnvelope<T> = { data: T };
export type SessionStatus = { authenticated: boolean; user_id: string; aal: 'aal1' | 'aal2'; expires_at?: number };
export type ActorProfile = {
  id: string; display_name: string | null; phone: string | null; country_code: string | null;
  city: string | null; bio: string | null; status: 'active' | 'suspended' | 'deleted';
  locale: 'id' | 'en'; timezone: string; onboarding_completed_at: string | null;
};
export type ActorRole = {
  id: string; display_name: string; scope: 'persona' | 'organization' | 'platform';
  organization_id: string | null; status: string;
};
export type Organization = {
  id: string; kind: 'vendor' | 'enterprise'; legal_name: string;
  verification_status: 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'rejected';
  role_id?: string;
};
export type OrganizationInvitation = {
  id: string; email: string; role_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'revoked' | 'expired'; expires_at: string;
};
export type VerificationCase = {
  id: string; subject_type: 'freelancer' | 'organization'; case_type: string;
  status: 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'rejected';
  review_reason?: string | null; created_at: string;
};
