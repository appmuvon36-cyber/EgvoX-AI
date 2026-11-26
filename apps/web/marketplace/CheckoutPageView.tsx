'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  QrCode,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { egvoxFormatIDR, egvoxFormatUSD } from '@/packages/design-system';
import { TopUpRecord } from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';

export const CheckoutPageView: React.FC = () => {
  const {
    locale,
    recruiterWallet,
    topUpHistory,
    submitWalletTopUp,
    settlePendingTopUp,
  } = useAppState();
  const isId = locale === 'id';

  const [amountInput, setAmountInput] = useState('10000000');
  const [paymentMethod, setPaymentMethod] = useState<TopUpRecord['method']>('va');
  const [simulateInstantSettle, setSimulateInstantSettle] = useState(true);

  const numericAmount = Math.max(0, Number(amountInput) || 0);
  const meetsMinPolicy =
    recruiterWallet.settledBalanceIDR >= recruiterWallet.minPolicyIDR;

  const handleSubmitTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount < 500000) return;
    submitWalletTopUp(numericAmount, paymentMethod, simulateInstantSettle);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/workspace?role=vendor&tab=offers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>
              {isId ? 'Kembali ke Hub Rekrutmen & Saldo' : 'Back to Recruitment Hub'}
            </span>
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--egvox-text-primary)]">
            {isId
              ? 'Dompet Rekruter — Top Up & Settlement PSP'
              : 'Recruiter Wallet — Top Up & PSP Settlement'}
          </h1>
          <p className="mt-1 text-sm text-[var(--egvox-text-secondary)]">
            {isId
              ? 'Kelola Saldo Ledger Rekruter terotorisasi Payment Provider resmi sebelum mengirim penawaran rekrutmen mengikat.'
              : 'Manage your licensed Payment Provider-backed Recruiter Ledger Balance prior to sending binding recruitment offers.'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--egvox-text-secondary)] tabular-nums">
          <span>1 USD = Rp 16.000</span>
        </span>
      </div>

      {/* 4 Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4">
          <p className="text-xs text-[var(--egvox-text-muted)]">
            {isId ? 'Saldo Tersedia (Cleared)' : 'Available Balance (Cleared)'}
          </p>
          <p className="mt-1 text-xl font-bold text-[#027F86] dark:text-[#04B8B4] tabular-nums">
            {egvoxFormatIDR(recruiterWallet.availableBalanceIDR)}
          </p>
          <p className="text-[11px] text-[var(--egvox-text-muted)] tabular-nums">
            {egvoxFormatUSD(recruiterWallet.availableBalanceIDR)} USD
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4">
          <p className="text-xs text-[var(--egvox-text-muted)]">
            {isId ? 'Saldo Settled Total' : 'Total Settled Ledger'}
          </p>
          <p className="mt-1 text-xl font-bold text-[var(--egvox-text-primary)] tabular-nums">
            {egvoxFormatIDR(recruiterWallet.settledBalanceIDR)}
          </p>
          <p
            className={`text-[11px] font-semibold ${
              meetsMinPolicy ? 'text-[#16835D]' : 'text-[#C43D3D]'
            }`}
          >
            {meetsMinPolicy
              ? isId
                ? 'Memenuhi Min. Saldo (Rp 5 Juta)'
                : 'Meets Min. Policy (Rp 5M)'
              : isId
              ? 'Di bawah Min. Saldo Rp 5 Juta'
              : 'Below Min. Policy Rp 5M'}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4">
          <p className="text-xs text-[var(--egvox-text-muted)]">
            {isId ? 'Saldo Ditahan (Rekrutmen Aktif)' : 'Reserved (Active Offers)'}
          </p>
          <p className="mt-1 text-xl font-bold text-[#FC840E] tabular-nums">
            {egvoxFormatIDR(recruiterWallet.reservedBalanceIDR)}
          </p>
          <p className="text-[11px] text-[var(--egvox-text-muted)]">
            {isId ? 'Reservasi Penawaran Mengikat' : 'Binding Offer Reservations'}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4">
          <p className="text-xs text-[var(--egvox-text-muted)]">
            {isId ? 'Saldo Terpakai (Work Order)' : 'Committed (Work Orders)'}
          </p>
          <p className="mt-1 text-xl font-bold text-[var(--egvox-text-primary)] tabular-nums">
            {egvoxFormatIDR(recruiterWallet.committedBalanceIDR)}
          </p>
          <p className="text-[11px] text-[var(--egvox-text-muted)]">
            {isId ? 'Menunggu QA Acceptance' : 'Pending QA Acceptance'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Top-Up Form */}
        <form
          onSubmit={handleSubmitTopUp}
          className="lg:col-span-7 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 space-y-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
              {isId ? 'Tambah Saldo Ledger Rekruter' : 'Add Recruiter Ledger Funds'}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#16835D]/12 px-2.5 py-1 text-[11px] font-bold text-[#16835D]">
              <ShieldCheck className="h-3.5 w-3.5" />
              {recruiterWallet.vendorKybVerified
                ? isId
                  ? 'Organisasi KYB Verified'
                  : 'KYB Verified Org'
                : isId
                ? 'KYB Menunggu'
                : 'KYB Pending'}
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold">
              {isId ? 'Pilih Nominal Cepat atau Masukkan Nominal (Min. Rp 500.000)' : 'Quick Presets or Custom Amount (Min. Rp 500,000)'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5000000, 10000000, 25000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmountInput(String(preset))}
                  className={`rounded-xl border py-2 text-xs font-bold tabular-nums transition-colors ${
                    Number(amountInput) === preset
                      ? 'border-[#027F86] bg-[#027F86]/10 text-[#027F86]'
                      : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-canvas)]'
                  }`}
                >
                  {egvoxFormatIDR(preset)}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={500000}
              step={100000}
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm font-bold tabular-nums"
            />
            <p className="text-xs text-[#027F86] tabular-nums">
              {isId ? 'Setara:' : 'Equivalent:'} {egvoxFormatUSD(numericAmount)} USD
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold">
              {isId ? 'Metode Pembayaran (Adapter PSP Berizin)' : 'Payment Method (Licensed PSP Adapter)'}
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  id: 'va' as const,
                  icon: Building2,
                  label: 'Virtual Account (BCA / Mandiri)',
                  desc: isId ? 'Settlement otomatis via bank' : 'Automated bank settlement',
                },
                {
                  id: 'qris' as const,
                  icon: QrCode,
                  label: isId ? 'QRIS Korporat' : 'Corporate QRIS',
                  desc: isId ? 'Konfirmasi cepat domestik' : 'Fast domestic settlement',
                },
                {
                  id: 'ewallet' as const,
                  icon: Wallet,
                  label: isId ? 'E-Wallet Terotorisasi' : 'Authorized E-Wallet',
                  desc: isId ? 'Pembayaran instansi' : 'Authorized wallet transfer',
                },
                {
                  id: 'card' as const,
                  icon: CreditCard,
                  label: isId ? 'Kartu Korporat (IDR & USD)' : 'Corporate Card (IDR & USD)',
                  desc: isId ? 'Otorisasi lintas negara' : 'Cross-border card settlement',
                },
              ].map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                      active
                        ? 'border-[#027F86] bg-[#027F86]/8'
                        : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-canvas)]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#027F86] mt-0.5" />
                    <span>
                      <span className="block text-xs font-bold">{m.label}</span>
                      <span className="block text-[11px] text-[var(--egvox-text-muted)]">
                        {m.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-start gap-2.5 rounded-xl bg-[var(--egvox-bg-canvas)] p-3 text-xs">
            <input
              type="checkbox"
              checked={simulateInstantSettle}
              onChange={(e) => setSimulateInstantSettle(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-[#027F86]"
            />
            <span>
              <strong>
                {isId ? 'Konfirmasi Settlement Instan (PSP Settled)' : 'Instant PSP Settlement Simulation'}
              </strong>
              <span className="block text-[11px] text-[var(--egvox-text-muted)] mt-0.5">
                {isId
                  ? 'Jika dimatikan, top-up berstatus Pending Settlement dan tidak dihitung dalam Saldo Tersedia hingga settlement dikonfirmasi.'
                  : 'If unchecked, top-up enters Pending Settlement and is excluded from Available Balance until cleared.'}
              </span>
            </span>
          </label>

          <div className="flex items-start gap-2.5 rounded-xl border border-[#027F86]/25 bg-[#027F86]/6 p-3.5 text-xs text-[var(--egvox-text-secondary)]">
            <Lock className="h-4 w-4 shrink-0 text-[#027F86] mt-0.5" />
            <span>
              {isId
                ? 'Dana dikelola sebagai Reservasi Dana Terotorisasi Payment Provider yang dicatat di Ledger Rekruter. EgvoX bukan bank dan bukan penerbit e-money.'
                : 'Funds are managed as Payment Provider Authorized Reservations on the Recruiter Ledger.'}
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#027F86] py-3 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
          >
            {isId ? 'Proses Top Up Saldo Sekarang' : 'Process Recruiter Top Up'}
          </button>
        </form>

        {/* Top-Up Ledger History */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
              {isId ? 'Riwayat Top Up & Settlement' : 'Top-Up & Settlement History'}
            </h2>
            {recruiterWallet.pendingTopUpIDR > 0 && (
              <span className="rounded-md bg-[#F59E0B]/15 px-2 py-0.5 text-[11px] font-bold text-[#B7791F] tabular-nums">
                Pending: {egvoxFormatIDR(recruiterWallet.pendingTopUpIDR)}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {topUpHistory.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 text-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-[#027F86]">{rec.code}</span>
                  {rec.status === 'settled' ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#16835D]/12 px-2 py-0.5 text-[10px] font-bold text-[#16835D]">
                      <CheckCircle2 className="h-3 w-3" />
                      Settled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F59E0B]/15 px-2 py-0.5 text-[10px] font-bold text-[#B7791F]">
                      <Clock className="h-3 w-3" />
                      Pending Settlement
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between tabular-nums">
                  <span className="font-bold text-sm">
                    {egvoxFormatIDR(rec.amountIDR)}
                  </span>
                  <span className="text-[11px] uppercase text-[var(--egvox-text-muted)]">
                    {rec.method} · {rec.createdAt}
                  </span>
                </div>
                {rec.status === 'pending_settlement' && (
                  <button
                    type="button"
                    onClick={() => settlePendingTopUp(rec.id)}
                    className="w-full rounded-lg border border-[#027F86] py-1.5 text-[11px] font-semibold text-[#027F86] hover:bg-[#027F86]/8"
                  >
                    {isId ? 'Konfirmasi Settlement PSP' : 'Confirm PSP Settlement'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
