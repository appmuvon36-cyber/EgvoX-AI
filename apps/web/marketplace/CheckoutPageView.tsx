'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Wallet,
} from 'lucide-react';
import { DualPrice, egvoxFormatIDR, egvoxFormatUSD } from '@/packages/design-system';
import { useAppState } from '@/lib/hooks/useAppState';

export const CheckoutPageView: React.FC = () => {
  const {
    locale,
    cartItems,
    updateCartQty,
    removeFromCart,
    clearCart,
    showToast,
  } = useAppState();
  const isId = locale === 'id';

  const [paymentMethod, setPaymentMethod] = useState<'va' | 'qris' | 'ewallet' | 'card'>('va');
  const [companyOrg, setCompanyOrg] = useState('PT Data Visual Indonesia');
  const [billingEmail, setBillingEmail] = useState('finance@datavisual.id');
  const [poReference, setPoReference] = useState('PO-2026-EGX-089');
  const [confirmed, setConfirmed] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const platformFee = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + platformFee;

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setConfirmed(true);
    clearCart();
    showToast(
      isId
        ? 'Pembayaran Work Order terotorisasi dan sesi private upload telah aktif.'
        : 'Work Order payment authorized and private upload sessions activated.'
    );
  };

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-8 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#16835D]/12 text-[#16835D]">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div className="space-y-2">
            <span className="inline-block rounded-md bg-[#16835D]/12 px-3 py-1 text-xs font-bold text-[#16835D]">
              {isId ? 'Pembayaran & Work Order Terkonfirmasi' : 'Payment & Work Order Confirmed'}
            </span>
            <h1 className="text-2xl font-bold text-[var(--egvox-text-primary)]">
              {isId ? 'Order Aktif di Workspace Anda' : 'Order Active in Your Workspace'}
            </h1>
            <p className="text-sm text-[var(--egvox-text-secondary)]">
              {isId
                ? 'Sesi private upload berenkripsi SHA-256 dan milestone Work Order telah dibuat untuk proyek dan layanan yang Anda pesan.'
                : 'SHA-256 private upload sessions and Work Order milestones have been provisioned for your ordered services.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/workspace?tab=tracking"
              className="rounded-xl bg-[#027F86] px-6 py-3 text-sm font-semibold text-white hover:bg-[#039998]"
            >
              {isId ? 'Lacak Produksi & QA' : 'Track Production & QA'}
            </Link>
            <Link
              href="/marketplace"
              className="rounded-xl border border-[var(--egvox-border-default)] px-6 py-3 text-sm font-semibold hover:bg-[var(--egvox-bg-subtle)]"
            >
              {isId ? 'Kembali ke Marketplace' : 'Return to Marketplace'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/marketplace/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#027F86] dark:text-[#04B8B4] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isId ? 'Lanjut Jelajahi Katalog' : 'Continue Browsing Catalog'}</span>
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--egvox-text-primary)]">
            {isId ? 'Keranjang & Pembayaran Work Order' : 'Work Order Cart & Checkout'}
          </h1>
          <p className="mt-1 text-sm text-[var(--egvox-text-secondary)]">
            {isId
              ? 'Harga ditampilkan setara dalam Rupiah (IDR) dan Dollar (USD) dengan transparansi biaya platform sebelum otorisasi.'
              : 'Prices are displayed in equivalent Rupiah (IDR) and Dollar (USD) with transparent platform fees prior to authorization.'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--egvox-text-secondary)] tabular-nums">
          <span>1 USD = Rp 16.000</span>
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-12 text-center space-y-4">
          <ShoppingBag className="mx-auto h-10 w-10 text-[var(--egvox-text-muted)]" />
          <h2 className="text-lg font-bold text-[var(--egvox-text-primary)]">
            {isId ? 'Keranjang Work Order Kosong' : 'Your Work Order Cart is Empty'}
          </h2>
          <p className="text-sm text-[var(--egvox-text-secondary)]">
            {isId
              ? 'Pilih layanan perekaman video atau anotasi dari Katalog Freelancer untuk memulai pemesanan.'
              : 'Select video capture or human annotation services from the Freelancer Catalog to begin.'}
          </p>
          <Link
            href="/marketplace/services"
            className="inline-flex rounded-xl bg-[#027F86] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {isId ? 'Jelajahi Katalog Freelancer' : 'Browse Freelancer Catalog'}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleConfirmPayment} className="grid gap-6 lg:gap-8 lg:grid-cols-12">
          {/* Left Column: Cart Items + Billing Details + Payment Methods */}
          <div className="lg:col-span-7 min-w-0 space-y-6">
            {/* Cart Items Card */}
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
                  {isId ? `Daftar Pesanan (${cartItems.length})` : `Order Line Items (${cartItems.length})`}
                </h2>
                <span className="text-xs text-[var(--egvox-text-muted)]">
                  {isId ? 'Basis durasi per jam' : 'Hourly duration billing'}
                </span>
              </div>

              <div className="divide-y divide-[var(--egvox-border-default)]">
                {cartItems.map((item) => {
                  const title = isId ? item.title : item.titleEn || item.title;
                  const sub = isId ? item.subtitle : item.subtitleEn || item.subtitle;
                  const unit = isId ? item.unitLabel : item.unitLabelEn || 'hour';
                  return (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
                      <img
                        src={item.thumbnail}
                        alt={title}
                        referrerPolicy="no-referrer"
                        className="h-16 w-24 rounded-xl object-cover shrink-0 border border-[var(--egvox-border-default)]"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-bold text-[var(--egvox-text-primary)]">
                          {title}
                        </p>
                        <p className="text-xs text-[var(--egvox-text-muted)]">{sub}</p>
                        <DualPrice
                          amountIDR={item.unitPrice}
                          unitLabel={unit}
                          size="sm"
                          layout="inline"
                        />
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, -1)}
                            aria-label={isId ? 'Kurangi jumlah' : 'Decrease quantity'}
                            className="h-8 w-8 rounded-lg border border-[var(--egvox-border-default)] flex items-center justify-center hover:bg-[var(--egvox-bg-subtle)]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            aria-label={isId ? 'Tambah jumlah' : 'Increase quantity'}
                            className="h-8 w-8 rounded-lg border border-[var(--egvox-border-default)] flex items-center justify-center hover:bg-[var(--egvox-bg-subtle)]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={isId ? 'Hapus item' : 'Remove item'}
                          className="p-1.5 text-[var(--egvox-text-muted)] hover:text-[#C43D3D]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Organization Billing Info */}
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#027F86]" />
                <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
                  {isId ? 'Informasi Penagihan Organisasi' : 'Organization Billing Details'}
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {isId ? 'Nama Organisasi / Buyer' : 'Organization / Buyer Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={companyOrg}
                    onChange={(e) => setCompanyOrg(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {isId ? 'Email Invoice & Manifest' : 'Invoice & Manifest Email'}
                  </label>
                  <input
                    type="email"
                    required
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {isId ? 'Nomor Referensi PO (Opsional)' : 'Purchase Order Reference (Optional)'}
                </label>
                <input
                  type="text"
                  value={poReference}
                  onChange={(e) => setPoReference(e.target.value)}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Payment Method Picker */}
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-4">
              <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
                {isId ? 'Metode Pembayaran (Adapter PSP Resmi)' : 'Payment Method (Licensed PSP Adapter)'}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    id: 'va' as const,
                    icon: Building2,
                    label: 'Virtual Account (BCA / Mandiri / BNI)',
                    desc: isId ? 'IDR · Konfirmasi otomatis' : 'IDR · Automated verification',
                  },
                  {
                    id: 'qris' as const,
                    icon: QrCode,
                    label: isId ? 'QRIS Instan' : 'Instant QRIS',
                    desc: isId ? 'Dukungan semua bank & dompet ID' : 'Supports Indonesian banks & wallets',
                  },
                  {
                    id: 'ewallet' as const,
                    icon: Wallet,
                    label: isId ? 'E-Wallet Korporat' : 'Corporate E-Wallet',
                    desc: isId ? 'Penyelesaian cepat' : 'Fast settlement confirmation',
                  },
                  {
                    id: 'card' as const,
                    icon: CreditCard,
                    label: isId ? 'Kartu Kredit / Debit (USD & IDR)' : 'Credit / Debit Card (USD & IDR)',
                    desc: isId ? 'Pembayaran lintas negara' : 'Cross-border card settlement',
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const active = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        active
                          ? 'border-[#027F86] bg-[#027F86]/8'
                          : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-canvas)]'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-[#027F86] mt-0.5" />
                      <span className="block">
                        <span className="block text-sm font-bold text-[var(--egvox-text-primary)]">
                          {m.label}
                        </span>
                        <span className="block text-xs text-[var(--egvox-text-muted)] mt-0.5">
                          {m.desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5 min-w-0">
            <div className="sticky top-20 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6 space-y-5">
              <h2 className="text-base font-bold text-[var(--egvox-text-primary)]">
                {isId ? 'Ringkasan Pembayaran (IDR & USD)' : 'Payment Summary (IDR & USD)'}
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap justify-between gap-2 text-[var(--egvox-text-secondary)]">
                  <span>{isId ? 'Subtotal Jasa' : 'Services Subtotal'}</span>
                  <span className="text-right tabular-nums">
                    <span className="block font-semibold text-[var(--egvox-text-primary)]">
                      {egvoxFormatIDR(subtotal)}
                    </span>
                    <span className="block text-xs text-[#027F86] dark:text-[#04B8B4]">
                      &asymp; {egvoxFormatUSD(subtotal)} USD
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap justify-between gap-2 text-[var(--egvox-text-secondary)]">
                  <span>{isId ? 'Biaya Platform & QA (5%)' : 'Platform & QA Fee (5%)'}</span>
                  <span className="text-right tabular-nums">
                    <span className="block font-semibold text-[var(--egvox-text-primary)]">
                      {egvoxFormatIDR(platformFee)}
                    </span>
                    <span className="block text-xs text-[#027F86] dark:text-[#04B8B4]">
                      &asymp; {egvoxFormatUSD(platformFee)} USD
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--egvox-border-default)] pt-3">
                  <span className="font-bold text-[var(--egvox-text-primary)]">
                    {isId ? 'Total Pembayaran' : 'Total Payment'}
                  </span>
                  <DualPrice amountIDR={grandTotal} size="lg" accent="teal" />
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5 text-xs text-[var(--egvox-text-secondary)]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#16835D] mt-0.5" />
                <span>
                  {isId
                    ? 'Dana Work Order tercatat dalam ledger transaksi terpisah; payout kontributor hanya cair setelah file lolos QA Acceptance Criteria.'
                    : 'Work Order funds are tracked in a dedicated transaction ledger; contributor payouts clear only after passing QA Acceptance Criteria.'}
                </span>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#027F86] py-3.5 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>{isId ? 'Bayar Sekarang' : 'Authorize & Pay Now'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
