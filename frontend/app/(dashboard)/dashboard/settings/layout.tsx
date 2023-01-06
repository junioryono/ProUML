import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function SettingsPage({ children }: { children: React.ReactNode }) {
   // Don't need to check if user is authenticated here
   // We already check in the previous layout.tsx

   return (
      <DashboardShell>
         <DashboardHeader heading="Settings" text="Manage account and website settings." />
         {children}
      </DashboardShell>
   );
}
