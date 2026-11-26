import { notFound } from 'next/navigation';
import { FreelancerProfileView } from '@/apps/web/marketplace/ProfileViews';
import { FREELANCER_SERVICES } from '@/lib/catalog-data';

export default async function FreelancerProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const primaryService = FREELANCER_SERVICES.find(
    (s) => s.username === username
  );
  if (!primaryService) notFound();
  return <FreelancerProfileView primaryService={primaryService} />;
}
