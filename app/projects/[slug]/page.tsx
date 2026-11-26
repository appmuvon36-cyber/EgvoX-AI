import { notFound } from 'next/navigation';
import { ProjectDetailView } from '@/apps/web/marketplace/ProjectDetailView';
import { PROJECT_LISTINGS } from '@/lib/catalog-data';

export default async function ProjectDetailAliasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECT_LISTINGS.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectDetailView project={project} />;
}
