import { DiagramItem } from "@/components/dashboard/diagrams/diagram-item";

export default function DashboardProjectsLoading() {
   return (
      <>
         <DiagramItemSkeleton />
         <DiagramItemSkeleton />
         <DiagramItemSkeleton />
         <DiagramItemSkeleton />
         <DiagramItemSkeleton />
      </>
   );
}
