import { ProjectCatalogView } from '@/apps/web/marketplace/ProjectCatalogView';

export default async function MarketplaceProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  return <ProjectCatalogView initialQuery={sp.q || ''} />;
}
