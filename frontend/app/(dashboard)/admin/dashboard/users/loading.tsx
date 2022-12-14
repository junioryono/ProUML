import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { UserCreateButton } from "@/components/admin/dashboard/user-create-button";
import { DiagramItem } from "@/components/dashboard/diagrams/diagram-item";

export default function AdminDashboardLoading() {
   return (
      <DashboardShell>
         <DashboardHeader heading="Users" text="Create and manage users.">
            <UserCreateButton />
         </DashboardHeader>
         <div className="divide-y divide-neutral-200 rounded-md border border-slate-200">
            <DiagramItem.Skeleton />
            <DiagramItem.Skeleton />
            <DiagramItem.Skeleton />
            <DiagramItem.Skeleton />
            <DiagramItem.Skeleton />
         </div>
      </DashboardShell>
   );
}
