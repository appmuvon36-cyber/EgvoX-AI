import { DataOpsPortal } from '@/apps/operations/data-operations/DataOpsPortal';

export default function DataOpsLoginPage() {
  return <DataOpsPortal initialModule="dashboard" forceLoginScreen />;
}
