import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { CreateButton } from "@/components/dashboard/create-button";

export default async function DashboardProjectsLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/projects");
   }

   return (
      <DashboardShell>
         <DashboardHeader heading="Projects" text="Create and manage projects.">
            <CreateButton title="New project" />
         </DashboardHeader>
         <div className="flex flex-col">{children}</div>
      </DashboardShell>
   );
}
