'use client';

import React, { useState } from 'react';
import {
  Check,
  FileCheck2,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  UserPlus,
  X,
} from 'lucide-react';
import { egvoxFormatIDR, egvoxFormatUSD } from '@/packages/design-system';
import {
  ActiveWorkOrder,
  AdminDisputeCase,
  AdminEnterpriseDeal,
  AdminFinanceRecord,
  AdminModerationListing,
  AdminRbacRole,
  AdminRightsRecord,
  AdminVerificationCase,
  OpsAnnotationProject,
} from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';

export const BreakGlassAccessModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { locale, appendAuditLog, showToast } = useAppState();
  const isId = locale === 'id';
  const [reason, setReason] = useState(
    isId
      ? 'Akses darurat untuk investigasi insiden media/payout.'
      : 'Emergency access for media/payout incident investigation.'
  );
  const [scope, setScope] = useState('Private Media Storage (Read-Only)');
  const [duration, setDuration] = useState('4h');

  if (!open) return null;

  const durationLabel =
    duration === '1h'
      ? isId
        ? '1 jam'
        : '1 hour'
      : duration === '4h'
      ? isId
        ? '4 jam'
        : '4 hours'
      : duration === '12h'
      ? isId
        ? '12 jam'
        : '12 hours'
      : isId
      ? '24 jam'
      : '24 hours';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#C43D3D]/40 bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#C43D3D]" />
            <h3 className="text-base font-bold">
              {isId
                ? 'Permintaan Akses Darurat (Break-Glass)'
                : 'Emergency Break-Glass Access Request'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-[#C43D3D] bg-[#C43D3D]/10 rounded-xl p-3 font-medium">
          {isId
            ? 'Seluruh sesi Break-Glass dibatasi waktu, memerlukan alasan wajib, dan langsung tercatat di Immutable Audit Log.'
            : 'Break-Glass sessions are time-bound, require mandatory justification, and are permanently written to the Immutable Audit Log.'}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reason.trim()) return;
            appendAuditLog(
              `BREAK-GLASS (${durationLabel}): ${reason.trim()}`,
              scope,
              'SA-001',
              'Super Admin (Break-Glass)',
              true
            );
            showToast(
              isId
                ? `Akses Break-Glass (${durationLabel}) aktif untuk ${scope} dan tercatat di Audit Log.`
                : `Break-Glass access (${durationLabel}) granted for ${scope} and logged.`
            );
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Alasan Akses *' : 'Access Reason *'}
            </label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Ruang Lingkup *' : 'Access Scope *'}
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
            >
              <option value="Private Media Storage (Read-Only)">
                Private Media Storage (Read-Only)
              </option>
              <option value="Authorized Ledger & Payout Override">
                {isId ? 'Ledger Reservasi & Payout Override' : 'Authorized Ledger & Payout Override'}
              </option>
              <option value="Org Tenant Compliance Audit">
                Org Tenant Compliance Audit
              </option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Masa Berlaku *' : 'Session Duration *'}
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
            >
              <option value="1h">{isId ? '1 jam' : '1 hour'}</option>
              <option value="4h">{isId ? '4 jam' : '4 hours'}</option>
              <option value="12h">{isId ? '12 jam' : '12 hours'}</option>
              <option value="24h">{isId ? '24 jam' : '24 hours'}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--egvox-border-default)] py-2.5 font-semibold"
            >
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#C43D3D] py-2.5 font-semibold text-white"
            >
              {isId ? 'Ajukan Akses' : 'Request Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AdminVerificationModal: React.FC<{
  item: AdminVerificationCase | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const { locale, decideVerification } = useAppState();
  const isId = locale === 'id';
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-[#027F86]">{item.roleType} KYC Review</p>
            <h3 className="text-base font-bold">{item.entityName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">Email</span>
            <span className="font-mono font-bold">{item.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">{isId ? 'Dokumen' : 'Documents'}</span>
            <span className="font-semibold">{item.documentType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">Risk Tier</span>
            <span className="font-bold text-[#027F86]">{item.riskTier}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              decideVerification(item.id, 'verified');
              onClose();
            }}
            className="rounded-xl bg-[#16835D] py-2.5 font-semibold text-white"
          >
            {isId ? 'Setujui' : 'Approve'}
          </button>
          <button
            type="button"
            onClick={() => {
              decideVerification(item.id, 'revision_requested');
              onClose();
            }}
            className="rounded-xl bg-[#FC840E] py-2.5 font-semibold text-white"
          >
            {isId ? 'Revisi' : 'Revision'}
          </button>
          <button
            type="button"
            onClick={() => {
              decideVerification(item.id, 'rejected');
              onClose();
            }}
            className="rounded-xl border border-[#C43D3D] py-2.5 font-semibold text-[#C43D3D]"
          >
            {isId ? 'Tolak' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminModerationModal: React.FC<{
  item: AdminModerationListing | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const { locale, decideModeration } = useAppState();
  const isId = locale === 'id';
  const [note, setNote] = useState(
    isId
      ? 'Sesuai standar Capture Spec & bukti consent valid.'
      : 'Meets Capture Spec standards with valid consent evidence.'
  );
  if (!item) return null;

  const title = isId ? item.titleId : item.titleEn || item.titleId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono text-[#027F86]">{item.code}</p>
            <h3 className="text-base font-bold">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <img
          src={item.thumbnail}
          alt={title}
          referrerPolicy="no-referrer"
          className="h-40 w-full rounded-xl object-cover"
        />
        <div className="text-xs space-y-1">
          <p>
            {isId ? 'Pemilik:' : 'Owner:'} <strong>{item.ownerName}</strong> · {item.category}
          </p>
          <p className="font-bold text-[#027F86] tabular-nums">
            {egvoxFormatIDR(item.rateIDR)} / {isId ? 'jam' : 'hr'} ({egvoxFormatUSD(item.rateIDR)} USD)
          </p>
        </div>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
        />
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              decideModeration(item.id, 'approved', note);
              onClose();
            }}
            className="rounded-xl bg-[#16835D] py-2.5 font-semibold text-white"
          >
            {isId ? 'Setujui' : 'Approve'}
          </button>
          <button
            type="button"
            onClick={() => {
              decideModeration(item.id, 'revision_requested', note);
              onClose();
            }}
            className="rounded-xl bg-[#FC840E] py-2.5 font-semibold text-white"
          >
            {isId ? 'Revisi' : 'Revision'}
          </button>
          <button
            type="button"
            onClick={() => {
              decideModeration(item.id, 'rejected', note);
              onClose();
            }}
            className="rounded-xl border border-[#C43D3D] py-2.5 font-semibold text-[#C43D3D]"
          >
            {isId ? 'Tolak' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminEnterpriseDealModal: React.FC<{
  deal: AdminEnterpriseDeal | null;
  onClose: () => void;
}> = ({ deal, onClose }) => {
  const { locale, advanceEnterpriseDeal } = useAppState();
  const isId = locale === 'id';
  if (!deal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-[#FC840E]">Enterprise Managed Deal</p>
            <h3 className="text-base font-bold">{deal.companyName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2 tabular-nums">
          <p>{deal.briefSummary}</p>
          <div className="flex justify-between pt-2 border-t border-[var(--egvox-border-default)]">
            <span className="text-[var(--egvox-text-muted)]">
              {isId ? 'Estimasi Volume' : 'Estimated Volume'}
            </span>
            <span className="font-bold">
              {deal.estimatedHours} {isId ? 'jam' : 'hrs'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">
              {isId ? 'Nilai Kontrak' : 'Contract Value'}
            </span>
            <span className="font-bold text-[#027F86]">{egvoxFormatIDR(deal.contractValueIDR)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              advanceEnterpriseDeal(deal.id, 'negotiation');
              onClose();
            }}
            className="rounded-xl border border-[#FC840E] py-2.5 font-semibold text-[#FC840E]"
          >
            {isId ? 'Masuk Negosiasi' : 'Move to Negotiation'}
          </button>
          <button
            type="button"
            onClick={() => {
              advanceEnterpriseDeal(deal.id, 'managed');
              onClose();
            }}
            className="rounded-xl bg-[#027F86] py-2.5 font-semibold text-white"
          >
            Provision Official Project
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminFinanceApprovalModal: React.FC<{
  record: AdminFinanceRecord | null;
  onClose: () => void;
}> = ({ record, onClose }) => {
  const { locale, approveFinanceRecord } = useAppState();
  const isId = locale === 'id';
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono text-[#027F86]">{record.code}</p>
            <h3 className="text-base font-bold">
              {isId ? 'Konfirmasi Dual-Approval Keuangan' : 'Confirm Finance Dual-Approval'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2 tabular-nums">
          <div className="flex justify-between">
            <span>Counterparty</span>
            <span className="font-bold">{record.counterparty}</span>
          </div>
          <div className="flex justify-between">
            <span>{isId ? 'Nominal' : 'Amount'}</span>
            <span className="font-bold text-[#027F86]">
              {egvoxFormatIDR(record.amountIDR)} ({egvoxFormatUSD(record.amountIDR)} USD)
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            approveFinanceRecord(record.id);
            onClose();
          }}
          className="w-full rounded-xl bg-[#16835D] py-2.5 text-xs font-semibold text-white"
        >
          {isId ? 'Sahkan Dual Approval & Posting Ledger' : 'Authorize Dual Approval & Post Ledger'}
        </button>
      </div>
    </div>
  );
};

export const AdminDisputeResolveModal: React.FC<{
  dispute: AdminDisputeCase | null;
  onClose: () => void;
}> = ({ dispute, onClose }) => {
  const { locale, resolveDisputeCase } = useAppState();
  const isId = locale === 'id';
  const [rationale, setRationale] = useState(
    dispute?.rationale ||
      (isId ? 'Keputusan berdasarkan audit QA independen.' : 'Resolution based on independent QA audit.')
  );
  if (!dispute) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono text-[#C43D3D]">
              {dispute.code} · {dispute.workOrderCode}
            </p>
            <h3 className="text-base font-bold">
              {isId ? dispute.titleId : dispute.titleEn || dispute.titleId}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <textarea
          rows={3}
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder={
            isId ? 'Alasan keputusan resolusi sengketa...' : 'Dispute resolution rationale...'
          }
          className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
        />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              resolveDisputeCase(dispute.id, 'in_progress', rationale);
              onClose();
            }}
            className="rounded-xl border border-[#FC840E] py-2.5 font-semibold text-[#FC840E]"
          >
            {isId ? 'Tandai Diproses' : 'Mark In Progress'}
          </button>
          <button
            type="button"
            onClick={() => {
              resolveDisputeCase(dispute.id, 'resolved', rationale);
              onClose();
            }}
            className="rounded-xl bg-[#16835D] py-2.5 font-semibold text-white"
          >
            {isId ? 'Selesaikan Sengketa' : 'Resolve Dispute'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminProvisionUserModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { locale, appendAuditLog, showToast } = useAppState();
  const isId = locale === 'id';
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin Operasional');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[#027F86]" />
            <h3 className="text-base font-bold">
              {isId ? 'Provision Staff Admin Internal' : 'Provision Internal Admin Staff'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[11px] text-[var(--egvox-text-secondary)]">
          {isId
            ? 'Akun Super Admin / Staff Internal hanya dapat dibuat melalui provisioning internal ini (MFA wajib).'
            : 'Internal Super Admin & staff accounts can only be created via internal provisioning (MFA mandatory).'}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim()) return;
            appendAuditLog(
              `Provision admin internal (${role})`,
              email.trim(),
              'SA-001',
              'Super Admin'
            );
            showToast(
              isId
                ? `Akun internal ${email} berhasil diprovisioning dengan peran ${role}.`
                : `Internal account ${email} provisioned with role ${role}.`
            );
            setEmail('');
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@egvox.ai"
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 font-mono"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Admin Operasional">{isId ? 'Admin Operasional' : 'Operations Admin'}</option>
            <option value="Admin Keuangan">{isId ? 'Admin Keuangan' : 'Finance Admin'}</option>
            <option value="Compliance & Rights Officer">Compliance &amp; Rights Officer</option>
          </select>
          <button
            type="submit"
            className="w-full rounded-xl bg-[#027F86] py-2.5 font-semibold text-white"
          >
            {isId ? 'Provision & Aktifkan MFA Wajib' : 'Provision & Enforce Mandatory MFA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const AdminOrderDetailModal: React.FC<{
  order: ActiveWorkOrder | null;
  onClose: () => void;
}> = ({ order, onClose }) => {
  const { locale, appendAuditLog, showToast } = useAppState();
  const isId = locale === 'id';
  if (!order) return null;

  const platformFee = Math.round(order.amount * 0.05);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono font-bold text-[#027F86]">
              {order.code} · {order.specVersion}
            </p>
            <h3 className="text-base font-bold">{isId ? order.title : order.titleEn || order.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2 tabular-nums">
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">Counterparty</span>
            <span className="font-bold">{order.counterparty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">Partial Acceptance</span>
            <span className="font-bold">
              {order.acceptedUnits} / {order.totalUnits} {isId ? order.unitLabel : order.unitLabelEn || order.unitLabel} ({order.progressPercent}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">
              {isId ? 'Nilai Reservasi Kontrak' : 'Contract Reservation Value'}
            </span>
            <span className="font-bold">{egvoxFormatIDR(order.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">Platform Fee Snapshot (5%)</span>
            <span className="font-bold text-[#027F86]">{egvoxFormatIDR(platformFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">
              {isId ? 'Tahap Pipeline' : 'Pipeline Stage'}
            </span>
            <span className="font-bold uppercase text-[#16835D]">{order.stage}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              appendAuditLog(
                `${isId ? 'Inspeksi ledger order' : 'Inspected order ledger'} ${order.code}`,
                order.counterparty
              );
              showToast(
                isId
                  ? `Snapshot ledger reservasi ${order.code} terverifikasi dan dicatat ke Audit Log.`
                  : `Reservation ledger snapshot for ${order.code} verified and logged.`
              );
              onClose();
            }}
            className="rounded-xl bg-[#027F86] py-2.5 font-semibold text-white"
          >
            {isId ? 'Verifikasi Ledger' : 'Verify Ledger'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--egvox-border-default)] py-2.5 font-semibold"
          >
            {isId ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminSchemaAuditModal: React.FC<{
  project: OpsAnnotationProject | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const { locale, appendAuditLog, showToast } = useAppState();
  const isId = locale === 'id';
  const [iouThreshold, setIouThreshold] = useState('0.75');
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-[#027F86]" />
            <div>
              <p className="text-xs font-mono text-[#027F86]">
                {project.code} · {project.schemaVersion}
              </p>
              <h3 className="text-base font-bold">
                {isId ? project.titleId : project.titleEn || project.titleId}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2 tabular-nums">
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">Lead Annotator</span>
            <span className="font-bold">{project.annotatorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">QA Specialist</span>
            <span className="font-bold">{project.reviewerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">Label Taxonomy</span>
            <span className="font-semibold">Hand (L/R), Knife, Tomato, Onion, Bowl</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[var(--egvox-text-muted)]">Min. IoU Threshold</span>
            <select
              value={iouThreshold}
              onChange={(e) => setIouThreshold(e.target.value)}
              className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2 py-1 font-mono font-bold"
            >
              <option value="0.70">0.70</option>
              <option value="0.75">0.75 (Standard)</option>
              <option value="0.85">0.85 (Strict)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            appendAuditLog(
              `${isId ? 'Audit skema anotasi' : 'Schema audit verified'} ${project.schemaVersion} (IoU ${iouThreshold})`,
              project.code
            );
            showToast(
              isId
                ? `Skema ${project.code} disahkan sesuai Master PRD v1.3.`
                : `Schema ${project.code} approved per Master PRD v1.3.`
            );
            onClose();
          }}
          className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
        >
          {isId ? 'Sahkan Audit Skema & Catat Log' : 'Approve Schema Audit & Log'}
        </button>
      </div>
    </div>
  );
};

export const AdminRightsInspectorModal: React.FC<{
  record: AdminRightsRecord | null;
  onClose: () => void;
}> = ({ record, onClose }) => {
  const { locale, updateRightsStatus, showToast } = useAppState();
  const isId = locale === 'id';
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#027F86]" />
            <div>
              <p className="text-xs font-mono text-[#027F86]">
                {record.code} · {record.projectCode}
              </p>
              <h3 className="text-base font-bold">{record.subjectTitle}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">{isId ? 'Jenis Hak' : 'Rights Kind'}</span>
            <span className="font-bold uppercase">{record.kind.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">{isId ? 'Teritori Berlaku' : 'Territory'}</span>
            <span className="font-semibold">{record.territory}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">{isId ? 'Kebijakan Retensi' : 'Retention Policy'}</span>
            <span className="font-semibold">{record.retentionLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">{isId ? 'Eksploitasi Raw Publik' : 'Public Raw Exposure'}</span>
            <span className="font-bold text-[#16835D]">
              {isId ? 'Dilarang (EgvoX Private Custodial)' : 'Prohibited (Private Custodial)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--egvox-text-muted)]">{isId ? 'Pelatihan Model Otomatis' : 'Automated Model Training'}</span>
            <span className="font-bold text-[#C43D3D]">
              {isId ? 'Out of Scope / Dinonaktifkan' : 'Out of Scope / Disabled'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              updateRightsStatus(record.id, 'valid');
              showToast(isId ? `${record.code} ditandai Valid.` : `${record.code} marked Valid.`);
              onClose();
            }}
            className="rounded-xl bg-[#16835D] py-2.5 font-semibold text-white"
          >
            {isId ? 'Validasi' : 'Validate'}
          </button>
          <button
            type="button"
            onClick={() => {
              updateRightsStatus(record.id, 'review');
              showToast(
                isId
                  ? `${record.code} dimasukkan ke antrian Review.`
                  : `${record.code} moved to Review queue.`
              );
              onClose();
            }}
            className="rounded-xl bg-[#FC840E] py-2.5 font-semibold text-white"
          >
            Review
          </button>
          <button
            type="button"
            onClick={() => {
              updateRightsStatus(record.id, 'revoked');
              showToast(isId ? `${record.code} dicabut (Revoked).` : `${record.code} revoked.`);
              onClose();
            }}
            className="rounded-xl border border-[#C43D3D] py-2.5 font-semibold text-[#C43D3D]"
          >
            {isId ? 'Cabut' : 'Revoke'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminSystemConfigModal: React.FC<{
  configTitle: string | null;
  onClose: () => void;
}> = ({ configTitle, onClose }) => {
  const { locale, appendAuditLog, showToast } = useAppState();
  const isId = locale === 'id';
  const [strictPrivateVault, setStrictPrivateVault] = useState(true);
  const [dualApprovalThreshold, setDualApprovalThreshold] = useState('Rp 25.000.000');
  const [slaTargetHours, setSlaTargetHours] = useState('24');

  if (!configTitle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#027F86]" />
            <h3 className="text-base font-bold">{configTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            appendAuditLog(
              `${isId ? 'Perbarui konfigurasi:' : 'Updated config:'} ${configTitle} (SLA ${slaTargetHours}h)`,
              'System Config'
            );
            showToast(
              isId
                ? `Konfigurasi "${configTitle}" disimpan & dicatat di Audit Log.`
                : `Configuration "${configTitle}" saved & recorded in Audit Log.`
            );
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <label className="flex items-center justify-between rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5">
            <span className="font-semibold">
              {isId ? 'Isolasi Private Raw Vault (Signed URL)' : 'Private Raw Vault Isolation (Signed URLs)'}
            </span>
            <input
              type="checkbox"
              checked={strictPrivateVault}
              onChange={(e) => setStrictPrivateVault(e.target.checked)}
              className="h-4 w-4 accent-[#027F86]"
            />
          </label>
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Ambang Batas Dual-Approval Payout' : 'Dual-Approval Payout Threshold'}
            </label>
            <input
              type="text"
              value={dualApprovalThreshold}
              onChange={(e) => setDualApprovalThreshold(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              {isId ? 'Target SLA QA & Karantina (Jam)' : 'QA & Quarantine SLA Target (Hours)'}
            </label>
            <input
              type="number"
              min={4}
              max={168}
              value={slaTargetHours}
              onChange={(e) => setSlaTargetHours(e.target.value)}
              className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 font-mono tabular-nums"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--egvox-border-default)] py-2.5 font-semibold"
            >
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#027F86] py-2.5 font-semibold text-white"
            >
              {isId ? 'Simpan Kebijakan' : 'Save Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ALL_RBAC_PERMISSIONS = [
  'full_access',
  'dual_approval_override',
  'break_glass_grant',
  'kyc_verify',
  'listing_moderate',
  'media_qa_review',
  'payout_approve',
  'invoice_manage',
  'reconcile_ledger',
  'rights_inspect',
  'dispute_escalate',
  'consent_revoke',
];

export const AdminRbacEditModal: React.FC<{
  role: AdminRbacRole | null;
  onClose: () => void;
}> = ({ role, onClose }) => {
  const { locale, updateRbacRolePermissions } = useAppState();
  const isId = locale === 'id';
  const [selected, setSelected] = useState<string[]>(role?.permissions || []);

  if (!role) return null;

  const activeSet = selected.length > 0 || role.permissions.length === 0 ? selected : role.permissions;

  const togglePerm = (perm: string) => {
    const base = selected.length > 0 ? selected : role.permissions;
    if (base.includes(perm)) {
      setSelected(base.filter((p) => p !== perm));
    } else {
      setSelected([...base, perm]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#027F86]" />
            <div>
              <p className="text-xs font-bold text-[#027F86]">RBAC Role Matrix</p>
              <h3 className="text-base font-bold">{role.name}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--egvox-bg-subtle)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--egvox-text-secondary)]">
          {isId ? role.descriptionId : role.descriptionEn}
        </p>

        <div className="max-h-60 overflow-y-auto grid grid-cols-1 gap-1.5 text-xs">
          {ALL_RBAC_PERMISSIONS.map((perm) => {
            const checked = activeSet.includes(perm);
            return (
              <button
                key={perm}
                type="button"
                onClick={() => togglePerm(perm)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 font-mono text-left ${
                  checked
                    ? 'border-[#027F86] bg-[#027F86]/8 text-[#027F86]'
                    : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)]'
                }`}
              >
                <span>{perm}</span>
                {checked && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--egvox-border-default)] py-2.5 font-semibold"
          >
            {isId ? 'Batal' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => {
              updateRbacRolePermissions(role.id, activeSet);
              onClose();
            }}
            className="rounded-xl bg-[#027F86] py-2.5 font-semibold text-white"
          >
            {isId ? 'Simpan Permissions' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
};

