import { redirect } from "next/navigation";
import { cache } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { DiagramCreateButton } from "@/components/dashboard/diagram-create-button";
import { DashboardShell } from "@/components/dashboard/shell";
import { DiagramItem } from "@/components/dashboard/diagram-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { getSession, getDiagram } from "@/lib/auth-server";
import { Diagram } from "types";

export default async function DiagramPage({ params: { diagramId } }: { params: { diagramId: string } }) {
   const user = await getSession();

   if (!user) {
      redirect("/login?redirect=/dashboard");
   }

   const diagram: Diagram = await getDiagram(diagramId).catch((err) => {
      console.error(err);
      return null;
   });

   if (!diagram) {
      return (
         <div>
            <div>Diagram not found</div>
            <div>
               Go back to <a href="/dashboard">Dashboard</a>
            </div>
         </div>
      );
   }

   return (
      <div>
         <div>Diagram Id: {diagramId}</div>
         <div>{JSON.stringify(diagram)}</div>
      </div>
   );
}
