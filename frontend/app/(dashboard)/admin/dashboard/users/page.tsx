import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { UserCreateButton } from "@/components/admin/dashboard/user-create-button";
import { DashboardShell } from "@/components/dashboard/shell";
import { UserItem } from "@/components/admin/dashboard/user-item";
import { EmptyPlaceholder } from "@/components/admin/dashboard/empty-placeholder";
import { getSession } from "@/lib/auth-server";

export default async function AdminUsersDashboardPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/admin/dashboard/users");
   }

   const diagrams = null;

   console.log("diagrams", diagrams);

   return (
      <DashboardShell>
         <DashboardHeader heading="Users" text="Create and manage users.">
            <UserCreateButton />
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
                  <EmptyPlaceholder.Title>No users created</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                     You don&apos;t have any users yet. Start creating one.
                  </EmptyPlaceholder.Description>
                  <UserCreateButton className="border-slate-200 bg-white text-brand-900 hover:bg-slate-100 focus:outline-none" />
               </EmptyPlaceholder>
            )}
         </div>
      </DashboardShell>
   );
}
