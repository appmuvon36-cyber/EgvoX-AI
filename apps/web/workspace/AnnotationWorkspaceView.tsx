'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Crosshair,
  Eye,
  EyeOff,
  FileCode2,
  GitBranch,
  Keyboard,
  Layers,
  MousePointer,
  Pause,
  Play,
  Plus,
  Save,
  SkipBack,
  SkipForward,
  Sliders,
  Square,
  Tag,
  X,
} from 'lucide-react';
import {
  INITIAL_ANNOTATION_BOXES,
  INITIAL_ANNOTATION_SEGMENTS,
} from '@/lib/ops-admin-data';
import {
  AnnotationBoundingBox,
  AnnotationTemporalSegment,
  OpsAnnotationProject,
} from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';

const OBJECT_LABELS = [
  { id: 'Hand', label: 'Tangan (Hand)', labelEn: 'Hand', category: 'hand' as const },
  { id: 'Knife', label: 'Pisau (Knife)', labelEn: 'Knife', category: 'object' as const },
  { id: 'Cutting Board', label: 'Talenan (Cutting Board)', labelEn: 'Cutting Board', category: 'object' as const },
  { id: 'Bowl', label: 'Mangkok (Bowl)', labelEn: 'Bowl', category: 'object' as const },
];

const INGREDIENT_LABELS = [
  { id: 'Tomato', label: 'Tomat (Tomato)', labelEn: 'Tomato', category: 'ingredient' as const },
  { id: 'Onion', label: 'Bawang (Onion)', labelEn: 'Onion', category: 'ingredient' as const },
  { id: 'Vegetable', label: 'Sayuran (Vegetable)', labelEn: 'Vegetable', category: 'ingredient' as const },
];

export const AnnotationWorkspaceView: React.FC<{
  project?: OpsAnnotationProject;
  isOpsMode?: boolean;
  onCompleteSubmit?: () => void;
}> = ({ project, isOpsMode = false, onCompleteSubmit }) => {
  const { locale, showToast } = useAppState();
  const isId = locale === 'id';

  const projectCode = project?.code || 'EGX-AN-0173';
  const projectTitle = project
    ? isId
      ? project.titleId
      : project.titleEn || project.titleId
    : isId
    ? 'Cooking - Interaksi Tangan (v1.2)'
    : 'Cooking - Hand Interaction (v1.2)';
  const schemaVersion = project?.schemaVersion || 'v1.2';
  const durationSec = project?.videoDurationSec || 30;
  const previewImage =
    project?.previewImage || '/images/capture_cooking_pov_1795676769816.jpg';

  const [activeTool, setActiveTool] = useState<
    'select' | 'bbox' | 'polygon' | 'keypoint' | 'segment' | 'link'
  >('bbox');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(5);
  const [playbackRate, setPlaybackRate] = useState<'0.5x' | '1.0x' | '1.5x'>('1.0x');
  const [showBoxes, setShowBoxes] = useState(true);
  const [boxes, setBoxes] = useState<AnnotationBoundingBox[]>(
    INITIAL_ANNOTATION_BOXES
  );
  const [selectedBoxId, setSelectedBoxId] = useState<string>('box-2');
  const [segments, setSegments] = useState<AnnotationTemporalSegment[]>(
    INITIAL_ANNOTATION_SEGMENTS
  );
  const [selectedSegId, setSelectedSegId] = useState<string>('seg-2');
  const [rightTab, setRightTab] = useState<'labels' | 'detail' | 'schema'>(
    'labels'
  );
  const [labelSearch, setLabelSearch] = useState('');
  const [enabledLabels, setEnabledLabels] = useState<string[]>([
    'Hand',
    'Knife',
    'Tomato',
  ]);
  const [lastSaved, setLastSaved] = useState('10:24:36');
  const [schemaValidated, setSchemaValidated] = useState(true);
  const [shortcutModalOpen, setShortcutModalOpen] = useState(false);
  const [addSegOpen, setAddSegOpen] = useState(false);
  const [newSegLabel, setNewSegLabel] = useState('');
  const [newSegStart, setNewSegStart] = useState('20');
  const [newSegEnd, setNewSegEnd] = useState('28');

  useEffect(() => {
    if (!isPlaying) return;
    const stepMs = playbackRate === '1.5x' ? 650 : playbackRate === '0.5x' ? 1500 : 1000;
    const timer = window.setInterval(() => {
      setCurrentSec((prev) => (prev >= durationSec ? 0 : prev + 1));
    }, stepMs);
    return () => window.clearInterval(timer);
  }, [isPlaying, playbackRate, durationSec]);

  const selectedBox =
    boxes.find((b) => b.id === selectedBoxId) || boxes[0];

  const toggleLabel = (labelId: string) => {
    setEnabledLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((item) => item !== labelId)
        : [...prev, labelId]
    );
    const now = new Date();
    setLastSaved(
      `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    );
  };

  const handleAddBox = () => {
    const id = `box-${Date.now()}`;
    const newBox: AnnotationBoundingBox = {
      id,
      trackId: `trk-${String(boxes.length + 12).padStart(4, '0')}`,
      label: 'cutting_board',
      category: 'object',
      color: '#027F86',
      confidence: 1.0,
      top: 48,
      left: 24,
      width: 36,
      height: 28,
      note: isId
        ? 'Anotasi objek baru ditambahkan manual oleh annotator.'
        : 'New object bounding box added manually by annotator.',
    };
    setBoxes((prev) => [...prev, newBox]);
    setSelectedBoxId(id);
    showToast(
      isId
        ? `Bounding box baru (${newBox.trackId}) ditambahkan pada ${currentSec}s.`
        : `New bounding box (${newBox.trackId}) added at ${currentSec}s.`
    );
  };

  const handleUpdateBoxNote = (note: string) => {
    if (!selectedBox) return;
    setBoxes((prev) =>
      prev.map((b) => (b.id === selectedBox.id ? { ...b, note } : b))
    );
  };

  const handleAddSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegLabel.trim()) return;
    const startSec = Math.max(0, Math.min(durationSec - 1, Number(newSegStart) || 0));
    const endSec = Math.max(startSec + 1, Math.min(durationSec, Number(newSegEnd) || startSec + 4));
    const code = `S${segments.filter((s) => s.trackType === 'segment').length + 1}`;
    const nextSeg: AnnotationTemporalSegment = {
      id: `seg-${Date.now()}`,
      code,
      label: newSegLabel.trim(),
      startSec,
      endSec,
      color: '#039998',
      trackType: 'segment',
    };
    setSegments((prev) => [...prev, nextSeg]);
    setSelectedSegId(nextSeg.id);
    setNewSegLabel('');
    setAddSegOpen(false);
    showToast(
      isId
        ? `Segment temporal ${code}: ${nextSeg.label} (${startSec}s–${endSec}s) disimpan.`
        : `Temporal segment ${code}: ${nextSeg.label} (${startSec}s–${endSec}s) saved.`
    );
  };

  const handleValidateSchema = () => {
    setSchemaValidated(true);
    showToast(
      isId
        ? `Validasi Schema ${schemaVersion} lolos: ${boxes.length} bounding box & ${segments.length} segmen valid (JSONL ready).`
        : `Schema ${schemaVersion} validation passed: ${boxes.length} boxes & ${segments.length} segments valid.`
    );
  };

  const handleCompleteSubmit = () => {
    const now = new Date();
    setLastSaved(
      `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    );
    onCompleteSubmit?.();
    showToast(
      isId
        ? `Anotasi ${projectCode} disimpan dan dikirim ke antrian QA Specialist.`
        : `Annotation ${projectCode} saved and submitted to QA Specialist queue.`
    );
  };

  const formatTimer = (sec: number) =>
    `00:${String(sec).padStart(2, '0')}`;

  const schemaExportPreview = JSON.stringify(
    {
      task_id: projectCode,
      schema_version: schemaVersion,
      frame_timestamp_sec: currentSec,
      tracks: boxes.map((b) => ({
        track_id: b.trackId,
        label: b.label,
        category: b.category,
        bbox_pct: [b.left, b.top, b.width, b.height],
      })),
      temporal_segments: segments
        .filter((s) => s.trackType === 'segment')
        .map((s) => ({
          code: s.code,
          action: s.label,
          start_sec: s.startSec,
          end_sec: s.endSec,
        })),
    },
    null,
    2
  );

  return (
    <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] overflow-hidden">
      {/* Top Annotation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-[#027F86] dark:text-[#04B8B4]">
            {isId ? 'Workspace Anotasi' : 'Annotation Workspace'}
          </span>
          <span className="text-[var(--egvox-text-muted)]">&rsaquo;</span>
          <span className="font-mono text-xs font-semibold text-[var(--egvox-text-primary)] truncate">
            {projectCode} / {projectTitle}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#16835D] tabular-nums">
            <Save className="h-3.5 w-3.5" />
            <span>
              {isId ? 'Simpan Otomatis' : 'Autosave'} · {isId ? 'Tersimpan' : 'Saved'} {lastSaved}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setShortcutModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]"
          >
            <Keyboard className="h-3.5 w-3.5 text-[#027F86]" />
            <span>{isId ? 'Pintasan (K)' : 'Shortcut (K)'}</span>
          </button>
          <button
            type="button"
            onClick={handleValidateSchema}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              schemaValidated
                ? 'border-[#16835D]/40 bg-[#16835D]/10 text-[#16835D]'
                : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)]'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isId ? 'Validasi Schema' : 'Validate Schema'}</span>
          </button>
          <button
            type="button"
            onClick={handleCompleteSubmit}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#027F86] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#039998]"
          >
            <span>{isId ? 'Selesai & Kirim' : 'Save & Submit Review'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Desktop / Responsive Annotation Grid */}
      <div className="grid lg:grid-cols-12">
        {/* Left Canvas + Bottom Timeline (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--egvox-border-default)] min-w-0">
          <div className="flex flex-1 min-w-0">
            {/* Tool Palette */}
            <div className="flex flex-col items-center gap-1.5 border-r border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-2">
              {(
                [
                  { id: 'select', icon: MousePointer, title: isId ? 'Pilih (V)' : 'Select (V)' },
                  { id: 'bbox', icon: Square, title: isId ? 'Kotak Pembatas (B)' : 'Bounding Box (B)' },
                  { id: 'polygon', icon: Layers, title: isId ? 'Mask Segmentasi (M)' : 'Segmentation Mask (M)' },
                  { id: 'keypoint', icon: Crosshair, title: isId ? 'Titik Kunci Tangan/Pose (P)' : 'Hand/Pose Keypoint (P)' },
                  { id: 'segment', icon: Clock, title: isId ? 'Segmen Temporal (T)' : 'Temporal Segment (T)' },
                  { id: 'link', icon: GitBranch, title: isId ? 'Relasi Tangan-Objek (L)' : 'Hand-Object Link (L)' },
                ] as const
              ).map((tool) => {
                const Icon = tool.icon;
                const active = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    title={tool.title}
                    aria-label={tool.title}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                      active
                        ? 'bg-[#027F86] text-white'
                        : 'text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}

              <div className="my-1 w-6 border-t border-[var(--egvox-border-default)]" />

              <button
                type="button"
                title={isId ? 'Tambah Bounding Box' : 'Add Bounding Box'}
                onClick={handleAddBox}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-[#027F86]/50 text-[#027F86] hover:bg-[#027F86]/10"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                title={
                  isId
                    ? showBoxes
                      ? 'Sembunyikan Overlay'
                      : 'Tampilkan Overlay'
                    : showBoxes
                    ? 'Hide Overlays'
                    : 'Show Overlays'
                }
                onClick={() => setShowBoxes((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]"
              >
                {showBoxes ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>

            {/* Video Player Canvas */}
            <div className="flex-1 flex flex-col bg-[#102326] min-w-0">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#102326]">
                <img
                  src={previewImage}
                  alt={projectTitle}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                {showBoxes &&
                  boxes.map((box) => {
                    const isSelected = selectedBox?.id === box.id;
                    return (
                      <button
                        key={box.id}
                        type="button"
                        onClick={() => setSelectedBoxId(box.id)}
                        style={{
                          top: `${box.top}%`,
                          left: `${box.left}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`,
                          borderColor: box.color,
                        }}
                        className={`absolute rounded-sm border-2 text-left transition-shadow ${
                          isSelected ? 'ring-2 ring-white shadow-lg' : 'opacity-90'
                        }`}
                      >
                        <span
                          style={{ backgroundColor: box.color }}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white"
                        >
                          <span>{box.label}</span>
                          <span className="opacity-85 tabular-nums">
                            {box.confidence.toFixed(2)}
                          </span>
                        </span>
                      </button>
                    );
                  })}

                <div className="absolute top-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-mono text-white tabular-nums">
                  {isOpsMode
                    ? isId
                      ? 'ALIRAN OPS PRIVAT'
                      : 'PRIVATE OPS STREAM'
                    : isId
                    ? 'SANDBOX ANNOTATOR'
                    : 'ANNOTATOR SANDBOX'}{' '}
                  · Frame {currentSec * 60}
                </div>
              </div>

              {/* Video Transport Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#172B2D] px-4 py-2.5 text-white">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentSec((s) => Math.max(0, s - 1))}
                    aria-label={isId ? 'Detik sebelumnya' : 'Previous second'}
                    className="rounded-md p-1.5 hover:bg-white/10"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? (isId ? 'Jeda' : 'Pause') : isId ? 'Putar' : 'Play'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#04B8B4] text-[#102326] hover:bg-[#55B6B4]"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSec((s) => Math.min(durationSec, s + 1))}
                    aria-label={isId ? 'Detik berikutnya' : 'Next second'}
                    className="rounded-md p-1.5 hover:bg-white/10"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                  <span className="ml-1 font-mono text-xs tabular-nums">
                    {formatTimer(currentSec)} / {formatTimer(durationSec)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={durationSec}
                    value={currentSec}
                    onChange={(e) => setCurrentSec(Number(e.target.value))}
                    aria-label={isId ? 'Penggeser timeline' : 'Timeline scrubber'}
                    className="w-28 sm:w-44 accent-[#04B8B4]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPlaybackRate((r) =>
                        r === '1.0x' ? '1.5x' : r === '1.5x' ? '0.5x' : '1.0x'
                      )
                    }
                    className="rounded-md bg-white/10 px-2 py-1 font-mono text-[11px] font-semibold hover:bg-white/20 tabular-nums"
                  >
                    {playbackRate}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Track Temporal Timeline */}
          <div className="border-t border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#027F86]" />
                <span className="text-xs font-bold text-[var(--egvox-text-primary)]">
                  {isId ? 'Timeline Segment & Object Tracks' : 'Temporal Segments & Object Tracks'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAddSegOpen(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-[#027F86] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#039998]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isId ? 'Tambah Segment' : 'Add Segment'}</span>
              </button>
            </div>

            {/* Time Axis */}
            <div className="flex justify-between text-[10px] font-mono text-[var(--egvox-text-muted)] tabular-nums px-24 sm:px-28">
              {[0, 5, 10, 15, 20, 25, 30].map((sec) => (
                <span key={sec}>{sec}s</span>
              ))}
            </div>

            {/* Track Rows */}
            <div className="space-y-2">
              {[
                {
                  key: 'segment' as const,
                  label: isId ? 'Segmen' : 'Segment',
                  items: segments.filter((s) => s.trackType === 'segment'),
                },
                {
                  key: 'hand' as const,
                  label: isId ? 'Track (Tangan)' : 'Track (Hand)',
                  items: segments.filter((s) => s.trackType === 'hand'),
                },
                {
                  key: 'knife' as const,
                  label: isId ? 'Track (Pisau)' : 'Track (Knife)',
                  items: segments.filter((s) => s.trackType === 'knife'),
                },
                {
                  key: 'object' as const,
                  label: isId ? 'Track (Objek)' : 'Track (Object)',
                  items: segments.filter((s) => s.trackType === 'object'),
                },
              ].map((track) => (
                <div key={track.key} className="flex items-center gap-2">
                  <span className="w-24 sm:w-28 shrink-0 text-[11px] font-semibold text-[var(--egvox-text-secondary)] truncate">
                    {track.label}
                  </span>
                  <div className="relative h-7 flex-1 rounded-lg bg-[var(--egvox-bg-canvas)] border border-[var(--egvox-border-default)] overflow-hidden">
                    {/* Playhead indicator */}
                    <div
                      style={{ left: `${(currentSec / durationSec) * 100}%` }}
                      className="pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 bg-[#C43D3D]"
                    />
                    {track.items.map((seg) => {
                      const leftPct = (seg.startSec / durationSec) * 100;
                      const widthPct =
                        ((seg.endSec - seg.startSec) / durationSec) * 100;
                      const active = selectedSegId === seg.id;
                      return (
                        <button
                          key={seg.id}
                          type="button"
                          onClick={() => {
                            setSelectedSegId(seg.id);
                            setCurrentSec(seg.startSec);
                          }}
                          style={{
                            left: `${leftPct}%`,
                            width: `${widthPct}%`,
                            backgroundColor: seg.color,
                          }}
                          className={`absolute top-1 bottom-1 rounded-md px-2 text-left text-[10px] font-semibold text-white truncate transition-opacity ${
                            active ? 'ring-2 ring-[#102326] dark:ring-white' : 'opacity-85 hover:opacity-100'
                          }`}
                        >
                          {seg.code}: {seg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Label & Schema Inspector Panel (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col bg-[var(--egvox-bg-surface)] min-w-0">
          {/* Inspector Sub-Tabs */}
          <div className="grid grid-cols-3 border-b border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-1.5 gap-1">
            {(
              [
                { id: 'labels', label: isId ? 'Label & Anotasi' : 'Labels' },
                { id: 'detail', label: 'Detail' },
                { id: 'schema', label: `Schema (${schemaVersion})` },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setRightTab(t.id)}
                className={`rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                  rightTab === t.id
                    ? 'bg-[var(--egvox-bg-surface)] text-[#027F86] dark:text-[#04B8B4] shadow-xs'
                    : 'text-[var(--egvox-text-secondary)] hover:text-[var(--egvox-text-primary)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[640px]">
            {rightTab === 'labels' && (
              <>
                <div>
                  <p className="text-xs font-bold text-[var(--egvox-text-primary)] mb-1.5">
                    {isId ? 'Label / Kategori' : 'Label / Category'}
                  </p>
                  <input
                    type="text"
                    value={labelSearch}
                    onChange={(e) => setLabelSearch(e.target.value)}
                    placeholder={isId ? 'Cari label...' : 'Search label...'}
                    className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-1.5 text-xs"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {enabledLabels.map((lbl) => (
                      <span
                        key={lbl}
                        className="inline-flex items-center gap-1 rounded-md bg-[#027F86]/10 px-2 py-0.5 text-[11px] font-semibold text-[#027F86] dark:text-[#04B8B4]"
                      >
                        <Tag className="h-3 w-3" />
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Object & Equipment Checkboxes */}
                <div className="space-y-1.5 border-t border-[var(--egvox-border-default)] pt-3">
                  <p className="text-xs font-bold text-[var(--egvox-text-primary)]">
                    {isId ? 'Objek & Peralatan' : 'Objects & Equipment'}
                  </p>
                  {OBJECT_LABELS.filter((l) =>
                    (isId ? l.label : l.labelEn)
                      .toLowerCase()
                      .includes(labelSearch.toLowerCase())
                  ).map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 text-xs text-[var(--egvox-text-secondary)] cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={enabledLabels.includes(item.id)}
                        onChange={() => toggleLabel(item.id)}
                        className="h-3.5 w-3.5 rounded text-[#027F86]"
                      />
                      <span>{isId ? item.label : item.labelEn}</span>
                    </label>
                  ))}
                </div>

                {/* Ingredients Checkboxes */}
                <div className="space-y-1.5 border-t border-[var(--egvox-border-default)] pt-3">
                  <p className="text-xs font-bold text-[var(--egvox-text-primary)]">
                    {isId ? 'Bahan Makanan' : 'Ingredients'}
                  </p>
                  {INGREDIENT_LABELS.filter((l) =>
                    (isId ? l.label : l.labelEn)
                      .toLowerCase()
                      .includes(labelSearch.toLowerCase())
                  ).map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 text-xs text-[var(--egvox-text-secondary)] cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={enabledLabels.includes(item.id)}
                        onChange={() => toggleLabel(item.id)}
                        className="h-3.5 w-3.5 rounded text-[#027F86]"
                      />
                      <span>{isId ? item.label : item.labelEn}</span>
                    </label>
                  ))}
                </div>

                {/* Selected Segment List */}
                <div className="space-y-1.5 border-t border-[var(--egvox-border-default)] pt-3">
                  <p className="text-xs font-bold text-[var(--egvox-text-primary)]">
                    {isId ? 'Segment Temporal' : 'Temporal Segments'}
                  </p>
                  <div className="space-y-1.5">
                    {segments
                      .filter((s) => s.trackType === 'segment')
                      .map((seg) => (
                        <button
                          key={seg.id}
                          type="button"
                          onClick={() => {
                            setSelectedSegId(seg.id);
                            setCurrentSec(seg.startSec);
                          }}
                          className={`w-full flex items-center justify-between rounded-lg border px-2.5 py-2 text-left text-xs transition-colors ${
                            selectedSegId === seg.id
                              ? 'border-[#027F86] bg-[#027F86]/8'
                              : 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)]'
                          }`}
                        >
                          <span className="font-bold">{seg.code}</span>
                          <span className="flex-1 mx-2 truncate text-[var(--egvox-text-secondary)]">
                            {seg.label}
                          </span>
                          <span className="font-mono text-[11px] text-[var(--egvox-text-muted)] tabular-nums">
                            {formatTimer(seg.startSec)} – {formatTimer(seg.endSec)}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Selected Box Properties */}
                {selectedBox && (
                  <div className="space-y-2 border-t border-[var(--egvox-border-default)] pt-3">
                    <p className="text-xs font-bold text-[var(--egvox-text-primary)]">
                      {isId ? 'Properti Anotasi' : 'Annotation Properties'}
                    </p>
                    <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3 text-xs space-y-1.5 tabular-nums">
                      <div className="flex justify-between">
                        <span className="text-[var(--egvox-text-muted)]">ID Track</span>
                        <span className="font-mono font-bold">{selectedBox.trackId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--egvox-text-muted)]">
                          {isId ? 'Kelas' : 'Class'}
                        </span>
                        <span className="font-semibold">{selectedBox.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--egvox-text-muted)]">
                          {isId ? 'Skor Presisi' : 'Precision'}
                        </span>
                        <span className="font-mono font-semibold text-[#16835D]">
                          {selectedBox.confidence.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={selectedBox.note || ''}
                      onChange={(e) => handleUpdateBoxNote(e.target.value)}
                      placeholder={isId ? 'Catatan (opsional)...' : 'Annotation note (optional)...'}
                      className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                    />
                  </div>
                )}
              </>
            )}

            {rightTab === 'detail' && (
              <div className="space-y-3 text-xs">
                <p className="font-bold text-[var(--egvox-text-primary)]">
                  {isId ? 'Instruksi & SOP Anotasi' : 'Annotation SOP & Instructions'}
                </p>
                <div className="rounded-xl bg-[var(--egvox-bg-canvas)] p-3.5 space-y-2 text-[var(--egvox-text-secondary)]">
                  <p>
                    • <strong>{isId ? 'Perspektif:' : 'Perspective:'}</strong> Egocentric First-Person
                  </p>
                  <p>
                    • <strong>{isId ? 'Taksonomi:' : 'Taxonomy:'}</strong> Action Recognition, Hand-Object Interaction, Temporal Action Segmentation
                  </p>
                  <p>
                    • <strong>Reviewer:</strong> {project?.reviewerName || 'Nadia QA'}
                  </p>
                  <p>
                    • <strong>{isId ? 'Gerbang Penerimaan:' : 'Acceptance Gate:'}</strong>{' '}
                    {isId
                      ? 'IoU ≥ 0.85 pada objek utama dan batas segmen temporal ±0.3 detik.'
                      : 'IoU ≥ 0.85 on primary objects and ±0.3s temporal segment boundaries.'}
                  </p>
                </div>
              </div>
            )}

            {rightTab === 'schema' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#027F86]">
                    <FileCode2 className="h-4 w-4" />
                    <span>{isId ? 'Pratinjau Ekspor JSONL / COCO' : 'JSONL / COCO Export Preview'}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#16835D]">
                    {schemaVersion} Valid
                  </span>
                </div>
                <pre className="max-h-96 overflow-auto rounded-xl bg-[#102326] p-3 text-[11px] font-mono text-[#B9CCCA]">
                  {schemaExportPreview}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Segment Modal */}
      {addSegOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {isId ? 'Tambah Segment Temporal' : 'Add Temporal Segment'}
              </h3>
              <button
                type="button"
                onClick={() => setAddSegOpen(false)}
                className="rounded-lg p-1 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddSegment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {isId ? 'Nama Aksi / Segment' : 'Action / Segment Label'}
                </label>
                <input
                  type="text"
                  required
                  value={newSegLabel}
                  onChange={(e) => setNewSegLabel(e.target.value)}
                  placeholder={isId ? 'Contoh: Cuci Peralatan' : 'e.g., Wash Utensil'}
                  className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {isId ? 'Mulai (detik)' : 'Start (sec)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={durationSec - 1}
                    value={newSegStart}
                    onChange={(e) => setNewSegStart(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {isId ? 'Selesai (detik)' : 'End (sec)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={durationSec}
                    value={newSegEnd}
                    onChange={(e) => setNewSegEnd(e.target.value)}
                    className="w-full rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs tabular-nums"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#027F86] py-2.5 text-xs font-semibold text-white"
              >
                {isId ? 'Simpan Segment' : 'Save Segment'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Shortcut Help Modal */}
      {shortcutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {isId ? 'Pintasan Keyboard Annotator' : 'Annotator Keyboard Shortcuts'}
              </h3>
              <button
                type="button"
                onClick={() => setShortcutModalOpen(false)}
                className="rounded-lg p-1 hover:bg-[var(--egvox-bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { key: 'Space', desc: isId ? 'Putar / Jeda Video' : 'Play / Pause Video' },
                { key: 'B', desc: isId ? 'Alat Bounding Box' : 'Bounding Box Tool' },
                { key: 'M', desc: isId ? 'Alat Segmentation Mask' : 'Segmentation Tool' },
                { key: 'T', desc: isId ? 'Buat Segment Temporal' : 'Create Temporal Segment' },
                { key: 'Ctrl + S', desc: isId ? 'Simpan Draft Manual' : 'Manual Save Draft' },
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between border-b border-[var(--egvox-border-default)] pb-1.5">
                  <span className="text-[var(--egvox-text-secondary)]">{s.desc}</span>
                  <kbd className="rounded bg-[var(--egvox-bg-subtle)] px-2 py-0.5 font-mono text-[11px] font-bold">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
