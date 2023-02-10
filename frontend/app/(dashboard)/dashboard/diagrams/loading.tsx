import DashboardShell from "@/components/dashboard/shell";
import DiagramsHeader from "@/components/dashboard/diagrams/header";
import DiagramItemSkeleton from "@/components/dashboard/diagrams/diagram-item-skeleton";

export default function DashboardDiagramsLoading() {
   return (
      <DashboardShell>
         <DiagramsHeader diagramsLength={0} showEmptyPlaceholder={true} />
         <div className="divide-y divide-neutral-200 rounded-md border border-slate-200">
            <DiagramItemSkeleton />
            <DiagramItemSkeleton />
            <DiagramItemSkeleton />
            <DiagramItemSkeleton />
            <DiagramItemSkeleton />
         </div>
      </DashboardShell>
   );
}
