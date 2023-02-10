import DashboardShell from "@/components/dashboard/shell";
import DiagramItemSkeleton from "@/components/dashboard/diagrams/diagram-item-skeleton";
import DashboardHeader from "@/components/dashboard/header";
import CreateButton from "@/components/dashboard/create-button";

export default function DashboardDiagramsLoading() {
   return (
      <DashboardShell>
         <DashboardHeader heading="Projects" text="Create and manage projects.">
            <CreateButton title="New project" />
         </DashboardHeader>
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
