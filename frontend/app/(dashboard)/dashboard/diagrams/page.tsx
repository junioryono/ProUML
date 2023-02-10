import { redirect } from "next/navigation";
import { getSession, getDiagrams } from "@/lib/auth-server";

import DashboardShell from "@/components/dashboard/shell";
import DiagramsHeader from "@/components/dashboard/diagrams/header";
import DiagramItem from "@/components/dashboard/diagrams/diagram-item";
import ProjectItem from "@/components/dashboard/diagrams/project-item";
import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";
import NewDiagram from "@/components/dashboard/diagrams/new-diagram";

export default async function DashboardDiagramsPage() {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/diagrams");
   }

   const diagramsRequest = await getDiagrams();
   const showEmptyPlaceholder =
      !diagramsRequest.success || (!diagramsRequest.response.diagrams.length && !diagramsRequest.response.projects.length);

   return (
      <DashboardShell>
         <DiagramsHeader
            diagramsLength={
               !diagramsRequest.success
                  ? 0
                  : Math.max(diagramsRequest.response.diagrams.length, diagramsRequest.response.projects.length)
            }
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
                  {diagramsRequest.response.projects.map((project) => (
                     <ProjectItem key={project.id} project={project} />
                  ))}
                  {diagramsRequest.response.diagrams.map((diagram) => (
                     <DiagramItem key={diagram.id} diagram={diagram} />
                  ))}
               </div>
            )}
         </div>
      </DashboardShell>
   );
}
