import { notFound } from 'next/navigation';
import { ProviderProfileView } from '@/apps/web/marketplace/ProfileViews';
import { VENDOR_ORGANIZATIONS } from '@/lib/catalog-data';

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = VENDOR_ORGANIZATIONS.find((v) => v.slug === slug);
  if (!provider) notFound();
  return <ProviderProfileView provider={provider} />;
}
