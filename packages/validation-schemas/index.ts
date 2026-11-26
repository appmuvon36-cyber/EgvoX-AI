import { Locale } from '@/packages/shared-types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateProposalForm(
  data: {
    volume: number;
    deviceSummary?: string;
    note: string;
  },
  locale: Locale = 'id'
): ValidationResult {
  const errors: Record<string, string> = {};
  if (!Number.isFinite(data.volume) || data.volume < 1) {
    errors.volume =
      locale === 'id'
        ? 'Estimasi kapasitas minimal 1 jam.'
        : 'Minimum capacity commitment is 1 hour.';
  }
  if (data.deviceSummary !== undefined && data.deviceSummary.trim().length < 3) {
    errors.deviceSummary =
      locale === 'id'
        ? 'Sebutkan perangkat kamera / tools yang Anda miliki.'
        : 'Specify your camera rig or annotation tools.';
  }
  if (data.note.trim().length < 10) {
    errors.note =
      locale === 'id'
        ? 'Ringkasan kualifikasi minimal 10 karakter agar vendor dapat mengevaluasi kesesuaian teknis.'
        : 'Qualification summary must be at least 10 characters for vendor fit evaluation.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateRecruitmentOfferForm(
  data: {
    projectTitle: string;
    volumeHours: number;
    grossFeeIDR: number;
    bindingType: 'binding' | 'screening';
    requiresConflictCheck: boolean;
    conflictChecked: boolean;
    deadline: string;
  },
  locale: Locale = 'id'
): ValidationResult {
  const errors: Record<string, string> = {};
  if (!data.projectTitle.trim()) {
    errors.projectTitle =
      locale === 'id' ? 'Nama pekerjaan / proyek wajib diisi.' : 'Project or assignment title is required.';
  }
  if (!Number.isFinite(data.volumeHours) || data.volumeHours < 1) {
    errors.volumeHours =
      locale === 'id' ? 'Volume minimal 1 jam / unit.' : 'Minimum volume is 1 hour / unit.';
  }
  if (data.bindingType === 'binding' && (!Number.isFinite(data.grossFeeIDR) || data.grossFeeIDR < 100000)) {
    errors.grossFeeIDR =
      locale === 'id'
        ? 'Penawaran Fee (Gross) minimal Rp 100.000 untuk penawaran mengikat.'
        : 'Gross fee offer must be at least Rp 100,000 for binding offers.';
  }
  if (!data.deadline.trim()) {
    errors.deadline =
      locale === 'id' ? 'Tenggat waktu wajib diisi.' : 'Target deadline is required.';
  }
  if (data.requiresConflictCheck && !data.conflictChecked) {
    errors.conflictChecked =
      locale === 'id'
        ? 'Deklarasi independensi QA Specialist wajib dicentang (tidak mereview karya sendiri).'
        : 'QA Specialist independence declaration is required (no self-review).';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateCounterofferForm(
  data: {
    grossFeeIDR: number;
    rationale: string;
  },
  locale: Locale = 'id'
): ValidationResult {
  const errors: Record<string, string> = {};
  if (!Number.isFinite(data.grossFeeIDR) || data.grossFeeIDR < 100000) {
    errors.grossFeeIDR =
      locale === 'id' ? 'Nominal counteroffer minimal Rp 100.000.' : 'Counteroffer gross fee must be at least Rp 100,000.';
  }
  if (data.rationale.trim().length < 10) {
    errors.rationale =
      locale === 'id'
        ? 'Alasan perubahan & delta scope wajib diisi minimal 10 karakter.'
        : 'Change rationale & scope delta must be at least 10 characters.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}


export function validateEnterpriseInquiry(
  data: {
    companyName: string;
    businessEmail: string;
    contactPerson: string;
    contactPhone?: string;
    country: string;
    estimatedVolume: string;
    requirementSummary: string;
    consentToContact: boolean;
  },
  locale: Locale = 'id'
): ValidationResult {
  const errors: Record<string, string> = {};
  if (!data.companyName.trim()) {
    errors.companyName =
      locale === 'id'
        ? 'Nama perusahaan wajib diisi.'
        : 'Company name is required.';
  }
  if (!validateEmail(data.businessEmail)) {
    errors.businessEmail =
      locale === 'id'
        ? 'Masukkan email bisnis yang valid.'
        : 'Please enter a valid business email.';
  }
  if (!data.contactPerson.trim()) {
    errors.contactPerson =
      locale === 'id'
        ? 'Nama penanggung jawab wajib diisi.'
        : 'Contact person name & role is required.';
  }
  const cleanPhone = (data.contactPhone || '').replace(/[^0-9+]/g, '');
  if (cleanPhone.length < 8) {
    errors.contactPhone =
      locale === 'id'
        ? 'Nomor telepon / WhatsApp PIC wajib diisi (min. 8 digit).'
        : 'PIC phone / WhatsApp number is required (min. 8 digits).';
  }
  if (!data.country.trim()) {
    errors.country =
      locale === 'id' ? 'Negara wajib dipilih.' : 'Country is required.';
  }
  if (!data.estimatedVolume.trim()) {
    errors.estimatedVolume =
      locale === 'id'
        ? 'Estimasi volume jam video wajib diisi.'
        : 'Estimated video hours volume is required.';
  }
  if (data.requirementSummary.trim().length < 15) {
    errors.requirementSummary =
      locale === 'id'
        ? 'Jelaskan kebutuhan data minimal 15 karakter.'
        : 'Please describe your data requirements (at least 15 characters).';
  }
  if (!data.consentToContact) {
    errors.consentToContact =
      locale === 'id'
        ? 'Persetujuan kontak diperlukan untuk menindaklanjuti permintaan.'
        : 'Consent to contact is required to process this partnership request.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
