'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  CreditCard,
  FileUp,
  Flag,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  DualPrice,
  Modal,
  egvoxFormatIDR,
  egvoxFormatUSD,
} from '@/packages/design-system';
import { validateProposalForm } from '@/packages/validation-schemas';
import { ReportListingTarget, useAppState } from '@/lib/hooks/useAppState';
import type {
  FreelancerServiceListing,
  Locale,
  ProjectListing,
} from '@/packages/shared-types';

const ProposalFormContent: React.FC<{
  project: ProjectListing;
  locale: Locale;
  onCancel: () => void;
  onSubmitProposal: (payload: {
    projectSlug: string;
    projectTitle: string;
    vendorName: string;
    volume: number;
    estimatedTotal: number;
    note: string;
    attachmentName?: string;
  }) => void;
}> = ({ project, locale, onCancel, onSubmitProposal }) => {
  const [volume, setVolume] = useState(Math.min(20, project.targetVolume));
  const [note, setNote] = useState(
    locale === 'id'
      ? 'Saya siap mengerjakan sesuai spesifikasi capture terbaru menggunakan action camera 1080p60.'
      : 'Ready to deliver per the locked capture specification using 1080p60 action camera gear.'
  );
  const [attachmentName, setAttachmentName] = useState('');
  const [specAck, setSpecAck] = useState(true);
  const [proposalError, setProposalError] = useState<string | null>(null);

  const unit =
    locale === 'id' ? project.unitLabel : project.unitLabelEn || 'hour';

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specAck) {
      setProposalError(
        locale === 'id'
          ? 'Anda wajib menyetujui versi Capture Specification proyek ini.'
          : 'You must acknowledge the Capture Specification version for this project.'
      );
      return;
    }
    const validation = validateProposalForm({ volume, note }, locale);
    if (!validation.valid) {
      setProposalError(Object.values(validation.errors)[0]);
      return;
    }
    onSubmitProposal({
      projectSlug: project.slug,
      projectTitle: locale === 'id' ? project.title : project.titleEn,
      vendorName: project.vendorName,
      volume,
      estimatedTotal: volume * project.ratePerUnit,
      note,
      attachmentName: attachmentName || undefined,
    });
    onCancel();
  };

  return (
    <form onSubmit={handleProposalSubmit} className="space-y-4">
      <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 text-xs text-[var(--egvox-text-secondary)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            {locale === 'id' ? `Tarif per ${unit}` : `Rate per ${unit}`}
          </span>
          <span className="font-semibold text-[var(--egvox-text-primary)] tabular-nums">
            {egvoxFormatIDR(project.ratePerUnit)} ({egvoxFormatUSD(project.ratePerUnit)} USD)
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <span>
            {locale === 'id' ? 'Spesifikasi Acuan' : 'Specification Version'}
          </span>
          <span className="font-mono font-medium text-[#027F86] dark:text-[#04B8B4]">
            {project.captureSpec.version}
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="proposal-volume"
          className="block text-sm font-medium text-[var(--egvox-text-primary)]"
        >
          {locale === 'id'
            ? `Volume yang Diajukan (${unit})`
            : `Proposed Volume (${unit})`}
        </label>
        <input
          id="proposal-volume"
          type="number"
          min={1}
          max={project.targetVolume}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value) || 0)}
          className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2.5 text-sm tabular-nums focus:border-[#027F86] focus:outline-none focus:ring-2 focus:ring-[#04B8B4]/25"
        />
      </div>

      <div className="rounded-xl bg-[#027F86]/8 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--egvox-text-secondary)]">
          {locale === 'id' ? 'Estimasi Pendapatan Kotor' : 'Estimated Gross Value'}
        </span>
        <DualPrice
          amountIDR={volume * project.ratePerUnit}
          size="md"
          accent="orange"
        />
      </div>

      <div>
        <label
          htmlFor="proposal-note"
          className="block text-sm font-medium text-[var(--egvox-text-primary)]"
        >
          {locale === 'id'
            ? 'Pesan Kesiapan & Perangkat'
            : 'Readiness & Equipment Note'}
        </label>
        <textarea
          id="proposal-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            locale === 'id'
              ? 'Jelaskan pengalaman capture, jenis kamera, dan ketersediaan jam mingguan Anda...'
              : 'Describe your capture experience, camera rig, and weekly hourly capacity...'
          }
          className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none focus:ring-2 focus:ring-[#04B8B4]/25"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--egvox-text-primary)]">
          {locale === 'id'
            ? 'Lampiran Portofolio / Izin Lokasi (Opsional)'
            : 'Portfolio / Site Permission Attachment (Optional)'}
        </label>
        <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-4 py-3 text-xs font-medium text-[var(--egvox-text-secondary)] hover:border-[#027F86]">
          <FileUp className="h-4 w-4 text-[#027F86]" />
          <span>
            {attachmentName ||
              (locale === 'id'
                ? 'Unggah File (PDF, DOC, JPG · Maks 10MB)'
                : 'Upload File (PDF, DOC, JPG · Max 10MB)')}
          </span>
          <input
            type="file"
            className="sr-only"
            onChange={(e) =>
              setAttachmentName(e.target.files?.[0]?.name || '')
            }
          />
        </label>
      </div>

      <label className="flex items-start gap-2.5 text-xs text-[var(--egvox-text-secondary)]">
        <input
          type="checkbox"
          checked={specAck}
          onChange={(e) => setSpecAck(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-[var(--egvox-border-default)] text-[#027F86]"
        />
        <span>
          {locale === 'id' ? (
            <>
              Saya telah membaca dan menyanggupi versi spesifikasi{' '}
              <strong>{project.captureSpec.version}</strong> serta ketentuan
              privasi/consent EgvoX.
            </>
          ) : (
            <>
              I have reviewed and commit to specification version{' '}
              <strong>{project.captureSpec.version}</strong> and EgvoX privacy/consent terms.
            </>
          )}
        </span>
      </label>

      {proposalError && (
        <p className="text-xs font-medium text-[#C43D3D]">{proposalError}</p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2.5 text-sm font-medium text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]"
        >
          {locale === 'id' ? 'Batal' : 'Cancel'}
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[#027F86] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
        >
          {locale === 'id' ? 'Kirim Proposal' : 'Submit Proposal'}
        </button>
      </div>
    </form>
  );
};

const ServiceOrderFormContent: React.FC<{
  service: FreelancerServiceListing;
  locale: Locale;
  onConfirm: (
    orderQty: number,
    includeAnnotation: boolean,
    goToCheckout: boolean
  ) => void;
}> = ({ service, locale, onConfirm }) => {
  const [orderQty, setOrderQty] = useState(5);
  const [includeAnnotation, setIncludeAnnotation] = useState(false);
  const [orderBrief, setOrderBrief] = useState('');

  const unit =
    locale === 'id' ? service.unitLabel : service.unitLabelEn || 'hour';
  const sla =
    locale === 'id'
      ? service.deliverySla
      : service.deliverySlaEn || service.deliverySla;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5">
        <p className="text-sm font-semibold text-[var(--egvox-text-primary)]">
          {locale === 'id' ? service.title : service.titleEn}
        </p>
        <p className="mt-1 text-xs text-[var(--egvox-text-muted)] tabular-nums">
          {locale === 'id' ? 'Tarif dasar' : 'Base rate'}{' '}
          {egvoxFormatIDR(service.pricePerUnit)} ({egvoxFormatUSD(service.pricePerUnit)} USD) / {unit} · SLA {sla}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--egvox-text-primary)]">
          {locale === 'id' ? `Jumlah Durasi (${unit})` : `Duration Quantity (${unit})`}
        </label>
        <div className="mt-1.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOrderQty((q) => Math.max(1, q - 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-subtle)]"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            value={orderQty}
            onChange={(e) => setOrderQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-24 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-center text-sm font-semibold tabular-nums"
          />
          <button
            type="button"
            onClick={() => setOrderQty((q) => q + 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-subtle)]"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {service.roleType === 'Video Contributor' && (
        <label className="flex items-start gap-2.5 rounded-xl border border-[var(--egvox-border-default)] p-3 text-xs">
          <input
            type="checkbox"
            checked={includeAnnotation}
            onChange={(e) => setIncludeAnnotation(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded text-[#027F86]"
          />
          <div>
            <span className="font-semibold text-[var(--egvox-text-primary)]">
              {locale === 'id'
                ? 'Tambahkan Layanan Anotasi Freelance Opsional (+Rp 75.000 / $4.69 USD per jam)'
                : 'Add Optional Freelance Annotation (+Rp 75,000 / $4.69 USD per hour)'}
            </span>
            <p className="mt-0.5 text-[var(--egvox-text-muted)]">
              {locale === 'id'
                ? 'Opsional sesuai PRD: pilih hanya jika tim Anda tidak memakai annotator internal.'
                : 'Optional per PRD: select only if your team does not use internal annotators.'}
            </p>
          </div>
        </label>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--egvox-text-primary)]">
          {locale === 'id'
            ? 'Catatan Brief & Acceptance Criteria'
            : 'Brief & Acceptance Criteria Notes'}
        </label>
        <textarea
          rows={3}
          value={orderBrief}
          onChange={(e) => setOrderBrief(e.target.value)}
          placeholder={
            locale === 'id'
              ? 'Tulis detail sudut kamera, lokasi, atau skema pelabelan yang diharapkan...'
              : 'Specify camera angle, venue requirements, or expected labeling schema...'
          }
          className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3.5 py-2.5 text-sm focus:border-[#027F86] focus:outline-none"
        />
      </div>

      <div className="rounded-xl bg-[#027F86]/8 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--egvox-text-secondary)]">
          {locale === 'id'
            ? 'Estimasi Subtotal Work Order'
            : 'Estimated Work Order Subtotal'}
        </span>
        <DualPrice
          amountIDR={
            orderQty * service.pricePerUnit +
            (includeAnnotation ? orderQty * 75000 : 0)
          }
          size="md"
          accent="teal"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={() => onConfirm(orderQty, includeAnnotation, false)}
          className="rounded-lg border border-[#027F86] px-4 py-2.5 text-sm font-semibold text-[#027F86] dark:text-[#04B8B4] hover:bg-[#027F86]/8"
        >
          {locale === 'id' ? '+ Keranjang Order' : '+ Add to Cart'}
        </button>
        <button
          type="button"
          onClick={() => onConfirm(orderQty, includeAnnotation, true)}
          className="rounded-lg bg-[#027F86] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#039998]"
        >
          {locale === 'id' ? 'Lanjut Checkout' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};

const ReportListingFormContent: React.FC<{
  target: ReportListingTarget;
  locale: Locale;
  onCancel: () => void;
  onSubmitted: (reason: string) => void;
}> = ({ target, locale, onCancel, onSubmitted }) => {
  const [reason, setReason] = useState(
    locale === 'id'
      ? 'Indikasi pelanggaran privasi / PII'
      : 'Suspected privacy / PII violation'
  );
  const [detail, setDetail] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitted(reason);
        onCancel();
      }}
      className="space-y-4"
    >
      <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-xs">
        <p className="font-semibold text-[var(--egvox-text-primary)]">{target.title}</p>
        <p className="text-[var(--egvox-text-muted)]">
          {locale === 'id'
            ? 'Laporan dikirim langsung ke Trust & Safety Governance Queue.'
            : 'Reports are routed directly to the Trust & Safety Governance Queue.'}
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
          {locale === 'id' ? 'Alasan Pelaporan' : 'Report Reason'}
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
        >
          <option>
            {locale === 'id'
              ? 'Indikasi pelanggaran privasi / PII'
              : 'Suspected privacy / PII violation'}
          </option>
          <option>
            {locale === 'id'
              ? 'Ketidaksesuaian spesifikasi / tarif tidak wajar'
              : 'Misleading specification / unrealistic rates'}
          </option>
          <option>
            {locale === 'id'
              ? 'Aktivitas berisiko tinggi / tanpa izin lokasi'
              : 'High-risk activity / missing site consent'}
          </option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--egvox-text-primary)]">
          {locale === 'id' ? 'Detail Tambahan' : 'Additional Details'}
        </label>
        <textarea
          rows={3}
          required
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder={
            locale === 'id'
              ? 'Jelaskan bagian listing yang perlu ditinjau moderator...'
              : 'Describe the specific issue for moderator review...'
          }
          className="mt-1.5 w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm"
        >
          {locale === 'id' ? 'Batal' : 'Cancel'}
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#C43D3D] px-4 py-2 text-sm font-semibold text-white"
        >
          <Flag className="h-4 w-4" />
          <span>{locale === 'id' ? 'Kirim Laporan' : 'Submit Report'}</span>
        </button>
      </div>
    </form>
  );
};

export const GlobalActionModals: React.FC = () => {
  const {
    locale,
    proposalModalProject,
    openProposalModal,
    submitProposal,
    serviceOrderModal,
    openServiceOrderModal,
    addToCart,
    cartDrawerOpen,
    setCartDrawerOpen,
    cartItems,
    updateCartQty,
    removeFromCart,
    clearCart,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    notificationsModalOpen,
    setNotificationsModalOpen,
    reportListingModal,
    openReportModal,
    showToast,
  } = useAppState();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'done'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'va' | 'qris' | 'ewallet' | 'card'>('va');

  const handleAddServiceOrder = (
    orderQty: number,
    includeAnnotation: boolean,
    goToCheckout: boolean
  ) => {
    if (!serviceOrderModal) return;
    addToCart({
      id: serviceOrderModal.id,
      kind: 'service_order',
      title: serviceOrderModal.title,
      titleEn: serviceOrderModal.titleEn,
      subtitle: `${serviceOrderModal.freelancerName} · ${orderQty} ${serviceOrderModal.unitLabel}`,
      subtitleEn: `${serviceOrderModal.freelancerName} · ${orderQty} ${serviceOrderModal.unitLabelEn || 'hour'}`,
      unitPrice: serviceOrderModal.pricePerUnit,
      quantity: orderQty,
      unitLabel: serviceOrderModal.unitLabel,
      unitLabelEn: serviceOrderModal.unitLabelEn || 'hour',
      thumbnail: serviceOrderModal.avatar,
    });
    if (includeAnnotation) {
      addToCart({
        id: `${serviceOrderModal.id}-ann`,
        kind: 'annotation_addon',
        title: `Add-on Anotasi Opsional (${serviceOrderModal.freelancerName})`,
        titleEn: `Optional Annotation Add-on (${serviceOrderModal.freelancerName})`,
        subtitle: `Skema Temporal + Bounding Box · ${orderQty} jam`,
        subtitleEn: `Temporal + Bounding Box Schema · ${orderQty} hours`,
        unitPrice: 75000,
        quantity: orderQty,
        unitLabel: 'jam',
        unitLabelEn: 'hour',
        thumbnail: '/images/capture_manufacturing_pov_1795676770652.jpg',
      });
    }
    openServiceOrderModal(null);
    if (goToCheckout) {
      setCheckoutStep('cart');
      setCartDrawerOpen(true);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const platformFee = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + platformFee;

  const handlePayNow = () => {
    setCheckoutStep('done');
    clearCart();
    showToast(
      locale === 'id'
        ? 'Work Order terkonfirmasi dan sesi private upload telah dibuat.'
        : 'Work Order confirmed and private upload session provisioned.'
    );
  };

  return (
    <>
      {/* Modal 1: Ajukan Proposal (Project Catalog) */}
      <Modal
        open={!!proposalModalProject}
        onClose={() => openProposalModal(null)}
        title={locale === 'id' ? 'Ajukan Proposal Project' : 'Submit Project Proposal'}
        subtitle={
          proposalModalProject
            ? `${locale === 'id' ? proposalModalProject.title : proposalModalProject.titleEn} · ${proposalModalProject.captureSpec.version}`
            : undefined
        }
      >
        {proposalModalProject && (
          <ProposalFormContent
            key={`${proposalModalProject.slug}-${locale}`}
            project={proposalModalProject}
            locale={locale}
            onCancel={() => openProposalModal(null)}
            onSubmitProposal={submitProposal}
          />
        )}
      </Modal>

      {/* Modal 2: Request Order (Freelancer Service Catalog) */}
      <Modal
        open={!!serviceOrderModal}
        onClose={() => openServiceOrderModal(null)}
        title={
          locale === 'id'
            ? 'Pesan Layanan Freelancer'
            : 'Request Freelancer Service Order'
        }
        subtitle={
          serviceOrderModal
            ? `${serviceOrderModal.freelancerName} · ${serviceOrderModal.roleType}`
            : undefined
        }
      >
        {serviceOrderModal && (
          <ServiceOrderFormContent
            key={`${serviceOrderModal.id}-${locale}`}
            service={serviceOrderModal}
            locale={locale}
            onConfirm={handleAddServiceOrder}
          />
        )}
      </Modal>

      {/* Modal 3: Keranjang, Checkout & Pembayaran */}
      <Modal
        open={cartDrawerOpen}
        onClose={() => {
          setCartDrawerOpen(false);
          setCheckoutStep('cart');
        }}
        title={
          checkoutStep === 'cart'
            ? locale === 'id'
              ? 'Keranjang Work Order'
              : 'Work Order Cart'
            : checkoutStep === 'payment'
            ? locale === 'id'
              ? 'Pembayaran & Pendanaan Order'
              : 'Order Payment & Funding'
            : locale === 'id'
            ? 'Work Order Terkonfirmasi'
            : 'Work Order Confirmed'
        }
        subtitle={
          locale === 'id'
            ? 'Rincian biaya platform ditampilkan transparan sebelum persetujuan'
            : 'Platform service fees are disclosed transparently prior to authorization'
        }
      >
        {checkoutStep === 'done' ? (
          <div className="py-4 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#16835D]/12 text-[#16835D]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--egvox-text-primary)]">
                {locale === 'id'
                  ? 'Order Terdaftar & Terotorisasi'
                  : 'Order Registered & Authorized'}
              </h3>
              <p className="mt-1 text-sm text-[var(--egvox-text-secondary)]">
                {locale === 'id'
                  ? 'Sesi private upload dan milestone Work Order Anda kini tersedia di Workspace.'
                  : 'Your private upload session and Work Order milestones are now live in Workspace.'}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/workspace?tab=tracking"
                onClick={() => {
                  setCartDrawerOpen(false);
                  setCheckoutStep('cart');
                }}
                className="rounded-lg bg-[#027F86] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#039998]"
              >
                {locale === 'id' ? 'Buka Tracking Produksi' : 'Open Production Tracking'}
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-[var(--egvox-text-secondary)]">
              {locale === 'id'
                ? 'Belum ada item layanan di keranjang Work Order Anda.'
                : 'No service items in your Work Order cart yet.'}
            </p>
            <Link
              href="/marketplace/services"
              onClick={() => setCartDrawerOpen(false)}
              className="inline-flex rounded-lg bg-[#027F86] px-4 py-2 text-sm font-semibold text-white"
            >
              {locale === 'id'
                ? 'Jelajahi Katalog Freelancer'
                : 'Explore Freelancer Catalog'}
            </Link>
          </div>
        ) : checkoutStep === 'cart' ? (
          <div className="space-y-4">
            <div className="divide-y divide-[var(--egvox-border-default)]">
              {cartItems.map((item) => {
                const title =
                  locale === 'id' ? item.title : item.titleEn || item.title;
                const sub =
                  locale === 'id'
                    ? item.subtitle
                    : item.subtitleEn || item.subtitle;
                const unit =
                  locale === 'id'
                    ? item.unitLabel
                    : item.unitLabelEn || 'hour';
                return (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-start gap-3 py-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <img
                        src={item.thumbnail}
                        alt={title}
                        referrerPolicy="no-referrer"
                        className="h-14 w-16 rounded-lg object-cover shrink-0 border border-[var(--egvox-border-default)]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--egvox-text-primary)] line-clamp-1">
                          {title}
                        </p>
                        <p className="text-xs text-[var(--egvox-text-muted)]">
                          {sub}
                        </p>
                        <div className="mt-1">
                          <DualPrice
                            amountIDR={item.unitPrice}
                            unitLabel={unit}
                            size="sm"
                            layout="inline"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, -1)}
                        className="h-7 w-7 rounded border border-[var(--egvox-border-default)] flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, 1)}
                        className="h-7 w-7 rounded border border-[var(--egvox-border-default)] flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={locale === 'id' ? 'Hapus item' : 'Remove item'}
                        className="ml-1 text-[var(--egvox-text-muted)] hover:text-[#C43D3D]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4 space-y-2 text-sm">
              <div className="flex flex-wrap justify-between gap-2 text-[var(--egvox-text-secondary)]">
                <span>{locale === 'id' ? 'Subtotal Jasa' : 'Services Subtotal'}</span>
                <span className="tabular-nums text-right">
                  {egvoxFormatIDR(subtotal)}{' '}
                  <span className="text-xs text-[#027F86] dark:text-[#04B8B4]">
                    ({egvoxFormatUSD(subtotal)} USD)
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-2 text-[var(--egvox-text-secondary)]">
                <span>
                  {locale === 'id'
                    ? 'Biaya Platform & QA (5%)'
                    : 'Platform & QA Fee (5%)'}
                </span>
                <span className="tabular-nums text-right">
                  {egvoxFormatIDR(platformFee)}{' '}
                  <span className="text-xs text-[#027F86] dark:text-[#04B8B4]">
                    ({egvoxFormatUSD(platformFee)} USD)
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-2 border-t border-[var(--egvox-border-default)] pt-2 font-bold text-[var(--egvox-text-primary)]">
                <span>{locale === 'id' ? 'Total Pesanan' : 'Order Total'}</span>
                <DualPrice amountIDR={grandTotal} size="sm" accent="teal" layout="inline" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                href="/checkout"
                onClick={() => setCartDrawerOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-[#027F86] py-3 text-sm font-semibold text-[#027F86] dark:text-[#04B8B4] hover:bg-[#027F86]/8 transition-colors"
              >
                {locale === 'id' ? 'Buka Halaman Checkout' : 'Full Checkout Page'}
              </Link>
              <button
                type="button"
                onClick={() => setCheckoutStep('payment')}
                className="w-full rounded-lg bg-[#027F86] py-3 text-sm font-semibold text-white hover:bg-[#039998] transition-colors"
              >
                {locale === 'id' ? 'Lanjut ke Pembayaran' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--egvox-text-muted)]">
                {locale === 'id'
                  ? 'Pilih Metode Pembayaran (Adapter PSP Indonesia)'
                  : 'Select Payment Method (Licensed PSP Adapter)'}
              </p>
              {[
                {
                  id: 'va' as const,
                  label: 'Virtual Account (BCA / Mandiri / BNI / BRI)',
                  note:
                    locale === 'id'
                      ? 'IDR · Verifikasi otomatis via webhook'
                      : 'IDR · Automated webhook verification',
                },
                {
                  id: 'qris' as const,
                  label: locale === 'id' ? 'QRIS Instan' : 'Instant QRIS',
                  note:
                    locale === 'id'
                      ? 'Mendukung seluruh aplikasi pembayaran Indonesia'
                      : 'Supported across Indonesian payment apps',
                },
                {
                  id: 'ewallet' as const,
                  label:
                    locale === 'id'
                      ? 'E-Wallet Korporat & Dompet Digital'
                      : 'Corporate & Digital E-Wallet',
                  note:
                    locale === 'id' ? 'Konfirmasi instan' : 'Instant confirmation',
                },
                {
                  id: 'card' as const,
                  label:
                    locale === 'id'
                      ? 'Kartu Kredit / Debit (Adapter Terlisensi)'
                      : 'Credit / Debit Card (Licensed Adapter)',
                  note:
                    locale === 'id'
                      ? 'Tergantung kelayakan mata uang'
                      : 'Subject to currency eligibility',
                },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left transition-colors ${
                    paymentMethod === m.id
                      ? 'border-[#027F86] bg-[#027F86]/8'
                      : 'border-[var(--egvox-border-default)] hover:bg-[var(--egvox-bg-canvas)]'
                  }`}
                >
                  <span className="block">
                    <span className="block text-sm font-semibold text-[var(--egvox-text-primary)]">
                      {m.label}
                    </span>
                    <span className="block text-xs text-[var(--egvox-text-muted)]">{m.note}</span>
                  </span>
                  <CreditCard className="h-4 w-4 text-[#027F86]" />
                </button>
              ))}
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-[var(--egvox-bg-canvas)] p-3 text-xs text-[var(--egvox-text-secondary)]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#16835D] mt-0.5" />
              <span>
                {locale === 'id'
                  ? 'Dana Work Order dicatat pada ledger transaksi terpisah; kelayakan payout dihitung berdasarkan unit yang lolos QA Acceptance Criteria.'
                  : 'Work Order funds are tracked in a dedicated transaction ledger; payout eligibility follows QA-accepted units.'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--egvox-border-default)] pt-3">
              <div>
                <p className="text-xs text-[var(--egvox-text-muted)]">
                  {locale === 'id' ? 'Total Pembayaran' : 'Payment Total'}
                </p>
                <DualPrice amountIDR={grandTotal} size="md" accent="teal" />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="rounded-lg border border-[var(--egvox-border-default)] px-3.5 py-2.5 text-sm font-medium"
                >
                  {locale === 'id' ? 'Kembali' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handlePayNow}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#027F86] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#039998]"
                >
                  <Lock className="h-4 w-4" />
                  <span>{locale === 'id' ? 'Bayar Sekarang' : 'Authorize & Pay'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 4: Notifications Center */}
      <Modal
        open={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        title={locale === 'id' ? 'Pusat Notifikasi EgvoX' : 'EgvoX Notification Center'}
        subtitle={
          locale === 'id'
            ? 'Pembaruan QA, negosiasi penawaran, dan status delivery paket'
            : 'QA updates, offer negotiations, and dataset package deliveries'
        }
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--egvox-text-muted)] inline-flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-[#027F86]" />
              {notifications.filter((n) => !n.read).length}{' '}
              {locale === 'id' ? 'belum dibaca' : 'unread'}
            </span>
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="font-semibold text-[#027F86] hover:underline"
            >
              {locale === 'id' ? 'Tandai Semua Dibaca' : 'Mark All Read'}
            </button>
          </div>

          <div className="divide-y divide-[var(--egvox-border-default)] rounded-xl border border-[var(--egvox-border-default)]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 transition-colors ${
                  n.read ? 'bg-transparent' : 'bg-[#027F86]/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={n.href}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setNotificationsModalOpen(false);
                    }}
                    className="text-sm font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                  >
                    {locale === 'id' ? n.titleId : n.titleEn}
                  </Link>
                  <span className="text-[11px] text-[var(--egvox-text-muted)] shrink-0">
                    {locale === 'id' ? n.timeLabel : n.timeLabelEn || n.timeLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--egvox-text-secondary)]">
                  {locale === 'id' ? n.bodyId : n.bodyEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal 5: Report Listing */}
      <Modal
        open={!!reportListingModal}
        onClose={() => openReportModal(null)}
        title={locale === 'id' ? 'Laporkan Listing' : 'Report Listing'}
        maxWidthClass="max-w-md"
      >
        {reportListingModal && (
          <ReportListingFormContent
            key={`${reportListingModal.slug}-${locale}`}
            target={reportListingModal}
            locale={locale}
            onCancel={() => openReportModal(null)}
            onSubmitted={(reason) =>
              showToast(
                locale === 'id'
                  ? `Laporan (${reason}) dikirim ke tim Trust & Safety.`
                  : `Report (${reason}) sent to Trust & Safety team.`
              )
            }
          />
        )}
      </Modal>
    </>
  );
};
