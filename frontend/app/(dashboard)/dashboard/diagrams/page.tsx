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

   if (!user) {
      redirect("/login?redirect=/dashboard/diagrams");
   }

   const diagrams: Diagram[] = await getDiagrams().catch((err) => {
      console.error(err);
      return null;
   });

   console.log("diagrams", diagrams);

   return (
      <DashboardShell>
         <DiagramsHeader diagramsLength={!diagrams ? 0 : diagrams.length} />
         <div className="flex flex-col">
            {!diagrams || !diagrams.length ? (
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
                  {diagrams.map((diagram) => (
                     <DiagramItem key={diagram.id} diagram={diagram} />
                  ))}
               </div>
            )}
         </div>
      </DashboardShell>
   );
}
