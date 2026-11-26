'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  ListTodo,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Modal } from '@/packages/design-system';
import {
  getAccessToken,
  googleSignIn,
  initAuth,
  logoutGoogleWorkspace,
} from '@/lib/google-workspace/auth';
import {
  GoogleWorkspaceServiceId,
  WorkspaceCalendarEvent,
  WorkspaceDriveFile,
  WorkspaceGmailMessage,
  WorkspaceTaskListItem,
} from '@/packages/shared-types';
import { useAppState } from '@/lib/hooks/useAppState';

interface PendingMutation {
  service: GoogleWorkspaceServiceId;
  title: string;
  description: string;
  actionLabel: string;
  execute: (token: string) => Promise<void>;
}

export const GoogleWorkspacePluginPanel: React.FC = () => {
  const { locale, showToast } = useAppState();
  const [needsAuth, setNeedsAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activePlugin, setActivePlugin] = useState<GoogleWorkspaceServiceId>('drive');
  const [loading, setLoading] = useState(false);

  const [driveFiles, setDriveFiles] = useState<WorkspaceDriveFile[]>([]);
  const [sheetFiles, setSheetFiles] = useState<WorkspaceDriveFile[]>([]);
  const [docFiles, setDocFiles] = useState<WorkspaceDriveFile[]>([]);
  const [gmailMessages, setGmailMessages] = useState<WorkspaceGmailMessage[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<WorkspaceCalendarEvent[]>([]);
  const [tasks, setTasks] = useState<WorkspaceTaskListItem[]>([]);

  // Form inputs for plugin actions
  const [newFolderName, setNewFolderName] = useState('EgvoX_Raw_Upload_Slot_PRJ001');
  const [newSheetTitle, setNewSheetTitle] = useState('EgvoX_Dataset_Manifest_2026');
  const [newDocTitle, setNewDocTitle] = useState('EgvoX_SOP_Egocentric_Cooking_v2');
  const [newTaskTitle, setNewTaskTitle] = useState(
    locale === 'id'
      ? 'Unggah Batch 5 Jam Video SPEC-COOK-v2.1'
      : 'Upload 5-Hour Batch SPEC-COOK-v2.1'
  );
  const [newEventTitle, setNewEventTitle] = useState('EgvoX Enterprise QA & Discovery Sync');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('Update Work Order EgvoX');
  const [emailBody, setEmailBody] = useState(
    locale === 'id'
      ? 'Halo tim, berikut pembaruan pengiriman batch video per jam terbaru.'
      : 'Hello team, please find the latest hourly video batch delivery update.'
  );

  const [pendingConfirm, setPendingConfirm] = useState<PendingMutation | null>(null);

  useEffect(() => {
    const unsub = initAuth(
      (user, token) => {
        if (token) {
          setNeedsAuth(false);
          setUserEmail(user.email);
        }
      },
      () => {
        setNeedsAuth(true);
        setUserEmail(null);
      }
    );
    return () => unsub();
  }, []);

  const handleConnectGoogle = async () => {
    setLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setNeedsAuth(false);
        setUserEmail(res.user.email);
        showToast(
          locale === 'id'
            ? 'Google Workspace (Drive, Sheets, Gmail, Calendar, Docs, Tasks) aktif.'
            : 'Google Workspace (Drive, Sheets, Gmail, Calendar, Docs, Tasks) connected.'
        );
        await loadPluginData('drive', res.accessToken);
      }
    } catch {
      showToast(
        locale === 'id'
          ? 'Gagal menghubungkan akun Google Workspace.'
          : 'Failed to connect Google Workspace account.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await logoutGoogleWorkspace();
    setNeedsAuth(true);
    setUserEmail(null);
    setDriveFiles([]);
    setSheetFiles([]);
    setDocFiles([]);
    setGmailMessages([]);
    setCalendarEvents([]);
    setTasks([]);
    showToast(
      locale === 'id'
        ? 'Sesi Google Workspace diputuskan.'
        : 'Google Workspace session disconnected.'
    );
  };

  const loadPluginData = async (
    service: GoogleWorkspaceServiceId,
    explicitToken?: string
  ) => {
    const token = explicitToken || (await getAccessToken());
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/workspace/${service}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (service === 'drive') setDriveFiles(data.files || []);
      if (service === 'sheets') setSheetFiles(data.files || []);
      if (service === 'docs') setDocFiles(data.files || []);
      if (service === 'gmail') setGmailMessages(data.messages || []);
      if (service === 'calendar') setCalendarEvents(data.items || []);
      if (service === 'tasks') setTasks(data.items || []);
    } catch {
      showToast(
        locale === 'id'
          ? `Gagal memuat data ${service}.`
          : `Failed to load ${service} data.`
      );
    } finally {
      setLoading(false);
    }
  };

  const switchPlugin = async (service: GoogleWorkspaceServiceId) => {
    setActivePlugin(service);
    if (!needsAuth) {
      await loadPluginData(service);
    }
  };

  const confirmAndRun = async () => {
    if (!pendingConfirm) return;
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setPendingConfirm(null);
      return;
    }
    setLoading(true);
    try {
      await pendingConfirm.execute(token);
      await loadPluginData(pendingConfirm.service, token);
      showToast(
        locale === 'id'
          ? 'Aksi Google Workspace berhasil dieksekusi.'
          : 'Google Workspace action completed successfully.'
      );
    } catch {
      showToast(
        locale === 'id'
          ? 'Gagal menjalankan aksi Google Workspace.'
          : 'Failed to execute Google Workspace action.'
      );
    } finally {
      setLoading(false);
      setPendingConfirm(null);
    }
  };

  const plugins: { id: GoogleWorkspaceServiceId; label: string; icon: React.ElementType }[] = [
    { id: 'drive', label: 'Google Drive', icon: FolderOpen },
    { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet },
    { id: 'gmail', label: 'Gmail', icon: Mail },
    { id: 'calendar', label: 'Google Calendar', icon: Calendar },
    { id: 'docs', label: 'Google Docs', icon: FileText },
    { id: 'tasks', label: 'Google Tasks', icon: ListTodo },
  ];

  return (
    <div className="rounded-2xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--egvox-border-default)] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--egvox-text-primary)]">
            {locale === 'id'
              ? 'Plugin Operasi Google Workspace'
              : 'Google Workspace Operations Plugins'}
          </h2>
          <p className="text-xs text-[var(--egvox-text-secondary)]">
            {locale === 'id'
              ? 'Integrasi operasional untuk Drive upload staging, Sheets manifest, Gmail notifikasi, Calendar milestone, Docs SOP, dan Tasks checklist (bukan sumber transaksi).'
              : 'Operational plugins for Drive upload staging, Sheets manifests, Gmail notifications, Calendar milestones, Docs SOPs, and Tasks checklists (non-transactional).'}
          </p>
        </div>

        {needsAuth ? (
          <button
            type="button"
            onClick={handleConnectGoogle}
            disabled={loading}
            className="inline-flex h-10 shrink-0 items-center gap-2.5 rounded-xl border border-[var(--egvox-border-default)] bg-white px-4 text-xs font-semibold text-[#102326] hover:bg-[#F4F8F8]"
          >
            <svg viewBox="0 0 48 48" className="h-4 w-4">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>{locale === 'id' ? 'Masuk dengan Google' : 'Sign in with Google'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16835D]">
              <CheckCircle2 className="h-4 w-4" />
              {userEmail || (locale === 'id' ? 'Terhubung' : 'Connected')}
            </span>
            <button
              type="button"
              onClick={handleDisconnect}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-[var(--egvox-border-default)] px-3 text-xs font-medium text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{locale === 'id' ? 'Keluar' : 'Disconnect'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 6 Plugin Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {plugins.map((p) => {
          const Icon = p.icon;
          const active = activePlugin === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => switchPlugin(p.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                active
                  ? 'bg-[#027F86] text-white'
                  : 'border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-secondary)] hover:text-[var(--egvox-text-primary)]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {needsAuth ? (
        <div className="rounded-xl border border-dashed border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-6 text-center space-y-3">
          <p className="text-sm font-semibold text-[var(--egvox-text-primary)]">
            {locale === 'id'
              ? 'Hubungkan Google Workspace untuk Mengaktifkan Plugin'
              : 'Connect Google Workspace to Activate Plugins'}
          </p>
          <p className="mx-auto max-w-md text-xs text-[var(--egvox-text-secondary)]">
            {locale === 'id'
              ? 'Token akses hanya disimpan di memori sesi browser. Setiap operasi ubah/buat/kirim akan meminta dialog konfirmasi eksplisit terlebih dahulu.'
              : 'Access tokens stay strictly in browser session memory. Every create, update, or send action triggers an explicit confirmation dialog first.'}
          </p>
          <button
            type="button"
            onClick={handleConnectGoogle}
            className="inline-flex items-center gap-2 rounded-xl bg-[#027F86] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#039998]"
          >
            <span>
              {locale === 'id'
                ? 'Hubungkan Akun Google Workspace'
                : 'Connect Google Workspace Account'}
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => loadPluginData(activePlugin)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--egvox-border-default)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--egvox-bg-subtle)]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{locale === 'id' ? 'Sinkronkan' : 'Sync Now'}</span>
            </button>
          </div>

          {activePlugin === 'drive' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPendingConfirm({
                      service: 'drive',
                      title:
                        locale === 'id'
                          ? 'Buat Folder Upload Staging di Google Drive?'
                          : 'Create Upload Staging Folder in Google Drive?',
                      description:
                        locale === 'id'
                          ? `Folder baru "${newFolderName}" akan dibuat di Google Drive Anda untuk staging file EgvoX.`
                          : `A new folder "${newFolderName}" will be created in your Google Drive for EgvoX staging.`,
                      actionLabel: locale === 'id' ? 'Buat Folder Drive' : 'Create Folder',
                      execute: async (token) => {
                        await fetch('/api/workspace/drive', {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ name: newFolderName }),
                        });
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'id' ? 'Buat Folder Staging' : 'Create Staging Folder'}
                  </span>
                </button>
              </div>
              <div className="divide-y divide-[var(--egvox-border-default)] rounded-xl border border-[var(--egvox-border-default)]">
                {driveFiles.length === 0 ? (
                  <p className="p-4 text-xs text-[var(--egvox-text-muted)]">
                    {locale === 'id'
                      ? 'Belum ada file Drive dimuat. Klik Sinkronkan atau buat folder baru.'
                      : 'No Drive files loaded yet. Click Sync Now or create a staging folder.'}
                  </p>
                ) : (
                  driveFiles.map((f) => (
                    <div key={f.id} className="flex items-center justify-between gap-2 px-4 py-2.5 text-xs">
                      <span className="font-medium truncate min-w-0">{f.name}</span>
                      {f.webViewLink && (
                        <a
                          href={f.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#027F86] font-semibold shrink-0 ml-2"
                        >
                          {locale === 'id' ? 'Buka' : 'Open'}
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activePlugin === 'sheets' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newSheetTitle}
                  onChange={(e) => setNewSheetTitle(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPendingConfirm({
                      service: 'sheets',
                      title:
                        locale === 'id'
                          ? 'Buat Spreadsheet Dataset Manifest?'
                          : 'Create Dataset Manifest Spreadsheet?',
                      description:
                        locale === 'id'
                          ? `Spreadsheet "${newSheetTitle}" akan dibuat di Google Sheets Anda dengan tab Dataset_Manifest.`
                          : `Spreadsheet "${newSheetTitle}" will be created in your Google Sheets with a Dataset_Manifest tab.`,
                      actionLabel: locale === 'id' ? 'Buat Spreadsheet' : 'Create Spreadsheet',
                      execute: async (token) => {
                        await fetch('/api/workspace/sheets', {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ title: newSheetTitle }),
                        });
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'id' ? 'Buat Manifest Sheet' : 'Create Manifest Sheet'}
                  </span>
                </button>
              </div>
              <div className="divide-y divide-[var(--egvox-border-default)] rounded-xl border border-[var(--egvox-border-default)]">
                {sheetFiles.length === 0 ? (
                  <p className="p-4 text-xs text-[var(--egvox-text-muted)]">
                    {locale === 'id'
                      ? 'Belum ada spreadsheet ditemukan.'
                      : 'No spreadsheets found.'}
                  </p>
                ) : (
                  sheetFiles.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-2 px-4 py-2.5 text-xs">
                      <span className="font-medium truncate min-w-0">{s.name}</span>
                      {s.webViewLink && (
                        <a href={s.webViewLink} target="_blank" rel="noreferrer" className="text-[#027F86] font-semibold shrink-0">
                          {locale === 'id' ? 'Buka Sheet' : 'Open Sheet'}
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activePlugin === 'gmail' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] p-4 space-y-2.5">
                <p className="text-xs font-bold">
                  {locale === 'id'
                    ? 'Kirim Pembaruan Operasional via Gmail'
                    : 'Send Operational Update via Gmail'}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@company.com"
                    className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
                  />
                </div>
                <textarea
                  rows={2}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  disabled={!emailTo.trim()}
                  onClick={() =>
                    setPendingConfirm({
                      service: 'gmail',
                      title:
                        locale === 'id'
                          ? 'Kirim Email melalui Gmail?'
                          : 'Send Email via Gmail?',
                      description:
                        locale === 'id'
                          ? `Email dengan subjek "${emailSubject}" akan dikirim ke ${emailTo} atas nama akun Google Anda.`
                          : `An email with subject "${emailSubject}" will be sent to ${emailTo} from your connected Google account.`,
                      actionLabel: locale === 'id' ? 'Konfirmasi & Kirim' : 'Confirm & Send',
                      execute: async (token) => {
                        await fetch('/api/workspace/gmail', {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            to: emailTo,
                            subject: emailSubject,
                            message: emailBody,
                          }),
                        });
                      },
                    })
                  }
                  className="rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {locale === 'id' ? 'Kirim Email' : 'Send Email'}
                </button>
              </div>

              <div className="divide-y divide-[var(--egvox-border-default)] rounded-xl border border-[var(--egvox-border-default)]">
                {gmailMessages.length === 0 ? (
                  <p className="p-4 text-xs text-[var(--egvox-text-muted)]">
                    {locale === 'id'
                      ? 'Belum ada pesan Gmail dimuat.'
                      : 'No Gmail messages loaded.'}
                  </p>
                ) : (
                  gmailMessages.map((m) => (
                    <div key={m.id} className="p-3 text-xs">
                      <p className="font-semibold text-[var(--egvox-text-primary)]">{m.subject}</p>
                      <p className="text-[var(--egvox-text-muted)]">{m.from}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activePlugin === 'calendar' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPendingConfirm({
                      service: 'calendar',
                      title:
                        locale === 'id'
                          ? 'Jadwalkan Milestone di Google Calendar?'
                          : 'Schedule Milestone in Google Calendar?',
                      description:
                        locale === 'id'
                          ? `Acara "${newEventTitle}" akan ditambahkan ke kalender utama Google Anda untuk besok.`
                          : `Event "${newEventTitle}" will be added to your primary Google Calendar for tomorrow.`,
                      actionLabel: locale === 'id' ? 'Tambah ke Calendar' : 'Add to Calendar',
                      execute: async (token) => {
                        await fetch('/api/workspace/calendar', {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ summary: newEventTitle }),
                        });
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'id' ? 'Jadwalkan Milestone' : 'Schedule Milestone'}
                  </span>
                </button>
              </div>
              <div className="divide-y divide-[var(--egvox-border-default)] rounded-xl border border-[var(--egvox-border-default)]">
                {calendarEvents.length === 0 ? (
                  <p className="p-4 text-xs text-[var(--egvox-text-muted)]">
                    {locale === 'id'
                      ? 'Tidak ada agenda mendatang.'
                      : 'No upcoming events found.'}
                  </p>
                ) : (
                  calendarEvents.map((ev) => (
                    <div key={ev.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs">
                      <span className="font-medium min-w-0">{ev.summary}</span>
                      <span className="text-[var(--egvox-text-muted)] tabular-nums">
                        {ev.start?.dateTime || ev.start?.date || ''}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activePlugin === 'docs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPendingConfirm({
                      service: 'docs',
                      title:
                        locale === 'id'
                          ? 'Buat Dokumen SOP di Google Docs?'
                          : 'Create SOP Document in Google Docs?',
                      description:
                        locale === 'id'
                          ? `Dokumen baru "${newDocTitle}" akan dibuat di Google Docs Anda.`
                          : `A new document "${newDocTitle}" will be created in your Google Docs.`,
                      actionLabel: locale === 'id' ? 'Buat Google Doc' : 'Create Google Doc',
                      execute: async (token) => {
                        await fetch('/api/workspace/docs', {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ title: newDocTitle }),
                        });
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'id' ? 'Buat Dokumen SOP' : 'Create SOP Doc'}
                  </span>
                </button>
              </div>
              <div className="divide-y divide-[var(--egvox-border-default)] rounded-xl border border-[var(--egvox-border-default)]">
                {docFiles.length === 0 ? (
                  <p className="p-4 text-xs text-[var(--egvox-text-muted)]">
                    {locale === 'id'
                      ? 'Belum ada Google Docs ditemukan.'
                      : 'No Google Docs found.'}
                  </p>
                ) : (
                  docFiles.map((d) => (
                    <div key={d.id} className="flex items-center justify-between gap-2 px-4 py-2.5 text-xs">
                      <span className="font-medium truncate min-w-0">{d.name}</span>
                      {d.webViewLink && (
                        <a href={d.webViewLink} target="_blank" rel="noreferrer" className="text-[#027F86] font-semibold shrink-0">
                          {locale === 'id' ? 'Buka Doc' : 'Open Doc'}
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activePlugin === 'tasks' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--egvox-border-default)] bg-[var(--egvox-bg-canvas)] px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPendingConfirm({
                      service: 'tasks',
                      title:
                        locale === 'id'
                          ? 'Tambahkan Tugas ke Google Tasks?'
                          : 'Add Task to Google Tasks?',
                      description:
                        locale === 'id'
                          ? `Tugas "${newTaskTitle}" akan ditambahkan ke daftar Google Tasks default Anda.`
                          : `Task "${newTaskTitle}" will be added to your default Google Tasks list.`,
                      actionLabel: locale === 'id' ? 'Simpan Tugas' : 'Save Task',
                      execute: async (token) => {
                        await fetch('/api/workspace/tasks', {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ title: newTaskTitle }),
                        });
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#027F86] px-4 py-2 text-xs font-semibold text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{locale === 'id' ? 'Tambah Task' : 'Add Task'}</span>
                </button>
              </div>
              <div className="divide-y divide-[var(--egvox-border-default)] rounded-xl border border-[var(--egvox-border-default)]">
                {tasks.length === 0 ? (
                  <p className="p-4 text-xs text-[var(--egvox-text-muted)]">
                    {locale === 'id'
                      ? 'Belum ada tugas di Google Tasks.'
                      : 'No tasks in Google Tasks.'}
                  </p>
                ) : (
                  tasks.map((tk) => (
                    <div key={tk.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs">
                      <span className="font-medium min-w-0">{tk.title}</span>
                      <span className="text-[var(--egvox-text-muted)] shrink-0">
                        {tk.status === 'completed'
                          ? locale === 'id'
                            ? 'Selesai'
                            : 'Completed'
                          : locale === 'id'
                          ? 'Perlu Tindakan'
                          : 'Pending'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Explicit Confirmation Dialog before any Workspace Mutation */}
      <Modal
        open={!!pendingConfirm}
        onClose={() => setPendingConfirm(null)}
        title={pendingConfirm?.title || (locale === 'id' ? 'Konfirmasi Aksi' : 'Confirm Action')}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--egvox-text-secondary)]">
            {pendingConfirm?.description}
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingConfirm(null)}
              className="rounded-lg border border-[var(--egvox-border-default)] px-4 py-2 text-sm font-medium"
            >
              {locale === 'id' ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={confirmAndRun}
              disabled={loading}
              className="rounded-lg bg-[#027F86] px-4 py-2 text-sm font-semibold text-white hover:bg-[#039998]"
            >
              {loading
                ? locale === 'id'
                  ? 'Memproses...'
                  : 'Processing...'
                : pendingConfirm?.actionLabel || (locale === 'id' ? 'Konfirmasi' : 'Confirm')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
