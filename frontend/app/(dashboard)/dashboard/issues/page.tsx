import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardIssuesPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/issues");
   }

   return (
      <EmptyPlaceholder>
         <EmptyPlaceholder.Icon name="bug" />
         <EmptyPlaceholder.Title>No issues created</EmptyPlaceholder.Title>
         <EmptyPlaceholder.Description>There are no issues assigned to you.</EmptyPlaceholder.Description>
      </EmptyPlaceholder>
   );
}
