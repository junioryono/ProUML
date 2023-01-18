import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardTeamsPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/teams");
   }

   return (
      <EmptyPlaceholder>
         <EmptyPlaceholder.Icon name="users" />
         <EmptyPlaceholder.Title>No teams created</EmptyPlaceholder.Title>
         <EmptyPlaceholder.Description>
            You haven&apos;t been assigned to a team yet. Start creating one.
         </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
   );
}
