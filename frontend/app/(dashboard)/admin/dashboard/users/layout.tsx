import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

import DashboardShell from "@/components/dashboard/shell";
import DashboardHeader from "@/components/dashboard/header";

export default async function AdminDashboardUsersLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/admin/dashboard/users");
   }

   if (user.response.role !== "admin") {
      redirect("/unauthorized");
   }

   return (
      <DashboardShell>
         <DashboardHeader heading="Users" text="Create and manage users." />
         <div className="flex flex-col">{children}</div>
      </DashboardShell>
   );
}
