import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function AdminDashboardClustersPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/admin/dashboard/clusters");
   }

   if (user.response.role !== "admin") {
      redirect("/unauthorized");
   }

   return null;
}
