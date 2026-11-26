import { WorkspaceShell } from '@/apps/web/workspace/WorkspaceShell';

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; role?: string }>;
}) {
  const sp = await searchParams;
  return (
    <WorkspaceShell
      key={`${sp.tab || 'overview'}-${sp.role || 'freelancer'}`}
      initialTab={sp.tab}
      initialRole={sp.role}
    />
  );
}
