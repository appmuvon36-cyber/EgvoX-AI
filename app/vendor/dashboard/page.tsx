import { WorkspaceShell } from '@/apps/web/workspace/WorkspaceShell';

export default async function VendorDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  return (
    <WorkspaceShell
      key={`vendor-${sp.tab || 'overview'}`}
      initialTab={sp.tab}
      initialRole="vendor"
    />
  );
}
