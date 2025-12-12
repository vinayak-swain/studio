import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { SettingsSidebarNav } from '@/components/settings/settings-sidebar-nav';
import { Separator } from '@/components/ui/separator';

const sidebarNavItems = [
  {
    title: 'Public profile',
    href: '/settings',
  },
  {
    title: 'Account',
    href: '/settings/account',
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
  },
  {
    title: 'Accessibility',
    href: '/settings/accessibility',
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SettingsSidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
