
import { DashboardLayout } from '@/components/repository/dashboard-layout';

export default function EditProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
