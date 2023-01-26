import { CreateButton } from "@/components/dashboard/create-button";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardTeamsPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/teams");
   }

   return (
      <DashboardShell>
         <DashboardHeader heading="Teams" text="Create and manage teams.">
            <CreateButton title="New team" />
         </DashboardHeader>
         <div className="flex flex-col">
            <EmptyPlaceholder>
               <EmptyPlaceholder.Icon name="users" />
               <EmptyPlaceholder.Title>No teams created</EmptyPlaceholder.Title>
               <EmptyPlaceholder.Description>
                  You haven&apos;t been assigned to a team yet. Start creating one.
               </EmptyPlaceholder.Description>
            </EmptyPlaceholder>
         </div>
      </DashboardShell>
   );
}
