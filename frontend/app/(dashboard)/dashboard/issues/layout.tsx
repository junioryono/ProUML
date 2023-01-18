import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardIssuesLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/issues");
   }

   return (
      <DashboardShell>
         <DashboardHeader heading="Issues" text="Manage issues assigned to you." />
         <div className="flex flex-col">{children}</div>
      </DashboardShell>
   );
}
