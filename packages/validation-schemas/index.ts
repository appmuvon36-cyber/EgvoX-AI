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
    note: string;
  },
  locale: Locale = 'id'
): ValidationResult {
  const errors: Record<string, string> = {};
  if (!Number.isFinite(data.volume) || data.volume < 1) {
    errors.volume =
      locale === 'id'
        ? 'Volume minimal 1 jam.'
        : 'Minimum proposed volume is 1 hour.';
  }
  if (data.note.trim().length < 10) {
    errors.note =
      locale === 'id'
        ? 'Catatan kesiapan minimal 10 karakter agar vendor dapat menilai kesesuaian spesifikasi.'
        : 'Readiness note must be at least 10 characters so the vendor can review specification fit.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateEnterpriseInquiry(
  data: {
    companyName: string;
    businessEmail: string;
    contactPerson: string;
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
