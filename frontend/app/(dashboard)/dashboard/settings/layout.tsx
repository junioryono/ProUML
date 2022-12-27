import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function SettingsPage({ children }: { children: React.ReactNode }) {
  const user = getSession();

  if (!user) {
    redirect("/login?redirect=/dashboard/settings");
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage account and website settings." />
      {children}
    </DashboardShell>
  );
}
