import { notFound } from 'next/navigation';
import { ServiceDetailView } from '@/apps/web/marketplace/ServiceDetailView';
import { FREELANCER_SERVICES } from '@/lib/catalog-data';

export default async function MarketplaceServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = FREELANCER_SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();
  return <ServiceDetailView service={service} />;
}
