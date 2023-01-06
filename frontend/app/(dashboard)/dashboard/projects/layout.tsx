import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardProjectsLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (!user) {
      redirect("/login?redirect=/dashboard/projects");
   }

   return (
      <DashboardShell>
         <DashboardHeader heading="Projects" text="TODO..." />
         <div className="flex flex-col">{children}</div>
      </DashboardShell>
   );
}
