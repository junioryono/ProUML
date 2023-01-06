import { DiagramItem } from "@/components/dashboard/diagrams/diagram-item";

export default function DashboardIssuesLoading() {
   return (
      <>
         <DiagramItem.Skeleton />
         <DiagramItem.Skeleton />
         <DiagramItem.Skeleton />
         <DiagramItem.Skeleton />
         <DiagramItem.Skeleton />
      </>
   );
}
