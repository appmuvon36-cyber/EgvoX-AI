import { WorkspaceShell } from '@/apps/web/workspace/WorkspaceShell';

export default async function EnterpriseDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  return (
    <WorkspaceShell
      key={`enterprise-${sp.tab || 'overview'}`}
      initialTab={sp.tab}
      initialRole="enterprise"
    />
  );
}
