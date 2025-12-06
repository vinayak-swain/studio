import { DashboardLayout } from '@/components/repository/dashboard-layout';

export default function NewRepositoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
