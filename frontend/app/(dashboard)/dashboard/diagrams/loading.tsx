import { DashboardShell } from "@/components/dashboard/shell";
import { DiagramsHeader } from "@/components/dashboard/diagrams/header";
import { DiagramItem } from "@/components/dashboard/diagrams/diagram-item";

export default function DashboardDiagramsLoading() {
   return (
      <DashboardShell>
         <DiagramsHeader diagramsLength={0} />
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
