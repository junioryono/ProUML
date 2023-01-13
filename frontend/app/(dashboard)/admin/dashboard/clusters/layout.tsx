import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function AdminDashboardClustersLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/admin/dashboard/clusters");
   }

   if (user.response.role !== "admin") {
      redirect("/unauthorized");
   }

   return (
      <DashboardShell>
         <DashboardHeader heading="Clusters" text="Create and manage clusters." />
         <div className="flex flex-col">{children}</div>
      </DashboardShell>
   );
}
