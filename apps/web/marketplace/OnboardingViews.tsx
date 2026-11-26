'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, FileUp, ShieldCheck } from 'lucide-react';
import { ACTIVITY_CATEGORIES } from '@/lib/catalog-data';
import { useAppState } from '@/lib/hooks/useAppState';
import { ActivityCategorySlug, FreelancerServiceListing } from '@/packages/shared-types';
import { validateEnterpriseInquiry } from '@/packages/validation-schemas';

const ANNOTATOR_SPEC_OPTIONS = [
  '2D/3D Bounding Box',
  'Hand & Finger Keypoints',
  'Temporal Action Segmentation',
  'Object Tracking',
  'Semantic Segmentation',
];

const ANNOTATOR_TOOL_OPTIONS = [
  'CVAT',
  'Label Studio',
  'Encord',
  'Supervisely',
  'Scale Studio',
];

const QA_SCOPE_OPTIONS = [
  'PII & Face-Blur Audit',
  'Consent & Rights Verification',
  'Bounding Box IoU Review',
  'Temporal Alignment Check',
  'FFmpeg Codec & FPS Check',
];

const QA_TOOL_OPTIONS = [
  'FFmpeg Probe',
  'CVAT QA Queue',
  'EgvoX PII Scanner',
  'JSONL Schema Validator',
];

export const FreelancerOnboardingView: React.FC = () => {
  const router = useRouter();
  const { locale, setActiveRole, showToast, createFreelancerService, submitKyc } = useAppState();
  const isId = locale === 'id';
  const [step, setStep] = useState(1);

  // Step 1: Role selection
  const [isContributor, setIsContributor] = useState(true);
  const [isAnnotator, setIsAnnotator] = useState(false);
  const [isQaSpecialist, setIsQaSpecialist] = useState(false);
  const [qaConflictAccepted, setQaConflictAccepted] = useState(true);

  // Step 2: Role-specific & shared capability fields
  const [capabilityTitle, setCapabilityTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ActivityCategorySlug[]>(['cooking']);
  const [weeklyCapacity, setWeeklyCapacity] = useState(isId ? '± 20 jam / minggu' : '± 20 hours / week');
  const [deliverySla, setDeliverySla] = useState(isId ? '24 – 48 jam per batch' : '24 – 48 hours per batch');
  const [city, setCity] = useState('Jabodetabek, Indonesia');
  const [bioDescription, setBioDescription] = useState('');

  // Video Contributor fields
  const [cameraSpec, setCameraSpec] = useState('GoPro Hero 12 Black');
  const [mountingRig, setMountingRig] = useState('Head-mounted');
  const [resolutionFps, setResolutionFps] = useState('1080p60 / 4K30 MP4 (H.264)');

  // Data Annotator fields
  const [annotatorSpecs, setAnnotatorSpecs] = useState<string[]>([
    '2D/3D Bounding Box',
    'Temporal Action Segmentation',
  ]);
  const [annotatorTools, setAnnotatorTools] = useState<string[]>(['CVAT', 'Label Studio']);
  const [workstationSpec, setWorkstationSpec] = useState('Dual-Monitor 4K Workstation + Pen Display');
  const [annotatorSchema, setAnnotatorSchema] = useState('JSONL + COCO JSON');

  // QA Specialist fields
  const [qaScopes, setQaScopes] = useState<string[]>([
    'PII & Face-Blur Audit',
    'Bounding Box IoU Review',
    'FFmpeg Codec & FPS Check',
  ]);
  const [qaTools, setQaTools] = useState<string[]>(['FFmpeg Probe', 'CVAT QA Queue', 'EgvoX PII Scanner']);
  const [qaStandardSpec, setQaStandardSpec] = useState('IoU ≥ 0.85 & Zero PII Tolerance');

  // Step 3: Portfolio preview
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioFileName, setPortfolioFileName] = useState('');
  const [portfolioConsent, setPortfolioConsent] = useState(true);

  const steps = isId
    ? ['Profil', 'Keahlian', 'Portfolio', 'Verifikasi']
    : ['Profile', 'Skills', 'Portfolio', 'Verification'];

  const primaryRole: FreelancerServiceListing['roleType'] = isContributor
    ? 'Video Contributor'
    : isAnnotator
    ? 'Data Annotator'
    : 'QA Specialist';

  const toggleItem = <T extends string>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    item: T
  ) => {
    setList((prev) =>
      prev.includes(item)
        ? prev.length > 1
          ? prev.filter((x) => x !== item)
          : prev
        : [...prev, item]
    );
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!isContributor && !isAnnotator && !isQaSpecialist) {
        showToast(
          isId
            ? 'Pilih minimal satu kategori peran talenta.'
            : 'Please select at least one talent role.'
        );
        return;
      }
      if (isQaSpecialist && !qaConflictAccepted) {
        showToast(
          isId
            ? 'QA Specialist wajib menyetujui Deklarasi Anti-Konflik Kepentingan.'
            : 'QA Specialists must accept the Anti-Conflict Policy.'
        );
        return;
      }
    }
    if (step === 3 && !portfolioConsent) {
      showToast(
        isId
          ? 'Konfirmasi persetujuan hak & izin portfolio preview terlebih dahulu.'
          : 'Please confirm rights and participant consent for your preview sample.'
      );
      return;
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const finish = () => {
    const resolvedTitle =
      capabilityTitle.trim() ||
      (primaryRole === 'Video Contributor'
        ? isId
          ? 'Kontributor Pengambilan Video Egocentric (Head/Chest POV)'
          : 'Egocentric Video Capture Contributor (Head/Chest POV)'
        : primaryRole === 'Data Annotator'
        ? isId
          ? 'Spesialis Anotasi Temporal Action, Bounding Box & Keypoint'
          : 'Temporal Action, Bounding Box & Keypoint Annotator'
        : isId
        ? 'Spesialis Audit QA Video, Anotasi IoU & Kepatuhan PII'
        : 'Video, Annotation IoU & PII Compliance QA Auditor');

    const equipmentList: string[] = [];
    if (isContributor) equipmentList.push(cameraSpec.trim(), `${mountingRig} Rig`);
    if (isAnnotator) equipmentList.push(workstationSpec.trim(), ...annotatorSpecs);
    if (isQaSpecialist) equipmentList.push(qaStandardSpec.trim(), ...qaScopes);

    const toolsList =
      primaryRole === 'Data Annotator'
        ? annotatorTools
        : primaryRole === 'QA Specialist'
        ? qaTools
        : [mountingRig, cameraSpec.trim()];

    const schemasList =
      primaryRole === 'Data Annotator'
        ? [annotatorSchema]
        : primaryRole === 'QA Specialist'
        ? qaScopes
        : [resolutionFps];

    const resolvedDescription =
      bioDescription.trim() ||
      (primaryRole === 'Video Contributor'
        ? `${cameraSpec} (${mountingRig}), ${resolutionFps}. SLA ${deliverySla}.`
        : primaryRole === 'Data Annotator'
        ? `${annotatorSpecs.join(', ')} via ${annotatorTools.join(', ')}. Output ${annotatorSchema}. SLA ${deliverySla}.`
        : `${qaScopes.join(', ')} (${qaStandardSpec}). SLA ${deliverySla}.`);

    createFreelancerService({
      title: resolvedTitle,
      roleType: primaryRole,
      location: city.trim() || 'Indonesia',
      description: resolvedDescription,
      categories: selectedCategories,
      capacityLabel: weeklyCapacity.trim(),
      deliverySla: deliverySla.trim(),
      equipment: equipmentList.filter(Boolean),
      resolutionFps:
        primaryRole === 'Video Contributor'
          ? resolutionFps
          : primaryRole === 'Data Annotator'
          ? annotatorSchema
          : qaStandardSpec,
      annotationTools: toolsList.filter(Boolean),
      supportedSchemas: schemasList.filter(Boolean),
      portfolioTitle: portfolioTitle.trim() || undefined,
      conflictDisclosureDeclared: isQaSpecialist ? qaConflictAccepted : undefined,
      conflictDisclosureText: isQaSpecialist
        ? isId
          ? 'Independen: tidak pernah mengaudit rekaman atau anotasi milik sendiri dalam Work Order yang sama.'
          : 'Independent: never audits self-captured footage or self-labeled tasks within the same Work Order.'
        : undefined,
    });

    submitKyc('KTP / National ID');
    setActiveRole('freelancer');
    showToast(
      isId
        ? 'Profil Talenta Freelancer & dokumen KYC dikirim untuk moderasi ke katalog rekrutmen.'
        : 'Freelancer Talent profile and KYC submitted for catalog moderation.'
    );
    router.push('/workspace');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {isId ? 'Onboarding Talenta Freelancer' : 'Freelancer Talent Onboarding'}
          </h1>
          <p className="mt-1 text-xs text-[var(--egvox-text-muted)]">
            {isId
              ? 'Lengkapi spesialisasi, perangkat atau tools, kapasitas, dan portfolio berizin. Kompensasi dibahas melalui penawaran rekrutmen privat.'
              : 'Complete your specialization, equipment or tools, capacity, and consented portfolio. Compensation is discussed via private recruitment offers.'}
          </p>
        </div>

        {/* 4 Step Indicator */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((label, idx) => {
            const num = idx + 1;
            const active = step >= num;
            return (
              <div key={label} className="text-center">
                <div
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tabular-nums ${
                    active
                      ? 'bg-[#027F86] text-white'
                      : 'bg-[var(--egvox-bg-subtle)] text-[var(--egvox-text-muted)]'
                  }`}
                >
                  {num}
                </div>
                <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-[var(--egvox-text-secondary)] truncate">
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">
              {isId ? 'Pilih Kategori Talenta Anda' : 'Select Your Talent Roles'}
            </p>
            <label className="flex items-start gap-3 rounded-xl border border-[var(--egvox-border-default)] p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isContributor}
                onChange={(e) => setIsContributor(e.target.checked)}
                className="mt-1 h-4 w-4 text-[#027F86]"
              />
              <div>
                <p className="text-sm font-bold">Video Contributor</p>
                <p className="text-xs text-[var(--egvox-text-secondary)]">
                  {isId
                    ? 'Pengambilan data video sudut pandang pertama (egocentric) untuk aktivitas harian atau industri.'
                    : 'First-person egocentric video capture for daily or industrial workflows.'}
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 rounded-xl border border-[var(--egvox-border-default)] p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnnotator}
                onChange={(e) => setIsAnnotator(e.target.checked)}
                className="mt-1 h-4 w-4 text-[#027F86]"
              />
              <div>
                <p className="text-sm font-bold">Data Annotator</p>
                <p className="text-xs text-[var(--egvox-text-secondary)]">
                  {isId
                    ? 'Pelabelan data manusia: bounding box, pose estimation, segmentasi temporal, dan tracking.'
                    : 'Human labeling: bounding boxes, pose estimation, temporal segmentation, and tracking.'}
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 rounded-xl border border-[var(--egvox-border-default)] p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isQaSpecialist}
                onChange={(e) => setIsQaSpecialist(e.target.checked)}
                className="mt-1 h-4 w-4 text-[#027F86]"
              />
              <div>
                <p className="text-sm font-bold">QA Specialist</p>
                <p className="text-xs text-[var(--egvox-text-secondary)]">
                  {isId
                    ? 'Pemeriksaan kualitas video, anotasi, PII, dan metadata sesuai standar acceptance criteria.'
                    : 'Quality audit of video, annotations, PII compliance, and dataset metadata.'}
                </p>
              </div>
            </label>
            {isQaSpecialist && (
              <label className="flex items-start gap-2.5 rounded-xl bg-[#2563A6]/8 border border-[#2563A6]/25 p-3 text-xs">
                <input
                  type="checkbox"
                  checked={qaConflictAccepted}
                  onChange={(e) => setQaConflictAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-[#027F86]"
                />
                <span>
                  {isId
                    ? 'Saya menyetujui Deklarasi Anti-Konflik Kepentingan: tidak akan melakukan QA pada rekaman/anotasi milik sendiri di Work Order yang sama.'
                    : 'I agree to the Anti-Conflict Policy: never auditing my own footage or annotations within the same Work Order.'}
                </span>
              </label>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold">
                {isId ? 'Judul Profil Kapabilitas Utama' : 'Primary Capability Headline'}
              </label>
              <input
                type="text"
                value={capabilityTitle}
                onChange={(e) => setCapabilityTitle(e.target.value)}
                placeholder={
                  primaryRole === 'Video Contributor'
                    ? isId
                      ? 'Mis. Kontributor Video Egocentric Dapur & Manufaktur (4K60)'
                      : 'e.g. Egocentric Kitchen & Manufacturing Video Contributor (4K60)'
                    : primaryRole === 'Data Annotator'
                    ? isId
                      ? 'Mis. Spesialis Anotasi Hand Keypoint & Temporal Action (CVAT)'
                      : 'e.g. Hand Keypoint & Temporal Action Annotator (CVAT)'
                    : isId
                    ? 'Mis. Auditor QA IoU, Codec & Kepatuhan PII Dataset'
                    : 'e.g. Dataset QA Auditor — IoU, Codec & PII Compliance'
                }
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                {isId ? 'Domain Aktivitas yang Dikuasai' : 'Supported Activity Domains'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ACTIVITY_CATEGORIES.map((cat) => {
                  const selected = selectedCategories.includes(cat.slug);
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => toggleItem(selectedCategories, setSelectedCategories, cat.slug)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-colors ${
                        selected
                          ? 'border-[#027F86] bg-[#027F86]/12 text-[#027F86]'
                          : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-secondary)]'
                      }`}
                    >
                      {isId ? cat.nameId : cat.nameEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {isContributor && (
              <div className="rounded-xl border border-[#027F86]/25 bg-[#027F86]/5 p-4 space-y-3">
                <p className="text-xs font-bold text-[#027F86]">
                  {isId ? 'Spesifikasi Video Contributor (Perangkat & Rig)' : 'Video Contributor Specs (Camera & Rig)'}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold">
                      {isId ? 'Perangkat Kamera' : 'Camera Device'}
                    </label>
                    <input
                      type="text"
                      value={cameraSpec}
                      onChange={(e) => setCameraSpec(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold">
                      {isId ? 'Mounting Rig POV' : 'POV Mounting Rig'}
                    </label>
                    <select
                      value={mountingRig}
                      onChange={(e) => setMountingRig(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                    >
                      <option value="Head-mounted">Head-mounted</option>
                      <option value="Chest-mounted">Chest-mounted</option>
                      <option value="Wearable Glasses">Wearable Glasses</option>
                      <option value="Handheld">Handheld</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold">
                    {isId ? 'Resolusi & Frame Rate' : 'Resolution & Frame Rate'}
                  </label>
                  <input
                    type="text"
                    value={resolutionFps}
                    onChange={(e) => setResolutionFps(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
              </div>
            )}

            {isAnnotator && (
              <div className="rounded-xl border border-[#2563A6]/25 bg-[#2563A6]/5 p-4 space-y-3">
                <p className="text-xs font-bold text-[#2563A6]">
                  {isId ? 'Spesifikasi Data Annotator (Tools & Skema Output)' : 'Data Annotator Specs (Tools & Output Schema)'}
                </p>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Jenis Tugas Anotasi' : 'Annotation Tasks'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ANNOTATOR_SPEC_OPTIONS.map((opt) => {
                      const active = annotatorSpecs.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleItem(annotatorSpecs, setAnnotatorSpecs, opt)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold border ${
                            active
                              ? 'border-[#2563A6] bg-[#2563A6]/12 text-[#2563A6]'
                              : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-secondary)]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Platform Anotasi yang Dikuasai' : 'Annotation Platforms'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ANNOTATOR_TOOL_OPTIONS.map((tool) => {
                      const active = annotatorTools.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleItem(annotatorTools, setAnnotatorTools, tool)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold border ${
                            active
                              ? 'border-[#2563A6] bg-[#2563A6]/12 text-[#2563A6]'
                              : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-secondary)]'
                          }`}
                        >
                          {tool}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold">
                      {isId ? 'Workstation Anotasi' : 'Annotation Workstation'}
                    </label>
                    <input
                      type="text"
                      value={workstationSpec}
                      onChange={(e) => setWorkstationSpec(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold">
                      {isId ? 'Format Skema Export' : 'Supported Export Schema'}
                    </label>
                    <select
                      value={annotatorSchema}
                      onChange={(e) => setAnnotatorSchema(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                    >
                      <option value="JSONL + COCO JSON">JSONL + COCO JSON</option>
                      <option value="COCO JSON + CVAT XML">COCO JSON + CVAT XML</option>
                      <option value="CSV + Temporal JSON">CSV + Temporal JSON</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {isQaSpecialist && (
              <div className="rounded-xl border border-[#7C3AED]/25 bg-[#7C3AED]/5 p-4 space-y-3">
                <p className="text-xs font-bold text-[#7C3AED]">
                  {isId ? 'Spesifikasi QA Specialist (Cakupan Audit & Tools)' : 'QA Specialist Specs (Audit Scope & Tools)'}
                </p>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Cakupan Pemeriksaan QA' : 'QA Inspection Scopes'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QA_SCOPE_OPTIONS.map((scope) => {
                      const active = qaScopes.includes(scope);
                      return (
                        <button
                          key={scope}
                          type="button"
                          onClick={() => toggleItem(qaScopes, setQaScopes, scope)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold border ${
                            active
                              ? 'border-[#7C3AED] bg-[#7C3AED]/12 text-[#7C3AED]'
                              : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-secondary)]'
                          }`}
                        >
                          {scope}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {isId ? 'Tools Audit & Verifikasi' : 'QA Audit Tools'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QA_TOOL_OPTIONS.map((tool) => {
                      const active = qaTools.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleItem(qaTools, setQaTools, tool)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold border ${
                            active
                              ? 'border-[#7C3AED] bg-[#7C3AED]/12 text-[#7C3AED]'
                              : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-secondary)]'
                          }`}
                        >
                          {tool}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold">
                    {isId ? 'Standar Pemeriksaan QA' : 'QA Acceptance Standard'}
                  </label>
                  <input
                    type="text"
                    value={qaStandardSpec}
                    onChange={(e) => setQaStandardSpec(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Kapasitas Mingguan' : 'Weekly Capacity'}
                </label>
                <input
                  type="text"
                  value={weeklyCapacity}
                  onChange={(e) => setWeeklyCapacity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Target Turnaround SLA' : 'Delivery SLA'}
                </label>
                <input
                  type="text"
                  value={deliverySla}
                  onChange={(e) => setDeliverySla(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isContributor
                    ? isId
                      ? 'Lokasi Cakupan Area'
                      : 'Capture Location'
                    : isId
                    ? 'Zona Waktu / Kota'
                    : 'Timezone / City'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold">
                {isId ? 'Ringkasan Pengalaman & Kesiapan Kerja' : 'Experience & Workflow Summary'}
              </label>
              <textarea
                rows={3}
                value={bioDescription}
                onChange={(e) => setBioDescription(e.target.value)}
                placeholder={
                  isId
                    ? 'Jelaskan pengalaman domain, SOP kebersihan/keselamatan atau akurasi anotasi, serta kesiapan jadwal Anda...'
                    : 'Describe your domain experience, workflow rigor, and schedule readiness...'
                }
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2 text-xs"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold">
              {primaryRole === 'Video Contributor'
                ? isId
                  ? 'Upload Portfolio Preview (30–60 detik, Berizin)'
                  : 'Upload Portfolio Preview (30–60s, Consented)'
                : primaryRole === 'Data Annotator'
                ? isId
                  ? 'Upload Sampel Visual Anotasi (Berizin & Ter-watermark)'
                  : 'Upload Anonymized Annotation Sample (Watermarked)'
                : isId
                ? 'Upload Sampel Laporan Audit QA (Ter-anonimisasi)'
                : 'Upload Anonymized QA Audit Report Sample'}
            </p>
            <div>
              <label className="block text-xs font-semibold mb-1">
                {isId ? 'Judul Sampel Portfolio' : 'Portfolio Sample Title'}
              </label>
              <input
                type="text"
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
                placeholder={
                  primaryRole === 'Video Contributor'
                    ? isId
                      ? 'Contoh: POV Memasak 45 detik (Head-mount 1080p60)'
                      : 'e.g. Kitchen POV 45s Sample (Head-mount 1080p60)'
                    : primaryRole === 'Data Annotator'
                    ? isId
                      ? 'Contoh: Cuplikan Bounding Box & Keypoint Tangan (JSONL)'
                      : 'e.g. Hand Keypoint & BBox Preview (JSONL)'
                    : isId
                    ? 'Contoh: Checklist Audit QA & Verifikasi PII Batch'
                    : 'e.g. QA Batch Audit & PII Verification Sample'
                }
                className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-xs"
              />
            </div>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-6 text-center text-xs text-[var(--egvox-text-secondary)]">
              <FileUp className="h-6 w-6 text-[#027F86]" />
              <span>
                {portfolioFileName
                  ? `${isId ? 'File terpilih:' : 'Selected file:'} ${portfolioFileName}`
                  : isId
                  ? 'Pilih sampel preview ter-watermark (bukan full raw video / data klien)'
                  : 'Choose a watermarked preview sample (never upload full raw client footage)'}
              </span>
              <input
                type="file"
                className="sr-only"
                onChange={(e) => setPortfolioFileName(e.target.files?.[0]?.name || '')}
              />
            </label>
            <label className="flex items-start gap-2.5 text-xs text-[var(--egvox-text-secondary)]">
              <input
                type="checkbox"
                checked={portfolioConsent}
                onChange={(e) => setPortfolioConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#027F86]"
              />
              <span>
                {isId
                  ? 'Saya menyatakan memiliki hak dan izin peserta atas portfolio preview ini (tidak mengandung data rahasia klien).'
                  : 'I confirm I hold full rights and participant consent for this preview sample.'}
              </span>
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#16835D]/30 bg-[#16835D]/8 p-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 font-bold text-[#16835D]">
                <ShieldCheck className="h-5 w-5" />
                <span>
                  {isId
                    ? 'Siap untuk Verifikasi Identitas (KYC) & Moderasi'
                    : 'Ready for KYC & Listing Moderation'}
                </span>
              </div>
              <p className="text-xs text-[var(--egvox-text-secondary)]">
                {isId
                  ? 'Setelah disubmit, tim Trust & Safety meninjau identitas, perangkat/tools, dan sampel Anda sebelum profil kapabilitas dipublikasikan di Katalog Rekrutmen (tanpa tarif publik).'
                  : 'Once submitted, Trust & Safety reviews your identity, gear/tools, and preview sample prior to public listing in the Recruitment Catalog (without public rates).'}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-1.5">
              <p className="font-bold text-[var(--egvox-text-primary)]">
                {isId ? 'Ringkasan Profil Onboarding:' : 'Onboarding Summary:'}
              </p>
              <p>
                <span className="text-[var(--egvox-text-muted)]">{isId ? 'Peran Utama:' : 'Primary Role:'}</span>{' '}
                <strong>{primaryRole}</strong>
                {(Number(isContributor) + Number(isAnnotator) + Number(isQaSpecialist) > 1) &&
                  ` (+${Number(isContributor) + Number(isAnnotator) + Number(isQaSpecialist) - 1} ${isId ? 'peran tambahan' : 'additional'})`}
              </p>
              <p>
                <span className="text-[var(--egvox-text-muted)]">{isId ? 'Kapasitas & SLA:' : 'Capacity & SLA:'}</span>{' '}
                <strong>{weeklyCapacity} · {deliverySla}</strong>
              </p>
              <p>
                <span className="text-[var(--egvox-text-muted)]">{isId ? 'Lokasi:' : 'Location:'}</span>{' '}
                <strong>{city}</strong>
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
            className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm font-medium"
          >
            {isId ? 'Kembali' : 'Back'}
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="rounded-lg bg-[#027F86] px-5 py-2 text-sm font-semibold text-white"
            >
              {isId ? 'Lanjutkan' : 'Continue'}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="rounded-lg bg-[#027F86] px-5 py-2 text-sm font-semibold text-white"
            >
              {isId ? 'Simpan & Masuk Workspace' : 'Save & Open Workspace'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const VendorOnboardingView: React.FC = () => {
  const router = useRouter();
  const { locale, setActiveRole, showToast, submitKyc } = useAppState();
  const isId = locale === 'id';
  const [step, setStep] = useState(1);

  // Step 1: Organization
  const [orgName, setOrgName] = useState('PT Contoh Data Nusantara');
  const [tradingName, setTradingName] = useState('Contoh Data Studio');
  const [orgType, setOrgType] = useState('Perusahaan (PT)');
  const [country, setCountry] = useState('Indonesia');
  const [industry, setIndustry] = useState('AI Vision & Robotics Data');

  // Step 2: Legal / KYB
  const [taxId, setTaxId] = useState('');
  const [website, setWebsite] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [operatingAddress, setOperatingAddress] = useState('');
  const [docFileName, setDocFileName] = useState('');

  // Step 3: Authorized Representative
  const [repName, setRepName] = useState('');
  const [repTitle, setRepTitle] = useState('');
  const [repEmail, setRepEmail] = useState('');
  const [repPhone, setRepPhone] = useState('');

  // Step 4: Agreements
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [kybDeclarationAccepted, setKybDeclarationAccepted] = useState(false);

  const steps = isId
    ? ['Organisasi', 'Legal', 'Representatif', 'Ketentuan']
    : ['Organization', 'Legal', 'Representative', 'Terms'];

  const handleNext = () => {
    if (step === 1 && !orgName.trim()) {
      showToast(isId ? 'Nama perusahaan wajib diisi.' : 'Company name is required.');
      return;
    }
    if (step === 2 && (!taxId.trim() || !businessEmail.trim())) {
      showToast(
        isId
          ? 'Nomor NIB / NPWP dan email bisnis resmi wajib diisi.'
          : 'Tax / registration ID and official business email are required.'
      );
      return;
    }
    if (step === 3 && (!repName.trim() || !repEmail.trim() || !repPhone.trim())) {
      showToast(
        isId
          ? 'Nama lengkap, email, dan nomor telepon representatif berwenang wajib diisi.'
          : 'Representative name, email, and phone number are required.'
      );
      return;
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const finish = () => {
    if (!termsAccepted || !kybDeclarationAccepted) {
      showToast(
        isId
          ? 'Centang persetujuan Vendor Terms dan deklarasi verifikasi KYB sebelum menyelesaikan.'
          : 'Please accept Vendor Terms and KYB declaration before completing.'
      );
      return;
    }
    submitKyc('NIB / Company Akta');
    setActiveRole('vendor');
    showToast(
      isId
        ? `Profil organisasi ${orgName} dikirim untuk verifikasi KYB.`
        : `Organization profile ${orgName} submitted for KYB verification.`
    );
    router.push('/workspace?role=vendor');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {isId
              ? 'Onboarding Dataset Vendor / Data Provider'
              : 'Dataset Vendor / Provider Onboarding'}
          </h1>
          <p className="mt-1 text-xs text-[var(--egvox-text-muted)]">
            {isId
              ? 'Organisasi Vendor terverifikasi dapat mempublikasikan Project Catalog, membuka seleksi proposal, dan merekrut talenta.'
              : 'Verified Vendor organizations can publish Project Catalog briefs, screen proposals, and recruit talent.'}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {steps.map((label, idx) => (
            <div key={label} className="text-center">
              <div
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  step >= idx + 1
                    ? 'bg-[#027F86] text-white'
                    : 'bg-[var(--egvox-bg-subtle)] text-[var(--egvox-text-muted)]'
                }`}
              >
                {idx + 1}
              </div>
              <p className="mt-1 text-[10px] sm:text-[11px] truncate">{label}</p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Nama Legal Perusahaan *' : 'Legal Company Name *'}
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Nama Merek / Studio' : 'Trading / Brand Name'}
                </label>
                <input
                  type="text"
                  value={tradingName}
                  onChange={(e) => setTradingName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Jenis Organisasi *' : 'Organization Type *'}
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                >
                  <option value="Perusahaan (PT)">
                    {isId ? 'Perusahaan (PT)' : 'Corporation / LLC'}
                  </option>
                  <option value="Lembaga Riset / Universitas">
                    {isId ? 'Lembaga Riset / Universitas' : 'Research Lab / University'}
                  </option>
                  <option value="Data Collection Studio">
                    Data Collection Studio
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Negara *' : 'Country *'}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                >
                  <option value="Indonesia">Indonesia</option>
                  <option value="Singapore">{isId ? 'Singapura' : 'Singapore'}</option>
                  <option value="United States">{isId ? 'Amerika Serikat' : 'United States'}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold">
                {isId ? 'Fokus Industri & Riset' : 'Industry & Research Focus'}
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'NIB / NPWP / Tax ID *' : 'Business Registration / Tax ID *'}
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder={isId ? 'Contoh: 0123456789012 / NIB-2026' : 'e.g. EIN / UEN / NIB'}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Email Bisnis Resmi *' : 'Official Business Email *'}
                </label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="legal@company.com"
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Website Resmi' : 'Official Website'}
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Alamat Operasional' : 'Operating Address'}
                </label>
                <input
                  type="text"
                  value={operatingAddress}
                  onChange={(e) => setOperatingAddress(e.target.value)}
                  placeholder={isId ? 'Jl. Sudirman Kav. 52, Jakarta' : 'Street, City, Postal Code'}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4 space-y-2">
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold">
                <FileUp className="h-4 w-4 text-[#027F86]" />
                <span>
                  {isId
                    ? 'Unggah Dokumen Registrasi Usaha (NIB / Akta / Certificate of Incorporation)'
                    : 'Upload Business Registration Document (NIB / Incorporation Cert)'}
                </span>
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDocFileName(e.target.files?.[0]?.name || '')}
                className="block w-full text-xs text-[var(--egvox-text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[#027F86]/12 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#027F86]"
              />
              {docFileName && (
                <p className="text-[11px] font-mono text-[#027F86]">
                  {isId ? 'Dokumen terpilih:' : 'Selected:'} {docFileName}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Nama Representatif Berwenang *' : 'Authorized Representative Name *'}
                </label>
                <input
                  type="text"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  placeholder={isId ? 'Nama lengkap sesuai identitas' : 'Full legal name'}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Jabatan / Posisi' : 'Title / Role'}
                </label>
                <input
                  type="text"
                  value={repTitle}
                  onChange={(e) => setRepTitle(e.target.value)}
                  placeholder={isId ? 'Head of Data Operations' : 'Head of Data Operations'}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Email Representatif *' : 'Representative Email *'}
                </label>
                <input
                  type="email"
                  value={repEmail}
                  onChange={(e) => setRepEmail(e.target.value)}
                  placeholder="pic@company.com"
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Nomor Telepon / WhatsApp *' : 'Phone / WhatsApp Number *'}
                </label>
                <input
                  type="tel"
                  value={repPhone}
                  onChange={(e) => setRepPhone(e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm tabular-nums"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4 text-xs space-y-1.5">
              <p className="font-bold text-[var(--egvox-text-primary)]">
                {isId ? 'Ringkasan Registrasi Vendor KYB:' : 'Vendor KYB Registration Summary:'}
              </p>
              <p>
                <span className="text-[var(--egvox-text-muted)]">{isId ? 'Perusahaan:' : 'Organization:'}</span>{' '}
                <strong>{orgName}</strong> ({orgType} · {country})
              </p>
              <p>
                <span className="text-[var(--egvox-text-muted)]">NIB / Tax ID:</span>{' '}
                <strong>{taxId}</strong>
                {docFileName && ` · ${docFileName}`}
              </p>
              <p>
                <span className="text-[var(--egvox-text-muted)]">{isId ? 'Representatif:' : 'Representative:'}</span>{' '}
                <strong>{repName}</strong> ({repEmail})
              </p>
            </div>
            <label className="flex items-start gap-2.5 text-xs text-[var(--egvox-text-secondary)]">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#027F86]"
              />
              <span>
                {isId
                  ? 'Saya menyetujui Vendor Terms of Service, Data Protection Schedule, serta ketentuan biaya admin & pemrosesan pembayaran PSP EgvoX.'
                  : 'I agree to the EgvoX Vendor Terms of Service, Data Protection Schedule, and transparent admin/payment processing fees.'}
              </span>
            </label>
            <label className="flex items-start gap-2.5 text-xs text-[var(--egvox-text-secondary)]">
              <input
                type="checkbox"
                checked={kybDeclarationAccepted}
                onChange={(e) => setKybDeclarationAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#027F86]"
              />
              <span>
                {isId
                  ? 'Saya menyatakan bahwa seluruh dokumen registrasi dan data representatif di atas sah dan berwenang mewakili organisasi.'
                  : 'I declare all submitted registration documents and representative information are accurate and authorized.'}
              </span>
            </label>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
            className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm"
          >
            {isId ? 'Kembali' : 'Back'}
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-[#027F86] px-5 py-2 text-sm font-semibold text-white"
            >
              {isId ? 'Lanjutkan' : 'Continue'}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="rounded-lg bg-[#027F86] px-5 py-2 text-sm font-semibold text-white"
            >
              {isId ? 'Selesaikan Onboarding Vendor' : 'Complete Vendor Onboarding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const EnterprisePartnershipView: React.FC = () => {
  const { locale, submitEnterpriseInquiry } = useAppState();
  const isId = locale === 'id';
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [domainCategory, setDomainCategory] = useState<string>(ACTIVITY_CATEGORIES[0].nameEn);
  const [deliveryFormat, setDeliveryFormat] = useState('MP4 + JSONL');
  const [targetDeadline, setTargetDeadline] = useState('Q2 2026');
  const [estimatedVolume, setEstimatedVolume] = useState('50 – 250 jam');
  const [requirementSummary, setRequirementSummary] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [consentToContact, setConsentToContact] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateEnterpriseInquiry(
      {
        companyName,
        businessEmail,
        contactPerson,
        contactPhone,
        country,
        estimatedVolume,
        requirementSummary,
        consentToContact,
      },
      locale
    );
    if (!res.valid) {
      setErrors(res.errors);
      return;
    }
    setErrors({});
    submitEnterpriseInquiry({
      companyName,
      country,
      website: website.trim() || undefined,
      businessEmail,
      contactPerson,
      contactPhone: contactPhone.trim(),
      domainCategory,
      deliveryFormat,
      targetDeadline: targetDeadline.trim() || undefined,
      estimatedVolume,
      requirementSummary,
      attachmentName: attachmentName || undefined,
    });
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#FC840E]">
            {isId ? 'Operasi Terkelola Enterprise' : 'Enterprise Managed Operations'}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-[var(--egvox-text-primary)]">
            {isId
              ? 'Permintaan Kemitraan Enterprise (Inquiry)'
              : 'Enterprise Partnership Request (RFP)'}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--egvox-text-secondary)]">
            {isId ? (
              <>
                Ini adalah formulir permintaan kerja sama berstatus{' '}
                <strong>submitted</strong>, bukan kontrak atau pemesanan otomatis. Enterprise berkontrak langsung dengan EgvoX untuk membuat Official Project.
              </>
            ) : (
              <>
                Submitting this form opens a partnership inquiry in{' '}
                <strong>submitted</strong> status — not an automated contract. Enterprise Buyers contract directly with EgvoX to provision an Official Project.
              </>
            )}
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-[#16835D]/30 bg-[#16835D]/8 p-6 space-y-3">
            <p className="flex items-center gap-2 text-base font-bold text-[#16835D]">
              <CheckCircle2 className="h-5 w-5" />
              {isId
                ? 'Permintaan Kemitraan Berhasil Dikirim'
                : 'Partnership Request Submitted'}
            </p>
            <p className="text-sm text-[var(--egvox-text-secondary)]">
              {isId
                ? 'Anda dapat memantau status pipeline RFP dan meninjau dokumen melalui Workspace Pelanggan.'
                : 'You can track RFP status and review onboarding documents inside Customer Workspace.'}
            </p>
            <Link
              href="/workspace?role=enterprise"
              className="inline-flex rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
            >
              {isId ? 'Buka Enterprise Workspace' : 'Open Enterprise Workspace'}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Nama Perusahaan *' : 'Company Name *'}
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={isId ? 'PT Contoh Teknologi' : 'Acme Robotics Inc.'}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-[#C43D3D]">{errors.companyName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Website Perusahaan (Opsional)' : 'Company Website (Optional)'}
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Email Bisnis *' : 'Business Email *'}
                </label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="data-ops@enterprise.com"
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
                {errors.businessEmail && (
                  <p className="mt-1 text-xs text-[#C43D3D]">{errors.businessEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Negara *' : 'Country *'}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                >
                  <option value="Indonesia">Indonesia</option>
                  <option value="Singapore">{isId ? 'Singapura' : 'Singapore'}</option>
                  <option value="Japan">{isId ? 'Jepang' : 'Japan'}</option>
                  <option value="United States">{isId ? 'Amerika Serikat' : 'United States'}</option>
                  <option value="Germany">{isId ? 'Jerman' : 'Germany'}</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Kontak PIC *' : 'Contact Person *'}
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder={isId ? 'Nama & Jabatan' : 'Name & Title'}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-xs text-[#C43D3D]">{errors.contactPerson}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Nomor Telepon / WhatsApp PIC *' : 'PIC Phone / WhatsApp Number *'}
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder={isId ? 'Contoh: +62 812-3456-7890' : 'e.g. +62 812-3456-7890'}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm tabular-nums"
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-xs text-[#C43D3D]">{errors.contactPhone}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Kategori Domain Data *' : 'Data Domain Category *'}
                </label>
                <select
                  value={domainCategory}
                  onChange={(e) => setDomainCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                >
                  {ACTIVITY_CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.nameEn}>
                      {isId ? cat.nameId : cat.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Estimasi Volume (Jam) *' : 'Estimated Hours *'}
                </label>
                <select
                  value={estimatedVolume}
                  onChange={(e) => setEstimatedVolume(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                >
                  <option value="20 – 50 jam">{isId ? '20 – 50 jam' : '20 – 50 hours'}</option>
                  <option value="50 – 250 jam">{isId ? '50 – 250 jam' : '50 – 250 hours'}</option>
                  <option value="250 – 1.000 jam">{isId ? '250 – 1.000 jam' : '250 – 1,000 hours'}</option>
                  <option value="1.000+ jam">{isId ? '1.000+ jam' : '1,000+ hours'}</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Format Delivery & Anotasi *' : 'Delivery & Annotation Format *'}
                </label>
                <select
                  value={deliveryFormat}
                  onChange={(e) => setDeliveryFormat(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                >
                  <option value="MP4 + JSONL">MP4 + JSONL (Temporal & BBox)</option>
                  <option value="MP4 + COCO JSON">MP4 + COCO JSON</option>
                  <option value="MP4 + CSV">MP4 + CSV Manifest</option>
                  <option value="Raw MP4 + Rights Manifest">Raw MP4 + Rights Manifest Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold">
                  {isId ? 'Target Tenggat Waktu' : 'Target Timeline / Deadline'}
                </label>
                <input
                  type="text"
                  value={targetDeadline}
                  onChange={(e) => setTargetDeadline(e.target.value)}
                  placeholder="Q2 2026 / 8 minggu"
                  className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold">
                {isId ? 'Kebutuhan Data & Anotasi *' : 'Data & Annotation Requirements *'}
              </label>
              <textarea
                rows={4}
                value={requirementSummary}
                onChange={(e) => setRequirementSummary(e.target.value)}
                placeholder={
                  isId
                    ? 'Pengumpulan video aktivitas manufaktur dan quality check + format JSONL...'
                    : 'Egocentric manufacturing assembly footage + JSONL temporal annotations...'
                }
                className="mt-1 w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3.5 py-2.5 text-sm"
              />
              {errors.requirementSummary && (
                <p className="mt-1 text-xs text-[#C43D3D]">{errors.requirementSummary}</p>
              )}
            </div>

            <div className="rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-3.5 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--egvox-text-primary)]">
                  <FileUp className="h-4 w-4 text-[#027F86]" />
                  <span>
                    {isId
                      ? 'Upload Dokumen Penawaran / Brief RFP (Opsional)'
                      : 'Upload Proposal / RFP Brief Document (Optional)'}
                  </span>
                </label>
                {attachmentName && (
                  <button
                    type="button"
                    onClick={() => setAttachmentName('')}
                    className="text-[11px] font-semibold text-[#C43D3D] hover:underline"
                  >
                    {isId ? 'Hapus Lampiran' : 'Remove'}
                  </button>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
                onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '')}
                className="block w-full text-xs text-[var(--egvox-text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[#027F86]/12 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#027F86] hover:file:bg-[#027F86]/20"
              />
              <p className="text-[11px] text-[var(--egvox-text-muted)]">
                {attachmentName
                  ? `${isId ? 'Dokumen terpilih:' : 'Selected file:'} ${attachmentName}`
                  : isId
                  ? 'Tidak wajib diisi. Mendukung PDF, DOCX, XLSX, PPTX, atau ZIP spesifikasi teknis.'
                  : 'Optional. Supports PDF, DOCX, XLSX, PPTX, or technical spec ZIP.'}
              </p>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[var(--egvox-text-secondary)]">
              <input
                type="checkbox"
                checked={consentToContact}
                onChange={(e) => setConsentToContact(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#027F86]"
              />
              <span>
                {isId
                  ? 'Saya menyetujui tim EgvoX menghubungi organisasi saya untuk proses kualifikasi.'
                  : 'I consent to EgvoX contacting my organization to qualify this partnership request.'}
              </span>
            </label>
            {errors.consentToContact && (
              <p className="text-xs text-[#C43D3D]">{errors.consentToContact}</p>
            )}

            <button
              type="submit"
              className="h-11 rounded-xl bg-[#027F86] px-6 text-sm font-semibold text-white hover:bg-[#039998]"
            >
              {isId ? 'Kirim Permintaan' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

