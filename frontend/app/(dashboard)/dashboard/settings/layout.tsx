import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function SettingsPage({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage account and website settings." />
      {children}
    </DashboardShell>
  );
}
