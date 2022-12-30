import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { ClusterCreateButton } from "@/components/admin/dashboard/cluster-create-button";
import { DiagramItem } from "@/components/dashboard/diagram-item";

export default function AdminDashboardLoading() {
   return (
      <DashboardShell>
         <DashboardHeader heading="JWK" text="Create and manage JWTs.">
            <ClusterCreateButton />
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
