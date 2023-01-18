import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { CreateButton } from "@/components/dashboard/create-button";

export default async function DashboardTeamsLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/teams");
   }

   return (
      <DashboardShell>
         <DashboardHeader heading="Teams" text="Create and manage teams.">
            <CreateButton title="New team" />
         </DashboardHeader>
         <div className="flex flex-col">{children}</div>
      </DashboardShell>
   );
}
