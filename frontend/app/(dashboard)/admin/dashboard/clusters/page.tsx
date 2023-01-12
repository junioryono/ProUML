import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { ClusterCreateButton } from "@/components/admin/dashboard/cluster-create-button";
import { DashboardShell } from "@/components/dashboard/shell";
import { UserItem } from "@/components/admin/dashboard/user-item";
import { EmptyPlaceholder } from "@/components/admin/dashboard/empty-placeholder";
import { getSession } from "@/lib/auth-server";

export default async function AdminClustersDashboardPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/admin/dashboard/clusters");
   }

   const diagrams = null;

   console.log("diagrams", diagrams);

   return (
      <DashboardShell>
         <DashboardHeader heading="Clusters" text="Create and manage clusters.">
            <ClusterCreateButton />
         </DashboardHeader>
         <div>
            {diagrams?.length ? (
               <div className="divide-y divide-neutral-200 rounded-md border border-slate-200">
                  {diagrams.map((diagram) => (
                     <UserItem key={diagram.id} diagram={diagram} />
                  ))}
               </div>
            ) : (
               <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="post" />
                  <EmptyPlaceholder.Title>No active clusters</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                     You don&apos;t have any clusters yet. Start creating one.
                  </EmptyPlaceholder.Description>
                  <ClusterCreateButton className="border-slate-200 bg-white text-brand-900 hover:bg-slate-100 focus:outline-none" />
               </EmptyPlaceholder>
            )}
         </div>
      </DashboardShell>
   );
}
