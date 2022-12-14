import { redirect } from "next/navigation";
import { cache } from "react";

import { DashboardShell } from "@/components/dashboard/shell";
import { DiagramsHeader } from "@/components/dashboard/diagrams/header";
import { DiagramItem } from "@/components/dashboard/diagrams/diagram-item";
import { EmptyPlaceholder } from "@/components/dashboard/diagrams/empty-placeholder";
import { NewDiagram } from "@/components/dashboard/diagrams/new-diagram";
import { getSession, getDiagrams } from "@/lib/auth-server";
import { Diagram } from "types";

export default async function DashboardDiagramsPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/diagrams");
   }

   const diagramsRequest = await getDiagrams();

   console.log("diagrams", diagramsRequest);

   const showEmptyPlaceholder = !diagramsRequest.success || !diagramsRequest.response.length;

   return (
      <DashboardShell>
         <DiagramsHeader
            diagramsLength={!diagramsRequest.success ? 0 : diagramsRequest.response.length}
            showEmptyPlaceholder={showEmptyPlaceholder}
         />
         <div className="flex flex-col">
            {showEmptyPlaceholder ? (
               <>
                  <NewDiagram />
                  <EmptyPlaceholder>
                     <EmptyPlaceholder.Icon name="post" />
                     <EmptyPlaceholder.Title>No diagrams created</EmptyPlaceholder.Title>
                     <EmptyPlaceholder.Description>
                        You don&apos;t have any diagrams yet. Start creating one.
                     </EmptyPlaceholder.Description>
                  </EmptyPlaceholder>
               </>
            ) : (
               <div className="flex flex-wrap select-none">
                  {diagramsRequest.response.map((diagram) => (
                     <DiagramItem key={diagram.id} diagram={diagram} />
                  ))}
               </div>
            )}
         </div>
      </DashboardShell>
   );
}
