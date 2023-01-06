import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardTeamsLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (!user) {
      redirect("/login?redirect=/dashboard/teams");
   }

   return (
      <DashboardShell>
         <DashboardHeader heading="Teams" text="TODO..." />
         <div className="flex flex-col">{children}</div>
      </DashboardShell>
   );
}
