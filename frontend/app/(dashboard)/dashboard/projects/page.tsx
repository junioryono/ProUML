import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardProjectsPage() {
   const user = await getSession();

   if (!user) {
      redirect("/login?redirect=/dashboard/projects");
   }

   return null;
}
