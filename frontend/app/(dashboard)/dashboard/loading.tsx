import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DiagramCreateButton } from "@/components/dashboard/diagram-create-button";
import { DiagramItem } from "@/components/dashboard/diagram-item";

export default function DashboardLoading() {
   return (
      <DashboardShell>
         <DashboardHeader heading="Diagrams" text="Create and manage diagrams.">
            <DiagramCreateButton />
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
