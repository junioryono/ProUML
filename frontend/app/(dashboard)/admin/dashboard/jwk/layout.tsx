import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

import DashboardShell from "@/components/dashboard/shell";
import DashboardHeader from "@/components/dashboard/header";

export default async function AdminDashboardJWKLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/admin/dashboard/jwk");
   }

   if (user.response.role !== "admin") {
      redirect("/unauthorized");
   }

   return (
      <DashboardShell>
         <DashboardHeader heading="JWK" text="Create and manage JWTs." />
         <div className="flex flex-col">{children}</div>
      </DashboardShell>
   );
}
