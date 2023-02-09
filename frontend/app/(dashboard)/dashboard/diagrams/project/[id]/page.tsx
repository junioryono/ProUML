import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { DiagramsHeader } from "@/components/dashboard/diagrams/header";
import { DiagramItem } from "@/components/dashboard/diagrams/diagram-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { NewDiagram } from "@/components/dashboard/diagrams/new-diagram";
import { getSession, getProject } from "@/lib/auth-server";
import { ProjectItem } from "@/components/dashboard/projects/project-item";

export default async function DashboardDiagramsProjectPage({ params: { id } }: { params: { id: string } }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/diagrams");
   }

   const projectRequest = await getProject(id);
   const showEmptyPlaceholder = !projectRequest.success || !projectRequest.response.diagrams.length;

   return (
      <DashboardShell>
         <DiagramsHeader
            diagramsLength={!projectRequest.success ? 0 : projectRequest.response.diagrams.length}
            showEmptyPlaceholder={showEmptyPlaceholder}
            project={projectRequest.response}
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
                  {projectRequest.response.diagrams.map((diagram) => (
                     <DiagramItem key={diagram.id} diagram={diagram} project={projectRequest.response} />
                  ))}
               </div>
            )}
         </div>
      </DashboardShell>
   );
}
