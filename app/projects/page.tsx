import { ProjectCatalogView } from '@/apps/web/marketplace/ProjectCatalogView';

export default async function ProjectsAliasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  return <ProjectCatalogView initialQuery={sp.q || ''} />;
}
