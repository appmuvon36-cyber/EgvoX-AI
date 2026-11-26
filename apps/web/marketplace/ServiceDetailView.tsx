'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Flag,
  MapPin,
  MessageSquare,
  Play,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { DualPrice, Modal } from '@/packages/design-system';
import { FreelancerServiceListing } from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';

export const ServiceDetailView: React.FC<{
  service: FreelancerServiceListing;
}> = ({ service }) => {
  const { locale, openServiceOrderModal, openReportModal, showToast } = useAppState();
  const [tab, setTab] = useState<'service' | 'specs' | 'reviews'>('service');
  const [contactModal, setContactModal] = useState(false);
  const [msgText, setMsgText] = useState('');

  const title = locale === 'id' ? service.title : service.titleEn;
  const desc = locale === 'id' ? service.description : service.descriptionEn;
  const unit = locale === 'id' ? service.unitLabel : service.unitLabelEn || 'hour';
  const cap =
    locale === 'id'
      ? service.capacityLabel
      : service.capacityLabelEn || service.capacityLabel;
  const sla =
    locale === 'id' ? service.deliverySla : service.deliverySlaEn || service.deliverySla;
  const loc = locale === 'id' ? service.location : service.locationEn || service.location;
  const terms = locale === 'id' ? service.terms : service.termsEn || service.terms;
  const exclusions =
    locale === 'id' ? service.exclusions : service.exclusionsEn || service.exclusions;
  const equipment =
    locale === 'id' ? service.equipment : service.equipmentEn || service.equipment;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setContactModal(false);
    setMsgText('');
    showToast(
      locale === 'id'
        ? `Pesan terkirim ke ${service.freelancerName} melalui platform messaging.`
        : `Message sent to ${service.freelancerName} via platform messaging.`
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/marketplace/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--egvox-text-secondary)] hover:text-[#027F86]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            {locale === 'id'
              ? 'Kembali ke Katalog Freelancer'
              : 'Back to Freelancer Catalog'}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => openReportModal({ type: 'service', slug: service.slug, title })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--egvox-text-secondary)] hover:text-[#C43D3D]"
        >
          <Flag className="h-3.5 w-3.5" />
          <span>{locale === 'id' ? 'Laporkan' : 'Report'}</span>
        </button>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 min-w-0 space-y-6">
          {/* Freelancer Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5">
            <div className="flex items-center gap-4">
              <img
                src={service.avatar}
                alt={service.freelancerName}
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-full object-cover border border-[var(--egvox-border-default)]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/freelancers/${service.username}`}
                    className="text-base font-bold text-[var(--egvox-text-primary)] hover:text-[#027F86]"
                  >
                    {service.freelancerName}
                  </Link>
                  {service.verified && (
                    <ShieldCheck className="h-4 w-4 text-[#2563A6]" />
                  )}
                </div>
                <p className="text-xs text-[var(--egvox-text-muted)]">
                  {service.roleType} · {service.levelBadge} · {service.completedOrders}{' '}
                  {locale === 'id' ? 'Order Selesai' : 'Completed Orders'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1 font-bold tabular-nums">
                <Star className="h-4 w-4 fill-[#FDBA27] text-[#FDBA27]" />
                {service.rating} ({service.reviewCount}{' '}
                {locale === 'id' ? 'ulasan' : 'reviews'})
              </span>
            </div>
          </div>

          {/* Portfolio Preview Player (Watermarked, Consent Verified) */}
          {service.portfolioPreviews[0] && (
            <div className="relative overflow-hidden rounded-2xl border border-[var(--egvox-border-default)] bg-[#102326] aspect-[16/9]">
              <img
                src={service.portfolioPreviews[0].thumbnail}
                alt={
                  locale === 'id'
                    ? service.portfolioPreviews[0].title
                    : service.portfolioPreviews[0].titleEn ||
                      service.portfolioPreviews[0].title
                }
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#027F86]">
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-1.5 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs text-white">
                <span className="font-mono tabular-nums">
                  {service.portfolioPreviews[0].duration} ·{' '}
                  {locale === 'id'
                    ? service.portfolioPreviews[0].title
                    : service.portfolioPreviews[0].titleEn ||
                      service.portfolioPreviews[0].title}
                </span>
                <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] sm:text-[11px]">
                  {locale === 'id'
                    ? 'Portfolio Preview Berizin · Watermarked'
                    : 'Consented Preview · Watermarked'}
                </span>
              </div>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-[var(--egvox-text-primary)]">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[var(--egvox-text-secondary)]">
              {desc}
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--egvox-border-default)] flex gap-5 sm:gap-6 overflow-x-auto">
            {(
              [
                {
                  id: 'service',
                  label:
                    locale === 'id' ? 'Layanan & Ketentuan' : 'Service & Terms',
                },
                {
                  id: 'specs',
                  label:
                    locale === 'id'
                      ? 'Spesifikasi & Perangkat'
                      : 'Specs & Equipment',
                },
                {
                  id: 'reviews',
                  label:
                    locale === 'id'
                      ? `Ulasan (${service.reviews.length})`
                      : `Reviews (${service.reviews.length})`,
                },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`border-b-2 pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  tab === item.id
                    ? 'border-[#027F86] text-[#027F86] dark:text-[#04B8B4]'
                    : 'border-transparent text-[var(--egvox-text-muted)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'service' && (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 space-y-5">
              <div>
                <h2 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                  {locale === 'id'
                    ? 'Ketentuan Layanan & Revisi'
                    : 'Service Terms & Revisions'}
                </h2>
                <ul className="mt-2 space-y-2 text-sm text-[var(--egvox-text-secondary)]">
                  {terms.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16835D]" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-[var(--egvox-border-default)] pt-4">
                <h2 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                  {locale === 'id'
                    ? 'Batasan & Pengecualian (Exclusions)'
                    : 'Exclusions & Boundaries'}
                </h2>
                <ul className="mt-2 space-y-1.5 text-sm text-[var(--egvox-text-secondary)]">
                  {exclusions.map((ex) => (
                    <li key={ex}>• {ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'specs' && (
            <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 space-y-4">
              <h2 className="text-sm font-bold text-[var(--egvox-text-primary)]">
                {locale === 'id'
                  ? 'Perangkat & Kapabilitas Teknis'
                  : 'Equipment & Technical Capabilities'}
              </h2>
              <p className="text-sm text-[var(--egvox-text-secondary)]">
                {locale === 'id' ? 'Standar Output:' : 'Output Standard:'}{' '}
                <strong>
                  {locale === 'id'
                    ? service.resolutionFps
                    : service.resolutionFpsEn || service.resolutionFps}
                </strong>
              </p>
              <ul className="space-y-2 text-sm text-[var(--egvox-text-secondary)]">
                {equipment.map((eq) => (
                  <li key={eq} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#027F86]" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {service.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[var(--egvox-text-primary)]">
                        {rev.buyerName} · {rev.buyerOrg}
                      </p>
                      <p className="text-xs text-[var(--egvox-text-muted)]">
                        {locale === 'id'
                          ? rev.orderScope
                          : rev.orderScopeEn || rev.orderScope}{' '}
                        · {rev.date}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums">
                      <Star className="h-3.5 w-3.5 fill-[#FDBA27] text-[#FDBA27]" />
                      {rev.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--egvox-text-secondary)]">
                    {locale === 'id' ? rev.comment : rev.commentEn || rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Order Sidebar */}
        <div className="lg:col-span-4 min-w-0">
          <div className="sticky top-20 space-y-5 rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 sm:p-6">
            <div>
              <p className="text-xs text-[var(--egvox-text-muted)]">
                {locale === 'id' ? 'Mulai dari (IDR & USD)' : 'Starting from (IDR & USD)'}
              </p>
              <div className="mt-1.5">
                <DualPrice amountIDR={service.pricePerUnit} unitLabel={unit} size="lg" />
              </div>
            </div>

            <div className="space-y-2.5 border-y border-[var(--egvox-border-default)] py-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {locale === 'id' ? 'Kapasitas' : 'Capacity'}
                </span>
                <span className="font-semibold">{cap}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {locale === 'id' ? 'Estimasi SLA' : 'Estimated SLA'}
                </span>
                <span className="font-semibold">{sla}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[var(--egvox-text-muted)]">
                  {locale === 'id' ? 'Lokasi' : 'Location'}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold sm:text-right">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#027F86]" />
                  <span>{loc}</span>
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => openServiceOrderModal(service)}
                className="w-full rounded-xl bg-[#027F86] py-3 text-sm font-semibold text-white hover:bg-[#039998]"
              >
                {locale === 'id' ? 'Pesan Layanan' : 'Request Order'}
              </button>
              <button
                type="button"
                onClick={() => setContactModal(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--egvox-border-default)] py-2.5 text-sm font-semibold hover:bg-[var(--egvox-bg-subtle)]"
              >
                <MessageSquare className="h-4 w-4 text-[#027F86]" />
                <span>
                  {locale === 'id' ? 'Hubungi via Platform' : 'Message on Platform'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={contactModal}
        onClose={() => setContactModal(false)}
        title={
          locale === 'id'
            ? `Hubungi ${service.freelancerName}`
            : `Message ${service.freelancerName}`
        }
        subtitle={
          locale === 'id'
            ? 'Gunakan pesan internal EgvoX untuk diskusi spesifikasi sebelum order'
            : 'Use EgvoX platform messaging to align on scope before placing an order'
        }
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <textarea
            rows={4}
            required
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            placeholder={
              locale === 'id'
                ? 'Tulis kebutuhan jadwal, perangkat, atau target durasi per jam Anda...'
                : 'Describe your schedule, camera rig, or hourly volume target...'
            }
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setContactModal(false)}
              className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm"
            >
              {locale === 'id' ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#027F86] px-4 py-2 text-sm font-semibold text-white"
            >
              {locale === 'id' ? 'Kirim Pesan' : 'Send Message'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
