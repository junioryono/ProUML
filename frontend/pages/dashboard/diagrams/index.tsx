import { getDiagrams, getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { Diagram, Project, User } from "types";
import { useState } from "react";

import DashboardShell from "@/components/dashboard/shell";
import DiagramsHeader from "@/components/dashboard/diagrams/header";
import DiagramItem from "@/components/dashboard/diagrams/diagram-item";
import ProjectItem from "@/components/dashboard/diagrams/project-item";
import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";
import NewDiagram from "@/components/dashboard/diagrams/new-diagram";
import DashboardLayout from "@/components/dashboard/layout";

export default function DashboardDiagramsPage({
   user,
   diagramsRequest,
}: {
   user: User;
   diagramsRequest: Awaited<ReturnType<typeof getDiagrams>>;
}) {
   const showEmptyPlaceholder =
      !diagramsRequest.success || (!diagramsRequest.response.diagrams.length && !diagramsRequest.response.projects.length);

   const [selectingItems, setSelectingItems] = useState(false);

   // selected items which can consist of diagrams and projects
   const [selectedItems, setSelectedItems] = useState<(Diagram | Project)[]>([]);

   return (
      <DashboardLayout user={user}>
         <DashboardShell>
            <DiagramsHeader
               userId={user.user_id}
               diagramsLength={
                  !diagramsRequest.success
                     ? 0
                     : Math.max(diagramsRequest.response.diagrams.length, diagramsRequest.response.projects.length)
               }
               showEmptyPlaceholder={showEmptyPlaceholder}
               selectingItems={selectingItems}
               setSelectingItems={setSelectingItems}
               selectedItems={selectedItems}
               setSelectedItems={setSelectedItems}
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
                  <>
                     {diagramsRequest.response.projects.length > 0 && (
                        <div className="flex flex-wrap select-none">
                           {diagramsRequest.response.projects.map((project) => (
                              <ProjectItem
                                 user={user}
                                 key={project.id}
                                 project={project}
                                 selectable={selectingItems}
                                 selectedItems={selectedItems}
                                 setSelectedItems={setSelectedItems}
                              />
                           ))}
                        </div>
                     )}
                     {diagramsRequest.response.diagrams.length > 0 && (
                        <div className="flex flex-wrap select-none">
                           {diagramsRequest.response.diagrams.map((diagram) => (
                              <DiagramItem
                                 key={diagram.id}
                                 diagram={diagram}
                                 userId={user.user_id}
                                 selectable={selectingItems}
                                 selectedItems={selectedItems}
                                 setSelectedItems={setSelectedItems}
                              />
                           ))}
                        </div>
                     )}
                  </>
               )}
            </div>
         </DashboardShell>
      </DashboardLayout>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const cookies = ctx.req.headers.cookie;

   const [userRequest, diagramsRequest] = await Promise.all([
      getSession({
         headers: {
            cookie: cookies,
         },
      }),
      getDiagrams({
         headers: {
            cookie: cookies,
         },
      }),
   ]);

   if (!userRequest.success) {
      return {
         redirect: {
            destination: "/login?redirect=/dashboard/diagrams",
            permanent: false,
         },
      };
   }

   if (userRequest.cookie) {
      ctx.res.setHeader("set-cookie", userRequest.cookie);
   } else if (diagramsRequest.cookie) {
      ctx.res.setHeader("set-cookie", diagramsRequest.cookie);
   }

   return {
      props: {
         user: userRequest.response || null,
         diagramsRequest: diagramsRequest,
      },
   };
};
