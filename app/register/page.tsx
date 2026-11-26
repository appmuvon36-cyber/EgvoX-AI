import { RegisterView } from '@/apps/web/marketplace/AuthViews';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const sp = await searchParams;
  return <RegisterView initialType={sp.type} />;
}
