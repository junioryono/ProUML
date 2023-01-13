import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function AdminDashboardUsersPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/admin/dashboard/users");
   }

   if (user.response.role !== "admin") {
      redirect("/unauthorized");
   }

   return null;
}
