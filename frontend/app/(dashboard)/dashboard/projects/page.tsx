import { CreateButton } from "@/components/dashboard/create-button";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardProjectsPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/projects");
   }

   return (
      <EmptyPlaceholder>
         <EmptyPlaceholder.Icon name="fileImage" />
         <EmptyPlaceholder.Title>No projects created</EmptyPlaceholder.Title>
         <EmptyPlaceholder.Description>
            You haven&apos;t created any projects yet. Start creating one.
         </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
   );
}
