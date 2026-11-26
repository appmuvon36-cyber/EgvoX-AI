import { notFound } from 'next/navigation';
import { ProjectCatalogView } from '@/apps/web/marketplace/ProjectCatalogView';
import { ACTIVITY_CATEGORIES } from '@/lib/catalog-data';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = ACTIVITY_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();
  return <ProjectCatalogView initialCategory={category.slug} />;
}
