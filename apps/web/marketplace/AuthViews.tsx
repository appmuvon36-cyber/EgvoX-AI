'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  FileCheck2,
  Lock,
  Mail,
} from 'lucide-react';
import { EgvoXLogo } from '@/packages/design-system';
import { googleSignIn } from '@/lib/google-workspace/auth';
import { useAppState } from '@/lib/hooks/useAppState';

export const GoogleSignInOfficialButton: React.FC<{
  onSuccess?: () => void;
  label?: string;
}> = ({ onSuccess, label }) => {
  const { locale, showToast } = useAppState();
  const displayLabel = label ?? (locale === 'id' ? 'Masuk dengan Google' : 'Sign in with Google');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        showToast(
          locale === 'id'
            ? `Terhubung dengan Google (${res.user.email || 'Workspace Active'}).`
            : `Connected with Google (${res.user.email || 'Workspace Active'}).`
        );
        onSuccess?.();
      }
    } catch {
      showToast(
        locale === 'id'
          ? 'Autentikasi Google dibatalkan atau membutuhkan izin popup.'
          : 'Google sign-in was cancelled or requires popup permission.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-[var(--egvox-border-default)] bg-white px-4 text-sm font-semibold text-[#102326] hover:bg-[#F4F8F8] transition-colors disabled:opacity-60"
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5 shrink-0"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
      <span>
        {loading
          ? locale === 'id'
            ? 'Menghubungkan...'
            : 'Connecting...'
          : displayLabel}
      </span>
    </button>
  );
};

export const RegisterView: React.FC<{ initialType?: string }> = ({
  initialType,
}) => {
  const router = useRouter();
  const { locale, setActiveRole, showToast } = useAppState();
  const [selectedRole, setSelectedRole] = useState<
    'freelancer' | 'vendor' | 'enterprise'
  >(
    initialType === 'vendor'
      ? 'vendor'
      : initialType === 'enterprise'
      ? 'enterprise'
      : 'freelancer'
  );
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !agreed) return;
    setActiveRole(selectedRole);
    showToast(
      locale === 'id'
        ? 'Akun terdaftar. Silakan lanjutkan langkah onboarding peran Anda.'
        : 'Account created. Please complete your role onboarding.'
    );
    router.push(`/onboarding/${selectedRole}`);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <EgvoXLogo width={128} />
          </div>
          <h1 className="text-xl font-bold text-[var(--egvox-text-primary)]">
            {step === 'role'
              ? locale === 'id'
                ? 'Pilih Peran Anda di EgvoX'
                : 'Select Your EgvoX Role'
              : locale === 'id'
              ? 'Buat Akun EgvoX'
              : 'Create EgvoX Account'}
          </h1>
          <p className="text-xs text-[var(--egvox-text-muted)]">
            {locale === 'id'
              ? 'Registrasi publik khusus untuk Freelancer, Dataset Vendor, dan Enterprise Buyer.'
              : 'Public registration is available for Freelancers, Dataset Vendors, and Enterprise Buyers.'}
          </p>
        </div>

        {step === 'role' ? (
          <div className="space-y-3">
            {[
              {
                id: 'freelancer' as const,
                icon: Camera,
                title: 'Freelancer (Contributor / Annotator)',
                desc:
                  locale === 'id'
                    ? 'Menawarkan layanan video egocentric, anotasi data per jam, atau QA review.'
                    : 'Offer hourly egocentric video capture, annotation, or QA review services.',
              },
              {
                id: 'vendor' as const,
                icon: Building2,
                title: 'Dataset Vendor / Data Provider',
                desc:
                  locale === 'id'
                    ? 'Mempublikasikan Project Catalog dan merekrut kontributor terverifikasi.'
                    : 'Publish Project Catalog briefs and hire verified contributors.',
              },
              {
                id: 'enterprise' as const,
                icon: FileCheck2,
                title: 'Enterprise Buyer',
                desc:
                  locale === 'id'
                    ? 'Mengajukan kebutuhan dataset skala besar melalui kontrak resmi terkelola.'
                    : 'Request large-scale custom datasets through managed EgvoX contracts.',
              },
            ].map((role) => {
              const Icon = role.icon;
              const active = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full flex items-start gap-3.5 rounded-xl border p-4 text-left transition-colors ${
                    active
                      ? 'border-[#027F86] bg-[#027F86]/8'
                      : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-canvas)]'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      active
                        ? 'bg-[#027F86] text-white'
                        : 'bg-[var(--egvox-bg-subtle)] text-[#027F86]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="block">
                    <span className="block text-sm font-bold text-[var(--egvox-text-primary)]">
                      {role.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--egvox-text-secondary)]">
                      {role.desc}
                    </span>
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setStep('form')}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#027F86] text-sm font-semibold text-white hover:bg-[#039998]"
            >
              <span>{locale === 'id' ? 'Lanjutkan' : 'Continue'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold">
                {locale === 'id' ? 'Nama Lengkap' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Farhan Fadliansyah"
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold">
                {locale === 'id' ? 'Kata Sandi' : 'Password'}
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={locale === 'id' ? 'Minimal 8 karakter' : 'Minimum 8 characters'}
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <label className="flex items-start gap-2 text-xs text-[var(--egvox-text-secondary)]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#027F86]"
              />
              <span>
                {locale === 'id'
                  ? 'Saya setuju dengan Syarat & Ketentuan serta Kebijakan Privasi EgvoX.'
                  : 'I agree to the EgvoX Terms of Service and Privacy Policy.'}
              </span>
            </label>

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#027F86] text-sm font-semibold text-white hover:bg-[#039998]"
            >
              {locale === 'id' ? 'Daftar Akun' : 'Register Account'}
            </button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-[var(--egvox-border-default)]" />
              <span className="mx-3 shrink text-xs text-[var(--egvox-text-muted)]">
                {locale === 'id' ? 'atau daftar dengan' : 'or sign up with'}
              </span>
              <div className="flex-grow border-t border-[var(--egvox-border-default)]" />
            </div>

            <GoogleSignInOfficialButton
              label={locale === 'id' ? 'Daftar dengan Google' : 'Sign up with Google'}
              onSuccess={() => {
                setActiveRole(selectedRole);
                router.push(`/onboarding/${selectedRole}`);
              }}
            />

            <button
              type="button"
              onClick={() => setStep('role')}
              className="w-full text-center text-xs font-medium text-[var(--egvox-text-muted)] hover:underline"
            >
              &larr; {locale === 'id' ? 'Ubah Peran' : 'Change Role'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-[var(--egvox-text-muted)]">
          {locale === 'id' ? 'Sudah punya akun?' : 'Already have an account?'}{' '}
          <Link href="/login" className="font-semibold text-[#027F86] hover:underline">
            {locale === 'id' ? 'Masuk' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export const LoginView: React.FC = () => {
  const router = useRouter();
  const { locale, setActiveRole, showToast } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setActiveRole('freelancer');
    showToast(
      locale === 'id'
        ? 'Berhasil masuk ke EgvoX Workspace.'
        : 'Signed in to EgvoX Workspace.'
    );
    router.push('/workspace');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <EgvoXLogo width={128} />
          </div>
          <h1 className="text-xl font-bold text-[var(--egvox-text-primary)]">
            {locale === 'id' ? 'Masuk ke EgvoX' : 'Sign In to EgvoX'}
          </h1>
          <p className="text-xs text-[var(--egvox-text-muted)]">
            {locale === 'id'
              ? 'Akses Marketplace & Workspace untuk Freelancer, Vendor, dan Enterprise.'
              : 'Access Marketplace & Workspace for Freelancers, Vendors, and Enterprise.'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold">
                {locale === 'id' ? 'Kata Sandi' : 'Password'}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#027F86] hover:underline"
              >
                {locale === 'id' ? 'Lupa kata sandi?' : 'Forgot password?'}
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#027F86] text-sm font-semibold text-white hover:bg-[#039998]"
          >
            <Lock className="h-4 w-4" />
            <span>{locale === 'id' ? 'Masuk' : 'Sign In'}</span>
          </button>
        </form>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-[var(--egvox-border-default)]" />
          <span className="mx-3 shrink text-xs text-[var(--egvox-text-muted)]">
            {locale === 'id' ? 'atau masuk dengan' : 'or sign in with'}
          </span>
          <div className="flex-grow border-t border-[var(--egvox-border-default)]" />
        </div>

        <GoogleSignInOfficialButton
          onSuccess={() => {
            setActiveRole('freelancer');
            router.push('/workspace');
          }}
        />

        <p className="text-center text-xs text-[var(--egvox-text-muted)]">
          {locale === 'id' ? 'Belum punya akun?' : "Don't have an account?"}{' '}
          <Link href="/register" className="font-semibold text-[#027F86] hover:underline">
            {locale === 'id' ? 'Daftar Akun Baru' : 'Create New Account'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordView: React.FC = () => {
  const { locale } = useAppState();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-5">
        <h1 className="text-xl font-bold">
          {locale === 'id' ? 'Reset Kata Sandi' : 'Reset Password'}
        </h1>
        {sent ? (
          <div className="space-y-3 text-sm text-[var(--egvox-text-secondary)]">
            <p className="flex items-center gap-2 text-[#16835D] font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              {locale === 'id'
                ? 'Tautan pemulihan telah dikirim.'
                : 'Recovery link sent.'}
            </p>
            <p>
              {locale === 'id'
                ? `Periksa kotak masuk email ${email} untuk melanjutkan pengaturan ulang kata sandi.`
                : `Check inbox for ${email} to continue resetting your password.`}
            </p>
            <Link href="/login" className="inline-block text-xs font-semibold text-[#027F86] hover:underline">
              &larr; {locale === 'id' ? 'Kembali ke Login' : 'Back to Sign In'}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4"
          >
            <p className="text-xs text-[var(--egvox-text-secondary)]">
              {locale === 'id'
                ? 'Masukkan email terdaftar Anda untuk menerima tautan reset kata sandi aman.'
                : 'Enter your registered email address to receive a secure password reset link.'}
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#027F86] text-sm font-semibold text-white"
            >
              {locale === 'id' ? 'Kirim Tautan Pemulihan' : 'Send Recovery Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const VerifyEmailView: React.FC = () => {
  const { locale } = useAppState();
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#027F86]/12 text-[#027F86]">
          <Mail className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold">
          {locale === 'id' ? 'Verifikasi Alamat Email Anda' : 'Verify Your Email Address'}
        </h1>
        <p className="text-sm text-[var(--egvox-text-secondary)]">
          {locale === 'id'
            ? 'Kami telah mengirimkan kode verifikasi ke email Anda untuk mengaktifkan akses Marketplace dan Workspace.'
            : 'We sent a verification code to your email to activate Marketplace and Workspace access.'}
        </p>
        <Link
          href="/workspace"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#027F86] px-6 text-sm font-semibold text-white"
        >
          {locale === 'id' ? 'Lanjutkan ke Workspace' : 'Continue to Workspace'}
        </Link>
      </div>
    </div>
  );
};
