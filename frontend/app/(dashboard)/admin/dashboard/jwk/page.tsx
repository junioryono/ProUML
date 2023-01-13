import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function AdminDashboardJWKPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/admin/dashboard/jwk");
   }

   if (user.response.role !== "admin") {
      redirect("/unauthorized");
   }

   return null;
}
