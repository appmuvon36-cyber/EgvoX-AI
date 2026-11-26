import { WorkspaceShell } from '@/apps/web/workspace/WorkspaceShell';

export default async function FreelancerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  return (
    <WorkspaceShell
      key={`freelancer-${sp.tab || 'overview'}`}
      initialTab={sp.tab}
      initialRole="freelancer"
    />
  );
}
