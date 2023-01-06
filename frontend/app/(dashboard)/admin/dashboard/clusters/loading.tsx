import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { ClusterCreateButton } from "@/components/admin/dashboard/cluster-create-button";
import { DiagramItem } from "@/components/dashboard/diagrams/diagram-item";

export default function AdminDashboardLoading() {
   return (
      <DashboardShell>
         <DashboardHeader heading="Clusters" text="Create and manage clusters.">
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
