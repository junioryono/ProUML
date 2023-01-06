import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardTeamsPage() {
   const user = await getSession();

   if (!user) {
      redirect("/login?redirect=/dashboard/teams");
   }

   return null;
}
